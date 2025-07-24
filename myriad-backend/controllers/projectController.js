const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const snowflake = require('../utils/snowflake');

exports.uploadProject = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', req.file.path);
  let tasks;

  try {
    const rawData = fs.readFileSync(filePath);
    tasks = JSON.parse(rawData);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }

  try {
    for (const task of tasks) {
      const id = uuidv4();
      const { taskId, query, context } = task;

      const sql = `
        INSERT INTO projects (id, task_id, query, context)
        VALUES (?, ?, ?, ?)
      `;

      await snowflake.execute(sql, [id, taskId, query, context]);
    }

    res.status(200).json({ message: 'Project uploaded and tasks saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};
