import mysql from 'mysql2';
import 'dotenv/config';

const pool = mysql.createPool({
    host: "localhost",
    user: "event_user",
    password: process.env.DB_PASSWORD,
    database: "event_attendance_system",
}).promise();

export async function registerUser(user) {
    const [result] = await pool.execute('INSERT IGNORE INTO users(username, email, password) VALUES (?,?,?)', [
        user.username,
        user.email,
        user.password
    ]);

    return result;
}

export async function fetchOnLogin(entry) {
    const [result] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [entry, entry]);
    return result[0];
}