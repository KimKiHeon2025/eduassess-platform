import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubjectSchema, insertQuestionSchema, insertAssessmentSchema, insertSubmissionSchema, insertGradeSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));
  
  // Download endpoint for Windows package
  app.get('/download/eduassess-platform.tar.gz', (req, res) => {
    const filePath = path.join(process.cwd(), 'eduassess-platform.tar.gz');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', 'attachment; filename="eduassess-platform.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      res.setHeader('Content-Length', fs.statSync(filePath).size);
      res.download(filePath, 'eduassess-platform.tar.gz');
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });
  
  // Alternative download for individual files
  app.get('/download/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const allowedFiles = ['실행.bat', '간단실행.bat', 'start.bat', 'install_nodejs.bat', 'WINDOWS_SETUP.md', '윈도우_설치방법.txt', '설치오류해결.md', '브라우저접속문제해결.md', 'README.md'];
    
    if (!allowedFiles.includes(filename)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const filePath = path.join(process.cwd(), filename);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.download(filePath, filename);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });
  
  // Download page
  app.get('/download', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EduAssess 다운로드</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
          }
          h1 { 
            color: #2563eb; 
            text-align: center; 
            margin-bottom: 30px; 
            font-size: 2rem;
          }
          .download-btn { 
            display: block; 
            width: 100%; 
            padding: 18px; 
            background: #2563eb; 
            color: white; 
            text-decoration: none; 
            text-align: center; 
            border-radius: 8px; 
            margin: 20px 0; 
            font-size: 18px; 
            font-weight: 600;
            transition: background 0.2s;
          }
          .download-btn:hover { 
            background: #1d4ed8; 
          }
          .info { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #2563eb;
          }
          .info h3 { 
            margin-top: 0; 
            color: #1e293b;
            font-size: 1.1rem;
          }
          .info p { 
            margin: 8px 0; 
            color: #475569;
          }
          .step { 
            margin: 12px 0; 
            padding: 12px 0; 
            color: #374151;
          }
          .step strong { 
            color: #1e293b; 
          }
          .step a { 
            color: #2563eb; 
            text-decoration: none; 
          }
          .step a:hover { 
            text-decoration: underline; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎓 EduAssess 윈도우 패키지 다운로드</h1>
          
          <a href="/download/eduassess-platform.tar.gz" class="download-btn">
            📦 eduassess-platform.tar.gz 다운로드 (2.1MB)
          </a>
          
          <div class="info">
            <h3>📋 설치 방법</h3>
            <div class="step">1. <strong>Node.js 먼저 설치:</strong> <a href="https://nodejs.org" target="_blank">https://nodejs.org</a> (LTS 버전)</div>
            <div class="step">2. 컴퓨터 재시작</div>
            <div class="step">3. C:\\jhj 폴더 생성</div>
            <div class="step">4. 다운로드한 파일을 C:\\jhj에 압축 해제</div>
            <div class="step">5. <strong>start.bat</strong> 파일 더블클릭 (가장 안전함)</div>
            <div class="step">6. 브라우저에서 http://localhost:5000 접속</div>
          </div>
          
          <div class="info">
            <h3>🔐 로그인 정보</h3>
            <p><strong>교사:</strong> admin / jhj0901</p>
            <p><strong>학생:</strong> 성명 + 생년월일 6자리</p>
          </div>
          
          <div class="info">
            <h3>🌐 브라우저 접속 문제</h3>
            <p><strong>문제:</strong> localhost:5000 연결 안됨</p>
            <p><strong>해결:</strong> Windows 방화벽, 브라우저 캐시, 포트 충돌</p>
            <p><a href="/download/files/브라우저접속문제해결.md" download>📄 상세 해결 가이드 다운로드</a></p>
          </div>
          
          <div class="info">
            <h3>💡 압축 해제 문제 해결</h3>
            <p>Windows에서 .tar.gz 파일이 안 열린다면:</p>
            <div class="step">1. <strong>7-Zip 설치</strong>: <a href="https://www.7-zip.org" target="_blank">7-zip.org</a> (무료, 권장)</div>
            <div class="step">2. 파일 우클릭 → "7-Zip" → "압축 풀기"</div>
            <div class="step">3. C:\\jhj 폴더로 압축 해제</div>
          </div>
          
          <div class="info">
            <h3>📞 지원</h3>
            <p>문제 발생 시 압축 파일 내 WINDOWS_SETUP.md 파일을 참고하세요.</p>
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // File upload endpoint
  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Subjects endpoints
  app.get('/api/subjects', async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  });

  app.get('/api/subjects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subject = await storage.getSubject(id);
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
      res.json(subject);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subject' });
    }
  });

  app.post('/api/subjects', async (req, res) => {
    try {
      const validated = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validated);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ error: 'Invalid subject data' });
    }
  });

  // Questions endpoints
  app.get('/api/questions', async (req, res) => {
    try {
      const createdBy = req.query.createdBy ? parseInt(req.query.createdBy as string) : undefined;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      const questions = await storage.getQuestions(createdBy, subjectId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  app.get('/api/questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestion(id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch question' });
    }
  });

  app.post('/api/questions', async (req, res) => {
    try {
      const validated = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(validated);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ error: 'Invalid question data' });
    }
  });

  app.put('/api/questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(id, validated);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      res.status(400).json({ error: 'Invalid question data' });
    }
  });

  app.delete('/api/questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuestion(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  // Assessments endpoints
  app.get('/api/assessments', async (req, res) => {
    try {
      const createdBy = req.query.createdBy ? parseInt(req.query.createdBy as string) : undefined;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      const assessments = await storage.getAssessments(createdBy, subjectId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  });

  app.get('/api/assessments/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assessment' });
    }
  });

  app.post('/api/assessments', async (req, res) => {
    try {
      const validated = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validated);
      res.status(201).json(assessment);
    } catch (error) {
      res.status(400).json({ error: 'Invalid assessment data' });
    }
  });

  // Submissions endpoints
  app.get('/api/submissions', async (req, res) => {
    try {
      const assessmentId = req.query.assessmentId ? parseInt(req.query.assessmentId as string) : undefined;
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      const submissions = await storage.getSubmissions(assessmentId, studentId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  });

  app.post('/api/submissions', async (req, res) => {
    try {
      const validated = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validated);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ error: 'Invalid submission data' });
    }
  });

  app.put('/api/submissions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      // Handle submission completion
      if (updates.status === 'submitted') {
        updates.submittedAt = new Date();
        
        // Auto-grade multiple choice questions
        const submission = await storage.getSubmission(id);
        if (submission) {
          const assessment = await storage.getAssessment(submission.assessmentId);
          if (assessment) {
            let totalScore = 0;
            let maxScore = 0;
            
            for (const questionId of assessment.questionIds) {
              const question = await storage.getQuestion(questionId);
              if (question) {
                maxScore += question.points;
                
                if (question.type === 'multiple-choice') {
                  const studentAnswer = submission.answers[questionId.toString()];
                  const isCorrect = studentAnswer === question.correctAnswer;
                  const points = isCorrect ? question.points : 0;
                  totalScore += points;
                  
                  // Create grade record
                  await storage.createGrade({
                    submissionId: id,
                    questionId: question.id,
                    studentAnswer: studentAnswer?.toString() || '',
                    points,
                    maxPoints: question.points,
                    gradedBy: null, // Auto-graded
                  });
                }
              }
            }
            
            updates.score = totalScore;
            updates.maxScore = maxScore;
            updates.status = maxScore === totalScore ? 'graded' : 'submitted'; // If all auto-graded
          }
        }
      }
      
      const submission = await storage.updateSubmission(id, updates);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(submission);
    } catch (error) {
      res.status(400).json({ error: 'Invalid submission data' });
    }
  });

  // Grades endpoints
  app.get('/api/grades', async (req, res) => {
    try {
      const submissionId = req.query.submissionId ? parseInt(req.query.submissionId as string) : undefined;
      const questionId = req.query.questionId ? parseInt(req.query.questionId as string) : undefined;
      const grades = await storage.getGrades(submissionId, questionId);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch grades' });
    }
  });

  app.post('/api/grades', async (req, res) => {
    try {
      const validated = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(validated);
      res.status(201).json(grade);
    } catch (error) {
      res.status(400).json({ error: 'Invalid grade data' });
    }
  });

  app.put('/api/grades/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertGradeSchema.partial().parse(req.body);
      const grade = await storage.updateGrade(id, validated);
      if (!grade) {
        return res.status(404).json({ error: 'Grade not found' });
      }
      res.json(grade);
    } catch (error) {
      res.status(400).json({ error: 'Invalid grade data' });
    }
  });

  // Statistics endpoint
  app.get('/api/stats', async (req, res) => {
    try {
      const questions = await storage.getQuestions();
      const assessments = await storage.getAssessments();
      const submissions = await storage.getSubmissions();
      const grades = await storage.getGrades();
      
      const activeAssessments = assessments.filter(a => a.isActive);
      const pendingGrades = grades.filter(g => !g.points && g.gradedBy === null);
      
      res.json({
        totalQuestions: questions.length,
        activeAssessments: activeAssessments.length,
        totalSubmissions: submissions.length,
        pendingGrades: pendingGrades.length,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });

  // Authentication endpoints
  app.post("/api/auth/student-login", async (req, res) => {
    try {
      const { name, birthDate } = req.body;
      
      if (!name || !birthDate) {
        return res.status(400).json({ message: "성명과 생년월일을 입력해주세요." });
      }

      if (!/^\d{6}$/.test(birthDate)) {
        return res.status(400).json({ message: "생년월일은 6자리 숫자여야 합니다." });
      }

      // 학생 ID 생성 (간단한 해시 방식)
      const studentId = Math.abs(
        [...(name + birthDate)].reduce((a, b) => a + b.charCodeAt(0), 0)
      ) % 100000;

      res.json({
        success: true,
        studentId: studentId,
        name: name,
        message: "학생 로그인 성공",
      });
    } catch (error) {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  app.post("/api/auth/teacher-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "아이디와 패스워드를 입력해주세요." });
      }

      // 기본 교사 계정 확인
      const validTeachers = [
        { username: "admin", password: "jhj0901" },
        { username: "instructor", password: "password123" },
        { username: "teacher", password: "teacher123" },
      ];

      const teacher = validTeachers.find(
        t => t.username === username && t.password === password
      );

      if (!teacher) {
        return res.status(401).json({ message: "잘못된 아이디 또는 패스워드입니다." });
      }

      res.json({
        success: true,
        username: username,
        role: "teacher",
        message: "교사 로그인 성공",
      });
    } catch (error) {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      res.json({ success: true, message: "로그아웃 되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  // Gamification endpoints
  app.get('/api/gamification/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Mock gamification data for demonstration
      const mockStats = {
        totalPoints: 1250,
        level: 3,
        streak: 7,
        badges: [
          { id: '1', name: '첫 시험 완료', description: '첫 번째 시험을 완료했습니다', icon: '🎯', rarity: 'common', earnedAt: new Date() },
          { id: '2', name: '연속 출석', description: '7일 연속 출석했습니다', icon: '🔥', rarity: 'rare', earnedAt: new Date() }
        ],
        achievements: [
          { id: '1', name: '시험 마스터', description: '10개의 시험을 완료하세요', progress: 3, target: 10, completed: false, points: 100 },
          { id: '2', name: '완벽한 점수', description: '만점을 받으세요', progress: 1, target: 1, completed: true, points: 50 }
        ]
      };
      
      res.json(mockStats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch gamification data' });
    }
  });

  // Analytics endpoint  
  app.get("/api/analytics", async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      const assessments = await storage.getAssessments();
      const submissions = await storage.getSubmissions();
      const grades = await storage.getGrades();

      // Calculate subject-wise analytics
      const analytics = subjects.map(subject => {
        const subjectAssessments = assessments.filter(a => a.subjectId === subject.id);
        const subjectSubmissions = submissions.filter(sub => 
          subjectAssessments.some(a => a.id === sub.assessmentId)
        );

        const gradedSubmissions = subjectSubmissions.filter(s => s.status === 'graded');
        
        let averageScore = 0;
        let normalizedScores: number[] = [];
        
        if (gradedSubmissions.length > 0) {
          normalizedScores = gradedSubmissions.map(sub => {
            const maxScore = sub.maxScore || 1;
            return Math.round(((sub.score || 0) / maxScore) * 100);
          });
          
          averageScore = Math.round(
            normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length
          );
        }

        const passCount = normalizedScores.filter(score => score >= 60).length;
        const passRate = gradedSubmissions.length > 0 
          ? Math.round((passCount / gradedSubmissions.length) * 100)
          : 0;

        return {
          subjectId: subject.id,
          subjectName: subject.name,
          totalSubmissions: subjectSubmissions.length,
          gradedSubmissions: gradedSubmissions.length,
          averageScore,
          passRate,
          scores: normalizedScores,
          maxScore: normalizedScores.length > 0 ? Math.max(...normalizedScores) : 0,
          minScore: normalizedScores.length > 0 ? Math.min(...normalizedScores) : 0,
        };
      });

      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
