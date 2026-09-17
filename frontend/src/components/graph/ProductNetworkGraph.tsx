import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NetworkNode, NetworkEdge } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Filter,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';

interface SimulationNode extends NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const ProductNetworkGraph: React.FC = () => {
  const { analysisResults, setSelectedRule, setSelectedProduct, setActiveView } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [minLiftFilter, setMinLiftFilter] = useState<number>(2.0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredNode, setHoveredNode] = useState<SimulationNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // References for mutable animation state
  const simulationRef = useRef<{
    nodes: SimulationNode[];
    edges: NetworkEdge[];
    isDragging: boolean;
    draggedNode: SimulationNode | null;
    isPanning: boolean;
    startPan: { x: number; y: number };
  }>({
    nodes: [],
    edges: [],
    isDragging: false,
    draggedNode: null,
    isPanning: false,
    startPan: { x: 0, y: 0 },
  });

  // Extract nodes and edges from current analysis rules
  const { graphNodes, graphEdges } = useMemo(() => {
    if (!analysisResults?.rules.length) {
      return { graphNodes: [], graphEdges: [] };
    }

    const nodeMap = new Map<string, NetworkNode>();
    const edgeList: NetworkEdge[] = [];

    // Filter rules by minLift
    const activeRules = analysisResults.rules.filter((r) => r.lift >= minLiftFilter);

    activeRules.forEach((rule) => {
      const src = rule.antecedent[0];
      const tgt = rule.consequent[0];

      if (!nodeMap.has(src)) {
        nodeMap.set(src, {
          id: src,
          label: src,
          category: rule.category || 'General',
          degree: 1,
          count: rule.transactionCount,
          support: rule.antecedentSupport || rule.support,
          color: '#06B6D4', // cyan default
          radius: Math.min(26, Math.max(12, (rule.antecedentSupport || rule.support) * 70)),
        });
      } else {
        const n = nodeMap.get(src)!;
        n.degree += 1;
      }

      if (!nodeMap.has(tgt)) {
        nodeMap.set(tgt, {
          id: tgt,
          label: tgt,
          category: rule.category || 'General',
          degree: 1,
          count: rule.transactionCount,
          support: rule.consequentSupport || rule.support,
          color: '#8B5CF6', // violet default
          radius: Math.min(26, Math.max(12, (rule.consequentSupport || rule.support) * 70)),
        });
      } else {
        const n = nodeMap.get(tgt)!;
        n.degree += 1;
      }

      edgeList.push({
        id: `${src}::${tgt}`,
        source: src,
        target: tgt,
        lift: rule.lift,
        confidence: rule.confidence,
        support: rule.support,
        strength: Math.min(5, Math.max(1.5, rule.lift * 0.9)),
      });
    });

    // Update node colors based on degree
    Array.from(nodeMap.values()).forEach((node) => {
      if (node.degree >= 4) {
        node.color = '#F59E0B'; // hub / anchor node (amber)
        node.radius = Math.max(node.radius, 18);
      } else if (node.id.includes('HEART') || node.id.includes('LANTERN')) {
        node.color = '#06B6D4'; // cyan
      } else if (node.id.includes('WARMER') || node.id.includes('BOTTLE')) {
        node.color = '#3B82F6'; // blue
      } else if (node.id.includes('PLAYHOUSE') || node.id.includes('DOLL')) {
        node.color = '#EC4899'; // pink
      } else {
        node.color = '#8B5CF6'; // violet
      }
    });

    return {
      graphNodes: Array.from(nodeMap.values()),
      graphEdges: edgeList,
    };
  }, [analysisResults, minLiftFilter]);

