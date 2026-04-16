import React from 'react';
import styled from 'styled-components';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Avatar,
    Container,
    Paper,
    Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SchoolIcon from '@mui/icons-material/School';

const ParentProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    const sclassName = currentUser.sclassName;
    const school = currentUser.school;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StyledPaper elevation={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center">
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: '#0d7377',
                                    fontSize: 48,
                                    fontWeight: 700,
                                }}
                            >
                                {String(currentUser.name).charAt(0)}
                            </Avatar>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" gap={1}>
                            <Typography variant="h5" fontWeight={700}>
                                {currentUser.name}
                            </Typography>
                            <Chip label="Parent" sx={{ bgcolor: '#0d7377', color: '#fff', fontWeight: 600 }} />
                            <Typography variant="body2" color="text.secondary">
                                {currentUser.email}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </StyledPaper>

            {/* Child info */}
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FamilyRestroomIcon sx={{ color: '#0d7377' }} />
                        <Typography variant="h6" fontWeight={700}>
                            Child Information
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Child Name" value={currentUser.childName} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Roll Number" value={currentUser.childRollNum} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Class" value={sclassName?.sclassName} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="School" value={school?.schoolName} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* School info */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <SchoolIcon sx={{ color: '#0d7377' }} />
                        <Typography variant="h6" fontWeight={700}>
                            School Information
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="School Name" value={school?.schoolName} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Class Section" value={sclassName?.sclassName} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

const InfoRow = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
            {value || '—'}
        </Typography>
    </Box>
);

const StyledPaper = styled(Paper)`
  && {
    padding: 28px 20px;
    margin-bottom: 24px;
    border-radius: 16px;
    background: linear-gradient(135deg, #f0faf9 0%, #e8f5f4 100%);
    border: 1px solid #b2dfdb;
  }
`;

export default ParentProfile;
