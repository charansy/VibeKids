import React, { useState } from 'react';
import { ArrowLeft, Battery, Zap, Cpu, Monitor, Settings, Star, Lock, CheckCircle, Play, Eye, BookOpen, Lightbulb, Wrench } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  levels: {
    beginner: ComponentLevel;
    intermediate: ComponentLevel;
    advanced: ComponentLevel;
  };
  unlocked: {
    beginner: boolean;
    intermediate: boolean;
    advanced: boolean;
  };
}

interface ComponentLevel {
  title: string;
  description: string;
  duration: string;
  concepts: string[];
  activities: string[];
}

interface BatteryMonitorCapstoneProps {
  setActiveSection: (section: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
}

const BatteryMonitorCapstone: React.FC<BatteryMonitorCapstoneProps> = ({ setActiveSection, setSelectedCourse }) => {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedComponentLevel, setSelectedComponentLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  const components: Component[] = [
    {
      id: 'voltage-sensor',
      name: 'Voltage Sensor',
      description: 'Measure battery voltage accurately',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      levels: {
        beginner: {
          title: 'Voltage Safety Hero! 🍕',
          description: 'Learn how two helpers (resistors) share battery energy like pizza slices',
          duration: '15 min',
          concepts: ['Energy sharing story', 'Battery safety', 'Arduino protection', 'Visual cause-effect'],
          activities: ['Pizza slice analogy', 'Drag & drop resistors', 'Safety picture quiz'],
          badge: '⭐ Voltage Safety Hero!',
          content: {
            story: 'Imagine a battery is like a big pizza 🍕 with too much energy for little Arduino to eat safely! Two helpful resistors work together to cut the pizza into smaller, safe slices.',
            visual: 'Battery (3.7V) → Two Resistor Helpers → Safe voltage for Arduino',
            exercises: [
              {
                type: 'drag-drop',
                question: 'Put two resistors in the right order to make Arduino safe',
                options: ['Battery', 'Resistor 1', 'Resistor 2', 'Arduino'],
                correct: ['Battery', 'Resistor 1', 'Resistor 2', 'Arduino']
              },
              {
                type: 'visual-choice',
                question: 'Battery (3.7V) is too high for Arduino. Which picture is correct?',
                options: [
                  { image: 'Battery → Arduino directly', label: '⚠️ Dangerous!', correct: false },
                  { image: 'Battery → Resistors → Arduino', label: '✅ Safe!', correct: true }
                ]
              }
            ]
          }
        },
        intermediate: {
          title: 'Circuit Math Explorer! 🔢',
          description: 'Learn the voltage divider formula and apply it to real numbers',
          duration: '30 min',
          concepts: ['Voltage divider formula', 'Real calculations', 'Circuit diagrams', 'Arduino input range'],
          activities: ['Formula practice', 'Real number calculations', 'Circuit analysis'],
          badge: '🔢 Circuit Math Explorer!',
          content: {
            formula: 'Vout = Vin × (R2 / (R1 + R2))',
            example: 'R1 = 22kΩ, R2 = 68kΩ, Vin = 3.7V → Vout ≈ 0.9V (safe for Arduino!)',
            diagram: 'Circuit diagram showing R1, R2, Vin, and Vout connections',
            exercises: [
              {
                type: 'multiple-choice',
                question: 'If Vin = 5V, R1 = 22kΩ, R2 = 68kΩ → what is Vout?',
                options: ['3.5V', '1.1V', '5V'],
                correct: 1,
                explanation: 'Using the formula: 5V × (68kΩ / (22kΩ + 68kΩ)) = 5V × 0.756 ≈ 3.78V'
              },
              {
                type: 'fill-blank',
                question: 'If R2 is made larger, Vout becomes ______.',
                answer: 'larger',
                explanation: 'Larger R2 means a bigger fraction of the input voltage appears at the output'
              }
            ]
          }
        },
        advanced: {
          title: 'Circuit Engineer! ⚡',
          description: 'Master engineering nuances, tolerances, and troubleshooting',
          duration: '45 min',
          concepts: ['Resistor tolerances', 'Power vs noise tradeoffs', 'ADC scaling', 'Debugging techniques'],
          activities: ['Debug challenges', 'Design optimization', 'Tolerance analysis'],
          badge: '⚡ Circuit Engineer!',
          content: {
            precision: 'Resistor tolerances (±5%) affect accuracy. 22kΩ resistor could be 20.9kΩ to 23.1kΩ',
            tradeoffs: 'Large resistors = less battery drain, but more susceptible to noise and interference',
            adc: 'Arduino ADC reference voltage (typically 5V or 3.3V) determines measurement range and resolution',
            debugging: 'Common issues: wrong resistor values, floating pins, cold solder joints, EMI interference',
            exercises: [
              {
                type: 'debug-challenge',
                question: 'Arduino reads 5V battery as 3.5V. Most likely cause?',
                options: ['Wrong resistor values', 'OLED malfunction', 'Battery dead'],
                correct: 0,
                explanation: 'If measured voltage is lower than expected, the voltage divider ratio is likely incorrect'
              },
              {
                type: 'design-challenge',
                question: 'Design a voltage divider to reduce 9V battery to <1.1V for Arduino input',
                hint: 'Choose R1 and R2 values where Vout = 9V × (R2/(R1+R2)) < 1.1V',
                solution: 'Example: R1 = 82kΩ, R2 = 10kΩ gives Vout = 9V × (10/92) ≈ 0.98V'
              }
            ]
          }
        }
      },
      unlocked: {
        beginner: true,
        intermediate: false,
        advanced: false
      }
    },
    {
      id: 'current-sensor',
      name: 'Current Sensor',
      description: 'Monitor battery current flow',
      icon: Battery,
      color: 'from-blue-400 to-purple-500',
      levels: {
        beginner: {
          title: 'Understanding Current',
          description: 'Learn what electrical current is and why we measure it',
          duration: '15 min',
          concepts: ['Current as electron flow', 'Amperes explained', 'AC vs DC current', 'Current safety'],
          activities: ['Current flow animation', 'Interactive current meter', 'Safety scenarios']
        },
        intermediate: {
          title: 'Current Measurement Methods',
          description: 'Different ways to measure electrical current',
          duration: '35 min',
          concepts: ['Shunt resistors', 'Hall effect sensors', 'Current transformers', 'Measurement accuracy'],
          activities: ['Build current sensor', 'Compare methods', 'Accuracy testing']
        },
        advanced: {
          title: 'High-Precision Current Sensing',
          description: 'Advanced current measurement for battery monitoring',
          duration: '50 min',
          concepts: ['Kelvin connections', 'Offset compensation', 'Bandwidth considerations', 'Isolation techniques'],
          activities: ['Precision design', 'Noise analysis', 'Isolation circuits']
        }
      },
      unlocked: {
        beginner: true,
        intermediate: false,
        advanced: false
      }
    },
    {
      id: 'microcontroller',
      name: 'Microcontroller',
      description: 'Process and analyze battery data',
      icon: Cpu,
      color: 'from-green-400 to-blue-500',
      levels: {
        beginner: {
          title: 'What is a Microcontroller?',
          description: 'Introduction to the brain of our battery monitor',
          duration: '20 min',
          concepts: ['Computer basics', 'Input/Output', 'Simple programming', 'Arduino introduction'],
          activities: ['Virtual Arduino', 'LED blink project', 'Simple sensor reading']
        },
        intermediate: {
          title: 'Data Processing',
          description: 'How microcontrollers process sensor data',
          duration: '40 min',
          concepts: ['ADC conversion', 'Data filtering', 'Calculations', 'Memory management'],
          activities: ['Data logging project', 'Filter implementation', 'Math operations']
        },
        advanced: {
          title: 'Advanced Processing',
          description: 'Complex algorithms for battery state estimation',
          duration: '60 min',
          concepts: ['State of charge algorithms', 'Kalman filtering', 'Machine learning basics', 'Real-time processing'],
          activities: ['Algorithm implementation', 'Performance optimization', 'ML model training']
        }
      },
      unlocked: {
        beginner: true,
        intermediate: false,
        advanced: false
      }
    },
    {
      id: 'display-interface',
      name: 'Display & Interface',
      description: 'Show battery information to users',
      icon: Monitor,
      color: 'from-purple-400 to-pink-500',
      levels: {
        beginner: {
          title: 'Simple Displays',
          description: 'Basic ways to show battery information',
          duration: '15 min',
          concepts: ['LED indicators', 'Simple displays', 'Color coding', 'User-friendly design'],
          activities: ['LED status project', 'Color coding exercise', 'Display design']
        },
        intermediate: {
          title: 'LCD and OLED Displays',
          description: 'Advanced display technologies for detailed information',
          duration: '30 min',
          concepts: ['LCD technology', 'OLED displays', 'Graphics programming', 'Menu systems'],
          activities: ['LCD programming', 'Graphics creation', 'Menu navigation']
        },
        advanced: {
          title: 'Smart Interfaces',
          description: 'Touchscreens, web interfaces, and mobile apps',
          duration: '45 min',
          concepts: ['Touchscreen interfaces', 'Web dashboards', 'Mobile connectivity', 'Data visualization'],
          activities: ['Touch interface design', 'Web dashboard creation', 'Mobile app basics']
        }
      },
      unlocked: {
        beginner: true,
        intermediate: false,
        advanced: false
      }
    },
    {
      id: 'power-management',
      name: 'Power Management',
      description: 'Efficient power usage and protection',
      icon: Settings,
      color: 'from-red-400 to-orange-500',
      levels: {
        beginner: {
          title: 'Power Basics',
          description: 'Understanding power consumption and efficiency',
          duration: '15 min',
          concepts: ['Power vs energy', 'Efficiency basics', 'Battery life', 'Sleep modes'],
          activities: ['Power calculation', 'Efficiency comparison', 'Battery life estimation']
        },
        intermediate: {
          title: 'Power Optimization',
          description: 'Techniques to reduce power consumption',
          duration: '35 min',
          concepts: ['Low-power design', 'Switching regulators', 'Power gating', 'Thermal management'],
          activities: ['Power optimization project', 'Regulator selection', 'Thermal analysis']
        },
        advanced: {
          title: 'Advanced Power Systems',
          description: 'Complex power management and protection circuits',
          duration: '50 min',
          concepts: ['PMIC design', 'Protection circuits', 'Dynamic power scaling', 'Energy harvesting'],
          activities: ['PMIC configuration', 'Protection circuit design', 'Energy harvesting project']
        }
      },
      unlocked: {
        beginner: true,
        intermediate: false,
        advanced: false
      }
    }
  ];

  const handleLevelSelection = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(level);
    setShowLevelSelector(false);
  };

