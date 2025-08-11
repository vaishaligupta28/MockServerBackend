const express = require('express');
const app = express();
const port = process.env.port || 4000;


app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Mock Server!');
});

// LMS API POST
app.post('/lms/submit', (req, res) => {
  const error500 = req.query.error500;
  const error503 = req.query.error503;
  const error429 = req.query.error429;
  const timeout = req.query.timeout;

  // Timeout simulation - delay response
  if (timeout === 'true') {
    console.log('⏰ Simulating timeout - delaying response by 15 seconds');
    setTimeout(() => {
      res.status(200).json({
        message: 'LMS api responded after after long delay',
        delayed: true,
        delayedAt: new Date().toISOString()
      });
    }, 15000); // 15 second delay
    return;
  }


  // 500 error simulation
  if (error500 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(500).json({ error: 'Internal server error (mocked)' });
  }

  // 503 error simulation
  if (error503 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(503).json({ error: 'Service unavailable error (mocked)' });
  }


  // 429 error simulation
  if (error429 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(429).json({ error: 'Rate Limit (mocked)' });
  }

  const {
    studentId,
    studentName,
    courseId,
    courseName,
    assignmentId,
    assignmentName,
    score,
    maxScore,
    status,
    completedAt,
    metadata
  } = req.body || {};

  // 400 Bad Request if required fields missing
  if (!studentId) {
    console.warn('⚠️ Missing required fields');
    return res.status(400).json({
      error: 'Bad Request: studentId and courseId are required',
    });
  }

  console.log('✅ Received LMS submission');
  res.status(200).json({
    message: 'LMS submission received successfully',
    submittedAt: new Date().toISOString(),
    data: {
      studentId,
      studentName,
      courseId,
      courseName,
      assignmentId,
      assignmentName,
      score,
      maxScore,
      status,
      completedAt,
      metadata
    }
  });
});

app.post('/opensearch/logs/my-index/_doc', (req, res) => {
  const timeout = req.query.timeout;
  // Timeout simulation - delay response
  if (timeout === 'true') {
    console.log('⏰ Simulating timeout - delaying response by 15 seconds');
    setTimeout(() => {
      res.status(200).json({
        message: 'OpenSearch logs responded after long delay',
        delayed: true,
        delayedAt: new Date().toISOString()
      });
    }, 15000); // 15 second delay
    return;
  }

  const error500 = req.query.error500;
  const error503 = req.query.error503;
  const error429 = req.query.error429;
  // 500 error simulation
  if (error500 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(500).json({ error: 'Internal server error (mocked)' });
  }

  // 503 error simulation
  if (error503 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(503).json({ error: 'Service unavailable error (mocked)' });
  }


  // 429 error simulation
  if (error429 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(429).json({ error: 'Rate Limit (mocked)' });
  }

  const logPayload = req.body;

  // Required fields in the new structure
  const requiredFields = [
    'message'
  ];

  const missingFields = requiredFields.filter(field => !logPayload[field]);

  if (missingFields.length > 0) {
    console.warn('⚠️  Missing OpenSearch log fields:', missingFields);
    return res.status(400).json({
      error: 'Missing required OpenSearch log fields',
      missingFields
    });
  }

  console.log('✅ OpenSearch log received:', JSON.stringify(logPayload, null, 2));
  return res.status(200).json({
    message: 'Log successfully indexed into OpenSearch (mocked)',
    received: logPayload
  });
});

// Connect API GET with userEmail path param
app.get('/connect/mapping', (req, res) => {
  const userEmail = req.query.userEmail;
  const timeout = req.query.timeout;
  const responseType = req.query.type; // 'type1' or 'type2'

  // Timeout simulation
  if (timeout === 'true') {
    console.log('⏰ Simulating timeout - delaying response by 15 seconds');
    setTimeout(() => {
      res.status(200).json({
        message: 'Connect GET api responded after long delay',
        delayed: true,
        delayedAt: new Date().toISOString(),
        userEmail: responseType === 'type2' ? userEmail : 'jane.doe@example.com'
      });
    }, 15000);
    return;
  }

  // Error simulations
  if (req.query.error500 === 'true') {
    console.error('❌ Simulated 500 error');
    return res.status(500).json({ error: 'Internal server error (mocked)' });
  }
  if (req.query.error503 === 'true') {
    console.error('❌ Simulated 503 error');
    return res.status(503).json({ error: 'Service unavailable error (mocked)' });
  }
  if (req.query.error429 === 'true') {
    console.error('❌ Simulated 429 error');
    return res.status(429).json({ error: 'Rate Limit (mocked)' });
  }

  // Base response
  const response = {
    message: "Fetched connect API Response[mocked]",
    summary: {
      connectId: "connect-123456",
      districtId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user100",
      userEmail: responseType === 'type2' ? userEmail : "jane.doe@example.com",
      assignmentId: "http://example.com/activities/quiz-123",
      courseId: "http://example.com/activities/course-456",
      score: "85/100",
      status: "SUCCESS",
      submittedAt: "2023-10-15T14:30:00Z"
    },
    metadata: {
      section: "Section A",
      term: "Fall 2023",
      timeSpent: "PT30M"
    },
    received: {
      connectId: "connect-123456",
      districtId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user100",
      userName: "John Doe",
      userEmail: responseType === 'type2' ? userEmail : "jane.doe@example.com",
      courseIdentifier: "http://example.com/activities/course-456",
      courseName: "Mathematics 101",
      assignmentIdentifier: "http://example.com/activities/quiz-123",
      assignmentTitle: "Math Quiz",
      points: 85,
      possiblePoints: 100,
      status: "SUCCESS",
      submittedAt: "2023-10-15T14:30:00Z",
      additionalData: {
        section: "Section A",
        term: "Fall 2023",
        timeSpent: "PT30M"
      }
    }
  };

  console.log(`✅ Connect API GET request successful (${responseType || 'type1'}), userEmail=${response.summary.userEmail}`);
  res.status(200).json(response);
});


// Connect API POST
app.post('/connect/submit', (req, res) => {
  const timeout = req.query.timeout;
  // Timeout simulation - delay response
  if (timeout === 'true') {
    console.log('⏰ Simulating timeout - delaying response by 15 seconds');
    setTimeout(() => {
      res.status(200).json({
        message: 'Connect api responded after long delay',
        delayed: true,
        delayedAt: new Date().toISOString()
      });
    }, 15000); // 15 second delay
    return;
  }

  const error500 = req.query.error500;
  const error503 = req.query.error503;
  const error429 = req.query.error429;
  // 500 error simulation
  if (error500 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(500).json({ error: 'Internal server error (mocked)' });
  }

  // 503 error simulation
  if (error503 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(503).json({ error: 'Service unavailable error (mocked)' });
  }


  // 429 error simulation
  if (error429 === 'true') {
    console.error('❌ Simulated server error triggered');
    return res.status(429).json({ error: 'Rate Limit (mocked)' });
  }

  const data = req.body;

  // Validate required fields
  const requiredFields = [
    'connectId', 'userId'
  ];
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    console.warn('⚠️ Connect: Missing required fields:', missingFields);
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }

  // Success response
  const response = {
    message: 'Connect API data submitted successfully',
    summary: {
      connectId: data.connectId,
      userId: data.userId,
      assignmentId: data.assignmentIdentifier,
      courseId: data.courseIdentifier,
      score: `${data.points}/${data.possiblePoints}`,
      status: data.status,
      submittedAt: data.submittedAt
    },
    metadata: data.additionalData || {},
    received: data
  };

  console.log('✅ Connect API submission successful');
  res.status(200).json(response);
});


// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
