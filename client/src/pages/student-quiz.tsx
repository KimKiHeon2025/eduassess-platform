import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Flag, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Assessment, Question } from "@shared/schema";

export default function StudentQuiz() {
  const [, params] = useRoute("/quiz/:id");
  const [, setLocation] = useLocation();
  const assessmentId = parseInt(params?.id || "0");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const { toast } = useToast();

  // 학생 로그인 정보 확인
  const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");
  if (!studentInfo.name) {
    window.location.href = "/login";
    return null;
  }

  const { data: assessment } = useQuery<Assessment>({
    queryKey: ["/api/assessments", assessmentId],
    enabled: !!assessmentId,
  });

  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
    enabled: !!assessment?.questionIds,
    select: (allQuestions) => 
      assessment?.questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[],
  });

  const submitAnswerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/submissions", data),
    onSuccess: (response) => {
      const submission = response.json();
      setSubmissionId(submission.id);
    },
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/submissions/${submissionId}`, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Quiz submitted successfully!",
      });
    },
  });

  // Initialize submission when component mounts
  useEffect(() => {
    if (assessment && !submissionId && studentInfo.studentId) {
      submitAnswerMutation.mutate({
        assessmentId: assessment.id,
        studentId: studentInfo.studentId,
        answers: {},
        status: "in-progress",
      });
    }
  }, [assessment, studentInfo]);

  // Timer logic
  useEffect(() => {
    if (assessment?.timeLimit && timeRemaining === null) {
      setTimeRemaining(assessment.timeLimit * 60); // Convert minutes to seconds
    }

    if (timeRemaining && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, assessment]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (submissionId) {
      updateSubmissionMutation.mutate({
        answers,
        status: "submitted",
      });
    }
  };

  if (!assessment || questions.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Assessment...</h2>
            <p className="text-gray-600">Please wait while we load your quiz.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Card className="shadow-material mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{assessment.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{assessment.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/quiz")}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>홈으로</span>
              </Button>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer */}
      {timeRemaining !== null && (
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {formatTime(timeRemaining)} remaining
            </span>
          </div>
        </div>
      )}

      {/* Question */}
      <Card className="shadow-material mb-8">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.questionText}
              </h3>
              
              {currentQuestion.questionImage && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.questionImage}
                    alt="Question"
                    className="rounded-lg shadow-sm w-full h-auto max-h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Answer Options */}
            {currentQuestion.type === "multiple-choice" ? (
              <div className="space-y-4 mb-8">
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(parseInt(value))}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={index.toString()} className="mt-1" />
                      <div className="flex-1">
                        <Label className="font-medium text-gray-900 cursor-pointer">
                          {String.fromCharCode(65 + index)}.
                        </Label>
                        <span className="ml-2 text-gray-700">{option}</span>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="mb-8">
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant={flaggedQuestions.has(currentQuestion.id) ? "default" : "outline"}
                  onClick={handleFlag}
                  className={flaggedQuestions.has(currentQuestion.id) ? "bg-warning-100 text-warning-800 hover:bg-warning-200" : ""}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  {flaggedQuestions.has(currentQuestion.id) ? "Flagged" : "Flag for Review"}
                </Button>
                
                {isLastQuestion ? (
                  <Button onClick={handleSubmit} disabled={updateSubmissionMutation.isPending}>
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card className="shadow-material">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 ${
                  answers[questions[index].id] !== undefined 
                    ? "border-success-500 bg-success-50" 
                    : ""
                } ${
                  flaggedQuestions.has(questions[index].id)
                    ? "border-warning-500 bg-warning-50"
                    : ""
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
