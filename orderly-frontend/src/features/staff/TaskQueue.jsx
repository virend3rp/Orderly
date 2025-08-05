import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { socket } from '../../api/socket';
import { 
  Box, CircularProgress, Typography, Card, CardContent, CardActions, Button, Alert 
} from '@mui/material';

const notificationSound = new Audio('/notification.mp3'); // Assumes notification.mp3 is in /public

const TaskQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    // Initial data fetch
    const fetchQueue = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/staff/queue');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch your work queue.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();

    // WebSocket connection and listeners
    socket.connect();
    
    // Join rooms for all possible skill groups.
    // In a more advanced app, you'd fetch the user's specific skills and join only those rooms.
    socket.emit('join_room', 'skill_group_1');
    socket.emit('join_room', 'skill_group_2');
    socket.emit('join_room', 'skill_group_3');
    socket.emit('join_room', 'skill_group_4');

    const handleNewTask = (newTask) => {
      setTasks(prevTasks => [newTask, ...prevTasks]);
      notificationSound.play().catch(e => console.error("Error playing sound:", e));
    };

    socket.on('new_item_in_queue', handleNewTask);

    // Cleanup on component unmount
    return () => {
      socket.off('new_item_in_queue', handleNewTask);
      socket.disconnect();
    };
  }, []);

  const handleMarkAsPrepared = async (taskId) => {
    setUpdatingTaskId(taskId);
    try {
      await apiClient.patch(`/staff/items/${taskId}/prepare`);
      setTasks(prevTasks => prevTasks.filter(task => task.order_item_id !== taskId));
    } catch (err) {
      setError(`Failed to update task #${taskId}. Please try again.`);
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {tasks.length === 0 ? (
        <Typography>Your queue is currently empty. Great job!</Typography>
      ) : (
        tasks.map((task) => (
          <Card key={task.order_item_id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{task.product_name} x {task.quantity}</Typography>
              <Typography color="text.secondary">Order #: {task.order_number}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{task.product_description}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleMarkAsPrepared(task.order_item_id)}
                disabled={updatingTaskId === task.order_item_id}
              >
                {updatingTaskId === task.order_item_id ? 'Updating...' : 'Mark as Prepared'}
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default TaskQueue;