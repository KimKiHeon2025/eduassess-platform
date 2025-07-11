import { Link, useLocation } from "wouter";
import { GraduationCap, Bell, ChevronDown, LogOut, Menu, Download, Eye, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/hooks/use-accessibility";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { isHighContrast, fontSize, toggleHighContrast, setFontSize } = useAccessibility();

  const isTeacher = localStorage.getItem("teacherInfo") !== null;
  const isStudent = localStorage.getItem("studentInfo") !== null;
  
  const studentInfo = isStudent ? JSON.parse(localStorage.getItem("studentInfo") || "{}") : null;
  const teacherInfo = isTeacher ? JSON.parse(localStorage.getItem("teacherInfo") || "{}") : null;

  const navItems = isTeacher ? [
    { href: "/dashboard", label: "대시보드" },
    { href: "/questions", label: "문제 관리" },
    { href: "/grading", label: "채점" },
    { href: "/analytics", label: "성적 분석" },
  ] : [
    { href: "/student-dashboard", label: "대시보드" },
    { href: "/quiz", label: "시험 응시" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("teacherInfo");
      localStorage.removeItem("studentInfo");
      
      toast({
        title: "로그아웃",
        description: "성공적으로 로그아웃되었습니다.",
      });
      
      setLocation("/login");
    } catch (error) {
      toast({
        title: "오류",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* 로고 섹션 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div 
              className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => setLocation(isTeacher ? "/dashboard" : "/student-dashboard")}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={14} />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 hidden xs:block">EduAssess</h1>
            </div>
            
            {/* 데스크톱 네비게이션 */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => setLocation(item.href)}
                  className={`pb-4 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 오른쪽 액션 버튼들 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Accessibility Controls */}
            <div className="accessibility-controls flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleHighContrast}
                className={`high-contrast-toggle ${isHighContrast ? 'bg-gray-900 text-white' : ''}`}
                title="고대비 모드 토글"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline ml-2">
                  {isHighContrast ? '고대비' : '일반'}
                </span>
              </Button>
              
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="font-size-selector w-20 h-9">
                  <Type className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">작게</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="large">크게</SelectItem>
                  <SelectItem value="extra-large">매우 크게</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 홈 버튼 - 모바일에서 숨김 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation(isTeacher ? "/dashboard" : "/student-dashboard")}
              className="hidden sm:flex items-center space-x-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden md:inline">홈</span>
            </Button>

            {/* 모바일 메뉴 버튼 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.href}
                    onClick={() => setLocation(item.href)}
                    className={location === item.href ? "bg-primary-50 text-primary-600" : ""}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => window.open('/download', '_blank')}>
                  <Download className="mr-2 h-4 w-4" />
                  윈도우 패키지 다운로드
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 알림 버튼 - 태블릿 이상에서만 표시 */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Bell className="h-4 w-4 text-gray-400" />
            </Button>

            {/* 사용자 메뉴 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2">
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {isTeacher ? "T" : isStudent ? "S" : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline max-w-20 sm:max-w-none truncate">
                    {isTeacher ? teacherInfo?.username : isStudent ? studentInfo?.name : "사용자"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-gray-900 border-b">
                  {isTeacher ? teacherInfo?.username : isStudent ? studentInfo?.name : "사용자"}
                </div>
                {isTeacher && (
                  <>
                    <DropdownMenuItem>프로필</DropdownMenuItem>
                    <DropdownMenuItem>설정</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
