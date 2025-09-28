import React, { useEffect, useRef } from 'react';

interface NeuralNetworkProps {
  isActive?: boolean;
  className?: string;
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ isActive = false, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Network structure
    const layers = [
      { nodes: 6, x: 50, color: '#3b82f6' },   // Input layer (departments)
      { nodes: 8, x: 150, color: '#8b5cf6' },  // Hidden layer 1
      { nodes: 6, x: 250, color: '#a855f7' },  // Hidden layer 2
      { nodes: 4, x: 350, color: '#22c55e' }   // Output layer
    ];

    const nodes: Array<{ x: number; y: number; layer: number; active: boolean }> = [];
    const connections: Array<{ from: any; to: any; strength: number; active: boolean }> = [];

    // Create nodes
    layers.forEach((layer, layerIndex) => {
      const nodeSpacing = (canvas.height - 40) / (layer.nodes + 1);
      for (let i = 0; i < layer.nodes; i++) {
        nodes.push({
          x: layer.x,
          y: 20 + nodeSpacing * (i + 1),
          layer: layerIndex,
          active: false
        });
      }
    });

    // Create connections
    layers.forEach((layer, layerIndex) => {
      if (layerIndex < layers.length - 1) {
        const currentLayerNodes = nodes.filter(n => n.layer === layerIndex);
        const nextLayerNodes = nodes.filter(n => n.layer === layerIndex + 1);
        
        currentLayerNodes.forEach(fromNode => {
          nextLayerNodes.forEach(toNode => {
            connections.push({
              from: fromNode,
              to: toNode,
              strength: Math.random(),
              active: false
            });
          });
        });
      }
    });

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isActive) {
        frame++;
        
        // Activate connections in waves
        connections.forEach((conn, index) => {
          const wavePosition = (frame * 2) % (connections.length + 50);
          conn.active = index < wavePosition && index > wavePosition - 20;
        });

        // Activate nodes based on connections
        nodes.forEach(node => {
          const activeConnections = connections.filter(c => 
            (c.from === node || c.to === node) && c.active
          );
          node.active = activeConnections.length > 0;
        });
      }

      // Draw connections
      connections.forEach(conn => {
        const alpha = isActive && conn.active ? 0.8 : 0.2;
        const width = isActive && conn.active ? 2 : 1;
        
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(conn.from.x, conn.from.y, conn.to.x, conn.to.y);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * conn.strength})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha * conn.strength})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const layer = layers[node.layer];
        const radius = isActive && node.active ? 8 : 5;
        const alpha = isActive && node.active ? 1 : 0.6;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        
        // Node color based on layer
        ctx.fillStyle = layer.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Add glow effect for active nodes
        if (isActive && node.active) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 3, 0, 2 * Math.PI);
          ctx.fillStyle = layer.color + '40';
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Layer Labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
          <div className="writing-mode-vertical text-center">Input</div>
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
          <div className="writing-mode-vertical text-center">Output</div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetwork;