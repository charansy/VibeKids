import React, { useState } from 'react';
import { Eye, Star, Clock, ChevronRight } from 'lucide-react';

interface DroneProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  image: string;
  components: string[];
}

const DronesProjects: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const projects: DroneProject[] = [
    {
      id: '1',
      title: 'Mini Quadcopter',
      description: 'Build your first flying drone with basic controls',
      difficulty: 'Beginner',
      duration: '2 hours',
      rating: 4.7,
      image: '🚁',
      components: ['Motors', 'Propellers', 'Flight Controller', 'Battery']
    },
    {
      id: '2',
      title: 'Camera Drone',
      description: 'Add a camera to capture aerial photos and videos',
      difficulty: 'Intermediate',
      duration: '4 hours',
      rating: 4.8,
      image: '📸',
      components: ['Camera Module', 'Gimbal', 'Transmitter', 'SD Card']
    },
    {
      id: '3',
      title: 'Racing Drone',
      description: 'Fast drone designed for racing competitions',
      difficulty: 'Advanced',
      duration: '6 hours',
      rating: 4.9,
      image: '🏎️',
      components: ['Carbon Frame', 'Racing Motors', 'FPV Camera', 'Speed Controller']
    },
    {
      id: '4',
      title: 'Delivery Drone',
      description: 'Drone that can carry and deliver small packages',
      difficulty: 'Advanced',
      duration: '8 hours',
      rating: 4.6,
      image: '📦',
      components: ['Payload System', 'GPS Module', 'Servo Motors', 'Landing Gear']
    },
    {
      id: '5',
      title: 'Light Show Drone',
      description: 'Drone with LEDs for amazing night performances',
      difficulty: 'Intermediate',
      duration: '3 hours',
      rating: 4.8,
      image: '✨',
      components: ['LED Strips', 'Controller', 'Programming Module', 'Synchronizer']
    },
    {
      id: '6',
      title: 'Micro Drone',
      description: 'Tiny drone perfect for indoor flying',
      difficulty: 'Beginner',
      duration: '1 hour',
      rating: 4.5,
      image: '🐝',
      components: ['Micro Motors', 'Tiny Props', 'Mini Battery', 'Micro Frame']
    }
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredProjects = selectedDifficulty === 'All' 
    ? projects 
    : projects.filter(project => project.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🚁 Drone Projects
        </h1>
        <p className="text-lg text-gray-600">
          Take flight with amazing drone building projects!
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Filter by Difficulty</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                selectedDifficulty === difficulty
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 border-gray-100"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">{project.image}</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {renderStars(project.rating)}
                  <span className="text-sm text-gray-500 ml-2">{project.rating}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{project.duration}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Required Components:</p>
                <div className="flex flex-wrap gap-1">
                  {project.components.map((component, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105">
                <Eye className="w-4 h-4 mr-2" />
                View Project
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DronesProjects;