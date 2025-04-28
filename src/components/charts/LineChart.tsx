import React, { useRef, useEffect, useState } from 'react';
import { ChartDataPoint } from '../../utils/types';

interface LineChartProps {
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  height?: number;
  animated?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisLabel = '',
  yAxisLabel = '',
  color = '#3B82F6',
  height = 200,
  animated = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  // Compute chart dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const width = 600; // Will be controlled by container width
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Find min/max values
  const xValues = data.map(d => typeof d.x === 'number' ? d.x : 0);
  const yValues = data.map(d => d.y);
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Scale functions
  const xScale = (x: number): number => {
    return margin.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
  };

  const yScale = (y: number): number => {
    return margin.top + chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;
  };

  // Create line path
  const linePath = data
    .map((point, i) => {
      const x = xScale(typeof point.x === 'number' ? point.x : i);
      const y = yScale(point.y);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Animation properties
  const strokeDasharray = chartWidth;
  const strokeDashoffset = animated && !isVisible ? chartWidth : 0;
  const transition = animated ? 'stroke-dashoffset 1s ease-in-out' : '';

  return (
    <div className="w-full overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
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
        
        {/* X-axis ticks */}
        {data.map((point, i) => {
          // Only show a subset of ticks if we have many data points
          if (data.length > 10 && i % Math.ceil(data.length / 10) !== 0 && i !== data.length - 1) return null;
          
          const x = xScale(typeof point.x === 'number' ? point.x : i);
          const y = margin.top + chartHeight;
          
          return (
            <g key={`x-tick-${i}`}>
              <line x1={x} y1={y} x2={x} y2={y + 5} stroke="#CBD5E1" strokeWidth={1} />
              <text
                x={x}
                y={y + 20}
                fontSize="12"
                textAnchor="middle"
                fill="#64748B"
              >
                {typeof point.x === 'number' ? point.x : i + 1}
              </text>
            </g>
          );
        })}
        
        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(percent => {
          const y = yScale(yMin + (yMax - yMin) * percent);
          const value = yMax - (yMax - yMin) * percent;
          
          return (
            <g key={`y-tick-${percent}`}>
              <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#CBD5E1" strokeWidth={1} />
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
        
        {/* Line path */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition }}
        />
        
        {/* Data points */}
        {data.map((point, i) => {
          const x = xScale(typeof point.x === 'number' ? point.x : i);
          const y = yScale(point.y);
          
          return (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={3}
              fill="white"
              stroke={color}
              strokeWidth={2}
              opacity={animated && !isVisible ? 0 : 1}
              style={{ transition: 'opacity 1s ease-in-out' }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;