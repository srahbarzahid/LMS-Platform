"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatar = exports.updateProfile = exports.getProfile = void 0;
const profileService = __importStar(require("../services/profile.service"));
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId || 'mock';
        const profileData = await profileService.getStudentProfile(userId);
        res.json(profileData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId || 'mock';
        const profile = await profileService.updateStudentProfile(userId, req.body);
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateProfile = updateProfile;
const updateAvatar = async (req, res) => {
    try {
        const userId = req.user?.userId || 'mock';
        let avatarUrl = null;
        if (req.file) {
            avatarUrl = `/uploads/${req.file.filename}`;
        }
        if (!avatarUrl) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const profile = await profileService.uploadAvatar(userId, avatarUrl);
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateAvatar = updateAvatar;
