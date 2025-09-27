import React, { useState } from 'react';
import { Play, RotateCcw, Save, Pause, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface CodeBlock {
  id: string;
  type: 'event' | 'motion' | 'looks' | 'sound' | 'control' | 'sensing' | 'operators' | 'variables';
  text: string;
  color: string;
  icon: string;
}

interface SpriteState {
  x: number;
  y: number;
  rotation: number;
  visible: boolean;
  message: string;
  messageVisible: boolean;
  scale: number;
  color: string;
}

interface Instruction {
  id: number;
  title: string;
  description: string;
  steps: string[];
  goal: string;
  hint: string;
}

interface InstructionStep {
  type: 'goal' | 'hint' | 'step';
  content: string;
  stepNumber?: number;
}

const LearnToCode: React.FC = () => {
  const [workspace, setWorkspace] = useState<CodeBlock[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('event');
  const [isRunning, setIsRunning] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0: goal, 1: hint, 2+: steps
  const [spriteState, setSpriteState] = useState<SpriteState>({
    x: 0, // Center coordinate
    y: 0, // Center coordinate
    rotation: 0,
    visible: true,
    message: '',
    messageVisible: false,
    scale: 1,
    color: '#3b82f6'
  });

  const instructions: Instruction[] = [
    {
      id: 1,
      title: "Getting Started",
      description: "Welcome to visual programming! Let's learn how to make our sprite move.",
      steps: [
        "Look at the Code Blocks panel on the left",
        "Click on 'Events' category to see event blocks",
        "Drag the 'When green flag clicked' block to the workspace",
        "This block tells the computer when to start your program"
      ],
      goal: "Add an event block to start your program",
      hint: "Every program needs a starting point - that's what event blocks do!"
    },
    {
      id: 2,
      title: "Making Your Sprite Move",
      description: "Now let's make our sprite move around the stage!",
      steps: [
        "Click on 'Motion' category in the Code Blocks panel",
        "Drag 'Move 10 steps' block under your event block",
        "Click the green 'Run' button to see your sprite move",
        "Try adding more motion blocks to create a path"
      ],
      goal: "Make your sprite move forward",
      hint: "Motion blocks control how your sprite moves around the stage"
    },
    {
      id: 3,
      title: "Turning and Rotating",
      description: "Let's learn how to change the sprite's direction!",
      steps: [
        "Add a 'Turn right 15 degrees' block after your move block",
        "Add another 'Move 10 steps' block",
        "Run your program to see the sprite turn and move",
        "Try different turn angles to create interesting patterns"
      ],
      goal: "Make your sprite turn and move in a new direction",
      hint: "Combining movement and turning creates amazing patterns!"
    },
    {
      id: 4,
      title: "Adding Speech",
      description: "Let's make our sprite talk!",
      steps: [
        "Click on 'Looks' category to see appearance blocks",
        "Drag 'Say Hello! for 2 seconds' to your workspace",
        "Place it anywhere in your program",
        "Run the program to see your sprite speak"
      ],
      goal: "Make your sprite say something",
      hint: "Speech bubbles appear above your sprite when it talks"
    },
    {
      id: 5,
      title: "Using Loops",
      description: "Learn how to repeat actions with control blocks!",
      steps: [
        "Click on 'Control' category",
        "Drag 'Repeat 10 times' block to your workspace",
        "Put some motion blocks inside the repeat block",
        "Watch your sprite repeat the same actions multiple times"
      ],
      goal: "Create a repeating pattern of movement",
      hint: "Loops save time by repeating code automatically!"
    },
    {
      id: 6,
      title: "Advanced Patterns",
      description: "Combine everything you've learned to create complex programs!",
      steps: [
        "Try combining different types of blocks",
        "Use multiple motion blocks with turns to create shapes",
        "Add speech and color changes for visual effects",
        "Experiment with different timing using wait blocks"
      ],
      goal: "Create a complex program using multiple block types",
      hint: "The best programs combine motion, looks, and control blocks!"
    }
  ];
  const codeBlocks: Record<string, CodeBlock[]> = {
    event: [
      { id: 'event-1', type: 'event', text: 'When green flag clicked', color: 'bg-yellow-500', icon: '🏁' },
      { id: 'event-2', type: 'event', text: 'When space key pressed', color: 'bg-yellow-500', icon: '⌨️' },
      { id: 'event-3', type: 'event', text: 'When this sprite clicked', color: 'bg-yellow-500', icon: '👆' },
    ],
    motion: [
      { id: 'motion-1', type: 'motion', text: 'Move 10 steps', color: 'bg-blue-500', icon: '➡️' },
      { id: 'motion-2', type: 'motion', text: 'Turn right 15 degrees', color: 'bg-blue-500', icon: '🔄' },
      { id: 'motion-3', type: 'motion', text: 'Go to x: 0 y: 0', color: 'bg-blue-500', icon: '📍' },
      { id: 'motion-4', type: 'motion', text: 'Move up 5 steps', color: 'bg-blue-500', icon: '⬆️' },
      { id: 'motion-5', type: 'motion', text: 'Move down 5 steps', color: 'bg-blue-500', icon: '⬇️' },
      { id: 'motion-6', type: 'motion', text: 'Move left 5 steps', color: 'bg-blue-500', icon: '⬅️' },
    ],
    looks: [
      { id: 'looks-1', type: 'looks', text: 'Say "Hello!" for 2 seconds', color: 'bg-purple-500', icon: '💬' },
      { id: 'looks-2', type: 'looks', text: 'Change color effect by 25', color: 'bg-purple-500', icon: '🎨' },
      { id: 'looks-3', type: 'looks', text: 'Show', color: 'bg-purple-500', icon: '👁️' },
    ],
    sound: [
      { id: 'sound-1', type: 'sound', text: 'Play sound "meow"', color: 'bg-pink-500', icon: '🔊' },
      { id: 'sound-2', type: 'sound', text: 'Change volume by 10', color: 'bg-pink-500', icon: '🔊' },
      { id: 'sound-3', type: 'sound', text: 'Set volume to 50%', color: 'bg-pink-500', icon: '🔊' },
    ],
    control: [
      { id: 'control-1', type: 'control', text: 'Wait 1 seconds', color: 'bg-orange-500', icon: '⏱️' },
      { id: 'control-2', type: 'control', text: 'Repeat 10 times', color: 'bg-orange-500', icon: '🔁' },
      { id: 'control-3', type: 'control', text: 'Forever', color: 'bg-orange-500', icon: '♾️' },
    ],
    sensing: [
      { id: 'sensing-1', type: 'sensing', text: 'Touching mouse-pointer?', color: 'bg-cyan-500', icon: '🐭' },
      { id: 'sensing-2', type: 'sensing', text: 'Key space pressed?', color: 'bg-cyan-500', icon: '⌨️' },
      { id: 'sensing-3', type: 'sensing', text: 'Mouse x position', color: 'bg-cyan-500', icon: '📍' },
    ],
  };

  const categories = [
    { id: 'event', name: 'Events', color: 'bg-yellow-500' },
    { id: 'motion', name: 'Motion', color: 'bg-blue-500' },
    { id: 'looks', name: 'Looks', color: 'bg-purple-500' },
    { id: 'sound', name: 'Sound', color: 'bg-pink-500' },
    { id: 'control', name: 'Control', color: 'bg-orange-500' },
    { id: 'sensing', name: 'Sensing', color: 'bg-cyan-500' },
  ];

  const executeBlock = async (block: CodeBlock, index: number) => {
    setCurrentBlockIndex(index);
    
    switch (block.id.split('-')[0]) {
      case 'event':
        // Event blocks don't change sprite state
        break;
        
      case 'motion':
        if (block.text.includes('Move')) {
          const steps = parseInt(block.text.match(/\d+/)?.[0] || '10');
          const radians = (spriteState.rotation * Math.PI) / 180;
          setSpriteState(prev => ({
            ...prev,
            x: Math.max(-9, Math.min(9, prev.x + Math.cos(radians) * steps)),
            y: Math.max(-7, Math.min(7, prev.y - Math.sin(radians) * steps))
          }));
        } else if (block.text.includes('Turn right')) {
          const degrees = parseInt(block.text.match(/\d+/)?.[0] || '15');
          setSpriteState(prev => ({
            ...prev,
            rotation: (prev.rotation + degrees) % 360
          }));
        } else if (block.text.includes('Go to')) {
          setSpriteState(prev => ({
            ...prev,
            x: 0, // Return to center
            y: 0
          }));
        } else if (block.text.includes('Move up')) {
          const steps = parseInt(block.text.match(/\d+/)?.[0] || '5');
          setSpriteState(prev => ({
            ...prev,
            y: Math.max(-7, Math.min(7, prev.y - steps))
          }));
        } else if (block.text.includes('Move down')) {
          const steps = parseInt(block.text.match(/\d+/)?.[0] || '5');
          setSpriteState(prev => ({
            ...prev,
            y: Math.max(-7, Math.min(7, prev.y + steps))
          }));
        } else if (block.text.includes('Move left')) {
          const steps = parseInt(block.text.match(/\d+/)?.[0] || '5');
          setSpriteState(prev => ({
            ...prev,
            x: Math.max(-9, Math.min(9, prev.x - steps))
          }));
        }
        break;
        
      case 'looks':
        if (block.text.includes('Say')) {
          const message = block.text.match(/"([^"]+)"/)?.[1] || 'Hello!';
          setSpriteState(prev => ({
            ...prev,
            message,
            messageVisible: true
          }));
          setTimeout(() => {
            setSpriteState(prev => ({ ...prev, messageVisible: false }));
          }, 2000);
        } else if (block.text.includes('Change color')) {
          const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
          setSpriteState(prev => ({
            ...prev,
            color: colors[Math.floor(Math.random() * colors.length)]
          }));
        } else if (block.text.includes('Show')) {
          setSpriteState(prev => ({ ...prev, visible: true }));
        }
        break;
        
      case 'sound':
        // Visual feedback for sound blocks
        setSpriteState(prev => ({ ...prev, scale: 1.2 }));
        setTimeout(() => {
          setSpriteState(prev => ({ ...prev, scale: 1 }));
        }, 300);
        break;
        
      case 'control':
        if (block.text.includes('Wait')) {
          const seconds = parseInt(block.text.match(/\d+/)?.[0] || '1');
          await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        }
        break;
    }
    
    // Wait between blocks for visual effect
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const runProgram = async () => {
    if (workspace.length === 0) return;
    
    setIsRunning(true);
    setCurrentBlockIndex(-1);
    
    // Reset sprite to starting position
    setSpriteState(prev => ({
      ...prev,
      x: 0, // Center position
      y: 0,
      rotation: 0,
      visible: true,
      message: '',
      messageVisible: false,
      scale: 1,
      color: '#3b82f6'
    }));
    
    // Small delay to show reset
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Execute each block in sequence
    for (let i = 0; i < workspace.length; i++) {
      setCurrentBlockIndex(i);
      await executeBlock(workspace[i], i);
    }
    
    setIsRunning(false);
    setCurrentBlockIndex(-1);
  };

  const stopProgram = () => {
    setIsRunning(false);
    setCurrentBlockIndex(-1);
  };
  const addToWorkspace = (block: CodeBlock) => {
    setWorkspace(prev => [...prev, { ...block, id: `${block.id}-${Date.now()}` }]);
  };

  const removeFromWorkspace = (id: string) => {
    setWorkspace(prev => prev.filter(block => block.id !== id));
  };

  const clearWorkspace = () => {
    setWorkspace([]);
  };

  const nextInstruction = () => {
    if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
      setCurrentStepIndex(0);
    }
  };

  const previousInstruction = () => {
    if (currentInstructionIndex > 0) {
      setCurrentInstructionIndex(currentInstructionIndex - 1);
      setCurrentStepIndex(0);
    }
  };

  const nextStep = () => {
    const currentInstruction = instructions[currentInstructionIndex];
    const totalSteps = 2 + currentInstruction.steps.length; // goal + hint + steps
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
      setCurrentStepIndex(0);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (currentInstructionIndex > 0) {
      setCurrentInstructionIndex(currentInstructionIndex - 1);
      const prevInstruction = instructions[currentInstructionIndex - 1];
      setCurrentStepIndex(1 + prevInstruction.steps.length); // goal + hint + steps - 1
    }
  };

  const getCurrentStep = (): InstructionStep => {
    const currentInstruction = instructions[currentInstructionIndex];
    
    if (currentStepIndex === 0) {
      return { type: 'goal', content: currentInstruction.goal };
    } else if (currentStepIndex === 1) {
      return { type: 'hint', content: currentInstruction.hint };
    } else {
      const stepNumber = currentStepIndex - 2;
      return { 
        type: 'step', 
        content: currentInstruction.steps[stepNumber],
        stepNumber: stepNumber + 1
      };
    }
  };

  const getTotalSteps = () => {
    return instructions.reduce((total, instruction) => total + 2 + instruction.steps.length, 0);
  };

  const getCurrentOverallStep = () => {
    let totalSteps = 0;
    for (let i = 0; i < currentInstructionIndex; i++) {
      totalSteps += 2 + instructions[i].steps.length;
    }
    return totalSteps + currentStepIndex + 1;
  };
  const currentInstruction = instructions[currentInstructionIndex];

  return (
    <div className="animate-fadeIn">
      {/* Instructions Panel */}
      <div className="mb-6">
        {(() => {
          const currentStep = getCurrentStep();
          if (currentStep.type === 'goal') {
            return (
              <div className="bg-black rounded-2xl shadow-lg p-6 border-2 border-gray-700">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                  🎯 Goal
                </h4>
                <p className="text-white">{currentStep.content}</p>
              
              {/* Navigation Arrows */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  onClick={previousStep}
                  disabled={currentInstructionIndex === 0 && currentStepIndex === 0}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    currentInstructionIndex === 0 && currentStepIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentInstructionIndex === instructions.length - 1 && currentStepIndex === 1 + instructions[instructions.length - 1].steps.length}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    currentInstructionIndex === instructions.length - 1 && currentStepIndex === 1 + instructions[instructions.length - 1].steps.length
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              </div>
            );
          } else if (currentStep.type === 'hint') {
            return (
              <div className="bg-black rounded-2xl shadow-lg p-6 border-2 border-gray-700">
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                  💡 Hint
                </h4>
                <p className="text-white">{currentStep.content}</p>
              
              {/* Navigation Arrows */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  onClick={previousStep}
                  disabled={currentInstructionIndex === 0 && currentStepIndex === 0}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    currentInstructionIndex === 0 && currentStepIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentInstructionIndex === instructions.length - 1 && currentStepIndex === 1 + instructions[instructions.length - 1].steps.length}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    currentInstructionIndex === instructions.length - 1 && currentStepIndex === 1 + instructions[instructions.length - 1].steps.length
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              </div>
            );
          } else {
            return (
              <div className="bg-black rounded-2xl shadow-lg p-6 border-2 border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                    {currentStep.stepNumber}
                  </span>
                  <span className="text-blue-400 font-semibold">Step {currentStep.stepNumber}</span>
                </div>
                <p className="text-white">{currentStep.content}</p>
              
              {/* Navigation Arrows */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  onClick={previousStep}
                  disabled={currentInstructionIndex === 0 && currentStepIndex === 0}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    currentInstructionIndex === 0 && currentStepIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentInstructionIndex === instructions.length - 1 && currentStepIndex === 1 + instructions[instructions.length - 1].steps.length}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    currentInstructionIndex === instructions.length - 1 && currentStepIndex === 1 + instructions[instructions.length - 1].steps.length
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              </div>
            );
          }
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Block Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Code Blocks</h2>
          
          <div className="space-y-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {codeBlocks[selectedCategory]?.map(block => (
              <div
                key={block.id}
                onClick={() => addToWorkspace(block)}
                className={`${block.color} text-white p-3 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center`}
              >
                <span className="text-lg mr-2">{block.icon}</span>
                <span className="text-sm font-medium">{block.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Workspace</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={clearWorkspace}
                    className="flex items-center bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                  <button
                    onClick={isRunning ? stopProgram : runProgram}
                    disabled={workspace.length === 0}
                    className={`flex items-center text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      isRunning 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : workspace.length === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-800'
                    } text-sm`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div
              id="workspace"
              className="p-6 h-full overflow-y-auto bg-gray-50"
            >
              {workspace.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <div className="text-4xl mb-4">🧩</div>
                  <p className="text-lg">Drag blocks here to build your program!</p>
                  <p className="text-sm">Start with an event block</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workspace.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => removeFromWorkspace(block.id)}
                      className={`${block.color} text-white p-4 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-between ${
                        currentBlockIndex === index ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{block.icon}</span>
                        <span className="font-medium">{block.text}</span>
                      </div>
                      <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sprite Stage</h2>
          
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 mb-4 h-80 relative overflow-hidden border-2 border-blue-200" style={{ backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `, backgroundSize: '20px 20px', width: '480px', margin: '0 auto' }}>
            {/* Sprite */}
            {spriteState.visible && (
              <div
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  left: `${240 + spriteState.x * 20}px`,
                  top: `${160 + spriteState.y * 20}px`,
                  transform: `translate(-50%, -50%) rotate(${spriteState.rotation}deg) scale(${spriteState.scale})`,
                  color: spriteState.color
                }}
              >
                <div className="text-6xl filter drop-shadow-lg">🧍</div>
                
                {/* Speech bubble */}
                {spriteState.messageVisible && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-gray-200 animate-bounce">
                    <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {spriteState.message}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>
            )}
            
            {/* Stage coordinates */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
              x: {spriteState.x} y: {spriteState.y}
            </div>
            
            {/* Running indicator */}
            {isRunning && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                ▶ RUNNING
              </div>
            )}
            
            {/* Center reference */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-50 border-2 border-white"></div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">📝 Your Program</p>
              <p className="text-xs text-blue-600 mt-1">
                {workspace.length} blocks in workspace
              </p>
              {isRunning && currentBlockIndex >= 0 && (
                <p className="text-xs text-blue-600 mt-1 font-bold">
                  Executing block {currentBlockIndex + 1}
                </p>
              )}
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">🎯 Next Steps</p>
              <p className="text-xs text-green-600 mt-1">
                Try adding more blocks to create complex patterns!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnToCode;