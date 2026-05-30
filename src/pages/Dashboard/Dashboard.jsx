import { LayoutDashboard } from 'lucide-react';
import { useGPA } from '../../hooks/useGPA';
import { useRiskAnalysis } from '../../hooks/useRiskAnalysis';
import { useSemester } from '../../hooks/useSemester';
import GPASummaryCard from './GPASummaryCard';
import CreditProgress from './CreditProgress';
import TargetGPA from './TargetGPA';
import RiskManager from './RiskManager';
import GradeSimulator from './GradeSimulator';
import './Dashboard.css';

export default function Dashboard() {
  const { cumulative, semesterGPAs, completedCredits, totalCreditsRequired } = useGPA();
  const { currentSemester } = useSemester();
  const riskAnalysis = useRiskAnalysis(currentSemester?.id);

  const previousGPA = semesterGPAs.length >= 2
    ? semesterGPAs[semesterGPAs.length - 2]?.gpa4
    : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          <LayoutDashboard size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
          Tổng quan
        </h1>
        <p>Theo dõi tiến độ học tập và GPA của bạn</p>
      </div>

      <div className="dashboard-grid stagger-children">
        <div className="dashboard-grid__main">
          <GPASummaryCard
            cumulative={cumulative}
            previousGPA={previousGPA}
            semesterGPAs={semesterGPAs}
          />
          <RiskManager analysis={riskAnalysis} semester={currentSemester} />
          <GradeSimulator semester={currentSemester} />
        </div>

        <div className="dashboard-grid__side">
          <CreditProgress
            completed={completedCredits}
            total={totalCreditsRequired}
          />
          <TargetGPA
            cumulative={cumulative}
            completedCredits={completedCredits}
          />
        </div>
      </div>
    </div>
  );
}
