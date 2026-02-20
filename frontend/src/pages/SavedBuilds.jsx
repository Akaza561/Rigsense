import { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';

const AnoAI = lazy(() => import('../components/ui/animated-shader-background'));

function SavedBuilds() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [savedBuilds, setSavedBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchSavedBuilds();
    }, [user]);

    const fetchSavedBuilds = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/saved-builds/${user._id}`);
            const data = await res.json();
            if (res.ok) {
                setSavedBuilds(data.savedBuilds || []);
            }
        } catch (err) {
            console.error('Failed to fetch saved builds', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Delete this saved build?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/saved-builds/${user._id}/${index}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setSavedBuilds(prev => prev.filter((_, i) => i !== index));
                if (expandedIndex === index) setExpandedIndex(null);
            }
        } catch (err) {
            console.error('Failed to delete build', err);
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <div style={{ width: '100%', minHeight: '100vh' }}>
                <Suspense fallback={<div style={{ width: '100%', height: '100vh', background: '#000' }} />}>
                    <AnoAI />
                </Suspense>

                <PageContainer>
                    <m.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                        Saved Builds
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ color: '#888', marginBottom: '2.5rem', fontSize: '0.95rem' }}
                    >
                        Your saved PC builds — ready to revisit anytime.
                    </m.p>

                    <BackButton onClick={() => navigate('/')}>← Home</BackButton>

                    {loading ? (
                        <LoadingText>Loading your builds...</LoadingText>
                    ) : savedBuilds.length === 0 ? (
                        <EmptyState>
                            <span style={{ fontSize: '3rem' }}>📦</span>
                            <p>No saved builds yet.</p>
                            <p style={{ color: '#666', fontSize: '0.85rem' }}>Generate a build on the Builder page and save it!</p>
                            <GoButton onClick={() => navigate('/build')}>Go to Builder →</GoButton>
                        </EmptyState>
                    ) : (
                        <BuildsList>
                            {savedBuilds.map((build, index) => (
                                <m.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <BuildCard>
                                        <BuildHeader onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                                            <div>
                                                <BuildTitle>{build.type || `Build #${index + 1}`}</BuildTitle>
                                                <BuildMeta>
                                                    ₹{build.totalPrice?.toLocaleString() ?? 'N/A'}
                                                    {build.ksavedAt && ` · ${new Date(build.ksavedAt).toLocaleDateString()}`}
                                                </BuildMeta>
                                            </div>
                                            <CardActions>
                                                <DeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>🗑</DeleteButton>
                                                <ExpandIcon>{expandedIndex === index ? '▲' : '▼'}</ExpandIcon>
                                            </CardActions>
                                        </BuildHeader>

                                        {expandedIndex === index && build.parts && (
                                            <PartsList>
                                                {build.parts.map((part, pi) => (
                                                    <PartRow key={pi}>
                                                        <PartCategory>{part.category}</PartCategory>
                                                        <PartName>{part.name}</PartName>
                                                        <PartPrice>₹{part.price?.toLocaleString()}</PartPrice>
                                                    </PartRow>
                                                ))}
                                            </PartsList>
                                        )}
                                    </BuildCard>
                                </m.div>
                            ))}
                        </BuildsList>
                    )}
                </PageContainer>
            </div>
        </LazyMotion>
    );
}

const PageContainer = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 4rem 1.5rem 2rem;
    color: #fff;
    font-family: 'Inter', sans-serif;
`;

const BackButton = styled.button`
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: #aaa;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
    transition: all 0.2s;
    &:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
`;

const LoadingText = styled.p`color: #666; text-align: center; margin-top: 4rem;`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 5rem;
    color: #aaa;
`;

const GoButton = styled.button`
    margin-top: 1rem;
    padding: 0.7rem 1.5rem;
    background: linear-gradient(135deg, #00c2d4, #0099aa);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.2s;
    &:hover { transform: scale(1.03); }
`;

const BuildsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const BuildCard = styled.div`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transition: border-color 0.2s;
    &:hover { border-color: rgba(60, 32, 216, 0.4); }
`;

const BuildHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.5rem;
    cursor: pointer;
`;

const BuildTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.2rem;
`;

const BuildMeta = styled.p`
    font-size: 0.8rem;
    color: #888;
    margin: 0;
`;

const CardActions = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const DeleteButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.5;
    transition: opacity 0.2s;
    &:hover { opacity: 1; }
`;

const ExpandIcon = styled.span`color: #666; font-size: 0.8rem;`;

const PartsList = styled.div`
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 0.5rem 0;
`;

const PartRow = styled.div`
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 1rem;
    padding: 0.6rem 1.5rem;
    font-size: 0.85rem;
    &:hover { background: rgba(255,255,255,0.03); }
`;

const PartCategory = styled.span`color: #666; text-transform: capitalize;`;
const PartName = styled.span`color: #ccc;`;
const PartPrice = styled.span`color: #00c2d4; font-weight: 600;`;

export default SavedBuilds;
