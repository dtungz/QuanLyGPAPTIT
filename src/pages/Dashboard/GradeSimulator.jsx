import { useState, useMemo } from 'react';
import { FlaskConical } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAppContext } from '../../context/AppContext';
import { simulateGrades, generateScenarios } from '../../utils/gradeSimulator';
import './GradeSimulator.css';

export default function GradeSimulator({ semester }) {
  const { courses, settings } = useAppContext();
  const semCourses = courses.filter(c => c.semesterId === semester?.id && c.status === 'in-progress');
  const [simulations, setSimulations] = useState({});
  const [scenario, setScenario] = useState('realistic');

  const applyScenario = (type) => {
    setScenario(type);
    const newSims = {};
    semCourses.forEach(course => {
      const scenarios = generateScenarios(course);
      newSims[course.id] = scenarios[type];
    });
    setSimulations(newSims);
  };

  const result = useMemo(() => {
    if (Object.keys(simulations).length === 0) return null;
    return simulateGrades(semCourses, simulations, settings.gradeScale);
  }, [simulations, semCourses, settings.gradeScale]);

  if (!semester || semCourses.length === 0) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle icon={FlaskConical}>Giả lập điểm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="sim-empty">Chưa có môn đang học để giả lập.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle icon={FlaskConical}>Giả lập điểm - {semester.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="sim-scenarios">
          {['best', 'realistic', 'worst'].map(type => (
            <button
              key={type}
              className={`sim-scenario-btn ${scenario === type ? 'sim-scenario-btn--active' : ''}`}
              onClick={() => applyScenario(type)}
            >
              {type === 'best' ? '🌟 Tốt nhất' : type === 'realistic' ? '📊 Thực tế' : '⚠️ Xấu nhất'}
            </button>
          ))}
        </div>

        {result && (
          <div className="sim-result">
            <div className="sim-result__gpa">
              <span className="sim-result__label">GPA dự kiến:</span>
              <span className="sim-result__value text-gradient">{result.gpa4.toFixed(2)}</span>
              <span className="sim-result__scale10">({result.gpa10.toFixed(2)} / 10)</span>
            </div>

            <div className="sim-courses">
              {result.courses.map(c => (
                <div key={c.id} className="sim-course">
                  <span className="sim-course__name">{c.name}</span>
                  <span className="sim-course__grade">
                    {c.calculatedScore10?.toFixed(1)} → {c.letterGrade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
