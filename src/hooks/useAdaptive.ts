'use client';
import { useState, useEffect, useCallback } from 'react';
import { RecommendedGame, GameSession, UserProfile } from '@/types';

export function useAdaptive(userId: number | undefined, profile: UserProfile | null) {
  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [sessRes, statsRes] = await Promise.all([
        fetch(`/api/sessions?userId=${userId}`),
        fetch(`/api/user?userId=${userId}`),
      ]);
      const sessData = await sessRes.json();
      const statsData = await statsRes.json();

      setSessions(sessData.sessions || []);
      setStats(statsData.stats || null);

      // Get recommendations
      const recRes = await fetch(`/api/user?userId=${userId}&action=recommendations`);
      const recData = await recRes.json();
      setRecommendations(recData.recommendations || []);
    } catch (e) {
      console.error('Failed to fetch adaptive data:', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { recommendations, sessions, stats, loading, refresh: fetchData };
}
