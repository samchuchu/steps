import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { InstructionStep } from '../types';

interface InstructionBubbleProps {
  step: InstructionStep;
  onComplete: (id: string) => void;
}

export const InstructionBubble: React.FC<InstructionBubbleProps> = ({ step, onComplete }) => {
  const isCompleted = step.status === 'completed';
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the button when the step changes (for keyboard users)
  useEffect(() => {
    if (!isCompleted && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [step.id, isCompleted]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <motion.button
        ref={buttonRef}
        layout
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={
            isCompleted 
            ? { 
                scale: [1, 1.05, 1],
                opacity: 1,
                filter: "blur(0px)",
                transition: { 
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                }
              }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)", transition: { duration: 0.1 } }}
        onClick={() => !isCompleted && onComplete(step.id)}
        disabled={isCompleted}
        aria-label={
            isCompleted 
            ? `Step completed: ${step.title}` 
            : `Current step: ${step.title}. ${step.description || ''}. Click to complete.`
        }
        style={isCompleted ? {
            backgroundImage: `url('https://raw.githubusercontent.com/samchuchu/morrow/refs/heads/main/bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 40px rgba(0,0,0,0.2)'
        } : {}}
        className={`
          group relative flex flex-col items-center justify-center
          w-80 h-80 rounded-full 
          transition-all duration-700 ease-in-out
          border-4 outline-none
          focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-4
          ${isCompleted 
            ? 'border-transparent text-white cursor-default' 
            : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-white hover:border-blue-300 hover:scale-105 hover:shadow-xl cursor-pointer'
          }
        `}
      >
        {/* Overlay for text readability on image */}
        {isCompleted && (
            <div className="absolute inset-0 bg-black/30 rounded-full backdrop-blur-[1px]" />
        )}

        <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-4">
          
          <h3 className={`text-3xl font-bold tracking-tight leading-tight px-4 ${isCompleted ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>
            {step.title}
          </h3>
          
          {!isCompleted && step.description && (
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-[90%]">
              {step.description}
            </p>
          )}
        </div>
      </motion.button>

      {/* Hint Text - Moved outside the button */}
      {!isCompleted && (
        <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse pointer-events-none"
        >
            Click to Complete
        </motion.span>
      )}
    </div>
  );
};
