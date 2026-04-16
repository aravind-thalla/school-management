import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getHomeworkList } from '../../redux/homeworkRelated/homeworkHandle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ParentHomePage = () => {
    const dispatch = useDispatch();

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { homeworkList } = useSelector((state) => state.homework);

    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const classID = currentUser.sclassName._id;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, 'Parent'));
        dispatch(getSubjectList(classID, 'ClassSubjects'));
        dispatch(getHomeworkList(classID, 'HomeworkList'));
    }, [dispatch, currentUser._id, classID]);

    const numberOfSubjects = subjectsList && subjectsList.length;
    const pendingHomework = Array.isArray(homeworkList)
        ? homeworkList.filter((hw) => new Date(hw.dueDate) >= new Date()).length
        : 0;

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Welcome banner */}
            <WelcomeBanner>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{ width: 56, height: 56, bgcolor: '#fff', color: '#0d7377', fontWeight: 700, fontSize: 22 }}
                    >
                        {String(currentUser.name).charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="#fff">
                            Welcome, {currentUser.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                            Tracking progress for <strong>{currentUser.childName}</strong> &nbsp;|&nbsp;
                            Class: <strong>{currentUser.sclassName.sclassName}</strong>
                        </Typography>
                    </Box>
                </Box>
            </WelcomeBanner>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Stat cards */}
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard>
                        <SchoolIcon sx={{ fontSize: 40, color: '#0d7377' }} />
                        <StatTitle>Total Subjects</StatTitle>
                        <StatData start={0} end={numberOfSubjects} duration={2.5} />
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard>
                        <MenuBookIcon sx={{ fontSize: 40, color: '#0d7377' }} />
                        <StatTitle>Pending Homework</StatTitle>
                        <StatData start={0} end={pendingHomework} duration={2.5} />
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StatCard>
                        <AssignmentIcon sx={{ fontSize: 40, color: '#0d7377' }} />
                        <StatTitle>Overall Attendance</StatTitle>
                        <StatData start={0} end={overallAttendancePercentage} duration={2.5} suffix="%" decimals={1} />
                    </StatCard>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <ChartContainer>
                        {response ? (
                            <Typography variant="h6">No Attendance Found</Typography>
                        ) : loading ? (
                            <Typography variant="h6">Loading...</Typography>
                        ) : subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                            <CustomPieChart data={chartData} />
                        ) : (
                            <Typography variant="h6" color="text.secondary" textAlign="center">
                                No Attendance Data
                            </Typography>
                        )}
                    </ChartContainer>
                </Grid>

                {/* Notice board */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #0d7377 0%, #14a085 100%);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 4px 20px rgba(13,115,119,0.25);
`;

const ChartContainer = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const StatCard = styled(Paper)`
  && {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    height: 200px;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    }
  }
`;

const StatTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin: 0;
`;

const StatData = styled(CountUp)`
  font-size: calc(1.4rem + 0.6vw);
  font-weight: 700;
  color: #0d7377;
`;

export default ParentHomePage;
