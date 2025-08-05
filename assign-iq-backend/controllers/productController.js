const db = require('../db');
const logger = require('../logger');

const getAvailableProducts = async (req, res, next) => {
    try {
        const activeGroupsQuery = `
            SELECT DISTINCT esm.group_id
            FROM employee_sessions es
            JOIN employee_skill_mapping esm ON es.employee_id = esm.employee_id
            WHERE es.logout_time IS NULL;
        `;
        const { rows: activeGroups } = await db.query(activeGroupsQuery);
        if (activeGroups.length === 0) {
            return res.status(200).json([]);
        }
        const activeGroupIds = activeGroups.map(g => g.group_id);
        const productsQuery = 'SELECT * FROM products WHERE skill_group_id = ANY($1::int[])';
        const { rows: availableProducts } = await db.query(productsQuery, [activeGroupIds]);
        res.status(200).json(availableProducts);
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM skill_groups ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};

// Add the new function to the export list
module.exports = {
    getAvailableProducts,
    getAllCategories, // Add this
};
