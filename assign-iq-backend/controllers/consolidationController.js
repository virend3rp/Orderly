const db = require('../db');
const logger = require('../logger');

const getWipOrders = async (req, res, next) => {
    try {
        const query = `
            SELECT o.id AS order_id, o.order_number, o.status AS order_status,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'item_id', oi.id, 'product_name', p.name,
                        'quantity', oi.quantity, 'item_status', oi.status
                    )
                ) AS items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.status = 'placed'
            GROUP BY o.id, o.order_number, o.status, o.created_at
            ORDER BY o.created_at ASC;
        `;
        const { rows: groupedOrders } = await db.query(query);
        res.status(200).json(groupedOrders);
    } catch (error) {
        next(error);
    }
};

const markOrderAsComplete = async (req, res, next) => {
    const { id: orderId } = req.params;
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const verificationQuery = 'SELECT status FROM order_items WHERE order_id = $1';
        const { rows: itemStatuses } = await client.query(verificationQuery, [orderId]);
        if (itemStatuses.length === 0) {
            const err = new Error('Order not found or has no items.');
            err.statusCode = 404;
            throw err;
        }
        const allItemsPrepared = itemStatuses.every(item => item.status === 'prepared');
        if (!allItemsPrepared) {
            const err = new Error('Cannot complete order: Not all items are prepared.');
            err.statusCode = 400;
            throw err;
        }
        const updateQuery = "UPDATE orders SET status = 'complete' WHERE id = $1 RETURNING *";
        const { rows: updatedOrder } = await client.query(updateQuery, [orderId]);
        await client.query('COMMIT');
        res.status(200).json({ message: 'Order marked as complete.', order: updatedOrder[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

module.exports = { getWipOrders, markOrderAsComplete };