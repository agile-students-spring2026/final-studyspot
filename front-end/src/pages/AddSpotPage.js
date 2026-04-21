import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';
import styles from './AddSpotPage.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_OPEN = '07:00';
const DEFAULT_CLOSE = '23:00';

function makeDefaultDailyHours() {
  return Object.fromEntries(
    DAYS.map(day => [day, { closed: false, open: DEFAULT_OPEN, close: DEFAULT_CLOSE, overnight: false }])
  );
}

function formatTime24to12(t) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${String(m).padStart(2, '0')} ${suffix}`;
}


function resolveHours(mode, sameHours, dailyHours) {
  if (mode === 'twentyFour') {
    return DAYS.map(day => ({ day, open: '00:00', close: '23:59', overnight: false }));
  }
  if (mode === 'sameEveryDay') {
    return DAYS.map(day => ({
      day, open: sameHours.open, close: sameHours.close, overnight: sameHours.overnight,
    }));
  }
  return DAYS.map(day => {
    const e = dailyHours[day];
    if (e.closed) return { day, closed: true };
    return { day, open: e.open, close: e.close, overnight: e.overnight };
  });
}
function validateHours(hoursArray) {
  const errors = [];
  for (const entry of hoursArray) {
    if (entry.closed) continue;
    if (!entry.open || !entry.close) {
      errors.push(`${entry.day}: Must have both an open and close time.`);
      continue;
    }
    if (!entry.overnight && entry.close <= entry.open) {
      errors.push(
        `${entry.day}: Close time must be after open time, or check "Overnight" if the spot closes after midnight.`
      );
    }
  }
  if (hoursArray.every(e => e.closed)) {
    errors.push('The spot must be open on at least one day.');
  }
  return errors;
}
function hoursToDisplayArray(hoursArray) {
  return hoursArray.map(h => {
    if (h.closed) return { day: h.day, time: 'Closed' };
    if (h.open === '00:00' && h.close === '23:59') return { day: h.day, time: '24 Hours' };
    const suffix = h.overnight ? ' (+1 day)' : '';
    return { day: h.day, time: `${formatTime24to12(h.open)} - ${formatTime24to12(h.close)}${suffix}` };
  });
}

export default function AddSpotPage() {
    const [spotName, setSpotName]       = useState('');
    const [address, setAddress]         = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage]             = useState(null);
    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();

    const [hoursMode, setHoursMode] = useState('custom');
    const [sameHours, setSameHours] = useState({ open: DEFAULT_OPEN, close: DEFAULT_CLOSE, overnight: false });
    const [dailyHours, setDailyHours] = useState(makeDefaultDailyHours);

    function updateDay(day, patch) {
      setDailyHours(prev => ({ ...prev, [day]: { ...prev[day], ...patch } }));
    }
    function applyToAll() {
      const monday = dailyHours['Monday'];
      setDailyHours(Object.fromEntries(DAYS.map(day => [day, { ...monday }])));
    }
    function applyToWeekdays() {
      const monday = dailyHours['Monday'];
      setDailyHours(prev => {
        const next = { ...prev };
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
          next[day] = { ...monday };
        }
        return next;
      });
    }
    function toggleMode(clicked) {
      setHoursMode(prev => (prev === clicked ? 'custom' : clicked));
      setFormErrors([]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const resolved = resolveHours(hoursMode, sameHours, dailyHours);
        const errors = validateHours(resolved);
        if (errors.length > 0) {
          setFormErrors(errors);
          return;
        }
        setFormErrors([]);

        const displayHours = hoursToDisplayArray(resolved);

        const formData = new FormData();
        formData.append('spotName', spotName);
        formData.append('address', address);
        formData.append('hours', JSON.stringify(displayHours));
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
          setHoursMode('custom');
          setSameHours({ open: DEFAULT_OPEN, close: DEFAULT_CLOSE, overnight: false });
          setDailyHours(makeDefaultDailyHours());
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
            
              <fieldset className={styles.hoursFieldset}>
                <legend className={styles.label}>Hours of Operation</legend>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={hoursMode === 'twentyFour'}
                    onChange={() => toggleMode('twentyFour')}
                  />
                  Open 24/7
                </label>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={hoursMode === 'sameEveryDay'}
                    onChange={() => toggleMode('sameEveryDay')}
                  />
                  Same hours every day
                </label>
                {hoursMode === 'sameEveryDay' && (
                  <div className={styles.dayRow}>
                    <span className={styles.dayLabel}>Every day</span>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={sameHours.open}
                      onChange={e => setSameHours(h => ({ ...h, open: e.target.value }))}
                    />
                    <span className={styles.timeSep}>to</span>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={sameHours.close}
                      onChange={e => setSameHours(h => ({ ...h, close: e.target.value }))}
                    />
                    <label className={styles.overnightLabel}>
                      <input
                        type="checkbox"
                        checked={sameHours.overnight}
                        onChange={e => setSameHours(h => ({ ...h, overnight: e.target.checked }))}
                      />
                      Overnight
                    </label>
                  </div>
                )}
                {hoursMode === 'custom' && (
                  <div className={styles.daysList}>
                    {DAYS.map((day, idx) => (
                      <div key={day} className={styles.dayRow}>
                        <span className={styles.dayLabel}>{day}</span>
                        <label className={styles.closedLabel}>
                          <input
                            type="checkbox"
                            checked={dailyHours[day].closed}
                            onChange={e => updateDay(day, { closed: e.target.checked })}
                          />
                          Closed
                        </label>
                        {!dailyHours[day].closed && (
                          <>
                            <input
                              type="time"
                              className={styles.timeInput}
                              value={dailyHours[day].open}
                              onChange={e => updateDay(day, { open: e.target.value })}
                            />
                            <span className={styles.timeSep}>to</span>
                            <input
                              type="time"
                              className={styles.timeInput}
                              value={dailyHours[day].close}
                              onChange={e => updateDay(day, { close: e.target.value })}
                            />
                            <label className={styles.overnightLabel}>
                              <input
                                type="checkbox"
                                checked={dailyHours[day].overnight}
                                onChange={e => updateDay(day, { overnight: e.target.checked })}
                              />
                              Overnight
                            </label>
                          </>
                        )}
                        {idx === 0 && !dailyHours[day].closed && (
                          <div className={styles.applyBtnGroup}>
                            <button type="button" className={styles.applyBtn} onClick={applyToAll}>
                              Apply to all days
                            </button>
                            <button type="button" className={styles.applyBtn} onClick={applyToWeekdays}>
                              Apply to Mon-Fri
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>
              {formErrors.length > 0 && (
                <ul className={styles.errorList}>
                  {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              )}
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