'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';
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
        <div className="text-center animate-gentle-pulse">
          <Brain className="w-14 h-14 text-forest-600 mx-auto mb-4" />
          <p className="text-body-lg text-bark-light">Loading...</p>
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
      <header
        className="sticky top-0 z-10 border-b border-cream-300"
        style={{ background: 'rgba(250, 247, 240, 0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-7 h-7 text-forest-600" />
            <span
              className="text-heading-sm text-bark font-bold"
              style={{ fontFamily: '"Palatino Linotype", Palatino, Georgia, serif' }}
            >
              MindBloom
            </span>
          </div>
          <span className="text-body text-bark-light hidden sm:block">
            Getting to know you, {user.name}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <SurveyFlow userId={user.id} onComplete={handleComplete} />
      </main>
    </div>
  );
}
