import Badge from '../../components/ui/Badge';
import { getClassification } from '../../utils/gpaCalculator';
import './SemesterList.css';

export default function SemesterList({ semesters, semesterGPAs, selectedId, onSelect }) {
  return (
    <div className="semester-tabs">
      {semesters.map((sem) => {
        const gpaData = semesterGPAs.find(s => s.id === sem.id);
        const isSelected = sem.id === selectedId;
        const classification = gpaData ? getClassification(gpaData.gpa4) : null;

        return (
          <button
            key={sem.id}
            className={`semester-tab ${isSelected ? 'semester-tab--active' : ''}`}
            onClick={() => onSelect(sem.id)}
          >
            <span className="semester-tab__name">{sem.name}</span>
            <span className="semester-tab__year">{sem.year}</span>
            {gpaData && gpaData.gpa4 > 0 && (
              <div className="semester-tab__gpa">
                <span className="semester-tab__gpa-value" style={{ color: classification?.color }}>
                  {gpaData.gpa4.toFixed(2)}
                </span>
                <Badge variant={gpaData.gpa4 >= 3.2 ? 'success' : gpaData.gpa4 >= 2.0 ? 'warning' : 'danger'} size="sm">
                  {gpaData.totalCredits} TC
                </Badge>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
