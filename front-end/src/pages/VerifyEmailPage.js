import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import styles from './AuthPages.module.css';

export default function VerifyEmailPage() {
  const [code, setCode]   = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate          = useNavigate();
  const location          = useLocation();
  const email             = location.state?.email ?? 'your email';

  function handleChange(index, val) {
    // Accept only digits, max 1 char per box
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[index] = val;
    setCode(next);

    // Auto-advance to next box
    if (val && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(index, e) {
    // On backspace with empty box, go back
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');

    if (fullCode.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    // TODO: call API to verify code
    console.log('Verifying code', fullCode, 'for', email);
    navigate('/choose-password', { state: { email } });
  }

  function handleResend() {
    // TODO: call API to resend verification email
    console.log('Resending code to', email);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <span className={styles.logoMark}>S</span>
          <h1 className={styles.logoText}>StudySpot</h1>
        </div>

        <h2 className={styles.heading}>Check your email</h2>
        <p className={styles.subheading}>
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.codeRow}>
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                className={styles.codeBox}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && <p className={styles.formError}>{error}</p>}

          <Button type="submit">Verify</Button>
        </form>

        <p className={styles.footerText}>
          Didn't receive it?{' '}
          <button className={styles.textBtn} onClick={handleResend}>
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}