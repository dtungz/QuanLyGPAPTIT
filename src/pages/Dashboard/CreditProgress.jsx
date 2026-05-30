import { BookOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './CreditProgress.css';

export default function CreditProgress({ completed, total }) {
  if (!total) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle icon={BookOpen}>Tiến độ tín chỉ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="credit-hint">Vào Cài đặt để nhập tổng tín chỉ yêu cầu tốt nghiệp.</p>
        </CardContent>
      </Card>
    );
  }

  const remaining = Math.max(total - completed, 0);
  const percentage = Math.round((completed / total) * 100);

  const pieData = [
    { name: 'Hoàn thành', value: completed },
    { name: 'Còn lại', value: remaining },
  ];

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle icon={BookOpen}>Tiến độ tín chỉ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="credit-chart">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="var(--color-primary)" />
                <Cell fill="var(--bg-surface-active)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="credit-chart__center">
            <span className="credit-chart__percent">{percentage}%</span>
          </div>
        </div>

        <ProgressBar
          value={completed}
          max={total}
          label="Tín chỉ"
          size="md"
          variant="primary"
        />

        <div className="credit-stats">
          <div className="credit-stat">
            <span className="credit-stat__label">Hoàn thành</span>
            <span className="credit-stat__value" style={{ color: 'var(--color-success)' }}>{completed}</span>
          </div>
          <div className="credit-stat">
            <span className="credit-stat__label">Còn lại</span>
            <span className="credit-stat__value" style={{ color: 'var(--color-warning)' }}>{remaining}</span>
          </div>
          <div className="credit-stat">
            <span className="credit-stat__label">Tổng</span>
            <span className="credit-stat__value">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
