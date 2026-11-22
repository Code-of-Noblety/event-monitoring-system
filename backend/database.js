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

    return result.affectedRows !== 0;
}

export async function fetchUser(entry) {
    const [result] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [entry, entry]);
    return result[0];
}

export async function createEvent(event) {
    const [result] = await pool.execute(
        'INSERT IGNORE INTO events VALUES (DEFAULT, ?, ?, ?, ?, ?)',
        [
            event.admin_id,    
            event.name, 
            event.description, 
            event.start_date, 
            event.end_date
        ]
    )
    return result.affectedRows !== 0;
}

// Fetch for both staff and admin
export async function fetchAuthorizedEvent(user_id, eventId) {
    const [result] = await pool.execute(
        `SELECT e.*
        FROM events e
        LEFT JOIN staffs s ON e.event_id = s.event_id 
        WHERE e.event_id = ? AND (e.admin_id = ? OR s.user_id = ?)`,
        [eventId, user_id, user_id]
    )
    return result[0]
}

