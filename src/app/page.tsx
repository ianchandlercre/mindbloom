'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TreePine, Leaf, ArrowRight, User, Lock, AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, register } = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      setError(result.error || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center animate-pulse-gentle">
              <Leaf className="w-8 h-8 text-forest-600" />
            </div>
          </div>
          <p className="text-body-lg text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero — forest header */}
      <div className="forest-header flex-1 flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="mountain-silhouette" />

        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="w-14 h-14 rounded-lodge-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <TreePine className="w-8 h-8 text-forest-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-none">MindBloom</h1>
            <p className="text-forest-300 text-sm font-medium tracking-wide mt-0.5">Brain Training</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-xl text-forest-200 leading-relaxed">
            Personalized brain training designed to keep your mind sharp and engaged
          </p>
        </div>

        {/* Mountain ridge decorative */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,80 L0,50 L150,20 L300,45 L450,10 L600,35 L750,5 L900,40 L1050,15 L1200,45 L1200,80 Z"
              fill="#FFFBF5"
              fillOpacity="1"
            />
          </svg>
        </div>
      </div>

      {/* Card section */}
      <div className="bg-cream px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.15s' }}>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-7 p-1.5 bg-cream-200 rounded-lodge-lg">
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3.5 rounded-lodge text-body font-semibold transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-white text-forest-800 shadow-lodge'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              style={{ minHeight: '52px' }}
            >
              I&apos;m New Here
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3.5 rounded-lodge text-body font-semibold transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-white text-forest-800 shadow-lodge'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              style={{ minHeight: '52px' }}
            >
              Welcome Back
            </button>
          </div>

          {/* Welcome text */}
          <div className="mb-6">
            {mode === 'register' ? (
              <>
                <h2 className="text-heading font-bold text-stone-900 mb-1">Create your account</h2>
                <p className="text-body text-stone-500">Just your name and a simple 4-digit PIN to get started.</p>
              </>
            ) : (
              <>
                <h2 className="text-heading font-bold text-stone-900 mb-1">Good to see you again</h2>
                <p className="text-body text-stone-500">Enter your name and PIN to continue your journey.</p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-body font-semibold text-stone-700 mb-2">
                Your First Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5 text-stone-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Robert"
                  className="w-full text-body-lg pl-12 pr-4 py-4 border-2 border-cream-300 rounded-lodge focus:border-forest-600 focus:outline-none bg-cream-100 focus:bg-white transition-all"
                  style={{ minHeight: '60px' }}
                  autoFocus
                  autoComplete="given-name"
                />
              </div>
            </div>

            {/* PIN field */}
            <div>
              <label htmlFor="pin" className="block text-body font-semibold text-stone-700 mb-2">
                4-Digit PIN
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="w-5 h-5 text-stone-400" />
                </div>
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
                  placeholder="  ·  ·  ·  ·"
                  className="w-full text-body-lg pl-12 pr-4 py-4 border-2 border-cream-300 rounded-lodge focus:border-forest-600 focus:outline-none bg-cream-100 focus:bg-white transition-all text-center tracking-[0.5em]"
                  style={{ minHeight: '60px' }}
                  autoComplete="off"
                />
              </div>
              <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                {mode === 'register'
                  ? 'Choose any 4 numbers you can easily remember'
                  : 'Enter the 4-digit PIN you chose when signing up'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lodge text-body animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 py-4 bg-forest-700 text-white rounded-lodge text-body-lg font-bold hover:bg-forest-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lodge-md"
              style={{ minHeight: '64px' }}
            >
              {submitting ? (
                <span className="animate-pulse-gentle">Please wait...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Get Started'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-sm text-stone-400 mt-6 leading-relaxed">
            A calm, personalized brain training experience designed for you
          </p>
        </div>
      </div>
    </div>
  );
}
