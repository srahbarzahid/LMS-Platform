import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const notifications = await notificationService.getStudentNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const { id } = req.params;
    const notification = await notificationService.markAsRead(userId, id as string);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const result = await notificationService.markAllAsRead(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || 'mock';
    const { id } = req.params;
    const result = await notificationService.deleteNotification(userId, id as string);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
