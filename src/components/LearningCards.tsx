import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Brain, Lightbulb, Target, Zap, Trophy, RotateCcw } from 'lucide-react';
// Image will be loaded from public folder

interface LearningCard {
  id: number;
  title: string;
  type: 'concept' | 'analogy' | 'quiz' | 'hands-on' | 'key-term' | 'celebration' | 'reflection';
  content: {
    explanation?: string;
    keyIdea?: string;
    concept?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    why?: string;
    task?: string;
    tip?: string;
    whatHappens?: string[];
    waitTime?: string;
    goal?: string;
    whatYoullSee?: string;
    commonProblems?: string[];
    solution?: string;
    whatYouGet?: string[];
    whatYouJustDid?: string[];
    job?: string;
    theCompleteProcess?: string[];
    yourIdeas?: string[];
    thinkAbout?: string[];
    whatYouveBuilt?: string[];
    whatYouveLearned?: string[];
    createYourOwnPoster?: string;
    goal?: string;
    image?: string;
  };
  icon: string;
  color: string;
}

interface LearningCardsProps {
  onBack: () => void;
  onComplete: () => void;
}

const LearningCards: React.FC<LearningCardsProps> = ({ onBack, onComplete }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  const learningCards: LearningCard[] = [
    {
      id: 1,
      title: "Introduction - What is a Smart Dustbin? 🗑️🤖",
      type: "concept",
      content: {
        explanation: "Imagine you have a super-smart trash can that can see what you're throwing and decide where it goes — like a magic helper in your kitchen!",
        keyIdea: "A smart dustbin uses AI (artificial intelligence) to recognize trash and open automatically."
      },
      icon: "🗑️",
      color: "bg-blue-100 border-blue-300"
    },
    {
      id: 2,
      title: "Baby Learning Analogy 👶",
      type: "analogy",
      content: {
        concept: "Just like teaching a baby to recognize a ball!",
        explanation: "When you show a baby different toys and say \"This is a ball\" again and again, the baby learns what a ball looks like. The smart trash can learns the same way — people show it pictures of paper, plastic, and food, and tell it \"This is paper!\" \"This is plastic!\" Soon, it can see trash and say \"Ah, this is plastic!\" all by itself."
      },
      icon: "👶",
      color: "bg-pink-100 border-pink-300"
    },
    {
      id: 3,
      title: "Pet Door Analogy 🐕",
      type: "analogy",
      content: {
        concept: "Like an automatic pet door that only opens for your cat or dog!",
        explanation: "Some pet doors only open when they see your pet's collar. The smart trash can works the same way — when you walk near it with trash, it looks at what you're holding. If it's food, the \"wet\" bin opens. If it's a bottle, the \"plastic\" lid opens.",
        image: "/mlrobot.png"
      },
      icon: "🐕",
      color: "bg-green-100 border-green-300"
    },
    {
      id: 4,
      title: "Quiz - Understanding the Concept 🧠",
      type: "quiz",
      content: {
        question: "In our baby analogy, what is the \"dataset\"?",
        options: [
          "The baby's brain",
          "All the different toys the baby has seen",
          "The word \"ball\""
        ],
        correctAnswer: 1,
        explanation: "A dataset is the collection of all examples we use to teach the AI."
      },
      icon: "🧠",
      color: "bg-purple-100 border-purple-300"
    },
    {
      id: 5,
      title: "Quiz - Why Not Just Rules? 🤔",
      type: "quiz",
      content: {
        question: "Why can't we just tell the AI the \"rule\" for what trash looks like?",
        options: [
          "Because AI doesn't understand rules",
          "Because \"trash\" has huge variety (a bottle looks different from paper); it's easier to learn from examples",
          "Because computers can't see"
        ],
        correctAnswer: 1,
        explanation: "This is the power of machine learning - finding patterns too complex for simple rules."
      },
      icon: "🤔",
      color: "bg-yellow-100 border-yellow-300"
    },
    {
      id: 6,
      title: "Key Term - Dataset 📚",
      type: "key-term",
      content: {
        explanation: "The collection of all photos (of trash and not trash) we use to teach the AI.",
        task: "If we take 200 photos of hands holding trash and 200 photos of empty hands, our dataset has 400 photos total."
      },
      icon: "📚",
      color: "bg-indigo-100 border-indigo-300"
    },
    {
      id: 7,
      title: "Key Term - Training 🏋️",
      type: "key-term",
      content: {
        explanation: "The process where the AI model looks at our dataset to learn patterns.",
        task: "Like studying for a test - the AI \"studies\" all the photos to learn what trash looks like.",
        image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Machine+Learning+Robot'
      },
      icon: "🏋️",
      color: "bg-orange-100 border-orange-300"
    },
    {
      id: 8,
      title: "Key Term - Model 🧠",
      type: "key-term",
      content: {
        explanation: "The finished, trained \"computer brain\" that can now make predictions.",
        task: "It's like the smart brain that the baby developed after seeing many toys - now it can recognize new balls it has never seen before."
      },
      icon: "🧠",
      color: "bg-cyan-100 border-cyan-300"
    },
    {
      id: 9,
      title: "Key Term - Class/Label 🏷️",
      type: "key-term",
      content: {
        explanation: "The name we give to a group of similar things.",
        task: "In Our Project:\n- Class 1: \"Trash\"\n- Class 2: \"No Trash\""
      },
      icon: "🏷️",
      color: "bg-teal-100 border-teal-300"
    },
    {
      id: 10,
      title: "Getting Ready - Teachable Machine Setup 🎯",
      type: "hands-on",
      content: {
        task: "Google's Teachable Machine - a free website that lets you train AI models!",
        whatHappens: [
          "Website: https://teachablemachine.withgoogle.com/",
          "What We'll Make: An AI that can tell the difference between \"Trash\" and \"No Trash\"",
          "Choose: Image Project → Standard image model"
        ]
      },
      icon: "🎯",
      color: "bg-red-100 border-red-300"
    },
    {
      id: 11,
      title: "Hands-On - Creating Class 1 📸",
      type: "hands-on",
      content: {
        task: "Take 200+ photos of your hand holding different pieces of trash:",
        whatHappens: [
          "Paper scraps",
          "Plastic bottles", 
          "Food wrappers",
          "Cans",
          "Any trash items you have"
        ],
        tip: "Take photos from different angles and lighting!"
      },
      icon: "📸",
      color: "bg-amber-100 border-amber-300"
    },
    {
      id: 12,
      title: "Hands-On - Creating Class 2 🖐️",
      type: "hands-on",
      content: {
        task: "Take 200+ photos of:",
        whatHappens: [
          "Your empty hand",
          "Just the floor",
          "Your foot",
          "The wall",
          "Anything that's NOT trash"
        ],
        explanation: "The AI needs to know what \"not trash\" looks like too!"
      },
      icon: "🖐️",
      color: "bg-lime-100 border-lime-300"
    },
    {
      id: 13,
      title: "Quiz - Dataset Building 📊",
      type: "quiz",
      content: {
        question: "You took 250 photos of trash and 200 photos of no trash. How many photos are in your complete dataset?",
        options: [
          "250 photos",
          "200 photos",
          "450 photos"
        ],
        correctAnswer: 2,
        explanation: "Dataset = ALL the photos combined (250 + 200 = 450)"
      },
      icon: "📊",
      color: "bg-emerald-100 border-emerald-300"
    },
    {
      id: 14,
      title: "Hands-On - Training Your Model 🏋️‍♀️",
      type: "hands-on",
      content: {
        whatHappens: [
          "The computer looks at ALL your photos",
          "It finds patterns (What makes trash look like trash?)",
          "It creates a \"model\" - the AI brain",
          "You'll see graphs showing how well it's learning!"
        ],
        waitTime: "This might take a few minutes - be patient!"
      },
      icon: "🏋️‍♀️",
      color: "bg-rose-100 border-rose-300"
    },
    {
      id: 15,
      title: "Understanding the Training Graphs 📈",
      type: "concept",
      content: {
        explanation: "Accuracy Graph (Should Go Up):\n- Shows how often the AI gets the right answer\n- Higher = better!\n- Goal: Above 90%\n\nLoss Graph (Should Go Down):\n- Shows how many mistakes the AI makes\n- Lower = fewer mistakes!\n- Goal: Close to 0"
      },
      icon: "📈",
      color: "bg-violet-100 border-violet-300"
    },
    {
      id: 16,
      title: "Quiz - Reading the Results 📋",
      type: "quiz",
      content: {
        question: "After training, your Accuracy is 95% and Loss is 0.05. What does this mean?",
        options: [
          "The model failed",
          "The model learned well - it's right 95% of the time with very few mistakes",
          "You need more photos"
        ],
        correctAnswer: 1,
        explanation: "The model learned well - it's right 95% of the time with very few mistakes"
      },
      icon: "📋",
      color: "bg-sky-100 border-sky-300"
    },
    {
      id: 17,
      title: "Hands-On - Testing Your Model 🧪",
      type: "hands-on",
      content: {
        task: "First Test:",
        whatHappens: [
          "Click \"Preview\" in Teachable Machine",
          "Hold up trash in front of your webcam",
          "Hold up your empty hand",
          "Watch the confidence scores!"
        ],
        whatYoullSee: "\"Trash: 95%\" when you show trash\n\"No Trash: 98%\" when you show empty hand"
      },
      icon: "🧪",
      color: "bg-fuchsia-100 border-fuchsia-300"
    },
    {
      id: 18,
      title: "Quiz - Understanding Confidence 🎯",
      type: "quiz",
      content: {
        question: "Your model shows \"Trash: 78%\" when you hold up a bottle. What does this mean?",
        options: [
          "The model is broken",
          "The model thinks there's a 78% chance it's trash",
          "You need exactly 78 more photos"
        ],
        correctAnswer: 1,
        explanation: "Confidence scores show how \"sure\" the AI is about its guess."
      },
      icon: "🎯",
      color: "bg-slate-100 border-slate-300"
    },
    {
      id: 19,
      title: "When Things Go Wrong 😅",
      type: "concept",
      content: {
        commonProblems: [
          "Model says \"Trash\" when you show empty hand",
          "Model says \"No Trash\" when you show obvious trash",
          "Confidence scores are always low (like 60%)"
        ],
        solution: "Add more photos and retrain!",
        explanation: "This is normal - even professional AI engineers go through this!"
      },
      icon: "😅",
      color: "bg-gray-100 border-gray-300"
    },
    {
      id: 20,
      title: "Quiz - Improving Your Model 🔧",
      type: "quiz",
      content: {
        question: "Your model keeps confusing your empty hand for trash. What should you do?",
        options: [
          "Take the same photos again",
          "Add MORE photos of empty hands from different angles and retrain",
          "Use a different website"
        ],
        correctAnswer: 1,
        explanation: "The model needs more examples to learn the difference better."
      },
      icon: "🔧",
      color: "bg-stone-100 border-stone-300"
    },
    {
      id: 21,
      title: "Hands-On - Export Your Model 💾",
      type: "hands-on",
      content: {
        task: "After Your Model Works Well:",
        whatHappens: [
          "Click \"Export Model\"",
          "Choose \"Download\" → \"Tensorflow.js\"",
          "This gives you files to use with hardware!"
        ],
        whatYouGet: [
          "model.json (the AI brain)",
          "weights.bin (the AI's memory)",
          "Code snippets to use your model"
        ]
      },
      icon: "💾",
      color: "bg-neutral-100 border-neutral-300"
    },
    {
      id: 22,
      title: "Celebration - You Trained Real AI! 🎉",
      type: "celebration",
      content: {
        whatYouJustDid: [
          "Created a dataset of 400+ images",
          "Trained a machine learning model",
          "Tested and improved your AI",
          "Exported a working AI model"
        ],
        explanation: "This is REAL AI engineering work!"
      },
      icon: "🎉",
      color: "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300"
    },
    {
      id: 23,
      title: "Hardware - The Webcam 👁️",
      type: "concept",
      content: {
        explanation: "The webcam is the robot's EYES.",
        job: "It takes pictures constantly and asks the AI model: \"Is this trash?\""
      },
      icon: "👁️",
      color: "bg-blue-100 border-blue-300"
    },
    {
      id: 24,
      title: "Hardware - The Computer 💻",
      type: "concept",
      content: {
        explanation: "The computer (laptop) is the robot's BRAIN.",
        job: "It runs the AI model to answer the webcam's question about whether something is trash or not."
      },
      icon: "💻",
      color: "bg-green-100 border-green-300"
    },
    {
      id: 25,
      title: "Hardware - The Micro:bit 🔌",
      type: "concept",
      content: {
        explanation: "The micro:bit is the robot's NERVOUS SYSTEM.",
        job: "The brain (laptop) tells the micro:bit \"I see trash!\" The micro:bit then sends power to the motor."
      },
      icon: "🔌",
      color: "bg-purple-100 border-purple-300"
    },
    {
      id: 26,
      title: "Hardware - The Servo Motor 💪",
      type: "concept",
      content: {
        explanation: "The servo motor is the robot's MUSCLE.",
        job: "It gets a signal from the micro:bit and moves, pulling a string or lever to open the lid."
      },
      icon: "💪",
      color: "bg-red-100 border-red-300"
    },
    {
      id: 27,
      title: "Quiz - Hardware Roles 🔧",
      type: "quiz",
      content: {
        question: "If the servo motor is the muscle, what part is like the spinal cord that carries signals from brain to muscle?",
        options: [
          "The webcam",
          "The micro:bit",
          "The computer"
        ],
        correctAnswer: 1,
        explanation: "It carries the signal from the computer (brain) to the servo motor (muscle)."
      },
      icon: "🔧",
      color: "bg-yellow-100 border-yellow-300"
    },
    {
      id: 28,
      title: "The Signal Chain Flow ⚡",
      type: "concept",
      content: {
        theCompleteProcess: [
          "Webcam (eyes) → takes picture",
          "Computer (brain) → decides \"TRASH!\" or \"NO TRASH!\"",
          "Micro:bit (nervous system) → gets the message",
          "Servo Motor (muscle) → opens or closes lid"
        ]
      },
      icon: "⚡",
      color: "bg-indigo-100 border-indigo-300"
    },
    {
      id: 29,
      title: "Testing and Debugging 🔍",
      type: "concept",
      content: {
        explanation: "Your dustbin will make mistakes! This is normal and expected.",
        commonProblems: [
          "Opens for empty hand (False Positive)",
          "Doesn't open for new trash (False Negative)"
        ],
        solution: "Add more photos to your dataset and retrain!"
      },
      icon: "🔍",
      color: "bg-orange-100 border-orange-300"
    },
    {
      id: 30,
      title: "Quiz - Fixing Mistakes 🛠️",
      type: "quiz",
      content: {
        question: "Your AI keeps mistaking your empty hand for trash. What's the solution?",
        options: [
          "Buy a new motor",
          "Add more examples of empty hands to \"No Trash\" class and retrain",
          "Restart the computer"
        ],
        correctAnswer: 1,
        explanation: "The model needs more examples to learn the difference better."
      },
      icon: "🛠️",
      color: "bg-cyan-100 border-cyan-300"
    },
    {
      id: 31,
      title: "Quiz - More Data Helps How? 📈",
      type: "quiz",
      content: {
        question: "What does MORE training data (pictures) help the AI do?",
        options: [
          "Run faster",
          "Become better at spotting differences and handling new objects",
          "Use less electricity"
        ],
        correctAnswer: 1,
        explanation: "More examples = better pattern recognition!"
      },
      icon: "📈",
      color: "bg-teal-100 border-teal-300"
    },
    {
      id: 32,
      title: "Ethics - Other Uses 💭",
      type: "reflection",
      content: {
        explanation: "Could this technology be used for something else besides a trash can?",
        yourIdeas: [
          "Pet door that only opens for your cat",
          "Garden camera that waters plants when they look dry",
          "Security camera that recognizes family members"
        ]
      },
      icon: "💭",
      color: "bg-pink-100 border-pink-300"
    },
    {
      id: 33,
      title: "Ethics - Potential Problems ⚠️",
      type: "reflection",
      content: {
        explanation: "What could be a PROBLEM if this technology was used everywhere?",
        thinkAbout: [
          "What if it makes mistakes? (reliability)",
          "What if it's used to track people? (privacy)",
          "What happens to people who collect trash for work? (job impact)"
        ]
      },
      icon: "⚠️",
      color: "bg-red-100 border-red-300"
    },
    {
      id: 34,
      title: "Quiz - System Debugging 🐛",
      type: "quiz",
      content: {
        question: "If the lid opens but at the wrong time, where is the problem?",
        options: [
          "Always the hardware (motor, micro:bit)",
          "Always the AI model",
          "Could be either - we need to investigate"
        ],
        correctAnswer: 2,
        explanation: "Complex systems need systematic debugging!"
      },
      icon: "🐛",
      color: "bg-gray-100 border-gray-300"
    },
    {
      id: 35,
      title: "Final Project Summary 🎉",
      type: "celebration",
      content: {
        whatYouveBuilt: [
          "A complete AI system with:",
          "Computer vision (AI that can \"see\")",
          "Hardware integration (sensors and motors)",
          "Real-world application (automatic trash sorting)"
        ],
        whatYouveLearned: [
          "How AI learns from data",
          "How different parts work together",
          "How to test and improve systems",
          "How to think about technology's impact"
        ]
      },
      icon: "🎉",
      color: "bg-gradient-to-r from-green-100 to-blue-100 border-green-300"
    },
    {
      id: 36,
      title: "Reflection Activity 📝",
      type: "reflection",
      content: {
        createYourOwnPoster: "Draw a simple diagram showing:",
        whatHappens: [
          "The webcam (eyes)",
          "The computer (brain)",
          "The micro:bit (nervous system)",
          "The servo motor (muscle)",
          "Arrows showing how they connect"
        ],
        goal: "Explain your smart dustbin to a friend using this poster!"
      },
      icon: "📝",
      color: "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300"
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const card = learningCards[currentCard];
    const isCorrect = selectedAnswer === card.content.correctAnswer;
    
    setShowAnswer(true);
    setTotalQuizzes(prev => prev + 1);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    // Mark card as completed
    setCompletedCards(prev => new Set([...prev, currentCard]));
  };

  const handleNextCard = () => {
    if (currentCard < learningCards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      onComplete();
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'concept': return <BookOpen className="w-6 h-6" />;
      case 'analogy': return <Lightbulb className="w-6 h-6" />;
      case 'quiz': return <Brain className="w-6 h-6" />;
      case 'hands-on': return <Target className="w-6 h-6" />;
      case 'key-term': return <Zap className="w-6 h-6" />;
      case 'celebration': return <Trophy className="w-6 h-6" />;
      case 'reflection': return <RotateCcw className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const currentCardData = learningCards[currentCard];
  const progress = ((currentCard + 1) / learningCards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">Learning Cards</h1>
            <p className="text-sm text-gray-500">{currentCard + 1} of {learningCards.length}</p>
          </div>
          
          <div className="w-24 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Small Title */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {currentCardData.type.replace('-', ' ')}
            </h3>
          </div>

          {/* Card Content */}
          <div className="space-y-3">
            {/* The Concept */}
            {currentCardData.content.explanation && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">The Concept</h4>
                <div className="text-gray-700 leading-relaxed">
                  {currentCardData.content.explanation}
                </div>
              </div>
            )}

            {/* Key idea */}
            {currentCardData.content.keyIdea && (
              <div className="bg-blue-50 rounded p-3 border-l-2 border-blue-400 mb-4">
                <div className="text-sm font-medium text-blue-800 mb-1">Key Concept:</div>
                <div className="text-blue-700 text-sm">{currentCardData.content.keyIdea}</div>
              </div>
            )}

            {/* Concept */}
            {currentCardData.content.concept && (
              <div className="bg-green-50 rounded p-3 border-l-2 border-green-400 mb-4">
                <div className="text-sm font-medium text-green-800 mb-1">Concept:</div>
                <div className="text-green-700 text-sm">{currentCardData.content.concept}</div>
              </div>
            )}

            {/* Quiz Question */}
            {currentCardData.content.question && (
              <div className="bg-purple-50 rounded p-4 border-l-2 border-purple-400">
                <div className="font-medium text-gray-800 mb-3">
                  {currentCardData.content.question}
                </div>
                <div className="space-y-2">
                  {currentCardData.content.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showAnswer}
                      className={`w-full text-left p-3 rounded border transition-all text-sm ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="font-medium text-gray-600 mr-2">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <span className="text-gray-800">{option}</span>
                    </button>
                  ))}
                </div>
                
                {!showAnswer && selectedAnswer !== null && (
                  <button
                    onClick={handleSubmitAnswer}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Submit Answer
                  </button>
                )}
                
                {showAnswer && (
                  <div className="mt-3 p-3 rounded bg-green-50 border border-green-200">
                    <div className="font-medium text-green-800 mb-1 text-sm">
                      {selectedAnswer === currentCardData.content.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                    </div>
                    <div className="text-green-700 text-sm">
                      {currentCardData.content.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Task */}
            {currentCardData.content.task && (
              <div className="bg-orange-50 rounded p-3 border-l-2 border-orange-400">
                <div className="text-sm font-medium text-orange-800 mb-1">Your Task:</div>
                <div className="text-orange-700 text-sm whitespace-pre-line">{currentCardData.content.task}</div>
              </div>
            )}

            {/* Image */}
            {currentCardData.content.image && (
              <div className="bg-white/50 rounded-lg p-4 border-l-4 border-blue-400">
                <div className="font-semibold text-gray-800 mb-4">Visual Example:</div>
                <div className="flex justify-center">
                  <img 
                    src={currentCardData.content.image} 
                    alt="Learning concept illustration"
                    className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            )}

            {/* What happens / Steps */}
            {currentCardData.content.whatHappens && (
              <div className="bg-white/50 rounded-lg p-4 border-l-4 border-indigo-400">
                <div className="font-semibold text-gray-800 mb-2">Steps:</div>
                <ul className="space-y-2">
                  {currentCardData.content.whatHappens.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tip */}
            {currentCardData.content.tip && (
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                <div className="font-semibold text-yellow-800 mb-2">💡 Tip:</div>
                <div className="text-yellow-700">{currentCardData.content.tip}</div>
              </div>
            )}

            {/* Wait time */}
            {currentCardData.content.waitTime && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                <div className="font-semibold text-blue-800 mb-2">⏱️ Wait Time:</div>
                <div className="text-blue-700">{currentCardData.content.waitTime}</div>
              </div>
            )}

            {/* What you'll see */}
            {currentCardData.content.whatYoullSee && (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                <div className="font-semibold text-green-800 mb-2">What You'll See:</div>
                <div className="text-green-700 whitespace-pre-line">{currentCardData.content.whatYoullSee}</div>
              </div>
            )}

            {/* Common problems */}
            {currentCardData.content.commonProblems && (
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                <div className="font-semibold text-red-800 mb-2">Common Problems:</div>
                <ul className="space-y-1">
                  {currentCardData.content.commonProblems.map((problem, index) => (
                    <li key={index} className="text-red-700">• {problem}</li>
                  ))}
                </ul>
                {currentCardData.content.solution && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="font-semibold text-gray-800 mb-1">Solution:</div>
                    <div className="text-gray-700">{currentCardData.content.solution}</div>
                  </div>
                )}
              </div>
            )}

            {/* What you get */}
            {currentCardData.content.whatYouGet && (
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                <div className="font-semibold text-purple-800 mb-2">What You Get:</div>
                <ul className="space-y-1">
                  {currentCardData.content.whatYouGet.map((item, index) => (
                    <li key={index} className="text-purple-700">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What you just did */}
            {currentCardData.content.whatYouJustDid && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-400">
                <div className="font-semibold text-yellow-800 mb-2">What You Just Did:</div>
                <ul className="space-y-1">
                  {currentCardData.content.whatYouJustDid.map((item, index) => (
                    <li key={index} className="text-yellow-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job description */}
            {currentCardData.content.job && (
              <div className="bg-cyan-50 rounded-lg p-4 border-l-4 border-cyan-400">
                <div className="font-semibold text-cyan-800 mb-2">Job:</div>
                <div className="text-cyan-700">{currentCardData.content.job}</div>
              </div>
            )}

            {/* The complete process */}
            {currentCardData.content.theCompleteProcess && (
              <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-400">
                <div className="font-semibold text-indigo-800 mb-2">The Complete Process:</div>
                <ol className="space-y-2">
                  {currentCardData.content.theCompleteProcess.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-indigo-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Your ideas */}
            {currentCardData.content.yourIdeas && (
              <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-400">
                <div className="font-semibold text-pink-800 mb-2">Your Ideas:</div>
                <ul className="space-y-1">
                  {currentCardData.content.yourIdeas.map((idea, index) => (
                    <li key={index} className="text-pink-700">• {idea}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Think about */}
            {currentCardData.content.thinkAbout && (
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                <div className="font-semibold text-red-800 mb-2">Think About:</div>
                <ul className="space-y-1">
                  {currentCardData.content.thinkAbout.map((thought, index) => (
                    <li key={index} className="text-red-700">• {thought}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What you've built */}
            {currentCardData.content.whatYouveBuilt && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-l-4 border-green-400">
                <div className="font-semibold text-green-800 mb-2">What You've Built:</div>
                <ul className="space-y-1">
                  {currentCardData.content.whatYouveBuilt.map((item, index) => (
                    <li key={index} className="text-green-700">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What you've learned */}
            {currentCardData.content.whatYouveLearned && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                <div className="font-semibold text-purple-800 mb-2">What You've Learned:</div>
                <ul className="space-y-1">
                  {currentCardData.content.whatYouveLearned.map((item, index) => (
                    <li key={index} className="text-purple-700">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Create your own poster */}
            {currentCardData.content.createYourOwnPoster && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                <div className="font-semibold text-purple-800 mb-2">Create Your Own Poster:</div>
                <div className="text-purple-700 mb-3">{currentCardData.content.createYourOwnPoster}</div>
                <ul className="space-y-1">
                  {currentCardData.content.whatHappens?.map((item, index) => (
                    <li key={index} className="text-purple-700">• {item}</li>
                  ))}
                </ul>
                {currentCardData.content.goal && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="font-semibold text-gray-800 mb-1">Goal:</div>
                    <div className="text-gray-700">{currentCardData.content.goal}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNextCard}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningCards;
