import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Link, TextField } from '@mui/material';
import NavLogin from './navLogin';

function RegisterPage() {
    const [userInfo, setUserInfo] = React.useState({})
    
    // contains all credentials
    function submit(e) {
        e.preventDefault(); //prevents default actions of form from happening (reloads page contents)
        /*
         *
         * This is where we are calling backend component to register user.
         *
         */
        // TODO: CHANGE TO POST
        fetch("/registerUser/" + userInfo.firstName + "/" + userInfo.lastName + "/" + userInfo.username + "/" + userInfo.password + "/" + userInfo.email)
            .then(response => response.json())
            .then(data => {
            }).catch(error => {
                console.log(error);
            });
    }
  
    function updateUserInfo(event) {
        var name = event.target.name;
        var value = event.target.value;
        // only update value of credential that is actually updated
        setUserInfo(userInfo => ({...userInfo, [name]: value}))
    }
  
    return (
        <>
        <Box>
            <NavLogin />
            <Container sx={{ width: 1 / 2 }} spacing={2}>
                {/* register area */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                        <Typography variant="h5">Register</Typography>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="firstName" type="text" label="First Name" variant="outlined" onChange={updateUserInfo} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="lastName" type="text" label="Last Name" variant="outlined" onChange={updateUserInfo} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="email" type="text" label="Email" variant="outlined" onChange={updateUserInfo} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="username" type="text" label="Username" variant="outlined" onChange={updateUserInfo} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="password" type="password" label="Password" variant="outlined" onChange={updateUserInfo} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="retypePassword" type="password" label="Retype Password" variant="outlined" onChange={updateUserInfo} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button variant="contained" onClick={submit}>Submit</Button>
                    </Grid>
                </Grid>
                {/* login reroute text and button */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                        <Typography variant="p">
                            Already have an account?&nbsp;
                            <Link href="/">Log In</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box >
        </>
    )
}

export default RegisterPage