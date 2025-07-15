import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useState } from "react";
import type { Subject, Submission, Assessment } from "@shared/schema";
import { TrendingUp, Users, FileText, BarChart3, Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Analytics() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  // 점수를 100점 만점으로 환산
  const normalizeScore = (score: number, maxScore: number) => {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  };

  // 선택된 과목의 제출물 필터링
  const filteredSubmissions = selectedSubjectId === "all" 
    ? submissions 
    : submissions.filter(sub => {
        const assessment = assessments.find(a => a.id === sub.assessmentId);
        return assessment?.subjectId === parseInt(selectedSubjectId);
      });

  // 과목별 통계 계산
  const subjectStats = subjects.map(subject => {
    const subjectAssessments = assessments.filter(a => a.subjectId === subject.id);
    const subjectSubmissions = submissions.filter(sub => 
      subjectAssessments.some(a => a.id === sub.assessmentId)
    );

    const totalSubmissions = subjectSubmissions.length;
    const gradedSubmissions = subjectSubmissions.filter(s => s.status === 'graded');
    
    let averageScore = 0;
    if (gradedSubmissions.length > 0) {
      const totalNormalizedScore = gradedSubmissions.reduce((sum, sub) => 
        sum + normalizeScore(sub.score || 0, sub.maxScore || 1), 0
      );
      averageScore = Math.round(totalNormalizedScore / gradedSubmissions.length);
    }

    return {
      name: subject.name,
      totalSubmissions,
      gradedSubmissions: gradedSubmissions.length,
      averageScore,
      passRate: gradedSubmissions.length > 0 
        ? Math.round((gradedSubmissions.filter(s => normalizeScore(s.score || 0, s.maxScore || 1) >= 60).length / gradedSubmissions.length) * 100)
        : 0
    };
  });

  // 점수 분포 데이터
  const scoreDistribution = [
    { range: "0-20점", count: 0 },
    { range: "21-40점", count: 0 },
    { range: "41-60점", count: 0 },
    { range: "61-80점", count: 0 },
    { range: "81-100점", count: 0 },
  ];

  filteredSubmissions.filter(s => s.status === 'graded').forEach(sub => {
    const normalizedScore = normalizeScore(sub.score || 0, sub.maxScore || 1);
    if (normalizedScore <= 20) scoreDistribution[0].count++;
    else if (normalizedScore <= 40) scoreDistribution[1].count++;
    else if (normalizedScore <= 60) scoreDistribution[2].count++;
    else if (normalizedScore <= 80) scoreDistribution[3].count++;
    else scoreDistribution[4].count++;
  });

  // 합격/불합격 데이터
  const passFailData = [
    { 
      name: "합격(60점 이상)", 
      value: filteredSubmissions.filter(s => s.status === 'graded' && normalizeScore(s.score || 0, s.maxScore || 1) >= 60).length 
    },
    { 
      name: "불합격(60점 미만)", 
      value: filteredSubmissions.filter(s => s.status === 'graded' && normalizeScore(s.score || 0, s.maxScore || 1) < 60).length 
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalGradedSubmissions = filteredSubmissions.filter(s => s.status === 'graded').length;
  const averageScore = totalGradedSubmissions > 0 
    ? Math.round(filteredSubmissions.filter(s => s.status === 'graded').reduce((sum, sub) => 
        sum + normalizeScore(sub.score || 0, sub.maxScore || 1), 0
      ) / totalGradedSubmissions)
    : 0;

  const passRate = totalGradedSubmissions > 0 
    ? Math.round((passFailData[0].value / totalGradedSubmissions) * 100)
    : 0;

  // PDF 생성 함수
  const generateAnalyticsReport = async () => {
    const reportElement = document.getElementById('analytics-report');
    if (!reportElement) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // 제목 및 헤더 정보
    pdf.setFontSize(20);
    pdf.text('EduAssess 성적 분석 리포트', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    const currentDate = new Date().toLocaleDateString('ko-KR');
    pdf.text(`생성일: ${currentDate}`, 20, 35);
    
    const selectedSubjectName = selectedSubjectId === "all" 
      ? "전체 과목" 
      : subjects.find(s => s.id.toString() === selectedSubjectId)?.name || "선택된 과목";
    pdf.text(`분석 대상: ${selectedSubjectName}`, 20, 45);
    
    // 요약 통계
    pdf.setFontSize(14);
    pdf.text('요약 통계', 20, 65);
    
    pdf.setFontSize(11);
    pdf.text(`총 응시자: ${totalGradedSubmissions}명`, 25, 80);
    pdf.text(`평균 점수: ${averageScore}점`, 25, 90);
    pdf.text(`합격률: ${passRate}% (60점 이상)`, 25, 100);
    pdf.text(`분석 과목 수: ${selectedSubjectId === "all" ? subjects.length : 1}개`, 25, 110);

    // 점수 분포 테이블
    pdf.setFontSize(14);
    pdf.text('점수 구간별 분포', 20, 130);
    
    pdf.setFontSize(11);
    let yPos = 145;
    scoreDistribution.forEach((dist, index) => {
      const percentage = totalGradedSubmissions > 0 
        ? Math.round((dist.count / totalGradedSubmissions) * 100) 
        : 0;
      pdf.text(`${dist.range}: ${dist.count}명 (${percentage}%)`, 25, yPos);
      yPos += 10;
    });

    // 과목별 상세 분석 (전체 과목 선택 시)
    if (selectedSubjectId === "all" && subjectStats.length > 0) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text('과목별 상세 분석', 20, 20);
      
      let subjectYPos = 35;
      pdf.setFontSize(11);
      
      subjectStats.forEach((stat) => {
        if (subjectYPos > 250) {
          pdf.addPage();
          subjectYPos = 20;
        }
        
        pdf.text(`과목명: ${stat.name}`, 25, subjectYPos);
        pdf.text(`총 제출: ${stat.totalSubmissions}건`, 25, subjectYPos + 10);
        pdf.text(`채점 완료: ${stat.gradedSubmissions}건`, 25, subjectYPos + 20);
        pdf.text(`평균 점수: ${stat.averageScore}점`, 25, subjectYPos + 30);
        pdf.text(`합격률: ${stat.passRate}%`, 25, subjectYPos + 40);
        
        pdf.line(20, subjectYPos + 50, pageWidth - 20, subjectYPos + 50);
        subjectYPos += 60;
      });
    }

    // 차트 캡처 및 추가
    try {
      const chartElements = document.querySelectorAll('.recharts-wrapper');
      let chartPage = false;
      
      for (let i = 0; i < Math.min(chartElements.length, 3); i++) {
        const element = chartElements[i] as HTMLElement;
        if (element) {
          if (!chartPage) {
            pdf.addPage();
            pdf.setFontSize(14);
            pdf.text('차트 분석', 20, 20);
            chartPage = true;
          }
          
          const canvas = await html2canvas(element, {
            scale: 1,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 170;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          const yPosition = 30 + (i * 85);
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            pdf.text('차트 분석 (계속)', 20, 20);
          }
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, Math.min(imgHeight, 80));
        }
      }
    } catch (error) {
      console.error('차트 캡처 오류:', error);
    }

    // 하단 정보
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
      pdf.text('EduAssess Analytics Report', 20, pageHeight - 10);
    }

    // PDF 저장
    const fileName = `analytics_report_${selectedSubjectName}_${currentDate.replace(/\./g, '_')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">시험 결과 분석</h2>
            <p className="text-gray-600 mt-1">과목별 응시자 성적 분석 및 통계</p>
          </div>
          <Button onClick={generateAnalyticsReport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>PDF 리포트 생성</span>
          </Button>
        </div>
      </div>

      {/* 과목 선택 */}
      <div className="mb-6">
        <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="과목을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 과목</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 분석 리포트 영역 */}
      <div id="analytics-report">
        {/* 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 응시자</p>
                <p className="text-2xl font-semibold text-gray-900">{totalGradedSubmissions}명</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600 h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 점수</p>
                <p className="text-2xl font-semibold text-gray-900">{averageScore}점</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-purple-600 h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">합격률</p>
                <p className="text-2xl font-semibold text-gray-900">{passRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-orange-600 h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">최고 점수</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalGradedSubmissions > 0 
                    ? Math.max(...filteredSubmissions.filter(s => s.status === 'graded').map(s => normalizeScore(s.score || 0, s.maxScore || 1)))
                    : 0}점
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 점수 분포 막대 그래프 */}
        <Card>
          <CardHeader>
            <CardTitle>점수 분포 (100점 만점 환산)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="응시자 수" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 합격/불합격 파이 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>합격/불합격 비율</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 과목별 성적 비교 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>과목별 평균 점수 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={subjectStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#8884d8" name="평균 점수" />
              <Bar dataKey="passRate" fill="#82ca9d" name="합격률 (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 과목별 상세 통계 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>과목별 상세 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    과목명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    총 응시자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    채점 완료
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평균 점수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    합격률
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjectStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.totalSubmissions}명
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.gradedSubmissions}명
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.averageScore}점
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        stat.passRate >= 70 
                          ? 'bg-green-100 text-green-800' 
                          : stat.passRate >= 50 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.passRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}