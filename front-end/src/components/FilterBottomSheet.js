import { useState } from 'react';
import styles from './FilterBottomSheet.module.css';

const FILTER_GROUPS = [
  { key: 'noiseLevel', label: 'Noise Level', options: ['Quiet', 'Moderate', 'Loud'] },
  { key: 'outlets', label: 'Outlets', options: ['Yes', 'No'] },
  { key: 'wifi', label: 'Wi-Fi', options: ['Yes', 'No'] },
  { key: 'busyness', label: 'Busyness', options: ['Quiet', 'Moderate', 'Busy'] },
];

const EMPTY_FILTERS = { noiseLevel: '', outlets: '', wifi: '', busyness: '' };

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  initialFilters = EMPTY_FILTERS,
}) {
  const [selected, setSelected] = useState(initialFilters);

  function handleSelect(key, value) {
    setSelected(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  }

  function handleApply() {
    onApply(selected);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h2 className={styles.title}>Filters</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {FILTER_GROUPS.map(({ key, label, options }) => (
          <div key={key} className={styles.section}>
            <h3 className={styles.sectionTitle}>{label}</h3>
            <div className={styles.radioGroup}>
              {options.map(option => (
                <label key={option} className={styles.radioLabel}>
                  <span
                    className={`${styles.radio} ${selected[key] === option ? styles.radioActive : ''}`}
                  />
                  <input
                    type="radio"
                    name={key}
                    value={option}
                    checked={selected[key] === option}
                    onChange={() => handleSelect(key, option)}
                    className={styles.radioInput}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button className={styles.applyBtn} onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
