import { useEffect, useState } from 'react';
import './ProgressBar.css';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'primary',
  animated = true,
  className = '',
}) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`progress ${className}`}>
      {(label || showValue) && (
        <div className="progress__header">
          {label && <span className="progress__label">{label}</span>}
          {showValue && (
            <span className="progress__value">
              {value}/{max} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className={`progress__track progress__track--${size}`}>
        <div
          className={`progress__fill progress__fill--${variant} ${animated ? 'progress__fill--animated' : ''}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
