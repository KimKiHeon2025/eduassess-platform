import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, AlertCircle, User, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Submission, Question, Grade } from "@shared/schema";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Grading() {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeValues, setGradeValues] = useState<Record<number, { points: number; feedback: string }>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const { data: grades = [] } = useQuery<Grade[]>({
    queryKey: ["/api/grades"],
  });

  const submitGradeMutation = useMutation({
    mutationFn: (gradeData: any) => apiRequest("POST", "/api/grades", gradeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({
        title: "Success",
        description: "Grade submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit grade",
        variant: "destructive",
      });
    },
  });

  const pendingSubmissions = submissions.filter(s => s.status === "submitted");
  const gradedSubmissions = submissions.filter(s => s.status === "graded");

  const getQuestionById = (id: number) => questions.find(q => q.id === id);
  
  const getGradeForQuestion = (submissionId: number, questionId: number) => 
    grades.find(g => g.submissionId === submissionId && g.questionId === questionId);

  const handleGradeSubmit = (questionId: number) => {
    if (!selectedSubmission) return;
    
    const gradeData = gradeValues[questionId];
    if (!gradeData) return;

    submitGradeMutation.mutate({
      submissionId: selectedSubmission.id,
      questionId,
      studentAnswer: selectedSubmission.answers[questionId.toString()] || "",
      points: gradeData.points,
      maxPoints: getQuestionById(questionId)?.points || 1,
      feedback: gradeData.feedback,
      gradedBy: 1, // Instructor ID
    });
  };

  const handleGradeChange = (questionId: number, field: "points" | "feedback", value: any) => {
    setGradeValues(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const generatePDF = async (submission: Submission) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    let currentY = 20;

    // 한글 폰트 지원을 위한 설정
    pdf.setFont("helvetica");
    
    // 헤더 타이틀
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("평가 문제지", 20, currentY);
    currentY += 15;

    // 헤더 정보 테이블
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    
    // 테이블 경계선 및 내용
    const tableStartY = currentY;
    const colWidths = [30, 40, 30, 40, 30, 40];
    const rowHeight = 8;
    
    // 첫 번째 행
    let currentX = 20;
    pdf.rect(currentX, currentY, colWidths[0], rowHeight);
    pdf.text("출제자성명", currentX + 2, currentY + 5);
    currentX += colWidths[0];
    
    pdf.rect(currentX, currentY, colWidths[1], rowHeight);
    pdf.text("교수명", currentX + 2, currentY + 5);
    currentX += colWidths[1];
    
    pdf.rect(currentX, currentY, colWidths[2], rowHeight);
    pdf.text("기본/심화구분", currentX + 2, currentY + 5);
    currentX += colWidths[2];
    
    pdf.rect(currentX, currentY, colWidths[3], rowHeight);
    pdf.text("기본", currentX + 2, currentY + 5);
    currentX += colWidths[3];
    
    pdf.rect(currentX, currentY, colWidths[4], rowHeight);
    pdf.text("출제일", currentX + 2, currentY + 5);
    currentX += colWidths[4];
    
    pdf.rect(currentX, currentY, colWidths[5], rowHeight);
    const examDate = new Date().toLocaleDateString('ko-KR');
    pdf.text(examDate, currentX + 2, currentY + 5);
    
    currentY += rowHeight;
    
    // 두 번째 행
    currentX = 20;
    pdf.rect(currentX, currentY, colWidths[0], rowHeight);
    pdf.text("교과목명", currentX + 2, currentY + 5);
    currentX += colWidths[0];
    
    pdf.rect(currentX, currentY, colWidths[1], rowHeight);
    pdf.text("평가 과목", currentX + 2, currentY + 5);
    currentX += colWidths[1];
    
    pdf.rect(currentX, currentY, colWidths[2], rowHeight);
    pdf.text("평가일", currentX + 2, currentY + 5);
    currentX += colWidths[2];
    
    pdf.rect(currentX, currentY, colWidths[3], rowHeight);
    const submitDate = new Date(submission.submittedAt || '').toLocaleDateString('ko-KR');
    pdf.text(submitDate, currentX + 2, currentY + 5);
    currentX += colWidths[3];
    
    pdf.rect(currentX, currentY, colWidths[4], rowHeight);
    pdf.text("점수", currentX + 2, currentY + 5);
    currentX += colWidths[4];
    
    pdf.rect(currentX, currentY, colWidths[5], rowHeight);
    pdf.text(`${submission.score || 0}/${submission.maxScore || 0}`, currentX + 2, currentY + 5);
    
    currentY += rowHeight;
    
    // 세 번째 행
    currentX = 20;
    pdf.rect(currentX, currentY, colWidths[0], rowHeight);
    pdf.text("학과명", currentX + 2, currentY + 5);
    currentX += colWidths[0];
    
    pdf.rect(currentX, currentY, colWidths[1], rowHeight);
    pdf.text("컴퓨터공학과", currentX + 2, currentY + 5);
    currentX += colWidths[1];
    
    pdf.rect(currentX, currentY, colWidths[2], rowHeight);
    pdf.text("학번", currentX + 2, currentY + 5);
    currentX += colWidths[2];
    
    pdf.rect(currentX, currentY, colWidths[3], rowHeight);
    pdf.text(`${submission.studentId}`, currentX + 2, currentY + 5);
    currentX += colWidths[3];
    
    pdf.rect(currentX, currentY, colWidths[4], rowHeight);
    pdf.text("성명", currentX + 2, currentY + 5);
    currentX += colWidths[4];
    
    pdf.rect(currentX, currentY, colWidths[5], rowHeight);
    pdf.text(`학생${submission.studentId}`, currentX + 2, currentY + 5);
    
    currentY += rowHeight + 15;

    // 문제별 결과
    const submissionGrades = grades.filter(g => g.submissionId === submission.id);
    
    submissionGrades.forEach((grade, i) => {
      const question = getQuestionById(grade.questionId);
      
      if (!question) return;

      // 새 페이지가 필요한지 확인
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 20;
      }

      // 문제 번호와 배점
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`문제 ${i + 1}`, 20, currentY);
      pdf.text(`(${question.points || 1}점)`, pageWidth - 40, currentY);
      currentY += 8;

      // 문제 유형 표시
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const typeText = question.type === 'multiple-choice' ? '[객관식]' : '[주관식]';
      pdf.text(typeText, 20, currentY);
      currentY += 8;

      // 문제 텍스트
      pdf.setFontSize(11);
      const questionLines = pdf.splitTextToSize(question.questionText, pageWidth - 40);
      pdf.text(questionLines, 20, currentY);
      currentY += questionLines.length * 5 + 8;

      // 객관식 선택지 표시
      if (question.type === 'multiple-choice' && question.options) {
        question.options.forEach((option, optIndex) => {
          const prefix = `${optIndex + 1}. `;
          const optionLines = pdf.splitTextToSize(prefix + option, pageWidth - 50);
          pdf.text(optionLines, 30, currentY);
          currentY += optionLines.length * 4 + 2;
        });
        currentY += 5;
      }

      // 학생 답변 영역
      pdf.setFont("helvetica", "bold");
      pdf.text("답:", 20, currentY);
      pdf.setFont("helvetica", "normal");
      
      const answerText = submission.answers[question.id.toString()] || "답변 없음";
      let displayAnswer = answerText;
      
      // 객관식인 경우 번호로 표시
      if (question.type === 'multiple-choice' && !isNaN(parseInt(answerText))) {
        displayAnswer = `${parseInt(answerText) + 1}번`;
      }
      
      pdf.text(displayAnswer, 35, currentY);
      currentY += 8;

      // 채점 결과 표시
      const isCorrect = question.type === 'multiple-choice' 
        ? parseInt(answerText) === question.correctAnswer 
        : grade.points === grade.maxPoints;
      
      // 정답/오답 마크
      pdf.setFontSize(14);
      if (isCorrect) {
        pdf.setTextColor(0, 128, 0);
        pdf.text("✓", pageWidth - 30, currentY - 15);
        pdf.setFontSize(10);
        pdf.text("정답", pageWidth - 25, currentY - 10);
      } else {
        pdf.setTextColor(255, 0, 0);
        pdf.text("✗", pageWidth - 30, currentY - 15);
        pdf.setFontSize(10);
        pdf.text("오답", pageWidth - 25, currentY - 10);
      }
      pdf.setTextColor(0, 0, 0);

      // 정답 표시 (객관식 틀린 경우)
      if (question.type === 'multiple-choice' && !isCorrect && question.correctAnswer !== null) {
        pdf.setFontSize(10);
        pdf.text(`정답: ${question.correctAnswer + 1}번`, pageWidth - 60, currentY);
        currentY += 6;
      }

      // 피드백
      if (grade.feedback) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(9);
        pdf.text("피드백:", 20, currentY);
        currentY += 5;
        const feedbackLines = pdf.splitTextToSize(grade.feedback, pageWidth - 40);
        pdf.text(feedbackLines, 25, currentY);
        currentY += feedbackLines.length * 4;
        pdf.setFont("helvetica", "normal");
      }

      currentY += 15;
      
      // 구분선
      pdf.setLineWidth(0.1);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 10;
    });

    // PDF 다운로드
    pdf.save(`시험결과_학생${submission.studentId}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">채점 대시보드</h2>
        <p className="text-gray-600 mt-1">학생 제출물을 검토하고 채점하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions List */}
        <div className="lg:col-span-2">
          <Card className="shadow-material">
            <CardHeader>
              <CardTitle>제출물</CardTitle>
              <p className="text-sm text-gray-600">채점할 제출물을 클릭하세요</p>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Select defaultValue="pending">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">채점 대기중</SelectItem>
                    <SelectItem value="graded">채점 완료</SelectItem>
                    <SelectItem value="all">전체 제출물</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submissions List */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : pendingSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">채점 대기중인 제출물이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://images.unsplash.com/photo-149479010875${submission.studentId}?w=100&h=100&fit=crop&crop=face`} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              학생 #{submission.studentId}
                            </p>
                            <p className="text-xs text-gray-500">
                              평가 #{submission.assessmentId} • 
                              제출일 {new Date(submission.submittedAt || "").toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="secondary"
                            className="bg-warning-100 text-warning-800"
                          >
                            채점 대기
                          </Badge>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubmission(submission);
                            }}
                          >
                            채점하기
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>점수: {submission.score || 0}/{submission.maxScore || 0}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {Object.keys(submission.answers).length}개 문제 답변
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Graded Submissions */}
              {gradedSubmissions.length > 0 && (
                <>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">채점 완료된 제출물</h3>
                    <div className="space-y-4">
                      {gradedSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={`https://images.unsplash.com/photo-149479010875${submission.studentId}?w=100&h=100&fit=crop&crop=face`} />
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  학생 #{submission.studentId}
                                </p>
                                <p className="text-xs text-gray-500">
                                  평가 #{submission.assessmentId} • 
                                  채점완료 {new Date(submission.gradedAt || '').toLocaleDateString('ko-KR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge 
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                채점 완료
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generatePDF(submission)}
                                className="flex items-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>PDF</span>
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span>점수: {submission.score || 0}/{submission.maxScore || 0}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {Object.keys(submission.answers).length}개 문제 답변
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grading Panel */}
        <div className="space-y-6">
          {selectedSubmission ? (
            <>
              {/* Student Info */}
              <Card className="shadow-material">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>채점: 학생 #{selectedSubmission.studentId}</CardTitle>
                    {selectedSubmission.status === "graded" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generatePDF(selectedSubmission)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>PDF 다운로드</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">현재 점수</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedSubmission.score || 0}/{selectedSubmission.maxScore || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">제출일</span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedSubmission.submittedAt || "").toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Questions to Grade */}
              <Card className="shadow-material">
                <CardHeader>
                  <CardTitle>문제</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(selectedSubmission.answers).map(([questionId, answer]) => {
                    const question = getQuestionById(parseInt(questionId));
                    const existingGrade = getGradeForQuestion(selectedSubmission.id, parseInt(questionId));
                    
                    if (!question || question.type === "multiple-choice") return null;

                    return (
                      <div key={questionId} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {question.questionText}
                        </h4>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">학생 답변:</p>
                          <div className="bg-gray-50 rounded p-3 text-sm">
                            {answer as string}
                          </div>
                        </div>

                        {!existingGrade ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Points (out of {question.points})
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max={question.points}
                                value={gradeValues[parseInt(questionId)]?.points || ""}
                                onChange={(e) => 
                                  handleGradeChange(parseInt(questionId), "points", parseInt(e.target.value))
                                }
                                className="w-24"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback (optional)
                              </label>
                              <Textarea
                                value={gradeValues[parseInt(questionId)]?.feedback || ""}
                                onChange={(e) => 
                                  handleGradeChange(parseInt(questionId), "feedback", e.target.value)
                                }
                                rows={2}
                                placeholder="Provide feedback for the student..."
                              />
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={() => handleGradeSubmit(parseInt(questionId))}
                              disabled={!gradeValues[parseInt(questionId)]?.points && gradeValues[parseInt(questionId)]?.points !== 0}
                            >
                              Submit Grade
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-success-100 text-success-800">Graded</Badge>
                              <span className="text-sm font-medium">
                                {existingGrade.points}/{existingGrade.maxPoints} points
                              </span>
                            </div>
                            {existingGrade.feedback && (
                              <div className="text-sm text-gray-600">
                                <strong>Feedback:</strong> {existingGrade.feedback}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-material">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a submission</h3>
                <p className="text-gray-500">Choose a submission from the list to start grading</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="shadow-material">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Reviews</span>
                <span className="text-lg font-semibold text-warning-600">
                  {pendingSubmissions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Graded Today</span>
                <span className="text-lg font-semibold text-success-600">
                  {gradedSubmissions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Submissions</span>
                <span className="text-lg font-semibold text-primary-600">
                  {submissions.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
