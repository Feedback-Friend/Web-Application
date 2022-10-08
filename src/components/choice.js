import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import React from 'react';

function Choice(props) {
  const { questions, setQuestions, index, choiceIndex, empty, showMessage, hideMessage } = props;

  // Updates the choice at the given index on change
  const updateChoice = async (choiceIndex, e) => {
    let newArr = [...questions];
    newArr[index].choices[choiceIndex].choice = e.target.value;
    setQuestions(newArr);

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    await fetch("/updateChoice/" + questions[index].choices[choiceIndex].id + "/" + e.target.value, requestOptions)
      .then(response => { return response.json() });

    hideMessage("Saved");
  };

  // Deletes the choice at the given index from its MC question
  const deleteChoice = async (choiceIndex) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    await fetch("/deleteChoice/" + questions[index].choices[choiceIndex].id, requestOptions)
      .then(response => { return response.json() });

    let newArr = [...questions];
    newArr[index].choices.splice(choiceIndex, 1);
    setQuestions(newArr);

    hideMessage("Saved");
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <RadioButtonUncheckedIcon sx={{ mr: 1 }} />
      <TextField
        key={choiceIndex}
        error={empty}
        value={questions[index].choices[choiceIndex].choice}
        placeholder={alphabet.charAt(choiceIndex)}
        onChange={(e) => updateChoice(choiceIndex, e)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={questions[index].choices.length === 2}
                onClick={() => deleteChoice(choiceIndex)}
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
}

export default Choice;
