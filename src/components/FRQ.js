import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import DragHandle from '@mui/icons-material/DragHandle';
import React from 'react';

function FRQ(props) {
  const { questions, setQuestions, index, empty, showMessage, hideMessage, updateTime, provided, snapshot } = props;

  // Updates the FRQ prompt on change
  const updateFRQ = (index, e) => {
    let newArr = [...questions];
    newArr[index].prompt = e.target.value;
    setQuestions(newArr);

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    const func = async () => {
      await fetch("/updateFRQ/" + questions[index].id + "/" + e.target.value.trim(), requestOptions)
        .then(response => { return response.json() });
      await updateTime();
    }

    hideMessage("Saved", func, "updateFRQ" + questions[index].id);
  };

  // Deletes the FRQ from the questions list and database
  const deleteFRQ = (index) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Deleting Question...");

    const func = async () => {
      await fetch("/deleteFRQ/" + questions[index].id, requestOptions)
        .then(response => { return response.json() });

      let newArr = [...questions];
      newArr.splice(index, 1);
      setQuestions(newArr);

      await updateTime();
    }

    hideMessage("Done", func, "deleteFRQ" + questions[index].id);
  };

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
        <DragHandle />
      </Grid>
      <Grid item xs={11}>
        <TextField
          style={{ backgroundColor: snapshot.isDragging ? 'ghostwhite' : 'transparent' }}
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
      </Grid>
    </Grid>
  );
}

export default FRQ;
