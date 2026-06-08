"use client";

import { formatOccupiedTime } from "@/lib/format";
import type { Table } from "@/lib/types";

interface FloorPlanProps {
  tables: Table[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  onReleaseTable: (tableId: string) => void;
}

export function FloorPlan({
  tables,
  selectedTableId,
  onSelectTable,
  onReleaseTable,
}: FloorPlanProps) {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="inline-block rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600 mb-6">
        dining room
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-3xl">
        {tables.map((table) => {
          const isOccupied = table.status === "occupied";
          const isSelected = selectedTableId === table.id;

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => {
                if (isOccupied) onReleaseTable(table.id);
                else onSelectTable(table.id);
              }}
              className={`relative flex flex-col items-center justify-center transition-all ${
                table.shape === "circle" ? "rounded-full" : "rounded-xl"
              } ${
                isOccupied
                  ? "bg-brand-occupied border-2 border-brand-primary/40 text-brand-primary-dark"
                  : isSelected
                    ? "bg-brand-green-light border-2 border-brand-green text-brand-green"
                    : "bg-brand-green-light/60 border-2 border-brand-green/40 text-brand-green hover:bg-brand-green-light"
              }`}
              style={{ width: 72, height: 72 }}
            >
              <span className="font-semibold text-sm">{table.label}</span>
              {isOccupied && (
                <span className="text-xs mt-0.5 font-mono">
                  {formatOccupiedTime(table.occupied_at)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Tap an available table to select it for seating. Tap an occupied table to release it.
      </p>
    </div>
  );
}
