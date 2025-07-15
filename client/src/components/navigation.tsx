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
 const { isHighContrast, fontSize, toggleHighContrast, changeFontSize } = useAccessibility();

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
              <span className="text-base sm:text-xl font-bold text-gray-900">EduAssess</span>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  location === item.href
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 우측 섹션 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 접근성 설정 */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHighContrast}
                title="고대비 모드 토글"
                className="hidden sm:flex"
              >
                <Eye size={16} />
              </Button>
              
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-12 h-8 hidden sm:flex">
                  <Type size={14} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">작게</SelectItem>
                <Select value={fontSize} onValueChange={changeFontSize}>
                  <SelectItem value="large">크게</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 사용자 정보 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2">
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-xs">
                      {isTeacher ? teacherInfo?.username?.charAt(0).toUpperCase() : studentInfo?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {isTeacher ? teacherInfo?.username : studentInfo?.name}
                  </span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocation("/demo")}>
                  <Download className="mr-2 h-4 w-4" />
                  데모 페이지
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 모바일 메뉴 버튼 */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
