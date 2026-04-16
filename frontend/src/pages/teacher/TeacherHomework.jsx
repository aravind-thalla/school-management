import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    CircularProgress,
    Container,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
} from '@mui/material';
import { addHomework, getHomeworkList } from '../../redux/homeworkRelated/homeworkHandle';
import Popup from '../../components/Popup';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { TealButton } from '../../components/buttonStyles';

const TeacherHomework = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { homeworkList, loading } = useSelector((state) => state.homework);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;
    const subjectName = currentUser.teachSubject?.subName;
    const teacherID = currentUser._id;
    const schoolID = currentUser.school?._id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [tab, setTab] = useState('add');

    useEffect(() => {
        if (classID) {
            dispatch(getHomeworkList(classID, 'HomeworkList'));
        }
    }, [dispatch, classID]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            addHomework({
                title,
                description,
                dueDate,
                sclassName: classID,
                subName: subjectID,
                school: schoolID,
                assignedBy: teacherID,
            })
        ).then(() => {
            setMessage('Homework assigned successfully!');
            setShowPopup(true);
            setTitle('');
            setDescription('');
            setDueDate('');
            dispatch(getHomeworkList(classID, 'HomeworkList'));
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <MenuBookIcon sx={{ fontSize: 30, color: '#0d7377' }} />
                <Typography variant="h5" fontWeight={700} color="#0d7377">
                    Homework
                </Typography>
                <Typography variant="body2" color="text.secondary" ml={1}>
                    | Subject: <strong>{subjectName}</strong>
                </Typography>
            </Box>

            <Box display="flex" gap={2} mb={3}>
                <Chip
                    label="Assign New"
                    onClick={() => setTab('add')}
                    sx={{ cursor: 'pointer', bgcolor: tab === 'add' ? '#0d7377' : '#e0f2f1', color: tab === 'add' ? '#fff' : '#0d7377', fontWeight: 600 }}
                />
                <Chip
                    label="View Assigned"
                    onClick={() => setTab('view')}
                    sx={{ cursor: 'pointer', bgcolor: tab === 'view' ? '#0d7377' : '#e0f2f1', color: tab === 'view' ? '#fff' : '#0d7377', fontWeight: 600 }}
                />
            </Box>

            {tab === 'add' && (
                <Box
                    component="form"
                    onSubmit={submitHandler}
                    sx={{
                        bgcolor: '#fff',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        borderTop: '5px solid #0d7377',
                        maxWidth: 560,
                    }}
                >
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Homework Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description / Instructions"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            multiline
                            rows={4}
                        />
                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TealButton type="submit" variant="contained" fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Assign Homework'}
                        </TealButton>
                    </Stack>
                </Box>
            )}

            {tab === 'view' && (
                <>
                    <Divider sx={{ mb: 3 }} />
                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress sx={{ color: '#0d7377' }} />
                        </Box>
                    ) : !Array.isArray(homeworkList) || homeworkList.length === 0 ? (
                        <Typography color="text.secondary">No homework assigned yet.</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {homeworkList.map((hw, index) => {
                                const isOverdue = new Date(hw.dueDate) < new Date();
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card elevation={2} sx={{
                                            borderRadius: 3,
                                            borderLeft: `5px solid ${isOverdue ? '#d32f2f' : '#0d7377'}`,
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={700} mb={1}>
                                                    {hw.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" mb={1.5}>
                                                    {hw.description}
                                                </Typography>
                                                <Typography variant="caption" color={isOverdue ? 'error' : 'text.secondary'}>
                                                    Due: {new Date(hw.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {isOverdue && ' (Overdue)'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </>
            )}

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default TeacherHomework;
