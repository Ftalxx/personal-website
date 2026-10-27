
"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { ConceptNode } from "@/features/knowledge/server/connection-service";

export default function SemanticNode({
  data,
  selected,
}: NodeProps<ConceptNode>) {
  return (
    <div
      className={`
        relative flex h-28 w-28 items-center justify-center
        rounded-full border-2
        bg-[#171226] text-center
        transition-all duration-300
        ${
          selected
            ? "border-[#3A86FF] shadow-[0_0_30px_rgba(58,134,255,0.45)]"
            : "border-[#7B2CBF] shadow-[0_0_20px_rgba(123,44,191,0.25)]"
        }
        hover:scale-105
        hover:shadow-[0_0_30px_rgba(123,44,191,0.45)]
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-1 !w-1 !border-none !bg-transparent"
      />

      <span className="max-w-[90px] break-words px-2 text-center text-sm font-medium leading-tight text-[#F3EFFE]">
        {data.label}
      </span>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-1 !w-1 !border-none !bg-transparent"
      />
    </div>
  );
}
