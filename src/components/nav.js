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
import { Link } from 'react-router-dom';
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

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <img src={logo} width="40" height="40" />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
                        Feedback Friend
                    </Typography>
                    <Box textAlign="right" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/myProfile">Profile</Button>
                        <Button color="inherit">Contacts</Button>
                        <Button color="inherit" component={Link} to="/results">Results</Button>
                        <Button color="inherit" variant="outlined" onClick={logOut}>Log out</Button>
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
                            <MenuItem onClick={handleCloseNavMenu}>Contacts</MenuItem>
                            <MenuItem component={Link} to="/results" onClick={handleCloseNavMenu}>Results</MenuItem>
                            <Divider />
                            <MenuItem onClick={logOut}>Log out</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Nav;