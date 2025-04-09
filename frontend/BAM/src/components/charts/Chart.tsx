import { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';

// Register all Chart.js components
ChartJS.register(...registerables);

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
      [key: string]: any;
    }[];
  };
  options?: any;
  height?: string;
  width?: string;
}

export function Chart({ type, data, options = {}, height, width }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance to prevent memory leaks
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new ChartJS(ctx, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // Additional default options for better visuals
          plugins: {
            legend: {
              position: 'top' as const,
              labels: {
                usePointStyle: true,
                boxWidth: 6,
              },
            },
            tooltip: {
              displayColors: true,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              cornerRadius: 4,
            },
          },
          // Merge user provided options
          ...options,
        },
      });
    }

    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ height: height || '100%', width: width || '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
} 