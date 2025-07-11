import { 
  users, subjects, questions, assessments, submissions, grades,
  type User, type InsertUser,
  type Subject, type InsertSubject,
  type Question, type InsertQuestion,
  type Assessment, type InsertAssessment,
  type Submission, type InsertSubmission,
  type Grade, type InsertGrade
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Subjects
  getSubject(id: number): Promise<Subject | undefined>;
  getSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, subject: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<boolean>;

  // Questions
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestions(createdBy?: number, subjectId?: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;

  // Assessments
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessments(createdBy?: number, subjectId?: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<boolean>;

  // Submissions
  getSubmission(id: number): Promise<Submission | undefined>;
  getSubmissions(assessmentId?: number, studentId?: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: number, submission: Partial<InsertSubmission>): Promise<Submission | undefined>;

  // Grades
  getGrade(id: number): Promise<Grade | undefined>;
  getGrades(submissionId?: number, questionId?: number): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: number, grade: Partial<InsertGrade>): Promise<Grade | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db
      .insert(subjects)
      .values(insertSubject)
      .returning();
    return subject;
  }

  async updateSubject(id: number, subjectUpdate: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [updated] = await db
      .update(subjects)
      .set(subjectUpdate)
      .where(eq(subjects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSubject(id: number): Promise<boolean> {
    const result = await db.delete(subjects).where(eq(subjects.id, id));
    return result.rowCount > 0;
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async getQuestions(createdBy?: number, subjectId?: number): Promise<Question[]> {
    let query = db.select().from(questions);
    
    if (createdBy && subjectId) {
      query = query.where(and(eq(questions.createdBy, createdBy), eq(questions.subjectId, subjectId)));
    } else if (createdBy) {
      query = query.where(eq(questions.createdBy, createdBy));
    } else if (subjectId) {
      query = query.where(eq(questions.subjectId, subjectId));
    }
    
    return await query;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async updateQuestion(id: number, questionUpdate: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [updated] = await db
      .update(questions)
      .set(questionUpdate)
      .where(eq(questions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id));
    return result.rowCount > 0;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async getAssessments(createdBy?: number, subjectId?: number): Promise<Assessment[]> {
    let query = db.select().from(assessments);
    
    if (createdBy && subjectId) {
      query = query.where(and(eq(assessments.createdBy, createdBy), eq(assessments.subjectId, subjectId)));
    } else if (createdBy) {
      query = query.where(eq(assessments.createdBy, createdBy));
    } else if (subjectId) {
      query = query.where(eq(assessments.subjectId, subjectId));
    }
    
    return await query;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async updateAssessment(id: number, assessmentUpdate: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const [updated] = await db
      .update(assessments)
      .set(assessmentUpdate)
      .where(eq(assessments.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAssessment(id: number): Promise<boolean> {
    const result = await db.delete(assessments).where(eq(assessments.id, id));
    return result.rowCount > 0;
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission || undefined;
  }

  async getSubmissions(assessmentId?: number, studentId?: number): Promise<Submission[]> {
    let query = db.select().from(submissions);
    
    if (assessmentId && studentId) {
      query = query.where(and(eq(submissions.assessmentId, assessmentId), eq(submissions.studentId, studentId)));
    } else if (assessmentId) {
      query = query.where(eq(submissions.assessmentId, assessmentId));
    } else if (studentId) {
      query = query.where(eq(submissions.studentId, studentId));
    }
    
    return await query;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db
      .insert(submissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async updateSubmission(id: number, submissionUpdate: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const [updated] = await db
      .update(submissions)
      .set(submissionUpdate)
      .where(eq(submissions.id, id))
      .returning();
    return updated || undefined;
  }

  async getGrade(id: number): Promise<Grade | undefined> {
    const [grade] = await db.select().from(grades).where(eq(grades.id, id));
    return grade || undefined;
  }

  async getGrades(submissionId?: number, questionId?: number): Promise<Grade[]> {
    let query = db.select().from(grades);
    
    if (submissionId && questionId) {
      query = query.where(and(eq(grades.submissionId, submissionId), eq(grades.questionId, questionId)));
    } else if (submissionId) {
      query = query.where(eq(grades.submissionId, submissionId));
    } else if (questionId) {
      query = query.where(eq(grades.questionId, questionId));
    }
    
    return await query;
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const [grade] = await db
      .insert(grades)
      .values(insertGrade)
      .returning();
    return grade;
  }

  async updateGrade(id: number, gradeUpdate: Partial<InsertGrade>): Promise<Grade | undefined> {
    const [updated] = await db
      .update(grades)
      .set(gradeUpdate)
      .where(eq(grades.id, id))
      .returning();
    return updated || undefined;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private questions: Map<number, Question>;
  private assessments: Map<number, Assessment>;
  private submissions: Map<number, Submission>;
  private grades: Map<number, Grade>;
  private currentUserID: number;
  private currentSubjectID: number;
  private currentQuestionID: number;
  private currentAssessmentID: number;
  private currentSubmissionID: number;
  private currentGradeID: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.questions = new Map();
    this.assessments = new Map();
    this.submissions = new Map();
    this.grades = new Map();
    this.currentUserID = 1;
    this.currentSubjectID = 1;
    this.currentQuestionID = 1;
    this.currentAssessmentID = 1;
    this.currentSubmissionID = 1;
    this.currentGradeID = 1;

    // Create default instructor user
    this.createUser({
      username: "instructor",
      password: "password123",
      role: "instructor"
    });

    // Create sample subjects (100 subjects)
    this.initializeSubjects();
  }

  private initializeSubjects() {
    const subjectList = [
      // 인문학
      "국어국문학", "영어영문학", "중어중문학", "일어일문학", "불어불문학", "독어독문학", "러시아학", "사학", "철학", "종교학",
      // 사회과학
      "정치외교학", "경제학", "사회학", "심리학", "인류학", "지리학", "사회복지학", "행정학", "신문방송학", "광고홍보학",
      // 자연과학
      "수학", "물리학", "화학", "생물학", "지구과학", "천문학", "통계학", "환경과학", "생명과학", "해양학",
      // 공학
      "기계공학", "전기전자공학", "컴퓨터공학", "화학공학", "건설환경공학", "산업공학", "재료공학", "원자력공학", "항공우주공학", "생명공학",
      // 의학 및 보건
      "의학", "간호학", "약학", "치의학", "한의학", "수의학", "보건학", "물리치료학", "작업치료학", "임상병리학",
      // 교육학
      "교육학", "유아교육학", "초등교육학", "특수교육학", "상담학", "교육공학", "체육교육학", "음악교육학", "미술교육학", "수학교육학",
      // 예술 및 체육
      "음악학", "미술학", "무용학", "연극영화학", "디자인학", "체육학", "운동학", "스포츠과학", "조형예술학", "응용예술학",
      // 경영 및 상경
      "경영학", "회계학", "마케팅학", "재무학", "국제통상학", "부동산학", "물류학", "관광학", "호텔경영학", "외식경영학",
      // 법학
      "법학", "국제법학", "헌법학", "민법학", "형법학", "상법학", "행정법학", "노동법학", "조세법학", "환경법학",
      // 농학 및 생활과학
      "농학", "원예학", "축산학", "임학", "식품영양학", "가정학", "의류학", "소비자학", "아동학", "조리학"
    ];

    subjectList.forEach((name, index) => {
      this.createSubject({
        name,
        code: `SUB${String(index + 1).padStart(3, '0')}`,
        description: `${name} 과목`,
        isActive: true,
        createdBy: 1
      });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserID++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Subjects
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(s => s.isActive);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectID++;
    const subject: Subject = { 
      ...insertSubject, 
      id, 
      createdAt: new Date() 
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(id: number, subjectUpdate: Partial<InsertSubject>): Promise<Subject | undefined> {
    const existing = this.subjects.get(id);
    if (!existing) return undefined;
    
    const updated: Subject = { ...existing, ...subjectUpdate };
    this.subjects.set(id, updated);
    return updated;
  }

  async deleteSubject(id: number): Promise<boolean> {
    return this.subjects.delete(id);
  }

  // Questions
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestions(createdBy?: number, subjectId?: number): Promise<Question[]> {
    const allQuestions = Array.from(this.questions.values());
    let filtered = allQuestions;
    
    if (createdBy) {
      filtered = filtered.filter(q => q.createdBy === createdBy);
    }
    
    if (subjectId) {
      filtered = filtered.filter(q => q.subjectId === subjectId);
    }
    
    return filtered;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionID++;
    const question: Question = { 
      ...insertQuestion, 
      id, 
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestion(id: number, questionUpdate: Partial<InsertQuestion>): Promise<Question | undefined> {
    const existing = this.questions.get(id);
    if (!existing) return undefined;
    
    const updated: Question = { ...existing, ...questionUpdate };
    this.questions.set(id, updated);
    return updated;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    return this.questions.delete(id);
  }

  // Assessments
  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAssessments(createdBy?: number, subjectId?: number): Promise<Assessment[]> {
    const allAssessments = Array.from(this.assessments.values());
    let filtered = allAssessments;
    
    if (createdBy) {
      filtered = filtered.filter(a => a.createdBy === createdBy);
    }
    
    if (subjectId) {
      filtered = filtered.filter(a => a.subjectId === subjectId);
    }
    
    return filtered;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentAssessmentID++;
    const assessment: Assessment = { 
      ...insertAssessment, 
      id, 
      createdAt: new Date()
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: number, assessmentUpdate: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const existing = this.assessments.get(id);
    if (!existing) return undefined;
    
    const updated: Assessment = { ...existing, ...assessmentUpdate };
    this.assessments.set(id, updated);
    return updated;
  }

  async deleteAssessment(id: number): Promise<boolean> {
    return this.assessments.delete(id);
  }

  // Submissions
  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissions(assessmentId?: number, studentId?: number): Promise<Submission[]> {
    let filtered = Array.from(this.submissions.values());
    
    if (assessmentId) {
      filtered = filtered.filter(s => s.assessmentId === assessmentId);
    }
    if (studentId) {
      filtered = filtered.filter(s => s.studentId === studentId);
    }
    
    return filtered;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionID++;
    const submission: Submission = { 
      ...insertSubmission, 
      id, 
      startedAt: new Date(),
      submittedAt: null,
      gradedAt: null
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmission(id: number, submissionUpdate: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const existing = this.submissions.get(id);
    if (!existing) return undefined;
    
    const updated: Submission = { ...existing, ...submissionUpdate };
    this.submissions.set(id, updated);
    return updated;
  }

  // Grades
  async getGrade(id: number): Promise<Grade | undefined> {
    return this.grades.get(id);
  }

  async getGrades(submissionId?: number, questionId?: number): Promise<Grade[]> {
    let filtered = Array.from(this.grades.values());
    
    if (submissionId) {
      filtered = filtered.filter(g => g.submissionId === submissionId);
    }
    if (questionId) {
      filtered = filtered.filter(g => g.questionId === questionId);
    }
    
    return filtered;
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const id = this.currentGradeID++;
    const grade: Grade = { 
      ...insertGrade, 
      id, 
      gradedAt: new Date()
    };
    this.grades.set(id, grade);
    return grade;
  }

  async updateGrade(id: number, gradeUpdate: Partial<InsertGrade>): Promise<Grade | undefined> {
    const existing = this.grades.get(id);
    if (!existing) return undefined;
    
    const updated: Grade = { ...existing, ...gradeUpdate };
    this.grades.set(id, updated);
    return updated;
  }
}

// Initialize default data for new database
async function initializeDatabase() {
  // Check if instructor user exists
  const instructorUser = await db.select().from(users).where(eq(users.username, "instructor"));
  
  if (instructorUser.length === 0) {
    // Create default instructor user
    const [instructor] = await db
      .insert(users)
      .values({
        username: "instructor",
        password: "password123",
        role: "instructor"
      })
      .returning();

    // Initialize 100 subjects
    const subjectList = [
      // 인문학
      "국어국문학", "영어영문학", "중어중문학", "일어일문학", "불어불문학", "독어독문학", "러시아학", "사학", "철학", "종교학",
      // 사회과학
      "정치외교학", "경제학", "사회학", "심리학", "인류학", "지리학", "사회복지학", "행정학", "신문방송학", "광고홍보학",
      // 자연과학
      "수학", "물리학", "화학", "생물학", "지구과학", "천문학", "통계학", "환경과학", "생명과학", "해양학",
      // 공학
      "기계공학", "전기전자공학", "컴퓨터공학", "화학공학", "건설환경공학", "산업공학", "재료공학", "원자력공학", "항공우주공학", "생명공학",
      // 의학 및 보건
      "의학", "치의학", "한의학", "수의학", "약학", "간호학", "물리치료학", "작업치료학", "방사선학", "임상병리학",
      // 농업 및 생명
      "농학", "원예학", "축산학", "산림학", "수산학", "식품공학", "농업경제학", "농업교육학", "바이오시스템공학", "농업생명과학",
      // 예술 및 체육
      "음악학", "미술학", "연극영화학", "무용학", "디자인학", "체육학", "태권도학", "스포츠의학", "레저스포츠학", "골프학",
      // 교육학
      "교육학", "유아교육학", "초등교육학", "특수교육학", "교육심리학", "교육과정학", "교육행정학", "평생교육학", "교육공학", "상담학",
      // 경영 및 상경
      "경영학", "회계학", "마케팅학", "재무학", "인사조직학", "생산관리학", "국제경영학", "벤처경영학", "호텔경영학", "관광경영학",
      // 법학 및 공공정책
      "법학", "국제법학", "공법학", "사법학", "행정법학", "국제관계학", "외교학", "정치학", "공공정책학", "도시계획학"
    ];

    const subjectInserts = subjectList.map((name, index) => ({
      name,
      code: `SUB${String(index + 1).padStart(3, '0')}`,
      description: `${name} 과목입니다.`,
      createdBy: instructor.id,
    }));

    await db.insert(subjects).values(subjectInserts);
  }
}

export const storage = new DatabaseStorage();

// Initialize database on startup
initializeDatabase().catch(console.error);
