const db = require('../db');
const logger = require('../logger');

const getMyQueue = async (req, res, next) => {
    const employeeId = req.employee.id;
    try {
        const skillsQuery = 'SELECT group_id FROM employee_skill_mapping WHERE employee_id = $1';
        const { rows: skillRows } = await db.query(skillsQuery, [employeeId]);
        if (skillRows.length === 0) {
            return res.status(200).json([]);
        }
        const skillGroupIds = skillRows.map(row => row.group_id);
        const queueQuery = `
            SELECT 
                oi.id as order_item_id, oi.quantity, oi.status,
                o.order_number, p.name as product_name, p.description as product_description
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE oi.status = 'pending' AND p.skill_group_id = ANY($1::int[]);
        `;
        const { rows: queueItems } = await db.query(queueQuery, [skillGroupIds]);
        res.status(200).json(queueItems);
    } catch (error) {
        next(error);
    }
};

const markItemAsPrepared = async (req, res, next) => {
    const { id: orderItemId } = req.params;
    const io = req.app.get('socketio');
    try {
        const updateQuery = `UPDATE order_items SET status = 'prepared' WHERE id = $1 AND status = 'pending' RETURNING *;`;
        const { rows } = await db.query(updateQuery, [orderItemId]);
        if (rows.length === 0) {
            const err = new Error('Order item not found or its status was not "pending".');
            err.statusCode = 404;
            throw err;
        }
        // Emit a WebSocket event to the consolidation room
        io.to('consolidation_room').emit('item_prepared', rows[0]);
        
        res.status(200).json({ 
            message: 'Item marked as prepared and sent to consolidation station.', 
            item: rows[0] 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMyQueue, markItemAsPrepared };