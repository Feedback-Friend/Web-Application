import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import logo from './logo.svg';

function Nav() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <img src={logo} width="40" height="40" />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
                        Feedback Friend
                    </Typography>
                    <Box textAlign="right">
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit">Profile</Button>
                        <Button color="inherit">Contacts</Button>
                        <Button color="inherit" component={Link} to="/results">Results</Button>
                        <Button variant="outlined" color="inherit">Log out</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Nav;