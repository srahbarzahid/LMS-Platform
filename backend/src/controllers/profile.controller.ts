import { Request, Response } from 'express';
import * as profileService from '../services/profile.service';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const profileData = await profileService.getStudentProfile(userId);
    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const profile = await profileService.updateStudentProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
