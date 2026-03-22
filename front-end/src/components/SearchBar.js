import styles from './SearchBar.module.css';

/**
 * SearchBar
 * Props:
 *   value          – current search string
 *   onChange        – change handler for search input
 *   filterOptions  – array of filter label strings
 *   activeFilters  – array of currently active filter labels
 *   onToggleFilter – handler called with filter label to toggle it
 */
export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search spots..."
            value={value}
            onChange={onChange}
          />
        </div>
        <button
          className={styles.filterBtn}
          disabled
        >
          <FilterIcon />
          Filter
        </button>
      </div>
    </div>
  );
}

/* ── Inline icon components ── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
