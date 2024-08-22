import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async()=> {
  try{
    const connection = await pool.getConnection();
    console.log("DB connected successfully");
    connection.release();     
  } catch (e){
    console.log("Error occurred while connecting to db ", e);    
  }
})();

export default pool;


