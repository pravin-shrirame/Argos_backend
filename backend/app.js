const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all routes here
app.use('/vendors', require('./routes/vendorRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/responses', require('./routes/responseRoutes'));
app.use('/assignments', require('./routes/assignmentRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));
