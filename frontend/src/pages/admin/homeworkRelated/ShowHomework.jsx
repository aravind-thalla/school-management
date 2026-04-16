import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Typography,
    Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { getHomeworkList, deleteHomeworkById } from '../../../redux/homeworkRelated/homeworkHandle';
import { useSelector as useAppSelector } from 'react-redux';

const ShowHomework = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.user);
    const { homeworkList, loading, response } = useSelector((state) => state.homework);

    useEffect(() => {
        dispatch(getHomeworkList(currentUser._id, 'HomeworkListSchool'));
    }, [dispatch, currentUser._id]);

    const handleDelete = (id) => {
        dispatch(deleteHomeworkById(id)).then(() => {
            dispatch(getHomeworkList(currentUser._id, 'HomeworkListSchool'));
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress sx={{ color: '#0d7377' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <MenuBookIcon sx={{ fontSize: 30, color: '#0d7377' }} />
                    <Typography variant="h5" fontWeight={700} color="#0d7377">
                        Homework Management
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/Admin/homework/add')}
                    sx={{ bgcolor: '#0d7377', '&:hover': { bgcolor: '#095c60' }, borderRadius: 2 }}
                >
                    Add Homework
                </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {response || (Array.isArray(homeworkList) && homeworkList.length === 0) ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh" gap={2}>
                    <MenuBookIcon sx={{ fontSize: 72, color: '#ccc' }} />
                    <Typography variant="h6" color="text.secondary">No homework assigned yet.</Typography>
                    <Button variant="contained" onClick={() => navigate('/Admin/homework/add')} sx={{ bgcolor: '#0d7377' }}>
                        Assign First Homework
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {Array.isArray(homeworkList) && homeworkList.map((hw, index) => {
                        const dueDate = new Date(hw.dueDate);
                        const isOverdue = dueDate < new Date();
                        return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card elevation={3} sx={{
                                    borderRadius: 3,
                                    borderLeft: `5px solid ${isOverdue ? '#d32f2f' : '#0d7377'}`,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                            <Typography variant="h6" fontWeight={700} sx={{ flex: 1, pr: 1 }}>
                                                {hw.title}
                                            </Typography>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(hw._id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mb={1.5}>
                                            {hw.description}
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                                            <Chip label={hw.subName?.subName || 'N/A'} size="small" sx={{ bgcolor: '#e0f2f1', color: '#0d7377' }} />
                                            <Chip label={hw.sclassName?.sclassName || 'N/A'} size="small" variant="outlined" />
                                        </Box>
                                        <Typography variant="caption" color={isOverdue ? 'error' : 'text.secondary'}>
                                            Due: {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {isOverdue && ' (Overdue)'}
                                        </Typography>
                                        {hw.assignedBy && (
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                By: {hw.assignedBy.name}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Container>
    );
};

export default ShowHomework;
