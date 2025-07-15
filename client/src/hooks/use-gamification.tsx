import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserStats {
  totalPoints: number;
  level: number;
  streak: number;
  badges: Badge[];
  achievements: Achievement[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  points: number;
}

export function useGamification(userId?: number) {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    streak: 0,
    badges: [],
    achievements: []
  });

  // Fetch user gamification data
  const { data: gamificationData } = useQuery({
    queryKey: ['gamification', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch(`/api/gamification/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch gamification data');
      return response.json();
    },
    enabled: !!userId
  });

  useEffect(() => {
    if (gamificationData) {
      setUserStats(gamificationData);
    }
  }, [gamificationData]);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const getPointsToNextLevel = (points: number) => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel * 100;
    return pointsForNextLevel - points;
  };

  const awardPoints = async (points: number, reason: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/gamification/award-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points, reason })
      });
      
      if (response.ok) {
        const updatedStats = await response.json();
        setUserStats(updatedStats);
        return updatedStats;
      }
    } catch (error) {
      console.error('Failed to award points:', error);
    }
  };

  const checkAchievements = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/gamification/check-achievements/${userId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const newAchievements = await response.json();
        return newAchievements;
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const earnBadge = async (badgeId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/gamification/earn-badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, badgeId })
      });
      
      if (response.ok) {
        const updatedStats = await response.json();
        setUserStats(updatedStats);
        return updatedStats;
      }
    } catch (error) {
      console.error('Failed to earn badge:', error);
    }
  };

  return {
    userStats,
    calculateLevel,
    getPointsToNextLevel,
    awardPoints,
    checkAchievements,
    earnBadge
  };
}