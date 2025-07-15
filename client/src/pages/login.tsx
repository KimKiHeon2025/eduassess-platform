import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/hooks/use-accessibility";
import { GraduationCap, User, Lock, Eye, Type, Contrast } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isHighContrast, fontSize, toggleHighContrast, changeFontSize } = useAccessibility();
  
  // 학생 로그인 상태
  const [studentName, setStudentName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  // 교사 로그인 상태
  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      toast({
        title: "오류",
        description: "성명을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (birthDate.length !== 6 || !/^\d{6}$/.test(birthDate)) {
      toast({
        title: "오류", 
        description: "생년월일을 6자리 숫자로 입력해주세요. (예: 990101)",
        variant: "destructive",
      });
      return;
    }

    setStudentLoading(true);
    
    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName.trim(),
          birthDate: birthDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 학생 정보를 로컬 스토리지에 저장
        localStorage.setItem("studentInfo", JSON.stringify({
          name: studentName.trim(),
          birthDate: birthDate,
          studentId: data.studentId,
          loginTime: new Date().toISOString(),
        }));
        
        toast({
          title: "로그인 성공",
          description: `${studentName}님, 환영합니다!`,
        });
        
        setLocation("/quiz");
      } else {
        const error = await response.json();
        toast({
          title: "로그인 실패",
          description: error.message || "학생 로그인에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "서버 연결에 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setStudentLoading(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherId.trim() || !teacherPassword.trim()) {
      toast({
        title: "오류",
        description: "아이디와 패스워드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setTeacherLoading(true);
    
    try {
      const response = await fetch("/api/auth/teacher-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: teacherId.trim(),
          password: teacherPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 교사 정보를 로컬 스토리지에 저장
        localStorage.setItem("teacherInfo", JSON.stringify({
          username: teacherId.trim(),
          role: "teacher",
          loginTime: new Date().toISOString(),
        }));
        
        toast({
          title: "로그인 성공",
          description: `${teacherId}님, 환영합니다!`,
        });
        
        setLocation("/dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "로그인 실패",
          description: error.message || "교사 로그인에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "서버 연결에 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setTeacherLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        메인 컨텐츠로 건너뛰기
      </a>
      <div className="w-full max-w-md">
        {/* Accessibility Controls */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            접근성 설정
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                고대비 모드
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleHighContrast}
                className={`${isHighContrast ? 'bg-black text-white border-black' : ''}`}
              >
                {isHighContrast ? '활성화됨' : '비활성화됨'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                글자 크기
              </span>
              <select
                value={fontSize}
                onChange={(e) => changeFontSize(e.target.value)}
                className="text-sm border rounded px-2 py-1"
                aria-label="글자 크기 선택"
              >
                <option value="small">작게</option>
                <option value="normal">보통</option>
                <option value="large">크게</option>
                <option value="extra-large">매우 크게</option>
              </select>
            </div>
          </div>
        </div>

        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-white text-2xl" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduAssess</h1>
          <p className="text-gray-600">온라인 평가 시스템</p>
        </div>

        <Card className="shadow-xl" id="main-content">
          <CardHeader>
            <CardTitle className="text-center text-xl">로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">학생</TabsTrigger>
                <TabsTrigger value="teacher">교사</TabsTrigger>
              </TabsList>
              
              {/* 학생 로그인 */}
              <TabsContent value="student">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>성명</span>
                    </Label>
                    <Input
                      id="studentName"
                      type="text"
                      placeholder="홍길동"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      aria-describedby="studentName-help"
                      autoComplete="name"
                    />
                    <p id="studentName-help" className="sr-only">
                      학생의 실명을 정확히 입력하세요
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>생년월일 (6자리)</span>
                    </Label>
                    <Input
                      id="birthDate"
                      type="text"
                      placeholder="990101"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                      aria-describedby="birthDate-help"
                      autoComplete="bday"
                      inputMode="numeric"
                    />
                    <p id="birthDate-help" className="text-xs text-gray-500">
                      예: 1999년 1월 1일 → 990101 (숫자만 6자리)
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={studentLoading}
                  >
                    {studentLoading ? "로그인 중..." : "시험 응시하기"}
                  </Button>
                </form>
              </TabsContent>
              
              {/* 교사 로그인 */}
              <TabsContent value="teacher">
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherId" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>교사 ID</span>
                    </Label>
                    <Input
                      id="teacherId"
                      type="text"
                      placeholder="teacher_id"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      required
                      aria-describedby="teacherId-help"
                      autoComplete="username"
                    />
                    <p id="teacherId-help" className="sr-only">
                      교사 계정 아이디를 입력하세요
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teacherPassword" className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>패스워드</span>
                    </Label>
                    <Input
                      id="teacherPassword"
                      type="password"
                      placeholder="••••••••"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required
                      aria-describedby="teacherPassword-help"
                      autoComplete="current-password"
                    />
                    <p id="teacherPassword-help" className="sr-only">
                      교사 계정 비밀번호를 입력하세요
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={teacherLoading}
                  >
                    {teacherLoading ? "로그인 중..." : "관리자 로그인"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* 도움말 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            학생은 성명과 생년월일로 로그인하여 시험에 응시할 수 있습니다.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            교사는 관리자 계정으로 로그인하여 문제를 관리할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}