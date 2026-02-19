import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';

const UsernameModal = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const { user, setUser, logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: user._id, username }),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                alert('Failed to update username');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Overlay>
            <ModalCard>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CloseBtn onClick={onClose}>&times;</CloseBtn>
                </div>
                <Title>Welcome to RigSense!</Title>
                <Subtitle>Please choose a username to continue.</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <SubmitButton type="submit">Start Crafting</SubmitButton>
                </Form>
                <LogoutLink onClick={logout}>Not you? Log Out</LogoutLink>
            </ModalCard>
        </Overlay>
    );
};

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
`;

const ModalCard = styled.div`
    background: #111;
    border: 1px solid #333;
    padding: 2rem;
    border-radius: 1rem;
    width: 350px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 150, 255, 0.2);
    position: relative;
`;

const CloseBtn = styled.button`
    background: transparent;
    border: none;
    color: #aaa;
    font-size: 1.5rem;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 15px;
    &:hover {
        color: white;
    }
`;

const Title = styled.h2`
    color: white;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
`;

const Subtitle = styled.p`
    color: #aaa;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    padding: 0.8rem;
    border-radius: 0.5rem;
    border: 1px solid #333;
    background: #222;
    color: white;
    outline: none;
    &:focus {
        border-color: #0099ff;
    }
`;

const SubmitButton = styled.button`
    padding: 0.8rem;
    border-radius: 0.5rem;
    border: none;
    background: linear-gradient(45deg, #0099ff, #00ccff);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.02);
    }
`;

const LogoutLink = styled.p`
    color: #666;
    font-size: 0.8rem;
    margin-top: 1.5rem;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
        color: #999;
    }
`;

export default UsernameModal;
