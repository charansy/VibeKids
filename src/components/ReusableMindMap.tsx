import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown, Brain, Cpu, Code, RotateCcw, Eye, Zap, Target, AlertTriangle, Users, Shield, Briefcase, ZoomIn, ZoomOut, Move, Plus, Minus } from 'lucide-react';

interface MindMapNode {
  id: string;
  title: string;
  content: string;
  icon?: string;
  children?: MindMapNode[];
  explanations?: MindMapNode[];
  questions?: string[];
  color: string;
  bgColor: string;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ReusableMindMapProps {
  title: string;
  description?: string;
  data: MindMapNode[];
  onClose?: () => void;
  onComplete?: () => void;
}

const ReusableMindMap: React.FC<ReusableMindMapProps> = ({ 
  title = "Smart AI Dustbin - Learning Roadmap", 
  description = "Interactive mind map showing the ML journey", 
  data = [
    {
      id: '1',
      title: 'Data Collection',
      content: 'Gathering training data',
      icon: 'eye',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      explanations: [
        {
          id: '1-exp',
          title: 'Why Data Matters',
          content: 'Data is the foundation of machine learning. Without quality data, AI cannot learn effectively.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        },
        {
          id: '1-exp2',
          title: 'Data Quality',
          content: 'Clean, labeled, and diverse data leads to better model performance.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        }
      ],
      questions: [
        'What makes data "good" for machine learning?',
        'How much data do we typically need?',
        'What are the challenges in collecting waste data?'
      ],
      children: [
        {
          id: '1.1',
          title: 'Image Dataset',
          content: 'Waste images collection',
          icon: 'target',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          explanations: [
            {
              id: '1.1-exp',
              title: 'Image Annotation',
              content: 'Each image must be labeled with the correct waste category.',
              color: 'text-blue-500',
              bgColor: 'bg-blue-100'
            }
          ],
          questions: [
            'How do we ensure image quality?',
            'What lighting conditions work best?'
          ],
          children: [
            {
              id: '1.1.1',
              title: 'Organic Waste',
              content: 'Food and biodegradable items',
              color: 'text-green-600',
              bgColor: 'bg-green-50',
              explanations: [
                {
                  id: '1.1.1-exp',
                  title: 'Composting Process',
                  content: 'Organic waste can be composted to create nutrient-rich soil.',
                  color: 'text-green-500',
                  bgColor: 'bg-green-100'
                }
              ],
              questions: [
                'What types of organic waste are most common?',
                'How can we identify spoiled vs fresh food?'
              ]
            },
            {
              id: '1.1.2',
              title: 'Recyclables',
              content: 'Plastic, paper, metal',
              color: 'text-blue-500',
              bgColor: 'bg-blue-50',
              explanations: [
                {
                  id: '1.1.2-exp',
                  title: 'Recycling Process',
                  content: 'Recyclables are processed to create new materials.',
                  color: 'text-blue-400',
                  bgColor: 'bg-blue-100'
                }
              ],
              questions: [
                'Which plastics are recyclable?',
                'How do we sort different metals?'
              ]
            }
          ]
        },
        {
          id: '1.2',
          title: 'Sensor Data',
          content: 'IoT sensor readings',
          icon: 'cpu',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          explanations: [
            {
              id: '1.2-exp',
              title: 'Sensor Types',
              content: 'Weight, proximity, and environmental sensors provide additional data.',
              color: 'text-purple-500',
              bgColor: 'bg-purple-100'
            }
          ],
          questions: [
            'What sensors are most useful for waste detection?',
            'How do we calibrate sensors?'
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Model Development',
      content: 'Building ML models',
      icon: 'brain',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      explanations: [
        {
          id: '2-exp',
          title: 'Neural Networks',
          content: 'AI models that mimic how the human brain processes information.',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        },
        {
          id: '2-exp2',
          title: 'Training Process',
          content: 'The model learns by seeing thousands of examples and adjusting its parameters.',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        }
      ],
      questions: [
        'How does a neural network learn?',
        'What is the difference between training and inference?',
        'Why do we need different model architectures?'
      ],
      children: [
        {
          id: '2.1',
          title: 'CNN Architecture',
          content: 'Convolutional Neural Networks',
          icon: 'code',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          explanations: [
            {
              id: '2.1-exp',
              title: 'Image Processing',
              content: 'CNNs are specifically designed to process visual data like images.',
              color: 'text-purple-500',
              bgColor: 'bg-purple-100'
            }
          ],
          questions: [
            'How do CNNs process images?',
            'What are convolutional layers?'
          ],
          children: [
            {
              id: '2.1.1',
              title: 'ResNet50',
              content: 'Transfer learning approach',
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50',
              explanations: [
                {
                  id: '2.1.1-exp',
                  title: 'Pre-trained Model',
                  content: 'Uses knowledge from ImageNet to speed up training.',
                  color: 'text-indigo-500',
                  bgColor: 'bg-indigo-100'
                }
              ],
              questions: [
                'What is transfer learning?',
                'Why use pre-trained models?'
              ]
            },
            {
              id: '2.1.2',
              title: 'MobileNet',
              content: 'Lightweight for edge devices',
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50',
              explanations: [
                {
                  id: '2.1.2-exp',
                  title: 'Efficient Design',
                  content: 'Optimized for mobile and embedded devices with limited resources.',
                  color: 'text-indigo-500',
                  bgColor: 'bg-indigo-100'
                }
              ],
              questions: [
                'What makes a model "lightweight"?',
                'How do we balance accuracy and speed?'
              ]
            }
          ]
        },
        {
          id: '2.2',
          title: 'Training Pipeline',
          content: 'Model training process',
          icon: 'zap',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          explanations: [
            {
              id: '2.2-exp',
              title: 'Training Steps',
              content: 'Data preprocessing, model training, validation, and testing phases.',
              color: 'text-yellow-500',
              bgColor: 'bg-yellow-100'
            }
          ],
          questions: [
            'What happens during model training?',
            'How do we know when to stop training?'
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Deployment',
      content: 'Production implementation',
      icon: 'shield',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      explanations: [
        {
          id: '3-exp',
          title: 'Production Ready',
          content: 'Making the AI model available for real-world use with proper infrastructure.',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        }
      ],
      questions: [
        'What challenges exist in deploying AI models?',
        'How do we ensure reliability in production?'
      ],
      children: [
        {
          id: '3.1',
          title: 'Edge Computing',
          content: 'On-device processing',
          icon: 'cpu',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          explanations: [
            {
              id: '3.1-exp',
              title: 'Local Processing',
              content: 'AI runs directly on the dustbin device for faster response.',
              color: 'text-green-500',
              bgColor: 'bg-green-100'
            }
          ],
          questions: [
            'What are the benefits of edge computing?',
            'What hardware is needed for edge AI?'
          ]
        },
        {
          id: '3.2',
          title: 'Cloud API',
          content: 'REST API endpoints',
          icon: 'briefcase',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          explanations: [
            {
              id: '3.2-exp',
              title: 'Centralized Processing',
              content: 'AI processing happens on powerful cloud servers.',
              color: 'text-green-500',
              bgColor: 'bg-green-100'
            }
          ],
          questions: [
            'When should we use cloud vs edge?',
            'How do we handle network latency?'
          ]
        }
      ]
    },
    {
      id: '4',
      title: 'Monitoring',
      content: 'System performance tracking',
      icon: 'alert-triangle',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      explanations: [
        {
          id: '4-exp',
          title: 'Continuous Improvement',
          content: 'Monitoring helps identify issues and improve the system over time.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100'
        }
      ],
      questions: [
        'What metrics should we track?',
        'How do we handle model drift?'
      ],
      children: [
        {
          id: '4.1',
          title: 'Accuracy Metrics',
          content: 'Model performance KPIs',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          explanations: [
            {
              id: '4.1-exp',
              title: 'Performance Tracking',
              content: 'Measuring how well the AI correctly identifies waste types.',
              color: 'text-orange-500',
              bgColor: 'bg-orange-100'
            }
          ],
          questions: [
            'What is accuracy vs precision?',
            'How do we measure model performance?'
          ]
        },
        {
          id: '4.2',
          title: 'User Feedback',
          content: 'Continuous improvement',
          icon: 'users',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          explanations: [
            {
              id: '4.2-exp',
              title: 'Learning from Users',
              content: 'User corrections help improve the AI model over time.',
              color: 'text-orange-500',
              bgColor: 'bg-orange-100'
            }
          ],
          questions: [
            'How do we collect user feedback?',
            'How do we use feedback to improve the model?'
          ]
        }
      ]
    }
  ], 
  onClose, 
  onComplete 
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', '1', '2', '3', '4']));  // Expand main branches by default
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showExplanations, setShowExplanations] = useState<Set<string>>(new Set());
  const [showQuestions, setShowQuestions] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState<string>('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());

  // Icon mapping function
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    
    const iconMap: { [key: string]: React.ReactNode } = {
      'brain': <Brain className="w-4 h-4" />,
      'cpu': <Cpu className="w-4 h-4" />,
      'code': <Code className="w-4 h-4" />,
      'rotate-ccw': <RotateCcw className="w-4 h-4" />,
      'eye': <Eye className="w-3 h-3" />,
      'zap': <Zap className="w-3 h-3" />,
      'target': <Target className="w-3 h-3" />,
      'alert-triangle': <AlertTriangle className="w-3 h-3" />,
      'users': <Users className="w-3 h-3" />,
      'shield': <Shield className="w-3 h-3" />,
      'briefcase': <Briefcase className="w-3 h-3" />
    };
    
    return iconMap[iconName] || null;
  };

  // Calculate tree layout positions
  const calculateTreeLayout = useMemo(() => {
    const positions = new Map<string, NodePosition>();
    const HORIZONTAL_SPACING = 280;
    const VERTICAL_SPACING = 100;
    const NODE_WIDTH = 220;
    const NODE_HEIGHT = 60;

    // Helper function to calculate subtree height
    const getSubtreeHeight = (node: MindMapNode): number => {
      if (!node.children || node.children.length === 0 || !expandedNodes.has(node.id)) {
        return NODE_HEIGHT;
      }
      return node.children.reduce((sum, child) => sum + getSubtreeHeight(child) + VERTICAL_SPACING, -VERTICAL_SPACING);
    };

    // Recursive function to position nodes
    const positionNode = (node: MindMapNode, x: number, y: number, isRoot: boolean = false) => {
      positions.set(node.id, { x, y, width: NODE_WIDTH, height: NODE_HEIGHT });

      if (node.children && expandedNodes.has(node.id)) {
        const totalHeight = getSubtreeHeight(node) - NODE_HEIGHT;
        let currentY = y - totalHeight / 2;

        node.children.forEach((child) => {
          const childHeight = getSubtreeHeight(child);
          const childY = currentY + childHeight / 2;
          positionNode(child, x + HORIZONTAL_SPACING, childY);
          currentY += childHeight + VERTICAL_SPACING;
        });
      }
    };

    // Create a root node that contains all data
    const rootNode: MindMapNode = {
      id: 'root',
      title: 'Smart AI Dustbin',
      content: 'Machine Learning Journey',
      children: data,
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
      icon: 'brain'
    };

    // Start positioning from center
    positionNode(rootNode, 0, 0, true);

    return positions;
  }, [data, expandedNodes]);

  useEffect(() => {
    setNodePositions(calculateTreeLayout);
  }, [calculateTreeLayout]);

  const toggleNode = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const selectNode = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const toggleExplanations = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const toggleQuestions = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const startQuestion = (question: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentQuestion(question);
    setQuestionAnswer('');
  };

  const submitAnswer = () => {
    if (questionAnswer.trim()) {
      // Here you could save the answer or provide feedback
      alert(`Great answer! You said: "${questionAnswer}"\n\nThis shows you're thinking deeply about the topic. Keep exploring!`);
      setCurrentQuestion(null);
      setQuestionAnswer('');
    }
  };

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-area')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
  };

  // Handle zoom
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Render curved connection path
  const renderConnection = (fromId: string, toId: string) => {
    const fromPos = nodePositions.get(fromId);
    const toPos = nodePositions.get(toId);
    
    if (!fromPos || !toPos) return null;

    const startX = fromPos.x + fromPos.width;
    const startY = fromPos.y + fromPos.height / 2;
    const endX = toPos.x;
    const endY = toPos.y + toPos.height / 2;
    
    const controlPointOffset = Math.abs(endX - startX) * 0.5;
    const path = `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`;

    return (
      <path
        key={`${fromId}-${toId}`}
        d={path}
        stroke="url(#gradient)"
        strokeWidth="2"
        fill="none"
        className="transition-all duration-300"
        style={{
          strokeDasharray: selectedNode === toId || selectedNode === fromId ? '5, 5' : 'none',
          animation: selectedNode === toId || selectedNode === fromId ? 'dash 1s linear infinite' : 'none'
        }}
      />
    );
  };

  // Render all connections
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    const addConnections = (parent: MindMapNode) => {
      if (parent.children && expandedNodes.has(parent.id)) {
        parent.children.forEach(child => {
          connections.push(renderConnection(parent.id, child.id));
          addConnections(child);
        });
      }
    };

    // Start from root
    const rootNode = { id: 'root', children: data } as MindMapNode;
    addConnections(rootNode);
    
    return connections;
  };

  // Render node
  const renderNode = (node: MindMapNode, level: number = 0) => {
    const position = nodePositions.get(node.id);
    if (!position) return null;

    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const hasExplanations = node.explanations && node.explanations.length > 0;
    const hasQuestions = node.questions && node.questions.length > 0;
    const isRoot = node.id === 'root';
    const showExp = showExplanations.has(node.id);
    const showQ = showQuestions.has(node.id);

    return (
      <g key={node.id}>
        <foreignObject
          x={position.x}
          y={position.y}
          width={position.width + 50}
          height={position.height + 20}
          style={{ overflow: 'visible' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={`
                inline-flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                ${isRoot ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl' : node.bgColor}
                ${!isRoot && 'hover:shadow-lg hover:scale-105'}
                ${isSelected && !isRoot ? 'ring-2 ring-blue-400 shadow-xl' : ''}
                ${!isRoot ? 'border border-gray-200' : ''}
                min-w-[160px] max-w-[220px]
              `}
              onClick={(e) => selectNode(node.id, e)}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 flex-1">
                  {node.icon && (
                    <div className={`flex-shrink-0 ${isRoot ? 'text-white' : node.color}`}>
                      {getIcon(node.icon)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isRoot ? 'text-white' : node.color}`}>
                      {node.title}
                    </div>
                    {isSelected && !isRoot && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {node.content}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {hasExplanations && (
                    <button
                      onClick={(e) => toggleExplanations(node.id, e)}
                      className={`
                        p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors flex-shrink-0
                        ${isRoot ? 'text-white' : 'text-gray-400 hover:text-gray-600'}
                        ${showExp ? 'bg-white bg-opacity-20' : ''}
                      `}
                      title="Show explanations"
                    >
                      <Brain className="w-3 h-3" />
                    </button>
                  )}
                  {hasQuestions && (
                    <button
                      onClick={(e) => toggleQuestions(node.id, e)}
                      className={`
                        p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors flex-shrink-0
                        ${isRoot ? 'text-white' : 'text-gray-400 hover:text-gray-600'}
                        ${showQ ? 'bg-white bg-opacity-20' : ''}
                      `}
                      title="Show questions"
                    >
                      <Target className="w-3 h-3" />
                    </button>
                  )}
                  {hasChildren && (
                    <button
                      onClick={(e) => toggleNode(node.id, e)}
                      className={`
                        ml-1 p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors flex-shrink-0
                        ${isRoot ? 'text-white' : 'text-gray-400 hover:text-gray-600'}
                      `}
                    >
                      {isExpanded ? (
                        <Minus className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </foreignObject>
        
        {/* Render explanations */}
        {showExp && hasExplanations && (
          <foreignObject
            x={position.x + position.width + 20}
            y={position.y - 20}
            width="300"
            height="200"
            style={{ overflow: 'visible' }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Explanations</h4>
              <div className="space-y-2">
                {node.explanations?.map((exp, idx) => (
                  <div key={exp.id} className="text-xs">
                    <div className={`font-medium ${exp.color}`}>{exp.title}</div>
                    <div className="text-gray-600 mt-1">{exp.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </foreignObject>
        )}

        {/* Render questions */}
        {showQ && hasQuestions && (
          <foreignObject
            x={position.x + position.width + 20}
            y={position.y + 100}
            width="300"
            height="200"
            style={{ overflow: 'visible' }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Explore Questions</h4>
              <div className="space-y-2">
                {node.questions?.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => startQuestion(question, e)}
                    className="w-full text-left p-2 rounded hover:bg-gray-50 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </foreignObject>
        )}
        
        {/* Render children */}
        {node.children && isExpanded && node.children.map(child => renderNode(child, level + 1))}
      </g>
    );
  };

  // Create root node with all data as children
  const rootNode: MindMapNode = {
    id: 'root',
    title: 'Smart AI Dustbin',
    content: 'Machine Learning Journey',
    children: data,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
    icon: 'brain'
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            {description && (
              <p className="text-gray-500 text-sm mt-0.5">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {onComplete && (
              <button
                onClick={onComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Complete
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-20 right-4 z-40 flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1">
          <button
            onClick={() => handleZoom(0.1)}
            className="p-2 hover:bg-gray-100 rounded transition-colors block"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <div className="text-center py-1 text-xs font-medium text-gray-600 border-y border-gray-200">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-2 hover:bg-gray-100 rounded transition-colors block"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={resetView}
            className="p-2 hover:bg-gray-100 rounded transition-colors block border-t border-gray-200"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 text-xs max-w-xs">
          <div className="space-y-1.5 text-gray-600">
            <div className="flex items-center gap-2">
              <Move className="w-3 h-3 text-gray-400" />
              <span>Drag canvas to pan</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-gray-400" />
              <span>Click nodes to view details</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-gray-400" />
              <span>Click brain icon for explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-gray-400" />
              <span>Click target icon for questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Plus className="w-3 h-3 text-gray-400" />
              <span>Click +/- to expand/collapse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {currentQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Think About This Question</h3>
            <p className="text-gray-600 mb-4">{currentQuestion}</p>
            <textarea
              value={questionAnswer}
              onChange={(e) => setQuestionAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={submitAnswer}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
              <button
                onClick={() => setCurrentQuestion(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing canvas-area"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* SVG Canvas */}
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Define gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6b7280" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Translate to center */}
          <g transform={`translate(${typeof window !== 'undefined' ? window.innerWidth / 2 : 800}, ${typeof window !== 'undefined' ? window.innerHeight / 2 : 400})`}>
            {/* Render connections first (behind nodes) */}
            {renderConnections()}
            
            {/* Render all nodes */}
            {renderNode(rootNode)}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ReusableMindMap;