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
} from '@mui/material';
import { addHomework } from '../../../redux/homeworkRelated/homeworkHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { TealButton } from '../../../components/buttonStyles';
import axios from 'axios';

const AddHomework = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { loading } = useSelector((state) => state.homework);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, 'Sclass'));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (selectedClass) {
            axios
                .get(`${process.env.REACT_APP_BASE_URL}/ClassSubjects/${selectedClass}`)
                .then((res) => {
                    if (Array.isArray(res.data)) setSubjectsList(res.data);
                })
                .catch(() => setSubjectsList([]));
        }
    }, [selectedClass]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!title || !description || !dueDate || !selectedClass || !selectedSubject) {
            setMessage('Please fill in all fields.');
            setShowPopup(true);
            return;
        }
        dispatch(
            addHomework({
                title,
                description,
                dueDate,
                sclassName: selectedClass,
                subName: selectedSubject,
                school: currentUser._id,
            })
        ).then(() => {
            setMessage('Homework added successfully!');
            setShowPopup(true);
            setTitle('');
            setDescription('');
            setDueDate('');
            setSelectedClass('');
            setSelectedSubject('');
            setSubjectsList([]);
        });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <MenuBookIcon sx={{ fontSize: 30, color: '#0d7377' }} />
                <Typography variant="h5" fontWeight={700} color="#0d7377">
                    Assign Homework
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={submitHandler}
                sx={{
                    bgcolor: '#fff',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    borderTop: '5px solid #0d7377',
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
                        select
                        label="Select Class"
                        value={selectedClass}
                        onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject(''); }}
                        required
                    >
                        {sclassesList && sclassesList.map((cls) => (
                            <MenuItem key={cls._id} value={cls._id}>
                                {cls.sclassName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        select
                        label="Select Subject"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        required
                        disabled={!selectedClass}
                    >
                        {subjectsList.map((sub) => (
                            <MenuItem key={sub._id} value={sub._id}>
                                {sub.subName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TealButton type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Assign Homework'}
                    </TealButton>
                </Stack>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default AddHomework;
