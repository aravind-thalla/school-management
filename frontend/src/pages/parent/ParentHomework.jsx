import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getHomeworkList } from '../../redux/homeworkRelated/homeworkHandle';

const ParentHomework = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { homeworkList, loading, response } = useSelector((state) => state.homework);

    const classID = currentUser.sclassName._id;

    useEffect(() => {
        dispatch(getHomeworkList(classID, 'HomeworkList'));
    }, [dispatch, classID]);

    const today = new Date();

    const isOverdue = (dueDate) => new Date(dueDate) < today;
    const isDueToday = (dueDate) => {
        const d = new Date(dueDate);
        return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    };

    const getChipProps = (dueDate) => {
        if (isDueToday(dueDate)) return { label: 'Due Today', color: 'warning' };
        if (isOverdue(dueDate)) return { label: 'Overdue', color: 'error' };
        return { label: 'Upcoming', color: 'success' };
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
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <MenuBookIcon sx={{ fontSize: 32, color: '#0d7377' }} />
                <Typography variant="h4" fontWeight={700} color="#0d7377">
                    Daily Homework
                </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                Class: <strong>{currentUser.sclassName.sclassName}</strong> &nbsp;|&nbsp;
                Child: <strong>{currentUser.childName}</strong>
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {response || (Array.isArray(homeworkList) && homeworkList.length === 0) ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="40vh"
                    gap={2}
                >
                    <AssignmentIcon sx={{ fontSize: 72, color: '#ccc' }} />
                    <Typography variant="h6" color="text.secondary">
                        No homework assigned yet.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {Array.isArray(homeworkList) &&
                        homeworkList.map((hw, index) => {
                            const chipProps = getChipProps(hw.dueDate);
                            const dueDateStr = new Date(hw.dueDate).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            });
                            const assignedDateStr = new Date(hw.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            });

                            return (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            borderRadius: 3,
                                            borderLeft: `5px solid ${chipProps.color === 'error' ? '#d32f2f' : chipProps.color === 'warning' ? '#ed6c02' : '#0d7377'}`,
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                        }}
                                    >
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                <Typography variant="h6" fontWeight={700} sx={{ flex: 1, pr: 1 }}>
                                                    {hw.title}
                                                </Typography>
                                                <Chip
                                                    label={chipProps.label}
                                                    color={chipProps.color}
                                                    size="small"
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" mb={2}>
                                                {hw.description}
                                            </Typography>

                                            <Divider sx={{ mb: 1.5 }} />

                                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                <AssignmentIcon fontSize="small" sx={{ color: '#0d7377' }} />
                                                <Typography variant="body2">
                                                    Subject: <strong>{hw.subName?.subName || 'N/A'}</strong>
                                                </Typography>
                                            </Box>

                                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                <CalendarTodayIcon fontSize="small" sx={{ color: '#0d7377' }} />
                                                <Typography variant="body2">
                                                    Due: <strong>{dueDateStr}</strong>
                                                </Typography>
                                            </Box>

                                            <Typography variant="caption" color="text.secondary">
                                                Assigned on {assignedDateStr}
                                                {hw.assignedBy ? ` by ${hw.assignedBy.name}` : ''}
                                            </Typography>
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

export default ParentHomework;
