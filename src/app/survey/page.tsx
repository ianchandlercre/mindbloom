'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import SurveyFlow from '@/components/survey/SurveyFlow';
import { Trees, Leaf } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-cream-DEFAULT">
        <div className="text-center">
          <Leaf className="w-10 h-10 text-forest-500 mx-auto mb-4 animate-gentle-pulse" />
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
    <div className="min-h-screen bg-cream-DEFAULT texture-paper">
      {/* Header */}
      <header className="sticky top-0 bg-cream-DEFAULT/95 backdrop-blur-sm border-b border-wood-100 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trees className="w-6 h-6 text-forest-600" />
            <span className="text-body font-display font-bold text-bark">MindBloom</span>
          </div>
          <span className="text-body text-bark-lighter">Getting to know you, {user.name}...</span>
        </div>
      </header>

      {/* Survey */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SurveyFlow userId={user.id} onComplete={handleComplete} />
      </main>
    </div>
  );
}
