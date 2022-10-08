import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from './logo.svg';

function NavLogin() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <img src={logo} width="40" height="40" />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
                        Feedback Friend
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavLogin;