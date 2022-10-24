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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Nav from './nav';
import PreviewDialog from './previewDialog';

function CreateSurvey(props) {
  const { userID, update, showMessage, hideMessage, fromExisting, setFromExisting } = props;

  // Contains the name and id of the survey
  const [survey, setSurvey] = useState(JSON.parse(localStorage.getItem("survey")));

  // Contains survey questions
  const [questions, setQuestions] = useState([]);

  // Contains the names and ids of contact lists
  const [contactLists, setContactLists] = useState([]);

  // Contains the name and id of the selected contact list
  const [contactList, setContactList] = useState("");

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
      let req = await fetch("/addSurvey/" + userID + "/" + timeCreated + "/" + survey.name, requestOptions)
        .then(response => { return response.json() });

      localStorage.setItem("survey", JSON.stringify({ name: survey.name, id: req.result }));
      setSurvey({ name: survey.name, id: req.result });
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
      for (let question of questions) {
        let req = await fetch("/addQuestion/" + survey.id + "/" + question.type + "/" + question.prompt, requestOptions)
          .then(response => { return response.json() });
        const questionID = req.result;
        question.id = questionID;

        // If a question has choices (i.e. is a MCQ), add them to the database
        for (let choice in question.choices) {
          req = await fetch("/addChoice/" + questionID + "/" + question.choices[choice].choice, requestOptions)
            .then(response => { return response.json() });
          question.choices[choice].id = req.result;
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
    localStorage.setItem("survey", JSON.stringify({ name: e.target.value, id: survey.id }));
    setSurvey({ name: e.target.value, id: survey.id });

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
      let req = await fetch("/addFRQ/" + survey.id, requestOptions)
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
        let req = await fetch("/publishSurvey/" + survey.id, requestOptions)
          .then(response => { return response.json() });
      }

      hideMessage("Survey '" + survey.name + "' published", func, "publishSurvey");
      localStorage.setItem("survey", JSON.stringify({ name: "", id: -1 }));
    }
  };

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={8} lg={10}>
            {questions.map((question, index) => {
              return question.type === 0 ? (
                <FRQ
                  questions={questions}
                  setQuestions={setQuestions}
                  index={index}
                  empty={empty && !question.prompt}
                  showMessage={showMessage}
                  hideMessage={hideMessage}
                  updateTime={updateTime}
                  key={index}
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
                  key={index}
                />
              );
            })}
            {empty && (
              <Box>
                <Alert severity="error" sx={{ mt: 1 }}>
                  Please fill out all fields
                </Alert>
              </Box>
            )}
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={2}>
            <Stack textAlign="center" sx={{ position: "sticky", top: { xs: 75, sm: 85, md: 90, lg: 90, xl: 95 }, border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2 }}>
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
                    defaultValue=""
                    onChange={(e) => setContactList(e.target.value)}
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
                disabled={isEmpty || update.updating}
                component={Link}
                to="/"
                onClick={handleSubmit}
              >
                Publish
              </Button>
            </Stack>
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
    </Box>
  );
}

export default CreateSurvey;
