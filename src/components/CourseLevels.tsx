import React, { useState } from 'react';
import { ArrowLeft, Play, Lock, CheckCircle, Star, Clock, Trophy, Flame, Zap, Book } from 'lucide-react';
import YouTubeLessonContent from './YouTubeLessonContent';

interface Level {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'locked' | 'available' | 'completed';
  points: number;
  type: 'lesson' | 'checkpoint' | 'story' | 'practice';
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  levels: Level[];
}

interface CourseLevelsProps {
  courseId: string;
  setActiveSection: (section: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
}

const CourseLevels: React.FC<CourseLevelsProps> = ({ courseId, setActiveSection, setSelectedCourse }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const courses: Course[] = [
    {
      id: '1',
      title: 'Basics of Electricity',
      description: 'Learn about electric current, voltage, and power',
      icon: '⚡',
      category: 'electricity',
      color: 'from-yellow-400 to-orange-500',
      levels: [
        {
          id: '1-1',
          title: 'What is Electricity?',
          description: 'Understanding the basics of electrical energy',
          duration: '15 min',
          difficulty: 'Easy',
          status: 'completed',
          points: 50,
          type: 'lesson',
          contentType: 'article'
        },
        {
          id: '1-2',
          title: 'Current and Voltage',
          description: 'Learn about electrical current flow',
          duration: '20 min',
          difficulty: 'Easy',
          status: 'completed',
          points: 75,
          type: 'lesson',
          contentType: 'video'
        },
        {
          id: '1-3',
          title: 'Power and Energy',
          description: 'Understanding electrical power',
          duration: '25 min',
          difficulty: 'Medium',
          status: 'available',
          points: 100,
          type: 'lesson',
          contentType: 'quiz'
        },
        {
          id: '1-4',
          title: 'Safety Rules',
          description: 'Electrical safety guidelines',
          duration: '20 min',
          difficulty: 'Easy',
          status: 'locked',
          points: 75,
          type: 'lesson',
          contentType: 'interactive-lab'
        },
        {
          id: '1-5',
          title: 'Practice Session',
          description: 'Test your knowledge',
          duration: '30 min',
          difficulty: 'Medium',
          status: 'locked',
          points: 125,
          type: 'practice',
          contentType: 'coding-exercise'
        },
        {
          id: '1-6',
          title: 'Circuit Basics',
          description: 'Introduction to circuits',
          duration: '35 min',
          difficulty: 'Medium',
          status: 'locked',
          points: 150,
          type: 'lesson',
          contentType: 'article'
        }
      ]
    },
    {
      id: '2',
      title: 'Electric Equipment',
      description: 'Explore different electrical devices and tools',
      icon: '🔌',
      category: 'electricity',
      color: 'from-blue-400 to-purple-500',
      levels: [
        {
          id: '2-1',
          title: 'Multimeters',
          description: 'How to use digital multimeters',
          duration: '30 min',
          difficulty: 'Easy',
          status: 'completed',
          points: 100,
          type: 'lesson'
        },
        {
          id: '2-2',
          title: 'Oscilloscopes',
          description: 'Understanding waveforms',
          duration: '45 min',
          difficulty: 'Medium',
          status: 'available',
          points: 150,
          type: 'lesson'
        },
        {
          id: '2-3',
          title: 'Power Supplies',
          description: 'Different types of power sources',
          duration: '35 min',
          difficulty: 'Medium',
          status: 'locked',
          points: 125,
          type: 'lesson'
        },
        {
          id: '2-4',
          title: 'Signal Generators',
          description: 'Creating test signals',
          duration: '40 min',
          difficulty: 'Hard',
          status: 'locked',
          points: 200,
          type: 'lesson'
        }
      ]
    }
  ];

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="animate-fadeIn text-center py-12">
        <div className="text-6xl mb-4">❓</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Course not found</h3>
        <button
          onClick={() => setSelectedCourse(null)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const handleLevelClick = (level: Level) => {
    if (level.status !== 'locked') {
      setSelectedLevel(level);
    }
  };

  const handleBackToCourse = () => {
    setSelectedLevel(null);
  };

  const handleCompleteLesson = () => {
    // In a real app, this would update the lesson status in the database
    alert('Lesson completed! Great job! 🎉');
    setSelectedLevel(null);
  };

  const completedLevels = course.levels.filter(level => level.status === 'completed').length;
  const totalPoints = course.levels.filter(level => level.status === 'completed').reduce((sum, level) => sum + level.points, 0);
  const currentStreak = 7;

  // Duolingo-style positioning for lessons
  const getLessonPosition = (index: number) => {
    const positions = [
      { left: '50%', transform: 'translateX(-50%)' }, // Center
      { left: '30%', transform: 'translateX(-50%)' }, // Left
      { left: '70%', transform: 'translateX(-50%)' }, // Right
      { left: '45%', transform: 'translateX(-50%)' }, // Left-center
      { left: '55%', transform: 'translateX(-50%)' }, // Right-center
      { left: '35%', transform: 'translateX(-50%)' }, // Left
      { left: '65%', transform: 'translateX(-50%)' }, // Right
      { left: '50%', transform: 'translateX(-50%)' }, // Center
    ];
    return positions[index % positions.length];
  };

  const getLessonIcon = (level: Level) => {
    if (level.status === 'completed') {
      return <CheckCircle className="w-8 h-8 text-white" />;
    } else if (level.status === 'available') {
      if (level.type === 'practice') {
        return <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        </div>;
      }
      return <Play className="w-6 h-6 text-white ml-1" />;
    } else {
      return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getLessonColor = (level: Level) => {
    if (level.status === 'locked') {
      return 'bg-gray-300 border-gray-400';
    }
    
    switch (level.type) {
      case 'practice':
        return level.status === 'completed' ? 'bg-green-500 border-green-600' : 'bg-green-400 border-green-500';
      case 'checkpoint':
        return level.status === 'completed' ? 'bg-purple-500 border-purple-600' : 'bg-purple-400 border-purple-500';
      case 'story':
        return level.status === 'completed' ? 'bg-pink-500 border-pink-600' : 'bg-pink-400 border-pink-500';
      default:
        return level.status === 'completed' ? 'bg-green-500 border-green-600' : 'bg-green-400 border-green-500';
    }
  };

  // If a level is selected, show the lesson content
  if (selectedLevel) {
    return (
      <YouTubeLessonContent
        level={selectedLevel}
        courseTitle={course.title}
        onBack={handleBackToCourse}
        onComplete={handleCompleteLesson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r-2 border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-green-500">Vibe Kids</h1>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-2">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="w-full flex items-center p-3 rounded-xl bg-blue-100 text-blue-600 font-medium hover:bg-blue-200 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🏠</span>
                </div>
                LEARN
              </button>
              
              <button className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">💪</span>
                </div>
                PRACTICE
              </button>
              
              <button className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🏆</span>
                </div>
                LEADERBOARDS
              </button>
              
              <button className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📋</span>
                </div>
                QUESTS
              </button>
              
              <button className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🛒</span>
                </div>
                SHOP
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Header */}
          <div className="bg-green-500 text-white p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-0 opacity-20">
              <div className="text-8xl">⚡</div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex items-center text-white hover:text-green-200 transition-colors mr-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  SECTION {courseId}, UNIT {completedLevels + 1}
                </button>
                
                <div className="ml-auto flex items-center space-x-4">
                  <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                    <Flame className="w-4 h-4 mr-1" />
                    <span className="font-bold">{currentStreak}</span>
                  </div>
                  <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="font-bold">{totalPoints}</span>
                  </div>
                  <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span className="font-bold">1481</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Book className="w-4 h-4 mr-2" />
                GUIDEBOOK
              </button>
            </div>
          </div>

          {/* Lessons Area */}
          <div className="flex">
            {/* Lessons Path */}
            <div className="flex-1 p-8 bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
              <div className="max-w-2xl mx-auto">
                <div className="relative" style={{ minHeight: `${course.levels.length * 110}px` }}>
                  {course.levels.map((level, index) => {
                    const position = getLessonPosition(index);
                    const isLocked = level.status === 'locked';
                    const isCompleted = level.status === 'completed';
                    const isAvailable = level.status === 'available';
                    
                    return (
                      <div
                        key={level.id}
                        className="absolute"
                        style={{
                          top: `${index * 80 + 50}px`,
                          ...position
                        }}
                      >
                        {/* Lesson Node */}
                        <div
                          onClick={() => handleLevelClick(level)}
                          className={`relative transition-all duration-300 ${
                            !isLocked ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                          }`}
                        >
                          {/* Main Circle */}
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg ${
                            getLessonColor(level)
                          } ${isLocked ? 'grayscale' : ''}`}>
                            {getLessonIcon(level)}
                            
                            {/* Pulse animation for available lessons */}
                            {isAvailable && !isCompleted && (
                              <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-30"></div>
                            )}
                          </div>
                          
                          {/* Stars for completed lessons */}
                          {isCompleted && (
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                              <div className="flex space-x-1">
                                {[1, 2, 3].map((star) => (
                                  <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Lesson number */}
                          <div className="absolute -top-2 -right-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow ${
                              !isLocked ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        {/* START label for first available lesson */}
                        {isAvailable && !isCompleted && index === course.levels.findIndex(l => l.status === 'available') && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              START
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Trail Path */}
                  <svg 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ width: '100%', height: `${course.levels.length * 80 + 100}px` }}
                  >
                    <defs>
                      <linearGradient id="trailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path
                      d={(() => {
                        let path = '';
                        course.levels.forEach((_, index) => {
                          const position = getLessonPosition(index);
                          const x = position.left === '50%' ? 50 : 
                                   position.left === '30%' ? 30 : 
                                   position.left === '70%' ? 70 :
                                   position.left === '45%' ? 45 :
                                   position.left === '55%' ? 55 :
                                   position.left === '35%' ? 35 : 65;
                          const y = index * 120 + 82; // 50 + 32 (half of circle height)
                          
                          if (index === 0) {
                            path += `M ${x} ${y}`;
                          } else {
                            // Create smooth curves between points
                            const prevPosition = getLessonPosition(index - 1);
                            const prevX = prevPosition.left === '50%' ? 50 : 
                                         prevPosition.left === '30%' ? 30 : 
                                         prevPosition.left === '70%' ? 70 :
                                         prevPosition.left === '45%' ? 45 :
                                         prevPosition.left === '55%' ? 55 :
                                         prevPosition.left === '35%' ? 35 : 65;
                            const prevY = (index - 1) * 80 + 82;
                            
                            const midY = (prevY + y) / 2;
                            path += ` Q ${prevX} ${midY} ${x} ${y}`;
                          }
                        });
                        return path;
                      })()}
                      stroke="url(#trailGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="8,4"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-white border-l-2 border-gray-200 p-6">
              {/* Semifinals Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Progress</h3>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    VIEW DETAILS
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Trophy className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">You're ranked #4</p>
                      <p className="text-sm text-gray-500">You're almost at the top 3!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Quests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Daily Quests</h3>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    VIEW ALL
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Earn 50 XP</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">50 / 50</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📦</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Score 90% or higher in 3 lessons</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">3 / 3</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📦</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-500 text-lg">🦉</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Get 10 in a row correct in 4 lessons</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">1 / 4</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📦</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLevels;