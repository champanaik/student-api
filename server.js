const http = require('http');

let students = [];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // GET /students/:id (Get single student)
  if (url.startsWith('/students/') && method === 'GET') {
    const id = url.split('/')[2];

    const student = students.find(s => s.id === id);

    if (!student) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        message: "Student not found"
      }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(student));
  }

  // GET /students (Get all students)
  else if (url === '/students' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(students));
  }

  // POST /students
  else if (url === '/students' && method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);
      const { name, email, course, year } = data;

      if (!name || !email || !course || !year) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: "All fields required"
        }));
      }

      const newStudent = {
        id: Date.now().toString(),
        name,
        email,
        course,
        year
      };

      students.push(newStudent);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: newStudent
      }));
    });
  }

  // PUT /students/:id
  else if (url.startsWith('/students/') && method === 'PUT') {
    const id = url.split('/')[2];
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);

      const student = students.find(s => s.id === id);

      if (!student) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: "Student not found"
        }));
      }

      student.name = data.name || student.name;
      student.email = data.email || student.email;
      student.course = data.course || student.course;
      student.year = data.year || student.year;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: student
      }));
    });
  }

  // DELETE /students/:id
  else if (url.startsWith('/students/') && method === 'DELETE') {
    const id = url.split('/')[2];

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        message: "Student not found"
      }));
    }

    students.splice(index, 1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: "Student deleted"
    }));
  }

  // Route not found
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: "Route not found"
    }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});