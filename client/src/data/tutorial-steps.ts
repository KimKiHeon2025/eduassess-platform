interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "hover" | "type" | "scroll";
  content?: {
    text?: string;
    image?: string;
    video?: string;
  };
  interactive?: boolean;
  autoNext?: boolean;
  delay?: number;
}

export const teacherTutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "EduAssess에 오신 것을 환영합니다!",
    description: "한국어 온라인 교육 평가 플랫폼의 모든 기능을 살펴보겠습니다. 문제 생성부터 성적 분석까지 단계별로 안내해드릴게요.",
    position: "center",
    autoNext: true,
    delay: 4000
  },
  {
    id: "navigation",
    title: "네비게이션 메뉴",
    description: "상단 메뉴를 통해 대시보드, 문제 관리, 채점, 성적 분석 페이지로 이동할 수 있습니다. 각 메뉴를 클릭해보세요.",
    target: "nav",
    position: "bottom",
    interactive: true,
    action: "click"
  },
  {
    id: "dashboard-stats",
    title: "대시보드 통계",
    description: "전체 문제 수, 활성 평가, 총 학생 수, 완료된 시험 수를 한눈에 볼 수 있습니다. 실시간으로 업데이트됩니다.",
    target: ".grid:has(.shadow-material)",
    position: "bottom",
    autoNext: true,
    delay: 3000
  },
  {
    id: "create-question",
    title: "문제 만들기",
    description: "문제 관리 페이지에서 객관식과 주관식 문제를 생성할 수 있습니다. 이미지 첨부도 가능합니다. '평가 만들기' 버튼을 클릭해보세요.",
    target: "a[href='/questions']",
    position: "left",
    interactive: true,
    action: "click"
  },
  {
    id: "question-types",
    title: "문제 유형 선택",
    description: "객관식(4지선다)과 주관식 문제를 만들 수 있습니다. 각 문제에 점수를 배정하고 이미지를 첨부할 수 있습니다.",
    target: ".question-form",
    position: "right",
    autoNext: true,
    delay: 4000
  },
  {
    id: "grading-system",
    title: "채점 시스템",
    description: "객관식 문제는 자동으로 채점되며, 주관식 문제는 수동으로 채점할 수 있습니다. 피드백 기능도 제공됩니다.",
    target: "a[href='/grading']",
    position: "bottom",
    interactive: true,
    action: "hover"
  },
  {
    id: "analytics-dashboard",
    title: "성적 분석",
    description: "과목별 성적 분석, 학생별 성과 추적, PDF 리포트 생성이 가능합니다. 모든 점수는 100점 만점으로 환산됩니다.",
    target: "a[href='/analytics']",
    position: "bottom",
    interactive: true,
    action: "hover"
  },
  {
    id: "accessibility-features",
    title: "접근성 기능",
    description: "고대비 모드, 글자 크기 조절, 키보드 네비게이션을 지원하여 모든 사용자가 편리하게 이용할 수 있습니다.",
    target: ".accessibility-controls",
    position: "bottom",
    autoNext: true,
    delay: 3000
  },
  {
    id: "completion",
    title: "튜토리얼 완료!",
    description: "EduAssess의 주요 기능을 모두 살펴보았습니다. 이제 직접 문제를 만들고 학생들을 평가해보세요. 궁금한 점이 있으면 언제든 도움말을 참조하세요.",
    position: "center",
    autoNext: true,
    delay: 4000
  }
];

