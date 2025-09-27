import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Save, Lightbulb, Zap, Trash2, Grid3X3, BookOpen, CheckCircle, Circle, ArrowRight, ChevronLeft, ChevronRight, Award, Smartphone, Wifi, AlertTriangle } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  icon: string;
  category: string;
  color: string;
  width: number;
  height: number;
  pins: { name: string; x: number; y: number; type: 'input' | 'output' | 'power' | 'ground' }[];
}

interface PlacedComponent {
  id: string;
  component: Component;
  x: number;
  y: number;
  rotation: number;
  state?: any;
}

interface Wire {
  id: string;
  fromComponent: string;
  fromPin: string;
  toComponent: string;
  toPin: string;
  color: string;
}

interface Connection {
  componentId: string;
  pin: string;
  x: number;
  y: number;
}

interface CircuitNode {
  id: string;
  voltage: number;
  components: { componentId: string; pin: string }[];
}

interface LearningCard {
  id: number;
  title: string;
  description: string;
  type: 'story' | 'quiz' | 'activity' | 'feedback' | 'achievement';
  content?: string;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
  requiredComponents?: string[];
  requiredConnections?: number;
  completed: boolean;
  unlocked: boolean;
}

const ElectronicsPlayground: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [isWiring, setIsWiring] = useState(false);
  const [wireStart, setWireStart] = useState<Connection | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [circuitState, setCircuitState] = useState<Map<string, any>>(new Map());
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [switchStates, setSwitchStates] = useState<Map<string, boolean>>(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);

  const components: Component[] = [
    {
      id: 'led',
      name: 'LED',
      icon: '',
      category: 'Output',
      color: '#f59e0b',
      width: 80,
      height: 30,
      pins: [
        { name: 'anode', x: -30, y: 0, type: 'input' },
        { name: 'cathode', x: 30, y: 0, type: 'ground' }
      ]
    },
    {
      id: 'resistor',
      name: 'Resistor (220Ω)',
      icon: '⚡',
      category: 'Passive',
      color: '#f97316',
      width: 100,
      height: 25,
      pins: [
        { name: 'pin1', x: -45, y: 0, type: 'input' },
        { name: 'pin2', x: 45, y: 0, type: 'input' }
      ]
    },
    {
      id: 'battery',
      name: '9V Battery',
      icon: '🔋',
      category: 'Power',
      color: '#22c55e',
      width: 60,
      height: 100,
      pins: [
        { name: 'positive', x: 0, y: -45, type: 'power' },
        { name: 'negative', x: 0, y: 45, type: 'ground' }
      ]
    },
    {
      id: 'switch',
      name: 'Push Button',
      icon: '🔘',
      category: 'Control',
      color: '#3b82f6',
      width: 70,
      height: 70,
      pins: [
        { name: 'pin1', x: -25, y: -25, type: 'input' },
        { name: 'pin2', x: 25, y: -25, type: 'input' },
        { name: 'pin3', x: -25, y: 25, type: 'input' },
        { name: 'pin4', x: 25, y: 25, type: 'input' }
      ]
    },
    {
      id: 'esp8266',
      name: 'ESP8266 WiFi',
      icon: '📡',
      category: 'Smart',
      color: '#8b5cf6',
      width: 120,
      height: 80,
      pins: [
        { name: 'vin', x: -50, y: -30, type: 'power' },
        { name: 'gnd', x: -50, y: 30, type: 'ground' },
        { name: 'gpio2', x: 50, y: -15, type: 'output' },
        { name: 'gpio0', x: 50, y: 15, type: 'input' },
        { name: '3v3', x: -50, y: 0, type: 'power' },
        { name: 'rst', x: 50, y: -30, type: 'input' },
        { name: 'en', x: 50, y: 30, type: 'input' }
      ]
    }
  ];

  const learningCards: LearningCard[] = [
    {
      id: 1,
      title: "Introduce the Problem",
      description: "Grandma wants to turn on the light at night… but she has to walk all the way to the switchboard. That's not safe! Can we help her?",
      type: 'story',
      content: "💡 Every day, Grandma struggles in the dark trying to reach the light switch. There must be a better way!",
      completed: false,
      unlocked: true
    },
    {
      id: 2,
      title: "Existing Solution",
      description: "When the room is dark → you want light → you walk to the switch and press it. Simple. But… is it always easy to reach?",
      type: 'story',
      content: "🤔 The current solution works, but it's not always convenient or safe, especially for elderly people.",
      completed: false,
      unlocked: false
    },
    {
      id: 3,
      title: "What happens inside the wall?",
      description: "When you press the switch, it tells the light to glow. The switch is like a gatekeeper — it allows or blocks electricity.",
      type: 'story',
      content: "⚡ The switch controls the flow of electricity, just like a gate controls the flow of water!",
      completed: false,
      unlocked: false
    },
    {
      id: 4,
      title: "Relatable Analogy",
      description: "Think of an oil lamp: Oil = electricity, Wick = wire, Flame size = switch. Can you see how it works?",
      type: 'story',
      content: "🔥 Just like controlling flame size with a wick, we control light with electrical switches!",
      completed: false,
      unlocked: false
    },
    {
      id: 5,
      title: "Quick Quiz",
      description: "Question: What controls the state of the light (on/off)? Options: Battery / Switch / Wire / Lamp",
      type: 'quiz',
      quiz: {
        question: "What controls the state of the light (on/off)?",
        options: ["Battery", "Switch", "Wire", "Lamp"],
        correct: 1
      },
      completed: false,
      unlocked: false
    },
    {
      id: 6,
      title: "Canvas Activity – Add Light",
      description: "Let's brighten a dark room! Drag a light bulb onto the canvas.",
      type: 'activity',
      content: "🎯 Click on the LED component, then click on the canvas to place it!",
      requiredComponents: ['led'],
      completed: false,
      unlocked: false
    },
    {
      id: 7,
      title: "Canvas Activity – Power Source",
      description: "How do we make it glow? Add a battery and connect it with wires! (Grid-based snapping helps them connect terminals easily)",
      type: 'activity',
      content: "⚡ Every circuit needs power! Add a battery to provide energy.",
      requiredComponents: ['led', 'battery'],
      requiredConnections: 2,
      completed: false,
      unlocked: false
    },
    {
      id: 8,
      title: "Simulation Feedback",
      description: "✨ Light glows! You made your first circuit! Now… how do we turn it OFF?",
      type: 'feedback',
      content: "🎉 Amazing! Your LED is glowing, but we need a way to control it.",
      completed: false,
      unlocked: false
    },
    {
      id: 9,
      title: "Unlock Switch",
      description: "We need a switch! Add it from the toolbox, place it between battery and light, and connect.",
      type: 'activity',
      content: "🎮 A switch gives us control over the circuit!",
      requiredComponents: ['led', 'battery', 'switch'],
      requiredConnections: 4,
      completed: false,
      unlocked: false
    },
    {
      id: 10,
      title: "Circuit Upgrade",
      description: "Press the switch ON → light glows. Press OFF → light goes dark. You just built a real control system!",
      type: 'feedback',
      content: "🚀 You've created a controllable lighting system!",
      completed: false,
      unlocked: false
    },
    {
      id: 11,
      title: "Simulation Twist",
      description: "Oops! Too much energy made the LED burn out.",
      type: 'feedback',
      content: "💥 Without protection, components can get damaged by too much current!",
      completed: false,
      unlocked: false
    },
    {
      id: 12,
      title: "Introduce Resistor",
      description: "Just like eating too much food makes you sick, too much electricity makes LEDs burn. Resistors protect them. Add a resistor before the light.",
      type: 'activity',
      content: "⚡ Resistors limit current flow to safe levels!",
      requiredComponents: ['led', 'battery', 'switch', 'resistor'],
      requiredConnections: 5,
      completed: false,
      unlocked: false
    },
    {
      id: 13,
      title: "Limitation of Switch",
      description: "But… we still need to walk to the switch. Can we control it without touching?",
      type: 'story',
      content: "🤔 Physical switches still require us to be there. What if we could control it remotely?",
      completed: false,
      unlocked: false
    },
    {
      id: 14,
      title: "Introduce ESP8266",
      description: "Meet ESP8266 — your assistant! It listens to your phone and flips the switch for you.",
      type: 'story',
      content: "🧠 This tiny computer can connect to WiFi and receive commands from your phone!",
      completed: false,
      unlocked: false
    },
    {
      id: 15,
      title: "Canvas Activity – Smart Upgrade",
      description: "Add ESP8266 to your circuit. Connect it to the light. Now you can control the light from your phone!",
      type: 'activity',
      content: "📱 Transform your circuit into a smart home system!",
      requiredComponents: ['led', 'battery', 'switch', 'resistor', 'esp8266'],
      requiredConnections: 7,
      completed: false,
      unlocked: false
    },
    {
      id: 16,
      title: "Achievement Badge",
      description: "You just built your first Smart Home Automation System! 🏆 (Unlock next project: Smart Fan / Smart Door Lock, etc.)",
      type: 'achievement',
      content: "🎉 Congratulations! You've mastered the basics of smart home automation. Ready for the next challenge?",
      completed: false,
      unlocked: false
    }
  ];

  const [cards, setCards] = useState<LearningCard[]>(learningCards);
  const [showBurnEffect, setShowBurnEffect] = useState(false);

  // Check card completion and unlock logic
  useEffect(() => {
    const newCards = [...cards];
    
    // Card 1: Always completed (story introduction)
    newCards[0].completed = true;
    newCards[1].unlocked = true;
    
    // Card 2-4: Story cards, auto-complete after reading
    for (let i = 1; i <= 3; i++) {
      if (newCards[i-1].completed) {
        newCards[i].completed = true;
        if (i < newCards.length - 1) newCards[i+1].unlocked = true;
      }
    }
    
    // Card 5: Quiz - completed when correct answer is selected
    if (quizAnswer === 1) { // Switch is correct answer
      newCards[4].completed = true;
      newCards[5].unlocked = true;
    }
    
    // Card 6: Add LED (Card 5 in sequence)
    const hasLED = placedComponents.some(comp => comp.component.id === 'led');
    if (hasLED) {
      newCards[5].completed = true;
      newCards[6].unlocked = true;
    }
    
    // Card 7: Add battery and basic connections (Card 6 in sequence)
    const hasBattery = placedComponents.some(comp => comp.component.id === 'battery');
    const basicConnections = wires.length >= 2;
    if (hasBattery && hasLED && basicConnections) {
      newCards[6].completed = true;
      newCards[7].unlocked = true;
    }
    
    // Card 8: LED glowing feedback (Card 7 in sequence)
    const ledIsGlowing = Array.from(circuitState.values()).some((state: any) => state.isOn);
    if (ledIsGlowing && !placedComponents.some(comp => comp.component.id === 'switch')) {
      newCards[7].completed = true;
      newCards[8].unlocked = true;
    }
    
    // Card 9: Add switch (Card 8 in sequence) - FIXED LOGIC
    const hasSwitch = placedComponents.some(comp => comp.component.id === 'switch');
    const switchConnections = wires.length >= 4;
    if (hasSwitch && hasBattery && hasLED && switchConnections) {
      newCards[8].completed = true;
      newCards[9].unlocked = true;
    }
    
    // Card 10: Switch control feedback (Card 9 in sequence)
    if (hasSwitch && ledIsGlowing && switchConnections) {
      newCards[9].completed = true;
      newCards[10].unlocked = true;
      // Trigger burn effect after switch is working
      setTimeout(() => setShowBurnEffect(true), 2000);
    }
    
    // Card 11: Burn effect (Card 10 in sequence)
    if (showBurnEffect) {
      newCards[10].completed = true;
      newCards[11].unlocked = true;
    }
    
    // Card 12: Add resistor (Card 11 in sequence)
    const hasResistor = placedComponents.some(comp => comp.component.id === 'resistor');
    const resistorConnections = wires.length >= 5;
    if (hasResistor && hasSwitch && hasBattery && hasLED && resistorConnections) {
      newCards[11].completed = true;
      newCards[12].unlocked = true;
      setShowBurnEffect(false); // Remove burn effect
    }
    
    // Card 13: Limitation story (Card 12 in sequence)
    if (newCards[11].completed) {
      newCards[12].completed = true;
      newCards[13].unlocked = true;
    }
    
    // Card 14: ESP8266 introduction story (Card 13 in sequence)
    if (newCards[12].completed) {
      newCards[13].completed = true;
      newCards[14].unlocked = true;
    }
    
    // Card 15: ESP8266 smart upgrade (Card 14 in sequence)
    const hasESP = placedComponents.some(comp => comp.component.id === 'esp8266');
    const espConnections = wires.length >= 7;
    if (hasESP && hasResistor && hasSwitch && hasBattery && hasLED && espConnections) {
      newCards[14].completed = true;
      newCards[15].unlocked = true;
    }
    
    // Card 16: Final achievement
    if (newCards[14].completed) {
      newCards[15].completed = true;
    }
    
    setCards(newCards);
  }, [placedComponents, wires, circuitState, quizAnswer, showBurnEffect]);

  const nextCard = () => {
    const nextUnlockedCard = cards.findIndex((card, index) => 
      index > currentStep && card.unlocked
    );
    if (nextUnlockedCard !== -1) {
      setCurrentStep(nextUnlockedCard);
    } else if (currentStep < cards.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevCard = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizAnswer(answerIndex);
  };

  // Circuit simulation logic
  const simulateCircuit = useCallback(() => {
    const newCircuitState = new Map();
    
    // Find all connected networks
    const networks: CircuitNode[] = [];
    const visited = new Set<string>();
    
    // Build connection graph
    const connectionGraph = new Map<string, Set<string>>();
    
    wires.forEach(wire => {
      const fromKey = `${wire.fromComponent}-${wire.fromPin}`;
      const toKey = `${wire.toComponent}-${wire.toPin}`;
      
      if (!connectionGraph.has(fromKey)) connectionGraph.set(fromKey, new Set());
      if (!connectionGraph.has(toKey)) connectionGraph.set(toKey, new Set());
      
      connectionGraph.get(fromKey)!.add(toKey);
      connectionGraph.get(toKey)!.add(fromKey);
    });
    
    // Check for switch interruptions in the circuit
    const isCircuitComplete = (fromKey: string, toKey: string): boolean => {
      // If path goes through a switch, check if switch is closed
      const visited = new Set<string>();
      const queue = [fromKey];
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        
        if (current === toKey) return true;
        
        const connections = connectionGraph.get(current);
        if (connections) {
          connections.forEach(connected => {
            if (!visited.has(connected)) {
              // Check if this connection goes through a switch
              const [compId] = connected.split('-');
              const comp = placedComponents.find(c => c.id === compId);
              
              if (comp?.component.id === 'switch') {
                // Only allow current through if switch is closed
                if (switchStates.get(compId)) {
                  queue.push(connected);
                }
              } else {
                queue.push(connected);
              }
            }
          });
        }
      }
      
      return false;
    };
    
    // Find connected components using DFS
    const findNetwork = (startKey: string): string[] => {
      const network: string[] = [];
      const stack = [startKey];
      
      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;
        
        visited.add(current);
        network.push(current);
        
        const connections = connectionGraph.get(current);
        if (connections) {
          connections.forEach(connected => {
            if (!visited.has(connected)) {
              // Check if connection goes through a closed switch
              const [compId] = connected.split('-');
              const comp = placedComponents.find(c => c.id === compId);
              
              if (comp?.component.id === 'switch') {
                if (switchStates.get(compId)) {
                  stack.push(connected);
                }
              } else {
              stack.push(connected);
              }
            }
          });
        }
      }
      
      return network;
    };
    
    // Create networks
    connectionGraph.forEach((_, key) => {
      if (!visited.has(key)) {
        const networkNodes = findNetwork(key);
        if (networkNodes.length > 1) {
          networks.push({
            id: `network-${networks.length}`,
            voltage: 0,
            components: networkNodes.map(node => {
              const [componentId, pin] = node.split('-');
              return { componentId, pin };
            })
          });
        }
      }
    });
    
    // Determine voltage levels for each network
    networks.forEach(network => {
      let hasPositivePower = false;
      let hasGround = false;
      
      network.components.forEach(({ componentId, pin }) => {
        const component = placedComponents.find(c => c.id === componentId);
        if (!component) return;
        
        const pinInfo = component.component.pins.find(p => p.name === pin);
        if (!pinInfo) return;
        
        if (component.component.id === 'battery' && pin === 'positive') {
          hasPositivePower = true;
        } else if (pinInfo.type === 'ground' || pin === 'negative') {
          hasGround = true;
        }
      });
      
      if (hasPositivePower && !hasGround) {
        network.voltage = 9; // 9V battery
      } else if (hasGround) {
        network.voltage = 0; // Ground
      }
    });
    
    // Update component states based on circuit analysis
    placedComponents.forEach(component => {
      const componentState: any = {};
      
      if (component.component.id === 'led') {
        // Check if LED has voltage across it
        const anodeNetwork = networks.find(n => 
          n.components.some(c => c.componentId === component.id && c.pin === 'anode')
        );
        const cathodeNetwork = networks.find(n => 
          n.components.some(c => c.componentId === component.id && c.pin === 'cathode')
        );
        
        // Check if there's a complete circuit path considering switch states
        const hasCompletePath = anodeNetwork && cathodeNetwork && anodeNetwork !== cathodeNetwork;
        
        if (hasCompletePath) {
          const voltageDiff = anodeNetwork.voltage - cathodeNetwork.voltage;
          
          // Check if any switches in the circuit are open
          let circuitClosed = true;
          placedComponents.forEach(comp => {
            if (comp.component.id === 'switch') {
              const switchInCircuit = wires.some(wire => 
                wire.fromComponent === comp.id || wire.toComponent === comp.id
              );
              if (switchInCircuit && !switchStates.get(comp.id)) {
                circuitClosed = false;
              }
            }
          });
          
          if (voltageDiff > 0 && circuitClosed) {
            componentState.isOn = true;
            componentState.brightness = Math.min(voltageDiff / 5, 1);
            componentState.color = '#fbbf24'; // Yellow when powered
          } else {
            componentState.isOn = false;
            componentState.color = '#6b7280'; // Gray when not powered
          }
        } else {
          componentState.isOn = false;
          componentState.color = '#6b7280'; // Gray when not connected
        }
      }
      
      // Switch state
      if (component.component.id === 'switch') {
        componentState.isPressed = switchStates.get(component.id) || false;
      }
      
      // ESP8266 state
      if (component.component.id === 'esp8266') {
        componentState.isConnected = true;
      }
      
      newCircuitState.set(component.id, componentState);
    });
    
    setCircuitState(newCircuitState);
  }, [placedComponents, wires, switchStates]);

  // Auto-simulate when circuit changes
  useEffect(() => {
    if (placedComponents.length > 0) {
      const timeoutId = setTimeout(simulateCircuit, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [placedComponents, wires, switchStates, simulateCircuit]);

  const toggleSwitch = (switchId: string) => {
    setSwitchStates(prev => {
      const newStates = new Map(prev);
      newStates.set(switchId, !newStates.get(switchId));
      return newStates;
    });
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid
    const gridSize = 20;
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    
    if (selectedComponent && !isWiring) {
      const component = components.find(c => c.id === selectedComponent);
      if (component) {
        const newComponent: PlacedComponent = {
          id: `${component.id}-${Date.now()}`,
          component,
          x: snappedX,
          y: snappedY,
          rotation: 0,
          state: {}
        };
        setPlacedComponents(prev => [...prev, newComponent]);
        setSelectedComponent(null);
      }
    }
  }, [selectedComponent, isWiring, components]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  }, []);

  const startWiring = (componentId: string, pin: string, x: number, y: number) => {
    if (!isWiring) {
      setIsWiring(true);
      setWireStart({ componentId, pin, x, y });
    } else if (wireStart && wireStart.componentId !== componentId) {
      const wireColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
      const newWire: Wire = {
        id: `wire-${Date.now()}`,
        fromComponent: wireStart.componentId,
        fromPin: wireStart.pin,
        toComponent: componentId,
        toPin: pin,
        color: wireColors[wires.length % wireColors.length]
      };
      setWires(prev => [...prev, newWire]);
      setIsWiring(false);
      setWireStart(null);
    }
  };

  const cancelWiring = () => {
    setIsWiring(false);
    setWireStart(null);
  };

  const removeComponent = (id: string) => {
    setPlacedComponents(prev => prev.filter(comp => comp.id !== id));
    setWires(prev => prev.filter(wire => 
      wire.fromComponent !== id && wire.toComponent !== id
    ));
  };

  const clearCanvas = () => {
    setPlacedComponents([]);
    setWires([]);
    setCircuitState(new Map());
    setSwitchStates(new Map());
    cancelWiring();
  };

  const rotateComponent = (id: string) => {
    setPlacedComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, rotation: (comp.rotation + 90) % 360 } : comp
    ));
  };

  const getPinPosition = (component: PlacedComponent, pin: { name: string; x: number; y: number }) => {
    const cos = Math.cos((component.rotation * Math.PI) / 180);
    const sin = Math.sin((component.rotation * Math.PI) / 180);
    
    const rotatedX = pin.x * cos - pin.y * sin;
    const rotatedY = pin.x * sin + pin.y * cos;
    
    return {
      x: component.x + rotatedX,
      y: component.y + rotatedY
    };
  };

  const renderComponent = (placedComp: PlacedComponent) => {
    const { component, x, y, rotation, id } = placedComp;
    const componentState = circuitState.get(id) || {};
    
    const isLEDOn = component.id === 'led' && componentState.isOn;
    const ledBrightness = componentState.brightness || 0;
    const isBurned = showBurnEffect && component.id === 'led';
    const isConnectedToBattery = component.id === 'led' && wires.some(wire => 
      (wire.fromComponent === id || wire.toComponent === id) &&
      placedComponents.some(comp => 
        (comp.id === wire.fromComponent || comp.id === wire.toComponent) && 
        comp.component.id === 'battery'
      )
    );
    const isSwitchPressed = component.id === 'switch' && switchStates.get(id);
    
    return (
      <div key={id} className="absolute select-none">
        <div
          className={`absolute border-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
            component.id === 'switch' ? 'cursor-pointer' : 'cursor-move'
          } ${
            isLEDOn ? 'animate-pulse' : ''
          }`}
          style={{ 
            left: x - component.width / 2, 
            top: y - component.height / 2,
            width: component.width,
            height: component.height,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            backgroundColor: component.id === 'led' 
              ? isLEDOn 
                ? `rgba(255, 255, 0, ${0.3 + ledBrightness * 0.7})`
                : isConnectedToBattery 
                  ? 'rgba(251, 191, 36, 0.2)' // Light yellow when connected to battery
                  : component.color + '20'
              : component.id === 'switch'
                ? isSwitchPressed 
                  ? 'rgba(34, 197, 94, 0.3)' // Green when pressed
                  : 'rgba(59, 130, 246, 0.2)' // Blue when not pressed
                : component.color + '20',
            borderColor: isBurned ? '#ef4444' : 
                        component.id === 'led' 
                          ? isLEDOn 
                            ? '#fbbf24' 
                            : isConnectedToBattery 
                              ? '#f59e0b' // Orange border when connected
                              : component.color
                          : component.id === 'switch'
                            ? isSwitchPressed 
                              ? '#22c55e' // Green border when pressed
                              : '#3b82f6' // Blue border when not pressed
                            : component.color,
            borderWidth: '3px',
            boxShadow: isLEDOn 
              ? `0 0 20px rgba(255, 255, 0, ${ledBrightness}), 0 4px 6px -1px rgba(0, 0, 0, 0.1)` 
              : undefined
          }}
          onDoubleClick={() => rotateComponent(id)}
          onClick={() => {
            if (component.id === 'switch') {
              toggleSwitch(id);
            }
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <div className={`text-3xl mb-1 ${isLEDOn ? 'filter brightness-150' : ''}`}>
              {component.id === 'led' ? (
                isBurned ? '💥' : (isLEDOn ? '🌟' : '⚪')
              ) : component.id === 'switch' ? (
                isSwitchPressed ? '🟢' : '🔘'
              ) : component.id === 'esp8266' ? (
                componentState.isConnected ? '📡' : '📴'
              ) : component.icon}
            </div>
            <div className="text-xs font-bold text-gray-700 text-center leading-tight">
              {component.name}
            </div>
            {isLEDOn && (
              <div className="text-xs text-yellow-600 font-bold mt-1">
                GLOWING!
              </div>
            )}
            {component.id === 'led' && isConnectedToBattery && !isLEDOn && (
              <div className="text-xs text-orange-600 font-bold mt-1">
                CONNECTED
              </div>
            )}
            {component.id === 'switch' && (
              <div className={`text-xs font-bold mt-1 ${
                isSwitchPressed ? 'text-green-600' : 'text-blue-600'
              }`}>
                {isSwitchPressed ? 'ON' : 'OFF'}
              </div>
            )}
            {isBurned && (
              <div className="text-xs text-red-600 font-bold mt-1 animate-pulse">
                BURNED!
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeComponent(id);
            }}
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold"
          >
            ×
          </button>
        </div>
        
        {component.pins.map((pin) => {
          const pinPos = getPinPosition(placedComp, pin);
          const pinColor = pin.type === 'power' ? '#ef4444' : 
                          pin.type === 'ground' ? '#000000' :
                          pin.type === 'output' ? '#22c55e' : '#3b82f6';
          
          return (
            <div
              key={pin.name}
              className="absolute border-2 border-gray-800 rounded-full cursor-crosshair hover:scale-125 transition-all duration-200 flex items-center justify-center text-xs font-bold"
              style={{ 
                left: pinPos.x - 12, 
                top: pinPos.y - 12,
                width: '24px',
                height: '24px',
                backgroundColor: pinColor,
                color: 'white'
              }}
              onClick={(e) => {
                e.stopPropagation();
                startWiring(id, pin.name, pinPos.x, pinPos.y);
              }}
              title={`${component.name} - ${pin.name} (${pin.type})`}
            >
              {pin.type === 'power' ? '+' : 
               pin.type === 'ground' ? '-' :
               pin.type === 'output' ? '→' : '←'}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWire = (wire: Wire) => {
    const fromComp = placedComponents.find(c => c.id === wire.fromComponent);
    const toComp = placedComponents.find(c => c.id === wire.toComponent);
    
    if (!fromComp || !toComp) return null;
    
    const fromPin = fromComp.component.pins.find(p => p.name === wire.fromPin);
    const toPin = toComp.component.pins.find(p => p.name === wire.toPin);
    
    if (!fromPin || !toPin) return null;
    
    const fromPos = getPinPosition(fromComp, fromPin);
    const toPos = getPinPosition(toComp, toPin);
    
    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    const controlOffset = 30;
    
    const pathData = `M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY - controlOffset} ${toPos.x} ${toPos.y}`;
    
    return (
      <g key={wire.id}>
        <path
          d={pathData}
          stroke={wire.color}
          strokeWidth="6"
          fill="none"
          className="drop-shadow-sm"
        />
        <circle cx={fromPos.x} cy={fromPos.y} r="4" fill={wire.color} />
        <circle cx={toPos.x} cy={toPos.y} r="4" fill={wire.color} />
      </g>
    );
  };

  const renderCurrentWire = () => {
    if (!isWiring || !wireStart) return null;
    
    const pathData = `M ${wireStart.x} ${wireStart.y} L ${mousePos.x} ${mousePos.y}`;
    
    return (
      <g>
        <path
          d={pathData}
          stroke="#3b82f6"
          strokeWidth="6"
          strokeDasharray="12,6"
          fill="none"
          className="animate-pulse"
        />
        <circle cx={wireStart.x} cy={wireStart.y} r="4" fill="#3b82f6" />
      </g>
    );
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    
    const gridSize = 20;
    const lines = [];
    
    for (let x = 0; x < 1200; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={700}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }
    
    for (let y = 0; y < 700; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={1200}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }
    
    return <g>{lines}</g>;
  };

  return (
    <div className="h-screen overflow-hidden w-full m-0 p-0">
      <div className="flex h-screen w-screen m-0 p-0">
        {/* Left Instruction Panel (30%) */}
        <div className="w-2/5 bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden flex flex-col h-screen m-0 p-0 min-h-screen" style={{ width: '40%' }}>

          {/* Progress Bar */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round((cards.filter(s => s.completed).length / cards.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(cards.filter(s => s.completed).length / cards.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Card */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center mb-3">
                {cards[currentStep]?.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : cards[currentStep]?.unlocked ? (
                  <Circle className="w-6 h-6 text-blue-400 mr-2" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500 mr-2" />
                )}
                <span className={`text-sm font-medium ${
                  cards[currentStep]?.unlocked ? 'text-blue-400' : 'text-gray-500'
                }`}>
                  Card {currentStep + 1} of {cards.length}
                </span>
                {cards[currentStep]?.type === 'achievement' && (
                  <Award className="w-5 h-5 text-yellow-500 ml-2" />
                )}
              </div>
              
              <h3 className={`text-2xl font-bold mb-4 ${
                cards[currentStep]?.type === 'achievement' ? 'text-yellow-400' : 'text-white'
              }`}>
                {cards[currentStep]?.title}
              </h3>
              
              <p className={`mb-6 leading-relaxed text-base ${
                cards[currentStep]?.unlocked ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {cards[currentStep]?.description}
              </p>
              
              {cards[currentStep]?.content && (
                <div className={`rounded-lg p-4 mb-6 border-l-4 ${
                  cards[currentStep]?.type === 'achievement' 
                    ? 'bg-yellow-900 bg-opacity-30 border-yellow-500'
                    : cards[currentStep]?.type === 'feedback' && showBurnEffect
                      ? 'bg-red-900 bg-opacity-50 border-red-500'
                      : 'bg-blue-900 bg-opacity-50 border-blue-500'
                }`}>
                  <p className={`text-base leading-relaxed ${
                    cards[currentStep]?.type === 'achievement' 
                      ? 'text-yellow-200'
                      : cards[currentStep]?.type === 'feedback' && showBurnEffect
                        ? 'text-red-200'
                        : 'text-blue-200'
                  }`}>
                    {cards[currentStep].content}
                  </p>
                </div>
              )}
              
              {/* Quiz Interface */}
              {cards[currentStep]?.type === 'quiz' && cards[currentStep]?.quiz && (
                <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 mb-6 border-l-4 border-purple-500">
                  <p className="text-purple-200 font-medium mb-4">
                    {cards[currentStep].quiz!.question}
                  </p>
                  <div className="space-y-2">
                    {cards[currentStep].quiz!.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                          quizAnswer === index
                            ? index === cards[currentStep].quiz!.correct
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {quizAnswer !== null && (
                    <p className={`mt-3 text-sm ${
                      quizAnswer === cards[currentStep].quiz!.correct
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {quizAnswer === cards[currentStep].quiz!.correct
                        ? '✅ Correct! The switch controls the light.'
                        : '❌ Try again! Think about what directly controls the light.'}
                    </p>
                  )}
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={prevCard}
                  disabled={currentStep === 0}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentStep === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                
                <span className="text-gray-400 text-sm">
                  {currentStep + 1} / {cards.length}
                </span>
                
                <button
                  onClick={nextCard}
                  disabled={currentStep === cards.length - 1}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentStep === cards.length - 1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Components Needed */}
            {cards[currentStep]?.requiredComponents && cards[currentStep].requiredComponents!.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Components Needed:
                </h4>
                <div className="space-y-2">
                  {cards[currentStep].requiredComponents!.map(compId => {
                    const comp = components.find(c => c.id === compId);
                    const isPlaced = placedComponents.some(pc => pc.component.id === compId);
                    return (
                      <div key={compId} className={`flex items-center p-2 rounded-lg ${
                        isPlaced ? 'bg-green-900 bg-opacity-50' : 'bg-gray-800'
                      }`}>
                        <div className="text-2xl mr-3">{comp?.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{comp?.name}</div>
                        </div>
                        {isPlaced && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Circuit Status */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Circuit Status:
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-300">Components: {placedComponents.length}</p>
                <p className="text-gray-300">Connections: {wires.length}</p>
                <p className={`${Array.from(circuitState.values()).some((state: any) => state.isOn) ? 'text-green-400' : 'text-gray-400'}`}>
                  LED Status: {Array.from(circuitState.values()).some((state: any) => state.isOn) ? '🌟 Glowing' : '⚪ Off'}
                </p>
                {placedComponents.some(comp => comp.component.id === 'switch') && (
                  <p className="text-gray-300">
                    Switch: {Array.from(switchStates.values()).some(state => state) ? '🟢 ON' : '🔘 OFF'}
                  </p>
                )}
                {showBurnEffect && (
                  <p className="text-red-400 animate-pulse">⚠️ Component Damaged!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Circuit Canvas (80%) - Full Width */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-lg p-6" style={{ width: '110%' }}>
          <div className="bg-white h-screen flex flex-col w-full m-0 p-0 min-h-screen">
            {/* Canvas Header */}
            <div className="p-4 border-b border-gray-200 w-full">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-800">🔧 Electronics Playground - Circuit Canvas</h2>
                <div className="text-sm text-gray-600">
                  💡 Tip: Click switches to toggle them ON/OFF
                </div>
                <div className="flex space-x-2 flex-wrap items-center">
                  {/* Component Selection */}
                  <div className="flex space-x-1 flex-wrap">
                    {components.map(component => (
                      <button
                        key={component.id}
                        onClick={() => setSelectedComponent(component.id)}
                        className={`flex items-center px-2 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-xs ${
                          selectedComponent === component.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-lg mr-1">{component.icon}</span>
                        <span className="hidden lg:inline text-xs">{component.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="w-px bg-gray-300 h-8"></div>
                  
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`flex items-center px-2 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-xs ${
                      showGrid 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  
                  <button
                    onClick={() => setIsWiring(!isWiring)}
                    className={`flex items-center px-2 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-xs ${
                      isWiring 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🔌 <span className="hidden sm:inline ml-1">Wire</span>
                  </button>
                  
                  {isWiring && (
                    <button
                      onClick={cancelWiring}
                      className="flex items-center bg-yellow-500 text-white px-2 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 hover:scale-105 text-xs"
                    >
                      <span className="hidden sm:inline">Cancel</span>
                      <span className="sm:hidden">✕</span>
                    </button>
                  )}
                  
                  <button
                    onClick={clearCanvas}
                    className="flex items-center bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 text-xs whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Canvas Area */}
            <div className="flex-1 relative w-full h-full m-0 p-0">
            <div
              ref={canvasRef}
              className={`relative w-full bg-gray-50 overflow-hidden ${
                selectedComponent && !isWiring ? 'cursor-crosshair' : 
                isWiring ? 'cursor-crosshair' : 'cursor-default'
              } m-0 p-0`}
              style={{ height: 'calc(100vh - 81px)', width: '100%' }}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
            >
              {/* SVG for grid and wires */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none m-0 p-0" style={{ height: 'calc(100vh - 81px)', width: '100%' }}>
                {renderGrid()}
                {wires.map(renderWire)}
                {renderCurrentWire()}
              </svg>
              
              {/* Placed components */}
              {placedComponents.map(renderComponent)}
              
              {/* Instructions overlay */}
              
              {/* Mode indicators */}
              {isWiring && (
                <div className="absolute top-4 left-4 bg-blue-100 border-2 border-blue-400 rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-medium text-blue-800 flex items-center">
                    🔌 Wire Mode Active
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Click on component pins to connect them
                  </p>
                  {wireStart && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      Starting from: {wireStart.pin}
                    </p>
                  )}
                </div>
              )}
              
              {selectedComponent && !isWiring && (
                <div className="absolute top-4 left-4 bg-green-100 border-2 border-green-400 rounded-lg p-3 shadow-lg max-w-xs">
                  <p className="text-sm font-medium text-green-800">
                    📍 Placement Mode
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Click anywhere to place component
                  </p>
                </div>
              )}

              {/* Burn Effect Overlay */}
              {showBurnEffect && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border-4 border-red-400 rounded-2xl p-6 shadow-2xl animate-pulse">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💥</div>
                    <p className="text-2xl font-bold text-red-800 mb-2">LED Burned Out!</p>
                    <p className="text-red-700">Too much current damaged the LED!</p>
                    <p className="text-sm text-red-600 mt-2">We need protection...</p>
                  </div>
                </div>
              )}
              
              {/* Achievement Celebration */}
              {cards[15]?.completed && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-8 shadow-2xl animate-bounce">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🏆</div>
                    <p className="text-3xl font-bold text-yellow-800 mb-2">Smart Home Master!</p>
                    <p className="text-yellow-700 text-lg">You built an IoT automation system!</p>
                    <div className="flex items-center justify-center mt-4 space-x-2">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                      <Wifi className="w-6 h-6 text-green-600" />
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Success celebration */}
              {cards[7]?.completed && !showBurnEffect && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 border-4 border-green-400 rounded-2xl p-6 shadow-2xl animate-bounce">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-2xl font-bold text-green-800 mb-2">Success!</p>
                    <p className="text-green-700">Your LED is glowing!</p>
                    <p className="text-sm text-green-600 mt-2">You've built your first circuit!</p>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectronicsPlayground;