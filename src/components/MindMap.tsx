import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Brain, Cpu, Code, RotateCcw, Eye, Zap, Target, AlertTriangle, Users, Shield, Briefcase } from 'lucide-react';

interface MindMapNode {
  id: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
  children?: MindMapNode[];
  color: string;
  bgColor: string;
}

interface MindMapProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

const MindMap: React.FC<MindMapProps> = ({ title, description, onClose }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const mindMapData: MindMapNode[] = [
    {
      id: 'ai-training',
      title: 'AI & Training: Teaching the Computer',
      content: 'Goal: To teach the computer how to see trash and learn from examples.',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      children: [
        {
          id: 'machine-learning',
          title: 'Machine Learning (ML)',
          content: 'The method used to let the computer learn from data, not just follow simple rules.',
          color: 'text-blue-700',
          bgColor: 'bg-blue-100 border-blue-300',
          children: [
            {
              id: 'dataset',
              title: 'Dataset',
              content: 'This is the collection of all the photos used to teach the AI (of trash and not trash).',
              color: 'text-blue-800',
              bgColor: 'bg-blue-200 border-blue-400',
              children: [
                {
                  id: 'data-requirement',
                  title: 'Need for Data',
                  content: 'We need over 200 pictures for each class so the model can learn the pattern well.',
                  color: 'text-blue-900',
                  bgColor: 'bg-blue-300 border-blue-500'
                }
              ]
            },
            {
              id: 'classes-labels',
              title: 'Classes / Labels',
              content: 'The names we give to the groups of things, which are "Trash" and "No Trash".',
              color: 'text-blue-800',
              bgColor: 'bg-blue-200 border-blue-400'
            },
            {
              id: 'training',
              title: 'Training',
              content: 'The process where the AI model looks at the dataset to learn the patterns.',
              color: 'text-blue-800',
              bgColor: 'bg-blue-200 border-blue-400'
            },
            {
              id: 'model',
              title: 'Model',
              content: 'This is the finished "computer brain" that can now make predictions.',
              color: 'text-blue-800',
              bgColor: 'bg-blue-200 border-blue-400'
            },
            {
              id: 'teachable-machine',
              title: 'Tool Used',
              content: 'We train the model using Google\'s Teachable Machine.',
              color: 'text-blue-800',
              bgColor: 'bg-blue-200 border-blue-400'
            }
          ]
        }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware: The Physical Parts',
      content: 'System Integration: All these parts work together in a chain, from seeing to doing.',
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      children: [
        {
          id: 'webcam',
          title: 'Webcam (The Eyes)',
          content: 'This is the visual sensor. Job: Takes pictures constantly and asks the AI model, "Is this trash?".',
          icon: <Eye className="w-4 h-4" />,
          color: 'text-green-700',
          bgColor: 'bg-green-100 border-green-300'
        },
        {
          id: 'computer',
          title: 'Computer/Laptop (The Brain)',
          content: 'Runs the AI model to answer the webcam\'s question.',
          icon: <Brain className="w-4 h-4" />,
          color: 'text-green-700',
          bgColor: 'bg-green-100 border-green-300'
        },
        {
          id: 'microbit',
          title: 'micro:bit (The Nervous System)',
          content: 'A microcontroller that listens to the computer and controls the motor. Job: Sends power to the motor when the brain says "I see trash!".',
          icon: <Zap className="w-4 h-4" />,
          color: 'text-green-700',
          bgColor: 'bg-green-100 border-green-300'
        },
        {
          id: 'servo-motor',
          title: 'Servo Motor (The Muscle)',
          content: 'This is the actuator that performs the physical action. Job: Moves (e.g., to 180 degrees) to open the lid when signaled by the micro:bit.',
          icon: <Target className="w-4 h-4" />,
          color: 'text-green-700',
          bgColor: 'bg-green-100 border-green-300'
        }
      ]
    },
    {
      id: 'code-logic',
      title: 'Code & Logic: Instructions',
      content: 'Communication: The computer sends a message (like \'TRASH\' or \'NO_TRASH\') to the micro:bit over serial.',
      icon: <Code className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      children: [
        {
          id: 'trash-instruction',
          title: 'Micro:bit Instruction: TRASH',
          content: 'If it receives \'TRASH\', the code tells the servo motor to move to 180 degrees (open).',
          color: 'text-purple-700',
          bgColor: 'bg-purple-100 border-purple-300'
        },
        {
          id: 'no-trash-instruction',
          title: 'Micro:bit Instruction: NO_TRASH',
          content: 'If it receives \'NO_TRASH\', the code tells the servo motor to move to 0 degrees (stay closed).',
          color: 'text-purple-700',
          bgColor: 'bg-purple-100 border-purple-300'
        }
      ]
    },
    {
      id: 'learning-cycle',
      title: 'The Learning Cycle (Iteration)',
      content: 'Test, Fail, and Learn: It is important to know that the dustbin will make mistakes.',
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      children: [
        {
          id: 'false-positive',
          title: 'False Positive Error',
          content: 'The lid opens when there is no trash (e.g., when you just wave your empty hand).',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 border-orange-300'
        },
        {
          id: 'false-negative',
          title: 'False Negative Error',
          content: 'The lid does not open for a new type of trash.',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 border-orange-300'
        },
        {
          id: 'fixing-mistakes',
          title: 'Fixing Mistakes (Iteration)',
          content: 'The model needs more data to get better. Solution: If the model mistakes an empty hand for trash, we must add more pictures of empty hands to the "No Trash" class and retrain the model.',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 border-orange-300'
        },
        {
          id: 'debugging',
          title: 'Debugging',
          content: 'We must check both the AI model\'s decision and the hardware movement to find the problem.',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 border-orange-300'
        }
      ]
    },
    {
      id: 'bigger-concepts',
      title: 'Bigger Concepts',
      content: 'Prediction: The single most important word for describing what the trained AI model is doing.',
      icon: <Target className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200',
      children: [
        {
          id: 'computer-vision',
          title: 'Computer Vision',
          content: 'The specific part of AI that allows the computer to "see" and understand images.',
          icon: <Eye className="w-4 h-4" />,
          color: 'text-indigo-700',
          bgColor: 'bg-indigo-100 border-indigo-300'
        },
        {
          id: 'ethics',
          title: 'Ethics',
          content: 'Important questions to ask about this technology.',
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'text-indigo-700',
          bgColor: 'bg-indigo-100 border-indigo-300',
          children: [
            {
              id: 'reliability',
              title: 'Reliability',
              content: 'What if the bin makes a mistake?',
              icon: <Shield className="w-4 h-4" />,
              color: 'text-indigo-800',
              bgColor: 'bg-indigo-200 border-indigo-400'
            },
            {
              id: 'privacy',
              title: 'Privacy',
              content: 'Could it be used to track people?',
              icon: <Users className="w-4 h-4" />,
              color: 'text-indigo-800',
              bgColor: 'bg-indigo-200 border-indigo-400'
            },
            {
              id: 'societal-impact',
              title: 'Societal Impact',
              content: 'What happens to jobs related to managing waste?',
              icon: <Briefcase className="w-4 h-4" />,
              color: 'text-indigo-800',
              bgColor: 'bg-indigo-200 border-indigo-400'
            }
          ]
        }
      ]
    }
  ];

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const selectNode = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const renderNode = (node: MindMapNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className={`ml-${level * 4}`}>
        <div
          className={`
            p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
            ${node.bgColor} ${node.color}
            ${isSelected ? 'ring-2 ring-blue-400 shadow-lg' : ''}
            ${level === 0 ? 'mb-4' : 'mb-2'}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            selectNode(node.id);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasChildren && (
                <div className="text-gray-500">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              )}
              {node.icon && (
                <div className="flex-shrink-0">
                  {node.icon}
                </div>
              )}
              <div>
                <h3 className={`font-semibold text-lg ${node.color}`}>
                  {node.title}
                </h3>
                {isSelected && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {node.content}
                  </p>
                )}
              </div>
            </div>
            {hasChildren && (
              <div className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                {node.children?.length} items
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 mt-2 space-y-2">
            {node.children?.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
              {description && (
                <p className="text-gray-600 text-lg">{description}</p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Mind Map */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Machine Learning Mind Map</h2>
            <p className="text-gray-600">
              Click on any node to expand/collapse it and see detailed information. 
              The mind map shows the complete learning journey from AI concepts to real-world implementation.
            </p>
          </div>

          <div className="space-y-4">
            {mindMapData.map(node => renderNode(node))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span>AI & Training</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Hardware</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                <span>Code & Logic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                <span>Learning Cycle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></div>
                <span>Bigger Concepts</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span>Click to expand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMap;
