import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { 
    Typography, Box, Paper, TextField, Button, CircularProgress, Alert, 
    Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';

const SkillManager = () => {
    // State for creating a new skill group
    const [newGroupName, setNewGroupName] = useState('');
    
    // State for assigning skills
    const [employees, setEmployees] = useState([]);
    const [skillGroups, setSkillGroups] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');

    // General state
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch initial data for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [employeesRes, skillsRes] = await Promise.all([
                    apiClient.get('/admin/employees'),
                    apiClient.get('/admin/skills')
                ]);
                setEmployees(employeesRes.data);
                setSkillGroups(skillsRes.data);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const response = await apiClient.post('/admin/skills', { group_name: newGroupName });
            // Add new skill to the list for immediate UI update
            setSkillGroups(prev => [...prev, response.data.group]);
            setMessage({ type: 'success', text: `Skill group "${newGroupName}" created successfully!` });
            setNewGroupName('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create skill group.' });
        }
    };

    const handleAssignSkill = async (e) => {
        e.preventDefault();
        if (!selectedEmployee || !selectedSkill) {
            setMessage({ type: 'error', text: 'Please select both an employee and a skill.' });
            return;
        }
        setMessage({ type: '', text: '' });
        try {
            await apiClient.post('/admin/skills/assign', { employee_id: selectedEmployee, group_id: selectedSkill });
            setMessage({ type: 'success', text: 'Skill assigned successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to assign skill.' });
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Create New Skill Group</Typography>
                <Box component="form" onSubmit={handleCreateSkill} noValidate>
                    <TextField 
                        label="Group Name (e.g., 'Grill')" 
                        variant="outlined" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        sx={{ mr: 2, minWidth: 220 }}
                    />
                    <Button type="submit" variant="contained">Create</Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Assign Skill to Employee</Typography>
                <Box component="form" onSubmit={handleAssignSkill} noValidate>
                    <FormControl sx={{ mr: 2, minWidth: 220 }}>
                        <InputLabel id="employee-select-label">Employee</InputLabel>
                        <Select
                            labelId="employee-select-label"
                            value={selectedEmployee}
                            label="Employee"
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                            {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.full_name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ mr: 2, minWidth: 220 }}>
                        <InputLabel id="skill-select-label">Skill Group</InputLabel>
                        <Select
                            labelId="skill-select-label"
                            value={selectedSkill}
                            label="Skill Group"
                            onChange={(e) => setSelectedSkill(e.target.value)}
                        >
                            {skillGroups.map(group => <MenuItem key={group.id} value={group.id}>{group.group_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained">Assign Skill</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SkillManager;