import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Users, Play, ArrowLeft } from "lucide-react";
import type { Subject, Assessment } from "@shared/schema";

export default function QuizList() {
  const { subjectId } = useParams();

  // Fetch subject details
  const { data: subject, isLoading: subjectLoading } = useQuery<Subject>({
    queryKey: ['/api/subjects', subjectId],
  });

  // Fetch assessments for this subject
  const { data: assessments, isLoading: assessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments', { subjectId: parseInt(subjectId || '0') }],
    queryFn: async () => {
      const response = await fetch(`/api/assessments?subjectId=${subjectId}`);
      return response.json();
    }
  });

  const activeAssessments = assessments?.filter(a => a.isActive) || [];

  if (subjectLoading || assessmentsLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/quiz">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            과목 목록
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subject?.name}</h1>
          <p className="text-gray-600">{subject?.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성 시험</p>
                <p className="text-2xl font-bold">{activeAssessments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">시험 목록</h2>
        
        {activeAssessments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">시험이 없습니다</h3>
              <p className="text-gray-500">이 과목에는 아직 활성화된 시험이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeAssessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      {assessment.description && (
                        <p className="text-sm text-gray-600 mt-1">{assessment.description}</p>
                      )}
                    </div>
                    <Badge variant="outline">활성</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{assessment.questionIds.length}문제</span>
                      </div>
                      {assessment.timeLimit && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{assessment.timeLimit}분</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/student-quiz/${assessment.id}`}>
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        시험 시작
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}