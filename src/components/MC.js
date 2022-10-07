import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Choice from './choice';
import React from 'react';

function MC(props) {
  const { questions, setQuestions, index, empty } = props;

  // Updates the prompt of the MC question on change
  const updateMC = (index) => (e) => {
    let newArr = [...questions];
    newArr[index].prompt = e.target.value;
    setQuestions(newArr);
  };

  // Deletes the MC question from the questions list
  const deleteMC = (index) => (e) => {
    let newArr = [...questions];
    newArr.splice(index, 1);
    setQuestions(newArr);
  };

  // Adds a choice to the MC question
  const addChoice = () => {
    let newArr = [...questions];
    newArr[index].choices.push({ choice: "" });
    setQuestions(newArr);
  };

  return (
    <Box>
      <TextField
        key={index}
        error={empty && !questions[index].prompt}
        onChange={updateMC(index)}
        value={questions[index].prompt}
        placeholder={"Q" + (index + 1)}
        margin="normal"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={deleteMC(index)} edge="end">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {questions[index].choices.map((choice, choiceIndex) => {
        return (
          <Choice
            questions={questions}
            setQuestions={setQuestions}
            index={index}
            choiceIndex={choiceIndex}
            empty={empty && choice.choice === ""}
            key={choiceIndex}
          />
        );
      })}
      <Button variant="contained" onClick={addChoice} sx={{ mt: 1 }} disabled={questions[index].choices.length === 26}>
        Add Choice
      </Button>
    </Box>
  );
}

export default MC;
