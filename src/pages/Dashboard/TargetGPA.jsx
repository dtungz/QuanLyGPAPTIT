import { useState } from 'react';
import { Target } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { calculateNeededGPA } from '../../utils/gradeSimulator';
import { useAppContext } from '../../context/AppContext';
import './TargetGPA.css';

export default function TargetGPA({ cumulative, completedCredits }) {
  const { courses } = useAppContext();
  const [targetGPA, setTargetGPA] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');

  const neededGPA = targetGPA && remainingCredits
    ? calculateNeededGPA(
        completedCredits,
        cumulative.gpa4,
        parseFloat(targetGPA),
        parseInt(remainingCredits)
      )
    : null;

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle icon={Target}>GPA Mục tiêu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="target-form">
          <Input
            label="GPA mục tiêu (hệ 4)"
            type="number"
            min="0"
            max="4"
            step="0.1"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e.target.value)}
            placeholder="Ví dụ: 3.5"
          />
          <Input
            label="Tín chỉ còn lại"
            type="number"
            min="1"
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            placeholder="Ví dụ: 45"
          />
        </div>

        {neededGPA !== null && (
          <div className="target-result">
            <span className="target-result__label">GPA cần đạt các kỳ còn lại:</span>
            <span className={`target-result__value ${
              neededGPA > 4 ? 'target--impossible' :
              neededGPA > 3.5 ? 'target--hard' :
              neededGPA > 2.5 ? 'target--medium' : 'target--easy'
            }`}>
              {neededGPA > 4 ? 'Không khả thi' : neededGPA.toFixed(2)}
            </span>
            {neededGPA <= 4 && neededGPA > 0 && (
              <span className="target-result__hint">
                {neededGPA > 3.5 ? '⚠️ Rất thách thức' :
                 neededGPA > 2.5 ? '💪 Cố gắng lên!' : '✅ Hoàn toàn khả thi'}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
