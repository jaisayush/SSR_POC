const express = require('express');
const app = express();
app.use(express.json());

// School data structure
const schoolData = {
  totalStudents: 2,
  classes: {
    1: {
      students: [
        { name: 'Alex Johnson', age: 6, sex: 'M' },
        { name: 'Emily Smith', age: 7, sex: 'F' }
      ],
      totalStudents: 2
    },
    2: {
      students: [
        { name: 'Ryan Williams', age: 7, sex: 'M' },
        { name: 'Sophia Brown', age: 8, sex: 'F' }
      ],
      totalStudents: 2
    },
    3: {
      students: [
        { name: 'Ethan Davis', age: 8, sex: 'M' },
        { name: 'Olivia Miller', age: 8, sex: 'F' }
      ],
      totalStudents: 2
    }
  }
};


// Route to add a student to a class
app.post('/newstudent', (req, res) => {
  const { classId, name, age, sex } = req.body;

  // Check if classId is provided
  if (!classId || !name || !age || !sex) {
    return res.status(400).json({ message: 'classId, name, age, and sex are required in the request body' });
  }

  // Check if the class exists in schoolData, if not create it
  if (!schoolData.classes[classId]) {
    schoolData.classes[classId] = {
      students: [],
      totalStudents: 0
    };
  }

  // Add the student to the specified class
  const newStudent = { name, age, sex };
  schoolData.classes[classId].students.push(newStudent);
  schoolData.classes[classId].totalStudents++;
  schoolData.totalStudents++; // Increment total students at the school level

  // Simulate a delay of 5 seconds before sending the response
  setTimeout(() => {
    res.status(201).json({ message: 'Student added successfully', newStudent });
  }, 5000); // 5000 milliseconds (5 seconds)
});

// Route to get student data by class ID
app.get('/students/:classId', (req, res) => {
  const { classId } = req.params;

  // Check if the class exists in schoolData
  if (!schoolData.classes[classId]) {
    return res.status(404).json({ message: `Class ${classId} not found` });
  }

  // Retrieve students for the specified class
  const { students } = schoolData.classes[classId];

  // Simulate a delay of 5 seconds before sending the response
  setTimeout(() => {
    res.status(200).json(students);
  }, 5000); // 5000 milliseconds (5 seconds)
});

// Route to get all student data with class information
app.get('/allstudents', (req, res) => {
  const allStudents = [];

  // Loop through each class and gather student data
  Object.keys(schoolData.classes).forEach(classId => {
    const { students } = schoolData.classes[classId];
    students.forEach(student => {
      allStudents.push({
        ...student,
        className: `Class ${classId}`
      });
    });
  });

  // Simulate a delay of 5 seconds before sending the response
  setTimeout(() => {
    res.status(200).json(allStudents);
  }, 5000); // 5000 milliseconds (5 seconds)
});

// Route to get refined statistics for each class
app.get('/stats/classes', (req, res) => {
  const classStats = {};

  // Loop through each class to calculate statistics
  Object.keys(schoolData.classes).forEach(classId => {
    const { students, totalStudents } = schoolData.classes[classId];
    const maleStudents = students.filter(student => student.sex === 'M').length;
    const femaleStudents = students.filter(student => student.sex === 'F').length;
    const averageAge = totalStudents > 0 ? students.reduce((sum, student) => sum + student.age, 0) / totalStudents : 0;

    classStats[`Class ${classId}`] = {
      totalStudents,
      maleStudents,
      femaleStudents,
      averageAge: totalStudents > 0 ? averageAge : undefined // Only include average age if there are students
    };
  });

  // Simulate a delay of 5 seconds before sending the response
  setTimeout(() => {
    res.status(200).json(classStats);
  }, 5000); // 5000 milliseconds (5 seconds)
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
