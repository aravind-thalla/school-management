import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const ParentSideBar = () => {
    const location = useLocation();
    return (
        <>
            <React.Fragment>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <HomeIcon color={location.pathname === ('/' || '/Parent/dashboard') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Parent/homework">
                    <ListItemIcon>
                        <MenuBookIcon color={location.pathname.startsWith('/Parent/homework') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Homework" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Parent/subjects">
                    <ListItemIcon>
                        <AssignmentIcon color={location.pathname.startsWith('/Parent/subjects') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Exam Marks" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Parent/attendance">
                    <ListItemIcon>
                        <ClassOutlinedIcon color={location.pathname.startsWith('/Parent/attendance') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Attendance" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Parent/complain">
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon color={location.pathname.startsWith('/Parent/complain') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Complain" />
                </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                <ListSubheader component="div" inset>
                    Account
                </ListSubheader>
                <ListItemButton component={Link} to="/Parent/profile">
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon color={location.pathname.startsWith('/Parent/profile') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton component={Link} to="/logout">
                    <ListItemIcon>
                        <ExitToAppIcon color={location.pathname.startsWith('/logout') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </React.Fragment>
        </>
    );
};

export default ParentSideBar;
