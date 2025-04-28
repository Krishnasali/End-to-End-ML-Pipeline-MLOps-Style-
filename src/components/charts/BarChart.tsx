import React, { useEffect, useState } from 'react';
import { ChartDataPoint } from '../../utils/types';

interface BarChartProps {
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  height?: number;
  animated?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisLabel = '',
  yAxisLabel = '',
  color = '#3B82F6',
  height = 250,
  animated = true
}) => {
  const [visibleBars, setVisibleBars] = useState<number[]>([]);
  
  useEffect(() => {
    if (!animated) {
      setVisibleBars(data.map((_, i) => i));
      return;
    }
    
    // Animate bars one by one
    const timeouts: NodeJS.Timeout[] = [];
    
    data.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleBars(prev => [...prev, index]);
      }, index * 100);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [data, animated]);

  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  // Compute chart dimensions
  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const width = 600; // Will be controlled by container width
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Find min/max values
  const yValues = data.map(d => d.y);
  const yMax = Math.max(...yValues);

  // Calculate bar width
  const barWidth = chartWidth / data.length / 1.5;
  const barSpacing = barWidth / 2;

  return (
    <div className="w-full overflow-hidden">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* X-axis */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke="#CBD5E1"
          strokeWidth={1}
        />
        
        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke="#CBD5E1"
          strokeWidth={1}
        />
        
        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(percent => {
          const y = margin.top + chartHeight - (chartHeight * percent);
          const value = yMax * percent;
          
          return (
            <g key={`y-tick-${percent}`}>
              <line 
                x1={margin.left - 5} 
                y1={y} 
                x2={margin.left} 
                y2={y} 
                stroke="#CBD5E1" 
                strokeWidth={1} 
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                fontSize="12"
                textAnchor="end"
                fill="#64748B"
              >
                {value.toFixed(2)}
              </text>
              <line
                x1={margin.left}
                y1={y}
                x2={margin.left + chartWidth}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </g>
          );
        })}
        
        {/* Bars */}
        {data.map((point, i) => {
          const x = margin.left + (i * (barWidth + barSpacing) + barSpacing);
          const barHeight = (point.y / yMax) * chartHeight;
          const y = margin.top + chartHeight - barHeight;
          
          const isVisible = visibleBars.includes(i);
          const opacity = isVisible ? 1 : 0;
          const animatedHeight = isVisible ? barHeight : 0;
          const animatedY = isVisible ? y : margin.top + chartHeight;
          
          return (
            <g key={`bar-${i}`}>
              <rect
                x={x}
                y={animatedY}
                width={barWidth}
                height={animatedHeight}
                fill={color}
                opacity={opacity}
                rx={2}
                style={{
                  transition: animated ? 'height 0.5s ease-out, y 0.5s ease-out' : 'none'
                }}
              />
              
              {/* X-axis labels */}
              <text
                x={x + barWidth / 2}
                y={margin.top + chartHeight + 20}
                fontSize="12"
                textAnchor="middle"
                fill="#64748B"
                transform={`rotate(45, ${x + barWidth / 2}, ${margin.top + chartHeight + 20})`}
              >
                {typeof point.x === 'string' ? point.x : `${point.x}`}
              </text>
            </g>
          );
        })}
        
        {/* Axis labels */}
        {xAxisLabel && (
          <text
            x={margin.left + chartWidth / 2}
            y={height - 5}
            fontSize="14"
            textAnchor="middle"
            fill="#475569"
          >
            {xAxisLabel}
          </text>
        )}
        
        {yAxisLabel && (
          <text
            x={-height / 2}
            y={15}
            fontSize="14"
            textAnchor="middle"
            transform="rotate(-90)"
            fill="#475569"
          >
            {yAxisLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

export default BarChart;