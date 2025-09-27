import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Star, Trophy, BookOpen, CheckCircle, Zap, Video, Code, Brain, FileText, PlayCircle, Pause, RotateCcw } from 'lucide-react';

interface Level {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'locked' | 'available' | 'completed';
  points: number;
  type: 'lesson' | 'checkpoint' | 'story' | 'practice';
  contentType?: 'article' | 'video' | 'quiz' | 'interactive-lab' | 'coding-exercise';
  content?: {
    article?: {
      sections: Array<{
        title: string;
        content: string;
        diagram?: string;
      }>;
    };
    video?: {
      url: string;
      thumbnail: string;
      duration: string;
    };
    quiz?: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    };
    interactiveLab?: {
      type: 'teachable-machine' | 'circuit-simulator' | 'code-playground';
      config: any;
    };
    codingExercise?: {
      language: string;
      starterCode: string;
      instructions: string;
      testCases: Array<{ input: string; expected: string }>;
    };
  };
}

interface LessonContentProps {
  level: Level;
  courseTitle: string;
  onBack: () => void;
  onComplete: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ level, courseTitle, onBack, onComplete }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [code, setCode] = useState(level.content?.codingExercise?.starterCode || '');
  const [showFullscreen, setShowFullscreen] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'checkpoint': return '🎯';
      case 'story': return '📖';
      case 'practice': return '💪';
      default: return '📚';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'from-blue-500 to-blue-600';
      case 'checkpoint': return 'from-purple-500 to-purple-600';
      case 'story': return 'from-pink-500 to-pink-600';
      case 'practice': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  // Determine content type based on level data
  const contentType = level.contentType || 'article';
  
  // Generate sample content based on level
  const generateContent = () => {
    if (level.content) return level.content;
    
    // Generate sample content based on level type and title
    const baseContent = {
      article: {
        sections: [
          {
            title: `Understanding ${level.title}`,
            content: `In this lesson, we'll explore the fundamental concepts of ${level.title.toLowerCase()}. This is a ${level.difficulty.toLowerCase()} level lesson that will take approximately ${level.duration} to complete.`,
            diagram: '📊'
          },
          {
            title: 'Key Concepts',
            content: `The main concepts covered in this lesson include:\n\n• Core principles and theories\n• Practical applications\n• Real-world examples\n• Hands-on exercises\n\nBy the end of this lesson, you'll have a solid understanding of ${level.title.toLowerCase()} and be able to apply these concepts in practical situations.`
          },
          {
            title: 'Practice Exercises',
            content: `Now it's time to put your knowledge to the test! Complete the following exercises to reinforce what you've learned:\n\n1. Identify the key components\n2. Apply the concepts to solve problems\n3. Create your own examples\n4. Test your understanding with quizzes`
          }
        ]
      },
      video: {
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Video+Lesson',
        duration: level.duration
      },
      quiz: {
        question: `What is the main focus of ${level.title}?`,
        options: [
          'Basic concepts and principles',
          'Advanced technical details',
          'Historical background',
          'Future applications'
        ],
        correct: 0,
        explanation: `The main focus of ${level.title} is to understand the basic concepts and principles that form the foundation of this topic.`
      },
      interactiveLab: {
        type: 'circuit-simulator',
        config: { components: ['led', 'resistor', 'battery', 'switch'] }
      },
      codingExercise: {
        language: 'javascript',
        starterCode: `// ${level.title} - Coding Exercise
function solveProblem() {
  // Your code here
  return "Hello, World!";
}

// Test your solution
console.log(solveProblem());`,
        instructions: `Complete the function to solve the ${level.title} problem.`,
        testCases: [
          { input: 'test1', expected: 'Hello, World!' },
          { input: 'test2', expected: 'Hello, World!' }
        ]
      }
    };

    return baseContent[contentType as keyof typeof baseContent];
  };

  const content = generateContent();

  // Render different content types
  const renderContentCanvas = () => {
    switch (contentType) {
      case 'article':
        return (
          <div className="min-h-screen bg-white">
            {/* Article Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-20 z-40">
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Course
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-orange-100 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="font-bold text-orange-700">{level.points} XP</span>
                    </div>
                    <div className="flex items-center bg-blue-100 rounded-full px-3 py-1">
                      <Clock className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="font-bold text-blue-700">{level.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 bg-gradient-to-r ${getTypeColor(level.type)}`}>
                    {getTypeIcon(level.type)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{level.title}</h1>
                    <p className="text-gray-600 text-lg">{courseTitle}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {level.description}
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full border ${getDifficultyColor(level.difficulty)}`}>
                    <span className="text-sm font-medium">{level.difficulty}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{level.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">{level.points} points</span>
                  </div>
                </div>
              </div>

              {/* Article Sections */}
              <div className="space-y-8">
                {content.article?.sections.map((section, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-blue-500" />
                      {section.title}
                    </h2>
                    
                    {section.diagram && (
                      <div className="bg-gray-50 rounded-lg p-8 text-center mb-6">
                        <div className="text-6xl mb-4">{section.diagram}</div>
                        <p className="text-gray-600 text-sm">AI-generated diagram illustrating key concepts</p>
                      </div>
                    )}
                    
                    <div className="prose prose-lg max-w-none">
                      {section.content.split('\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Article Actions */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Article
                </button>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="min-h-screen bg-black">
            {/* Video Header */}
            <div className="bg-black bg-opacity-80 text-white sticky top-20 z-40">
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onBack}
                    className="flex items-center text-white hover:text-gray-300 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Course
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-orange-500 bg-opacity-20 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-orange-400 mr-1" />
                      <span className="font-bold text-orange-300">{level.points} XP</span>
                    </div>
                    <div className="flex items-center bg-blue-500 bg-opacity-20 rounded-full px-3 py-1">
                      <Clock className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="font-bold text-blue-300">{level.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-full max-w-6xl mx-4">
                <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                  <div className="aspect-video relative">
                    {isVideoPlaying ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎬</div>
                          <p className="text-white text-lg">Video Player</p>
                          <p className="text-gray-400 text-sm">Video would play here</p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full bg-cover bg-center cursor-pointer flex items-center justify-center"
                        style={{ backgroundImage: `url(${content.video?.thumbnail})` }}
                        onClick={() => setIsVideoPlaying(true)}
                      >
                        <div className="bg-black bg-opacity-50 rounded-full p-6 hover:bg-opacity-70 transition-all">
                          <PlayCircle className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                        >
                          {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>
                        <span className="text-white text-sm">0:00 / {content.video?.duration}</span>
                      </div>
                      
                      <button
                        onClick={() => setShowFullscreen(!showFullscreen)}
                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                      >
                        <span className="text-sm">⛶</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="mt-6 text-center">
                  <h1 className="text-2xl font-bold text-white mb-2">{level.title}</h1>
                  <p className="text-gray-300">{level.description}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
            <div className="max-w-2xl w-full mx-4">
              {/* Quiz Header */}
              <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Course
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-orange-100 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="font-bold text-orange-700">{level.points} XP</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h1>
                <p className="text-gray-600">{level.description}</p>
              </div>

              {/* Quiz Content */}
              <div className="bg-white rounded-b-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Question</h2>
                  <p className="text-lg text-gray-700">{content.quiz?.question}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {content.quiz?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQuizAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        quizAnswer === index
                          ? index === content.quiz?.correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          quizAnswer === index
                            ? index === content.quiz?.correct
                              ? 'border-green-500 bg-green-500'
                              : 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {quizAnswer === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {quizAnswer !== null && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    quizAnswer === content.quiz?.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`font-medium ${
                      quizAnswer === content.quiz?.correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {quizAnswer === content.quiz?.correct ? '✅ Correct!' : '❌ Incorrect'}
                    </p>
                    <p className={`text-sm mt-1 ${
                      quizAnswer === content.quiz?.correct ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {content.quiz?.explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={onComplete}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'interactive-lab':
        return (
          <div className="min-h-screen bg-gray-900">
            {/* Lab Header */}
            <div className="bg-gray-800 text-white sticky top-20 z-40">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onBack}
                    className="flex items-center text-white hover:text-gray-300 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Course
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-orange-500 bg-opacity-20 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-orange-400 mr-1" />
                      <span className="font-bold text-orange-300">{level.points} XP</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Interactive Lab: {content.interactiveLab?.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lab Canvas */}
            <div className="h-screen bg-gray-900 flex items-center justify-center">
              <div className="w-full h-full max-w-6xl mx-4">
                <div className="bg-gray-800 rounded-lg h-full p-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">{level.title}</h1>
                    <p className="text-gray-300">{level.description}</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg h-3/4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🧪</div>
                      <h3 className="text-xl font-bold text-white mb-2">Interactive Lab</h3>
                      <p className="text-gray-300 mb-4">
                        {content.interactiveLab?.type === 'teachable-machine' && 'AI Model Training Interface'}
                        {content.interactiveLab?.type === 'circuit-simulator' && 'Circuit Building Simulator'}
                        {content.interactiveLab?.type === 'code-playground' && 'Code Execution Environment'}
                      </p>
                      <div className="bg-gray-600 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-gray-300">
                          This is where the interactive lab would be embedded. 
                          The lab takes over the entire content canvas with no other distractions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'coding-exercise':
        return (
          <div className="min-h-screen bg-gray-900">
            {/* Code Header */}
            <div className="bg-gray-800 text-white sticky top-20 z-40">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onBack}
                    className="flex items-center text-white hover:text-gray-300 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Course
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-orange-500 bg-opacity-20 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-orange-400 mr-1" />
                      <span className="font-bold text-orange-300">{level.points} XP</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {content.codingExercise?.language} Exercise
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="h-screen bg-gray-900 flex">
              {/* Instructions Panel */}
              <div className="w-1/3 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
                <h1 className="text-xl font-bold text-white mb-4">{level.title}</h1>
                <p className="text-gray-300 mb-6">{level.description}</p>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
                  <p className="text-gray-300 text-sm">{content.codingExercise?.instructions}</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Test Cases</h3>
                  <div className="space-y-2">
                    {content.codingExercise?.testCases.map((testCase, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-gray-300">Input: <code className="bg-gray-600 px-1 rounded">{testCase.input}</code></div>
                        <div className="text-gray-300">Expected: <code className="bg-gray-600 px-1 rounded">{testCase.expected}</code></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Code Editor</h3>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                        Run Code
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Write your code here..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">❓</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Content Loading...</h1>
              <p className="text-gray-600">Unknown content type: {contentType}</p>
            </div>
          </div>
        );
    }
  };

  return renderContentCanvas();
};

export default LessonContent;
