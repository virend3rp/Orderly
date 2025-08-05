const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

const registerEmployee = async (req, res, next) => {
  const { full_name, username, password, role = 'staff' } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const query = 'INSERT INTO employees (full_name, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role';
    const values = [full_name, username, password_hash, role];
    const { rows } = await db.query(query, values);
    res.status(201).json({ message: 'Employee registered successfully', employee: rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      error.statusCode = 409;
      error.message = 'Username already exists.';
    }
    next(error);
  }
};

const loginEmployee = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM employees WHERE username = $1', [username]);
        if (rows.length === 0) {
            const err = new Error('Invalid credentials.');
            err.statusCode = 401;
            throw err;
        }
        const employee = rows[0];
        const isPasswordValid = await bcrypt.compare(password, employee.password_hash);
        if (!isPasswordValid) {
            const err = new Error('Invalid credentials.');
            err.statusCode = 401;
            throw err;
        }
        await db.query('INSERT INTO employee_sessions (employee_id) VALUES ($1)', [employee.id]);
        const payload = { id: employee.id, name: employee.full_name, role: employee.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }
};

const logoutEmployee = async (req, res, next) => {
    const employeeId = req.employee.id;
    try {
        const query = `UPDATE employee_sessions SET logout_time = NOW() WHERE employee_id = $1 AND logout_time IS NULL RETURNING id;`;
        const { rows } = await db.query(query, [employeeId]);
        if (rows.length === 0) {
            const err = new Error('No active session found to log out.');
            err.statusCode = 400;
            throw err;
        }
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerEmployee, loginEmployee, logoutEmployee };