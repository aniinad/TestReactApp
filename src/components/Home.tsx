import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ApiIcon from '@mui/icons-material/Api';
import PeopleIcon from '@mui/icons-material/People';

const Home: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to the React App
            </Typography>

            <Typography variant="body1" paragraph>
                This application demonstrates how to implement Microsoft Authentication Library (MSAL) for Azure AD authentication
                and make authenticated API calls using fetch.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <DataObjectIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h6" component="div" align="center">
                                Data Loader
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={RouterLink}
                                to="/data-loader"
                                fullWidth
                            >
                                View
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h6" component="div" align="center">
                                User List
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={RouterLink}
                                to="/users"
                                fullWidth
                            >
                                View
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <ApiIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h6" component="div" align="center">
                                API Example
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={RouterLink}
                                to="/api-example"
                                fullWidth
                            >
                                View
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h6" component="div" align="center">
                                Dashboard
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={RouterLink}
                                to="/dashboard"
                                fullWidth
                            >
                                View
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home; 