  // Initialize simulation positions
  useEffect(() => {
    const width = 900;
    const height = 550;

    const simNodes: SimulationNode[] = graphNodes.map((n, i) => {
      const angle = (i / graphNodes.length) * Math.PI * 2;
      const radius = 180 + (i % 3) * 50;
      return {
        ...n,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
      };
    });

    simulationRef.current.nodes = simNodes;
    simulationRef.current.edges = graphEdges;
  }, [graphNodes, graphEdges]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.parentElement.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stepSimulation = () => {
      const { nodes, edges, draggedNode } = simulationRef.current;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // 1. Center attraction force
      const cx = width / 2;
      const cy = height / 2;
      nodes.forEach((n) => {
        if (n === draggedNode) return;
        n.vx += (cx - n.x) * 0.001;
        n.vy += (cy - n.y) * 0.001;
      });

      // 2. Node-node repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const minDist = a.radius + b.radius + 50;

          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.08;
            if (a !== draggedNode) {
              a.vx -= dx * force;
              a.vy -= dy * force;
            }
            if (b !== draggedNode) {
              b.vx += dx * force;
              b.vy += dy * force;
            }
          }
        }
      }

      // 3. Edge spring tension
      const nodeIndexMap = new Map<string, SimulationNode>();
      nodes.forEach((n) => nodeIndexMap.set(n.id, n));

      edges.forEach((edge) => {
        const src = nodeIndexMap.get(edge.source);
        const tgt = nodeIndexMap.get(edge.target);
        if (!src || !tgt) return;

        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 120 / Math.max(1, edge.lift * 0.3);
        const force = (dist - targetDist) * 0.006;

        if (src !== draggedNode) {
          src.vx += (dx / dist) * force;
          src.vy += (dy / dist) * force;
        }
        if (tgt !== draggedNode) {
          tgt.vx -= (dx / dist) * force;
          tgt.vy -= (dy / dist) * force;
        }
      });

      // 4. Dampen & move
      nodes.forEach((n) => {
        if (n === draggedNode) return;
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx;
        n.y += n.vy;
      });
    };

    const render = () => {
      stepSimulation();

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Apply Pan & Zoom
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const { nodes, edges } = simulationRef.current;
      const nodeMap = new Map<string, SimulationNode>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      // Active focus IDs (if a node is hovered or clicked)
      const activeId = selectedNodeId || (hoveredNode ? hoveredNode.id : null);
      const connectedNeighbors = new Set<string>();
      if (activeId) {
        connectedNeighbors.add(activeId);
        edges.forEach((e) => {
          if (e.source === activeId) connectedNeighbors.add(e.target);
          if (e.target === activeId) connectedNeighbors.add(e.source);
        });
      }

      // 1. Draw Edges
      edges.forEach((edge) => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return;

        const isHighlighted =
          activeId &&
          ((edge.source === activeId && connectedNeighbors.has(edge.target)) ||
            (edge.target === activeId && connectedNeighbors.has(edge.source)));

        const isDimmed = activeId && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#00F2FE';
          ctx.lineWidth = edge.strength * 1.5;
          ctx.shadowColor = '#00F2FE';
          ctx.shadowBlur = 8;
        } else if (isDimmed) {
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
          ctx.lineWidth = edge.strength;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Nodes
      nodes.forEach((node) => {
        const isSearchMatch =
          searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());
        const isSelected = node.id === selectedNodeId;
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isConnected = activeId && connectedNeighbors.has(node.id);
        const isDimmed = activeId && !isConnected;

        const alpha = isDimmed ? 0.2 : 1;

        // Outer glow on highlight or match
        if (isSelected || isHovered || isSearchMatch) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}33`;
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? 'rgba(30, 41, 59, 0.4)' : node.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Node Border
        ctx.lineWidth = isSelected || isSearchMatch ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#FFFFFF' : '#0B111E';
        ctx.stroke();

        // Node Label
        if (!isDimmed || isSelected || isHovered) {
          ctx.font = `${node.radius > 16 ? 'bold 11px' : '10px'} Inter, sans-serif`;
          ctx.fillStyle = isSelected || isHovered ? '#FFFFFF' : 'rgba(241, 245, 249, 0.9)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          // Truncate long label for canvas
          const displayLabel =
            node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label;
          ctx.fillText(displayLabel, node.x, node.y + node.radius + 5);
        }

        ctx.globalAlpha = 1;
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pan, zoom, hoveredNode, selectedNodeId, searchQuery]);

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked a node
    const { nodes } = simulationRef.current;
    const clickedNode = nodes.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    if (clickedNode) {
      simulationRef.current.isDragging = true;
      simulationRef.current.draggedNode = clickedNode;
      setSelectedNodeId(clickedNode.id === selectedNodeId ? null : clickedNode.id);
    } else {
      // Start panning canvas
      simulationRef.current.isPanning = true;
      simulationRef.current.startPan = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    if (simulationRef.current.isDragging && simulationRef.current.draggedNode) {
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      simulationRef.current.draggedNode.x = mouseX;
      simulationRef.current.draggedNode.y = mouseY;
      simulationRef.current.draggedNode.vx = 0;
      simulationRef.current.draggedNode.vy = 0;
      return;
    }

    if (simulationRef.current.isPanning) {
      setPan({
        x: e.clientX - simulationRef.current.startPan.x,
        y: e.clientY - simulationRef.current.startPan.y,
      });
      return;
    }

    // Hover detection
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;
    const { nodes } = simulationRef.current;
    const found = nodes.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    setHoveredNode(found || null);
  };

  const handleMouseUp = () => {
    simulationRef.current.isDragging = false;
    simulationRef.current.draggedNode = null;
    simulationRef.current.isPanning = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full rounded-2xl bg-dark-900/95 border border-slate-800 shadow-card overflow-hidden flex flex-col">
      {/* Top Graph Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 z-10 bg-dark-900/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Product Relationship Network
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {graphNodes.length} Nodes • {graphEdges.length} Links
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Node size represents support frequency; edge thickness represents lift ratio. Click or hover any node to isolate affinities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Node */}
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node..."
              className="w-full pl-8 pr-3 py-1.5 bg-dark-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Min Lift Slider */}
          <div className="flex items-center gap-2 bg-dark-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Min Lift:</span>
            <input
              type="range"
              min="1.0"
              max="4.5"
              step="0.2"
              value={minLiftFilter}
              onChange={(e) => setMinLiftFilter(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="font-mono text-cyan-400 font-bold">{minLiftFilter.toFixed(1)}x</span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z * 1.2))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z / 1.2))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700"
              title="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[520px] bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Hover / Selection HUD Card */}
        {(hoveredNode || selectedNodeId) && (
          <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-dark-900/90 backdrop-blur-md border border-cyan-500/40 shadow-2xl max-w-sm pointer-events-auto text-xs space-y-2 animate-in fade-in zoom-in-95">
            {(() => {
              const active =
                hoveredNode ||
                simulationRef.current.nodes.find((n) => n.id === selectedNodeId);
              if (!active) return null;

              return (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Product Node Selected
                    </span>
                    <span className="font-mono text-slate-400 font-semibold">
                      {active.degree} active links
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{active.label}</h4>
                  <div className="flex items-center gap-4 text-slate-300 font-mono pt-1">
                    <span>Freq: {active.count?.toLocaleString()} tx</span>
                    <span>Support: {(active.support * 100).toFixed(1)}%</span>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(active.label);
                        setActiveView('recommendations');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 font-semibold transition-colors"
                    >
                      Get Recommendations
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-dark-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 space-y-1.5 hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>High-Degree Hub Item</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Home Decor / Core</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <span>Apparel / Specialty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

