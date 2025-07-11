import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  BookOpen, 
  Users, 
  Accessibility,
  X,
  Sparkles,
  Clock,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  features: string[];
}

interface TutorialLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: (tutorialId: string) => void;
  userType: "teacher" | "student" | null;
}

export function TutorialLauncher({ 
  isOpen, 
  onClose, 
  onStartTutorial, 
  userType 
}: TutorialLauncherProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);

  const tutorialOptions: TutorialOption[] = [
    {
      id: "teacher",
      title: "교사용 완전 가이드",
      description: "문제 생성부터 성적 분석까지 모든 기능을 단계별로 안내합니다.",
      icon: BookOpen,
      duration: "8-10분",
      difficulty: "beginner",
      features: [
        "대시보드 둘러보기",
        "문제 생성 및 관리",
        "시험 만들기",
        "채점 시스템",
        "성적 분석 리포트"
      ]
    },
    {
      id: "student",
      title: "학생용 시험 가이드",
      description: "온라인 시험 응시 방법과 게임화 시스템을 체험해보세요.",
      icon: Users,
      duration: "5-7분",
      difficulty: "beginner",
      features: [
        "학생 대시보드",
        "게임화 시스템",
        "시험 응시 방법",
        "포인트 및 배지",
        "성취 시스템"
      ]
    },
    {
      id: "accessibility",
      title: "접근성 기능 가이드",
      description: "고대비 모드, 글자 크기 조절, 키보드 네비게이션을 배워보세요.",
      icon: Accessibility,
      duration: "3-4분",
      difficulty: "beginner",
      features: [
        "고대비 모드",
        "글자 크기 조절",
        "키보드 네비게이션",
        "스크린 리더 지원"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "초급";
      case "intermediate":
        return "중급";
      case "advanced":
        return "고급";
      default:
        return "기본";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Tutorial Launcher Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card className="shadow-2xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">EduAssess 온보딩 튜토리얼</CardTitle>
                    <p className="text-blue-100 mt-1">
                      플랫폼 사용법을 단계별로 배워보세요
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Welcome Message */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {userType === "teacher" ? "교사님, 환영합니다!" : "학생 여러분, 환영합니다!"}
                </h3>
                <p className="text-blue-700 text-sm">
                  {userType === "teacher" 
                    ? "온라인 교육 평가 시스템의 모든 기능을 쉽게 배울 수 있도록 도와드리겠습니다."
                    : "게임화된 학습 환경과 온라인 시험 시스템을 재미있게 체험해보세요!"
                  }
                </p>
              </div>

              {/* Tutorial Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorialOptions.map((tutorial) => {
                  const IconComponent = tutorial.icon;
                  const isSelected = selectedTutorial === tutorial.id;
                  const isRecommended = tutorial.id === userType;

                  return (
                    <motion.div
                      key={tutorial.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 relative ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTutorial(tutorial.id)}
                      >
                        {isRecommended && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              추천
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{tutorial.title}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={getDifficultyColor(tutorial.difficulty)}
                                  >
                                    {getDifficultyLabel(tutorial.difficulty)}
                                  </Badge>
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{tutorial.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <p className="text-sm text-gray-600 mb-3">
                            {tutorial.description}
                          </p>

                          <div className="space-y-1">
                            <h5 className="text-xs font-medium text-gray-700">포함된 기능:</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {tutorial.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center space-x-1">
                                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                              {tutorial.features.length > 3 && (
                                <li className="text-blue-600">
                                  +{tutorial.features.length - 3}개 더...
                                </li>
                              )}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Tutorial Details */}
              <AnimatePresence>
                {selectedTutorial && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-4">
                        {(() => {
                          const tutorial = tutorialOptions.find(t => t.id === selectedTutorial);
                          if (!tutorial) return null;

                          return (
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  선택된 튜토리얼: {tutorial.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  예상 소요 시간: {tutorial.duration}
                                </p>
                              </div>
                              <Button
                                onClick={() => onStartTutorial(selectedTutorial)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                튜토리얼 시작
                              </Button>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Actions */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  나중에 설정에서 다시 실행할 수 있습니다
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    나중에 하기
                  </Button>
                  {!selectedTutorial && userType && (
                    <Button
                      onClick={() => onStartTutorial(userType)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      추천 튜토리얼 시작
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}