import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Link, TextField } from '@mui/material';
import NavLogin from './navLogin';

function LoginPage(props) {
    const [credentials, setCredentials] = React.useState({})

    // contains username and password when submitted
    function submit(e) {
        e.preventDefault(); //prevents default actions of form from happening (reloads page contents)
        /*
         *
         * This is where we are calling backend component to register user.
         *
         */
        fetch("/loginUser/" + credentials.username + "/" + credentials.password)
            .then(response => response.json())
            .then(data => {
                if(data.result != -1) {
                    props.setUserID(data.result);
                    localStorage.setItem("userID", data.result);
                } else {
                    alert("Incorrect authentication.");
                }
            }).catch(error => {
                console.log(error);
            });
    }
  
    function updateCredentials(event) {
        var name = event.target.name;
        var value = event.target.value;
        // only update value of credential that is actually updated
        setCredentials(credentials => ({...credentials, [name]: value}))
    }
  
    return (
        <>
        <Box>
            <NavLogin />
            {localStorage.getItem("userID") != null}
            {localStorage.getItem("userID") !== null}
            <Container sx={{ width: 1 / 2 }} spacing={2}>
                {/* login area */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                        <Typography variant="h5">Log In</Typography>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="username" type="text" label="Username" variant="outlined" onChange={updateCredentials} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <TextField name="password" type="password" label="Password" variant="outlined" onChange={updateCredentials} required />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button variant="contained" onClick={submit}>Submit</Button>
                    </Grid>
                </Grid>
                {/* register reroute text and button */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                        <Typography variant="p">
                            New User?&nbsp;
                            <Link href="/#/register">Click here to register</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box >
        </>
    )
}

export default LoginPage