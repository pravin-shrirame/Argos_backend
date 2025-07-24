const fs = require('fs');
const csv = require('csv-parser');
const snowflake = require('../utils/snowflake'); // Your snowflake helper, or comment out DB part if not ready

exports.uploadVendors = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const vendors = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      vendors.push(row);
    })
    .on('end', async () => {
      try {
        // Example: Insert vendors into Snowflake (optional)
        
for (const vendor of vendors) {
  const query = `INSERT INTO vendors (name, email, locale) VALUES (?, ?, ?)`;
  const binds = [vendor.name, vendor.email, vendor.locale];
  console.log('Running query:', query, 'with values:', binds);
  await snowflake.execute(query, binds);
}


        // Send success response with vendor data
        res.status(201).json({ message: 'Vendors uploaded successfully', vendors });
      } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
      } finally {
        // Optional: Delete uploaded file after processing
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      }
    });
};


// Get all vendors from Snowflake
exports.getVendors = async (req, res) => {
  try {
    const rows = await snowflake.execute('SELECT * FROM vendors');
    res.status(200).json({ vendors: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vendors', details: err.message });
  }
};
