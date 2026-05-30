import './Badge.css';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon: Icon,
  color,
  className = '',
}) {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot && 'badge--dot',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} style={color ? { '--badge-color': color } : undefined}>
      {dot && <span className="badge__dot" />}
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
