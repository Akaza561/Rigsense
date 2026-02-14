import { motion } from 'framer-motion';
import styled from 'styled-components';

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
  color: #00ff88;
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
  color: #00ff88;
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
  }
`;

const SpecTag = styled.span`
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    margin-left: 0.5rem;
    color: #ccc;
`;

function BuildResult({ build, useCase, onReset }) {
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
                            <PartName>{p.name}</PartName>
                        </PartInfo>
                        <PartPrice>₹{p.price.toLocaleString()}</PartPrice>
                    </PartItem>
                ))}
            </PartList>

            <Button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReset}
            >
                Build Another Rig
            </Button>
        </ResultContainer>
    );
}

export default BuildResult;
