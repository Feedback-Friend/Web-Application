import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import React from 'react';

function FRQ(props) {
  const { questions, setQuestions, index, empty, showMessage, hideMessage } = props;

  // Updates the FRQ prompt on change
  const updateFRQ = async (index, e) => {
    let newArr = [...questions];
    newArr[index].prompt = e.target.value;
    setQuestions(newArr);

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    await fetch("/updateFRQ/" + questions[index].id + "/" + e.target.value, requestOptions)
      .then(response => { return response.json() });

    hideMessage("Saved");
  };

  // Deletes the FRQ from the questions list and database
  const deleteFRQ = async (index) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    await fetch("/deleteFRQ/" + questions[index].id, requestOptions)
      .then(response => { return response.json() });

    let newArr = [...questions];
    newArr.splice(index, 1);
    setQuestions(newArr);

    hideMessage("Saved");
  };

  return (
    <TextField
      key={index}
      error={empty}
      onChange={(e) => updateFRQ(index, e)}
      value={questions[index].prompt}
      placeholder={"Q" + (index + 1)}
      margin="normal"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => deleteFRQ(index)} edge="end">
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
        maxLength: 500
      }}
    />
  );
}

export default FRQ;
