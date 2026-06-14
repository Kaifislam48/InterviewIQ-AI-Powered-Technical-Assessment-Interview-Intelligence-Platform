import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';

export const VerifyEmail = () => {
  const { verifyEmail } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const runVerification = async () => {
      if (!token) {
        setError('Verification token is missing. Please request a new verification link.');
        setVerifying(false);
        return;
      }
      try {
        const msg = await verifyEmail(token);
        setSuccess(msg || 'Email verified successfully!');
      } catch (err) {
        setError(err || 'Verification failed. The token may be invalid or expired.');
      } finally {
        setVerifying(false);
      }
    };
    runVerification();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-glass text-center text-[#F3F4F6]"
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-8">
          InterviewIQ
        </h1>

        {verifying ? (
          <div className="space-y-4">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mx-auto" />
            <p className="text-sm text-[#9CA3AF]">Confirming your email address. Please hold...</p>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-rose-400 mb-2">Verification Failed</h2>
              <p className="text-sm text-[#9CA3AF] px-4">{error}</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <ShieldCheck className="h-16 w-16 text-emerald-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">Account Verified</h2>
              <p className="text-sm text-[#9CA3AF] px-4">
                Thank you! Your email is verified. You can now log in and access technical mock interviews.
              </p>
            </div>
            <Link
              to="/login"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};
