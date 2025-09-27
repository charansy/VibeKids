import React from 'react';
import { Lightbulb, Battery, ToggleLeft, Zap, Cpu, Play, Lock, CheckCircle, Star } from 'lucide-react';

interface Level {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'locked' | 'available' | 'completed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  color: string;
}

interface AutomationCourseProps {
  setActiveSection: (section: string) => void;
}

const AutomationCourse: React.FC<AutomationCourseProps> = ({ setActiveSection }) => {
  const levels: Level[] = [
    {
      id: 1,
      title: 'Light',
      description: 'Learn about LEDs and basic lighting circuits',
      icon: Lightbulb,
      status: 'available',
      difficulty: 'Easy',
      points: 100,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 2,
      title: 'Battery',
      description: 'Understanding power sources and voltage',
      icon: Battery,
      status: 'available',
      difficulty: 'Easy',
      points: 150,
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 3,
      title: 'Switch',
      description: 'Control circuits with switches and buttons',
      icon: ToggleLeft,
      status: 'available',
      difficulty: 'Easy',
      points: 200,
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 4,
      title: 'Resistor',
      description: 'Current limiting and voltage division',
      icon: Zap,
      status: 'locked',
      difficulty: 'Medium',
      points: 250,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 5,
      title: 'Relay',
      description: 'Switching high power loads safely',
      icon: ToggleLeft,
      status: 'locked',
      difficulty: 'Medium',
      points: 300,
      color: 'from-pink-400 to-red-500'
    },
    {
      id: 6,
      title: 'ESP8266',
      description: 'WiFi microcontroller programming',
      icon: Cpu,
      status: 'locked',
      difficulty: 'Hard',
      points: 500,
      color: 'from-red-400 to-purple-600'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'available': return <Play className="w-6 h-6 text-blue-500" />;
      case 'locked': return <Lock className="w-6 h-6 text-gray-400" />;
      default: return null;
    }
  };

  const handleLevelClick = (level: Level) => {
    if (level.status !== 'locked') {
      setActiveSection('electronics');
    }
  };

  const completedLevels = levels.filter(level => level.status === 'completed').length;
  const totalPoints = levels.filter(level => level.status === 'completed').reduce((sum, level) => sum + level.points, 0);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🏠 Automation Concepts
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Master automation step by step through interactive levels
        </p>
        
        {/* Progress Stats */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-200">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl font-bold text-gray-800">{completedLevels}/{levels.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-green-200">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-xl font-bold text-gray-800">{totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedLevels / levels.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((completedLevels / levels.length) * 100)}% Complete
          </p>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 transform -translate-x-1/2 z-0"></div>
          
          {/* Level Cards */}
          <div className="relative z-10 space-y-8">
        {levels.map((level) => {
          const Icon = level.icon;
          const isLocked = level.status === 'locked';
          
          return (
            <div
              key={level.id}
              onClick={() => handleLevelClick(level)}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 mx-auto max-w-md ${
                isLocked 
                  ? 'border-gray-200 cursor-not-allowed opacity-60' 
                  : 'border-gray-100 hover:shadow-xl hover:scale-105 cursor-pointer'
              }`}
            >
              {/* Level Connection Node */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white`}>
                  {level.id}
                </div>
              </div>

              {/* Level Number Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(level.difficulty)}`}>
                  {level.difficulty}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                {getStatusIcon(level.status)}
              </div>

              {/* Background Gradient */}
              <div className={`h-24 bg-gradient-to-br ${level.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute bottom-4 right-4">
                  <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{level.title}</h3>
                <p className="text-gray-600 mb-4">{level.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{level.points} pts</span>
                  </div>
                  
                  {!isLocked && (
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium">
                      {level.status === 'completed' ? 'Replay' : 'Start'}
                    </button>
                  )}
                  
                  {isLocked && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <Lock className="w-4 h-4 mr-1" />
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          💡 Learning Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-blue-500 rounded-full p-2 mr-3 flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Complete in Order</p>
              <p className="text-sm text-gray-600">Each level builds on the previous one</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-500 rounded-full p-2 mr-3 flex-shrink-0">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Hands-on Practice</p>
              <p className="text-sm text-gray-600">Build real circuits in the simulator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationCourse;