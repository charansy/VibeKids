import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, Lock, Circle, Video, BookOpen, Code, Award, Brain, TestTube, Clock } from 'lucide-react';
import ReusableMindMap from './ReusableMindMap';
import { smartDustbinMindMapData } from '../data/smartDustbinMindMapData';

// TypeScript declarations for Teachable Machine
declare global {
  interface Window {
    tf: any;
    tmImage: any;
  }
}

interface SmartDustbinMissionProps {
  setActiveSection: (section: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
}

type Persona = 'young-explorer' | 'apprentice-engineer';
type ContentType = 'article' | 'video' | 'quiz' | 'lab' | 'code' | 'capstone' | 'activity';
type ViewMode = 'roadmap' | 'content' | 'learning-cards' | 'mind-map';

interface Step {
  id: string;
  title: string;
  type: ContentType;
  completed: boolean;
  locked: boolean;
  module?: string;
  content: {
    youngExplorer: any;
    apprenticeEngineer: any;
  };
}

const SmartDustbinMission: React.FC<SmartDustbinMissionProps> = ({ setActiveSection }) => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('roadmap');
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [isLoadingTeachableMachine, setIsLoadingTeachableMachine] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [predictionLoopId, setPredictionLoopId] = useState<number | null>(null);
  // const [labProgress, setLabProgress] = useState<Record<string, number>>({});

  const personas = {
    'young-explorer': {
      name: 'Young Explorer',
      icon: '🌟',
      description: 'Perfect for curious minds aged 8-12',
      color: 'from-pink-400 to-purple-500'
    },
    'apprentice-engineer': {
      name: 'Apprentice Engineer',
      icon: '⚙️',
      description: 'For future engineers aged 13-18',
      color: 'from-blue-400 to-cyan-500'
    }
  };

  const getStepsForPersona = (persona: Persona): Step[] => {
    const isYoungExplorer = persona === 'young-explorer';
    
    return [
      // Module 1: How Machines See
      {
        id: 'intro-video',
        title: isYoungExplorer ? 'Meet Our Robot Friend!' : 'Smart Waste Management Challenge',
        type: 'video',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Meet Baymax the Smart Dustbin! 🤖',
            description: 'Watch how our robot friend helps keep the Earth clean by sorting trash automatically!',
            duration: '3:45'
          },
          apprenticeEngineer: {
            title: 'The Global Waste Crisis & AI Solutions',
            description: 'Explore how AI-powered systems can revolutionize recycling and waste management.',
            duration: '5:20'
          }
        }
      },
      // Individual Learning Cards - Concepts & Analogies
      {
        id: 'card-1-intro',
        title: isYoungExplorer ? 'What is a Smart Dustbin? 🗑️🤖' : 'Smart Dustbin Introduction',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'What is a Smart Dustbin? 🗑️🤖',
            explanation: 'Imagine you have a super-smart trash can that can see what you\'re throwing and decide where it goes — like a magic helper in your kitchen!',
            keyIdea: 'A smart dustbin uses AI (artificial intelligence) to recognize trash and open automatically.'
          },
          apprenticeEngineer: {
            title: 'Smart Dustbin Introduction',
            explanation: 'An intelligent waste management system that uses computer vision and machine learning to automatically sort and categorize waste materials.',
            keyIdea: 'AI-powered waste sorting system with real-time object recognition and automated bin selection.'
          }
        }
      },
      {
        id: 'card-2-baby-analogy',
        title: isYoungExplorer ? 'Baby Learning Analogy 👶' : 'Machine Learning Analogy',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Baby Learning Analogy 👶',
            concept: 'Just like teaching a baby to recognize a ball!',
            explanation: 'When you show a baby different toys and say "This is a ball" again and again, the baby learns what a ball looks like. The smart trash can learns the same way — people show it pictures of paper, plastic, and food, and tell it "This is paper!" "This is plastic!" Soon, it can see trash and say "Ah, this is plastic!" all by itself.'
          },
          apprenticeEngineer: {
            title: 'Machine Learning Analogy',
            concept: 'Supervised learning through pattern recognition and classification.',
            explanation: 'Similar to how humans learn through repeated exposure and feedback, machine learning algorithms identify patterns in data through training examples.'
          }
        }
      },
      {
        id: 'card-3-pet-door',
        title: isYoungExplorer ? 'Pet Door Analogy 🐕' : 'Conditional Activation System',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Pet Door Analogy 🐕',
            concept: 'Like an automatic pet door that only opens for your cat or dog!',
            explanation: 'Some pet doors only open when they see your pet\'s collar. The smart trash can works the same way — when you walk near it with trash, it looks at what you\'re holding. If it\'s food, the "wet" bin opens. If it\'s a bottle, the "plastic" lid opens.',
            image: '/mlrobot.png'
          },
          apprenticeEngineer: {
            title: 'Conditional Activation System',
            concept: 'Automated system that responds based on detected conditions.',
            explanation: 'The system uses computer vision to detect specific objects and triggers appropriate responses based on classification results.'
          }
        }
      },
      {
        id: 'card-4-quiz-concept',
        title: isYoungExplorer ? 'Quiz - Understanding the Concept 🧠' : 'Concept Assessment',
        type: 'quiz',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            questions: [
              {
                question: 'In our baby analogy, what is the "dataset"?',
                options: [
                  'The baby\'s brain',
                  'All the different toys the baby has seen',
                  'The word "ball"'
                ],
                correct: 1,
                explanation: 'A dataset is the collection of all examples we use to teach the AI.'
              }
            ]
          },
          apprenticeEngineer: {
            questions: [
              {
                question: 'What is the primary purpose of a training dataset in machine learning?',
                options: [
                  'To store the final model',
                  'To provide labeled examples for learning patterns',
                  'To test the model performance'
                ],
                correct: 1,
                explanation: 'Training datasets provide labeled examples that allow the model to learn patterns and relationships.'
              }
            ]
          }
        }
      },
      {
        id: 'card-5-quiz-rules',
        title: isYoungExplorer ? 'Quiz - Why Not Just Rules? 🤔' : 'Why Machine Learning?',
        type: 'quiz',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            questions: [
              {
                question: 'Why can\'t we just tell the AI the "rule" for what trash looks like?',
                options: [
                  'Because AI doesn\'t understand rules',
                  'Because "trash" has huge variety; it\'s easier to learn from examples',
                  'Because computers can\'t see'
                ],
                correct: 1,
                explanation: 'This is the power of machine learning - finding patterns too complex for simple rules.'
              }
            ]
          },
          apprenticeEngineer: {
            questions: [
              {
                question: 'Why is machine learning preferred over rule-based systems for complex pattern recognition?',
                options: [
                  'It\'s faster to implement',
                  'It can handle complex, non-linear patterns that are difficult to encode as rules',
                  'It requires less computational power'
                ],
                correct: 1,
                explanation: 'Machine learning excels at finding complex patterns in high-dimensional data that would be impractical to encode as explicit rules.'
              }
            ]
          }
        }
      },
      // Key Terms
      {
        id: 'card-6-dataset',
        title: isYoungExplorer ? 'Key Term - Dataset 📚' : 'Dataset Definition',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Key Term - Dataset 📚',
            explanation: 'The collection of all photos (of trash and not trash) we use to teach the AI.',
            task: 'If we take 200 photos of hands holding trash and 200 photos of empty hands, our dataset has 400 photos total.'
          },
          apprenticeEngineer: {
            title: 'Dataset Definition',
            explanation: 'A structured collection of data used for training machine learning models.',
            task: 'Dataset = Input Features + Labels. For image classification: Images + Class Labels.'
          }
        }
      },
      {
        id: 'card-7-training',
        title: isYoungExplorer ? 'Key Term - Training 🏋️' : 'Model Training Process',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Key Term - Training 🏋️',
            explanation: 'The process where the AI model looks at our dataset to learn patterns.',
            task: 'Like studying for a test - the AI "studies" all the photos to learn what trash looks like.',
            image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Machine+Learning+Robot'
          },
          apprenticeEngineer: {
            title: 'Model Training Process',
            explanation: 'The iterative process of optimizing model parameters to minimize prediction errors.',
            task: 'Training involves forward propagation, loss calculation, backpropagation, and parameter updates.'
          }
        }
      },
      {
        id: 'card-8-model',
        title: isYoungExplorer ? 'Key Term - Model 🧠' : 'Trained Model',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Key Term - Model 🧠',
            explanation: 'The finished, trained "computer brain" that can now make predictions.',
            task: 'It\'s like the smart brain that the baby developed after seeing many toys - now it can recognize new balls it has never seen before.'
          },
          apprenticeEngineer: {
            title: 'Trained Model',
            explanation: 'The optimized neural network with learned parameters ready for inference.',
            task: 'A trained model can generalize to new, unseen data based on patterns learned during training.'
          }
        }
      },
      {
        id: 'card-9-class',
        title: isYoungExplorer ? 'Key Term - Class/Label 🏷️' : 'Classification Labels',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Key Term - Class/Label 🏷️',
            explanation: 'The name we give to a group of similar things.',
            task: 'In Our Project:\n- Class 1: "Trash"\n- Class 2: "No Trash"'
          },
          apprenticeEngineer: {
            title: 'Classification Labels',
            explanation: 'Categorical identifiers that define the target classes for classification.',
            task: 'Binary Classification: Trash vs No Trash\nMulti-class: Paper, Plastic, Metal, Organic'
          }
        }
      },
      {
        id: 'mind-map',
        title: isYoungExplorer ? 'Interactive Mind Map 🧠' : 'Machine Learning Mind Map 🧠',
        type: 'activity',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'Interactive Mind Map 🧠',
            description: 'Explore the complete machine learning journey with our interactive mind map! Click to discover how AI learns and works.',
            icon: '🧠'
          },
          apprenticeEngineer: {
            title: 'Machine Learning Mind Map 🧠',
            description: 'Comprehensive visual overview of machine learning concepts, hardware integration, and real-world applications.',
            icon: '🧠'
          }
        }
      },
      {
        id: 'ml-basics',
        title: isYoungExplorer ? 'What is Machine Learning?' : 'Machine Learning Fundamentals',
        type: 'article',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'What is Machine Learning? 🧠',
            sections: [
              {
                heading: 'Learning Like a Baby',
                content: 'Just like how babies learn to recognize cats and dogs by seeing many examples, AI learns by looking at thousands of pictures!',
                diagram: '👶 Baby sees cats → 🧠 Learns "cat" → 🐱 Recognizes new cats'
              },
              {
                heading: 'The AI\'s Training',
                content: 'We show the AI thousands of pictures of different trash types. It learns patterns and features to tell them apart!',
                diagram: '📸 Many trash photos → 🧠 AI learns patterns → 🎯 Can sort new trash'
              },
              {
                heading: 'Key Terms',
                content: 'Training: Teaching the AI with examples\nDataset: Collection of pictures\nModel: The AI\'s "brain"\nPrediction: What the AI thinks it sees',
                diagram: '📚 Training + 📊 Dataset = 🧠 Model → 🎯 Prediction'
              }
            ]
          },
          apprenticeEngineer: {
            title: 'Machine Learning Fundamentals',
            sections: [
              {
                heading: 'Supervised Learning',
                content: 'Training a model with labeled data to make predictions on new, unseen data.',
                diagram: 'Input Data + Labels → Training Process → Trained Model → Predictions'
              },
              {
                heading: 'Feature Extraction',
                content: 'The process of identifying and extracting relevant characteristics from raw data.',
                diagram: 'Raw Images → Feature Detection → Numerical Features → Classification'
              },
              {
                heading: 'Model Architecture',
                content: 'Neural networks with layers that process information hierarchically.',
                diagram: 'Input Layer → Hidden Layers → Output Layer → Classification'
              }
            ]
          }
        }
      },
      {
        id: 'ai-learning',
        title: isYoungExplorer ? 'How AI Learns from Examples' : 'Pattern Recognition in AI',
        type: 'video',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            title: 'How AI Learns from Examples 👀',
            description: 'Watch how AI finds patterns in pictures just like you find patterns in puzzles!',
            duration: '4:30'
          },
          apprenticeEngineer: {
            title: 'Pattern Recognition and Feature Learning',
            description: 'Deep dive into how neural networks identify and learn complex patterns in visual data.',
            duration: '6:15'
          }
        }
      },
      {
        id: 'ml-quiz',
        title: isYoungExplorer ? 'Test Your AI Knowledge!' : 'ML Concepts Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        module: 'Module 1: How Machines See',
        content: {
          youngExplorer: {
            questions: [
              {
                question: 'How does AI learn to recognize different objects?',
                options: ['By reading books', 'By looking at many examples', 'By asking humans', 'By guessing'],
                correct: 1,
                explanation: 'AI learns by looking at thousands of examples, just like how you learned to recognize different animals!'
              },
              {
                question: 'What do we call the collection of pictures we use to train AI?',
                options: ['A photo album', 'A dataset', 'A gallery', 'A folder'],
                correct: 1,
                explanation: 'A dataset is the special name for the collection of pictures we use to teach AI!'
              }
            ]
          },
          apprenticeEngineer: {
            questions: [
              {
                question: 'What is the primary goal of supervised learning?',
                options: ['To find patterns in unlabeled data', 'To learn from labeled examples', 'To make random predictions', 'To avoid training'],
                correct: 1,
                explanation: 'Supervised learning uses labeled examples to train models to make accurate predictions on new data.'
              }
            ]
          }
        }
      },
      // Module 2: Teach Your AI
      {
        id: 'data-collection',
        title: isYoungExplorer ? 'Gathering Your Data' : 'Data Collection & Preparation',
        type: 'lab',
        completed: false,
        locked: false,
        module: 'Module 2: Teach Your AI',
        content: {
          youngExplorer: {
            title: 'Gathering Your Data 📸',
            description: 'Use Teachable Machine to capture 200+ images of different trash types!',
            targetSamples: 200,
            categories: ['Plastic Bottles', 'Paper', 'Cans', 'Food Waste', 'Glass']
          },
          apprenticeEngineer: {
            title: 'Data Collection & Preparation',
            description: 'Systematic approach to collecting, labeling, and preparing training data.',
            targetSamples: 500,
            categories: ['Recyclable', 'Non-recyclable', 'Hazardous', 'Organic', 'Electronic']
          }
        }
      },
      {
        id: 'training-process',
        title: isYoungExplorer ? 'The Training Process' : 'Model Training & Optimization',
        type: 'article',
        completed: false,
        locked: false,
        module: 'Module 2: Teach Your AI',
        content: {
          youngExplorer: {
            title: 'The Training Process 🏋️',
            sections: [
              {
                heading: 'Watching Your AI Learn',
                content: 'See your AI get smarter as it looks at more and more pictures! Watch the accuracy numbers go up!',
                diagram: '📊 Accuracy: 20% → 50% → 80% → 95%'
              },
              {
                heading: 'What Happens During Training',
                content: 'The AI looks at each picture, makes a guess, checks if it\'s right, and learns from its mistakes!',
                diagram: '👀 Look → 🤔 Guess → ✅ Check → 📚 Learn'
              }
            ]
          },
          apprenticeEngineer: {
            title: 'Model Training & Optimization',
            sections: [
              {
                heading: 'Training Metrics',
                content: 'Monitoring accuracy, loss, and validation metrics during training.',
                diagram: 'Training Loss ↓ | Validation Accuracy ↑ | Overfitting Prevention'
              },
              {
                heading: 'Epochs and Iterations',
                content: 'Understanding how many times the model sees the entire dataset.',
                diagram: 'One Epoch = One Complete Pass Through Dataset'
              }
            ]
          }
        }
      },
      // Module 3: Build the Brain
      {
        id: 'ai-decision',
        title: isYoungExplorer ? 'The AI\'s Decision' : 'Inference & Prediction',
        type: 'lab',
        completed: false,
        locked: false,
        module: 'Module 3: Build the Brain',
        content: {
          youngExplorer: {
            title: 'The AI\'s Decision 🧠',
            description: 'Test your model live! See how confident it is about each prediction.',
            targetSamples: 50
          },
          apprenticeEngineer: {
            title: 'Inference & Prediction',
            description: 'Real-time model inference with confidence scoring and error analysis.',
            targetSamples: 100
          }
        }
      },
      {
        id: 'code-integration',
        title: isYoungExplorer ? 'From Code to Action' : 'Model Integration & API',
          type: 'code',
          completed: false,
        locked: false,
        module: 'Module 3: Build the Brain',
          content: {
          youngExplorer: {
            title: 'From Code to Action 💻',
            description: 'Export your model and see how it connects to the robot!',
            language: 'blocks',
            starterCode: '// Your AI model code will go here\n// This connects your trained model to the robot'
          },
            apprenticeEngineer: {
            title: 'Model Integration & API',
            description: 'Implementing model inference in production systems with proper error handling.',
              language: 'python',
            starterCode: 'import tensorflow as tf\nimport numpy as np\n\n# Load your trained model\nmodel = tf.keras.models.load_model("your_model.h5")\n\n# Make predictions\ndef predict_trash_type(image):\n    # Your code here\n    pass'
          }
        }
      },
      // Module 4: Build the Body
      {
        id: 'robot-parts',
        title: isYoungExplorer ? 'The Robot\'s Parts' : 'Hardware Architecture',
        type: 'video',
        completed: false,
        locked: false,
        module: 'Module 4: Build the Body',
        content: {
          youngExplorer: {
            title: 'The Robot\'s Parts 🤖',
            description: 'Learn about sensors, microcontrollers, and actuators!',
            duration: '5:00'
          },
          apprenticeEngineer: {
            title: 'Hardware Architecture',
            description: 'Complete hardware design including sensors, processing units, and actuators.',
            duration: '7:30'
          }
        }
      }
    ];
  };

  const [steps, setSteps] = useState<Step[]>([]);

  React.useEffect(() => {
    if (selectedPersona) {
      setSteps(getStepsForPersona(selectedPersona));
    }
  }, [selectedPersona]);

  // Ensure steps are available when currentStep is set
  React.useEffect(() => {
    if (currentStep && selectedPersona && steps.length === 0) {
      setSteps(getStepsForPersona(selectedPersona));
    }
  }, [currentStep, selectedPersona, steps.length]);

  // Auto-select young-explorer persona if none is selected and we're trying to view content
  React.useEffect(() => {
    if (!selectedPersona && currentStep) {
      setSelectedPersona('young-explorer');
    }
  }, [currentStep, selectedPersona]);

  // Load Teachable Machine scripts
  React.useEffect(() => {
    const loadTeachableMachineScripts = async () => {
      try {
        // Load TensorFlow.js
        if (!window.tf) {
          await new Promise((resolve, reject) => {
            const tfScript = document.createElement('script');
            tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
            tfScript.async = true;
            tfScript.onload = resolve;
            tfScript.onerror = reject;
            document.head.appendChild(tfScript);
          });
        }

        // Load Teachable Machine Image library
        if (!window.tmImage) {
          await new Promise((resolve, reject) => {
            const tmScript = document.createElement('script');
            tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js';
            tmScript.async = true;
            tmScript.onload = resolve;
            tmScript.onerror = reject;
            document.head.appendChild(tmScript);
          });
        }

        console.log('Teachable Machine libraries loaded successfully');
      } catch (error) {
        console.error('Error loading Teachable Machine libraries:', error);
      }
    };

    loadTeachableMachineScripts();
  }, []);

  // Preload libraries when lab is accessed
  React.useEffect(() => {
    if (currentStep && steps.find(s => s.id === currentStep)?.type === 'lab') {
      const loadLibrariesIfNeeded = async () => {
        if (!window.tmImage) {
          try {
            await new Promise((resolve, reject) => {
              const tmScript = document.createElement('script');
              tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js';
              tmScript.async = true;
              tmScript.onload = resolve;
              tmScript.onerror = reject;
              document.head.appendChild(tmScript);
            });
          } catch (error) {
            console.error('Error preloading Teachable Machine library:', error);
          }
        }
      };
      loadLibrariesIfNeeded();
    } else {
      // Stop camera if leaving lab
      if (isCameraActive) {
        stopTeachableMachine();
      }
    }
  }, [currentStep, steps]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (predictionLoopId) {
        window.cancelAnimationFrame(predictionLoopId);
      }
    };
  }, [predictionLoopId]);

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'article': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'quiz': return <Brain className="w-4 h-4" />;
      case 'lab': return <TestTube className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'capstone': return <Award className="w-4 h-4" />;
      case 'activity': return <Circle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case 'article': return 'bg-blue-500';
      case 'video': return 'bg-red-500';
      case 'quiz': return 'bg-purple-500';
      case 'lab': return 'bg-green-500';
      case 'code': return 'bg-yellow-500';
      case 'capstone': return 'bg-indigo-500';
      case 'activity': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStepClick = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && (!step.locked || step.completed)) {
      setCurrentStep(stepId);
      setViewMode('content');
    }
  };

  const markStepComplete = (stepId: string) => {
    setSteps(prev => {
      const updated = prev.map(step => {
        if (step.id === stepId) {
          return { ...step, completed: true };
        }
        return step;
      });
      return updated;
    });

    // Show completion message
    setShowCompletionMessage(true);

    // Auto-advance to next lesson
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (nextStep && !nextStep.locked) {
        // Small delay to show completion feedback
        setTimeout(() => {
          setShowCompletionMessage(false);
          setCurrentStep(nextStep.id);
          setViewMode('content');
        }, 2000);
      } else {
        // Hide completion message after delay even if no next lesson
        setTimeout(() => {
          setShowCompletionMessage(false);
        }, 2000);
      }
    } else {
      // Hide completion message after delay if this is the last lesson
      setTimeout(() => {
        setShowCompletionMessage(false);
      }, 2000);
    }
  };

  const canCompleteStep = (stepId: string): boolean => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;

    // For now, allow completion of any unlocked step
    return !step.locked;
  };

  // Alternative webcam setup using native getUserMedia
  const initNativeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 200, height: 200 } 
      });
      
      const webcamContainer = document.getElementById("webcam-container");
      const labelContainer = document.getElementById("label-container");
      
      if (webcamContainer && labelContainer) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.borderRadius = '8px';
        video.style.border = '2px solid #e5e7eb';
        
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(video);
        
        // Setup prediction labels for native webcam
        labelContainer.innerHTML = '';
        const classes = ['bottle', 'wallet'];
        console.log('Creating prediction labels for native webcam...');
        for (let i = 0; i < classes.length; i++) {
          const labelDiv = document.createElement("div");
          labelDiv.className = "p-3 bg-white rounded-lg border border-gray-200 shadow-sm mb-2";
          labelDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
              <span class="prediction-name text-sm font-medium text-gray-700">${classes[i]}</span>
              <span class="prediction-percentage text-sm font-bold text-gray-600">0%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="prediction-bar h-2 rounded-full bg-gray-400 transition-all duration-500" style="width: 0%"></div>
            </div>
          `;
          labelContainer.appendChild(labelDiv);
          console.log(`Created label for ${classes[i]}`);
        }
        console.log('Total labels created:', labelContainer.children.length);
        
        // Start demo predictions for native webcam
        startNativePredictions(video, labelContainer);
        
        console.log('Native webcam initialized successfully');
        return { video, stream };
      }
    } catch (error) {
      console.error('Native webcam error:', error);
      throw error;
    }
  };

  // Start demo predictions for native webcam
  const startNativePredictions = (video: HTMLVideoElement, labelContainer: HTMLElement) => {
    let frameCount = 0;
    const classes = ['bottle', 'wallet'];
    
    console.log('Starting native predictions...');
    
    const loop = () => {
      if (!isCameraActive) {
        console.log('Camera not active, stopping predictions');
        return;
      }
      
      // Check if video is still playing
      if (video.readyState < 2) {
        console.log('Video not ready yet, waiting...');
        requestAnimationFrame(loop);
        return;
      }
      
      // Update predictions every 30 frames (roughly 2 times per second)
      if (frameCount % 30 === 0) {
        console.log('Updating predictions...');
        
        // Generate demo predictions
        const predictions = classes.map(className => {
          const baseProbability = Math.random() * 0.8 + 0.1;
          const noise = (Math.random() - 0.5) * 0.2;
          return {
            className,
            probability: Math.max(0, Math.min(1, baseProbability + noise))
          };
        });

        console.log('Generated predictions:', predictions);

        // Update labels
        console.log('Updating labels, total children:', labelContainer.children.length);
        for (let i = 0; i < predictions.length; i++) {
          const prediction = predictions[i];
          const labelDiv = labelContainer.children[i] as HTMLElement;
          
          console.log(`Processing prediction ${i}:`, prediction);
          console.log(`Label div found:`, !!labelDiv);
          
          if (labelDiv) {
            const confidence = prediction.probability;
            const percentage = Math.round(confidence * 100);
            
            console.log(`Updating ${prediction.className}: ${percentage}%`);
            
            const nameSpan = labelDiv.querySelector('.prediction-name') as HTMLElement;
            const percentageSpan = labelDiv.querySelector('.prediction-percentage') as HTMLElement;
            const progressBar = labelDiv.querySelector('.prediction-bar') as HTMLElement;
            
            console.log('Elements found:', {
              nameSpan: !!nameSpan,
              percentageSpan: !!percentageSpan,
              progressBar: !!progressBar
            });
            
            if (nameSpan && percentageSpan && progressBar) {
              percentageSpan.textContent = `${percentage}%`;
              progressBar.style.width = `${percentage}%`;
              
              const colorClass = confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500';
              progressBar.className = `h-2 rounded-full transition-all duration-500 ${colorClass}`;
              
              console.log(`Successfully updated ${prediction.className} to ${percentage}%`);
            } else {
              console.error('Could not find prediction elements for', prediction.className);
              // Try to recreate the structure
              labelDiv.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                  <span class="prediction-name text-sm font-medium text-gray-700">${prediction.className}</span>
                  <span class="prediction-percentage text-sm font-bold text-gray-600">${percentage}%</span>
          </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="prediction-bar h-2 rounded-full transition-all duration-500 ${
                    confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }" style="width: ${percentage}%"></div>
                </div>
              `;
              console.log(`Recreated structure for ${prediction.className}`);
            }
          } else {
            console.error('Could not find label div for index', i);
          }
        }
      }
      
      frameCount++;
      requestAnimationFrame(loop);
    };
    
    // Start the loop after a short delay
    setTimeout(() => {
      console.log('Starting prediction loop...');
      loop();
    }, 1000);
  };

  // Teachable Machine functions
  const initTeachableMachine = async () => {
    setIsLoadingTeachableMachine(true);
    
    try {
      // Check if libraries are loaded with retry mechanism
      let retries = 0;
      const maxRetries = 10;
      
      while (!window.tmImage && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }
      
      if (!window.tmImage) {
        console.log('Teachable Machine library not available, trying native webcam...');
        try {
          await initNativeWebcam();
          setIsLoadingTeachableMachine(false);
          return;
        } catch (nativeError) {
          alert('Camera access failed. Please check camera permissions and try again.');
          setIsLoadingTeachableMachine(false);
          return;
        }
      }

      // Load the actual trained model
      const URL = "./my_model/tm-my-image-model/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      console.log('Loading model from:', modelURL);
      let model;
      let maxPredictions;
      
      try {
        model = await window.tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log('Model loaded successfully, classes:', maxPredictions);
      } catch (modelError) {
        console.warn('Failed to load trained model, using demo mode:', modelError);
        // Fall back to demo mode
        model = null;
        maxPredictions = 2; // Default to 2 classes for demo (bottle, wallet)
      }

        // Setup webcam with better debugging
        const flip = true;
        const webcam = new window.tmImage.Webcam(200, 200, flip);
        
        try {
          console.log('Starting webcam setup...');
          await webcam.setup();
          console.log('Webcam setup successful');
          
          console.log('Starting webcam play...');
          await webcam.play();
          console.log('Webcam play successful');
          
          // Check if canvas is available
          if (webcam.canvas) {
            console.log('Webcam canvas created:', webcam.canvas.width, 'x', webcam.canvas.height);
            console.log('Canvas element:', webcam.canvas);
            
            // Wait a moment for the webcam to start streaming
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Webcam should be streaming now');
            
            // Test if webcam is actually capturing frames
            setTimeout(() => {
              try {
                const ctx = webcam.canvas.getContext('2d');
                if (ctx) {
                  const imageData = ctx.getImageData(0, 0, webcam.canvas.width, webcam.canvas.height);
                  const hasData = imageData.data.some((pixel: number) => pixel !== 0);
                  console.log('Webcam frame data check:', hasData ? 'Has data' : 'No data');
                  
                  if (!hasData) {
                    console.warn('Webcam appears to not be capturing frames, trying native fallback');
                    initNativeWebcam().catch(console.error);
                    return;
                  }
                }
              } catch (testError) {
                console.error('Error testing webcam frames:', testError);
              }
            }, 3000);
            
          } else {
            console.error('Webcam canvas not created');
            throw new Error('Webcam canvas not created');
          }
          
        } catch (webcamError) {
          console.error('Teachable Machine webcam setup error:', webcamError);
          console.log('Trying native webcam as fallback...');
          
          try {
            await initNativeWebcam();
            console.log('Native webcam fallback successful');
            setIsLoadingTeachableMachine(false);
            return;
          } catch (nativeError) {
            console.error('Native webcam fallback also failed:', nativeError);
            // Show user-friendly error message
            const webcamContainer = document.getElementById("webcam-container");
            if (webcamContainer) {
              webcamContainer.innerHTML = `
                <div class="text-center p-4">
                  <div class="text-4xl mb-2">❌</div>
                  <p class="text-red-600 font-semibold">Camera Error</p>
                  <p class="text-sm text-gray-600 mt-2">${webcamError instanceof Error ? webcamError.message : 'Unknown error'}</p>
                  <p class="text-xs text-gray-500 mt-2">Please check camera permissions and try again</p>
                  </div>
              `;
            }
            throw webcamError;
          }
        }

        // Get containers
        const webcamContainer = document.getElementById("webcam-container");
        const labelContainer = document.getElementById("label-container");

        if (webcamContainer && labelContainer) {
          // Clear previous content
          webcamContainer.innerHTML = '';
          labelContainer.innerHTML = '';

          // Add webcam canvas with proper styling
          if (webcam.canvas) {
            console.log('Adding webcam canvas to container...');
            
            // Clear container first
            webcamContainer.innerHTML = '';
            
            // Style the canvas
            webcam.canvas.style.width = '100%';
            webcam.canvas.style.height = 'auto';
            webcam.canvas.style.borderRadius = '8px';
            webcam.canvas.style.border = '2px solid #e5e7eb';
            webcam.canvas.style.backgroundColor = '#000';
            webcam.canvas.style.display = 'block';
            webcam.canvas.style.margin = '0 auto';
            
            // Add canvas to container
            webcamContainer.appendChild(webcam.canvas);
            
            console.log('Canvas added to container, dimensions:', webcam.canvas.width, 'x', webcam.canvas.height);
            
            // Test if webcam is actually capturing frames
            setTimeout(() => {
              try {
                const ctx = webcam.canvas.getContext('2d');
                if (ctx) {
                  const imageData = ctx.getImageData(0, 0, webcam.canvas.width, webcam.canvas.height);
                  const hasData = imageData.data.some((pixel: number) => pixel !== 0);
                  console.log('Webcam frame data check:', hasData ? 'Has data' : 'No data');
                  
                  if (!hasData) {
                    console.warn('Webcam appears to not be capturing frames, trying native fallback');
                    // Try native webcam as fallback
                    initNativeWebcam().catch(console.error);
                  } else {
                    console.log('Webcam is working correctly!');
                  }
                }
              } catch (testError) {
                console.error('Error testing webcam frames:', testError);
              }
            }, 3000);
            
          } else {
            console.error('Webcam canvas not available');
            // Fallback if canvas is not available
            webcamContainer.innerHTML = `
              <div class="text-center p-4">
                <div class="text-4xl mb-2">📷</div>
                <p class="text-gray-600">Camera feed not available</p>
                <p class="text-sm text-gray-500 mt-2">Please check camera permissions</p>
                    </div>
            `;
          }

            // Add prediction labels with proper structure
            const classes = ['bottle', 'wallet']; // Your actual model classes
            console.log('Creating Teachable Machine prediction labels...');
            for (let i = 0; i < maxPredictions; i++) {
              const labelDiv = document.createElement("div");
              labelDiv.className = "p-3 bg-white rounded-lg border border-gray-200 shadow-sm mb-2";
              labelDiv.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                  <span class="prediction-name text-sm font-medium text-gray-700">${classes[i] || 'Class ' + (i + 1)}</span>
                  <span class="prediction-percentage text-sm font-bold text-gray-600">0%</span>
                  </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="prediction-bar h-2 rounded-full bg-gray-400 transition-all duration-500" style="width: 0%"></div>
                </div>
              `;
              labelContainer.appendChild(labelDiv);
              console.log(`Created Teachable Machine label for ${classes[i] || 'Class ' + (i + 1)}`);
            }
            console.log('Total Teachable Machine labels created:', labelContainer.children.length);

        // Start prediction loop with actual model
        let frameCount = 0;
        console.log('Starting Teachable Machine prediction loop...');
        
        const loop = async () => {
          if (!isCameraActive) {
            console.log('Camera not active, stopping Teachable Machine predictions');
            return; // Stop if camera is not active
          }
          
          // Check if webcam is still available
          if (webcam && webcam.canvas) {
            webcam.update();
            
            // Only update predictions every 10 frames (roughly 1.5 times per second at 60fps)
            if (frameCount % 10 === 0) {
              console.log('Updating Teachable Machine predictions...');
              if (model) {
                console.log('Using real model for predictions');
                await predictWithModel(model, webcam.canvas, labelContainer, maxPredictions);
              } else {
                console.log('Using demo predictions');
                await predictDemo(labelContainer, maxPredictions);
              }
            }
          } else {
            console.warn('Webcam not available, stopping prediction loop');
            setIsCameraActive(false);
            return;
          }
          
          frameCount++;
          const loopId = window.requestAnimationFrame(loop);
          setPredictionLoopId(loopId);
        };
        
        setIsCameraActive(true);
        
        // Start the loop after a delay to ensure everything is set up
        setTimeout(() => {
          console.log('Starting Teachable Machine prediction loop...');
          const initialLoopId = window.requestAnimationFrame(loop);
          setPredictionLoopId(initialLoopId);
        }, 2000);
      }
      
      setIsLoadingTeachableMachine(false);
    } catch (error) {
      console.error('Error initializing Teachable Machine:', error);
      alert('Error initializing camera. Please check your browser permissions.');
      setIsLoadingTeachableMachine(false);
    }
  };


  // Stop camera and predictions
  const stopTeachableMachine = () => {
    setIsCameraActive(false);
    if (predictionLoopId) {
      window.cancelAnimationFrame(predictionLoopId);
      setPredictionLoopId(null);
    }
    
    // Clear the webcam container
    const webcamContainer = document.getElementById("webcam-container");
    if (webcamContainer) {
      webcamContainer.innerHTML = `
        <div class="text-center p-4">
          <div class="text-4xl mb-2">📷</div>
          <p class="text-gray-500">Camera stopped</p>
          <p class="text-sm text-gray-400 mt-2">Click "Start Camera" to begin again</p>
            </div>
      `;
    }
  };

  // Real prediction function using the actual trained model
  const predictWithModel = async (model: any, canvas: HTMLCanvasElement, labelContainer: HTMLElement, maxPredictions: number) => {
    try {
      console.log('Running model prediction...');
      // Run the webcam image through the image model
      const prediction = await model.predict(canvas);
      console.log('Model prediction result:', prediction);
      
      // Update labels with stable structure
      console.log('Updating Teachable Machine labels, total children:', labelContainer.children.length);
      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i];
        const labelDiv = labelContainer.children[i] as HTMLElement;
        
        console.log(`Processing Teachable Machine prediction ${i}:`, classPrediction);
        console.log(`Label div found:`, !!labelDiv);
        
        if (labelDiv) {
          const confidence = classPrediction.probability;
          const percentage = Math.round(confidence * 100);
          const className = classPrediction.className;
          
          console.log(`Updating ${className}: ${percentage}%`);
          
          // Only update the percentage and bar, keep the class name stable
          const nameSpan = labelDiv.querySelector('.prediction-name') as HTMLElement;
          const percentageSpan = labelDiv.querySelector('.prediction-percentage') as HTMLElement;
          const progressBar = labelDiv.querySelector('.prediction-bar') as HTMLElement;
          
          console.log('Teachable Machine elements found:', {
            nameSpan: !!nameSpan,
            percentageSpan: !!percentageSpan,
            progressBar: !!progressBar
          });
          
          if (nameSpan && percentageSpan && progressBar) {
            // Update only the dynamic parts - class name stays the same
            percentageSpan.textContent = `${percentage}%`;
            progressBar.style.width = `${percentage}%`;
            
            // Update color based on confidence
            const colorClass = confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500';
            progressBar.className = `h-2 rounded-full transition-all duration-500 ${colorClass}`;
            
            console.log(`Successfully updated ${className} to ${percentage}%`);
          } else {
            console.error('Could not find prediction elements for', className);
            // Create initial structure if it doesn't exist
            labelDiv.innerHTML = `
              <div class="flex items-center justify-between mb-2">
                <span class="prediction-name text-sm font-medium text-gray-700">${className}</span>
                <span class="prediction-percentage text-sm font-bold text-gray-600">${percentage}%</span>
          </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="prediction-bar h-2 rounded-full transition-all duration-500 ${
                  confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                }" style="width: ${percentage}%"></div>
        </div>
            `;
            console.log(`Recreated Teachable Machine structure for ${className}`);
          }
          
          // Set container styling
          labelDiv.className = "p-3 bg-white rounded-lg border border-gray-200 shadow-sm mb-2";
        } else {
          console.error('Could not find label div for index', i);
        }
      }
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  // Demo prediction function with fixed order and smoother updates (fallback)
  const predictDemo = async (labelContainer: HTMLElement, maxPredictions: number) => {
    const classes = ['bottle', 'wallet']; // Your actual model classes
    
    // Generate predictions for each class in FIXED ORDER
    const predictions = classes.map(className => {
      // Add some persistence to make predictions more stable
      const baseProbability = Math.random() * 0.8 + 0.1; // Between 0.1 and 0.9
      const noise = (Math.random() - 0.5) * 0.2; // Small random variation
      return {
        className,
        probability: Math.max(0, Math.min(1, baseProbability + noise))
      };
    });

    // DO NOT SORT - Keep the original order
    // predictions.sort((a, b) => b.probability - a.probability);

    // Update labels with stable structure - only update if structure doesn't exist
    console.log('Updating demo labels, total children:', labelContainer.children.length);
    for (let i = 0; i < maxPredictions; i++) {
      const prediction = predictions[i];
      const labelDiv = labelContainer.children[i] as HTMLElement;
      
      console.log(`Processing demo prediction ${i}:`, prediction);
      console.log(`Label div found:`, !!labelDiv);
      
      if (labelDiv) {
        const confidence = prediction.probability;
        const percentage = Math.round(confidence * 100);
        
        console.log(`Updating demo ${prediction.className}: ${percentage}%`);
        
        // Only update the percentage and bar, keep the class name stable
        const nameSpan = labelDiv.querySelector('.prediction-name') as HTMLElement;
        const percentageSpan = labelDiv.querySelector('.prediction-percentage') as HTMLElement;
        const progressBar = labelDiv.querySelector('.prediction-bar') as HTMLElement;
        
        console.log('Demo elements found:', {
          nameSpan: !!nameSpan,
          percentageSpan: !!percentageSpan,
          progressBar: !!progressBar
        });
        
        if (nameSpan && percentageSpan && progressBar) {
          // Update only the dynamic parts - class name stays the same
          percentageSpan.textContent = `${percentage}%`;
          progressBar.style.width = `${percentage}%`;
          
          // Update color based on confidence
          const colorClass = confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500';
          progressBar.className = `h-2 rounded-full transition-all duration-500 ${colorClass}`;
          
          console.log(`Successfully updated demo ${prediction.className} to ${percentage}%`);
        } else {
          console.error('Could not find demo prediction elements for', prediction.className);
          // Create initial structure if it doesn't exist
          labelDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
              <span class="prediction-name text-sm font-medium text-gray-700">${prediction.className}</span>
              <span class="prediction-percentage text-sm font-bold text-gray-600">${percentage}%</span>
      </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="prediction-bar h-2 rounded-full transition-all duration-500 ${
                confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
              }" style="width: ${percentage}%"></div>
            </div>
          `;
          console.log(`Recreated demo structure for ${prediction.className}`);
        }
        
        // Set container styling
        labelDiv.className = "p-3 bg-white rounded-lg border border-gray-200 shadow-sm mb-2";
      } else {
        console.error('Could not find demo label div for index', i);
      }
    }
  };

  const renderContentView = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step || !selectedPersona) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-gray-600">Content not found</p>
            <p className="text-sm text-gray-500 mt-2">
              Step: {currentStep ? 'Found' : 'Not found'} | Persona: {selectedPersona ? 'Selected' : 'Not selected'}
            </p>
          </div>
        </div>
      );
    }

    const content = step.content[selectedPersona === 'young-explorer' ? 'youngExplorer' : 'apprenticeEngineer'];
    
    // Debug: Log the content structure
    console.log('Step:', step);
    console.log('Selected Persona:', selectedPersona);
    console.log('Content:', content);
    console.log('Content type:', typeof content);
    console.log('Content keys:', content ? Object.keys(content) : 'No content');
    
    // Create fallback content if needed
    const fallbackContent = {
      title: step.type === 'video' ? 'Meet Baymax the Smart Dustbin! 🤖' : 
             step.type === 'article' ? 'Why Do We Need Smart Robots?' : 
             'Content',
      description: step.type === 'video' ? 'Watch how our robot friend helps keep the Earth clean by sorting trash automatically!' : 
                   step.type === 'article' ? 'Learn about the importance of smart robots in waste management' : 
                   'Content description',
      duration: step.type === 'video' ? '3:45' : undefined,
      sections: step.type === 'article' ? [
        {
          heading: 'The Problem',
          content: 'Every day, people throw away lots of trash. Some trash can be recycled to make new things, but some cannot. It\'s hard for people to sort all the trash correctly!',
          diagram: '🗑️ Mixed Trash → 😕 Confused People → 🌍 Sad Planet'
        },
        {
          heading: 'The Solution',
          content: 'Smart robots have special camera eyes that can see different types of trash. They can sort trash much faster and more accurately than humans!',
          diagram: '📷 Robot Eyes → 🧠 Smart Brain → ✅ Perfect Sorting'
        },
        {
          heading: 'How It Helps',
          content: 'When trash is sorted correctly, more things can be recycled. This means less waste goes to landfills and our planet stays cleaner!',
          diagram: '♻️ Recycled Materials → 🏭 New Products → 🌱 Happy Earth'
        }
      ] : undefined
    };
    
    const finalContent = content || fallbackContent;

    return (
      <div className="min-h-screen bg-white">
        {/* Completion Message Overlay */}
        {showCompletionMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Lesson Completed!</h2>
              <p className="text-gray-600 mb-6">Great job! Moving to the next lesson...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={() => setViewMode('roadmap')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Roadmap
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{step.title}</h1>
            <div className="w-32"></div> {/* Spacer */}
          </div>
        </div>

        {/* Content Canvas */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {step.type === 'video' && (
              <div className="bg-black rounded-2xl overflow-hidden aspect-video relative group">
                {/* Video Player */}
                {videoError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📹</div>
                      <h3 className="text-xl font-semibold mb-2">Video Unavailable</h3>
                      <p className="text-gray-300 mb-4">The demo video is currently not available.</p>
                  <button
                        onClick={() => {
                          setVideoError(false);
                          setVideoLoading(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Try Again
                  </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p>Loading video...</p>
                        </div>
                      </div>
                    )}
                    <video
                      ref={(video) => {
                        if (video) {
                          video.onloadedmetadata = () => {
                            setVideoLoading(false);
                          };
                          video.onplay = () => setIsPlaying(true);
                          video.onpause = () => setIsPlaying(false);
                          video.onended = () => setIsPlaying(false);
                          video.onerror = () => {
                            setVideoError(true);
                            setVideoLoading(false);
                          };
                        }
                      }}
                      className="w-full h-full object-cover"
                      controls
                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMWUyOTM3Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIyNSIgcj0iNjAiIGZpbGw9IiMzYjgyZjYiLz4KPHBhdGggZD0iTTM3MCAyMDUgTDM3MCAyNDUgTDM5MCAyMjUgTDM3MCAyMDVaIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSI0MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U21hcnQgQUkgRHVzdGJpbiBEZW1vPC90ZXh0Pgo8L3N2Zz4K"
                    >
                      {step.id === 'ai-learning' ? (
                        <>
                          <source src="/aibin.mp4" type="video/mp4" />
                          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
                        </>
                      ) : (
                        <>
                          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
                          <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
                        </>
                      )}
                      Your browser does not support the video tag.
                    </video>
                  </>
                )}
                
                {/* Video Overlay with Title and Description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {finalContent.title}
                    </h3>
                    <p className="text-gray-200 mb-4 max-w-2xl">
                      {finalContent.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {finalContent.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        Click to play
                      </span>
                </div>
                    </div>
                </div>
                
                {/* Play Button Overlay (when not playing) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => {
                        const video = document.querySelector('video');
                        if (video) {
                          video.play();
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-full transition-all duration-200 hover:scale-110 shadow-2xl"
                    >
                      <Play className="w-12 h-12" />
                    </button>
                  </div>
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                    Smart AI Dustbin Demo
                  </div>
                </div>
              </div>
            )}

            {step.type === 'article' && (
              <div className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                  {finalContent.title || 'Why Do We Need Smart Robots?'}
                </h1>
                
                {/* Debug: Show content structure */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Debug:</strong> Content type: {typeof finalContent}, 
                    Has sections: {finalContent.sections ? 'Yes' : 'No'}, 
                    Sections count: {finalContent.sections ? finalContent.sections.length : 0}
                  </p>
                </div>
                
                {finalContent.sections && finalContent.sections.map((section: any, index: number) => (
                  <div key={index} className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{section.heading}</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
                    {section.diagram && (
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <div className="font-mono text-center text-blue-800">{section.diagram}</div>
                    </div>
                    )}
                  </div>
                ))}
                
                {/* Fallback content if no sections */}
                {(!finalContent.sections || finalContent.sections.length === 0) && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Problem</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Every day, people throw away lots of trash. Some trash can be recycled to make new things, but some cannot. It's hard for people to sort all the trash correctly!
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <div className="font-mono text-center text-blue-800">🗑️ Mixed Trash → 😕 Confused People → 🌍 Sad Planet</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Solution</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Smart robots have special camera eyes that can see different types of trash. They can sort trash much faster and more accurately than humans!
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <div className="font-mono text-center text-blue-800">📷 Robot Eyes → 🧠 Smart Brain → ✅ Perfect Sorting</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Helps</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        When trash is sorted correctly, more things can be recycled. This means less waste goes to landfills and our planet stays cleaner!
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <div className="font-mono text-center text-blue-800">♻️ Recycled Materials → 🏭 New Products → 🌱 Happy Earth</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step.type === 'quiz' && (
              <div className="max-w-2xl mx-auto">
                {content.questions && content.questions.map((question: any, qIndex: number) => (
                  <div key={qIndex} className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Question {qIndex + 1}: {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((option: string, oIndex: number) => (
                        <button
                          key={oIndex}
                          onClick={() => {
                            const newAnswers = { ...quizAnswers };
                            if (!newAnswers[currentStep!]) newAnswers[currentStep!] = 0;
                            if (oIndex === question.correct) {
                              newAnswers[currentStep!]++;
                            }
                            setQuizAnswers(newAnswers);
                          }}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                            quizAnswers[currentStep!] > qIndex
                              ? oIndex === question.correct
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-red-500 bg-red-50 text-red-800'
                              : 'border-gray-300 bg-gray-50 hover:border-blue-400'
                          }`}
                        >
                          {String.fromCharCode(97 + oIndex)}) {option}
                        </button>
                      ))}
                    </div>
                    {quizAnswers[currentStep!] > qIndex && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-blue-800 text-sm">💡 {question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step.type === 'lab' && (
              <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🧪</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{content.title}</h2>
                    <p className="text-gray-600 text-lg">{content.description}</p>
                </div>

                  {/* Teachable Machine Implementation */}
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Teachable Machine Image Model</h3>
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Using Trained Model: tm-my-image-model (bottle, wallet)
                      </div>
                    </div>
                    
                    <div className="text-center mb-6 space-y-2">
                      {!isCameraActive ? (
                        <>
                          <button 
                            type="button" 
                            onClick={() => initTeachableMachine()}
                            disabled={isLoadingTeachableMachine}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                              isLoadingTeachableMachine
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                            }`}
                          >
                            {isLoadingTeachableMachine ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Loading Libraries...
                              </div>
                            ) : (
                              'Start Camera (Teachable Machine)'
                            )}
                          </button>
                          <br />
                          <button 
                            type="button" 
                            onClick={async () => {
                              setIsLoadingTeachableMachine(true);
                              try {
                                await initNativeWebcam();
                                setIsCameraActive(true);
                              } catch (error) {
                                console.error('Native webcam failed:', error);
                                alert('Camera access failed. Please check permissions.');
                              }
                              setIsLoadingTeachableMachine(false);
                            }}
                            disabled={isLoadingTeachableMachine}
                            className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-green-500 hover:bg-green-600 text-white hover:scale-105 text-sm"
                          >
                            Start Camera (Native)
                          </button>
                          <br />
                          <button 
                            type="button" 
                      onClick={() => {
                              console.log('Camera status check:');
                              console.log('- isCameraActive:', isCameraActive);
                              console.log('- isLoadingTeachableMachine:', isLoadingTeachableMachine);
                              console.log('- Webcam container:', document.getElementById("webcam-container"));
                              console.log('- Label container:', document.getElementById("label-container"));
                            }}
                            className="px-4 py-1 rounded-lg font-medium transition-all duration-200 bg-gray-500 hover:bg-gray-600 text-white hover:scale-105 text-xs"
                          >
                            Debug Info
                          </button>
                        </>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => stopTeachableMachine()}
                          className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-red-500 hover:bg-red-600 text-white hover:scale-105"
                        >
                          Stop Camera
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Live Camera Feed</h4>
                        <div 
                          id="webcam-container" 
                          className="bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden"
                        >
                          <p className="text-gray-500">Click "Start Camera" to begin</p>
                        </div>
                        </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Predictions</h4>
                        <div 
                          id="label-container" 
                          className="bg-gray-50 rounded-lg p-4 min-h-[200px] space-y-2"
                        >
                          <p className="text-gray-500 text-center">Predictions will appear here</p>
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">Target Samples</h3>
                      <div className="text-3xl font-bold text-blue-600">{content.targetSamples}</div>
                  </div>
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-green-800 mb-4">Categories</h3>
                      <div className="space-y-2">
                        {content.categories?.map((category: string, index: number) => (
                          <div key={index} className="text-green-700 font-medium">{category}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-4">Instructions</h3>
                    <p className="text-yellow-700">{content.instructions}</p>
                  </div>
                </div>
                  </div>
                )}

            {step.type === 'code' && (
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{content.title}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{content.language?.toUpperCase()}</span>
                      <button className="text-gray-400 hover:text-white">
                        <Circle className="w-4 h-4" />
                      </button>
                  </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Instructions:</h4>
                    <p className="text-gray-300 text-sm">{content.description}</p>
                </div>

                  <div className="bg-black rounded-lg p-4 mb-4">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{content.starterCode}</code>
                    </pre>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                      Run Code
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                      Submit Solution
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step.type === 'activity' && step.id.startsWith('card-') && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎴</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{finalContent.title}</h2>
                </div>
                
                {/* Key Idea */}
                {finalContent.keyIdea && (
                  <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400 mb-6">
                    <div className="font-semibold text-blue-800 mb-2">Key Idea:</div>
                    <div className="text-blue-700">{finalContent.keyIdea}</div>
                  </div>
                )}

                {/* Concept */}
                {finalContent.concept && (
                  <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400 mb-6">
                    <div className="font-semibold text-green-800 mb-2">The Concept:</div>
                    <div className="text-green-700">{finalContent.concept}</div>
                  </div>
                )}

                {/* Explanation */}
                {finalContent.explanation && (
                  <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-400 mb-6">
                    <div className="font-semibold text-purple-800 mb-2">Explanation:</div>
                    <div className="text-purple-700">{finalContent.explanation}</div>
                  </div>
                )}

                {/* Task */}
                {finalContent.task && (
                  <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400 mb-6">
                    <div className="font-semibold text-orange-800 mb-2">Your Task:</div>
                    <div className="text-orange-700 whitespace-pre-line">{finalContent.task}</div>
                  </div>
                )}

                {/* Image */}
                {finalContent.image && (
                  <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-400 mb-6">
                    <div className="font-semibold text-gray-800 mb-4">Visual Example:</div>
                    <div className="flex justify-center">
                      <img 
                        src={finalContent.image} 
                        alt="Learning concept illustration"
                        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-center mt-8">
                  <button 
                    onClick={() => markStepComplete(step.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                  >
                    Complete Card
                  </button>
                </div>
              </div>
            )}

            {step.type === 'activity' && step.id === 'mind-map' && (
              <ReusableMindMap
                title={content.title}
                description={content.description}
                data={smartDustbinMindMapData}
                onClose={() => {
                  setViewMode('roadmap');
                  setCurrentStep(null);
                }}
                onComplete={() => {
                  markStepComplete(step.id);
                }}
              />
            )}

            {step.type === 'capstone' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{content.title}</h2>
                  <p className="text-gray-600 text-lg">{content.description}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Deliverables:</h3>
                  {content.deliverables?.map((deliverable: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{deliverable}</span>
                      </div>
                    </div>
                    ))}
                  </div>
                
                <div className="text-center mt-8">
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105">
                    Start Capstone Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with completion button */}
        <div className="bg-white p-6">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => markStepComplete(currentStep!)}
              disabled={!canCompleteStep(currentStep!)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                canCompleteStep(currentStep!)
                  ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canCompleteStep(currentStep!) ? 'Complete & Continue' : 'Complete Previous Steps First'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRoadmapView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPersona(null)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Change Persona
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {personas[selectedPersona!].icon} {personas[selectedPersona!].name}
            </h1>
            <p className="text-gray-600 text-lg">{personas[selectedPersona!].description}</p>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-200 ${
                  step.completed
                    ? 'border-green-500 bg-green-50 shadow-green-100'
                    : step.locked
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-blue-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : step.locked
                        ? 'bg-gray-300 text-gray-500'
                        : `${getContentTypeColor(step.type)} text-white hover:scale-110`
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : step.locked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        getContentTypeIcon(step.type)
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                      {step.module && (
                        <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block mt-1">{step.module}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getContentTypeColor(step.type)}`}>
                      {step.type.toUpperCase()}
                    </span>
                    {step.completed && (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={step.locked && !step.completed}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                        step.completed
                          ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:border-green-700'
                          : step.locked
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                          : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 border-blue-600 hover:border-blue-700'
                      }`}
                    >
                      {step.completed ? 'Review' : step.locked ? 'Locked' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Persona selection view
  if (!selectedPersona) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">
            Smart AI Dustbin Mission 🤖
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Choose your learning path and build an intelligent waste sorting robot!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(personas).map(([key, persona]) => (
              <div
                key={key}
                onClick={() => setSelectedPersona(key as Persona)}
                className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${persona.color}`}
              >
                <div className="text-6xl mb-4">{persona.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-4">{persona.name}</h2>
                <p className="text-white text-lg opacity-90">{persona.description}</p>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setActiveSection('courses')}
            className="mt-12 flex items-center text-gray-600 hover:text-gray-800 mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return viewMode === 'roadmap' ? renderRoadmapView() : renderContentView();
};

export default SmartDustbinMission;