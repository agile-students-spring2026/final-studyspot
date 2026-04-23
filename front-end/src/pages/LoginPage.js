import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './AuthPages.module.css';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  async function handleSubmit (e) {
    e.preventDefault();
    setError('');

    if (!email.endsWith('.edu')) {
      setError('Please use your university (.edu) email.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Login failed.');
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('userEmail', email);
    navigate('/spots');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <span className={styles.logoMark}>S</span>
          <h1 className={styles.logoText}>StudySpot</h1>
        </div>

        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.subheading}>Log in with your university email</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="University email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && <p className={styles.formError}>{error}</p>}

          <Button type="submit">Log In</Button>
        </form>

        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}