import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
} from '@mui/material';
import { AccountCircle, Group, FamilyRestroom } from '@mui/icons-material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === "Parent") {
      if (visitor === "guest") {
        const email = "parent@guest.com";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Parentlogin');
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Teacherlogin');
      }
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') navigate('/Admin/dashboard');
      else if (currentRole === 'Parent') navigate('/Parent/dashboard');
      else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <HeaderText>Welcome to EduConnect</HeaderText>
      <SubHeaderText>Choose how you'd like to sign in</SubHeaderText>
      <Container maxWidth="md">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <RoleCard onClick={() => navigateHandler("Admin")} color="#0d7377">
              <IconWrapper color="#0d7377">
                <AccountCircle sx={{ fontSize: 44, color: '#fff' }} />
              </IconWrapper>
              <RoleTitle>Admin</RoleTitle>
              <RoleDesc>Manage school operations, classes, teachers, and student records.</RoleDesc>
            </RoleCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RoleCard onClick={() => navigateHandler("Parent")} color="#14a085">
              <IconWrapper color="#14a085">
                <FamilyRestroom sx={{ fontSize: 44, color: '#fff' }} />
              </IconWrapper>
              <RoleTitle>Parent</RoleTitle>
              <RoleDesc>View your child's attendance, exam marks, homework, and school notices.</RoleDesc>
            </RoleCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RoleCard onClick={() => navigateHandler("Teacher")} color="#1a6b5e">
              <IconWrapper color="#1a6b5e">
                <Group sx={{ fontSize: 44, color: '#fff' }} />
              </IconWrapper>
              <RoleTitle>Teacher</RoleTitle>
              <RoleDesc>Record attendance, enter exam marks, assign homework, and communicate.</RoleDesc>
            </RoleCard>
          </Grid>
        </Grid>
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
        <CircularProgress color="inherit" />
        &nbsp;Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(135deg, #0a4e52 0%, #0d7377 50%, #14a085 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  gap: 0.5rem;
`;

const HeaderText = styled.h1`
  color: #fff;
  font-size: 2.4rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const SubHeaderText = styled.p`
  color: rgba(255,255,255,0.80);
  font-size: 1.05rem;
  margin: 0 0 40px 0;
  text-align: center;
`;

const RoleCard = styled(Paper)`
  && {
    padding: 32px 24px;
    text-align: center;
    background: rgba(255,255,255,0.10);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.92);
    cursor: pointer;
    border-radius: 20px;
    transition: transform 0.25s, background 0.25s, box-shadow 0.25s;
    &:hover {
      background: rgba(255,255,255,0.22);
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
      color: #fff;
    }
  }
`;

const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.20);
`;

const RoleTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 1.4rem;
  font-weight: 700;
`;

const RoleDesc = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  color: rgba(255,255,255,0.78);
`;
