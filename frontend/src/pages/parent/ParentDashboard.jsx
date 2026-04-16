import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ParentSideBar from './ParentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import ParentHomePage from './ParentHomePage';
import ParentProfile from './ParentProfile';
import ParentSubjects from './ParentSubjects';
import ViewParentAttendance from './ViewParentAttendance';
import ParentComplain from './ParentComplain';
import ParentHomework from './ParentHomework';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';

const ParentDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => setOpen(!open);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar open={open} position="absolute" sx={{ background: 'linear-gradient(90deg, #0d7377 0%, #14a085 100%)' }}>
                <Toolbar sx={{ pr: '24px' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1, fontWeight: 700 }}
                    >
                        Parent Dashboard
                    </Typography>
                    <AccountMenu />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                sx={open ? styles.drawerStyled : styles.hideDrawer}
            >
                <Toolbar sx={styles.toolBarStyled}>
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ParentSideBar />
                </List>
            </Drawer>
            <Box component="main" sx={styles.boxStyled}>
                <Toolbar />
                <Routes>
                    <Route path="/" element={<ParentHomePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/Parent/dashboard" element={<ParentHomePage />} />
                    <Route path="/Parent/profile" element={<ParentProfile />} />
                    <Route path="/Parent/homework" element={<ParentHomework />} />
                    <Route path="/Parent/subjects" element={<ParentSubjects />} />
                    <Route path="/Parent/attendance" element={<ViewParentAttendance />} />
                    <Route path="/Parent/complain" element={<ParentComplain />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default ParentDashboard;

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: { display: 'flex' },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': { display: 'none' },
    },
};
