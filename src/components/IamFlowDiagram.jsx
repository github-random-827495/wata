import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

const componentTypes = {
  // IAM Components
  idStore: {
    label: 'Identity Store',
    category: 'IAM',
    color: '#f0f7ff',
    description: 'Central repository for identity data'
  },
  authService: {
    label: 'Authentication Service',
    category: 'IAM',
    color: '#f0f7ff',
    description: 'Handles user authentication'
  },
  mfa: {
    label: 'Multi-Factor Auth',
    category: 'IAM',
    color: '#f0f7ff',
    description: 'MFA service provider'
  },
  sso: {
    label: 'Single Sign-On',
    category: 'IAM',
    color: '#f0f7ff',
    description: 'SSO service provider'
  },
  
  // PAM Components
  privAccess: {
    label: 'Privileged Access',
    category: 'PAM',
    color: '#f0fff4',
    description: 'Manages privileged access'
  },
  secretVault: {
    label: 'Secret Vault',
    category: 'PAM',
    color: '#f0fff4',
    description: 'Secure storage for credentials'
  },
  sessRecord: {
    label: 'Session Recording',
    category: 'PAM',
    color: '#f0fff4',
    description: 'Records privileged sessions'
  },
  privAnalytics: {
    label: 'Privilege Analytics',
    category: 'PAM',
    color: '#f0fff4',
    description: 'Analyzes privileged usage'
  },

  // IGA Components
  accessReq: {
    label: 'Access Request',
    category: 'IGA',
    color: '#fff5f5',
    description: 'Manages access requests'
  },
  accessCert: {
    label: 'Access Certification',
    category: 'IGA',
    color: '#fff5f5',
    description: 'Handles access reviews'
  },
  roleManage: {
    label: 'Role Management',
    category: 'IGA',
    color: '#fff5f5',
    description: 'Manages role definitions'
  },
  compControl: {
    label: 'Compliance Controls',
    category: 'IGA',
    color: '#fff5f5',
    description: 'Enforces compliance policies'
  }
};

const edgeTypes = [
  { id: 'default', label: 'Default' },
  { id: 'step', label: 'Step' },
  { id: 'smoothstep', label: 'Smooth Step' },
  { id: 'straight', label: 'Straight' },
];

const edgeStyles = [
  { id: 'solid', label: 'Solid' },
  { id: 'dashed', label: 'Dashed' },
  { id: 'dotted', label: 'Dotted' },
];

const initialNodes = [];
const initialEdges = [];

const IamFlowDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isComponentMenuOpen, setIsComponentMenuOpen] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: false }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
      
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: 'default',
        position,
        data: { 
          label: componentTypes[type].label,
        },
        style: {
          background: componentTypes[type].color,
          padding: 10,
          borderRadius: 5,
          border: '1px solid #e2e8f0',  // Lighter border
          color: '#4a5568',  // Darker text for contrast
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Menu Bar */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-700">we are the architects.</h1>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6">
        <div className="max-w-6xl mx-auto h-full flex"> 
          {/* Components Menu */}
          <div className="bg-white p-4 mb-4 rounded-lg border border-gray-100 w-64 
               flex flex-col overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">drag and drop your technologies</h3>
            <div className="flex flex-col gap-4"> 
              {Object.entries(componentTypes).map(([type, { label, color }]) => (
                <div
                  key={type}
                  className="p-3 rounded cursor-move border border-gray-100 hover:shadow-sm transition-shadow"
                  style={{ 
                    backgroundColor: color,
                    color: '#4a5568',  // Darker text for contrast
                  }}
                  draggable
                  onDragStart={(event) => onDragStart(event, type)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Flow Canvas */}
          <div className="flex-grow bg-white rounded-lg border border-gray-100" style={{ height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
            >
              <Background 
                color="#aaa" 
                variant="dots" 
                gap={12} 
                size={1} 
              /> 
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IamFlowDiagram;