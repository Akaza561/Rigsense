import { motion } from 'framer-motion';
import styled from 'styled-components';

const BUILD_COLORS = ['#00d4ff', '#a374ff', '#ff9f35'];
const BUILD_NAMES = ['Value', 'Performance', 'Future Proof'];

/* ── Score helpers ────────────────────────────── */
const gaming = (build) => {
    const gpu = (build.parts || []).find(p => p.category?.toUpperCase() === 'GPU');
    return Math.min(100, gpu?.performance_score || 0);
};
const cpuScore = (build) => {
    const c = (build.parts || []).find(p => p.category?.toUpperCase() === 'CPU');
    return Math.min(100, c?.performance_score || 0);
};
const value = (build) => {
    if (!build?.totalPrice) return 0;
    const parts = build.parts || [];
    const avg = parts.length ? parts.reduce((s, p) => s + (p.performance_score || 0), 0) / parts.length : 0;
    return Math.min(100, Math.round((avg / (build.totalPrice / 10000)) * 7));
};
const futureProof = (build) => {
    const gpu = (build.parts || []).find(p => p.category?.toUpperCase() === 'GPU');
    const cpu = (build.parts || []).find(p => p.category?.toUpperCase() === 'CPU');
    const vram = gpu?.vram || gpu?.params?.vram || 0;
    return Math.min(100, Math.round(
        (gpu?.performance_score || 0) * 0.5 +
        (cpu?.performance_score || 0) * 0.3 +
        Math.min(vram, 24)
    ));
};

const getScores = (b) => [gaming(b), cpuScore(b), value(b), futureProof(b)];
const X_LABELS = ['Gaming', 'CPU', 'Value', 'Future Proof'];
const X_EMOJIS = ['🎮', '💻', '💰', '🚀'];

/* Per-build x-spread so dots don't perfectly stack */
const X_SPREAD = [-5, 0, 5];

