const oracledb = require("oracledb");

// Initialize Oracle client with the path to the Instant Client
oracledb.initOracleClient({
  libDir:
    "C:\\Users\\GT091467\\Downloads\\instantclient-basic-windows.x64-23.5.0.24.07\\instantclient_23_5\\",
});

//create connection pool

let pool;

async function initConnectionPool() {
  try {
    if (!pool) {
      pool = await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING,
        poolMin: 1,
        poolMax: 5,
        poolTimeout: 60,
      });
      console.log("Connection pool started");
      return pool;
    }
  } catch (error) {
    console.error("Error starting connection pool - ", error);
    throw error;
  }
}

const executeQuery = async (query, params = []) => {
  let connection;
  try {
    pool = pool || await initConnectionPool();
    connection = await pool.getConnection();
    const result = await connection.execute(query,params,{autoCommit:true});
    return result;
  } catch (error) {
    console.error("Error executing query - ", error);
    throw error;
  } finally {
    try {
      if (connection) {
        await connection.close();
      }
    } catch (error) {
      console.error("Error closing connection - ", error);
    }
  }
};

module.exports = { executeQuery };

// const dbConnection = async () => {
//     const connection = await oracledb.getConnection({
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         connectionString: process.env.DB_CONNECTION_STRING,
//     });
//     return connection;
// }

// module.exports = dbConnection;
