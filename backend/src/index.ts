import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import projectRoutes from './routes/projectRoutes';
import certificateRoutes from './routes/certificateRoutes';
import studentRoutes from './routes/student.routes';
import instructorRoutes from './routes/instructor.routes';
import adminRoutes from './routes/admin.routes';
import adminSettingsRoutes from './routes/adminSettings.routes';
import studentSettingsRoutes from './routes/studentSettings.routes';
import instructorSettingsRoutes from './routes/instructorSettings.routes';
import publicRoutes from './routes/public.routes';
import path from 'path';

dotenv.config();

import { prisma } from './prisma';
export { prisma };
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/student/settings', studentSettingsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/instructor/settings', instructorSettingsRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
