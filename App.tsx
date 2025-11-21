import React, { useState, useEffect } from 'react';
import { InstructionBubble } from './components/InstructionBubble';
import { InstructionStep } from './types';
import { RefreshCw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Define the sequence of steps here. 
// Edit this array to change the content for each step in the flow.
const INSTRUCTION_SEQUENCE = [
  { title: 'LIGHTS ON', description: 'Switch on all lights.' },
  { title: 'SYSTEM UP', description: 'Switch on the PC. The scanner and printer should start running, if not, please check if emergency stop button is pressed down or power supply is switched off. Release the emergency stop button / Switch on the power supply.' },
  { title: 'LOGIN QDR', description: 'User: ^_^ Pass: ^_^' },
  { title: 'ROOM CHECK', description: 'Tidy up the room, move items back to storage if they show up in unusual places.' },
  { title: 'CLEANING', description: 'Use Mikrozid wipes to clean the scanner / table pad.' },
  { title: 'BACK TO PC', description: 'Confirm system is fully up without any error message.' },
  { title: 'DAILY QC', description: 'Select Daily QC.' },
  { title: 'PLACE PHANTOM', description: 'Marking A to the left foot end, align laser cross hair B with the registration mark.' },
  { title: 'START QC', description: 'Press continue and let it run.' },
  { title: 'SYSTEM TEST', description: 'If failed, follow instruction on screen to disolve the problem.' },
  { title: 'AUTO QC', description: 'Passed - click OK. Failed - follow instruction on screen to disolve the problem' },
  { title: 'AUTO BODY COMPOSITION CALIBRATION', description: 'It rund automatically once a week.' },
  { title: 'REMOVE QC PHANTOM', description: 'Follow instruction on screen.' },
  { title: 'UNIFORMITY TEST', description: 'Click Ok to proceed. Done, click OK.' },
  { title: 'CHECK CONNECTION', description: 'Refresh patient list, make sure no connection error message.' },
  { title: 'DAILY QC CHECK LIST', description: 'Complete the checklist, record details of any error message / event.' },
  { title: 'TOP UP', description: 'Gowns / tissue / wipes / look around what is missing.' },
  { title: 'UPDATE', description: 'Quick check appointment scheduler, update colleagues if any arrangement required.' },
  { title: 'READY SET GO', description: 'Delivering caring and positive experience is at the heart of healthcare. Just as important is smooth teamwork. Let's make today a good one 😁' },
];

const App: React.FC = () => {
  const [steps, setSteps] = useState<InstructionStep[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Initial Load
  useEffect(() => {
    if (INSTRUCTION_SEQUENCE.length > 0) {
      setSteps([
        {
          id: 'init-1',
          title: INSTRUCTION_SEQUENCE[0].title,
          description: INSTRUCTION_SEQUENCE[0].description,
          status: 'pending'
        }
      ]);
    }
  }, []);

  const handleComplete = async (id: string) => {
    // 1. Mark current as completed (triggers the fill animation)
    setSteps(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'completed' } : s
    ));

    // Visual delay for the "pulse" to be appreciated
    await new Promise(r => setTimeout(r, 700));

    // 2. Load next step or trigger finale
    const nextIndex = steps.length;
    
    if (nextIndex < INSTRUCTION_SEQUENCE.length) {
        const nextData = INSTRUCTION_SEQUENCE[nextIndex];
        const newStep: InstructionStep = {
            id: `step-${Date.now()}`,
            title: nextData.title,
            description: nextData.description,
            status: 'pending'
        };
        setSteps(prev => [...prev, newStep]);
    } else {
        // End of sequence
        setIsFinished(true);
    }
  };

  const handleReset = () => {
    if(confirm("Reset your flow?")) {
        setIsFinished(false);
        setSteps([{
            id: `init-${Date.now()}`,
            title: INSTRUCTION_SEQUENCE[0].title,
            description: INSTRUCTION_SEQUENCE[0].description,
            status: 'pending'
        }]);
    }
  };

  const handleExit = () => {
    try {
      window.close();
    } catch (e) {
      console.log("Window close prevented by browser", e);
      alert("You can now close this tab.");
    }
  };

  // We only render the last step (active or just completed)
  const currentStep = steps.length > 0 ? steps[steps.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col overflow-hidden">
      
      {/* Header */}
      <AnimatePresence>
        {!isFinished && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md py-4 px-6"
          >
            <div className="max-w-5xl mx-auto flex flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <img 
                  src="https://raw.githubusercontent.com/samchuchu/morrow/refs/heads/main/MORROW%20logo.png" 
                  alt="DXA Logo"
                  className="w-36 h-36 object-contain" 
                />
                <h1 className="font-bold text-3xl sm:text-5xl tracking-tighter text-slate-800 uppercase">
                  DXA - <span className="text-slate-500">Start The Day</span>
                </h1>
              </div>
              
              <div>
                 <button 
                    onClick={handleReset}
                    className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-600 bg-white border border-slate-200 shadow-sm"
                    title="Reset Flow"
                 >
                    <RefreshCw className="w-6 h-6" />
                 </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Flow */}
      <main className="flex-grow w-full flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
            {!isFinished && currentStep && (
                <motion.div
                    key={currentStep.id}
                    className="absolute inset-0 flex items-center justify-center p-6 pt-32"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    // If finished, we want an instant unmount so the overlay takes over smoothly
                    // otherwise standard blur exit
                    exit={ isFinished 
                        ? { opacity: 0, transition: { duration: 0 } } 
                        : { opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.1 } } 
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <InstructionBubble 
                        step={currentStep} 
                        onComplete={handleComplete}
                    />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Finale Overlay */}
        <AnimatePresence>
            {isFinished && (
                <motion.div
                    key="finale"
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cover bg-center"
                    style={{ 
                        backgroundImage: `url('https://raw.githubusercontent.com/samchuchu/morrow/refs/heads/main/bg.png')`,
                    }}
                    // Start as a circle matching the button size (w-80 = 20rem = 320px -> radius 160px)
                    initial={{ clipPath: "circle(160px at center)" }}
                    // Animate to cover screen (150% ensures corners are covered)
                    animate={{ clipPath: "circle(150% at center)" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Dark overlay for text contrast */}
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl tracking-wide"
                        >
                            Thank you ~
                        </motion.h1>

                        <motion.button
                            onClick={handleExit}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="absolute bottom-1 p-4 rounded-full border-2 border-white/50 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <X className="w-8 h-8" strokeWidth={1.5} />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

    </div>
  );
};

export default App;
