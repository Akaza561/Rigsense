import { useState, useContext } from 'react';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const reset = () => { setEmail(''); setPassword(''); setUsername(''); setConfirm(''); setError(''); };

  const switchMode = (m) => { reset(); setMode(m); };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await googleSignIn();
    if (result.success) {
      navigate(localStorage.getItem('pendingBuild') ? '/build' : '/');
    } else {
      setError(result.message);
    }
  };

  return (
    <StyledWrapper>
      <div className="login-card">
        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => switchMode('signin')}>
            Sign In
          </button>
          <button className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')}>
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form className="form" onSubmit={handleSignIn}>
            <input required className="input" type="email" placeholder="E-mail"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input required className="input" type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)} />
            <span className="forgot-password"><Link to="/forgotpassword">Forgot Password?</Link></span>
            {error && <p className="error">{error}</p>}
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Create Account Form */}
        {mode === 'register' && (
          <form className="form" onSubmit={handleRegister}>
            <input required className="input" type="text" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)} />
            <input required className="input" type="email" placeholder="E-mail"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input required className="input" type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)} />
            <input required className="input" type="password" placeholder="Confirm Password"
              value={confirm} onChange={e => setConfirm(e.target.value)} />
            {error && (
              error.toLowerCase().includes('email') && error.toLowerCase().includes('exists')
                ? <p className="error">
                  An account with this email already exists.{' '}
                  <button type="button" className="inline-link" onClick={() => switchMode('signin')}>Sign in instead →</button>
                </p>
                : <p className="error">{error}</p>
            )}
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Google only */}
        <div className="social-account-container">
          <span className="social-label">Or continue with</span>
          <div className="social-accounts">
            <button className="social-button google" type="button" onClick={handleGoogleLogin} aria-label="Sign in with Google">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </button>
          </div>
        </div>

        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: transparent;

  .login-card {
    width: 340px;
    background: linear-gradient(0deg, rgb(255,255,255) 0%, rgb(244,247,251) 100%);
    border-radius: 40px;
    padding: 25px 35px 30px;
    border: 5px solid rgb(255,255,255);
    box-shadow: rgba(133,189,215,0.88) 0px 30px 30px -20px;
    margin: 20px;
  }

  /* ── Tabs ── */
  .tabs {
    display: flex;
    border-radius: 20px;
    background: rgba(0,153,255,0.08);
    padding: 4px;
    margin-bottom: 20px;
    gap: 4px;
  }
  .tab {
    flex: 1;
    border: none;
    background: transparent;
    border-radius: 16px;
    padding: 8px 0;
    font-size: 13px;
    font-weight: 600;
    color: #999;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .tab.active {
    background: linear-gradient(45deg, rgb(16,137,211) 0%, rgb(18,177,209) 100%);
    color: white;
    box-shadow: rgba(133,189,215,0.6) 0px 4px 10px -4px;
  }
  .tab:hover:not(.active) { color: #1089D3; }

  /* ── Form ── */
  .form { display: flex; flex-direction: column; gap: 0; }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 12px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
    color: black;
    font-family: inherit;
    font-size: 14px;
    box-sizing: border-box;
  }
  .form .input::placeholder { color: rgb(170,170,170); }
  .form .input:focus { outline: none; border-inline: 2px solid #12B1D1; }

  .form .forgot-password {
    display: block;
    margin-top: 8px;
    margin-left: 10px;
  }
  .form .forgot-password a {
    font-size: 11px;
    color: #0099ff;
    text-decoration: none;
  }

  .error {
    color: #e53e3e;
    font-size: 12px;
    margin: 8px 10px 0;
    text-align: center;
  }
  .inline-link {
    background: none; border: none; padding: 0;
    color: #0099ff; font-size: 12px; font-weight: 600;
    cursor: pointer; text-decoration: underline;
    font-family: inherit;
  }
  .inline-link:hover { color: #007acc; }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16,137,211) 0%, rgb(18,177,209) 100%);
    color: white;
    padding: 15px 0;
    margin-top: 18px;
    border-radius: 20px;
    box-shadow: rgba(133,189,215,0.88) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    font-size: 15px;
    font-family: inherit;
  }
  .form .login-button:hover:not(:disabled) {
    transform: scale(1.03);
    box-shadow: rgba(133,189,215,0.88) 0px 23px 10px -20px;
  }
  .form .login-button:active:not(:disabled) { transform: scale(0.95); }
  .form .login-button:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ── Social ── */
  .social-account-container { margin-top: 22px; }
  .social-account-container .social-label {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(170,170,170);
  }
  .social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 8px;
  }
  .social-account-container .social-accounts .social-button {
    background: linear-gradient(45deg, rgb(0,0,0) 0%, rgb(112,112,112) 100%);
    border: 5px solid white;
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(133,189,215,0.88) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  .social-account-container .social-accounts .social-button .svg { fill: white; margin: auto; }
  .social-account-container .social-accounts .social-button:hover { transform: scale(1.2); }
  .social-account-container .social-accounts .social-button:active { transform: scale(0.9); }

  /* ── Footer ── */
  .agreement { display: block; text-align: center; margin-top: 14px; }
  .agreement a { text-decoration: none; color: #0099ff; font-size: 9px; }
`;

export default Login;
