const snowflake = require('../utils/snowflake');

exports.assignTaskToVendors = async (req, res) => {
  const { project_id, task_id } = req.body;

  try {
    // Get two random vendors
    const vendorsResult = await snowflake.execute(
      `SELECT id FROM vendors ORDER BY RANDOM() LIMIT 2`
    );

    const vendors = vendorsResult[0]; // result is an array of arrays

    if (!vendors || vendors.length < 2) {
      return res.status(400).json({ error: 'Not enough vendors available' });
    }

    // Assign each vendor
    for (const vendor of vendors) {
      const vendorId = vendor.ID || vendor.id;
      await snowflake.execute(
        `INSERT INTO assignments (project_id, task_id, vendor_id) VALUES (?, ?, ?)`,
        [project_id, task_id, vendorId]
      );
    }

    res.status(201).json({ message: 'Task assigned to two vendors successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Assignment failed', details: err.message });
  }
};
