import { motion } from 'framer-motion';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
`;

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #3c20d8;
  border-radius: 50%;
`;

const Text = styled(motion.p)`
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: #ccc;
  font-family: 'Inter', sans-serif;
`;

const Loading = () => {
    return (
        <LoaderContainer>
            <Spinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <Text
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Analyzing Compatibility...
            </Text>
        </LoaderContainer>
    );
};

export default Loading;
