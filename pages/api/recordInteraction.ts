// import pool from '../../lib/db';
// import { NextRequest, NextResponse } from "next/server";
// // Import necessary modules and types
// //import jwt from 'jsonwebtoken';
// import type { NextApiRequest, NextApiResponse } from 'next';
// import mysql2 from 'mysql2/promise';
// import { RowDataPacket } from 'mysql2';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // 确保使用POST请求
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { action, ...data } = req.body;

//   try {
//     const connection = await pool.getConnection();

//     try {
//       if (action === 'insertInteraction') {
//         const { UserID, ButtonName, UserLogTime, GPTMessages, Note, QuestionID } = data;
//         const query = 'INSERT INTO user_log (UserID, ButtonName, UserLogTime, GPTMessages, Note, QuestionID) VALUES (?, ?, ?, ?, ?, ?)';
//         const params = [UserID, ButtonName, UserLogTime, GPTMessages, Note, QuestionID || null];
//         const [result] = await connection.execute<mysql2.ResultSetHeader>(
//           query, params
//         );

//         if (result.affectedRows > 0) {
//           res.status(200).json({ success: true, message: 'Data inserted successfully' });
//         } else {
//           throw new Error('Failed to insert data');
//         }
//       } else if (action === 'fetchUserID') {
//         const { username } = data;
//         const [rows] = await connection.execute<RowDataPacket[]>(
//           'SELECT UserID FROM user WHERE UserName = ?', [username]
//         );

//         if (rows.length > 0) {
//           const { UserID } = rows[0];
//           res.status(200).json({ success: true, UserID });
//         } else {
//           res.status(404).json({ success: false, message: 'User not found' });
//         }
//       } else {
//         res.status(400).json({ message: 'Invalid action' });
//       }
//     } finally {
//       // 确保释放连接
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Database connection or query failed:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// }




import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db'; // 假设你已经正确配置了 PostgreSQL 连接池

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 确保使用 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { action, ...data } = req.body;

  try {
    if (action === 'insertInteraction') {
      console.log("开始");
      console.log(data);
      const { UserID, ButtonName, UserLogTime, GPTMessages, Note, QuestionID } = data;
      const query = `
        INSERT INTO user_log ("UserID", "ButtonName", "UserLogTime", "GPTMessages", "Note", "QuestionID")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const params = [UserID, ButtonName, UserLogTime, GPTMessages, Note, QuestionID || null];
      
      console.log(`Query: ${query}`);
      console.log(`Params:`, params);
    
      try {
        const result = await pool.query(query, params);
        if (result.rows.length > 0) {
          res.status(200).json({ success: true, message: 'Data inserted successfully' });
        } else {
          throw new Error('Failed to insert data');
        }
      } catch (error) {
        console.error(`Error in insertInteraction query:`, error);
        throw error;
      }
    } else if (action === 'fetchUserID') {
      const { username } = data;
      const query = 'SELECT "UserID" FROM "user" WHERE "UserName" = $1';
      console.log(`Query: ${query}`);
      console.log(`Params:`, [username]);
    
      try {
        const result = await pool.query(query, [username]);
        if (result.rows.length > 0) {
          const { UserID } = result.rows[0];
          res.status(200).json({ success: true, UserID });
        } else {
          res.status(404).json({ success: false, message: 'User not found' });
        }
      } catch (error) {
        console.error(`Error in fetchUserID query:`, error);
        throw error;
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Database connection or query failed:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}