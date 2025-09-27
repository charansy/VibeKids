import React from 'react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-4 border-blue-400">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/dolphin.png" 
              alt="Vibe Kids Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-gray-800">Smart AI Dustbin Mission</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;