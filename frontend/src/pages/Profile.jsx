import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

export const Profile = () => {
  const { user, login } = useContext(AuthContext); // we can retrieve user from context
  // Wait, let's define a way to update the user in context. 
  // In AuthContext, we didn't export a separate setUser method, but we can write one or simply update localStorage and force refresh, or let's use the setUser if we can retrieve it or update context, wait!
  // In AuthContext.jsx:
  // const [user, setUser] = useState(null);
  // We can add a function to update the user in context!
  // Let's check AuthContext.jsx to see if we can edit it or if we can read and write state.
  // The AuthProvider exports: user, loading, login, register, logout, requestPasswordReset, resetPassword, verifyEmail, isAdmin.
  // Wait! To update the user context directly, let's also update the AuthProvider to expose a method like `updateUserContext(updatedData)` so the frontend profile page can sync the UI context instantly!
  // This is a very clean design choice. Let's do that.

  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const passwordVal = watch('password', '');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
      };
      if (data.password) {
        payload.password = data.password;
      }

      const response = await api.put('/users/profile', payload);
      const updatedUser = response.data.data;

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // We'll trigger a window reload or context update to update all layouts
      toast.success('Profile updated successfully! Refreshing details...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          Manage your personal details, email configurations, and password security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Avatar Card */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-3xl shadow-glow mx-auto">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold">{user?.name}</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{user?.email}</p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs font-semibold text-indigo-400 capitalize">
              Account Role: {user?.role}
            </span>
          </div>
        </div>

        {/* Right Settings Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-1.5 pb-4 border-b border-[#1F2A45]">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <span>Update Credentials</span>
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  />
                </div>
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-sm font-semibold mb-2">New Password (optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    {...register('password', { minLength: { value: 6, message: 'Must be at least 6 characters' } })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  />
                </div>
                {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    {...register('confirmPassword', {
                      validate: (value) => value === passwordVal || 'Passwords do not match'
                    })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  />
                </div>
                {errors.confirmPassword && <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
