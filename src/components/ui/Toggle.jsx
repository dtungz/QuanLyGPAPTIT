import './Toggle.css';

export default function Toggle({ checked, onChange, label, size = 'md' }) {
  return (
    <label className={`toggle toggle--${size}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle__input"
      />
      <span className="toggle__slider" />
      {label && <span className="toggle__label">{label}</span>}
    </label>
  );
}
