import { describe, it, expect } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import adminSettingsRoutes from '../routes/adminSettings.routes';

const app = express();
app.use(express.json());
app.use('/api/admin/settings', adminSettingsRoutes);

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_SECRET = JWT_SECRET;

const generateToken = (role: string = 'ADMIN') => {
  return jwt.sign({ userId: 'test-user-id', role }, JWT_SECRET);
};

describe('Admin Settings API Endpoints', () => {
  const adminToken = generateToken('ADMIN');
  const studentToken = generateToken('STUDENT');

  describe('Authentication & Authorization', () => {
    it('should reject unauthenticated requests to settings', async () => {
      const res = await request(app).get('/api/admin/settings/profile');
      expect(res.status).toBe(401);
    });

    it('should allow student access to profile but reject student access to platform settings (403 Forbidden)', async () => {
      const platformRes = await request(app)
        .get('/api/admin/settings/platform')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(platformRes.status).toBe(403);
      expect(platformRes.body.message).toBe('Forbidden');
    });

    it('should allow admin access to platform settings', async () => {
      const platformRes = await request(app)
        .get('/api/admin/settings/platform')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(platformRes.status).toBe(200);
      expect(platformRes.body.status).toBe('success');
    });
  });

  describe('Profile Endpoints', () => {
    it('should return profile data for authenticated admin', async () => {
      const res = await request(app)
        .get('/api/admin/settings/profile')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should validate email format on profile update', async () => {
      const res = await request(app)
        .patch('/api/admin/settings/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'invalid-email-format' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('valid email address');
    });
  });

  describe('Password Change Validation', () => {
    it('should reject weak password change requests', async () => {
      const res = await request(app)
        .post('/api/admin/settings/change-password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          currentPassword: 'oldPassword123!',
          newPassword: 'weak',
          confirmPassword: 'weak',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('at least 8 characters long');
    });

    it('should reject password change when passwords do not match', async () => {
      const res = await request(app)
        .post('/api/admin/settings/change-password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          currentPassword: 'oldPassword123!',
          newPassword: 'StrongPassword1!',
          confirmPassword: 'MismatchPassword1!',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('do not match');
    });
  });

  describe('Notifications & Preferences', () => {
    it('should retrieve notification preferences', async () => {
      const res = await request(app)
        .get('/api/admin/settings/notifications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should validate theme value on preferences update', async () => {
      const res = await request(app)
        .patch('/api/admin/settings/preferences')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ theme: 'InvalidTheme' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Theme must be one of');
    });
  });

  describe('Platform Settings Validation', () => {
    it('should validate session timeout limits', async () => {
      const res = await request(app)
        .patch('/api/admin/settings/platform')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionTimeout: 2 }); // Less than 5 mins limit

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('between 5 and 1440 minutes');
    });
  });
});
