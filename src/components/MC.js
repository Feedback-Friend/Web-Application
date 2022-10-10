import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Choice from './choice';
import React from 'react';

function MC(props) {
  const { questions, setQuestions, index, empty, showMessage, hideMessage, updateTime } = props;

  // Updates the prompt of the MC question on change
  const updateMC = (index, e) => {
    let newArr = [...questions];
    newArr[index].prompt = e.target.value;
    setQuestions(newArr);

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    const func = async () => {
      await fetch("/updateMCQ/" + questions[index].id + "/" + e.target.value.trim(), requestOptions)
        .then(response => { return response.json() });
      await updateTime();
    }

    hideMessage("Saved", func, "updateMC" + questions[index].id);
  };

  // Deletes the MC question from the questions list and database
  const deleteMC = (index) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Deleting Question...");

    const func = async () => {
      await fetch("/deleteMCQ/" + questions[index].id, requestOptions)
        .then(response => { return response.json() });

      let newArr = [...questions];
      newArr.splice(index, 1);
      setQuestions(newArr);

      await updateTime();
    }

    hideMessage("Done", func, "deleteMCQ" + questions[index].id);
  };

  // Adds a choice to the MC question
  const addChoice = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Adding Choice...");

    const func = async () => {
      let req = await fetch("/addChoice/" + questions[index].id + "/", requestOptions)
        .then(response => { return response.json() });

      let newArr = [...questions];
      newArr[index].choices.push({ choice: "", id: req.result });
      setQuestions(newArr);

      await updateTime();
    }

    hideMessage("Done", func, "addChoice" + questions[index].id);
  };

  return (
    <Box>
      <TextField
        key={index}
        error={empty && !questions[index].prompt}
        onChange={(e) => updateMC(index, e)}
        value={questions[index].prompt}
        placeholder={"Q" + (index + 1)}
        margin="normal"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => deleteMC(index)} edge="end">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
          maxLength: 500
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
            showMessage={showMessage}
            hideMessage={hideMessage}
            updateTime={updateTime}
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
