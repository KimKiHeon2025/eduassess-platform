import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap } from "lucide-react";

interface ProgressBarProps {
  currentPoints: number;
  level: number;
  streak: number;
}

export function ProgressBar({ currentPoints, level, streak }: ProgressBarProps) {
  const pointsForCurrentLevel = (level - 1) * 100;
  const pointsForNextLevel = level * 100;
  const progressInLevel = currentPoints - pointsForCurrentLevel;
  const pointsNeededForNext = pointsForNextLevel - currentPoints;
  const progressPercentage = (progressInLevel / 100) * 100;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-lg">레벨 {level}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>{currentPoints}P</span>
            </Badge>
            {streak > 0 && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>{streak}일 연속</span>
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>다음 레벨까지</span>
            <span>{pointsNeededForNext}P 필요</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{pointsForCurrentLevel}P</span>
            <span>{pointsForNextLevel}P</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}