const BuildCompareChart = ({ builds }) => {
    if (!builds || builds.length < 2) return null;

    const allScores = builds.map(getScores);

    /* SVG layout */
    const W = 680, H = 270;
    const PL = 48, PR = 48, PT = 20, PB = 44;
    const cW = W - PL - PR;
    const cH = H - PT - PB;

    const xOf = (i) => PL + (i / (X_LABELS.length - 1)) * cW;
    const yOf = (v) => PT + cH - (v / 100) * cH;
    const xDot = (bi, i) => xOf(i) + X_SPREAD[bi];

    const yTicks = [0, 25, 50, 75, 100];

    const buildPath = (bi) =>
        allScores[bi].map((v, i) =>
            `${i === 0 ? 'M' : 'L'}${xDot(bi, i).toFixed(1)},${yOf(v).toFixed(1)}`
        ).join(' ');

    return (
        <Wrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <Header>
                <Title>⚡ Build Comparison</Title>
                <Legend>
                    {BUILD_NAMES.map((n, i) => (
                        <LegendItem key={i}>
                            <LegendLine style={{ background: BUILD_COLORS[i] }} />
                            {n}
                        </LegendItem>
                    ))}
                </Legend>
            </Header>

            {/* SVG Graph — NO inline score labels */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', overflow: 'hidden' }}>

                <defs>
                    {BUILD_COLORS.map((_, i) => (
                        <filter key={i} id={`gc${i}`} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    ))}
                    <clipPath id="lc">
                        <rect x={PL - 1} y={PT} width={cW + 2} height={cH} />
                    </clipPath>
                </defs>

                {/* Horizontal grid */}
                {yTicks.map(t => (
                    <g key={t}>
                        <line x1={PL} y1={yOf(t)} x2={W - PR} y2={yOf(t)}
                            stroke="rgba(255,255,255,0.07)" strokeWidth="1"
                            strokeDasharray={t === 0 ? undefined : '4 4'} />
                        <text x={PL - 8} y={yOf(t) + 4} textAnchor="end"
                            fontSize="10" fill="#555" fontFamily="Inter,sans-serif">{t}</text>
                    </g>
                ))}

                {/* Vertical guides */}
                {X_LABELS.map((_, i) => (
                    <line key={i} x1={xOf(i)} y1={PT} x2={xOf(i)} y2={PT + cH}
                        stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}

                {/* Y axis */}
                <line x1={PL} y1={PT - 10} x2={PL} y2={PT + cH}
                    stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                <polygon points={`${PL},${PT - 12} ${PL - 4},${PT - 4} ${PL + 4},${PT - 4}`}
                    fill="rgba(255,255,255,0.18)" />

                {/* X axis */}
                <line x1={PL} y1={PT + cH} x2={W - PR + 10} y2={PT + cH}
                    stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                <polygon
                    points={`${W - PR + 12},${PT + cH} ${W - PR + 4},${PT + cH - 4} ${W - PR + 4},${PT + cH + 4}`}
                    fill="rgba(255,255,255,0.18)" />

                {/* X labels */}
                {X_LABELS.map((lbl, i) => (
                    <text key={i} x={xOf(i)} y={PT + cH + 18}
                        textAnchor="middle" fontSize="11" fill="#666"
                        fontFamily="Inter,sans-serif">{lbl}</text>
                ))}

                {/* Lines — clipped */}
                {builds.map((_, bi) => (
                    <g key={`l${bi}`} clipPath="url(#lc)">
                        <motion.path
                            d={buildPath(bi)}
                            fill="none" stroke={BUILD_COLORS[bi]} strokeWidth="2.2"
                            strokeLinejoin="round" strokeLinecap="round"
                            filter={`url(#gc${bi})`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.88 }}
                            transition={{ duration: 0.9, delay: bi * 0.12, ease: 'easeInOut' }}
                        />
                    </g>
                ))}

                {/* Dots only — NO labels */}
                {builds.map((_, bi) =>
                    allScores[bi].map((v, i) => {
                        const cx = xDot(bi, i);
                        const cy = yOf(v);
                        const color = BUILD_COLORS[bi];
                        const delay = 0.9 + bi * 0.12 + i * 0.05;
                        return (
                            <g key={`d${bi}${i}`}>
                                <motion.circle cx={cx} cy={cy} r={6}
                                    fill="rgba(8,10,18,0.95)" stroke={color} strokeWidth="2"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ duration: 0.25, delay }}
                                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                                />
                                <motion.circle cx={cx} cy={cy} r={2.5} fill={color}
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ duration: 0.2, delay: delay + 0.05 }}
                                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                                />
                            </g>
                        );
                    })
                )}
            </svg>

            {/* Score table — clean, no overlap possible */}
            <ScoreTable>
                <thead>
                    <tr>
                        <Th style={{ textAlign: 'left' }}>Build</Th>
                        {X_LABELS.map((l, i) => <Th key={i}>{X_EMOJIS[i]} {l}</Th>)}
                    </tr>
                </thead>
                <tbody>
                    {builds.map((_, bi) => (
                        <motion.tr key={bi}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + bi * 0.1 }}>
                            <BuildName style={{ color: BUILD_COLORS[bi] }}>
                                <Dot style={{ background: BUILD_COLORS[bi] }} />
                                {BUILD_NAMES[bi]}
                            </BuildName>
                            {allScores[bi].map((score, i) => (
                                <Td key={i} style={{ color: BUILD_COLORS[bi] }}>{score}</Td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </ScoreTable>
        </Wrapper>
    );
};

/* ── Styles ─────────────────────────────────── */
const Wrapper = styled(motion.div)`
    width: 100%; max-width: 720px; margin: 0 auto 1.5rem;
    padding: 1rem 1.25rem 1rem;
    background: rgba(8,10,18,0.78);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; backdrop-filter: blur(14px); overflow: hidden;
`;
const Header = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.1rem; flex-wrap: wrap; gap: 0.5rem;
`;
const Title = styled.div`
    font-size: 0.78rem; font-weight: 700; color: #777;
    text-transform: uppercase; letter-spacing: 0.1em;
`;
const Legend = styled.div`display: flex; gap: 1.1rem;`;
const LegendItem = styled.div`
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 0.72rem; color: #777;
`;
const LegendLine = styled.div`width: 18px; height: 3px; border-radius: 2px;`;

const ScoreTable = styled.table`
    width: 100%; border-collapse: collapse;
    margin-top: 0.2rem;
    font-family: 'Inter', sans-serif;
`;
const Th = styled.th`
    font-size: 0.7rem; font-weight: 600; color: #555;
    text-transform: uppercase; letter-spacing: 0.06em;
    padding: 0.35rem 0.5rem; text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.06);
`;
const Td = styled.td`
    font-size: 0.82rem; font-weight: 700;
    padding: 0.3rem 0.5rem; text-align: center;
`;
const BuildName = styled.td`
    font-size: 0.75rem; font-weight: 600;
    padding: 0.3rem 0.5rem;
    display: flex; align-items: center; gap: 0.35rem;
`;
const Dot = styled.div`
    width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0;
`;

export default BuildCompareChart;
