import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import React from 'react';

// ALL of this was derived from MCDialog
function ContactListDialog(props) {
  const { open, setOpen, currentCLID, contactList, setContactList, setContactInfo } = props;

  // contains username and password when submitted
  function deleteContactList(e) {
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)
    /*
    *
    * This is where we are calling backend component to register user.
    *
    */
    fetch("/deleteContactLists/" + currentCLID)
        .then(response => response.json())
        .then(data => {
          let temp = contactList.filter(contact => contact.contact_list_id !== currentCLID);
          setContactInfo(-1);
          setContactList(temp);
          setOpen(false);
        }).catch(error => {
            console.log(error);
        });
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Contact List Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this contact list? Once it has been deleted, it cannot be recovered! ({currentCLID})
        </DialogContentText>
        <Grid container>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Stack>
              <Button variant="contained" color="error" onClick={deleteContactList} sx={{ m: 2 }}>Yes</Button>
              <Button variant="outlined" onClick={() => setOpen(false)} sx={{ m: 0.5 }}>No</Button>
            </Stack>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ContactListDialog;
