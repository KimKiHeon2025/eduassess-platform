import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Star } from "lucide-react";

interface PointAnimationProps {
  points: number;
  reason: string;
  visible: boolean;
  onComplete?: () => void;
}

export function PointAnimation({ points, reason, visible, onComplete }: PointAnimationProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <Star className="h-5 w-5 text-yellow-300" />
          <div>
            <div className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span className="font-bold text-lg">{points}P</span>
            </div>
            <p className="text-sm opacity-90">{reason}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LevelUpAnimationProps {
  newLevel: number;
  visible: boolean;
  onComplete?: () => void;
}

export function LevelUpAnimation({ newLevel, visible, onComplete }: LevelUpAnimationProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-8 rounded-2xl shadow-2xl text-center max-w-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <Star className="h-10 w-10 text-yellow-200" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">레벨 업!</h2>
            <p className="text-xl mb-4">레벨 {newLevel} 달성</p>
            <p className="text-sm opacity-90">축하합니다! 새로운 레벨에 도달했습니다.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}