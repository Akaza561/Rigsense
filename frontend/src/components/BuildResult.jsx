import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Button from '../Button';
import SaveButton from '../SaveButton';
import { estimateBenchmarks } from '../utils/benchmarks';
import BenchmarkRadar from './BenchmarkRadar';
import Tooltip from './Tooltip';

const ResultContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: white;
  text-align: left;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
`;

const TotalPrice = styled.h2`
  font-size: 2rem;
  color: #00e5ff;
  font-weight: 700;
  margin: 0;
`;

const PartList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PartItem = styled(motion.li)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }
`;

const PartInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Category = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.2rem;
`;

const PartName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`;

const PartPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #00e5ff;
`;

const SpecTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-left: 0.5rem;
  color: #ccc;
`;

const IssuesContainer = styled.div`
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const BottleneckContainer = styled.div`
  background: rgba(255, 166, 0, 0.1);
  border: 1px solid rgba(255, 166, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SuggestionBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  font-family: inherit;
  &:hover { background: rgba(255, 255, 255, 0.2); border-color: #fff; }
  &.delete {
    color: #ff4d4d; border-color: rgba(255, 77, 77, 0.3);
    &:hover { background: rgba(255, 77, 77, 0.1); border-color: #ff4d4d; }
  }
  &.select {
    color: #00e5ff; border-color: rgba(0, 229, 255, 0.3);
    &:hover { background: rgba(0, 229, 255, 0.1); border-color: #00e5ff; }
  }
`;

/* ── Benchmark styled components ─────────────────────── */

const BenchSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.08);
`;

const BenchTitle = styled.h3`
  font-size: 1rem; font-weight: 700; color: #aaa;
  text-transform: uppercase; letter-spacing: 0.1em;
  margin: 0 0 1rem;
`;

const BenchSubtitle = styled.div`
  font-size: 0.78rem; font-weight: 600; color: #666;
  margin-bottom: 0.6rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  @media (max-width: 500px) { grid-template-columns: 1fr 1fr; }
`;

const MetricCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 0.9rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
  text-align: center;
  .metric-label { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.08em; }
  .metric-value { font-size: 1.6rem; font-weight: 800; line-height: 1.1; }
  .metric-unit  { font-size: 0.65rem; color: #555; }
`;

const OverallRow = styled(motion.div)`
  margin-top: 1.2rem;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.8rem 1rem;
  background: rgba(0,194,212,0.06);
  border: 1px solid rgba(0,194,212,0.15);
  border-radius: 12px;
  font-size: 0.9rem; color: #aaa; font-weight: 600;
  .score { font-size: 1.5rem; font-weight: 800; color: #00c2d4; }
  .of    { font-size: 0.85rem; font-weight: 500; color: #555; }
`;

const UpgradeHint = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.75rem;
  margin: -0.25rem 0 0.25rem 0;
  background: rgba(0,194,212,0.04);
  border: 1px dashed rgba(0,194,212,0.2);
  border-radius: 8px;
  font-size: 0.78rem;
  .tag  { color: #00c2d4; font-weight: 700; font-size: 0.65rem; letter-spacing: 0.08em; flex-shrink: 0; }
  .name { color: #ccc; font-weight: 600; }
  .meta { color: #666; margin-left: auto; flex-shrink: 0; }
`;

const fpsColor = (fps) => fps >= 60 ? '#00c2d4' : fps >= 30 ? '#ffb020' : '#ff4d4d';

/** Generate a human-readable reason why the AI picked this part */
const getPartReason = (part, useCase) => {
  if (!part?.name) return null;
  const cat = part.category?.toUpperCase();
  const score = part.performance_score || 0;
  const price = part.price || 0;
  const watt = part.watt || 0;
  const vram = part.vram || part.params?.vram || 0;
  const ratio = price > 0 ? (score / price * 1000).toFixed(1) : '∞';
  const lines = [];
  if (score >= 90) lines.push('Top-tier performance component.');
  else if (score >= 75) lines.push('High-performance with great value.');
  else if (score >= 55) lines.push('Solid mid-range pick for this budget.');
  else lines.push('Budget-friendly choice to stay on target.');
  lines.push(`Value: ${ratio} perf/₹1K.`);
  if (cat === 'GPU' && vram) lines.push(`${vram}GB VRAM for ${useCase || 'your workload'}.`);
  if (cat === 'CPU' && watt) lines.push(`${watt}W TDP — balanced power & efficiency.`);
  if (cat === 'PSU' && watt) lines.push(`${watt}W — sized for this build's power needs.`);
  if (cat === 'RAM') lines.push('Matched to motherboard RAM type.');
  if (cat === 'STORAGE') lines.push('Selected for capacity vs speed tradeoff.');
  if (cat === 'MOTHERBOARD') lines.push('Socket & chipset matched to CPU.');
  return lines.join(' ');
};

/** Generate tooltip text for manual build parts (spec summary) */
const getManualPartInfo = (part) => {
  if (!part?.name) return null;
  const cat = part.category?.toUpperCase();
  const score = part.performance_score || 0;
  const price = part.price || 0;
  const watt = part.watt || 0;
  const vram = part.vram || part.params?.vram || 0;
  const lines = [`Score: ${score}/100`];
  if (price) lines.push(`Price: ₹${price.toLocaleString()}`);
  if (watt) lines.push(`TDP: ${watt}W`);
  if (cat === 'GPU' && vram) lines.push(`VRAM: ${vram}GB`);
  if (cat === 'CPU' && part.params?.socket) lines.push(`Socket: ${part.params.socket}`);
  if (cat === 'RAM' && part.params?.ram_type) lines.push(`Type: ${part.params.ram_type}`);
  if (cat === 'STORAGE' && part.params?.capacity) lines.push(`Capacity: ${part.params.capacity}GB`);
  return lines.join(' · ');
};

function BuildResult({ build, useCase, onReset, onEdit, onDelete, onSelect, onSave }) {
  if (!build) return null;

  const isManualBuild = build.type === 'Manual Build';
  const hasIssues = build.issues && build.issues.length > 0;
  const benchmarks = useMemo(() => hasIssues ? null : estimateBenchmarks(build), [build, hasIssues]);

  return (
    <ResultContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <div>
          <h2 style={{ margin: 0 }}>Your {useCase} Rig</h2>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>Optimized for maximum value</p>
        </div>
        <TotalPrice>₹{build.totalPrice.toLocaleString()}</TotalPrice>
      </Header>

      {/* Compatibility Issues (Red) */}
      {build.issues && build.issues.length > 0 && (
        <IssuesContainer>
          <h3 style={{ color: '#ff4d4d', marginTop: 0, fontSize: '1.2rem' }}>⚠️ Compatibility Issues</h3>
          <ul style={{ paddingLeft: '20px', color: '#ffcccc', margin: '0.5rem 0 0' }}>
            {build.issues.map((issue, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{issue}</li>
            ))}
          </ul>
        </IssuesContainer>
      )}

      {/* Bottlenecks & Suggestions (Orange) */}
      {build.bottlenecks && build.bottlenecks.length > 0 && (
        <BottleneckContainer>
          <h3 style={{ color: '#ffa600', marginTop: 0, fontSize: '1.2rem' }}>⚠️ Performance Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {build.bottlenecks.map((b, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffcc80', fontWeight: 'bold' }}>
                  <span>{b.type}</span>
                  {b.percentage && <span>{b.percentage}% Detected</span>}
                </div>
                <p style={{ margin: '0.5rem 0', color: '#ffe0b2', fontSize: '0.95rem' }}>{b.details}</p>
                {b.suggestion && (
                  <SuggestionBox>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Recommended Upgrade</div>
                      <div style={{ color: '#fff', fontWeight: '500' }}>{b.suggestion.name}</div>
                    </div>
                    <div style={{ color: '#00e5ff', fontWeight: 'bold' }}>₹{b.suggestion.price.toLocaleString()}</div>
                  </SuggestionBox>
                )}
              </div>
            ))}
          </div>
        </BottleneckContainer>
      )}

      <PartList>
        {build.parts.map((p, i) => (
          <React.Fragment key={i}>
            <PartItem
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <PartInfo>
                <Category>
                  {p.category}
                  {p.performance_score > 0 && <SpecTag>Score: {p.performance_score}</SpecTag>}
                  {p.watt > 0 && <SpecTag>{p.watt}W</SpecTag>}
                </Category>
                {p.name ? (
                  <PartName>{p.name}</PartName>
                ) : (
                  <PartName style={{ color: '#aaa', fontStyle: 'italic', fontSize: '1rem' }}>
                    No {p.category} Selected
                  </PartName>
                )}
              </PartInfo>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <PartPrice>
                  {p.price ? `₹${p.price.toLocaleString()}` : (p.name ? 'Free' : '-')}
                </PartPrice>

                <Actions>
                  {p.name ? (
                    <>
                      <Tooltip text={isManualBuild ? getManualPartInfo(p) : getPartReason(p, useCase)} />
                      {onEdit && <ActionBtn onClick={() => onEdit(p.category)}>Change</ActionBtn>}
                      {onDelete && <ActionBtn className="delete" onClick={() => onDelete(p.category)}>Delete</ActionBtn>}
                    </>
                  ) : (
                    onSelect && <ActionBtn className="select" onClick={() => onSelect(p.category)}>Select</ActionBtn>
                  )}
                </Actions>
              </div>
            </PartItem>

            {/* Upgrade suggestion for manual builds */}
            {isManualBuild && p.upgrade && (
              <UpgradeHint
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: i * 0.1 + 0.15 }}
              >
                <span className="tag">↑ BETTER OPTION</span>
                <span className="name">{p.upgrade.name}</span>
                <span className="meta">
                  ₹{p.upgrade.price.toLocaleString()} · {p.upgrade.reason}
                </span>
              </UpgradeHint>
            )}
          </React.Fragment>
        ))}
      </PartList>

      {/* ── Benchmark Metrics ─────────────────────── */}
      {benchmarks && (
        <BenchSection>
          <BenchTitle>⚡ Estimated Performance</BenchTitle>

          {/* Radar Chart */}
          <BenchmarkRadar
            data={[
              { label: '1080p', value: benchmarks.fps1080p, max: 160 },
              { label: '1440p', value: benchmarks.fps1440p, max: 120 },
              { label: '4K', value: benchmarks.fps4k, max: 70 },
              { label: 'GPU', value: build.parts.find(p => p.category?.toUpperCase() === 'GPU')?.performance_score || 0, max: 100 },
              { label: 'CPU', value: Math.round(benchmarks.cinebench / 22), max: 100 },
              { label: 'Export', value: Math.round(benchmarks.exportSpeed * 15), max: 90 },
              { label: 'Storage', value: benchmarks.diskSpeed ? Math.min(Math.round(benchmarks.diskSpeed / 70), 100) : 30, max: 100 },
            ]}
          />

          {/* FPS Row */}
          <BenchSubtitle>🎮 Avg FPS (AAA Titles, High Settings)</BenchSubtitle>
          <MetricsGrid>
            <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span className="metric-label">1080p FHD</span>
              <span className="metric-value" style={{ color: fpsColor(benchmarks.fps1080p) }}>{benchmarks.fps1080p}</span>
              <span className="metric-unit">FPS</span>
            </MetricCard>
            <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <span className="metric-label">1440p QHD</span>
              <span className="metric-value" style={{ color: fpsColor(benchmarks.fps1440p) }}>{benchmarks.fps1440p}</span>
              <span className="metric-unit">FPS</span>
            </MetricCard>
            <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <span className="metric-label">4K UHD</span>
              <span className="metric-value" style={{ color: fpsColor(benchmarks.fps4k) }}>{benchmarks.fps4k}</span>
              <span className="metric-unit">FPS</span>
            </MetricCard>
          </MetricsGrid>

          {/* Workstation Row */}
          <BenchSubtitle style={{ marginTop: '1.2rem' }}>🖥️ Workstation</BenchSubtitle>
          <MetricsGrid>
            <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <span className="metric-label">Cinebench</span>
              <span className="metric-value" style={{ color: '#00c2d4' }}>{benchmarks.cinebench.toLocaleString()}</span>
              <span className="metric-unit">pts (multi)</span>
            </MetricCard>
            <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <span className="metric-label">Export Speed</span>
              <span className="metric-value" style={{ color: '#00c2d4' }}>{benchmarks.exportSpeed}x</span>
              <span className="metric-unit">real-time</span>
            </MetricCard>
            {benchmarks.vram > 0 && (
              <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                <span className="metric-label">VRAM</span>
                <span className="metric-value" style={{ color: '#00c2d4' }}>{benchmarks.vram}</span>
                <span className="metric-unit">GB</span>
              </MetricCard>
            )}
          </MetricsGrid>

          {/* System Row */}
          <BenchSubtitle style={{ marginTop: '1.2rem' }}>📊 System</BenchSubtitle>
          <MetricsGrid>
            {benchmarks.diskSpeed && (
              <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <span className="metric-label">Disk Speed</span>
                <span className="metric-value" style={{ color: '#00c2d4' }}>{benchmarks.diskSpeed.toLocaleString()}</span>
                <span className="metric-unit">MB/s</span>
              </MetricCard>
            )}
            {benchmarks.bandwidth && (
              <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                <span className="metric-label">RAM</span>
                <span className="metric-value" style={{ color: '#00c2d4' }}>{benchmarks.bandwidth}</span>
                <span className="metric-unit">GB/s</span>
              </MetricCard>
            )}
            <MetricCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <span className="metric-label">Power Draw</span>
              <span className="metric-value" style={{ color: benchmarks.powerDraw > 500 ? '#ff4d4d' : '#00c2d4' }}>{benchmarks.powerDraw}</span>
              <span className="metric-unit">watts</span>
            </MetricCard>
          </MetricsGrid>

          {/* Overall */}
          <OverallRow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <span>Overall Rating</span>
            <span className="score">{benchmarks.overall}<span className="of">/10</span></span>
          </OverallRow>
        </BenchSection>
      )}

      {hasIssues && (
        <div style={{ marginTop: '1.5rem', padding: '0.8rem 1rem', background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: '10px', fontSize: '0.82rem', color: '#ff8888' }}>
          ⚠️ Benchmarks hidden — fix compatibility issues above to see performance estimates.
        </div>
      )}

      <div style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Button
          text="Build Another Rig"
          onClick={onReset}
        />
        {onSave && (
          <SaveButton onClick={onSave} />
        )}
      </div>
    </ResultContainer>
  );
}

export default BuildResult;
