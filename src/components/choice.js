import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import React from 'react';

function Choice(props) {
  const { questions, setQuestions, index, choiceIndex, empty, showMessage, hideMessage, updateTime, provided, snapshot } = props;

  // Updates the choice at the given index on change
  const updateChoice = (choiceIndex, e) => {
    let newArr = [...questions];
    newArr[index].choices[choiceIndex].choice = e.target.value;
    setQuestions(newArr);

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    const func = async () => {
      await fetch("/updateChoice/" + questions[index].choices[choiceIndex].id + "/" + e.target.value.trim(), requestOptions)
        .then(response => { return response.json() });
      await updateTime();
    }

    hideMessage("Saved", func, "updateChoice" + questions[index].choices[choiceIndex].id);
  };

  // Deletes the choice at the given index from its MC question
  const deleteChoice = (choiceIndex) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Deleting Choice...");

    const func = async () => {
      await fetch("/deleteChoice/" + questions[index].choices[choiceIndex].id, requestOptions)
        .then(response => { return response.json() });

      let newArr = [...questions];
      newArr[index].choices.splice(choiceIndex, 1);
      setQuestions(newArr);

      await updateTime();
    }

    hideMessage("Done", func, "deleteChoice" + questions[index].choices[choiceIndex].id);
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function getStyle(style, isDragging) {
    let transform = 'none';
    if (style?.transform) {
      transform = `translate(0px, ${style.transform.split(',').pop()}`;
    }
    return {
      ...style,
      transform: transform,
      zIndex: 100,
      opacity: isDragging ? 0.5 : 1
    };
  }

  return (
    <Grid container
      direction="row"
      alignItems="center"
      ref={provided.innerRef}
      snapshot={snapshot}
      {...provided.draggableProps}
      style={getStyle(provided.draggableProps.style, snapshot.isDragging)}
    >
      <Grid item xs={1} sx={{ display: { xs: 'none', md: 'inline' } }} {...provided.dragHandleProps}>
        <RadioButtonUncheckedIcon />
      </Grid>
      <Grid item xs={11}>
        <TextField
          sx={{ backgroundColor: 'white' }}
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
      </Grid>
    </Grid>
  );
}

export default Choice;
