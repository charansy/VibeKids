import React, { useState } from 'react';
import { Brain, Cpu, Wifi, Zap, ChevronRight, ArrowLeft } from 'lucide-react';

interface LandingPageProps {
  setActiveSection: (section: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  lessonTitle: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ setActiveSection, setSelectedCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: 'ai',
      title: 'AI',
      description: 'Artificial Intelligence & Machine Learning',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      lessonTitle: 'Introduction to Machine Learning'
    },
    {
      id: 'robotics',
      title: 'Robotics',
      description: 'Build and Program Robots',
      icon: <Cpu className="w-6 h-6" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      lessonTitle: 'Building Smart Robots'
    },
    {
      id: 'iot',
      title: 'IoT',
      description: 'Internet of Things & Smart Devices',
      icon: <Wifi className="w-6 h-6" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      lessonTitle: 'Connected Devices and Sensors'
    },
    {
      id: 'electronics',
      title: 'Electronics',
      description: 'Circuits, Components & Hardware',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      lessonTitle: 'Basic Circuit Design'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleOptionClick = (option: 'courses' | 'projects') => {
    if (selectedCategory === 'ai') {
      if (option === 'courses') {
        setActiveSection('courses');
      } else {
        setActiveSection('automation');
      }
    } else if (selectedCategory === 'robotics') {
      if (option === 'courses') {
        setActiveSection('courses');
      } else {
        setActiveSection('robotics');
      }
    } else if (selectedCategory === 'iot') {
      if (option === 'courses') {
        setActiveSection('courses');
      } else {
        setActiveSection('electronics');
      }
    } else if (selectedCategory === 'electronics') {
      if (option === 'courses') {
        setActiveSection('courses');
      } else {
        setActiveSection('electronics');
      }
    }
  };

  if (selectedCategory) {
    const category = categories.find(cat => cat.id === selectedCategory);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* App Header */}
        <div className="flex items-center mb-8">
          <img 
            src="/dolphin.png" 
            alt="Vibe Kids Logo" 
            className="w-16 h-16 mr-4 object-contain"
          />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(29, 193, 163)' }}>Vibe Kids</h1>
        </div>

        <div className="w-full">
          {/* Back Button */}
          <button
            onClick={handleBackToCategories}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </button>

          {/* Category Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category?.bgColor} mb-4`}>
              <div className={category?.color}>
                {category?.icon}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{category?.title}</h1>
            <p className="text-lg text-gray-600">{category?.description}</p>
          </div>

          {/* Options Grid - 2x1 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => handleOptionClick('courses')}
              className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-t-4 border-cyan-500 border border-cyan-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="pt-3 px-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-cyan-600">Courses</h3>
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <div className="text-cyan-600">
                      <span className="text-xl">📚</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-cyan-500 mb-3">Structured learning paths with step-by-step lessons</p>
              </div>
              
              {/* Card Image */}
              <div className="h-48 w-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleOptionClick('projects')}
              className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-t-4 border-cyan-500 border border-cyan-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="pt-3 px-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-cyan-600">Projects</h3>
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <div className="text-cyan-600">
                      <span className="text-xl">🛠️</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-cyan-500 mb-3">Hands-on projects to build real-world applications</p>
              </div>
              
              {/* Card Image */}
              <div className="h-48 w-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-6xl">🛠️</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* App Header */}
      <div className="flex items-center mb-8">
        <img 
          src="/dolphin.png" 
          alt="Vibe Kids Logo" 
          className="w-16 h-16 mr-4 object-contain"
        />
        <h1 className="text-4xl font-bold" style={{ color: 'rgb(29, 193, 163)' }}>Vibe Kids</h1>
      </div>

      {/* Courses Grid - 2x2 Layout */}
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-t-4 border-cyan-500 border border-cyan-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="pt-3 px-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-cyan-600">{category.title}</h3>
                <div className={`w-8 h-8 ${category.bgColor} rounded-full flex items-center justify-center`}>
                  <div className={category.color}>
                    {category.icon}
                  </div>
                </div>
              </div>
                <p className="text-sm text-cyan-500 mb-3">{category.lessonTitle}</p>
            </div>
            
            {/* Card Image */}
            <div className="h-48 w-full overflow-hidden">
              {category.id === 'ai' ? (
                <img 
                  src="/vkai.png" 
                  alt="AI Technology" 
                  className="w-full h-full object-cover"
                />
              ) : category.id === 'robotics' ? (
                <img 
                  src="/robotdp.png" 
                  alt="Robotics" 
                  className="w-full h-full object-cover"
                />
              ) : category.id === 'iot' ? (
                <img 
                  src="/iotdp.png" 
                  alt="IoT" 
                  className="w-full h-full object-cover"
                />
              ) : category.id === 'electronics' ? (
                <img 
                  src="/electronicsdp.png" 
                  alt="Electronics" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full ${category.bgColor} flex items-center justify-center`}>
                  <div className={`${category.color} text-4xl`}>
                    {category.icon}
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