  const handleComponentClick = (componentId: string) => {
    setSelectedComponent(componentId);
    setSelectedComponentLevel(null);
  };

  const handleLevelStart = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedComponentLevel(level);
  };

  const getLevelIcon = (level: 'beginner' | 'intermediate' | 'advanced', component: Component) => {
    if (component.unlocked[level]) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (level === 'beginner' || (level === 'intermediate' && component.unlocked.beginner)) {
      return <Play className="w-4 h-4 text-blue-500" />;
    } else {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level: 'beginner' | 'intermediate' | 'advanced') => {
    switch (level) {
      case 'beginner': return 'from-green-400 to-green-600';
      case 'intermediate': return 'from-yellow-400 to-orange-500';
      case 'advanced': return 'from-red-400 to-red-600';
    }
  };

  const renderLevelContent = (component: Component, level: 'beginner' | 'intermediate' | 'advanced') => {
    const levelData = component.levels[level];
    const content = levelData.content;
    
    if (!content) return null;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{levelData.title}</h2>
          <button
            onClick={() => setSelectedComponentLevel(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Levels
          </button>
        </div>

        {level === 'beginner' && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">📖 Story Time</h3>
              <p className="text-blue-700">{content.story}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">👀 Visual Flow</h3>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 inline-block shadow-md">
                  <span className="text-2xl">{content.visual}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">🎮 Interactive Exercises</h3>
              {content.exercises.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-800 mb-3">{exercise.question}</h4>
                  {exercise.type === 'drag-drop' && (
                    <div className="flex flex-wrap gap-2">
                      {exercise.options.map((option: string, optIndex: number) => (
                        <div
                          key={optIndex}
                          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-200"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  {exercise.type === 'visual-choice' && (
                    <div className="space-y-2">
                      {exercise.options.map((option: any, optIndex: number) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 cursor-pointer ${
                            option.correct 
                              ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                              : 'border-red-300 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          <div className="font-medium">{option.image}</div>
                          <div className="text-sm mt-1">{option.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {level === 'intermediate' && (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">📐 Formula</h3>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 inline-block shadow-md font-mono text-lg">
                  {content.formula}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">🔢 Real Example</h3>
              <p className="text-blue-700 font-mono">{content.example}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">📝 Practice Problems</h3>
              {content.exercises.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-800 mb-3">{exercise.question}</h4>
                  {exercise.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      {exercise.options.map((option: string, optIndex: number) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border cursor-pointer ${
                            optIndex === exercise.correct
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-300 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {String.fromCharCode(97 + optIndex)}) {option}
                        </div>
                      ))}
                      {exercise.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                          💡 {exercise.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {level === 'advanced' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2">⚡ Precision</h3>
                <p className="text-red-700 text-sm">{content.precision}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-orange-800 mb-2">⚖️ Tradeoffs</h3>
                <p className="text-orange-700 text-sm">{content.tradeoffs}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">📊 ADC</h3>
                <p className="text-blue-700 text-sm">{content.adc}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">🔧 Debugging</h3>
                <p className="text-purple-700 text-sm">{content.debugging}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">🚀 Engineering Challenges</h3>
              {content.exercises.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-800 mb-3">{exercise.question}</h4>
                  {exercise.type === 'debug-challenge' && (
                    <div className="space-y-2">
                      {exercise.options.map((option: string, optIndex: number) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border cursor-pointer ${
                            optIndex === exercise.correct
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-300 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {String.fromCharCode(97 + optIndex)}) {option}
                        </div>
                      ))}
                      {exercise.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                          💡 {exercise.explanation}
                        </div>
                      )}
                    </div>
                  )}
                  {exercise.type === 'design-challenge' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                        💡 Hint: {exercise.hint}
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
                        ✅ Solution: {exercise.solution}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 hover:scale-105">
            Complete & Earn Badge: {levelData.title.split('!')[0]}!
          </button>
        </div>
      </div>
    );
  };

  if (showLevelSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowLevelSelector(false)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Overview
          </button>

          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔋</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Learning Path</h1>
            <p className="text-lg text-gray-600">
              Select the level that matches your current knowledge. You can always change it later!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <div
                key={level}
                onClick={() => handleLevelSelection(level)}
                className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-100"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getLevelColor(level)} flex items-center justify-center mx-auto mb-6`}>
                  {level === 'beginner' && <Lightbulb className="w-8 h-8 text-white" />}
                  {level === 'intermediate' && <BookOpen className="w-8 h-8 text-white" />}
                  {level === 'advanced' && <Wrench className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{level}</h3>
                
                {level === 'beginner' && (
                  <div>
                    <p className="text-gray-600 mb-4">Perfect for newcomers to electronics</p>
                    <ul className="text-sm text-gray-500 space-y-2">
                      <li>• Simple explanations with analogies</li>
                      <li>• Interactive visual demonstrations</li>
                      <li>• Step-by-step guided activities</li>
                      <li>• Safety-first approach</li>
                    </ul>
                  </div>
                )}
                
                {level === 'intermediate' && (
                  <div>
                    <p className="text-gray-600 mb-4">For those with basic electronics knowledge</p>
                    <ul className="text-sm text-gray-500 space-y-2">
                      <li>• Circuit analysis and design</li>
                      <li>• Hands-on component testing</li>
                      <li>• Mathematical calculations</li>
                      <li>• Real-world applications</li>
                    </ul>
                  </div>
                )}
                
                {level === 'advanced' && (
                  <div>
                    <p className="text-gray-600 mb-4">For experienced electronics enthusiasts</p>
                    <ul className="text-sm text-gray-500 space-y-2">
                      <li>• Complex circuit design</li>
                      <li>• Advanced algorithms</li>
                      <li>• Performance optimization</li>
                      <li>• Industry-level techniques</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedComponent) {
    const component = components.find(c => c.id === selectedComponent)!;
    const Icon = component.icon;
    
    if (selectedComponentLevel) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedComponent(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Knowledge Tree
            </button>
            {renderLevelContent(component, selectedComponentLevel)}
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedComponent(null)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Knowledge Tree
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${component.color} flex items-center justify-center mr-6`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{component.name}</h1>
                <p className="text-lg text-gray-600">{component.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const levelData = component.levels[level];
                const isUnlocked = component.unlocked[level];
                
                return (
                  <div
                    key={level}
                    className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-green-200 bg-green-50 hover:shadow-lg cursor-pointer hover:scale-105' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold capitalize ${
                        isUnlocked ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {level}
                      </h3>
                      {getLevelIcon(level, component)}
                    </div>
                    
                    <h4 className={`font-semibold mb-2 ${
                      isUnlocked ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {levelData.title}
                    </h4>
                    
                    <p className={`text-sm mb-4 ${
                      isUnlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {levelData.description}
                    </p>
                    
                    <div className="mb-4">
                      <p className={`text-xs font-medium mb-2 ${
                        isUnlocked ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        Key Concepts:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {levelData.concepts.slice(0, 3).map((concept, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isUnlocked 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        isUnlocked ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {levelData.duration}
                      </span>
                      {isUnlocked && (
                        <button 
                          onClick={() => handleLevelStart(level)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>

        {!selectedLevel && (
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔋</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Battery Monitor Capstone</h1>
            <p className="text-lg text-gray-600 mb-8">
              Build a complete battery monitoring system by mastering each component
            </p>
            
            <button
              onClick={() => setShowLevelSelector(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-105"
            >
              Choose Your Learning Level
            </button>
          </div>
        )}

        {selectedLevel && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Knowledge Tree</h1>
                <p className="text-gray-600">Current Level: <span className="capitalize font-semibold text-blue-600">{selectedLevel}</span></p>
              </div>
              <button
                onClick={() => setShowLevelSelector(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Change Level
              </button>
            </div>
          </div>
        )}

        {/* Knowledge Tree */}
        <div className="relative">
          {/* Tree Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 800 600">
              <path
                d="M400 550 Q350 450 300 350 Q250 250 200 150 M400 550 Q450 450 500 350 Q550 250 600 150 M400 550 Q400 450 400 350 Q400 250 400 150"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Components Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {components.map((component) => {
              const Icon = component.icon;
              const hasUnlockedLevels = Object.values(component.unlocked).some(Boolean);
              
              return (
                <div
                  key={component.id}
                  onClick={() => handleComponentClick(component.id)}
                  className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                    hasUnlockedLevels ? 'border-green-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${component.color} flex items-center justify-center mr-4 ${
                      hasUnlockedLevels ? '' : 'grayscale'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{component.name}</h3>
                      <p className="text-sm text-gray-600">{component.description}</p>
                    </div>
                  </div>

                  {/* Level Progress */}
                  <div className="flex space-x-2 mb-4">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-2 rounded-full ${
                          component.unlocked[level] 
                            ? `bg-gradient-to-r ${getLevelColor(level)}` 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Level Badges */}
                  <div className="flex justify-between">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <div key={level} className="flex items-center">
                        {getLevelIcon(level, component)}
                        <span className={`text-xs ml-1 capitalize ${
                          component.unlocked[level] ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integration Section */}
          {selectedLevel && (
            <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200">
              <div className="text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">System Integration</h3>
                <p className="text-gray-600 mb-6">
                  Ready to see how all components work together? Jump to the integration phase!
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105">
                  <Eye className="w-4 h-4 mr-2 inline" />
                  View Complete System
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatteryMonitorCapstone;