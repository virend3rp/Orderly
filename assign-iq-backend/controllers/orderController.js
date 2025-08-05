const db = require('../db');
const logger = require('../logger');
const { format } = require('date-fns');

const createOrder = async (req, res, next) => {
    const { items } = req.body;
    const client = await db.pool.connect();
    const io = req.app.get('socketio');

    try {
        await client.query('BEGIN');
        const timestamp = format(new Date(), 'yyyyMMddHHmmss');
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const order_number = `ORD${timestamp}${randomNumber}`;
        const orderQuery = 'INSERT INTO orders (order_number, status) VALUES ($1, $2) RETURNING id, status, created_at';
        const { rows: orderRows } = await client.query(orderQuery, [order_number, 'placed']);
        const newOrder = orderRows[0];
        
        const itemInsertPromises = items.map(item => {
            const itemQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)';
            return client.query(itemQuery, [newOrder.id, item.product_id, item.quantity]);
        });
        await Promise.all(itemInsertPromises);

        // Fetch the full item details to send via WebSocket
        const newItemsQuery = `
            SELECT 
                oi.id as item_id, oi.quantity, oi.status as item_status,
                p.name as product_name, p.skill_group_id
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1;
        `;
        const { rows: newItemsForSocket } = await client.query(newItemsQuery, [newOrder.id]);
        
        // --- WebSocket Emissions ---
        newItemsForSocket.forEach(item => {
            const roomName = `skill_group_${item.skill_group_id}`;
            const staffTaskPayload = {
                order_item_id: item.item_id,
                quantity: item.quantity,
                status: item.item_status,
                order_number: order_number,
                product_name: item.product_name,
            };
            io.to(roomName).emit('new_item_in_queue', staffTaskPayload);
        });

        const consolidationPayload = {
            order_id: newOrder.id,
            order_number: order_number,
            order_status: newOrder.status,
            items: newItemsForSocket
        };
        io.to('consolidation_room').emit('new_wip_order', consolidationPayload);
        // --- End WebSocket Emissions ---

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', order_number, order_id: newOrder.id });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

const getLatestPreparedOrder = async (req, res, next) => {
  let client; 
  try {
    client = await db.pool.connect();

    const query = `
      SELECT id, order_number, status, created_at 
      FROM orders 
      WHERE status = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    // Using 'complete' as the status for a prepared/ready-for-pickup order,
    // based on the available enum values ('placed', 'wip', 'complete').
    const { rows } = await client.query(query, ['complete']);

    if (rows.length > 0) {
      return res.status(200).json(rows[0]);
    } else {
      return res.status(404).json({ message: 'No prepared order found.' });
    }
  } catch (error) {
    logger.error('Error fetching latest prepared order:', error);
    next(error); 
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = { createOrder, getLatestPreparedOrder };
