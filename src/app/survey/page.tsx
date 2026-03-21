'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import SurveyFlow from '@/components/survey/SurveyFlow';

export default function SurveyPage() {
  const router = useRouter();
  const { user, loading, refreshProfile } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-gentle">🌱</div>
          <p className="text-body-lg text-warm-gray-light">Loading...</p>
        </div>
      </div>
    );
  }

  const handleComplete = async () => {
    await refreshProfile();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-body font-bold text-warm-gray">MindBloom</span>
          </div>
          <span className="text-body text-warm-gray-light">Getting to know you, {user.name}...</span>
        </div>
      </header>

      {/* Survey */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SurveyFlow userId={user.id} onComplete={handleComplete} />
      </main>
    </div>
  );
}
