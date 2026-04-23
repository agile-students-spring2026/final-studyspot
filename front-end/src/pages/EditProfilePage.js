import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './EditProfilePage.module.css';

export default function EditProfilePage() {
    const navigate = useNavigate();
    const [name, setName] = useState(localStorage.getItem('userName') || localStorage.getItem('userEmail') || '');
    const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
    const [imagePreview, setImagePreview] = useState('https://picsum.photos/seed/user1/150/150');
    const [error, setError] = useState('');

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to update profile.');
                return;
            }
        } catch {
            // If API fails, still save locally so the UI reflects the change
        }
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        navigate('/profile');
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate('/profile')}>
                ← Back
                </button>
                <h1 className={styles.headerTitle}>Edit Profile</h1>
            </header>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.avatarSection}>
                    <img src={imagePreview} alt="Profile" className={styles.avatar} />
                    <label className={styles.changePhoto}>
                        Change Photo
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </label>
                </div>
                <Input
                    label="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                />
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    error={error}
                />
                <Button type="submit">Save Changes</Button>
            </form>
        </div>
    );
}
