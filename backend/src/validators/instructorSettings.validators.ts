import { Request, Response, NextFunction } from 'express';

export const validateInstructorProfile = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, designation, bio } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    res.status(400).json({ status: 'error', message: 'Full name cannot be empty.' });
    return;
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
      return;
    }
  }

  if (designation !== undefined && typeof designation !== 'string') {
    res.status(400).json({ status: 'error', message: 'Designation must be a valid text string.' });
    return;
  }

  if (bio !== undefined && typeof bio !== 'string') {
    res.status(400).json({ status: 'error', message: 'Bio must be a valid text string.' });
    return;
  }

  next();
};

export const validatePasswordChange = (req: Request, res: Response, next: NextFunction): void => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || typeof currentPassword !== 'string') {
    res.status(400).json({ status: 'error', message: 'Current password is required.' });
    return;
  }

  if (!newPassword || typeof newPassword !== 'string') {
    res.status(400).json({ status: 'error', message: 'New password is required.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ status: 'error', message: 'New password must be at least 8 characters long.' });
    return;
  }

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    res.status(400).json({ 
      status: 'error', 
      message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ status: 'error', message: 'New password and confirm password do not match.' });
    return;
  }

  next();
};

export const validateInstructorNotifications = (req: Request, res: Response, next: NextFunction): void => {
  const { notificationPreferences } = req.body;
  if (!notificationPreferences || typeof notificationPreferences !== 'object') {
    res.status(400).json({ status: 'error', message: 'Notification preferences must be a valid JSON object.' });
    return;
  }
  next();
};

export const validateInstructorPreferences = (req: Request, res: Response, next: NextFunction): void => {
  const { preferredLanguage, theme } = req.body;

  if (theme && !['Light', 'Dark', 'System'].includes(theme)) {
    res.status(400).json({ status: 'error', message: 'Theme must be one of: Light, Dark, System.' });
    return;
  }

  if (preferredLanguage && typeof preferredLanguage !== 'string') {
    res.status(400).json({ status: 'error', message: 'Preferred language must be a valid string.' });
    return;
  }

  next();
};

export const validateDeactivateAccount = (req: Request, res: Response, next: NextFunction): void => {
  const { confirmPassword } = req.body;
  if (!confirmPassword || typeof confirmPassword !== 'string') {
    res.status(400).json({ status: 'error', message: 'Password confirmation is required to deactivate account.' });
    return;
  }
  next();
};
