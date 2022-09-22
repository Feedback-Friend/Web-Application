import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import React from 'react';

function FRQ(props) {
  const { questions, setQuestions, index, empty } = props;

  // Updates the FRQ prompt on change
  const updateFRQ = (index) => (e) => {
    let newArr = [...questions];
    newArr[index].prompt = e.target.value;
    setQuestions(newArr);
  };

  // Deletes the FRQ from the questions list
  const deleteFRQ = (index) => (e) => {
    let newArr = [...questions];
    newArr.splice(index, 1);
    setQuestions(newArr);
  };

  return (
    <TextField
      key={index}
      error={empty}
      onChange={updateFRQ(index)}
      value={questions[index].prompt}
      placeholder={"Q" + (index + 1)}
      margin="normal"
      autoFocus
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={deleteFRQ(index)} edge="end">
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default FRQ;
