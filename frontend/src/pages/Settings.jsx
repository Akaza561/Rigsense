import { useState, useEffect, useContext, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';

const AnoAI = lazy(() => import('../components/ui/animated-shader-background'));

function Settings() {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [username, setUsername] = useState(user?.username || '');
    const [avatarPreview, setAvatarPreview] = useState(user?.picture || null);
    const [savedBuildsCount, setSavedBuildsCount] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        // Fetch live saved builds count
        fetch(`http://localhost:5000/api/users/saved-builds/${user._id}`)
            .then(r => r.json())
            .then(d => setSavedBuildsCount(d.savedBuilds?.length ?? 0))
            .catch(() => setSavedBuildsCount(0));
    }, [user]);

    if (!user) return null;

    // Handle avatar file pick
    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true); setSaved(false);
        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: user._id,
                    username,
                    picture: avatarPreview,
                }),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            } else {
                alert('Failed to update profile.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const initials = (user.username || 'U')[0].toUpperCase();

    return (
        <LazyMotion features={domAnimation}>
            <div style={{ width: '100%', minHeight: '100vh' }}>
                <Suspense fallback={<div style={{ background: '#000', width: '100%', height: '100vh' }} />}>
                    <AnoAI />
                </Suspense>

                <PageContainer>
                    <m.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Settings
                    </m.h1>
                    <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem' }}>
                        Manage your account and preferences.
                    </m.p>

                    {/* Profile Card */}
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardTitle>👤 Profile</CardTitle>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                            <AvatarRow>
                                <AvatarWrapper onClick={handleAvatarClick} title="Click to change photo">
                                    {avatarPreview
                                        ? <Avatar src={avatarPreview} alt="Profile" />
                                        : <AvatarPlaceholder>{initials}</AvatarPlaceholder>
                                    }
                                    <AvatarOverlay>📷</AvatarOverlay>
                                </AvatarWrapper>
                                <UserInfo>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#fff' }}>{user.username}</p>
                                    <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{user.email}</p>
                                    <p style={{ margin: '0.2rem 0 0', color: '#555', fontSize: '0.75rem' }}>Click photo to change</p>
                                </UserInfo>
                            </AvatarRow>

                            <form onSubmit={handleSaveProfile}>
                                <FieldGroup>
                                    <FieldLabel>Username</FieldLabel>
                                    <FieldInput
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                    />
                                </FieldGroup>
                                <SaveBtn type="submit" disabled={saving}>
                                    {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
                                </SaveBtn>
                            </form>
                        </Card>
                    </m.div>

                    {/* Account Card */}
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardTitle>🔐 Account</CardTitle>
                            <InfoRow>
                                <InfoLabel>Email</InfoLabel>
                                <InfoValue>{user.email}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Saved Builds</InfoLabel>
                                <InfoValue>
                                    {savedBuildsCount === null
                                        ? 'Loading…'
                                        : `${savedBuildsCount} build${savedBuildsCount !== 1 ? 's' : ''}`}
                                </InfoValue>
                            </InfoRow>
                        </Card>
                    </m.div>

                    {/* Account Actions */}
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card danger>
                            <CardTitle>🔒 Account Actions</CardTitle>
                            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                Signing out will end your current session.
                            </p>
                            <DangerBtn onClick={handleLogout}>Sign Out</DangerBtn>
                        </Card>
                    </m.div>
                </PageContainer>
            </div>
        </LazyMotion>
    );
}

/* ─── Styled Components ──────────────────────────────────── */

const PageContainer = styled.div`
    position: relative; z-index: 1;
    min-height: 100vh;
    max-width: 640px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
    color: #fff;
    font-family: 'Inter', sans-serif;
    display: flex; flex-direction: column; gap: 1.5rem;
`;

const Card = styled.div`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid ${p => p.danger ? 'rgba(255,60,60,0.25)' : 'rgba(255,255,255,0.1)'};
    border-radius: 16px;
    padding: 1.75rem;
    backdrop-filter: blur(12px);
`;

const CardTitle = styled.h3`font-size: 1rem; font-weight: 600; margin: 0 0 1.25rem; color: #ccc;`;

const AvatarRow = styled.div`display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;`;

const AvatarWrapper = styled.div`
    position: relative; cursor: pointer; border-radius: 50%; flex-shrink: 0;
    &:hover > div { opacity: 1; }
`;

const Avatar = styled.img`
    width: 58px; height: 58px; border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(255,255,255,0.12); display: block;
`;

const AvatarPlaceholder = styled.div`
    width: 58px; height: 58px; border-radius: 50%;
    background: linear-gradient(135deg, #00c2d4, #0099aa);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; font-weight: 700; color: #fff;
`;

const AvatarOverlay = styled.div`
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(0,0,0,0.55); display: flex; align-items: center;
    justify-content: center; font-size: 1.2rem; opacity: 0;
    transition: opacity 0.2s;
`;

const UserInfo = styled.div`line-height: 1.6;`;

const FieldGroup = styled.div`display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem;`;
const FieldLabel = styled.label`font-size: 0.8rem; color: #888;`;
const FieldInput = styled.input`
    width: 100%; padding: 0.7rem 1rem;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: #00c2d4; }
`;

const SaveBtn = styled.button`
    padding: 0.65rem 1.5rem;
    background: linear-gradient(135deg, #00c2d4, #0099aa);
    color: white; border: none; border-radius: 10px; cursor: pointer;
    font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
    &:hover:not(:disabled) { transform: scale(1.02); }
    &:disabled { opacity: 0.6; cursor: default; }
`;

const InfoRow = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.65rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);
    &:last-of-type { border-bottom: none; }
`;
const InfoLabel = styled.span`font-size: 0.85rem; color: #777;`;
const InfoValue = styled.span`font-size: 0.9rem; color: #ccc; font-weight: 500;`;

const DangerBtn = styled.button`
    padding: 0.65rem 1.4rem; background: transparent; color: #ff4c4c;
    border: 1px solid rgba(255,60,60,0.4); border-radius: 10px; cursor: pointer;
    font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
    &:hover { background: rgba(255,60,60,0.1); border-color: #ff4c4c; }
`;

export default Settings;
