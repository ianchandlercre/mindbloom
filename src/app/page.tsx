'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, register } = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  if (user && !loading) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    setSubmitting(true);
    const result = mode === 'login'
      ? await login(name.trim(), pin)
      : await register(name.trim(), pin);

    if (result.success) {
      router.push(mode === 'register' ? '/survey' : '/dashboard');
    } else {
      setError(result.error || 'Something went wrong');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-gentle">🌱</div>
          <p className="text-body-lg text-warm-gray-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">🌱</div>
          <h1 className="text-heading-lg font-bold text-warm-gray">MindBloom</h1>
          <p className="text-body-lg text-warm-gray-light mt-2">
            Keep your mind sharp with personalized brain training
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-warm-lg shadow-warm-md p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-cream rounded-warm p-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 rounded-warm text-body font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-soft-blue shadow-warm'
                  : 'text-warm-gray-light hover:text-warm-gray'
              }`}
            >
              Welcome Back
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 rounded-warm text-body font-medium transition-all ${
                mode === 'register'
                  ? 'bg-white text-soft-blue shadow-warm'
                  : 'text-warm-gray-light hover:text-warm-gray'
              }`}
            >
              I&apos;m New Here
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-body font-medium text-warm-gray mb-2">
                Your First Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Robert"
                className="w-full text-body-lg p-4 border-2 border-cream-dark rounded-warm focus:border-soft-blue focus:outline-none bg-cream"
                autoFocus
                autoComplete="name"
              />
            </div>

            {/* PIN */}
            <div className="mb-6">
              <label htmlFor="pin" className="block text-body font-medium text-warm-gray mb-2">
                4-Digit PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPin(val);
                }}
                placeholder="• • • •"
                className="w-full text-body-lg p-4 border-2 border-cream-dark rounded-warm focus:border-soft-blue focus:outline-none bg-cream text-center tracking-widest"
                autoComplete="off"
              />
              <p className="text-sm text-warm-gray-light mt-2">
                {mode === 'register'
                  ? 'Choose a simple 4-digit PIN you\'ll remember'
                  : 'Enter the PIN you created when signing up'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-warm text-body animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark transition-colors disabled:opacity-50 shadow-warm"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-warm-gray-light mt-6">
          A gentle brain training experience designed for you
        </p>
      </div>
    </div>
  );
}
