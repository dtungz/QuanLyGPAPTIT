import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { getClassification } from '../../utils/gpaCalculator';
import { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './GPASummaryCard.css';

function AnimatedNumber({ value, decimals = 2, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = display;
    const end = value;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    }

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span>{display.toFixed(decimals)}</span>;
}

export default function GPASummaryCard({ cumulative, previousGPA, semesterGPAs }) {
  const classification = getClassification(cumulative.gpa4);
  const diff = previousGPA != null ? cumulative.gpa4 - previousGPA : null;

  const chartData = semesterGPAs.map((sem, i) => ({
    name: sem.name || `K${i + 1}`,
    gpa4: sem.gpa4 || 0,
    gpa10: sem.gpa10 || 0,
  }));

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle icon={Award}>GPA Tích luỹ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="gpa-summary">
          <div className="gpa-summary__main">
            <div className="gpa-summary__score">
              <span className="gpa-summary__number text-gradient">
                <AnimatedNumber value={cumulative.gpa4 || 0} />
              </span>
              <span className="gpa-summary__scale">/ 4.0</span>
            </div>
            <div className="gpa-summary__score gpa-summary__score--secondary">
              <span className="gpa-summary__number--sm">
                <AnimatedNumber value={cumulative.gpa10 || 0} />
              </span>
              <span className="gpa-summary__scale">/ 10</span>
            </div>
          </div>

          <div className="gpa-summary__meta">
            <span
              className="gpa-summary__classification"
              style={{ color: classification.color }}
            >
              {classification.label}
            </span>

            {diff !== null && (
              <span className={`gpa-summary__trend ${diff > 0 ? 'trend--up' : diff < 0 ? 'trend--down' : 'trend--neutral'}`}>
                {diff > 0 ? <TrendingUp size={14} /> : diff < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                {diff > 0 ? '+' : ''}{diff.toFixed(2)} so với kỳ trước
              </span>
            )}

            <span className="gpa-summary__credits">
              Tổng: {cumulative.totalCredits} tín chỉ
            </span>
          </div>
        </div>

        {chartData.length > 1 && (
          <div className="gpa-chart">
            <h4 className="gpa-chart__title">Biểu đồ GPA qua các kỳ</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[0, 4]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gpa4"
                  stroke="url(#gpaGradient)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: 'var(--color-primary-light)' }}
                  name="GPA (hệ 4)"
                />
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-secondary)" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
