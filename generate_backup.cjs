const xlsx = require('xlsx');
const fs = require('fs');

const path = 'C:\\Users\\Admin\\Downloads\\DiemThi\\DiemThi.xlsx';
const outputPath = 'F:\\Git\\AppQuanLyGPA\\gpa-backup-ptit.json';

try {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  const semesters = [];
  const courses = [];
  
  let currentSemesterId = null;
  let semCounter = 1;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0]).trim();

    // Detect semester header
    if (firstCell.startsWith('Học kỳ')) {
      // e.g. "Học kỳ 1 - Năm học 2025 - 2026"
      const nameMatch = firstCell.match(/Học kỳ \d+/);
      const yearMatch = firstCell.match(/\d{4} - \d{4}/);
      
      const semId = `sem_${Date.now()}_${semCounter++}`;
      currentSemesterId = semId;
      
      semesters.push({
        id: semId,
        name: nameMatch ? nameMatch[0] : 'Học kỳ',
        year: yearMatch ? yearMatch[0] : '',
        targetGPA: 3.0,
        startDate: '',
        endDate: ''
      });
      continue;
    }

    // Detect course row
    if (typeof row[0] === 'number' && currentSemesterId) {
      // 0: STT, 1: Mã, 2: Nhóm, 3: Tên, 4: TC, 5: Thi, 6: TK(10), 7: TK(4), 8: Chữ
      const code = row[1];
      const name = row[3];
      const credits = row[4];
      const finalScore = parseFloat(row[5]);
      const totalScore = parseFloat(row[6]);

      // Calculate missing midterm if total is available
      let midtermScore = null;
      let attScore = null;
      let weights = { attendance: 10, midterm: 20, final: 70, other: 0 };
      let finalWeight = 0.7;

      if (!isNaN(finalScore) && !isNaN(totalScore)) {
        // Try 70% final
        let m = (totalScore - 0.7 * finalScore) / 0.3;
        if (m >= 0 && m <= 10) {
           midtermScore = m;
           attScore = m; // equal distribution
        } else {
           // Try 60% final
           m = (totalScore - 0.6 * finalScore) / 0.4;
           if (m >= 0 && m <= 10) {
              midtermScore = m;
              attScore = m;
              weights = { attendance: 10, midterm: 30, final: 60, other: 0 };
           } else {
              // Try 50% final
              m = (totalScore - 0.5 * finalScore) / 0.5;
              if (m >= 0 && m <= 10) {
                 midtermScore = m;
                 attScore = m;
                 weights = { attendance: 20, midterm: 30, final: 50, other: 0 };
              } else {
                 // Try 80% final
                 m = (totalScore - 0.8 * finalScore) / 0.2;
                 if (m >= 0 && m <= 10) {
                    midtermScore = m;
                    attScore = m;
                    weights = { attendance: 10, midterm: 10, final: 80, other: 0 };
                 }
              }
           }
        }
      }

      const course = {
        id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        semesterId: currentSemesterId,
        code: code,
        name: name,
        credits: parseInt(credits) || 0,
        status: !isNaN(totalScore) ? 'completed' : 'in-progress',
        grades: {
          attendance: attScore !== null ? parseFloat(attScore.toFixed(1)) : null,
          midterm: midtermScore !== null ? parseFloat(midtermScore.toFixed(1)) : null,
          final: !isNaN(finalScore) ? finalScore : null,
          other: []
        },
        weights: weights,
        schedule: {
          dayOfWeek: '',
          startTime: '',
          endTime: '',
          room: '',
          teacher: ''
        }
      };
      
      courses.push(course);
    }
  }

  const exportData = {
    settings: {
      darkMode: true,
      totalCreditsRequired: 150,
      gradeScale: {
        id: 'ptit',
        name: 'PTIT (A+, A, B+, B, C+, C, D+, D, F)',
        type: 'preset',
        scale: [
          { letter: 'A+', minScore: 9.0, maxScore: 10.0, gpa4: 4.0, classification: 'Xuất sắc' },
          { letter: 'A', minScore: 8.5, maxScore: 8.9, gpa4: 3.7, classification: 'Giỏi' },
          { letter: 'B+', minScore: 8.0, maxScore: 8.4, gpa4: 3.5, classification: 'Khá' },
          { letter: 'B', minScore: 7.0, maxScore: 7.9, gpa4: 3.0, classification: 'Khá' },
          { letter: 'C+', minScore: 6.5, maxScore: 6.9, gpa4: 2.5, classification: 'Trung bình' },
          { letter: 'C', minScore: 5.5, maxScore: 6.4, gpa4: 2.0, classification: 'Trung bình' },
          { letter: 'D+', minScore: 5.0, maxScore: 5.4, gpa4: 1.5, classification: 'Trung bình yếu' },
          { letter: 'D', minScore: 4.0, maxScore: 4.9, gpa4: 1.0, classification: 'Trung bình yếu' },
          { letter: 'F', minScore: 0.0, maxScore: 3.9, gpa4: 0.0, classification: 'Kém' }
        ]
      }
    },
    semesters: semesters,
    courses: courses,
    attendance: [],
    scheduleNotes: []
  };

  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  console.log('Successfully generated JSON backup at ' + outputPath);

} catch (e) {
  console.error("Error generating JSON:", e.message);
}
