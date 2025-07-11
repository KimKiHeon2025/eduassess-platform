import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Gift, BookOpen, Users, Zap } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  points: number;
  category: string;
}

interface AchievementTrackerProps {
  achievements: Achievement[];
  onClaimReward?: (achievementId: string) => void;
}

const categoryIcons = {
  quiz: BookOpen,
  study: Target,
  social: Users,
  bonus: Gift,
  streak: Zap
};

const categoryColors = {
  quiz: "bg-blue-100 text-blue-800",
  study: "bg-green-100 text-green-800",
  social: "bg-purple-100 text-purple-800",
  bonus: "bg-amber-100 text-amber-800",
  streak: "bg-red-100 text-red-800"
};

export function AchievementTracker({ achievements, onClaimReward }: AchievementTrackerProps) {
  const completedAchievements = achievements.filter(a => a.completed);
  const inProgressAchievements = achievements.filter(a => !a.completed && a.progress > 0);
  const notStartedAchievements = achievements.filter(a => !a.completed && a.progress === 0);

  const renderAchievement = (achievement: Achievement, showClaimButton = false) => {
    const IconComponent = categoryIcons[achievement.category as keyof typeof categoryIcons] || Target;
    const progressPercentage = (achievement.progress / achievement.target) * 100;

    return (
      <Card key={achievement.id} className={`${achievement.completed ? 'border-green-200 bg-green-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${categoryColors[achievement.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold flex items-center space-x-2">
                  <span>{achievement.name}</span>
                  {achievement.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                </h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Gift className="h-3 w-3" />
              <span>{achievement.points}P</span>
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행 상황</span>
              <span>{achievement.progress} / {achievement.target}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {showClaimButton && achievement.completed && onClaimReward && (
            <Button 
              onClick={() => onClaimReward(achievement.id)}
              className="w-full mt-3"
              variant="default"
            >
              <Gift className="h-4 w-4 mr-2" />
              보상 받기
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Completed Achievements */}
      {completedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>완료된 성취 ({completedAchievements.length})</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedAchievements.map(achievement => renderAchievement(achievement, true))}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>진행 중인 성취 ({inProgressAchievements.length})</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {inProgressAchievements.map(achievement => renderAchievement(achievement))}
          </div>
        </div>
      )}

      {/* Not Started Achievements */}
      {notStartedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <Gift className="h-5 w-5 text-gray-400" />
            <span>미시작 성취 ({notStartedAchievements.length})</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {notStartedAchievements.slice(0, 6).map(achievement => renderAchievement(achievement))}
          </div>
        </div>
      )}
    </div>
  );
}