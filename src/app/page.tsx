'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trees, Mountain, Brain, ChevronRight, ArrowLeft, Lock, User } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

type Mode = 'home' | 'new' | 'returning';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading, login, register } = useUser();
  const [mode, setMode] = useState<Mode>('home');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center animate-gentle-pulse">
          <Brain className="w-16 h-16 text-forest-600 mx-auto mb-4" />
          <p className="text-body-lg text-bark-light">Loading...</p>
        </div>
      </div>
    );
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
    const result = mode === 'new'
      ? await register(name.trim(), pin)
      : await login(name.trim(), pin);

    if (result.success) {
      router.push(mode === 'new' ? '/survey' : '/dashboard');
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setMode('home');
    setName('');
    setPin('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream texture-paper flex flex-col">
      {/* Forest hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1e451e 0%, #255725 40%, #2d6e2d 70%, #3d8b3d 100%)',
        }}
      >
        {/* Mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0 opacity-10">
          <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-24">
            <polygon points="0,200 200,60 400,120 600,20 800,100 1000,40 1200,90 1200,200" fill="white" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trees className="w-10 h-10 text-sage-300" />
            <Brain className="w-12 h-12 text-white" />
            <Mountain className="w-10 h-10 text-sage-300" />
          </div>
          <h1
            className="text-heading-xl text-white mb-3"
            style={{ fontFamily: '"Palatino Linotype", Palatino, Georgia, serif' }}
          >
            MindBloom
          </h1>
          <p className="text-body-lg text-forest-200 max-w-xl mx-auto">
            A gentle brain training journey, personalized for you — one day at a time.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-slide-up">

          {/* Home: two big buttons */}
          {mode === 'home' && (
            <div className="space-y-4">
              <p className="text-center text-body-lg text-bark-light mb-8">
                Welcome. How would you like to begin?
              </p>

              <button
                onClick={() => setMode('new')}
                className="w-full flex items-center justify-between lodge-card p-7 text-left hover:shadow-lodge-md transition-all duration-200 group"
                style={{ minHeight: '96px' }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-forest-100 rounded-lodge flex items-center justify-center flex-shrink-0">
                    <Trees className="w-7 h-7 text-forest-600" />
                  </div>
                  <div>
                    <p className="text-heading-sm text-bark font-bold">I&apos;m New Here</p>
                    <p className="text-body text-bark-light mt-1">Create your account and get started</p>
                  </div>
                </div>
                <ChevronRight className="w-7 h-7 text-bark-lighter group-hover:text-forest-600 transition-colors flex-shrink-0" />
              </button>

              <button
                onClick={() => setMode('returning')}
                className="w-full flex items-center justify-between lodge-card p-7 text-left hover:shadow-lodge-md transition-all duration-200 group"
                style={{ minHeight: '96px' }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-amber-100 rounded-lodge flex items-center justify-center flex-shrink-0">
                    <Mountain className="w-7 h-7 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-heading-sm text-bark font-bold">Welcome Back</p>
                    <p className="text-body text-bark-light mt-1">Sign in and continue your journey</p>
                  </div>
                </div>
                <ChevronRight className="w-7 h-7 text-bark-lighter group-hover:text-amber-600 transition-colors flex-shrink-0" />
              </button>

              <div className="divider-nature" />

              <p className="text-center text-body text-bark-lighter">
                Your brain is a garden. Let&apos;s tend it together.
              </p>
            </div>
          )}

          {/* Login / Register form */}
          {(mode === 'new' || mode === 'returning') && (
            <div className="lodge-card p-8 animate-scale-in">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-body text-bark-light hover:text-bark transition-colors mb-6"
                style={{ minHeight: '40px' }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {mode === 'new' ? (
                    <Trees className="w-8 h-8 text-forest-600" />
                  ) : (
                    <Mountain className="w-8 h-8 text-amber-600" />
                  )}
                  <h2 className="text-heading text-bark">
                    {mode === 'new' ? 'Create Your Account' : 'Sign In'}
                  </h2>
                </div>
                <p className="text-body text-bark-light">
                  {mode === 'new'
                    ? 'Choose a name and a 4-digit PIN you will remember.'
                    : 'Enter your name and PIN from when you signed up.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-body font-semibold text-bark mb-2">
                    <User className="w-5 h-5 text-bark-lighter" />
                    Your First Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Robert"
                    className="w-full text-body-lg p-4 border-2 border-cream-300 rounded-lodge focus:border-forest-500 focus:outline-none bg-cream-50 transition-colors"
                    autoFocus
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="pin" className="flex items-center gap-2 text-body font-semibold text-bark mb-2">
                    <Lock className="w-5 h-5 text-bark-lighter" />
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
                    className="w-full text-body-xl p-4 border-2 border-cream-300 rounded-lodge focus:border-forest-500 focus:outline-none bg-cream-50 text-center tracking-widest transition-colors"
                    autoComplete="off"
                  />
                  <p className="text-sm text-bark-lighter mt-2">
                    {mode === 'new'
                      ? 'Pick a simple number you will remember, like your birthday month and day.'
                      : 'The 4-digit PIN you chose when you first signed up.'}
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lodge text-body animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-5 rounded-lodge text-body-lg font-semibold transition-all duration-200 shadow-lodge disabled:opacity-50 ${
                    mode === 'new'
                      ? 'bg-forest-600 text-white hover:bg-forest-700 hover:shadow-lodge-md'
                      : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lodge-md'
                  }`}
                >
                  {submitting
                    ? 'Please wait...'
                    : mode === 'new'
                    ? 'Create Account'
                    : 'Sign In'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="py-6 text-center">
        <p className="text-body text-bark-lighter">
          MindBloom &mdash; A gentle brain training experience
        </p>
      </footer>
    </div>
  );
}
