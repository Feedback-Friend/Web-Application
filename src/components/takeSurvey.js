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
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

function TakeSurvey() {
  let { id } = useParams();

  // Contains the name and id of the survey to be taken
  const [survey, setSurvey] = useState({ id: -1, name: "" });

  // Contains a list of questions for the survey to be taken
  const [questions, setQuestions] = useState([]);

  // Determines whether to display an error on submission if any of the questions are left unanswered
  const [unanswered, setUnanswered] = useState(false);

  // Gets the survey name and questions from the database. If the survey doesn't exist, displays an error message instead of questions.
  const getSurvey = useCallback(async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let name = await fetch("/getSurveyName/" + id, requestOptions)
      .then(response => { return response.json(); });
    if (!name) {
      setSurvey({ id: -1, name: "Sorry, the survey you're trying to access doesn't exist" });
      setQuestions([]);
    } else {
      let questions = await fetch("/getQuestionsAndChoices/" + id, requestOptions)
        .then(response => { return response.json(); });
      setQuestions(questions);

      setSurvey({ id: id, name: name });
    }
  }, [id, setSurvey, setQuestions]);

  // Retrieves the survey questions on component mount and whenever the id parameter changes
  useEffect(() => {
    getSurvey();
  }, [id, getSurvey]);

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
      for (const question of questions) {
        if (question.type == 1){
            console.log(question['choices'][question.response].choice)
            let func = async () => {
              let req = await fetch("/addSurveyResponse/"  + question.id + "/" + question['choices'][question.response].choice, requestOptions)
                .then(response => { return response.json()});
                console.log(req)
            }
            func()
        }else{
          let func = async () => {
            let req = await fetch("/addSurveyResponse/"  + question.id + "/" + question.response, requestOptions)
              .then(response => { return response.json()});
              console.log(req)
          }
          func()
        }
      }
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
    const primary = index + 1 + ". " + question.prompt;
    return (
      <ListItem key={question.id} sx={{ display: "inline-block" }}>
        <ListItemText primary={primary} />
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
                    value={choice.id}
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
    <List sx={{ width: 1 / 2, mx: "auto" }}>
      <Typography variant="h3" textAlign="center">{survey.name}</Typography>
      {prompts}
      {survey.id !== -1 && <Button
        variant="contained"
        component={Link}
        to="/endPage"
        onClick={handleSubmit}
        sx={{ ml: 2 }}
      >
        Submit
      </Button>}
    </List>
  );
}

export default TakeSurvey;