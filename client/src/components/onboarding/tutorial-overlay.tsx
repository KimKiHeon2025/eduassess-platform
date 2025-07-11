import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ArrowDown,
  MousePointer,
  Eye,
  Keyboard
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting element
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

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  userType: "teacher" | "student";
}

export function TutorialOverlay({ 
  steps, 
  isActive, 
  onComplete, 
  onSkip,
  userType 
}: TutorialOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Highlight target element
  useEffect(() => {
    if (currentStep?.target && isActive) {
      const element = document.querySelector(currentStep.target);
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add highlight class
        element.classList.add('tutorial-highlight');
        
        // Add pulse animation for interactive elements
        if (currentStep.interactive) {
          element.classList.add('tutorial-pulse');
        }
      }
    }

    return () => {
      // Clean up highlights
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight', 'tutorial-pulse');
      });
    };
  }, [currentStep, isActive]);

  // Auto-advance logic
  useEffect(() => {
    if (currentStep?.autoNext && isPlaying && isActive) {
      const timer = setTimeout(() => {
        nextStep();
      }, currentStep.delay || 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isPlaying, isActive]);

  // Listen for user interactions on highlighted elements
  useEffect(() => {
    if (!currentStep?.interactive || !highlightedElement) return;

    const handleInteraction = () => {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      if (currentStep.autoNext) {
        setTimeout(() => nextStep(), 1000);
      }
    };

    if (currentStep.action === 'click') {
      highlightedElement.addEventListener('click', handleInteraction);
    } else if (currentStep.action === 'hover') {
      highlightedElement.addEventListener('mouseenter', handleInteraction);
    }

    return () => {
      if (currentStep.action === 'click') {
        highlightedElement.removeEventListener('click', handleInteraction);
      } else if (currentStep.action === 'hover') {
        highlightedElement.removeEventListener('mouseenter', handleInteraction);
      }
    };
  }, [highlightedElement, currentStep]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(new Set(steps.map(step => step.id)));
    onComplete();
  };

  const handleSkip = () => {
    // Clean up any highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight', 'tutorial-pulse');
    });
    onSkip();
  };

  const restartTutorial = () => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsPlaying(true);
  };

  const getTooltipPosition = () => {
    if (!highlightedElement || currentStep?.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const rect = highlightedElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    
    switch (currentStep.position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - 20,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
        };
      case 'bottom':
        return {
          top: rect.bottom + 20,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
        };
      case 'left':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.left - tooltipWidth - 20,
        };
      case 'right':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.right + 20,
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  const getActionIcon = () => {
    switch (currentStep?.action) {
      case 'click':
        return <MousePointer className="h-4 w-4" />;
      case 'hover':
        return <Eye className="h-4 w-4" />;
      case 'type':
        return <Keyboard className="h-4 w-4" />;
      case 'scroll':
        return <ArrowDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Tutorial tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={getTooltipPosition()}
          className="absolute z-10"
        >
          <Card className="w-80 shadow-2xl border-2 border-blue-200">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {userType === 'teacher' ? '교사' : '학생'} 가이드
                    </Badge>
                    {getActionIcon() && (
                      <Badge variant="secondary" className="bg-white/20 text-white flex items-center space-x-1">
                        {getActionIcon()}
                        <span>{currentStep.action}</span>
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold text-lg">{currentStep?.title}</h3>
                <Progress 
                  value={progress} 
                  className="mt-2 h-2 bg-white/20"
                />
                <p className="text-sm mt-1 opacity-90">
                  {currentStepIndex + 1} / {steps.length}
                </p>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {currentStep?.description}
                </p>

                {/* Interactive indicators */}
                {currentStep?.interactive && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      {completedSteps.has(currentStep.id) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          {getActionIcon()}
                        </motion.div>
                      )}
                      <span className="text-sm font-medium">
                        {completedSteps.has(currentStep.id) ? 
                          '완료됨!' : 
                          `${currentStep.action === 'click' ? '클릭' : 
                            currentStep.action === 'hover' ? '마우스 올리기' : 
                            currentStep.action === 'type' ? '입력' : '스크롤'}하세요`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Content media */}
                {currentStep?.content?.image && (
                  <div className="mb-4">
                    <img 
                      src={currentStep.content.image} 
                      alt="Tutorial illustration"
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={!currentStep?.autoNext}
                    >
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={restartTutorial}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      disabled={currentStepIndex === 0}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={nextStep}
                      disabled={currentStep?.interactive && !completedSteps.has(currentStep.id)}
                    >
                      {currentStepIndex === steps.length - 1 ? (
                        '완료'
                      ) : (
                        <>
                          다음
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Highlight spotlight effect */}
        {highlightedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${
                highlightedElement.getBoundingClientRect().left + 
                highlightedElement.getBoundingClientRect().width / 2
              }px ${
                highlightedElement.getBoundingClientRect().top + 
                highlightedElement.getBoundingClientRect().height / 2
              }px, transparent 0px, transparent 120px, rgba(0,0,0,0.6) 150px)`
            }}
          />
        )}
      </div>
    </AnimatePresence>
  );
}