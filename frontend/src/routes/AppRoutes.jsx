import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { DashboardLayout } from '../layouts/DashboardLayout';

// Auth Protection
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { VerifyEmail } from '../pages/VerifyEmail';

// Protected Pages
import { Dashboard } from '../pages/Dashboard';
import { ResumeAnalyzer } from '../pages/ResumeAnalyzer';
import { MockInterview } from '../pages/MockInterview';
import { Assessments } from '../pages/Assessments';
import { CodingPractice } from '../pages/CodingPractice';
import { Analytics } from '../pages/Analytics';
import { LearningRoadmap } from '../pages/LearningRoadmap';
import { AdminPanel } from '../pages/AdminPanel';
import { Profile } from '../pages/Profile';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes (Candidate Dashboard Layout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResumeAnalyzer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MockInterview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Assessments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/coding"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CodingPractice />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LearningRoadmap />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch All - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
