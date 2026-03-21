'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import SurveyFlow from '@/components/survey/SurveyFlow';
import { TreePine } from 'lucide-react';

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
        <p className="text-body-lg text-stone-light">Loading...</p>
      </div>
    );
  }

  const handleComplete = async () => {
    await refreshProfile();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-deep z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine className="w-6 h-6 text-forest" />
            <span className="font-serif text-body font-bold text-forest-dark">MindBloom</span>
          </div>
          <span className="text-body text-stone-light">Welcome, {user.name}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <SurveyFlow userId={user.id} onComplete={handleComplete} />
      </main>
    </div>
  );
}
