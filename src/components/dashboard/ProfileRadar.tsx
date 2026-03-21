'use client';
import { CognitiveProfile } from '@/types';

interface Props {
  dimensions: CognitiveProfile;
  size?: number;
}

export default function ProfileRadar({ dimensions, size = 250 }: Props) {
  const center = size / 2;
  const radius = (size / 2) - 30;
  const labels = [
    { key: 'verbal' as const, label: 'Verbal', angle: -90 },
    { key: 'logical' as const, label: 'Logical', angle: 0 },
    { key: 'memory' as const, label: 'Memory', angle: 90 },
    { key: 'spatial' as const, label: 'Spatial', angle: 180 },
  ];

  const getPoint = (angle: number, value: number) => {
    const r = (value / 100) * radius;
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Background rings
  const rings = [25, 50, 75, 100];

  // Data points
  const points = labels.map(l => getPoint(l.angle, dimensions[l.key]));
  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="mx-auto">
      {/* Background rings */}
      {rings.map(ring => {
        const ringPoints = labels.map(l => getPoint(l.angle, ring));
        const ringPath = ringPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';
        return (
          <path key={ring} d={ringPath} fill="none" stroke="#F5EDE0" strokeWidth="1.5" />
        );
      })}

      {/* Axis lines */}
      {labels.map(l => {
        const p = getPoint(l.angle, 100);
        return (
          <line key={l.key} x1={center} y1={center} x2={p.x} y2={p.y}
            stroke="#F5EDE0" strokeWidth="1.5" />
        );
      })}

      {/* Data polygon */}
      <path d={pathData} fill="rgba(74, 144, 217, 0.15)" stroke="#4A90D9" strokeWidth="2.5" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#4A90D9" />
      ))}

      {/* Labels */}
      {labels.map(l => {
        const p = getPoint(l.angle, 120);
        return (
          <text key={l.key} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="middle"
            className="text-sm font-semibold" fill="#6B6560">
            {l.label}
          </text>
        );
      })}

      {/* Values */}
      {labels.map(l => {
        const p = getPoint(l.angle, 108);
        return (
          <text key={`val-${l.key}`} x={p.x} y={p.y + 14}
            textAnchor="middle" dominantBaseline="middle"
            className="text-xs" fill="#9B9590">
            {dimensions[l.key]}%
          </text>
        );
      })}
    </svg>
  );
}
