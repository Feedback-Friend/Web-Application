import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Nav from './nav';
import { DataGrid } from '@mui/x-data-grid';
import BarChart from "react-bar-chart";

function Results(props) {
  const { surveys, getSurveys, update } = props;

  const [frq, setFRQ] = React.useState([])

  const gottenSurveys = useRef(false)

  // Retrieves surveys from the database only after creating and deleting operations are completed
  useEffect(() => {
    if (!gottenSurveys.current) {
      if (!update.updating) {
        getSurveys()
        gottenSurveys.current = true
      }
    }
  }, [update.updating, getSurveys]);

  const fetch_and_set = async (e) => {
    const response = await fetch('/getSurveyResults/' + e.target.value.id)
    const survey_info = await response.json()
    setFRQ(survey_info)
  }

  const columns = [
    { field: 'result', headerName: 'result', width: 150 },
  ];

  function createData(id, result) {
    return { id, result };
  }
  function parseJSONFRQ(projects) {
    console.log('projects', projects)
    const rows = []
    for (let j = 0; j < projects['response_list'].length; j++) {
      console.log('projects[response]', projects['response_list'][j]['reply'])
      rows.push(createData(j, projects['response_list'][j]['reply']));
    }
    console.log("rows", rows)
    return rows;
  }

  function createDataMC(text, value) {
    return { text, value };
  }

  function parseJSONMC(projects) {
    console.log('projects', projects)
    const rows = []
    var dict = {};
    for (let j = 0; j < projects['response_list'].length; j++) {
      if (dict[projects['response_list'][j]['reply']] !== undefined) {
        let count = dict[projects['response_list'][j]['reply']] + 1
        dict[projects['response_list'][j]['reply']] = count
      } else {
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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Survey</InputLabel>
              <Select
                label="Survey"
                onChange={(e) => fetch_and_set(e)}
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
            {frq.map((question, index) => {
              return (
                <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                  <div style={{ paddingTop: '20px' }}>
                    <p>{question.prompt}</p>
                  </div>
                  <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    {question.type < 1 &&
                      <div style={{ paddingTop: '20px', height: 400, width: '100%', float: 'left' }}>
                        {console.log('sdfasdf', question)}
                        <DataGrid
                          rows={parseJSONFRQ(question)}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                      </div>}
                    {question.type > 0 &&
                      <div style={{ paddingTop: '20px', height: 400, width: '100%', float: 'left' }}>
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
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={update.updating}
        message={update.message}
      />
    </Box>
  );
}

export default Results;
