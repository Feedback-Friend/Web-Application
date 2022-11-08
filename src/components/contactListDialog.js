import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import React from 'react';

// ALL of this was derived from MCDialog
function ContactListDialog(props) {
  const { open, setOpen } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Multiple Choice Question</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a multiple choice question from scratch or choose from a list of suggestions.
        </DialogContentText>
        <Stack sx={{ m: 2 }}>
          <Button
            variant="contained"
          >
            From Scratch
          </Button>
          <FormControl sx={{ mt: 4 }}>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
            >
              From Suggestion
            </Button>
          </FormControl>
          <Button variant="contained" sx={{ mt: 4 }}>Add suggestion</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ContactListDialog;
