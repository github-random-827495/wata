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
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
        className="!top-0 !translate-y-0 w-2.5 h-2.5 !bg-neutral-300"
      />
      <div style={style} className="relative group px-4 py-3">
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 p-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="font-medium tracking-tight">{data.label}</div>
        {data.icon && (
          <img 
            src={data.icon.props.src} 
            alt={data.icon.props.alt} 
            className="h-5 w-5 object-contain opacity-80 mt-2"
          />
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bottom-0 !translate-y-0 w-2.5 h-2.5 !bg-neutral-300"
      />
    </>
  );
});

const componentTypes = {
  // COMMON Components
  AWS: {
    label: 'Amazon Web Services',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png" alt="AWS logo" />
  },
  SFDC: {
    label: 'Salesforce',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png" alt="Salesforce logo" />
  },
  Slack: {
    label: 'Slack',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://1000logos.net/wp-content/uploads/2021/06/Slack-logo.png" alt="Slack logo" />
  },
  Zoom: {
    label: 'Zoom',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://images.seeklogo.com/logo-png/38/2/zoom-fondo-blanco-vertical-logo-png_seeklogo-381383.png" alt="Zoom logo" />
  },
  GCP: {
    label: 'Google Cloud Platform',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png" alt="GCP logo" />
  },
  Okta: {
    label: 'Okta',
    category: 'Common',
    color: '#f0f7ff',
    description: '',
    icon: <img src="https://www.s3-uk.com/wp-content/uploads/2023/03/Okta-logo.png" alt="Okta logo" />
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
  },

  // Networking
  server: {
    label: 'Server',
    category: 'Networking',
    color: '#fff5f5',
    description: ''
  },
};

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  custom: CustomNode,
};

const IamFlowDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Untitled Project');

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

  const getNodesByCategory = () => {
    return nodes.reduce((acc, node) => {
      const nodeType = node.id.split('-')[0];
      const category = componentTypes[nodeType]?.category;
      if (category) {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(node);
      }
      return acc;
    }, {});
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Header */}
      <header className="h-16 border-b border-neutral-100 flex items-center justify-between px-8">
        <h1 className="text-lg font-medium text-neutral-800 tracking-tight">we are the architects.</h1>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={`${isLeftCollapsed ? 'w-16' : 'w-[340px]'} bg-white border-r border-neutral-100 transition-all duration-300`}>
          {/* Component List */}
          <div 
            className="overflow-y-auto h-[calc(100vh-4rem)] bg-white px-2
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-neutral-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:border-4
              [&::-webkit-scrollbar-thumb]:border-transparent
              [&::-webkit-scrollbar-thumb]:bg-clip-padding
              hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300
              firefox:scrollbar-thin
              firefox:scrollbar-thumb-neutral-200
              firefox:scrollbar-track-transparent"
          >
            {!isLeftCollapsed && Object.entries(groupedComponents).map(([category, components]) => (
              <div key={category} className="py-6 first:pt-4">
                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide px-4 mb-3">
                  {category}
                </h3>
                <div className="space-y-2 px-2">
                  {components.map(({ key, label, color, description, icon }) => (
                    <div
                      key={key}
                      draggable
                      onDragStart={(event) => onDragStart(event, key)}
                      className="rounded-lg border border-neutral-100 p-3.5 cursor-move 
                        hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] 
                        transition-all duration-200 
                        hover:border-neutral-200"
                      style={{ backgroundColor: color }}
                    >
                      <div className="flex items-center gap-2.5">
                        {icon && (
                          <img 
                            src={icon.props.src} 
                            alt={icon.props.alt} 
                            className="h-5 w-5 object-contain opacity-80"
                          />
                        )}
                        <div className="font-medium text-sm text-neutral-700">{label}</div>
                      </div>
                      {description && (
                        <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Flow Canvas */}
        <div className="flex-1 bg-neutral-50 relative">
          {/* Title Overlay */}
          <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-neutral-100 shadow-sm">
            <h2 className="text-lg font-medium text-neutral-700 tracking-tight">
              {projectTitle}
            </h2>
          </div>
          
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
            <Background color="#999" variant="dots" gap={16} size={1} />
            <Controls className="!bg-white !shadow-[0_2px_8px_rgba(0,0,0,0.08)] !rounded-lg !border !border-neutral-100" />
          </ReactFlow>
        </div>

        {/* Right Sidebar */}
        <div className={`${isRightCollapsed ? 'w-16' : 'w-[340px]'} bg-white border-l border-neutral-100 transition-all duration-300`}>
          {!isRightCollapsed && (
            <div className="overflow-y-auto h-[calc(100vh-4rem)] bg-white p-6">
              {/* Control Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="projectTitle" className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Project Title
                  </label>
                  <input
                    id="projectTitle"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50
                      border border-neutral-100 
                      focus:border-neutral-200 focus:ring-2 focus:ring-neutral-50 
                      transition-all duration-200 text-sm text-neutral-700
                      placeholder:text-neutral-400"
                    placeholder="Enter project title..."
                  />
                </div>
                
                <button
                  onClick={clearCanvas}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                    bg-neutral-100 text-neutral-600 rounded-lg 
                    hover:bg-neutral-200 transition-colors
                    text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear Canvas
                </button>
              </div>

              {/* Canvas Summary */}
              {Object.entries(getNodesByCategory()).map(([category, categoryNodes]) => (
                <div key={category} className="mt-8">
                  <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
                    {category} ({categoryNodes.length})
                  </h3>
                  <div className="space-y-1.5">
                    {categoryNodes.map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-2.5 rounded-md 
                          border border-neutral-100 hover:border-neutral-200
                          hover:shadow-[0_1px_4px_rgba(0,0,0,0.04)]
                          transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          {componentTypes[node.id.split('-')[0]]?.icon && (
                            <img
                              src={componentTypes[node.id.split('-')[0]].icon.props.src}
                              alt={componentTypes[node.id.split('-')[0]].icon.props.alt}
                              className="h-4 w-4 object-contain opacity-80"
                            />
                          )}
                          <span className="text-sm text-neutral-600">{node.data.label}</span>
                        </div>
                        <button
                          onClick={() => deleteNode(node.id)}
                          className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 
                            hover:text-neutral-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {nodes.length === 0 && (
                <div className="text-center text-neutral-400 mt-8 text-sm">
                  No components added to canvas
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IamFlowDiagram;