import { forwardRef } from 'react';
import './Card.css';

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'glass', 
  padding = 'md',
  hover = true,
  glow = false,
  onClick,
  style,
  ...props 
}, ref) => {
  const classes = [
    'card',
    `card--${variant}`,
    `card--pad-${padding}`,
    hover && 'card--hover',
    glow && 'card--glow',
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} onClick={onClick} style={style} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export function CardHeader({ children, className = '', actions }) {
  return (
    <div className={`card-header ${className}`}>
      <div className="card-header__content">{children}</div>
      {actions && <div className="card-header__actions">{actions}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '', icon: Icon }) {
  return (
    <h3 className={`card-title ${className}`}>
      {Icon && <Icon size={20} className="card-title__icon" />}
      {children}
    </h3>
  );
}

export function CardDescription({ children }) {
  return <p className="card-description">{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

export default Card;
