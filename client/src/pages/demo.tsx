import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressBar } from "@/components/gamification/progress-bar";
import { BadgeShowcase } from "@/components/gamification/badge-showcase";
import { AchievementTracker } from "@/components/gamification/achievement-tracker";
import { PointAnimation, LevelUpAnimation } from "@/components/gamification/point-animation";
import { 
  GraduationCap, 
  Trophy, 
  Star, 
  Award,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Accessibility,
  Gamepad2,
  Eye,
  Type,
  Keyboard,
  Monitor
} from "lucide-react";

export default function DemoPage() {
  const [showPointAnimation, setShowPointAnimation] = useState(false);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");

  // Mock data for demonstrations
  const mockUserStats = {
    totalPoints: 850,
    level: 9,
    streak: 12
  };

  const mockBadges = [
    { id: "1", name: "첫 시험", description: "첫 번째 시험 완료", icon: "star", rarity: "common" as const, earnedAt: new Date() },
    { id: "2", name: "완벽한 점수", description: "100점 달성", icon: "trophy", rarity: "rare" as const, earnedAt: new Date() },
    { id: "3", name: "연속 학습", description: "5일 연속 학습", icon: "fire", rarity: "epic" as const, earnedAt: new Date() },
    { id: "4", name: "수학 마스터", description: "수학 분야 전문가", icon: "crown", rarity: "legendary" as const },
    { id: "5", name: "속도의 달인", description: "빠른 시간 내 완료", icon: "zap", rarity: "rare" as const },
    { id: "6", name: "꾸준한 학습", description: "30일 연속 학습", icon: "calendar", rarity: "epic" as const },
  ];

  const mockAchievements = [
    { id: "1", name: "시험 완료", description: "총 10개의 시험 완료하기", progress: 7, target: 10, completed: false, points: 100, category: "quiz" },
    { id: "2", name: "높은 점수", description: "90점 이상 5회 달성", progress: 5, target: 5, completed: true, points: 200, category: "study" },
    { id: "3", name: "연속 학습", description: "7일 연속 학습하기", progress: 7, target: 7, completed: true, points: 150, category: "streak" },
    { id: "4", name: "과목 마스터", description: "한 과목에서 모든 시험 완료", progress: 3, target: 5, completed: false, points: 300, category: "study" },
  ];

  const coreFeatures = [
    {
      icon: BookOpen,
      title: "문제 관리 시스템",
      description: "객관식 및 주관식 문제 생성, 이미지 첨부, 실시간 편집",
      status: "완료",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "이중 인증 시스템",
      description: "교사(ID+PW) 및 학생(이름+생년월일) 별도 로그인",
      status: "완료",
      color: "bg-green-500"
    },
    {
      icon: Monitor,
      title: "온라인 시험 시스템",
      description: "실시간 시험 응시, 자동 채점, 진행률 추적",
      status: "완료",
      color: "bg-purple-500"
    },
    {
      icon: BarChart3,
      title: "성과 분석 대시보드",
      description: "과목별 성적 분석, PDF 리포트 생성, 100점 환산",
      status: "완료",
      color: "bg-orange-500"
    },
    {
      icon: Accessibility,
      title: "접근성 기능",
      description: "고대비 모드, 글자 크기 조절, 키보드 네비게이션",
      status: "완료",
      color: "bg-indigo-500"
    },
    {
      icon: Gamepad2,
      title: "게임화 시스템",
      description: "포인트, 레벨, 배지, 성취 시스템으로 학습 동기 부여",
      status: "새로 추가",
      color: "bg-rose-500"
    }
  ];

  const testAccounts = [
    {
      type: "교사",
      accounts: [
        { id: "admin", password: "jhj0901", role: "관리자" },
        { id: "instructor", password: "password123", role: "교수" },
        { id: "teacher", password: "teacher123", role: "교사" }
      ]
    },
    {
      type: "학생",
      accounts: [
        { name: "홍길동", birthdate: "950101", note: "샘플 학생" },
        { name: "김철수", birthdate: "960215", note: "샘플 학생" },
        { name: "이영희", birthdate: "970330", note: "샘플 학생" }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${highContrastMode ? 'bg-black text-white' : 'bg-gray-50'} transition-all duration-300`}>
      {/* Animations */}
      <PointAnimation 
        points={50}
        reason="데모 포인트 획득!"
        visible={showPointAnimation}
        onComplete={() => setShowPointAnimation(false)}
      />
      <LevelUpAnimation 
        newLevel={10}
        visible={showLevelUpAnimation}
        onComplete={() => setShowLevelUpAnimation(false)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GraduationCap className={`h-12 w-12 ${highContrastMode ? 'text-white' : 'text-blue-600'}`} />
            <h1 className={`text-4xl font-bold ${highContrastMode ? 'text-white' : 'text-gray-900'}`}>
              EduAssess 플랫폼
            </h1>
          </div>
          <p className={`text-xl ${highContrastMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            한국어 온라인 교육 평가 시스템 - 전체 기능 데모
          </p>
          
          {/* 접근성 컨트롤 */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              variant={highContrastMode ? "default" : "outline"}
              onClick={() => setHighContrastMode(!highContrastMode)}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>고대비 모드</span>
            </Button>
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="small">작은 글씨</option>
              <option value="medium">보통 글씨</option>
              <option value="large">큰 글씨</option>
              <option value="xlarge">매우 큰 글씨</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="features">핵심 기능</TabsTrigger>
            <TabsTrigger value="gamification">게임화</TabsTrigger>
            <TabsTrigger value="accessibility">접근성</TabsTrigger>
            <TabsTrigger value="accounts">테스트 계정</TabsTrigger>
            <TabsTrigger value="demo">라이브 데모</TabsTrigger>
          </TabsList>

          {/* 핵심 기능 */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className={`border-l-4 ${highContrastMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}`} style={{ borderLeftColor: feature.color }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.color} bg-opacity-10`}>
                        <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${highContrastMode ? 'text-white' : 'text-gray-900'}`}>
                          {feature.title}
                        </h3>
                        <Badge variant={feature.status === "새로 추가" ? "default" : "secondary"}>
                          {feature.status}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm ${highContrastMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 게임화 시스템 */}
          <TabsContent value="gamification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span>진행률 및 레벨</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressBar 
                      currentPoints={mockUserStats.totalPoints}
                      level={mockUserStats.level}
                      streak={mockUserStats.streak}
                    />
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        onClick={() => setShowPointAnimation(true)}
                        size="sm"
                        variant="outline"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        포인트 획득
                      </Button>
                      <Button 
                        onClick={() => setShowLevelUpAnimation(true)}
                        size="sm"
                        variant="outline"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        레벨업
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span>성취 시스템</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AchievementTracker 
                      achievements={mockAchievements}
                      onClaimReward={(id) => console.log('보상 받기:', id)}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-500" />
                      <span>배지 시스템</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BadgeShowcase 
                      badges={mockBadges}
                      recentBadges={mockBadges.filter(b => b.earnedAt).slice(0, 2)}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 접근성 기능 */}
          <TabsContent value="accessibility" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>시각적 접근성</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">고대비 모드</h4>
                    <p className="text-sm text-gray-600">시각적 대비를 높여 가독성 향상</p>
                    <Button 
                      onClick={() => setHighContrastMode(!highContrastMode)}
                      variant={highContrastMode ? "default" : "outline"}
                      className="w-full"
                    >
                      {highContrastMode ? "고대비 모드 해제" : "고대비 모드 활성화"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">글자 크기 조절</h4>
                    <p className="text-sm text-gray-600">4단계 글자 크기 선택</p>
                    <select 
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="small">작은 글씨</option>
                      <option value="medium">보통 글씨</option>
                      <option value="large">큰 글씨</option>
                      <option value="xlarge">매우 큰 글씨</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Keyboard className="h-5 w-5" />
                    <span>키보드 네비게이션</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">키보드 단축키</h4>
                    <div className="text-sm space-y-1">
                      <p><kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> - 다음 요소로 이동</p>
                      <p><kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Tab</kbd> - 이전 요소로 이동</p>
                      <p><kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> - 선택된 요소 활성화</p>
                      <p><kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> - 체크박스/버튼 토글</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">스크린 리더 지원</h4>
                    <p className="text-sm text-gray-600">ARIA 라벨과 의미적 HTML 구조 사용</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 테스트 계정 */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testAccounts.map((accountType, index) => (
                <Card key={index} className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>{accountType.type} 계정</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {accountType.accounts.map((account, accountIndex) => (
                        <div key={accountIndex} className="p-3 border rounded-lg">
                          {accountType.type === "교사" ? (
                            <div className="space-y-1">
                              <p className="font-medium">ID: {account.id}</p>
                              <p className="text-sm text-gray-600">비밀번호: {account.password}</p>
                              <Badge variant="outline">{account.role}</Badge>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="font-medium">이름: {account.name}</p>
                              <p className="text-sm text-gray-600">생년월일: {account.birthdate}</p>
                              <Badge variant="outline">{account.note}</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 라이브 데모 */}
          <TabsContent value="demo" className="space-y-6">
            <Card className={highContrastMode ? 'bg-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="text-center">
                  EduAssess 플랫폼 라이브 데모
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className={`text-lg ${highContrastMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  실제 플랫폼으로 이동하여 모든 기능을 체험해보세요!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => window.location.href = "/login"}
                    className="w-full py-6 text-lg"
                  >
                    <GraduationCap className="h-6 w-6 mr-3" />
                    로그인 페이지로 이동
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/dashboard"}
                    variant="outline"
                    className="w-full py-6 text-lg"
                  >
                    <BarChart3 className="h-6 w-6 mr-3" />
                    대시보드로 이동
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">추천 테스트 순서:</h3>
                  <ol className="text-left text-sm space-y-1">
                    <li>1. 접근성 기능 테스트 (고대비 모드, 글자 크기)</li>
                    <li>2. 교사 계정 로그인 (admin / jhj0901)</li>
                    <li>3. 문제 생성 및 평가 만들기</li>
                    <li>4. 학생 계정 로그인 (홍길동 / 950101)</li>
                    <li>5. 게임화 시스템 체험</li>
                    <li>6. 온라인 시험 응시</li>
                    <li>7. 성과 분석 리포트 확인</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}