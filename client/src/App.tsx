import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Questions from "@/pages/questions";
import StudentQuiz from "@/pages/student-quiz";
import StudentDashboard from "@/pages/student-dashboard";
import SubjectQuiz from "@/pages/subject-quiz";
import QuizList from "@/pages/quiz-list";
import Grading from "@/pages/grading";
import Analytics from "@/pages/analytics";
import Login from "@/pages/login";
import DemoPage from "@/pages/demo";
import NotFound from "@/pages/not-found";

function Router() {
  const isTeacherLoggedIn = () => {
    return localStorage.getItem("teacherInfo") !== null;
  };

  const isStudentLoggedIn = () => {
    return localStorage.getItem("studentInfo") !== null;
  };

  // 자동 로그인 설정 - 최초 접속 시 기본 교사 계정으로 로그인
  if (!isTeacherLoggedIn() && !isStudentLoggedIn()) {
    const defaultTeacher = {
      username: "admin",
      role: "teacher"
    };
    localStorage.setItem("teacherInfo", JSON.stringify(defaultTeacher));
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {isTeacherLoggedIn() ? <Dashboard /> : isStudentLoggedIn() ? <StudentDashboard /> : <Login />}
      </Route>
      <Route path="/dashboard">
        {isTeacherLoggedIn() ? <Dashboard /> : <Login />}
      </Route>
      <Route path="/student-dashboard">
        {isStudentLoggedIn() ? <StudentDashboard /> : <Login />}
      </Route>
      <Route path="/questions">
        {isTeacherLoggedIn() ? <Questions /> : <Login />}
      </Route>
      <Route path="/quiz" component={SubjectQuiz} />
      <Route path="/quiz/subject/:subjectId" component={QuizList} />
      <Route path="/student-quiz/:id" component={StudentQuiz} />
      <Route path="/grading">
        {isTeacherLoggedIn() ? <Grading /> : <Login />}
      </Route>
      <Route path="/analytics">
        {isTeacherLoggedIn() ? <Analytics /> : <Login />}
      </Route>
      <Route path="/demo" component={DemoPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isLoggedIn = () => {
    return localStorage.getItem("teacherInfo") !== null || localStorage.getItem("studentInfo") !== null;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          {isLoggedIn() && <Navigation />}
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
