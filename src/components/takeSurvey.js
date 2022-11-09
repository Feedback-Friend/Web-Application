import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowCircleRightOutlined from '@mui/icons-material/ArrowCircleRightOutlined';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

function TakeSurvey() {
  let { id } = useParams();

  // Contains the name and id of the survey to be taken
  const [survey, setSurvey] = useState({ id: -1, name: "" });

  // Contains a list of questions for the survey to be taken
  const [questions, setQuestions] = useState([]);

  // Contains the email inputted into the text field
  const [email, setEmail] = useState('');

  // Determines whether to display an error on submission if any of the questions are left unanswered
  const [unanswered, setUnanswered] = useState(false);

  // Determines whether to display an error if the email is invalid. Email is invalid if not in contact list or has already taken survey
  const [invalid, setInvalid] = useState(false);

  // Gets the survey name and questions from the database. If the survey doesn't exist, displays an error message instead of questions.
  const getSurveyName = useCallback(async () => {
    setQuestions([]);

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let req = await fetch("/getSurveyNameAndStatus/" + id, requestOptions)
      .then(response => { return response.json(); });
    if (req.status === 0) {
      setSurvey({ id: -1, name: "Sorry, the survey you're trying to access doesn't exist" });
    } else {
      setSurvey({ id: id, name: req.name });
    }
  }, [id, setSurvey, setQuestions]);

  // Check the provided email against the Regex from emailregex.com
  const isValidEmail = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);

  // If the provided email is in the contact list and hasn't taken the survey yet, retrieve the survey questions
  const getQuestions = async (e) => {
    setInvalid(false);

    if (!email) {
      e.preventDefault();
      setUnanswered(true);
    } else {
      if (isValidEmail) {
        setUnanswered(false);

        /* TODO: check if email is in contact list and hasn't taken survey yet */
        if (true) {
          setInvalid(false);

          // Retrieve survey questions
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          };

          let questions = await fetch("/getQuestionsAndChoices/" + id, requestOptions)
            .then(response => { return response.json(); });
          setQuestions(questions);
        } else {
          setInvalid(true);
        }
      }
    }
  }

  // Retrieves the survey questions on component mount and whenever the id parameter changes
  useEffect(() => {
    getSurveyName();
  }, [getSurveyName]);

  // On submission, prevents submission and displays an error if any questions are left unanswered. Otherwise, adds the list of responses to the survey just taken in the 'surveys' state.
  const handleSubmit = (e) => {
    const unanswered = questions.some((question) => !question.response);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    if (unanswered) {
      e.preventDefault();
      setUnanswered(unanswered);
    } else {
      const time = new Date().getTime();

      for (const question of questions) {
        let func = async () => {
          let req = await fetch("/addQuestionResponse/" + question.id + "/" + question.response + "/" + time, requestOptions)
            .then(response => { return response.json() });
          console.log(req)
        }
        func()
      }
      // TODO: set a flag preventing the provided email from taking the survey again
    }
  };

  // Sets the response for each question. For FRQ, response is a string, and for MC, response is the integer index of the selected choice.
  const setResponse = (index) => (e) => {
    let newArr = [...questions];
    newArr[index].response = e.target.value;
    setQuestions(newArr);
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Displays the list of question prompts and either a TextField or RadioGroup depending on whether the question is FRQ or MC.
  const prompts = questions.map((question, index) => {
    const prompt = index + 1 + ". " + question.prompt;
    return (
      <ListItem key={question.id} sx={{ display: "inline-block" }}>
        <ListItemText primary={prompt} />
        {question.type === 0 ? (
          <TextField
            error={unanswered && !question.response}
            onChange={setResponse(index)}
            margin="normal"
            fullWidth
          />
        ) : (
          <FormControl error={unanswered && !question.response}>
            <RadioGroup onChange={setResponse(index)}>
              {question.choices.map((choice, index) => {
                return (
                  <FormControlLabel
                    key={choice.id}
                    value={choice.choice}
                    control={<Radio />}
                    label={alphabet.charAt(index) + ". " + choice.choice}
                  />
                );
              })}
              {unanswered && !question.response && (
                <FormHelperText>Please select an option</FormHelperText>
              )}
            </RadioGroup>
          </FormControl>
        )}
      </ListItem>
    );
  });

  return (
    <Container>
      <Typography variant="h3" textAlign="center">{survey.name}</Typography>
      {survey.id !== -1 && (questions.length === 0 ?
        <Box textAlign="center">
          <Typography variant="h5">Please enter your email</Typography>
          <TextField
            sx={{ width: 1 / 2 }}
            error={(!email && unanswered) || invalid || (email && !isValidEmail)}
            onChange={(e) => {
              setInvalid(false);
              setEmail(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                getQuestions();
              }
            }}
            placeholder="Email"
            helperText={(invalid && "Error. Are you using the right email, and is this your first time taking the survey?") || (email && !isValidEmail && "Please enter a valid email address")}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={getQuestions} edge="end">
                    <ArrowCircleRightOutlined />
                  </IconButton>
                </InputAdornment>
              ),
              maxLength: 50
            }}
          />
        </Box>
        :
        <Box>
          <List>
            {prompts}
            < Button
              variant="contained"
              component={Link}
              to="/endPage"
              onClick={handleSubmit}
              sx={{ ml: 2 }}
            >
              Submit
            </Button>
          </List>
        </Box>
      )}
    </Container>
  );
}

export default TakeSurvey;