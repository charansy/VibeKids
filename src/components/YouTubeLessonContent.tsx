import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX, Settings, MoreHorizontal, SkipBack, SkipForward } from 'lucide-react';

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
}

interface YouTubeLessonContentProps {
  level: Level;
  courseTitle: string;
  onBack: () => void;
  onComplete: () => void;
}

const YouTubeLessonContent: React.FC<YouTubeLessonContentProps> = ({ level, courseTitle, onBack, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate sample content for demonstration
  const content = {
    shortDescription: "Learn how AI can recognize different types of waste materials using computer vision and machine learning techniques.",
    videoUrl: "/aibin.mp4",
    thumbnail: "https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    textExplanation: `Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.

In our Smart AI Dustbin project, we use computer vision - a branch of AI that helps computers "see" and understand images. The system learns to distinguish between different types of waste by analyzing thousands of images.

Key concepts covered:
• Pattern Recognition: How AI identifies common features in images
• Training Data: The importance of diverse, high-quality datasets  
• Model Accuracy: Understanding how well our AI performs
• Real-world Applications: Practical uses of computer vision technology

This technology has applications beyond waste sorting - from medical diagnosis to autonomous vehicles, computer vision is revolutionizing how machines interact with the visual world.`,
    voiceOverUrl: "/audio/lesson-voiceover.mp3",
    visualContent: {
      type: 'image' as const,
      url: "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "AI and Machine Learning Visualization"
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (audioRef.current) audioRef.current.pause();
      } else {
        videoRef.current.play();
        if (audioRef.current) audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle duration change
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
    if (audioRef.current) audioRef.current.muted = !isMuted;
  };

  // Show/hide controls
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Handle mouse movement
  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* YouTube-style Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-medium text-gray-900">{level.title}</h1>
              <p className="text-sm text-gray-500">{courseTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Video Player Area */}
        <div className="flex-1 lg:pr-6">
          <div 
            className="relative bg-black aspect-video w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-contain cursor-pointer"
              poster={content.thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlayPause}
              muted={isMuted}
            >
              <source src={content.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Voice Over Audio */}
            {content.voiceOverUrl && (
              <audio
                ref={audioRef}
                src={content.voiceOverUrl}
                muted={isMuted}
              />
            )}

            {/* Video Controls Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Center Play Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 hover:h-2 transition-all duration-200"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-red-600 rounded-full relative"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    
                    <button
                      onClick={() => skipTime(-10)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => skipTime(10)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <span className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="text-white hover:text-gray-300 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title and Description */}
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{level.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>{level.duration}</span>
              <span>•</span>
              <span>{level.difficulty}</span>
              <span>•</span>
              <span>{level.points} XP</span>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 lg:pl-6">
          <div className="p-4">
            {/* Short Description with Play Button */}
            <div className="mb-6">
              <div className="flex items-start space-x-4 mb-4">
                <button
                  onClick={togglePlayPause}
                  className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson Overview</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{content.shortDescription}</p>
                </div>
              </div>
            </div>

            {/* Visual Content */}
            {content.visualContent && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Visual Guide</h3>
                <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <img
                    src={content.visualContent.url}
                    alt={content.visualContent.alt}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Text Explanation */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Detailed Explanation</h3>
              <div className="prose prose-sm max-w-none">
                {content.textExplanation.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Lesson Info */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Lesson Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium text-gray-900">{level.duration}</span>
                </div>
                <div>
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="ml-2 font-medium text-gray-900">{level.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-500">Points:</span>
                  <span className="ml-2 font-medium text-gray-900">{level.points} XP</span>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">{level.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Next Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onComplete}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <span>Next Lesson</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Custom Styles for YouTube-like slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default YouTubeLessonContent;