import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import React from 'react';
import Nav from './nav';
import { TextField } from '@mui/material';

function Contacts(props) {
  const [currentCLID, setCurrentCLID] = React.useState(-1); //current contact list ID clicked
  const [contactInfo, setContactInfo] = React.useState([]); //second column contacts
  const [fields, setFields] = React.useState({}); //text fields values
  const contacts = props.contactList;

  // Retrieves contact lists from the database if it is not already obtained
  React.useEffect(() => {
    props.getContactLists();
  }, []);

  function populateContactInfo(e) {
    setCurrentCLID(contacts[e.target.id].contact_list_id);
    setContactInfo(contacts[e.target.id].contacts);
  }

  // update the text boxes' field variables
  function updateFields(event) {
    var name = event.target.name;
    var value = event.target.value;
    // only update value of credential that is actually updated
    setFields(fields => ({...fields, [name]: value}));
  }

  // add contact list function
  function addContactListClicked(event) {
    alert(fields["contactListName"]);
  }

  function addContactListClicked(e) {
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)

    fetch("/addContactList/" + <userID>/<contactListName>)
        .then(response => response.json())
        .then(data => {
            alert(data.result + " is new contact id");
        }).catch(error => {
            console.log(error);
        });
  }

  // add contact function
  // DATABASE CALL
  function addContactClicked(e) {
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)

    fetch("/addContact/" + currentCLID + "/" + fields.firstName + "/" + fields.lastName + "/" + fields.email)
        .then(response => response.json())
        .then(data => {
            alert(data.result + " is new contact id");
        }).catch(error => {
            console.log(error);
        });
  }

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2}>
            <Grid item xs={3}>
              {currentCLID}
              <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2, height: 300, overflow: 'auto'}}>
                {(contacts.length == 0) && <div>No contact lists exist yet. Please add one below.</div>}
                {contacts.map((contact, index) => {
                    return(<Button onClick={populateContactInfo} id={index} variant="outlined" sx={{ my: 0.5 }}>{contact.contact_list_name}</Button>);
                })}
              </Stack>
              <Grid item textAlign="center" sx={{ mt: 2 }}>
                <TextField name="contactListName" type="text" label="Contact List Name" variant="outlined" onChange={updateFields} required />
              </Grid>
              <Grid textAlign="center" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={addContactListClicked}>Add Contact List</Button>
              </Grid>
            </Grid>

            <Grid item xs={1} />
            
            {
            //if contactInfo is not populated yet, then do not show contact information
            (contactInfo.length != 0) &&
            <Grid item xs={7}>
                <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2, height: 300 }}>
                    {contactInfo.map((contact, index) => {
                        return(<Button id={index} variant="outlined" sx={{ my: 0.5 }}>{contact.first_name + " " + contact.last_name + ": " + contact.email}</Button>);
                    })}
                </Stack>
                <Grid container sx={{ mt: 2 }}>
                  <Grid item xs={4} textAlign="left">
                    <TextField name="firstName" type="text" label="First Name" variant="outlined" onChange={updateFields} required />
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <TextField name="lastName" type="text" label="Last Name" variant="outlined" onChange={updateFields} required />
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <TextField name="email" type="text" label="Email" variant="outlined" onChange={updateFields} required />
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }} textAlign="center">
                  <Button variant="contained" onClick={addContactClicked}>Add Contact</Button>
                </Grid>
            </Grid>
            }
        </Grid>
      </Container>
    </Box>
  );
}

export default Contacts;
