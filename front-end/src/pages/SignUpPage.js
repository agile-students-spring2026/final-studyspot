import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './AuthPages.module.css';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.endsWith('.edu')) {
      setError('Please use a valid university (.edu) email address.');
      return;
    }

    // TODO: call API to send verification email, then navigate
    console.log('Sending verification to', email);
    navigate('/verify-email', { state: { email } });
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <span className={styles.logoMark}>S</span>
          <h1 className={styles.logoText}>StudySpot</h1>
        </div>

        <h2 className={styles.heading}>Create an account</h2>
        <p className={styles.subheading}>Enter your university email to get started</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="University email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />

          {error && <p className={styles.formError}>{error}</p>}

          <Button type="submit">Verify Email</Button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}