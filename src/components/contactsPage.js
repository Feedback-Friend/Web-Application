import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import React from 'react';
import Nav from './nav';
import { TextField } from '@mui/material';
import ContactListDialog from './contactListDialog';

function Contacts(props) {
  const [currentCLID, setCurrentCLID] = React.useState(-1); //current contact list ID clicked
  const [contactInfo, setContactInfo] = React.useState(-1); //contact list index
  const [fields, setFields] = React.useState({}); //text fields values
  const [openDialog, setOpenDialog] = React.useState(false); //used to show/hide dialog box for removing contact list
  const contacts = props.contactList;

  // Retrieves contact lists from the database if it is not already obtained
  React.useEffect(() => {
    props.getContactLists();
  }, []);

  function populateContactInfo(e) {
    setCurrentCLID(contacts[e.target.id].contact_list_id);
    setContactInfo(e.target.id);
    // setContactInfo(contacts[e.target.id].contacts);
  }

  // update the text boxes' field variables
  function updateFields(event) {
    var name = event.target.name;
    var value = event.target.value;
    // only update value of credential that is actually updated
    setFields(fields => ({...fields, [name]: value}));
  }

  // add contact list function
  // DATABASE CALL
  function addContactListClicked(e) {
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)

    fetch("/addContactList/" + props.userID + "/" + fields.contactListName)
        .then(response => response.json())
        .then(data => {
          let temp = [...contacts];
          let tempVal = {'contact_list_id': data.result, 'user_id': props.userID, 'contact_list_name': fields.contactListName, 'contacts': []};
          temp.push(tempVal);
          props.setContactList(temp);
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
          let temp = [...contacts];
          let temp2 = temp[contactInfo].contacts;
          let tempVal = {"id": data.result, "first_name": fields.firstName, "last_name": fields.lastName, "email": fields.email};
          temp2.push(tempVal);
          props.setContactList(temp);
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
              <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2, height: 300, overflow: 'auto'}}>
                {(contacts.length == 0) && <div>No contact lists exist yet. Please add one below.</div>}
                {contacts.map((contact, index) => {
                    return (
                      <Grid container>
                        <Grid item xs={10}>
                          <Button onClick={populateContactInfo} id={index} variant="outlined" sx={{ my: 0.5, width: "100%" }}>
                            {contact.contact_list_name}
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={() => setOpenDialog(true)} id={index} variant="outlined" sx={{ mx: 0, my: 0.5, minWidth: 0, width: "100%"}}>
                            -
                          </Button>
                        </Grid>
                      </Grid>
                    );
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
            (contactInfo != -1) &&
            <Grid item xs={7}>
                <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2, height: 300 }}>
                    {contacts[contactInfo].contacts.map((contact, index) => {
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
        <ContactListDialog
          open={openDialog}
          setOpen={setOpenDialog}
        />
      </Container>
    </Box>
  );
}

export default Contacts;
