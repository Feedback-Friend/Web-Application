import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FRQ from './FRQ';
import MC from './MC';
import MCDialog from './MCDialog';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Nav from './nav';
import PreviewDialog from './previewDialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function CreateSurvey(props) {
  const { userID, update, showMessage, hideMessage, fromExisting, setFromExisting } = props;

  // Contains the name and id of the survey
  const [survey, setSurvey] = useState(JSON.parse(localStorage.getItem("survey")));

  // Contains survey questions
  // Data for frontend testing: { id: 1, type: 0, prompt: 'FRQ' }, { id: 0, type: 1, prompt: 'MC', choices: [{ id: 0, choice: 'a' }, { id: 1, choice: 'b' }] }
  const [questions, setQuestions] = useState([]);

  // Contains the names and ids of contact lists
  const [contactLists, setContactLists] = useState([]);

  // On survey submission, determines whether errors should be displayed (if there are any empty fields)
  const [empty, setEmpty] = useState(false);

  // Determines whether the Dialog component for creating MC questions is open or closed
  const [openMC, setOpenMC] = useState(false);

  // Determines whether the Dialog component for previewing surveys is open or closed
  const [openPreview, setOpenPreview] = useState(false);

  // Set to true upon creation of new survey/retrieval of existing survey questions from database to prevent infinite loop on rerender
  const hasUpdatedQuestions = useRef(false);
  const hasUpdatedSurvey = useRef(false);
  const hasUpdatedContactLists = useRef(false);

  // Gets the question types, prompts, and choices associated with an existing survey and populates the questions state
  const getFromExisting = useCallback(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Getting questions...");

    const func = async () => {
      let questions = await fetch("/getQuestionsAndChoices/" + survey.id, requestOptions)
        .then(response => { return response.json() });

      setQuestions(questions);
    }

    hideMessage("Done", func, "getQuestionsAndChoices");
  }, [survey.id, showMessage, hideMessage]);

  // Adds survey to the database
  const addSurvey = useCallback(() => {
    const timeCreated = new Date().getTime();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Creating Survey...");

    let func = async () => {
      let req = await fetch("/addSurvey/" + userID + "/" + survey.name + "/" + timeCreated, requestOptions)
        .then(response => { return response.json() });

      localStorage.setItem("survey", JSON.stringify({ name: survey.name, id: req.result, contactListID: -1 }));
      setSurvey({ name: survey.name, id: req.result, contactListID: -1 });
    }

    hideMessage("Done", func, "addSurvey");
  }, [setSurvey, survey.name, hideMessage, showMessage, userID]);

  // Creates a survey from an existing one
  const createFromExisting = useCallback(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving Questions...");

    let func = async () => {
      // Add questions
      for (let i in questions) {
        let req = await fetch("/addQuestion/" + survey.id + "/" + questions[i].type + "/" + questions[i].prompt + "/" + i, requestOptions)
          .then(response => { return response.json() });
        const questionID = req.result;
        questions[i].id = questionID;

        // If a question has choices (i.e. is a MCQ), add them to the database
        for (let j in questions[i].choices) {
          req = await fetch("/addChoice/" + questionID + "/" + questions[i].choices[j].choice + "/" + j, requestOptions)
            .then(response => { return response.json() });
          questions[i].choices[j].id = req.result;
        }
      }

      setFromExisting(false);
    }

    hideMessage("Done", func, "createFromExisting");
  }, [hideMessage, showMessage, survey.id, questions, setFromExisting]);

  // Gets contact lists from the database
  const getContactLists = useCallback(async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let contactLists = await fetch("/getContactLists/" + userID, requestOptions)
      .then(response => { return response.json(); });
    setContactLists(contactLists);
  }, [userID]);

  // Links the selected contact list to the survey
  const linkContactList = async (e) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    await fetch("/linkContactList/" + survey.id + "/" + e.target.value.id, requestOptions)
      .then(response => { return response.json(); });

    localStorage.setItem("survey", JSON.stringify({ name: survey.name, id: survey.id, contactListID: e.target.value.id }));
    setSurvey({ name: survey.name, id: survey.id, contactListID: e.target.value.id });
  }

  // Creates new surveys (from scratch or from existing) and gets questions from existing surveys (creation from existing or editing draft)
  useEffect(() => {
    // Only calls createFromExisting if the boolean 'fromExisting' is true and there are questions to add
    if (fromExisting && hasUpdatedSurvey.current && hasUpdatedQuestions.current) {
      createFromExisting();
    }

    // For surveys from existing, this is only called after the questions have been retrieved. Either way, it is only called once.
    if ((hasUpdatedQuestions.current && !hasUpdatedSurvey.current) || (!fromExisting && !hasUpdatedSurvey.current)) {
      // Add a new survey if from scratch or from existing
      if (survey.id === -1 || fromExisting) {
        addSurvey();
      }
      hasUpdatedSurvey.current = true;
    }

    // Only called once
    if (!hasUpdatedQuestions.current) {
      // Get existing survey questions
      if (survey.id !== -1) {
        getFromExisting();
      }
      hasUpdatedQuestions.current = true;
    }

    // Retrieves contact lists only once
    if (!hasUpdatedContactLists.current) {
      getContactLists();
      hasUpdatedContactLists.current = true;
    }
  }, [survey.id, fromExisting, getFromExisting, addSurvey, createFromExisting, getContactLists]);

  // Updates the time stored in the database after a survey is edited in any way
  const updateTime = async () => {
    const time = new Date().getTime();

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    await fetch("/updateTime/" + survey.id + "/" + time, requestOptions)
      .then(response => { return response.json() });
  };

  // Updates the survey name in both the survey state and the database
  const updateSurveyName = (e) => {
    localStorage.setItem("survey", JSON.stringify({ name: e.target.value, id: survey.id, contactListID: survey.contactListID }));
    setSurvey({ name: e.target.value, id: survey.id, contactListID: survey.contactListID });

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    let func = async () => {
      await fetch("/updateSurveyName/" + survey.id + "/" + e.target.value.trim(), requestOptions)
        .then(response => { return response.json() });
      await updateTime();
    }
    hideMessage("Saved", func, "updateName");
  }

  // Adds an FRQ question object to the questions state and the database
  const addFRQ = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Adding Question...");

    let func = async () => {
      let req = await fetch("/addFRQ/" + survey.id + "/" + questions.length, requestOptions)
        .then(response => { return response.json() });

      const question = {
        id: req.result,
        type: 0,
        prompt: "",
        choices: [],
      };

      setQuestions([...questions, question]);

      await updateTime();
    }

    hideMessage("Done", func, "addFRQ");
  };

  // Checks if no questions have been created or if any fields are empty, including survey name, question prompts, and MC choices.
  const isEmpty = questions.some(
    (question) =>
      question.prompt.trim() === "" ||
      (question.type === 1 &&
        question.choices.some((choice) => choice.choice.trim() === ""))
  ) || !survey.name.trim() || questions.length === 0;

  // On submission, prevents submission and displays errors if any fields are empty. Otherwise, adds the survey to the surveys list.
  const handleSubmit = (e) => {
    if (isEmpty) {
      e.preventDefault();
      setEmpty(true);
    } else {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      };

      showMessage("Publishing Survey...");

      let func = async () => {
        await fetch("/publishSurvey/" + survey.id, requestOptions)
          .then(response => { return response.json() });
        await fetch("/sendEmail/" + survey.id + "/" + survey.contactListID + "/" + userID)
          .then(response => { return response.json() });
        await updateTime();
      }

      hideMessage("Survey '" + survey.name + "' published", func, "publishSurvey");
      localStorage.setItem("survey", JSON.stringify({ name: "", id: -1, contactListID: -1 }));
    }
  };

  // Moves a list item originally located at startIndex to endIndex, and returns the new list
  const reorder = (list, startIndex, endIndex) => {
    const newArr = Array.from(list);
    const [removed] = newArr.splice(startIndex, 1);
    newArr.splice(endIndex, 0, removed);

    return newArr;
  }

  // Determines what operation should be done upon dropping a draggable question/choice.
  const onDragEnd = (result) => {
    if (!result.destination || result.source.index === result.destination.index) {
      // No drag occurred, or the question/choice was picked up and dropped in the same location
      return;
    } else if (result.type === "questions") {
      // Reorder the questions in both the state and the database
      const newQuestions = reorder(questions, result.source.index, result.destination.index);
      setQuestions(newQuestions);

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      };

      showMessage("Reordering...");

      let func = async () => {
        // Update the indices of the questions in the database. Only questions between the source index and destination index need to be updated
        for (let i = Math.min(result.source.index, result.destination.index); i <= Math.max(result.source.index, result.destination.index); i++) {
          let req = await fetch("/moveQuestion/" + newQuestions[i].id + "/" + i, requestOptions)
            .then(response => { return response.json() });
        }
      }

      hideMessage("Done", func, "moveQuestion");
    } else {
      // Reorder the choices in both the state and the database
      const newChoices = reorder(questions[result.type].choices, result.source.index, result.destination.index);
      let newQuestions = [...questions];
      newQuestions[result.type].choices = newChoices;
      setQuestions(newQuestions);

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      };

      showMessage("Reordering...");

      let func = async () => {
        // Update the indices of the choice in the database. Only choices between the source index and destination index need to be updated
        for (let i = Math.min(result.source.index, result.destination.index); i <= Math.max(result.source.index, result.destination.index); i++) {
          let req = await fetch("/moveChoice/" + newChoices[i].id + "/" + i, requestOptions)
            .then(response => { return response.json() });
        }
      }

      hideMessage("Done", func, "moveChoice");
    }
  };

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions" type="questions">
              {(provided) => (
                <Grid item xs={6} sm={6} md={9} {...provided.droppableProps} ref={provided.innerRef}>
                  {
                    questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={"question" + question.id} index={index} isDragDisabled={update.updating}>
                        {(provided, snapshot) => (
                          question.type === 0 ? (
                            <FRQ
                              questions={questions}
                              setQuestions={setQuestions}
                              index={index}
                              empty={empty && !question.prompt}
                              showMessage={showMessage}
                              hideMessage={hideMessage}
                              updateTime={updateTime}
                              provided={provided}
                              snapshot={snapshot}
                            />
                          ) : (
                            <MC
                              questions={questions}
                              setQuestions={setQuestions}
                              index={index}
                              empty={
                                empty &&
                                (!question.prompt ||
                                  question.choices.some((choice) => choice.choice === ""))
                              }
                              showMessage={showMessage}
                              hideMessage={hideMessage}
                              updateTime={updateTime}
                              provided={provided}
                              snapshot={snapshot}
                              isDragDisabled={update.updating}

                            />
                          )
                        )}
                      </Draggable>
                    ))
                  }
                  {empty && (
                    <Box>
                      <Alert severity="error" sx={{ mt: 1 }}>
                        Please fill out all fields
                      </Alert>
                    </Box>
                  )}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
          <Grid item xs={6} sm={6} md={3}>
            <Paper>
              <Stack textAlign="center" sx={{ position: "sticky", top: { xs: 75, sm: 85, md: 90, lg: 90, xl: 95 }, p: 2, mt: 2 }}>
                <TextField
                  autoFocus
                  error={!survey.name && empty}
                  label="Survey Name"
                  variant="outlined"
                  onChange={updateSurveyName}
                  value={survey.name}
                  inputProps={{ maxLength: 50 }}
                  disabled={!hasUpdatedQuestions.current || !hasUpdatedSurvey.current}
                />
                <Button
                  variant="contained"
                  onClick={addFRQ} sx={{ my: 2 }}
                  disabled={update.updating}
                >
                  + FRQ
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpenMC(true)} sx={{ mb: 2 }}
                  disabled={update.updating}
                >
                  + MC
                </Button>
                {contactLists.length === 0 ?
                  <Button variant="contained" sx={{ mb: 2 }} component={Link} to="/contacts">Create a Contact List</Button>
                  :
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Contact List</InputLabel>
                    <Select
                      label="Contact List"
                      value={contactLists.find(obj => { return obj.id === survey.contactListID })}
                      onChange={linkContactList}
                    >
                      {contactLists.map((contactList, index) => {
                        return (
                          <MenuItem value={contactList} key={contactList.id}>{contactList.name}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                }
                <Button
                  variant="contained"
                  disabled={isEmpty || update.updating}
                  onClick={() => setOpenPreview(true)} sx={{ mb: 2 }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  disabled={isEmpty || update.updating || survey.contactListID === -1}
                  component={Link}
                  to="/"
                  onClick={handleSubmit}
                >
                  Publish
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        <MCDialog
          open={openMC}
          setOpen={setOpenMC}
          questions={questions}
          setQuestions={setQuestions}
          surveyID={survey.id}
          showMessage={showMessage}
          hideMessage={hideMessage}
          updateTime={updateTime}
        />
        <PreviewDialog
          open={openPreview}
          setOpen={setOpenPreview}
          questions={questions}
          name={survey.name}
        />
        <Snackbar
          open={update.updating}
          message={update.message}
        />
      </Container>
    </Box >
  );
}

export default CreateSurvey;
