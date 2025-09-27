import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CoursesDashboard from './components/CoursesDashboard';
import CourseLevels from './components/CourseLevels';
import ElectronicsPlayground from './components/ElectronicsPlayground';
import RoboticsProjects from './components/RoboticsProjects';
import DronesProjects from './components/DronesProjects';
import LearnToCode from './components/LearnToCode';
import AutomationCourse from './components/AutomationCourse';
import BatteryMonitorCapstone from './components/BatteryMonitorCapstone';
import SmartDustbinMission from './components/SmartDustbinMission';
import AIChatbot from './components/AIChatbot';

function App() {
  const [activeSection, setActiveSection] = useState('landing');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const renderContent = () => {
    if (selectedCourse) {
      if (selectedCourse === '7') {
        return <BatteryMonitorCapstone setActiveSection={setActiveSection} setSelectedCourse={setSelectedCourse} />;
      } else if (selectedCourse === '8') {
      } else if (selectedCourse === '6') {
        return <SmartDustbinMission setActiveSection={setActiveSection} setSelectedCourse={setSelectedCourse} />;
      }
      return <CourseLevels courseId={selectedCourse} setActiveSection={setActiveSection} setSelectedCourse={setSelectedCourse} />;
    }
    
    switch (activeSection) {
      case 'landing':
        return <LandingPage setActiveSection={setActiveSection} setSelectedCourse={setSelectedCourse} />;
      case 'courses':
        return <CoursesDashboard setActiveSection={setActiveSection} setSelectedCourse={setSelectedCourse} />;
      case 'electronics':
        return <ElectronicsPlayground />;
      case 'robotics':
        return <RoboticsProjects />;
      case 'drones':
        return <DronesProjects />;
      case 'code':
        return <LearnToCode />;
      case 'automation':
        return <AutomationCourse setActiveSection={setActiveSection} />;
      default:
        return <LandingPage setActiveSection={setActiveSection} setSelectedCourse={setSelectedCourse} />;
    }
  };

  return (
    <div className="min-h-screen bg-orange-25" style={{ backgroundColor: '#fefcf9' }}>
      {activeSection === 'landing' ? (
        <div>
          {renderContent()}
        </div>
      ) : (
        <>
          <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="pt-20 pb-8 px-4">
            <div className="w-full">
              {renderContent()}
            </div>
          </main>
        </>
      )}
      <AIChatbot />
    </div>
  );
}

export default App;