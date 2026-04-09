import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';
import styles from './AddSpotPage.module.css';

export default function AddSpotPage() {
    const [spotName, setSpotName]       = useState('');
    const [address, setAddress]         = useState('');
    const [hours, setHours]             = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage]             = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('spotName', spotName);
        formData.append('address', address);
        formData.append('hours', hours);
        formData.append('description', description);
        formData.append('image', image);

        try {
          const token = localStorage.getItem('token');
          const headers = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const res = await fetch('/api/studyspots', {
            method: 'POST',
            headers,
            body: formData,
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to add spot.');
          }

          setSpotName('');
          setAddress('');
          setHours('');
          setDescription('');
          setImage(null);
          navigate('/spots');
        } catch (err) {
          alert(err.message);
        }
    };

    return (
        <div className={styles.page}>
          <div className={styles.card}>
            <div className={styles.logoBlock}>
              <span className={styles.logoMark}>S</span>
              <h1 className={styles.logoText}>StudySpot</h1>
            </div>
    
            <h2 className={styles.heading}>Add a Spot</h2>
            <p className={styles.subheading}>Help others find a place to study</p>
    
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                label="Spot Name"
                type="text"
                placeholder="e.g., Bobst Library 5th Floor"
                value={spotName}
                onChange={e => setSpotName(e.target.value)}
                required
              />
              <Input
                label="Address"
                type="text"
                placeholder="e.g., 70 Washington Square South"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
              <Input
                label="Hours of Operation"
                type="text"
                placeholder="e.g., 8:00 AM - 11:00 PM"
                value={hours}
                onChange={e => setHours(e.target.value)}
                required
              />
                <div className={styles.inputWrapper}>
                    <label className={styles.label}>Description</label>
                    <textarea 
                        className={styles.textarea} 
                        name="description"
                        rows="3" 
                        placeholder="What makes this a good study spot?" 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.label}>Upload Image</label>
                    <input 
                        className={styles.fileInput} 
                        type="file" 
                        name="image"
                        accept="image/*" 
                        onChange={e => setImage(e.target.files[0])}
                        required 
                    />
                </div>
    
                <Button type="submit">Submit Spot</Button>
                </form>
            
                <p className={styles.footerText}>
                    Changed your mind?{' '}
                    <Link to="/spots">Cancel</Link>
                </p>
          </div>
          <BottomNav />
        </div>
    );
}