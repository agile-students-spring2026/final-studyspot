import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './AuthPages.module.css';

export default function ChoosePasswordPage() {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const email                     = location.state?.email ?? '';

  /* Simple strength check — returns 0–3 */
  function strengthScore(pw) {
    let score = 0;
    if (pw.length >= 8)            score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9!@#$%^&*]/.test(pw)) score++;
    return score;
  }

  const score         = strengthScore(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][score];
  const strengthColor = ['', '#C0392B', '#E8A838', '#3D6B4F'][score];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    // POST to backend to create the account
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed.');
        return;
      }

      // Store token and navigate to main app
      localStorage.setItem('token', data.token);
      navigate('/spots');
    } catch (err) {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <span className={styles.logoMark}>S</span>
          <h1 className={styles.logoText}>StudySpot</h1>
        </div>

        <h2 className={styles.heading}>Choose a password</h2>
        <p className={styles.subheading}>At least 8 characters</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />

          {/* Strength meter */}
          {password.length > 0 && (
            <div className={styles.strengthMeter}>
              <div className={styles.strengthBars}>
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    className={styles.strengthBar}
                    style={{ background: score >= n ? strengthColor : 'var(--color-border)' }}
                  />
                ))}
              </div>
              <span className={styles.strengthLabel} style={{ color: strengthColor }}>
                {strengthLabel}
              </span>
            </div>
          )}

          <Input
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />

          {error && <p className={styles.formError}>{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}