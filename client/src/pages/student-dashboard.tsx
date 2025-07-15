import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/gamification/progress-bar";
import { BadgeShowcase } from "@/components/gamification/badge-showcase";
import { AchievementTracker } from "@/components/gamification/achievement-tracker";
import { PointAnimation, LevelUpAnimation } from "@/components/gamification/point-animation";
import { TutorialOverlay } from "@/components/onboarding/tutorial-overlay";
import { TutorialLauncher } from "@/components/onboarding/tutorial-launcher";
import { useGamification } from "@/hooks/use-gamification";
import { useOnboarding } from "@/hooks/use-onboarding";
import { getTutorialSteps } from "@/data/tutorial-steps";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Star,
  Award,
  Zap,
  PlayCircle
} from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const [showPointAnimation, setShowPointAnimation] = useState(false);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [animationData, setAnimationData] = useState({ points: 0, reason: "", newLevel: 1 });
  const [showTutorialLauncher, setShowTutorialLauncher] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  
  // Mock student ID - in real app this would come from authentication
  const studentId = 1;
  const { userStats, awardPoints } = useGamification(studentId);
  
  const { 
    onboardingState, 
    startTutorial, 
    completeTutorial, 
    skipTutorial, 
    shouldShowTutorial 
  } = useOnboarding();

  // Show tutorial launcher for new student users
  useEffect(() => {
    if (shouldShowTutorial("student") && onboardingState.userType === "student") {
      const timer = setTimeout(() => {
        setShowTutorialLauncher(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowTutorial, onboardingState.userType]);

  const handleStartTutorial = (tutorialId: string) => {
    setShowTutorialLauncher(false);
    setActiveTutorial(tutorialId);
    startTutorial(tutorialId);
  };

  const handleCompleteTutorial = () => {
    if (activeTutorial) {
      completeTutorial(activeTutorial);
    }
    setActiveTutorial(null);
  };

  const handleSkipTutorial = () => {
    skipTutorial();
    setActiveTutorial(null);
  };

  const { data: availableQuizzes } = useQuery({
    queryKey: ["/api/assessments"],
  });

  const { data: completedQuizzes } = useQuery({
    queryKey: ["/api/submissions", studentId],
  });

  // Mock gamification data for demonstration
  const mockBadges = [
    { id: "1", name: "첫 시험", description: "첫 번째 시험 완료", icon: "star", rarity: "common" as const, earnedAt: new Date() },
    { id: "2", name: "완벽한 점수", description: "100점 달성", icon: "trophy", rarity: "rare" as const, earnedAt: new Date() },
    { id: "3", name: "연속 학습", description: "5일 연속 학습", icon: "fire", rarity: "epic" as const },
    { id: "4", name: "수학 마스터", description: "수학 분야 전문가", icon: "crown", rarity: "legendary" as const },
  ];

  const mockAchievements = [
    { id: "1", name: "시험 완료", description: "총 10개의 시험 완료하기", progress: 3, target: 10, completed: false, points: 100, category: "quiz" },
    { id: "2", name: "높은 점수", description: "90점 이상 5회 달성", progress: 2, target: 5, completed: false, points: 200, category: "study" },
    { id: "3", name: "연속 학습", description: "7일 연속 학습하기", progress: 7, target: 7, completed: true, points: 150, category: "streak" },
  ];

  const simulatePointGain = () => {
    setAnimationData({ points: 50, reason: "시험 완료!", newLevel: userStats.level });
    setShowPointAnimation(true);
  };

  const simulateLevelUp = () => {
    setAnimationData({ points: 0, reason: "", newLevel: userStats.level + 1 });
    setShowLevelUpAnimation(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Animations */}
      <PointAnimation 
        points={animationData.points}
        reason={animationData.reason}
        visible={showPointAnimation}
        onComplete={() => setShowPointAnimation(false)}
      />
      <LevelUpAnimation 
        newLevel={animationData.newLevel}
        visible={showLevelUpAnimation}
        onComplete={() => setShowLevelUpAnimation(false)}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">학생 대시보드</h1>
        <p className="text-gray-600">학습 진도를 확인하고 새로운 시험에 도전하세요!</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 progress-bar-container">
        <ProgressBar 
          currentPoints={userStats.totalPoints}
          level={userStats.level}
          streak={userStats.streak}
        />
      </div>

      {/* Test Gamification Buttons */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>게임화 시스템 테스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={simulatePointGain} variant="outline">
                <Star className="h-4 w-4 mr-2" />
                포인트 획득 시뮬레이션
              </Button>
              <Button onClick={simulateLevelUp} variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                레벨업 시뮬레이션
              </Button>
              <Button onClick={() => setShowTutorialLauncher(true)} variant="outline">
                <PlayCircle className="h-4 w-4 mr-2" />
                튜토리얼 시작
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">사용 가능한 시험</p>
                <p className="text-2xl font-bold text-blue-900">{availableQuizzes?.length || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">완료한 시험</p>
                <p className="text-2xl font-bold text-green-900">{completedQuizzes?.length || 0}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">획득한 배지</p>
                <p className="text-2xl font-bold text-purple-900">{mockBadges.filter(b => b.earnedAt).length}</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">연속 학습일</p>
                <p className="text-2xl font-bold text-amber-900">{userStats.streak}</p>
              </div>
              <Zap className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Quizzes */}
      <div className="mb-8">
        <Card className="quiz-list">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span>시험 목록</span>
              </div>
              <Badge variant="secondary">{availableQuizzes?.length || 0}개</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableQuizzes && availableQuizzes.length > 0 ? (
              <div className="space-y-4">
                {availableQuizzes.slice(0, 3).map((quiz: any) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-gray-600">{quiz.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">{quiz.questionIds?.length || 0}문제</Badge>
                        {quiz.timeLimit && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{quiz.timeLimit}분</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link href={`/quiz/${quiz.id}`}>
                      <Button className="quiz-start-button">시험 시작</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">현재 사용 가능한 시험이 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gamification Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 gamification-section">
        {/* Achievements */}
        <div className="achievement-tracker">
          <h2 className="text-xl font-semibold mb-4">성취 현황</h2>
          <AchievementTracker 
            achievements={mockAchievements}
            onClaimReward={(id) => console.log('Claiming reward for achievement:', id)}
          />
        </div>

        {/* Badges */}
        <div className="badge-showcase">
          <h2 className="text-xl font-semibold mb-4">배지 컬렉션</h2>
          <BadgeShowcase 
            badges={mockBadges}
            recentBadges={mockBadges.filter(b => b.earnedAt).slice(0, 2)}
          />
        </div>
      </div>

      {/* Tutorial Components */}
      <TutorialLauncher
        isOpen={showTutorialLauncher}
        onClose={() => setShowTutorialLauncher(false)}
        onStartTutorial={handleStartTutorial}
        userType={onboardingState.userType}
      />

      <TutorialOverlay
        steps={activeTutorial ? getTutorialSteps(activeTutorial as any) : []}
        isActive={!!activeTutorial}
        onComplete={handleCompleteTutorial}
        onSkip={handleSkipTutorial}
        userType={onboardingState.userType || "student"}
      />
    </main>
  );
}