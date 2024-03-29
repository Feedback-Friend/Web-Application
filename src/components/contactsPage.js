import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import React from 'react';
import Nav from './nav';
import { TextField } from '@mui/material';
import ContactListDialog from './contactListDialog';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ContactDeleteDialog from './contactDeleteDialog';

function Contacts(props) {
  const [currentContactID, setCurrentContactID] = React.useState(-1); //current contact ID clicked
  const [currentCLID, setCurrentCLID] = React.useState(-1); //current contact list ID clicked
  const [contactListIndex, setContactListIndex] = React.useState(-1); //contact list index
  const [fields, setFields] = React.useState({}); //text fields values
  const [openDialog, setOpenDialog] = React.useState(false); //used to show/hide dialog box for removing contact list
  const [openContactDialog, setOpenContactDialog] = React.useState(false); //used to show/hide dialog box for removing contacts
  const contacts = props.contactList;

  // contact list 

  // Retrieves contact lists from the database if it is not already obtained
  React.useEffect(() => {
    props.getContactLists();
  }, []);

  // on contact list click
  function populateContactInfo(e) {
    setCurrentCLID(contacts[e.target.id].contact_list_id);
    setContactListIndex(e.target.id);
  }

  // on contact list delete click
  function deleteContactListDialog(e) {
    setCurrentCLID(contacts[e.target.id].contact_list_id);
    setOpenDialog(true);
  }

  // on contact delete click
  function deleteContactDialog(e) {
    setCurrentContactID(contacts[contactListIndex].contacts[e.target.id].id);
    setOpenContactDialog(true);
  }

  // update the text boxes' field variables
  function updateFields(event) {
    var name = event.target.name;
    var value = event.target.value;
    // only update value of credential that is actually updated
    setFields(fields => ({ ...fields, [name]: value }));
  }

  // add contact list function
  // DATABASE CALL
  function addContactListClicked(e) {
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)

    fetch("/addContactList/" + props.userID + "/" + fields.contactListName)
      .then(response => response.json())
      .then(data => {
        if (data.result !== "-1") {
          let temp = [...contacts];
          let tempVal = { 'contact_list_id': data.result, 'user_id': props.userID, 'contact_list_name': fields.contactListName, 'contacts': [] };
          temp.push(tempVal);
          props.setContactList(temp);
        }
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
        if (data.result !== "-1") {
          let temp = [...contacts];
          let temp2 = temp[contactListIndex].contacts;
          let tempVal = { "id": data.result, "first_name": fields.firstName, "last_name": fields.lastName, "email": fields.email };
          temp2.push(tempVal);
          props.setContactList(temp);
        }
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
            <Paper>
              <Stack sx={{ p: 2, mt: 2, height: 300, overflow: 'auto' }}>
                {(contacts.length == 0) && <Typography textAlign="center">No contact lists exist yet. Please add one below.</Typography>}
                {contacts.map((contact, index) => {
                  return (
                    <Grid container>
                      <Grid item xs={10}>
                        <Button onClick={populateContactInfo} id={index} variant="outlined" sx={{ my: 0.5, width: "100%" }}>
                          {contact.contact_list_name}
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button onClick={deleteContactListDialog} id={index} variant="outlined" sx={{ mx: 0, my: 0.5, minWidth: 0, width: "100%" }}>
                          -
                        </Button>
                      </Grid>
                    </Grid>
                  );
                })}
              </Stack>
            </Paper>
            <Grid item textAlign="center" sx={{ mt: 2 }}>
              <TextField name="contactListName" type="text" label="Contact List Name" variant="outlined" onChange={updateFields} required />
            </Grid>
            <Grid textAlign="center" sx={{ mt: 2 }}>
              <Button variant="contained" onClick={addContactListClicked}>Add Contact List</Button>
            </Grid>
          </Grid>

          <Grid item xs={1} />

          {
            //if contactListIndex is not populated yet, then do not show contact information
            (contactListIndex != -1) &&
            <Grid item xs={7}>
              <Paper>
                <Stack sx={{ p: 2, mt: 2, height: 300 }}>
                  {contacts[contactListIndex].contacts.map((contact, index) => {
                    return (
                      <Grid container>
                        <Grid item xs={10}>
                          <Button id={index} variant="outlined" sx={{ my: 0.5, width: "100%" }}>
                            {contact.first_name + " " + contact.last_name + ": " + contact.email}
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={deleteContactDialog} id={index} variant="outlined" sx={{ mx: 0, my: 0.5, minWidth: 0, width: "100%" }}>
                            -
                          </Button>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
              </Paper>
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
        <ContactListDialog
          open={openDialog}
          setOpen={setOpenDialog}
          currentCLID={currentCLID}
          contactList={contacts}
          setContactList={props.setContactList}
          setContactListIndex={setContactListIndex}
        />
        <ContactDeleteDialog
          open={openContactDialog}
          setOpen={setOpenContactDialog}
          currentCLID={currentCLID}
          currentContactID={currentContactID}
          contactList={contacts}
          setContactList={props.setContactList}
          contactListIndex={contactListIndex}
        />
      </Container>
    </Box>
  );
}

export default Contacts;
