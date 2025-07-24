const snowflake = require('../utils/snowflake');

function executeQuery(sqlText, binds = []) {
  return new Promise((resolve, reject) => {
    snowflake.getConnection().execute({
      sqlText,
      binds,
      complete: function (err, stmt, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    });
  });
}

exports.submitResponse = async (req, res) => {
  const { assignment_id, response_text } = req.body;

  try {
    // Insert response
    await executeQuery(
      `INSERT INTO responses (assignment_id, response_text) VALUES (?, ?)`,
      [assignment_id, response_text]
    );

    // Optionally update assignment status to 'submitted'
    await executeQuery(
      `UPDATE assignments SET status = 'submitted' WHERE id = ?`,
      [assignment_id]
    );

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Submission failed', details: err.message });
  }
};

exports.getResponsesByProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const rows = await executeQuery(
      `
      SELECT 
        r.id AS response_id,
        p.name AS project_name,
        t.name AS task_name,
        v.name AS vendor_name,
        r.response_text,
        r.submitted_at
      FROM responses r
      JOIN assignments a ON r.assignment_id = a.id
      JOIN vendors v ON a.vendor_id = v.id
      JOIN tasks t ON a.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      WHERE p.id = ?
      ORDER BY r.submitted_at DESC
      `,
      [project_id]
    );

    res.status(200).json({ responses: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch responses', details: err.message });
  }
};
