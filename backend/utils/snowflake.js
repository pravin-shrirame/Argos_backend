const snowflake = require('snowflake-sdk');
snowflake.configure({ logLevel: 'OFF' });

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

connection.connect((err, conn) => {
  if (err) {
    console.error('Unable to connect to Snowflake:', err.message);
  } else {
    console.log('Connected to Snowflake DB');
  }
});

async function execute(query, binds = []) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      binds,
      complete: function (err, stmt, rows) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      },
    });
  });
}

module.exports = {
  execute,
};
