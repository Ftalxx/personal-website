
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import SemanticNode from "@/components/knowledge/SemanticNode";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import type {
  ConceptNode,
  ConceptEdge,
} from "@/features/knowledge/server/connection-service";

interface KnowledgeGraphProps {
  initialNodes: ConceptNode[];
  initialEdges: ConceptEdge[];
}

// Keep outside the component to avoid unnecessary remounting.
const nodeTypes: NodeTypes = {
  semantic: SemanticNode,
};

export default function KnowledgeGraph({
  initialNodes,
  initialEdges,
}: KnowledgeGraphProps) {
  const router = useRouter();

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick: NodeMouseHandler<ConceptNode> = useCallback(
    (_, node) => {
      router.push(`/notes/${encodeURIComponent(node.data.slug)}`);
    },
    [router]
  );

  return (
    <div
      className="knowledge-graph relative w-full"
      style={{
        height: "70vh",
        minHeight: "450px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.25}
        maxZoom={2}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#332548"
          gap={24}
          size={1}
        />

        <Controls showInteractive={false} />

        <MiniMap
          nodeColor="#7B2CBF"
          maskColor="rgba(9,7,15,0.75)"
          pannable
          zoomable
        />
      </ReactFlow>

      {/* Fixed atlas legend */}
      <div className="pointer-events-none absolute right-5 top-5 z-10 rounded-xl border border-[#332548] bg-[#171226]/90 px-4 py-3 shadow-lg backdrop-blur-sm">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F3EFFE]">
          Atlas Key
        </p>

        <div className="space-y-2 text-xs text-[#A9A0C1]">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-7 bg-[#3A86FF]" />
            <span>Related</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-[2px] w-7 bg-[#501717]" />
            <span>Opposite</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-[2px] w-7 bg-[#173f7e]" />
            <span>Example of</span>
          </div>

          <div className="flex items-center gap-3">
            <svg width="28" height="8" aria-hidden="true">
              <line
                x1="0"
                y1="4"
                x2="28"
                y2="4"
                stroke="#7B2CBF"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            </svg>
            <span>Suggested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
