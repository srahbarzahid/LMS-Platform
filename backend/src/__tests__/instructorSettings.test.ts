import { describe, it, expect } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import instructorSettingsRoutes from '../routes/instructorSettings.routes';
import adminSettingsRoutes from '../routes/adminSettings.routes';

const app = express();
app.use(express.json());
app.use('/api/instructor/settings', instructorSettingsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_SECRET = JWT_SECRET;

const generateToken = (role: string = 'INSTRUCTOR') => {
  return jwt.sign({ userId: 'test-instructor-id', role }, JWT_SECRET);
};

describe('Instructor Settings API Endpoints', () => {
  const instructorToken = generateToken('INSTRUCTOR');
  const adminToken = generateToken('ADMIN');

  describe('Authentication & Role Protection', () => {
    it('should reject unauthenticated requests to instructor settings', async () => {
      const res = await request(app).get('/api/instructor/settings/profile');
      expect(res.status).toBe(401);
    });

    it('should allow instructor access to instructor profile', async () => {
      const res = await request(app)
        .get('/api/instructor/settings/profile')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('integration test: confirming an instructor CANNOT access admin platform settings (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/admin/settings/platform')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Forbidden');
    });
  });

  describe('Instructor Profile Endpoints & Designation/Bio Validation', () => {
    it('should return instructor profile data with designation and bio', async () => {
      const res = await request(app)
        .get('/api/instructor/settings/profile')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.designation).toBeDefined();
      expect(res.body.data.bio).toBeDefined();
    });

    it('should reject profile update with invalid email format', async () => {
      const res = await request(app)
        .patch('/api/instructor/settings/profile')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ email: 'bad-email-format' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('valid email address');
    });

    it('should successfully update designation and bio', async () => {
      const res = await request(app)
        .patch('/api/instructor/settings/profile')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          name: 'Sarah Jenkins',
          designation: 'Lead Computer Science Professor',
          bio: 'Expert in distributed algorithms and Web 3 systems.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.designation).toBe('Lead Computer Science Professor');
    });
  });

  describe('Password Change Validation', () => {
    it('should reject weak password change requests', async () => {
      const res = await request(app)
        .post('/api/instructor/settings/change-password')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          currentPassword: 'oldPassword123!',
          newPassword: 'weak',
          confirmPassword: 'weak',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('at least 8 characters long');
    });

    it('should reject when new password and confirm password do not match', async () => {
      const res = await request(app)
        .post('/api/instructor/settings/change-password')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          currentPassword: 'oldPassword123!',
          newPassword: 'StrongPassword1!',
          confirmPassword: 'DifferentPassword1!',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('do not match');
    });
  });

  describe('Notification JSON Preferences', () => {
    it('should retrieve instructor notification preferences', async () => {
      const res = await request(app)
        .get('/api/instructor/settings/notifications')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.emailNotifications).toBeDefined();
    });

    it('should update JSON notification preferences for student activity', async () => {
      const payload = {
        emailNotifications: true,
        inAppNotifications: true,
        studentActivityNotifications: {
          assignmentSubmission: true,
          quizSubmission: true,
          newEnrollment: true,
          discussionReplies: false,
        },
      };

      const res = await request(app)
        .patch('/api/instructor/settings/notifications')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ notificationPreferences: payload });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('UI Preferences', () => {
    it('should validate theme value on preferences update', async () => {
      const res = await request(app)
        .patch('/api/instructor/settings/preferences')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ theme: 'UnsupportedTheme' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Theme must be one of');
    });
  });

  describe('Account Deactivation (Soft Delete)', () => {
    it('should require password confirmation to deactivate account', async () => {
      const res = await request(app)
        .post('/api/instructor/settings/deactivate')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Password confirmation is required');
    });
  });
});
