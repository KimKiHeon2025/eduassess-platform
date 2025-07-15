import { useState, useEffect } from "react";

interface OnboardingState {
  hasSeenTutorial: boolean;
  completedSteps: string[];
  currentTutorial: string | null;
  userType: "teacher" | "student" | null;
}

export function useOnboarding() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    hasSeenTutorial: false,
    completedSteps: [],
    currentTutorial: null,
    userType: null
  });

  // Load onboarding state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("onboarding-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setOnboardingState(parsed);
      } catch (error) {
        console.error("Failed to parse onboarding state:", error);
      }
    }

    // Determine user type
    const teacherInfo = localStorage.getItem("teacherInfo");
    const studentInfo = localStorage.getItem("studentInfo");
    
    if (teacherInfo) {
      setOnboardingState(prev => ({ ...prev, userType: "teacher" }));
    } else if (studentInfo) {
      setOnboardingState(prev => ({ ...prev, userType: "student" }));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("onboarding-state", JSON.stringify(onboardingState));
  }, [onboardingState]);

  const startTutorial = (tutorialId: string) => {
    setOnboardingState(prev => ({
      ...prev,
      currentTutorial: tutorialId,
      hasSeenTutorial: true
    }));
  };

  const completeTutorial = (tutorialId: string) => {
    setOnboardingState(prev => ({
      ...prev,
      currentTutorial: null,
      completedSteps: [...prev.completedSteps, tutorialId]
    }));
  };

  const skipTutorial = () => {
    setOnboardingState(prev => ({
      ...prev,
      currentTutorial: null,
      hasSeenTutorial: true
    }));
  };

  const resetOnboarding = () => {
    setOnboardingState({
      hasSeenTutorial: false,
      completedSteps: [],
      currentTutorial: null,
      userType: onboardingState.userType
    });
    localStorage.removeItem("onboarding-state");
  };

  const shouldShowTutorial = (tutorialId: string) => {
    return !onboardingState.completedSteps.includes(tutorialId) && 
           !onboardingState.hasSeenTutorial;
  };

  const markStepCompleted = (stepId: string) => {
    setOnboardingState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, stepId]
    }));
  };

  return {
    onboardingState,
    startTutorial,
    completeTutorial,
    skipTutorial,
    resetOnboarding,
    shouldShowTutorial,
    markStepCompleted
  };
}