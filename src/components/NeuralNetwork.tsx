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

    const resizeCanvas = () => {
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();

    // Calculate center positioning for network
    const networkWidth = Math.min(400, canvas.width * 0.8);
    const startX = (canvas.width - networkWidth) / 2;
    const layerSpacing = networkWidth / 3;

    // Network structure with labels - centered
    const layers = [
      { 
        nodes: 6, 
        x: startX, 
        color: '#3b82f6',
        labels: ['Fitness Data', 'Job Cards', 'Branding', 'Mileage', 'Cleaning', 'Stabling']
      },
      { nodes: 8, x: startX + layerSpacing, color: '#8b5cf6', labels: [] },  // Hidden layer 1
      { nodes: 6, x: startX + layerSpacing * 2, color: '#a855f7', labels: [] },  // Hidden layer 2
      { 
        nodes: 4, 
        x: startX + layerSpacing * 3, 
        color: '#22c55e',
        labels: ['Induction Plan', 'Schedule Opt', 'Anomaly Alert', 'Efficiency']
      }
    ];

    const nodes: Array<{ x: number; y: number; layer: number; active: boolean; label?: string; color?: string }> = [];
    const connections: Array<{ from: any; to: any; strength: number; active: boolean }> = [];

    // Create nodes with labels
    layers.forEach((layer, layerIndex) => {
      const nodeSpacing = (canvas.height - 40) / (layer.nodes + 1);
      for (let i = 0; i < layer.nodes; i++) {
        nodes.push({
          x: layer.x,
          y: 20 + nodeSpacing * (i + 1),
          layer: layerIndex,
          active: false,
          label: layer.labels[i] || '',
          color: layer.color
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
        
        // Activate connections in waves with data flow visualization
        connections.forEach((conn, index) => {
          const wavePosition = (frame * 3) % (connections.length + 60);
          const layerDelay = conn.from.layer * 20; // Delay based on layer
          conn.active = index < wavePosition - layerDelay && index > wavePosition - layerDelay - 15;
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

        // Draw data flow particles for active connections
        if (isActive && conn.active) {
          const particleProgress = (frame * 0.05) % 1;
          const particleX = conn.from.x + (conn.to.x - conn.from.x) * particleProgress;
          const particleY = conn.from.y + (conn.to.y - conn.from.y) * particleProgress;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
          
          // Glowing effect
          ctx.beginPath();
          ctx.arc(particleX, particleY, 6, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
          ctx.fill();
        }
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

        // Draw labels for input and output layers
        if (node.label && (node.layer === 0 || node.layer === layers.length - 1)) {
          ctx.font = '10px Arial';
          ctx.textAlign = node.layer === 0 ? 'right' : 'left';
          ctx.fillStyle = isActive && node.active ? '#1f2937' : '#6b7280';
          
          const textOffset = 20;
          const textX = node.layer === 0 ? node.x - textOffset : node.x + textOffset;
          ctx.fillText(node.label, textX, node.y + 3);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
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
        <div className="absolute top-1/2 transform -translate-y-1/2 text-xs text-gray-500" style={{ left: 'calc(50% - 180px)' }}>
          <div className="writing-mode-vertical text-center">Input</div>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 text-xs text-gray-500" style={{ right: 'calc(50% - 180px)' }}>
          <div className="writing-mode-vertical text-center">Output</div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetwork;