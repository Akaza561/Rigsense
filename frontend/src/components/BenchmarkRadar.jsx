import { motion } from 'framer-motion';
import styled from 'styled-components';

/**
 * A transparent SVG radar chart for benchmark data.
 * Props:
 *   data: [{ label: string, value: number, max: number }]
 *   size?: number (default 260)
 */
const BenchmarkRadar = ({ data, size = 260 }) => {
    if (!data || data.length < 3) return null;

    const cx = size / 2;
    const cy = size / 2;
    const radius = (size / 2) - 30;
    const levels = 4; // concentric rings
    const angleSlice = (Math.PI * 2) / data.length;

    // Grid rings
    const rings = Array.from({ length: levels }, (_, i) => {
        const r = radius * ((i + 1) / levels);
        const points = data.map((_, j) => {
            const angle = angleSlice * j - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');
        return points;
    });

    // Axis lines
    const axes = data.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return {
            x2: cx + radius * Math.cos(angle),
            y2: cy + radius * Math.sin(angle),
        };
    });

    // Data polygon
    const dataPoints = data.map((d, i) => {
        const pct = Math.min(d.value / d.max, 1);
        const angle = angleSlice * i - Math.PI / 2;
        return {
            x: cx + radius * pct * Math.cos(angle),
            y: cy + radius * pct * Math.sin(angle),
        };
    });
    const dataPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

    // Labels
    const labels = data.map((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const lx = cx + (radius + 18) * Math.cos(angle);
        const ly = cy + (radius + 18) * Math.sin(angle);
        return { ...d, x: lx, y: ly };
    });

    // Level labels (values on outermost ring) 
    const levelLabels = Array.from({ length: levels }, (_, i) => {
        const val = Math.round((data[0]?.max || 100) * ((i + 1) / levels));
        const r = radius * ((i + 1) / levels);
        return { val, y: cy - r };
    });

    return (
        <ChartContainer
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Grid rings */}
                {rings.map((points, i) => (
                    <polygon
                        key={`ring-${i}`}
                        points={points}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {axes.map((a, i) => (
                    <line
                        key={`axis-${i}`}
                        x1={cx} y1={cy}
                        x2={a.x2} y2={a.y2}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                    />
                ))}

                {/* Data fill */}
                <motion.polygon
                    points={dataPath}
                    fill="rgba(0, 194, 212, 0.12)"
                    stroke="#00c2d4"
                    strokeWidth="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                />

                {/* Data dots */}
                {dataPoints.map((p, i) => (
                    <motion.circle
                        key={`dot-${i}`}
                        cx={p.x} cy={p.y} r="4"
                        fill="#00c2d4"
                        stroke="#000" strokeWidth="1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                    />
                ))}

                {/* Labels */}
                {labels.map((l, i) => (
                    <text
                        key={`label-${i}`}
                        x={l.x} y={l.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#888"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                    >
                        {l.label}
                    </text>
                ))}

                {/* Value labels at each data point */}
                {dataPoints.map((p, i) => (
                    <text
                        key={`val-${i}`}
                        x={p.x}
                        y={p.y - 10}
                        textAnchor="middle"
                        fill="#00c2d4"
                        fontSize="9"
                        fontWeight="800"
                        fontFamily="Inter, sans-serif"
                    >
                        {data[i].value}
                    </text>
                ))}
            </svg>
        </ChartContainer>
    );
};

const ChartContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
    /* fully transparent – background bleeds through */
    background: transparent;
`;

export default BenchmarkRadar;
