import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SimpleButton from './SimpleButton';
import AuthButton from './AuthButton';
import Radio from './Radio';
import AuthContext from './context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    // Reset error state whenever the picture URL changes (e.g. after saving in Settings)
    useEffect(() => { setImgError(false); }, [user?.picture]);

    const handleAuthClick = () => {
        if (user) {
            logout();
        } else {
            navigate('/login');
        }
    };

    const initials = user?.username ? user.username[0].toUpperCase() : '?';
    const showPicture = user?.picture && !imgError;

    return (
        <NavBar>
            <LeftGroup>
                {user && (
                    <AvatarBtn onClick={() => navigate('/settings')} title="Profile Settings">
                        {showPicture
                            ? <AvatarImg
                                src={user.picture}
                                alt=""
                                onError={() => setImgError(true)}
                            />
                            : <AvatarInitial>{initials}</AvatarInitial>
                        }
                    </AvatarBtn>
                )}
                <SimpleButton username={user?.username} />
                {window.history.length > 1 && (
                    <BackBtn onClick={() => navigate('/')} title="Go to Home">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back
                    </BackBtn>
                )}
            </LeftGroup>
            <RightGroup>
                <AuthButton text={user ? 'Log Out' : 'Log In / Register'} onClick={handleAuthClick} />
                <Radio />
            </RightGroup>
        </NavBar>
    );
};

const NavBar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    /* subtle glass blur so it reads well on any page */
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;

const RightGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const LeftGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
`;

const BackBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.75);
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    &:hover {
        background: rgba(0, 194, 212, 0.12);
        border-color: rgba(0, 194, 212, 0.4);
        color: #00c2d4;
        transform: translateX(-2px);
    }
`;

const AvatarBtn = styled.button`
    background: none;
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    width: 38px;
    height: 38px;
    overflow: hidden;
    flex-shrink: 0;
    transition: border-color 0.2s, transform 0.2s;
    &:hover { border-color: #00c2d4; transform: scale(1.06); }
`;

const AvatarImg = styled.img`
    width: 100%; height: 100%; object-fit: cover; display: block;
`;

const AvatarInitial = styled.div`
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #00c2d4, #0099aa);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; font-weight: 700; color: #fff;
`;

export default Navbar;
