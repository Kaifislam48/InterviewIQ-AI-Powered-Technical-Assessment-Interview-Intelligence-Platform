import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const token = searchParams.get('token');
  const passwordVal = watch('password', '');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Reset token is missing. Please request a new link.');
      return;
    }
    setSubmitting(true);
    try {
      const msg = await resetPassword(token, data.password);
      toast.success(msg || 'Password updated successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-glass text-[#F3F4F6]"
      >
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-xs text-[#9CA3AF] hover:text-[#F3F4F6] space-x-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Choose a secure, strong password for your profile.
          </p>
        </div>

        {!token ? (
          <div className="bg-[#151D30]/80 border border-rose-500/30 p-4 rounded-xl text-center text-sm text-[#F3F4F6] mb-4">
            Reset token is missing. Please request a password reset link again.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                />
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => value === passwordVal || 'Passwords do not match'
                  })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
