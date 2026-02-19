import { motion } from 'framer-motion';
import styled from 'styled-components';
import Button from '../Button';
import SaveButton from '../SaveButton';

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

  &:last-child {
    border-bottom: none;
  }
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

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #fff;
  }
  
  &.delete {
      color: #ff4d4d;
      border-color: rgba(255, 77, 77, 0.3);
      &:hover {
          background: rgba(255, 77, 77, 0.1);
          border-color: #ff4d4d;
      }
  }

  &.select {
      color: #00e5ff;
      border-color: rgba(0, 229, 255, 0.3);
       &:hover {
          background: rgba(0, 229, 255, 0.1);
          border-color: #00e5ff;
      }
  }
`;

function BuildResult({ build, useCase, onReset, onEdit, onDelete, onSelect, onSave }) {
  if (!build) return null;

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
          <PartItem
            key={i}
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
                    {onEdit && <ActionBtn onClick={() => onEdit(p.category)}>Change</ActionBtn>}
                    {onDelete && <ActionBtn className="delete" onClick={() => onDelete(p.category)}>Delete</ActionBtn>}
                  </>
                ) : (
                  onSelect && <ActionBtn className="select" onClick={() => onSelect(p.category)}>Select</ActionBtn>
                )}
              </Actions>
            </div>
          </PartItem>
        ))}
      </PartList>

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
