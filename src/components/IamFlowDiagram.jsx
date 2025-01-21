import React, { useState, useCallback, memo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Custom Node Component
const CustomNode = memo(({ data, id, style }) => {
  const handleDelete = () => {
    data.onDelete(id);
  };

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!top-0 !translate-y-0 w-3 h-3 !bg-blue-400"
      />
      <div style={style} className="relative group px-3 py-2">
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="font-medium">{data.label}</div>
        {data.icon && (
            <img 
              src={data.icon.props.src} 
              alt={data.icon.props.alt} 
              className="h-6 w-6 object-contain" // Use object-contain 
            />
          )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bottom-0 !translate-y-0 w-3 h-3 !bg-blue-400"
      />
    </>
  );
});

const componentTypes = {
  // COMMON Components
  AWS: {
    label: '',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png" alt="AWS logo" />
  },
  SFDC: {
    label: 'Salesforce',
    category: 'Common',
    color: '#f0f7ff',
    description: ''
  },
  Slack: {
    label: 'Slack',
    category: 'Common',
    color: '#f0f7ff',
    description: ''
  },
  Zoom: {
    label: 'Zoom',
    category: 'Common',
    color: '#f0f7ff',
    description: ''
  },
  GCP: {
    label: 'Google Cloud Platform',
    category: 'Common',
    color: '#f0f7ff',
    description: ''
  },
  Okta: {
    label: 'Okta',
    category: 'Common',
    color: '#f0f7ff',
    description: ''
  },

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

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  custom: CustomNode,
};

const IamFlowDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: false }, eds)),
    [setEdges]
  );

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

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
        type: 'custom',
        position,
        data: { 
          label: componentTypes[type].label,
          onDelete: deleteNode,
          icon: componentTypes[type].icon
        },
        style: {
          background: componentTypes[type].color,
          borderRadius: 5,
          border: '1px solid #e2e8f0',
          color: '#4a5568',
          minWidth: 150,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, deleteNode]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const groupedComponents = Object.entries(componentTypes).reduce((acc, [key, value]) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push({ key, ...value });
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white">
          {!isCollapsed && (
            <span className="ml-2 text-lg font-semibold text-gray-700">we are the architects.</span>
          )}
          {/* <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto p-2 hover:bg-gray-50 rounded-md text-gray-600"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button> */}
        </div>

        {/* Component List */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-3.5rem)] bg-white">
          {!isCollapsed && Object.entries(groupedComponents).map(([category, components]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {components.map(({ key, label, color, description, icon }) => (
                  <div
                    key={key}
                    draggable
                    onDragStart={(event) => onDragStart(event, key)}
                    className="rounded-md border border-gray-200 p-3 cursor-move hover:shadow-sm transition-all hover:border-gray-300"
                    style={{ backgroundColor: color }}
                  >
                    {icon && ( 
                <img 
                  src={icon.props.src} 
                  alt={icon.props.alt} 
                  className="h-5 w-5 mr-2 object-contain" 
                />
              )}
                    <div className="font-medium text-gray-700">{label}</div>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-gray-200 my-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          {/* <h1 className="text-xl font-semibold text-gray-800">we are the architects.</h1> */}
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear Canvas
          </button>
        </header>

        {/* Flow Canvas */}
        <div className="flex-1 bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
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
  );
};

export default IamFlowDiagram;