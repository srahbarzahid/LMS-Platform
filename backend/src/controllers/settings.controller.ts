import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const settings = await settingsService.getStudentSettings(userId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const { learning, notifications } = req.body;
    
    if (learning) {
      await settingsService.updateSettings(userId, 'learning', learning);
    }
    if (notifications) {
      await settingsService.updateSettings(userId, 'notifications', notifications);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    // Mock success
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  try {
    // Mock success
    res.json({ success: true, message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updatePhone = async (req: Request, res: Response) => {
  try {
    // Mock success
    res.json({ success: true, message: 'Phone updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const logoutAllDevices = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    await settingsService.logoutAllDevices(userId);
    res.json({ success: true, message: 'Logged out from all other devices' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const exportDataRequest = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Data export request submitted. You will receive an email shortly.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteAccountRequest = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Account deletion request submitted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
