const db = require('../db');

const getAllEmployees = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT id, full_name, username, role FROM employees ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (error) { next(error); }
};

const updateUserRole = async (req, res, next) => {
    const { id: employeeId } = req.params;
    const { role } = req.body;
    try {
        const query = 'UPDATE employees SET role = $1 WHERE id = $2 RETURNING id, username, role';
        const { rows } = await db.query(query, [role, employeeId]);
        if (rows.length === 0) {
            const err = new Error('Employee not found.');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ message: 'Employee role updated successfully.', employee: rows[0] });
    } catch (error) { next(error); }
};

const createSkillGroup = async (req, res, next) => {
    const { group_name } = req.body;
    try {
        const query = 'INSERT INTO skill_groups (group_name) VALUES ($1) RETURNING *';
        const { rows } = await db.query(query, [group_name]);
        res.status(201).json({ message: 'Skill group created successfully.', group: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            error.statusCode = 409;
            error.message = 'Skill group with that name already exists.';
        }
        next(error);
    }
};

const assignSkillToEmployee = async (req, res, next) => {
    const { employee_id, group_id } = req.body;
    try {
        const query = 'INSERT INTO employee_skill_mapping (employee_id, group_id) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(query, [employee_id, group_id]);
        res.status(201).json({ message: 'Skill assigned successfully.', mapping: rows[0] });
    } catch (error) {
         if (error.code === '23505') {
            error.statusCode = 409;
            error.message = 'Employee is already assigned to this skill group.';
        }
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    const { product_code, name, description, price, skill_group_id } = req.body;
    try {
        const query = `INSERT INTO products (product_code, name, description, price, skill_group_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [product_code, name, description, price, skill_group_id];
        const { rows } = await db.query(query, values);
        res.status(201).json({ message: 'Product created successfully.', product: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            error.statusCode = 409;
            error.message = 'A product with that code already exists.';
        }
        next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT p.*, sg.group_name FROM products p JOIN skill_groups sg ON p.skill_group_id = sg.id ORDER BY p.id ASC');
        res.status(200).json(rows);
    } catch (error) { next(error); }
};

const updateProduct = async (req, res, next) => {
    const { id: productId } = req.params;
    const fields = req.body;
    const fieldEntries = Object.entries(fields);
    if (fieldEntries.length === 0) {
        const err = new Error('No fields to update provided.');
        err.statusCode = 400;
        return next(err);
    }
    const setClause = fieldEntries.map((entry, index) => `${entry[0]} = $${index + 1}`).join(', ');
    const values = fieldEntries.map(entry => entry[1]);
    try {
        const query = `UPDATE products SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`;
        const { rows } = await db.query(query, [...values, productId]);
        if (rows.length === 0) {
            const err = new Error('Product not found.');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ message: 'Product updated successfully.', product: rows[0] });
    } catch (error) { next(error); }
};

const deleteProduct = async (req, res, next) => {
    const { id: productId } = req.params;
    try {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [productId]);
        if (rows.length === 0) {
            const err = new Error('Product not found.');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ message: 'Product deleted successfully.', deletedProduct: rows[0] });
    } catch (error) {
        if (error.code === '23503') {
            error.statusCode = 409;
            error.message = 'Cannot delete product because it is part of existing orders.';
        }
        next(error);
    }
};
const getAllSkillGroups = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM skill_groups ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};
module.exports = { getAllEmployees, updateUserRole, createSkillGroup, assignSkillToEmployee, createProduct, getAllProducts, updateProduct, deleteProduct,getAllSkillGroups};