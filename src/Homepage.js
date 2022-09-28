import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import CreateSurvey from './components/createSurvey';
import CreateFromExisting from './components/createFromExisting';
import TakeSurvey from './components/takeSurvey';
import Results from './components/results';
import RowAndColumnSpacing from './components/profilePage';
function Homepage(props) {
  const { userID } = props;

  //Contains a list of survey names and ids
  const [surveys, setSurveys] = useState([]);

  /*
  Contains the index of the survey to be taken in the survey list.
  The index is set on the Home page when a 'take survey' button is pressed and passed to the TakeSurvey component.
  */
  const [surveyIndex, setSurveyIndex] = useState(0);

  // If creating a survey from existing, contains the id of the template survey. Otherwise, contains -1.
  const [surveyID, setSurveyID] = useState(-1);

  /* 
  When surveys are in the process of being created or deleted, this state prevents retrieving surveys from the database until all operations
  are completed. It also contains a message corresponding to the current operation to be displayed to the user.
  */
  const [update, setUpdate] = useState({ creating: false, deleting: false, message: '' });

  // Gets the names, ids, and response counts for every survey the user has created, and sets the survey state
  const getSurveys = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await fetch('/getSurveys/' + userID, requestOptions)
      .then(response => { return response.json() });
    setSurveys(res);
  };

  return (
    <Router>
      {/* React Router routes to pages by loading different elements depending on the path */}
      <Routes>
        {/* Home page */}
        <Route
          exact
          path="/"
          element={
            <Home surveys={surveys} getSurveys={getSurveys} setSurveyID={setSurveyID} setSurveyIndex={setSurveyIndex} update={update} setUpdate={setUpdate} />
          }
        />
        {/* CreateSurvey page */}
        <Route
          path="/create"
          element={
            <CreateSurvey surveyID={surveyID} userID={userID} update={update} setUpdate={setUpdate} />
          }
        />
        {/* CreateFromExisting page */}
        <Route
          path="/createFromExisting"
          element={
            <CreateFromExisting surveys={surveys} getSurveys={getSurveys} setSurveyID={setSurveyID} update={update} />
          }
        />
        {/* TakeSurvey page */}
        <Route
          path="/survey"
          element={
            <TakeSurvey surveys={surveys} setSurveys={setSurveys} surveyIndex={surveyIndex} />
          }
        />
        {/* Results page */}
        <Route
          path="/results"
          element={
            <Results surveys={surveys} />
          }
        />
        {/* Profile Page*/}
        <Route 
          path="myProfile"
          element={
            <RowAndColumnSpacing userID={userID}/>
          }
        />
      </Routes>
    </Router>
  );
}

export default Homepage;
