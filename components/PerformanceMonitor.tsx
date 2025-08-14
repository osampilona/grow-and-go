import { memo, useEffect, useRef } from "react";

interface PerformanceMonitorProps {
  componentName: string;
}

export const PerformanceMonitor = memo(function PerformanceMonitor({
  componentName,
}: PerformanceMonitorProps) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentRenderTime = performance.now();
    const timeSinceLastRender = currentRenderTime - lastRenderTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎯 ${componentName} render #${renderCount.current} (${timeSinceLastRender.toFixed(2)}ms since last render)`
      );
    }

    lastRenderTime.current = currentRenderTime;
  });

  return null;
});

// Hook to track component performance
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentRenderTime = performance.now();
    const timeSinceLastRender = currentRenderTime - lastRenderTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎯 ${componentName} render #${renderCount.current} (${timeSinceLastRender.toFixed(2)}ms since last render)`
      );
    }

    lastRenderTime.current = currentRenderTime;
  });

  return {
    renderCount: renderCount.current,
    resetCounter: () => {
      renderCount.current = 0;
    },
  };
};
