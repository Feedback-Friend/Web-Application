import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { NavLink, Link } from 'react-router-dom';
import logo from './logo.svg';
import { ContextUserID } from '../App';

function Nav() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [userID, setUserID] = React.useContext(ContextUserID); //gets userID from state in App.js

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const logOut = () => {
        setUserID(null);
        localStorage.removeItem("userID");
    }

    let activeStyle = {
        color: 'ghostwhite',
        textShadow: '-1px -1px 1px black',
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar component="nav">
                <Toolbar>
                    <img src={logo} width="40" height="40" />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
                        Feedback Friend
                    </Typography>
                    <Box textAlign="right" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button color="inherit" component={NavLink} to="/" end style={({ isActive }) => isActive ? activeStyle : undefined}>Home</Button>
                        <Button color="inherit" component={NavLink} to="/myProfile" style={({ isActive }) => isActive ? activeStyle : undefined}>Profile</Button>
                        <Button color="inherit" component={NavLink} to="/contacts" style={({ isActive }) => isActive ? activeStyle : undefined}>Contacts</Button>
                        <Button color="inherit" component={NavLink} to="/results" style={({ isActive }) => isActive ? activeStyle : undefined}>Results</Button>
                        <Button color="inherit" onClick={logOut}>Log out</Button>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem component={Link} to="/" onClick={handleCloseNavMenu}>Home</MenuItem>
                            <MenuItem onClick={handleCloseNavMenu} component={Link} to="/myProfile" >Profile</MenuItem>
                            <MenuItem component={Link} to="/contacts" onClick={handleCloseNavMenu}>Contacts</MenuItem>
                            <MenuItem component={Link} to="/results" onClick={handleCloseNavMenu}>Results</MenuItem>
                            <Divider />
                            <MenuItem onClick={logOut}>Log out</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
}

export default Nav;