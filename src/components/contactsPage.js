import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';
import Nav from './nav';
import { Table, TableContainer, Typography } from '@mui/material';
import contacts from './contacts.json';

function Contacts(props) {

  const [contactInfo, setContactInfo] = React.useState(contacts[0].contacts);


  function populateContactInfo(e) {
    setContactInfo(contacts[e.target.id].contacts);
  }

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2}>
            <Grid item xs={3}>
                {/* <Grid container spacing={2}> */}
                    {/* <Grid item xs={4} textAlign="center" sx={{ mt: 2 }}> */}
                    <Grid textAlign="center" sx={{ mt: 2 }}>
                    <Button variant="contained">Add Contact List</Button>
                    </Grid>
                    {/* </Grid> */}
                {/* </Grid> */}

                <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2, maxHeight: 200, overflow: 'auto'}}>
                    {/* {contacts[0].name} */}
                    {contacts.map((contact, index) => {
                        return(<Button onClick={populateContactInfo} id={index} variant="outlined" sx={{ my: 0.5 }}>{contact.name}</Button>);
                    })}
                </Stack>

            </Grid>
            <Grid item xs={7}>
                <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2 }}>
                    {contactInfo.map((contact, index) => {
                        return(<Button id={index} variant="outlined" sx={{ my: 0.5 }}>{contact.first_name + " " + contact.last_name + ": " + contact.email}</Button>);
                    })}
                </Stack>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Contacts;
