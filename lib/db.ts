import mysql from 'mysql2/promise';
import { Pool } from 'pg';

// 创建数据库连接池
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'user_information',
//   waitForConnections: true,
//   connectionLimit: 10000, // 连接池中保持的最大连接数
//   queueLimit: 60000
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
});


export default pool;
