import React from 'react';
import { Play, Lock, CheckCircle, Star, Trophy, Flame, Zap, ChevronRight } from 'lucide-react';

interface Level {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'locked' | 'available' | 'completed';
  points: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  category: string;
  levels: Level[];
  color: string;
}

interface CoursesDashboardProps {
  setActiveSection: (section: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

const CoursesDashboard: React.FC<CoursesDashboardProps> = ({ setActiveSection, setSelectedCourse }) => {
  const courses: Course[] = [
    {
      id: '6',
      title: 'Smart AI Dustbin',
      description: 'Build an intelligent waste sorting system with AI',
      progress: 0,
      duration: '6 hours',
      difficulty: 'advanced',
      icon: '🤖',
      category: 'ai-project',
      color: 'from-cyan-400 to-blue-600',
      levels: [
        {
          id: '6-1',
          title: 'Mission Briefing',
          description: 'Understanding the smart dustbin challenge',
          duration: '20 min',
          difficulty: 'Easy',
          status: 'available',
          points: 50
        },
        {
          id: '6-2',
          title: 'AI Training Phase',
          description: 'Train AI to recognize different waste types',
          duration: '90 min',
          difficulty: 'Medium',
          status: 'locked',
          points: 200
        },
        {
          id: '6-3',
          title: 'Hardware Integration',
          description: 'Connect sensors and actuators',
          duration: '120 min',
          difficulty: 'Hard',
          status: 'locked',
          points: 300
        },
        {
          id: '6-4',
          title: 'System Testing',
          description: 'Test and optimize the complete system',
          duration: '90 min',
          difficulty: 'Hard',
          status: 'locked',
          points: 250
        }
      ]
    },
  ];

  const totalXP = courses.reduce((total, course) => {
    return total + course.levels.filter(level => level.status === 'completed').reduce((sum, level) => sum + level.points, 0);
  }, 0);

  const currentStreak = 7;

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Stats */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-orange-100 rounded-full px-4 py-2">
                <Flame className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-bold text-orange-700">{currentStreak}</span>
              </div>
              <div className="flex items-center bg-yellow-100 rounded-full px-4 py-2">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-bold text-yellow-700">{totalXP}</span>
              </div>
              <div className="flex items-center bg-purple-100 rounded-full px-4 py-2">
                <Trophy className="w-5 h-5 text-purple-500 mr-2" />
                <span className="font-bold text-purple-700">Level 12</span>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">Choose your course</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Stack */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {courses.map((course) => {
            const completedLevels = course.levels.filter(level => level.status === 'completed').length;
            const hasAvailableLevel = course.levels.some(level => level.status === 'available');
            const isUnlocked = completedLevels > 0 || hasAvailableLevel;
            
            return (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Course Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                      isUnlocked ? `bg-gradient-to-br ${course.color}` : 'bg-gray-300'
                    }`}>
                      <span className={isUnlocked ? '' : 'grayscale'}>{course.icon}</span>
                    </div>
                    
                    {/* Course Info */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-1 ${
                        isUnlocked ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {course.title}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        isUnlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {course.description}
                      </p>
                      
                      {/* Progress and Stats */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className={`w-4 h-4 mr-1 ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${
                            isUnlocked ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {completedLevels}/{course.levels.length} units
                          </span>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          isUnlocked ? getDifficultyColor(course.difficulty) : 'bg-gray-100 text-gray-500'
                        }`}>
                          {course.difficulty}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isUnlocked ? `bg-gradient-to-r ${course.color}` : 'bg-gray-300'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow and Status */}
                  <div className="flex items-center space-x-3">
                    {completedLevels === course.levels.length ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    ) : hasAvailableLevel ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Achievement Section */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Keep up the great work!</h3>
            <p className="text-gray-600 mb-4">You've earned {totalXP} XP and completed multiple lessons!</p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white rounded-lg p-3 shadow-md">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-sm font-medium text-gray-700">{currentStreak} day streak</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm font-medium text-gray-700">{totalXP} total XP</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium text-gray-700">Level 12</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesDashboard;