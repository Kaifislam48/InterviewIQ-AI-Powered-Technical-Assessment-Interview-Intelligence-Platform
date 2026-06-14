import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const { requestPasswordReset } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await requestPasswordReset(data.email);
      setSent(true);
      toast.success('Reset email has been dispatched.');
    } catch (err) {
      toast.error(err || 'Failed to request password reset');
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
            Recover Password
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            {sent 
              ? "We've dispatched a recovery link to your inbox." 
              : "Enter your registered email address to receive a password reset link."}
          </p>
        </div>

        {sent ? (
          <div className="bg-[#151D30]/80 border border-[#1F2A45] p-4 rounded-xl text-center text-sm text-[#F3F4F6]">
            Check your console (or email logs) for the generated recovery link and follow the instructions to set your new credentials.
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
