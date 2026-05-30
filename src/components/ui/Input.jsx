import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  suffix,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {Icon && <Icon size={16} className="input-icon" />}
        <input
          ref={ref}
          type={type}
          className={`input ${Icon ? 'input--has-icon' : ''} ${suffix ? 'input--has-suffix' : ''}`}
          {...props}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="input-error">{error}</span>}
      {hint && !error && <span className="input-hint">{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

export function Textarea({ label, error, hint, className = '', ...props }) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <textarea className="input input--textarea" {...props} />
      {error && <span className="input-error">{error}</span>}
      {hint && !error && <span className="input-hint">{hint}</span>}
    </div>
  );
}

export function Select({ label, error, hint, options = [], placeholder, className = '', ...props }) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <select className="input input--select" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="input-error">{error}</span>}
      {hint && !error && <span className="input-hint">{hint}</span>}
    </div>
  );
}
