const { v4: uuidv4 } = require('uuid');
const snowflake = require('../utils/snowflake');

exports.assignVendorsToTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // 1. Get task details (to fetch locale)
    const taskResult = await snowflake.execute(
      `SELECT id, locale FROM tasks WHERE id = ?`,
      [taskId]
    );

    if (!taskResult.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const locale = taskResult[0].LOCALE || taskResult[0].locale;

    // 2. Get 2 random vendors matching the task's locale
    const vendors = await snowflake.execute(
      `SELECT id FROM vendors WHERE locale = ? ORDER BY RANDOM() LIMIT 2`,
      [locale]
    );

    if (vendors.length < 2) {
      return res.status(400).json({ error: 'Not enough vendors available for this locale' });
    }

    // 3. Create 2 new assignments (if your logic expects that)
    const assignmentIds = await Promise.all(
      vendors.map(async (vendor) => {
        const assignmentId = uuidv4();
        await snowflake.execute(
          `INSERT INTO assignments (id, task_id, vendor_id, status, created_at) VALUES (?, ?, ?, 'assigned', CURRENT_TIMESTAMP)`,
          [assignmentId, taskId, vendor.ID || vendor.id]
        );
        return assignmentId;
      })
    );

    res.status(200).json({ message: 'Vendors assigned successfully', assignmentIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
