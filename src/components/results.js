import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Nav from './nav';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

function Results(props) {
  const { surveys } = props;

  // Contains the chosen survey
  const [survey, setSurvey] = useState('');

  // Contains the chosen question
  const [question, setQuestion] = useState('');
  const [questionNames, setQuestionNames] = React.useState([{}])
  // Contains a list of the number of responses for each choice, if the currently chosen question is MC
  const [counts, setCounts] = useState([]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [frq, setFRQ] = React.useState([])

  // Contains the data to be displayed on the bar graph (letter and number of responses for that letter).
  const data = counts.map((count, index) => {
    return (
      {
        name: alphabet.charAt(index),
        count: count
      }
    )
  });

    console.log("hi")
    console.log('survey', survey)
    console.log('survyes', surveys)

    useEffect(() => {
      const fetch_and_set = async () => {
          const response = await fetch('/getSurveyResults/' + 4)
          const survey_info = await response.json()
          setFRQ(survey_info)
          const questionsresponse = await fetch('/getQuestions/' + 1)
          const questions_info = await questionsresponse.json()
          setQuestionNames(questions_info)
          console.log('questions_info', questionNames)
          console.log('questions_info', questions_info)
          console.log(survey_info)
          console.log('frq', frq)
      }
      fetch_and_set()
  }, []);


  // If the chosen question is MC, determines the number of responses for each choice and updates the 'counts' state
  const handleQuestion = (e) => {
    setQuestion(e.target.value);
    if (survey.questions[e.target.value].type === 1) {
      let newArr = [...counts];
      survey.questions[e.target.value].choices.map((choice, index) => {
        newArr[index] = 0;
      });
      survey.responses.map((response, index) => {
        newArr[response[e.target.value]]++;
      });
      setCounts(newArr);
    }
  };

  const columns = [
    { field: 'prompt', headerName: 'prompt', width: 150 },
    { field: 'result', headerName: 'result', width: 150 },
  ];

  function createDataFRQ(id, prompt, result) {
    return {id, prompt, result};
  }
  function parseJSONFRQ(projects){
    console.log('projects', projects)
    const rows = []
    for (let i=0; i < Object.keys(projects).length; i++){ //not correct length
      console.log('projects[i]', projects[i]['response_list'].length)
      console.log('questionString', questionNames)
      let questionString = questionNames[i]['prompt']
      console.log('questionString', questionString)
      for (let i = 0; i < 1; i++){
        console.log('projects[response]', projects[i]['response_list'][i]['reply'])
        rows.push(createDataFRQ(i, questionString, projects[i]['response_list'][i]['reply']));
      }
    }
    console.log("rows", rows)
    return rows; 
  }  

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Survey</InputLabel>
              <Select
                label="Survey"
                onChange={(e) => setSurvey(e.target.value)}
                defaultValue=""
              >
                {surveys.map((survey, index) => {
                  return (
                    <MenuItem key={index} value={survey}>
                      {survey.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
          <div style={{ height: 400, width: '100%', float: 'left' }}>
              <DataGrid
                rows={parseJSONFRQ(frq)}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}   
              />
              </div>
          </Grid>
          {/* {survey && <Grid item xs={8}> */}
            {/* <FormControl fullWidth>
              <InputLabel>Question</InputLabel>
              <Select
                label="Question"
                onChange={handleQuestion}
                defaultValue=""
              >
                {survey.questions.map((question, index) => {
                  return (
                    <MenuItem key={index} value={index}>{question.prompt}</MenuItem>
                  );
                })}
              </Select>
            </FormControl> */}
            {/* {question !== "" && (survey.questions[question].type === 0 ? (<List>
              {survey.responses.map((response, index) => {
                return (
                  <Box key={index}>
                    {index > 0 && <Divider />}
                    <ListItem key={index}>{response[question]}</ListItem>
                  </Box>
                );
              })}
            </List>) :
              (<Box sx={{ my: 2 }}>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
                <List sx={{ border: "solid 1px black" }}>
                  {survey.questions[question].choices.map((choice, index) => {
                    return (
                      <ListItem key={index}>{alphabet.charAt(index) + ": " + choice}</ListItem>
                    );
                  })}
                </List>
              </Box>)
            )} */}
          {/* </Grid>} */}
        </Grid>
      </Container>
    </Box>
  );
}

export default Results;
