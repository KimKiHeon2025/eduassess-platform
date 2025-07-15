import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TutorialOverlay } from "@/components/onboarding/tutorial-overlay";
import { TutorialLauncher } from "@/components/onboarding/tutorial-launcher";
import { useOnboarding } from "@/hooks/use-onboarding";
import { getTutorialSteps } from "@/data/tutorial-steps";
import { 
  HelpCircle, 
  ClipboardList, 
  Users, 
  Clock, 
  Download, 
  Plus,
  Edit,
  BookOpen,
  PlayCircle
} from "lucide-react";
import { Link } from "wouter";
import type { Question } from "@shared/schema";

export default function Dashboard() {
  const [showTutorialLauncher, setShowTutorialLauncher] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const { 
    onboardingState, 
    startTutorial, 
    completeTutorial, 
    skipTutorial, 
    shouldShowTutorial 
  } = useOnboarding();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: recentQuestions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const latestQuestions = recentQuestions?.slice(0, 3) || [];

  // Show tutorial launcher for new users
  useEffect(() => {
    if (shouldShowTutorial("teacher") && onboardingState.userType === "teacher") {
      const timer = setTimeout(() => {
        setShowTutorialLauncher(true);
      }, 2000); // Show after 2 seconds
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

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">안녕하세요, 김교수님</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">평가를 관리하고 학생들의 진도를 확인하세요</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link href="/quiz">
              <Button variant="outline" className="w-full sm:w-auto">
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="sm:hidden">시험</span>
                <span className="hidden sm:inline">온라인 시험</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.open('/download', '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="sm:hidden">다운로드</span>
              <span className="hidden sm:inline">윈도우 패키지 다운로드</span>
            </Button>
            <Button
              onClick={() => setShowTutorialLauncher(true)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              <span className="sm:hidden">튜토리얼</span>
              <span className="hidden sm:inline">튜토리얼 시작</span>
            </Button>
            <Link href="/questions">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                <span className="sm:hidden">평가 만들기</span>
                <span className="hidden sm:inline">평가 만들기</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-material">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="text-primary-600 h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">전체 문제</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? "..." : stats?.totalQuestions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-success-50 rounded-lg flex items-center justify-center">
                    <ClipboardList className="text-success-600 h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">활성 평가</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? "..." : stats?.activeAssessments || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-warning-50 rounded-lg flex items-center justify-center">
                    <Users className="text-warning-600 h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">전체 제출</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? "..." : stats?.totalSubmissions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue-600 h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">대기 채점</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? "..." : stats?.pendingGrades || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <p className="text-sm text-gray-600">Your latest created questions</p>
          </CardHeader>
          <CardContent>
            {questionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : latestQuestions.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No questions created yet</p>
                <Link href="/questions">
                  <Button className="mt-4">Create Your First Question</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {latestQuestions.map((question) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {question.questionText}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <Badge 
                            variant={question.type === "multiple-choice" ? "default" : "secondary"}
                            className={question.type === "multiple-choice" ? "bg-primary-100 text-primary-800" : "bg-success-100 text-success-800"}
                          >
                            {question.type === "multiple-choice" ? "Multiple Choice" : "Descriptive"}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Created {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/questions">
                <Button variant="ghost" className="w-full text-primary-600 hover:text-primary-700">
                  View All Questions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/questions">
              <Button className="w-full justify-start" variant="outline">
                <HelpCircle className="mr-2 h-4 w-4" />
                Create Question
              </Button>
            </Link>
            <Link href="/questions">
              <Button className="w-full justify-start" variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
            </Link>
            <Link href="/grading">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Grade Submissions
              </Button>
            </Link>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </CardContent>
        </Card>
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
        userType={onboardingState.userType || "teacher"}
      />
    </main>
  );
}
