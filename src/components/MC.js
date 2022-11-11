import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DragHandle from '@mui/icons-material/DragHandle';
import Choice from './choice';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

function MC(props) {
  const { questions, setQuestions, index, empty, showMessage, hideMessage, updateTime, provided, snapshot, isDragDisabled } = props;

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
      await fetch("/updateMCQ/" + questions[index].id + "/" + e.target.value.trim().replace('?', "%3f"), requestOptions)
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
      let req = await fetch("/addChoice/" + questions[index].id + "/" + questions[index].choices.length, requestOptions)
        .then(response => { return response.json() });

      let newArr = [...questions];
      newArr[index].choices.push({ choice: "", id: req.result });
      setQuestions(newArr);

      await updateTime();
    }

    hideMessage("Done", func, "addChoice" + questions[index].id);
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
      style={getStyle(provided.draggableProps.style, snapshot.isDragging)}>
      <Grid item xs={1} sx={{ display: { xs: 'none', md: 'inline' } }} {...provided.dragHandleProps}>
        <DragHandle />
      </Grid>
      <Grid item xs={11}>
        <TextField
          style={{ backgroundColor: snapshot.isDragging ? 'ghostwhite' : 'transparent' }}
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
      </Grid>
      <Grid item xs={1} />
      <Droppable droppableId={"question" + questions[index].id} type={index}>
        {(provided) => (
          <Grid item xs={11} {...provided.droppableProps} ref={provided.innerRef}>
            {questions[index].choices.map((choice, choiceIndex) => (
              <Draggable key={choice.id} draggableId={"choice" + choice.id} index={choiceIndex} isDragDisabled={isDragDisabled}>
                {(provided, choiceSnapshot) => (
                  <Choice
                    questions={questions}
                    setQuestions={setQuestions}
                    index={index}
                    choiceIndex={choiceIndex}
                    empty={empty && choice.choice === ""}
                    showMessage={showMessage}
                    hideMessage={hideMessage}
                    updateTime={updateTime}
                    provided={provided}
                    snapshot={choiceSnapshot}
                    isDragging={snapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Grid>)}
      </Droppable>
      <Grid item xs={1} />
      <Grid item xs={11}>
        <Button variant="contained" onClick={addChoice} sx={{ mt: 1 }} disabled={questions[index].choices.length === 26}>
          Add Choice
        </Button>
      </Grid>
    </Grid>
  );
}

export default MC;
