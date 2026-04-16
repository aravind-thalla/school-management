import { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import Popup from '../../components/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const ParentComplain = () => {
    const [complaint, setComplaint] = useState('');
    const [date, setDate] = useState('');

    const dispatch = useDispatch();
    const { status, currentUser, error } = useSelector((state) => state.user);

    const user = currentUser._id;
    const school = currentUser.school._id;
    const address = 'Complain';

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const fields = { user, date, complaint, school };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            setLoader(false);
            setShowPopup(true);
            setMessage('Complaint submitted successfully');
            setComplaint('');
            setDate('');
        } else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage('Network Error');
        }
    }, [status, error]);

    return (
        <>
            <PageWrapper>
                <FormCard>
                    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                        <AnnouncementIcon sx={{ fontSize: 32, color: '#0d7377' }} />
                        <Typography variant="h4" fontWeight={700} color="#0d7377">
                            Submit a Complaint
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Raise a concern about your child's education or school-related matters.
                    </Typography>
                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Date of Incident"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#0d7377' } } }}
                            />
                            <TextField
                                fullWidth
                                label="Describe your complaint"
                                variant="outlined"
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                required
                                multiline
                                rows={5}
                                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#0d7377' } } }}
                            />
                        </Stack>
                        <SubmitButton type="submit" disabled={loader}>
                            {loader ? <CircularProgress size={22} color="inherit" /> : 'Submit Complaint'}
                        </SubmitButton>
                    </form>
                </FormCard>
            </PageWrapper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
  min-height: 80vh;
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 36px 32px;
  width: 100%;
  max-width: 560px;
  border-top: 5px solid #0d7377;
`;

const SubmitButton = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #0d7377, #14a085);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export default ParentComplain;