export const studentTutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "학생용 EduAssess에 오신 것을 환영합니다!",
    description: "온라인 시험 시스템의 사용법을 안내해드리겠습니다. 게임화 요소도 함께 체험해보세요!",
    position: "center",
    autoNext: true,
    delay: 4000
  },
  {
    id: "student-dashboard",
    title: "학생 대시보드",
    description: "여기서 현재 레벨, 포인트, 획득한 배지를 확인할 수 있습니다. 학습할수록 더 많은 보상을 받을 수 있어요!",
    target: ".progress-bar-container",
    position: "bottom",
    autoNext: true,
    delay: 4000
  },
  {
    id: "gamification-features",
    title: "게임화 시스템",
    description: "시험을 완료하면 포인트를 획득하고 레벨업할 수 있습니다. 특별한 성취를 달성하면 배지도 받을 수 있어요!",
    target: ".gamification-section",
    position: "top",
    autoNext: true,
    delay: 4000
  },
  {
    id: "available-quizzes",
    title: "시험 목록",
    description: "사용 가능한 시험들이 여기에 표시됩니다. 각 시험의 문제 수와 제한 시간을 확인할 수 있습니다.",
    target: ".quiz-list",
    position: "top",
    autoNext: true,
    delay: 3000
  },
  {
    id: "take-quiz",
    title: "시험 응시하기",
    description: "'시험 시작' 버튼을 클릭하면 온라인 시험이 시작됩니다. 시간 제한이 있는 시험의 경우 타이머가 표시됩니다.",
    target: ".quiz-start-button",
    position: "left",
    interactive: true,
    action: "click"
  },
  {
    id: "quiz-navigation",
    title: "시험 중 네비게이션",
    description: "문제 사이를 자유롭게 이동할 수 있습니다. 의심스러운 문제는 플래그를 표시해두고 나중에 다시 확인할 수 있어요.",
    target: ".quiz-navigation",
    position: "top",
    autoNext: true,
    delay: 4000
  },
  {
    id: "achievements",
    title: "성취 시스템",
    description: "다양한 성취를 완료하면 추가 포인트를 받을 수 있습니다. 연속 학습, 높은 점수 등의 목표를 달성해보세요!",
    target: ".achievement-tracker",
    position: "top",
    autoNext: true,
    delay: 4000
  },
  {
    id: "badges",
    title: "배지 컬렉션",
    description: "특별한 조건을 만족하면 배지를 획득할 수 있습니다. 일반부터 전설급까지 다양한 등급의 배지가 있어요!",
    target: ".badge-showcase",
    position: "top",
    autoNext: true,
    delay: 4000
  },
  {
    id: "accessibility-student",
    title: "접근성 기능",
    description: "고대비 모드와 글자 크기 조절 기능을 사용하여 더 편리하게 시험을 응시할 수 있습니다.",
    target: ".accessibility-controls",
    position: "bottom",
    autoNext: true,
    delay: 3000
  },
  {
    id: "completion",
    title: "준비 완료!",
    description: "이제 온라인 시험 시스템 사용법을 모두 익혔습니다. 열심히 공부하고 좋은 성적을 거두세요. 화이팅!",
    position: "center",
    autoNext: true,
    delay: 4000
  }
];

export const accessibilityTutorialSteps: TutorialStep[] = [
  {
    id: "accessibility-welcome",
    title: "접근성 기능 가이드",
    description: "EduAssess는 모든 사용자가 편리하게 이용할 수 있도록 다양한 접근성 기능을 제공합니다.",
    position: "center",
    autoNext: true,
    delay: 3000
  },
  {
    id: "high-contrast",
    title: "고대비 모드",
    description: "고대비 모드를 활성화하면 텍스트와 배경의 대비가 강화되어 시각적 가독성이 향상됩니다. 버튼을 클릭해보세요.",
    target: ".high-contrast-toggle",
    position: "bottom",
    interactive: true,
    action: "click"
  },
  {
    id: "font-size",
    title: "글자 크기 조절",
    description: "드롭다운 메뉴에서 작은 글씨부터 매우 큰 글씨까지 4단계로 조절할 수 있습니다.",
    target: ".font-size-selector",
    position: "bottom",
    interactive: true,
    action: "click"
  },
  {
    id: "keyboard-navigation",
    title: "키보드 네비게이션",
    description: "Tab 키로 요소 간 이동, Enter로 선택, Space로 체크박스 토글이 가능합니다. 마우스 없이도 모든 기능을 사용할 수 있어요.",
    position: "center",
    autoNext: true,
    delay: 4000
  },
  {
    id: "screen-reader",
    title: "스크린 리더 지원",
    description: "모든 UI 요소에 적절한 ARIA 라벨이 설정되어 있어 스크린 리더 사용자도 원활하게 이용할 수 있습니다.",
    position: "center",
    autoNext: true,
    delay: 4000
  }
];

export function getTutorialSteps(type: "teacher" | "student" | "accessibility"): TutorialStep[] {
  switch (type) {
    case "teacher":
      return teacherTutorialSteps;
    case "student":
      return studentTutorialSteps;
    case "accessibility":
      return accessibilityTutorialSteps;
    default:
      return [];
  }
}