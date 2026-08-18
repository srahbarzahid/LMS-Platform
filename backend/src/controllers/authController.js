import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

// Helper function to generate JWT Access and Refresh Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "supersecretlmskey123",
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET || "supersecretlmsrefreshkey123",
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Helper function to strip sensitive data
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

/**
 * @desc    Register a new user (Student / Instructor / Admin)
 * @route   POST /api/auth/register
 * @access  Public
 */

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists in MySQL
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    // Encrypt password using Bcrypt with 12 salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Default role assignment
    const userRole = role && ["STUDENT", "INSTRUCTOR", "ADMIN"].includes(role.toUpperCase())
      ? role.toUpperCase()
      : "STUDENT";

    // Create user record in MySQL
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        password: hashedPassword,
        role: userRole,
        isEmailVerified: true,
        settings: {
          create: {
            preferredLanguage: "English",
            theme: "System",
            accountVisibility: "Public",
          },
        },
        notificationPrefs: {
          create: {
            courseUpdates: true,
            assignmentNotifications: true,
            quizNotifications: true,
            projectNotifications: true,
            certificateNotifications: true,
            paymentNotifications: true,
          },
        },
      },
      include: {
        settings: true,
        notificationPrefs: true,
      },
    });

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set secure HTTP-Only refreshToken cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User account created successfully",
      token: accessToken,
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during registration" });
  }
};

/**
 * @desc    Authenticate user & get JWT Token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user in MySQL database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check account status
    if (user.isDeactivated) {
      return res.status(403).json({ success: false, message: "Account has been deactivated. Please contact support." });
    }

    // Verify encrypted password with bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate fresh JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Log security session
    try {
      const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
      const userAgent = req.headers["user-agent"] || "Browser";

      await prisma.securitySession.create({
        data: {
          userId: user.id,
          device: userAgent.slice(0, 100),
          browser: userAgent.includes("Firefox") ? "Firefox" : userAgent.includes("Safari") ? "Safari" : "Chrome",
          location: "Local Machine",
          ipAddress: String(ipAddress).slice(0, 50),
          isCurrent: true,
        },
      });
    } catch (sessionErr) {
      console.warn("Security session logging skipped:", sessionErr.message);
    }

    // Set secure HTTP-Only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Logged in successfully",
      token: accessToken,
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during login" });
  }
};

/**
 * @desc    Refresh access token using refreshToken cookie
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "supersecretlmsrefreshkey123");

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.isDeactivated) {
      return res.status(401).json({ success: false, message: "User account unavailable" });
    }

    const tokens = generateTokens(user);

    return res.json({
      success: true,
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const me = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
        notificationPrefs: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Auth me Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc    Logout user and clear security tokens
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};
