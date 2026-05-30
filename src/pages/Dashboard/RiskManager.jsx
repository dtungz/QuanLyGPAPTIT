import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { RISK_LEVELS } from '../../utils/constants';
import './RiskManager.css';

export default function RiskManager({ analysis, semester }) {
  if (!semester || !analysis.courses.length) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle icon={ShieldAlert}>Quản trị rủi ro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="risk-empty">Chưa có môn học đang diễn ra để phân tích.</p>
        </CardContent>
      </Card>
    );
  }

  const { summary } = analysis;

  return (
    <Card padding="lg">
      <CardHeader
        actions={
          <div className="risk-badges">
            {summary.dangerCount > 0 && <Badge variant="danger">🔴 {summary.dangerCount}</Badge>}
            {summary.warningCount > 0 && <Badge variant="warning">🟡 {summary.warningCount}</Badge>}
            {summary.safeCount > 0 && <Badge variant="success">🟢 {summary.safeCount}</Badge>}
          </div>
        }
      >
        <CardTitle icon={ShieldAlert}>Quản trị rủi ro - {semester.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="risk-list">
          {analysis.courses.map(({ course, risk }) => {
            const config = RISK_LEVELS[risk.level] || {};
            return (
              <div key={course.id} className="risk-item" style={{ '--risk-color': config.color }}>
                <div className="risk-item__header">
                  <span className="risk-item__icon">{config.icon || '❓'}</span>
                  <div className="risk-item__info">
                    <span className="risk-item__name">{course.name}</span>
                    <span className="risk-item__code">{course.code} • {course.credits} tín chỉ</span>
                  </div>
                  <Badge
                    variant={risk.level === 'danger' ? 'danger' : risk.level === 'warning' ? 'warning' : 'success'}
                    size="sm"
                  >
                    {config.label || 'Chưa rõ'}
                  </Badge>
                </div>
                <p className="risk-item__message">{risk.message}</p>
                {risk.minToPass != null && risk.minToPass <= 10 && (
                  <div className="risk-item__scores">
                    <span>Để qua: <strong>{risk.minToPass.toFixed(1)}</strong></span>
                    {risk.minForC && risk.minForC <= 10 && <span>Đạt C: <strong>{risk.minForC.toFixed(1)}</strong></span>}
                    {risk.minForB && risk.minForB <= 10 && <span>Đạt B: <strong>{risk.minForB.toFixed(1)}</strong></span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
