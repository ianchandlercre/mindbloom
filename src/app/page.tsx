'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { TreePine } from 'lucide-react';

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
      setError(result.error || 'Something went wrong');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-body-lg text-stone-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-slide-up">

        {/* Wordmark */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-5">
            <div className="w-16 h-16 bg-forest rounded-warm-xl flex items-center justify-center shadow-forest">
              <TreePine className="w-9 h-9 text-amber-light" />
            </div>
          </div>
          <h1 className="font-serif text-heading-xl font-bold text-forest-dark mb-2">MindBloom</h1>
          <p className="text-body-lg text-stone-light">
            Personalized brain training, crafted for you
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-warm-xl shadow-warm-md border border-cream-deep p-8">

          {/* Mode tabs */}
          <div className="flex gap-1 mb-7 bg-cream rounded-warm p-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 rounded-warm text-body font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-forest shadow-warm'
                  : 'text-stone-light hover:text-stone'
              }`}
            >
              Welcome Back
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 rounded-warm text-body font-medium transition-all ${
                mode === 'register'
                  ? 'bg-white text-forest shadow-warm'
                  : 'text-stone-light hover:text-stone'
              }`}
            >
              New Member
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-body font-semibold text-stone mb-2">
                Your First Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Robert"
                className="w-full text-body-lg p-4 border-2 border-cream-deep rounded-warm focus:border-forest focus:outline-none bg-cream text-stone placeholder-stone-pale"
                autoFocus
                autoComplete="name"
              />
            </div>

            {/* PIN */}
            <div className="mb-6">
              <label htmlFor="pin" className="block text-body font-semibold text-stone mb-2">
                4-Digit PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="• • • •"
                className="w-full text-body-lg p-4 border-2 border-cream-deep rounded-warm focus:border-forest focus:outline-none bg-cream text-center tracking-widest text-stone"
                autoComplete="off"
              />
              <p className="text-sm text-stone-light mt-2">
                {mode === 'register'
                  ? 'Choose a simple 4-digit PIN you will remember'
                  : 'Enter the PIN you created when signing up'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-warm text-body border border-red-200 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-forest text-white rounded-warm text-body-lg font-semibold hover:bg-forest-dark transition-colors disabled:opacity-50 shadow-forest"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-light mt-6">
          A thoughtful brain training experience designed for you
        </p>
      </div>
    </div>
  );
}
