import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Clear from "@mui/icons-material/Clear";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import React from "react";

function Choice(props) {
  const { questions, setQuestions, index, choiceIndex, empty } = props;

  // Updates the choice at the given index on change
  const updateChoice = (choiceIndex) => (e) => {
    let newArr = [...questions];
    newArr[index].choices[choiceIndex] = e.target.value;
    setQuestions(newArr);
  };

  // Deletes the choice at the given index from its MC question
  const deleteChoice = (choiceIndex) => (e) => {
    let newArr = [...questions];
    newArr[index].choices.splice(choiceIndex, 1);
    setQuestions(newArr);
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
        value={questions[index].choices[choiceIndex]}
        placeholder={alphabet.charAt(choiceIndex)}
        onChange={updateChoice(choiceIndex)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={questions[index].choices.length === 2}
                onClick={deleteChoice(choiceIndex)}
                edge="end"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default Choice;
