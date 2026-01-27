"use client"

import { cn } from "@/lib/utils"

interface ProductViewTabsProps {
  views: Array<{
    id: string
    label: string
    labelAr: string
    icon: string
  }>
  selectedView: string
  onViewChange: (viewId: string) => void
  className?: string
}

export function ProductViewTabs({
  views,
  selectedView,
  onViewChange,
  className
}: ProductViewTabsProps) {
  return (
    <div className={cn(
      "flex gap-2 p-1.5 bg-white/10 backdrop-blur-sm rounded-xl",
      className
    )}>
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={cn(
            "relative flex flex-col items-center gap-1 px-6 py-3 rounded-lg transition-all duration-300",
            "text-sm font-medium min-w-[100px]",
            selectedView === view.id
              ? "bg-white text-gray-900 shadow-lg scale-105"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <span className="text-xl">{view.icon}</span>
          <span>{view.labelAr}</span>
          
          {/* Active indicator */}
          {selectedView === view.id && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}

// Compact version for mobile
export function ProductViewTabsCompact({
  views,
  selectedView,
  onViewChange,
  className
}: ProductViewTabsProps) {
  return (
    <div className={cn(
      "flex gap-1 p-1 bg-gray-100 rounded-lg",
      className
    )}>
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
            selectedView === view.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
        >
          <span>{view.icon}</span>
          <span>{view.labelAr}</span>
        </button>
      ))}
    </div>
  )
}
