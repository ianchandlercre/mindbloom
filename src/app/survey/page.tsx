'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import SurveyFlow from '@/components/survey/SurveyFlow';
import { Brain } from 'lucide-react';

export default function SurveyPage() {
  const router = useRouter();
  const { user, loading, refreshProfile } = useUser();

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-soft-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-soft-blue rounded-warm flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-body font-bold text-warm-gray">MindBloom</span>
          </div>
          <span className="text-body text-warm-gray-light hidden sm:block">
            Getting to know you, {user.name}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <SurveyFlow userId={user.id} onComplete={handleComplete} />
      </main>
    </div>
  );
}
