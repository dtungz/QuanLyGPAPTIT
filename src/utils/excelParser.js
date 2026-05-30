import * as xlsx from 'xlsx';

export async function parsePTITExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        const semesters = [];
        const courses = [];
        
        let currentSemesterId = null;
        let semCounter = 1;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const firstCell = String(row[0]).trim();

          // Detect semester header
          if (firstCell.startsWith('Học kỳ')) {
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
            const code = row[1];
            const name = row[3];
            const credits = row[4];
            const finalScore = parseFloat(row[5]);
            const totalScore = parseFloat(row[6]);

            let midtermScore = null;
            let attScore = null;
            let weights = { attendance: 10, midterm: 20, final: 70, other: 0 };

            if (!isNaN(finalScore) && !isNaN(totalScore)) {
              let m = (totalScore - 0.7 * finalScore) / 0.3;
              if (m >= -0.1 && m <= 10.1) {
                 midtermScore = m;
                 attScore = m;
              } else {
                 m = (totalScore - 0.6 * finalScore) / 0.4;
                 if (m >= -0.1 && m <= 10.1) {
                    midtermScore = m;
                    attScore = m;
                    weights = { attendance: 10, midterm: 30, final: 60, other: 0 };
                 } else {
                    m = (totalScore - 0.5 * finalScore) / 0.5;
                    if (m >= -0.1 && m <= 10.1) {
                       midtermScore = m;
                       attScore = m;
                       weights = { attendance: 20, midterm: 30, final: 50, other: 0 };
                    } else {
                       m = (totalScore - 0.8 * finalScore) / 0.2;
                       if (m >= -0.1 && m <= 10.1) {
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
                attendance: attScore !== null ? Math.max(0, Math.min(10, parseFloat(attScore.toFixed(1)))) : null,
                midterm: midtermScore !== null ? Math.max(0, Math.min(10, parseFloat(midtermScore.toFixed(1)))) : null,
                final: !isNaN(finalScore) ? finalScore : null,
                other: []
              },
              weights: weights,
              schedule: { dayOfWeek: '', startTime: '', endTime: '', room: '', teacher: '' }
            };
            courses.push(course);
          }
        }

        resolve({ semesters, courses });
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
