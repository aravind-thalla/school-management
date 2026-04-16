import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Collapse,
    Paper,
    Table,
    TableBody,
    TableHead,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject,
} from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewParentAttendance = () => {
    const dispatch = useDispatch();
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));
    };

    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, 'Parent'));
    }, [dispatch, currentUser._id]);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => ({
        subject: subName,
        attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
        totalClasses: sessions,
        attendedClasses: present,
    }));

    const handleSectionChange = (event, newSection) => setSelectedSection(newSection);

    const renderTableSection = () => (
        <>
            <Typography variant="h5" align="center" fontWeight={700} color="#0d7377" gutterBottom sx={{ mt: 3 }}>
                {currentUser.childName}'s Attendance
            </Typography>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Subject</StyledTableCell>
                        <StyledTableCell>Present</StyledTableCell>
                        <StyledTableCell>Total Sessions</StyledTableCell>
                        <StyledTableCell>Attendance %</StyledTableCell>
                        <StyledTableCell align="center">Details</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                    const pct = calculateSubjectAttendancePercentage(present, sessions);
                    return (
                        <TableBody key={index}>
                            <StyledTableRow>
                                <StyledTableCell>{subName}</StyledTableCell>
                                <StyledTableCell>{present}</StyledTableCell>
                                <StyledTableCell>{sessions}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <span style={{ color: pct >= 75 ? '#0d7377' : '#d32f2f', fontWeight: 700 }}>
                                            {pct}%
                                        </span>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button variant="contained" size="small" sx={{ bgcolor: '#0d7377', '&:hover': { bgcolor: '#095c60' } }} onClick={() => handleOpen(subId)}>
                                        {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        Details
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }}>
                                            <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                                                Attendance Log
                                            </Typography>
                                            <Table size="small">
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <StyledTableCell>Date</StyledTableCell>
                                                        <StyledTableCell align="right">Status</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {allData.map((data, i) => {
                                                        const date = new Date(data.date);
                                                        const dateString = date.toString() !== 'Invalid Date'
                                                            ? date.toISOString().substring(0, 10)
                                                            : 'Invalid Date';
                                                        return (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{dateString}</StyledTableCell>
                                                                <StyledTableCell align="right">
                                                                    <span style={{ color: data.status === 'Present' ? '#0d7377' : '#d32f2f', fontWeight: 600 }}>
                                                                        {data.status}
                                                                    </span>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    );
                })}
            </Table>
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={600} color={overallAttendancePercentage >= 75 ? '#0d7377' : '#d32f2f'}>
                    Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                    {overallAttendancePercentage < 75 && ' ⚠️ Below 75%'}
                </Typography>
            </Box>
        </>
    );

    const renderChartSection = () => <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />;

    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={8}><Typography>Loading...</Typography></Box>
            ) : (
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction label="Table" value="table" icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />} />
                                    <BottomNavigationAction label="Chart" value="chart" icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />} />
                                </BottomNavigation>
                            </Paper>
                        </>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                            <Typography variant="h6" color="text.secondary">
                                No attendance data available yet.
                            </Typography>
                        </Box>
                    )}
                </div>
            )}
        </>
    );
};

export default ViewParentAttendance;
