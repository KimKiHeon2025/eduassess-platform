import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Crown, Gem, Star } from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
}

interface BadgeShowcaseProps {
  badges: BadgeData[];
  recentBadges?: BadgeData[];
}

const rarityColors = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-amber-100 text-amber-800 border-amber-300"
};

const rarityIcons = {
  common: Star,
  rare: Award,
  epic: Gem,
  legendary: Crown
};

export function BadgeShowcase({ badges, recentBadges = [] }: BadgeShowcaseProps) {
  const earnedBadges = badges.filter(badge => badge.earnedAt);
  const availableBadges = badges.filter(badge => !badge.earnedAt);

  return (
    <div className="space-y-4">
      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span>최근 획득한 배지</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentBadges.map((badge) => {
                const IconComponent = rarityIcons[badge.rarity];
                return (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`p-3 rounded-lg border-2 ${rarityColors[badge.rarity]} hover:scale-105 transition-transform`}>
                          <div className="text-center">
                            <IconComponent className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-xs font-semibold truncate">{badge.name}</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-semibold">{badge.name}</p>
                          <p className="text-sm">{badge.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {badge.rarity}
                          </Badge>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span>획득한 배지 ({earnedBadges.length})</span>
            </div>
            <Badge variant="secondary">{earnedBadges.length}/{badges.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {earnedBadges.map((badge) => {
              const IconComponent = rarityIcons[badge.rarity];
              return (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={`p-3 rounded-lg border-2 ${rarityColors[badge.rarity]} hover:scale-105 transition-transform`}>
                        <div className="text-center">
                          <IconComponent className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs font-semibold truncate">{badge.name}</p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-sm">{badge.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{badge.rarity}</Badge>
                          {badge.earnedAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(badge.earnedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Star className="h-5 w-5 text-gray-400" />
              <span>획득 가능한 배지</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {availableBadges.slice(0, 12).map((badge) => {
                const IconComponent = rarityIcons[badge.rarity];
                return (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60 hover:opacity-80 transition-opacity">
                          <div className="text-center">
                            <IconComponent className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs font-semibold truncate text-gray-500">{badge.name}</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-semibold">{badge.name}</p>
                          <p className="text-sm">{badge.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {badge.rarity}
                          </Badge>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}