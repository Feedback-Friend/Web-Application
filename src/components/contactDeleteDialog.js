import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import React from 'react';

// ALL of this was derived from MCDialog
function ContactDeleteDialog(props) {
  const { open, setOpen, currentCLID, currentContactID, contactList, setContactList, contactListIndex } = props;

  // backend function for deleting contacts
  function deleteContact(e) {
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)
    /*
    *
    * This is where we are calling backend component to register user.
    *
    */
    fetch("/deleteContact/" + currentContactID)
        .then(response => response.json())
        .then(data => {
          let temp1 = [...contactList];
          let temp2 = contactList[contactListIndex].contacts.filter(contact => contact.id !== currentContactID);
          temp1[contactListIndex].contacts = temp2;
          setContactList(temp1);
          setOpen(false);
        }).catch(error => {
            console.log(error);
        });
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Contact Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this contact from your contact list? Once it has been deleted, it cannot be recovered!
        </DialogContentText>
        <Grid container>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Stack>
              <Button variant="contained" color="error" onClick={deleteContact} sx={{ m: 2 }}>Yes</Button>
              <Button variant="outlined" onClick={() => setOpen(false)} sx={{ m: 2, mt: 0.5 }}>No</Button>
            </Stack>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ContactDeleteDialog;
