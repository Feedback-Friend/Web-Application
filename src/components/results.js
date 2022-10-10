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
// import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import BarChart from "react-bar-chart";

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

    useEffect(() => {
      const fetch_and_set = async () => {
          const response = await fetch('/getSurveyResults/' + 4)
          const survey_info = await response.json()
          setFRQ(survey_info)
          const questionsresponse = await fetch('/getQuestions/' + 2)
          const questions_info = await questionsresponse.json()
          setQuestionNames(questions_info)

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
    { field: 'result', headerName: 'result', width: 150 },
  ];

  function createData(id, result) {
    return {id, result};
  }
  function parseJSONFRQ(projects){
    console.log('projects', projects)
    const rows = []
   for (let j = 0; j < projects['response_list'].length; j++){
        console.log('projects[response]', projects['response_list'][j]['reply'])
        rows.push(createData(j, projects['response_list'][j]['reply']));
      }
    console.log("rows", rows)
    return rows; 
  }  

  function createDataMC(text, value) {
    return {text, value};
  }

  function parseJSONMC(projects){
    console.log('projects', projects)
    const rows = []
    var dict = {};
   for (let j = 0; j < projects['response_list'].length; j++){
        if (dict[projects['response_list'][j]['reply']] !== undefined){
            let count = dict[projects['response_list'][j]['reply']] + 1
            dict[projects['response_list'][j]['reply']] = count
        }else{
          dict[projects['response_list'][j]['reply']] = 1
        }
        
      }
      for (const [key, value] of Object.entries(dict)) {
        rows.push(createDataMC(key, value))
      }

    return rows; 
  }  

  
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

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
          {survey.name && <Grid item xs={8}>
            {frq.map((question, index) => {
              return(
              <div style={{ paddingTop: '20px', paddingBottom: '20px'}}>
                <div style={{ paddingTop: '20px'}}>
                  <p>{questionNames[index].prompt}</p>
                </div>
                <div style={{ paddingTop: '20px', paddingBottom: '20px'}}>
                {questionNames[index].type < 1 &&
                  <div style={{ paddingTop: '20px', height: 400, width: '100%', float: 'left' }}>
                  {console.log('sdfasdf', question)}
                    <DataGrid
                      rows={parseJSONFRQ(question)}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}   
                    />
                    </div>}
                    {questionNames[index].type > 0 &&
                    <div style={{ paddingTop: '20px', height: 400, width: '100%', float: 'left'}}>
                      <BarChart
                        ylabel="Quantity"
                        width={500}
                        height={500}
                        margin={margin}
                        data={parseJSONMC(question)}
                        style={{ color: "blue" }}
                      />
                    <br></br>
                    </div>}
                  </div>
              </div>
              );
            })
            }
          </Grid>}
        </Grid>
      </Container>
    </Box>
  );
}

export default Results;
