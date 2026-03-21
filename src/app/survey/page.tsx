'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TreePine, Leaf } from 'lucide-react';
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
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
            <Leaf className="w-8 h-8 text-forest-600" />
          </div>
          <p className="text-body-lg text-stone-500">Loading...</p>
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
      <header className="sticky top-0 z-20 bg-forest-800 border-b border-forest-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-600/40 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-forest-300" />
            </div>
            <span className="text-body font-bold text-white">MindBloom</span>
          </div>
          <span className="text-forest-300 text-body font-medium">
            Getting to know you, {user.name}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <SurveyFlow userId={user.id} onComplete={handleComplete} />
      </main>
    </div>
  );
}
