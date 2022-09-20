import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import React, { useState } from 'react';

function MCDialog(props) {
  const { open, setOpen, questions, setQuestions } = props;

  // If creating MC from suggestion, contains string corresponding to the chosen suggestion
  const [choice, setChoice] = useState("");

  // 
  const [error, setError] = useState(false);

  // Closes the Dialog component
  const handleClose = () => {
    setOpen(false);
  };

  // Removes the error message and updates the choice state with the chosen suggestion
  const handleChange = (e) => {
    setError(false);
    setChoice(e.target.value);
  };

  /*
  Based on the string passed (empty string for creating from scratch, suggestion string for creating from suggestion),
  creates a new MC question with the proper list of choices and adds it to the questions list.
  */
  const addMC = (choice) => {
    let choices;
    switch (choice) {
      case "":
        choices = ["", ""];
        break;
      case "Y/N":
        choices = ["Yes", "No"];
        break;
      case "T/F":
        choices = ["True", "False"];
        break;
      case "A/D":
        choices = ["Agree", "Disagree"];
        break;
      case "SA/A/NAND/D/SD":
        choices = [
          "Strongly Agree",
          "Agree",
          "Neither Agree nor Disagree",
          "Disagree",
          "Strongly Disagree",
        ];
        break;
      default:
        break;
    }

    const question = {
      type: "MC",
      prompt: "",
      choices: choices,
    };

    setQuestions([...questions, question]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Multiple Choice Question</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a multiple choice question from scratch or choose from common
          answer choices.
        </DialogContentText>
        <Stack
          direction="column"
          alignItems="stretch"
          justifyContent="center"
          sx={{ m: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => {
              addMC("");
            }}
          >
            From Scratch
          </Button>
          <FormControl sx={{ mt: 4 }}>
            <InputLabel>Choices</InputLabel>
            <Select
              error={error}
              value={choice}
              label="Choices"
              onChange={handleChange}
            >
              <MenuItem value="Y/N">Yes/No</MenuItem>
              <MenuItem value="T/F">True/False</MenuItem>
              <MenuItem value="A/D">Agree/Disagree</MenuItem>
              <MenuItem value="SA/A/NAND/D/SD">
                Strongly Agree/Agree/Neither Agree nor
                Disagree/Disagree/Strongly Disagree
              </MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={() => {
                if (!choice) {
                  setError(true);
                  return;
                }
                addMC(choice);
              }}
              sx={{ mt: 1 }}
            >
              From Suggestion
            </Button>
          </FormControl>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default MCDialog;
