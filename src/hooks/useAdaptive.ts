'use client';
import { useState, useEffect, useCallback } from 'react';
import { RecommendedGame, GameSession, UserProfile } from '@/types';

export function useAdaptive(userId: number | undefined, profile: UserProfile | null) {
  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [aiEncouragement, setAiEncouragement] = useState<string | null>(null);
  const [lastSessionSummary, setLastSessionSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [sessRes, statsRes, recRes] = await Promise.all([
        fetch(`/api/sessions?userId=${userId}`),
        fetch(`/api/user?userId=${userId}`),
        fetch(`/api/user?userId=${userId}&action=recommendations`),
      ]);
      const sessData = await sessRes.json();
      const statsData = await statsRes.json();
      const recData = await recRes.json();

      setSessions(sessData.sessions || []);
      setStats(statsData.stats || null);
      setRecommendations(recData.recommendations || []);
      setAiInsights(recData.aiInsights || null);
      setAiEncouragement(recData.aiEncouragement || null);
      setLastSessionSummary(recData.lastSessionSummary || null);
    } catch (e) {
      console.error('Failed to fetch adaptive data:', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { recommendations, sessions, stats, aiInsights, aiEncouragement, lastSessionSummary, loading, refresh: fetchData };
}
