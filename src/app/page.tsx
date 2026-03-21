'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Trees, Mountain, Leaf, ArrowRight, KeyRound, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, register } = useUser();
  const [mode, setMode] = useState<'choose' | 'login' | 'register'>('choose');
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
      setError(result.error || 'Something went wrong');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-DEFAULT">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-forest-500 mx-auto mb-4 animate-gentle-pulse" />
          <p className="text-body-lg text-bark-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-DEFAULT px-4 texture-paper">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-forest-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trees className="w-10 h-10 text-forest-600" />
            <Mountain className="w-8 h-8 text-forest-400" />
          </div>
          <h1 className="text-heading-xl font-display font-bold text-bark">MindBloom</h1>
          <p className="text-body-lg text-bark-light mt-2">
            Train your mind in the beauty of nature
          </p>
        </div>

        {mode === 'choose' ? (
          /* Mode selection */
          <div className="space-y-4 animate-slide-up">
            <button
              onClick={() => setMode('register')}
              className="w-full lodge-card-hover p-6 text-left flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0 group-hover:bg-forest-200 transition-colors">
                <Leaf className="w-7 h-7 text-forest-600" />
              </div>
              <div className="flex-1">
                <span className="text-body-lg font-semibold text-bark block">I&apos;m New Here</span>
                <span className="text-body text-bark-light">Create your personalized experience</span>
              </div>
              <ArrowRight className="w-5 h-5 text-bark-lighter flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setMode('login')}
              className="w-full lodge-card-hover p-6 text-left flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                <KeyRound className="w-7 h-7 text-amber-700" />
              </div>
              <div className="flex-1">
                <span className="text-body-lg font-semibold text-bark block">Welcome Back</span>
                <span className="text-body text-bark-light">Sign in with your name and PIN</span>
              </div>
              <ArrowRight className="w-5 h-5 text-bark-lighter flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* Login / Register form */
          <div className="lodge-card p-8 animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setMode('choose'); setError(''); }}
                className="text-bark-lighter hover:text-bark transition-colors p-1"
                aria-label="Go back"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-heading-sm font-display font-bold text-bark">
                {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block text-body font-medium text-bark mb-2">
                  Your First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-lighter" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Robert"
                    className="w-full text-body-lg pl-12 pr-4 py-4 border-2 border-wood-100 rounded-lodge focus:border-forest-400 focus:ring-2 focus:ring-forest-100 bg-cream-50 text-bark"
                    autoFocus
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="pin" className="block text-body font-medium text-bark mb-2">
                  4-Digit PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-lighter" />
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
                    placeholder="----"
                    className="w-full text-body-lg pl-12 pr-4 py-4 border-2 border-wood-100 rounded-lodge focus:border-forest-400 focus:ring-2 focus:ring-forest-100 bg-cream-50 text-bark text-center tracking-[0.5em]"
                    autoComplete="off"
                  />
                </div>
                <p className="text-sm text-bark-lighter mt-2">
                  {mode === 'register'
                    ? 'Choose a simple 4-digit PIN you\'ll remember'
                    : 'Enter the PIN you created when signing up'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lodge text-body border border-red-200 animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary text-body-lg"
              >
                {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-bark-lighter mt-8">
          A personalized brain training experience crafted just for you
        </p>
      </div>
    </div>
  );
}
