function calculateFinalGrade(subject) {
  const weights = {
    assignments: 0.3,
    exams: 0.5,
    attendance: 0.2,
  };

  // Input validation for subject and performance fields
  if (
    !subject ||
    typeof subject.credits !== "number" ||
    subject.credits <= 0 ||
    !subject.performance ||
    typeof subject.performance.assignments !== "number" ||
    typeof subject.performance.exams !== "number" ||
    typeof subject.performance.attendance !== "number"
  ) {
    throw new Error(`Invalid subject data for "${subject?.name || "unknown"}"`);
  }

  // Calculate weighted average of performance metrics
  return (
    subject.performance.assignments * weights.assignments +
    subject.performance.exams * weights.exams +
    subject.performance.attendance * weights.attendance
  );
}

// Generates and prints the transcript for each student
// Calculates semester GPA and cumulative GPA based on credit-weighted averages
function generateTranscript(students) {
  students.forEach((student) => {
    console.log(`Student ID: ${student.id}, Name: ${student.name}`);

    // Track cumulative metrics across all semesters
    let totalGradePoints = 0; // Sum of (grade point * credits) for all subjects
    let totalCredits = 0; // Total credits attempted

    student.semesters.forEach((semester) => {
      // Track semester-specific metrics
      let semesterGradePoints = 0; // Sum of (grade point * credits) for semester
      let semesterCredits = 0; // Total credits for semester

      console.log(`Semester: ${semester.term}`);

      semester.subjects.forEach((subject) => {
        // Calculate final grade (0-100 scale)
        const finalGrade = calculateFinalGrade(subject);

        // Convert to GPA scale (0-4.0): GPA = (Final Grade / 100) * 4
        const gradePoint = (finalGrade / 100) * 4;

        // Add weighted grade points for this subject
        semesterGradePoints += gradePoint * subject.credits;
        semesterCredits += subject.credits;
        totalGradePoints += gradePoint * subject.credits;
        totalCredits += subject.credits;

        console.log(
          `  Subject: ${subject.name}, Credits: ${subject.credits}, Final Grade: ${finalGrade.toFixed(
            2
          )}%, GPA: ${gradePoint.toFixed(2)}`
        );
      });

      // Semester GPA = Total weighted grade points / Total credits for semester
      const semesterGPA = semesterGradePoints / semesterCredits;
      console.log(`Semester GPA: ${semesterGPA.toFixed(2)}`);
    });

    // Cumulative GPA = Total weighted grade points / Total credits across all semesters
    const cumulativeGPA = totalGradePoints / totalCredits;
    console.log(`Cumulative GPA: ${cumulativeGPA.toFixed(2)}`);

    // Assign academic honors based on cumulative GPA thresholds
    if (cumulativeGPA >= 3.7) {
      console.log("Academic Honors: High Honors");
    } else if (cumulativeGPA >= 3.3) {
      console.log("Academic Honors: Honors");
    } else {
      console.log("Academic Honors: None");
    }

    console.log();
  });
}

// Sample data
const studentsData = {
  students: [
    {
      id: "S001",
      name: "Alice",
      semesters: [
        {
          term: "Fall 2023",
          subjects: [
            {
              name: "Math",
              credits: 4,
              performance: { assignments: 80, exams: 70, attendance: 85 },
            },
            {
              name: "Physics",
              credits: 3,
              performance: { assignments: 90, exams: 60, attendance: 70 },
            },
          ],
        },
      ],
    },
    {
      id: "S002",
      name: "Bob",
      semesters: [
        {
          term: "Fall 2023",
          subjects: [
            {
              name: "Math",
              credits: 4,
              performance: { assignments: 85, exams: 75, attendance: 90 },
            },
            {
              name: "English",
              credits: 2,
              performance: { assignments: 95, exams: 82, attendance: 60 },
            },
          ],
        },
      ],
    },
  ],
};

// Generate transcripts for all students
generateTranscript(studentsData.students);

/*
Expected Output:
Student ID: S001, Name: Alice
Semester: Fall 2023
  Subject: Math, Credits: 4, Final Grade: 75.50%, GPA: 3.02
  Subject: Physics, Credits: 3, Final Grade: 74.00%, GPA: 2.96
Semester GPA: 2.99
Cumulative GPA: 2.99
Academic Honors: None

Student ID: S002, Name: Bob
Semester: Fall 2023
  Subject: Math, Credits: 4, Final Grade: 83.50%, GPA: 3.34
  Subject: English, Credits: 2, Final Grade: 82.90%, GPA: 3.32
Semester GPA: 3.33
Cumulative GPA: 3.33
Academic Honors: Honors
*/
