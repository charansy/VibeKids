export const smartDustbinMindMapData = [
  {
    id: 'ai-training',
    title: 'AI & Training: Teaching the Computer',
    content: 'Goal: To teach the computer how to see trash and learn from examples.',
    icon: 'brain',
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
    icon: 'cpu',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    children: [
      {
        id: 'webcam',
        title: 'Webcam (The Eyes)',
        content: 'This is the visual sensor. Job: Takes pictures constantly and asks the AI model, "Is this trash?".',
        icon: 'eye',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-300'
      },
      {
        id: 'computer',
        title: 'Computer/Laptop (The Brain)',
        content: 'Runs the AI model to answer the webcam\'s question.',
        icon: 'brain',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-300'
      },
      {
        id: 'microbit',
        title: 'micro:bit (The Nervous System)',
        content: 'A microcontroller that listens to the computer and controls the motor. Job: Sends power to the motor when the brain says "I see trash!".',
        icon: 'zap',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-300'
      },
      {
        id: 'servo-motor',
        title: 'Servo Motor (The Muscle)',
        content: 'This is the actuator that performs the physical action. Job: Moves (e.g., to 180 degrees) to open the lid when signaled by the micro:bit.',
        icon: 'target',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-300'
      }
    ]
  },
  {
    id: 'code-logic',
    title: 'Code & Logic: Instructions',
    content: 'Communication: The computer sends a message (like \'TRASH\' or \'NO_TRASH\') to the micro:bit over serial.',
    icon: 'code',
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
    icon: 'rotate-ccw',
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
    icon: 'target',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    children: [
      {
        id: 'computer-vision',
        title: 'Computer Vision',
        content: 'The specific part of AI that allows the computer to "see" and understand images.',
        icon: 'eye',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100 border-indigo-300'
      },
      {
        id: 'ethics',
        title: 'Ethics',
        content: 'Important questions to ask about this technology.',
        icon: 'alert-triangle',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100 border-indigo-300',
        children: [
          {
            id: 'reliability',
            title: 'Reliability',
            content: 'What if the bin makes a mistake?',
            icon: 'shield',
            color: 'text-indigo-800',
            bgColor: 'bg-indigo-200 border-indigo-400'
          },
          {
            id: 'privacy',
            title: 'Privacy',
            content: 'Could it be used to track people?',
            icon: 'users',
            color: 'text-indigo-800',
            bgColor: 'bg-indigo-200 border-indigo-400'
          },
          {
            id: 'societal-impact',
            title: 'Societal Impact',
            content: 'What happens to jobs related to managing waste?',
            icon: 'briefcase',
            color: 'text-indigo-800',
            bgColor: 'bg-indigo-200 border-indigo-400'
          }
        ]
      }
    ]
  }
];
