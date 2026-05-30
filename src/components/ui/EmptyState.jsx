import './EmptyState.css';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon,
}) {
  return (
    <div className="empty-state animate-fade-in-up">
      {Icon && (
        <div className="empty-state__icon">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} icon={actionIcon} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
