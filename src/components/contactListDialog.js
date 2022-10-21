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
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import React, { useState } from 'react';

// TODO: fix ALL of this file

function ContactListDialog(props) {
  const { open, setOpen, questions, setQuestions, surveyID, showMessage, hideMessage, updateTime } = props;

  // If creating MC from suggestion, contains string corresponding to the chosen suggestion
  const [suggestion, setSuggestion] = useState("");

  // Determines whether the form to add a new suggestion should be displayed
  const [openAddSuggestion, setOpenAddSuggestion] = useState(false);

  // Contains the name for the new suggestion
  const [suggestionName, setSuggestionName] = useState("");

  // Contains the choices for the new suggestion
  const [suggestionChoices, setSuggestionChoices] = useState(["", ""]);

  // On submitting an added suggestion, shows an error if any of the forms for creating a new suggestion are empty
  const [empty, setEmpty] = useState(false);

  // On attempting to create from suggestion, shows an error if a suggestion hasn't been selected from the Select component
  const [noSelection, setNoSelection] = useState(false);

  // Removes the error message and sets the name of the chosen suggestion
  const handleChange = (e) => {
    setNoSelection(false);
    setSuggestion(e.target.value);
  };

  // Adds a choice to the suggestionChoices state
  const addChoice = () => {
    let newArr = [...suggestionChoices];
    newArr.push("");
    setSuggestionChoices(newArr);
  };

  // Updates the choice at the given index on change
  const updateChoice = (index) => (e) => {
    let newArr = [...suggestionChoices];
    newArr[index] = e.target.value;
    setSuggestionChoices(newArr);
  };

  // Deletes the choice at the given index from the suggestionChoices state
  const deleteChoice = (index) => (e) => {
    let newArr = [...suggestionChoices];
    newArr.splice(index, 1);
    setSuggestionChoices(newArr);
  };

  /*
  When the add suggestion button is clicked, displays the form for adding suggestions if it is not yet displayed. Otherwise, adds the suggestion to the database,
  or displays an error message if any part of the form isn't filled out.
  */
  const addSuggestion = (e) => {
    if (!openAddSuggestion) {
      setOpenAddSuggestion(true);
    } else {
      if (!suggestionName.trim() || suggestionChoices.some((choice) => choice.trim() === "")) {
        setEmpty(true);
      } else {
        /* TODO: Add suggestion to database */
        console.log(suggestionName);
        console.log(suggestionChoices);
        setOpenAddSuggestion(false);
      }
    }
  }

  /*
  Based on the string passed (empty string for creating from scratch, suggestion string for creating from suggestion),
  creates a new MC question with the proper list of choices and adds it to the questions list.
  */
  const addMC = (suggestion) => {
    let choices;
    switch (suggestion) {
      case "":
        choices = [{ choice: "" }, { choice: "" }];
        break;
      case "Y/N":
        choices = [{ choice: "Yes" }, { choice: "No" }];
        break;
      case "T/F":
        choices = [{ choice: "True" }, { choice: "False" }];
        break;
      case "A/D":
        choices = [{ choice: "Agree" }, { choice: "Disagree" }];
        break;
      case "SA/A/NAND/D/SD":
        choices = [
          { choice: "Strongly Agree" },
          { choice: "Agree" },
          { choice: "Neither Agree Nor Disagree" },
          { choice: "Disagree" },
          { choice: "Strongly Disagree" },
        ];
        break;
      default:
        break;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    setOpen(false);
    showMessage("Adding Question...");

    const func = async () => {
      // Add multiple choice question to database
      let req = await fetch("/addMCQ/" + surveyID, requestOptions)
        .then(response => { return response.json() });
      const questionID = req.result;
      for (let choice of choices) {
        // Add choice to database
        req = await fetch("/addChoice/" + questionID + "/" + choice.choice, requestOptions)
          .then(response => { return response.json() });
        choice.id = req.result;
      }

      const question = {
        id: questionID,
        type: 1,
        prompt: "",
        choices: choices,
      };

      setQuestions([...questions, question]);

      await updateTime();
    }

    hideMessage("Done", func, "addMC");
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
            onClick={() => {
              addMC("");
            }}
          >
            From Scratch
          </Button>
          <FormControl sx={{ mt: 4 }}>
            <InputLabel>Suggestions</InputLabel>
            <Select
              error={noSelection}
              value={suggestion}
              label="Suggestions"
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
                if (!suggestion) {
                  setNoSelection(true);
                  return;
                }
                addMC(suggestion);
              }}
              sx={{ mt: 1 }}
            >
              From Suggestion
            </Button>
          </FormControl>
          {openAddSuggestion &&
            <Box>
              <TextField
                value={suggestionName}
                placeholder="Suggestion Name"
                onChange={(e) => setSuggestionName(e.target.value)}
                error={empty && !suggestionName}
                fullWidth
                sx={{ mt: 4 }}
                inputProps={{ maxLength: 50 }}
              />
              {suggestionChoices.map((choice, index) => {
                return (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                    key={index}
                  >
                    <RadioButtonUncheckedIcon sx={{ mr: 1 }} />
                    <TextField
                      value={choice}
                      placeholder={alphabet.charAt(index)}
                      onChange={updateChoice(index)}
                      error={empty && !choice}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              disabled={suggestionChoices.length === 2}
                              onClick={deleteChoice(index)}
                              edge="end"
                            >
                              <Clear />
                            </IconButton>
                          </InputAdornment>
                        ),
                        maxLength: 500
                      }}
                    />
                  </Box>
                );
              })}
              <Button variant="contained" onClick={addChoice} sx={{ mt: 1 }} disabled={suggestionChoices.length === 26}>
                Add Choice
              </Button>
            </Box>
          }
          <Button variant="contained" onClick={addSuggestion} sx={{ mt: 4 }}>Add suggestion</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ContactListDialog;
