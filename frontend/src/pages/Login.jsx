import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err || 'Invalid login credentials');
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2">
            InterviewIQ
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Sign in to start prepping for your dream role
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#F3F4F6] mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                placeholder="developer@interviewiq.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                className="w-full pl-10 pr-4 py-3 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
              />
            </div>
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-[#F3F4F6]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-4 py-3 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
              />
            </div>
            {errors.password && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.password.message}</p>
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
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#9CA3AF] mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
