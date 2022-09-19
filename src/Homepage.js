import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import CreateSurvey from "./components/createSurvey";
import TakeSurvey from "./components/takeSurvey";
import Results from "./components/results";

function Homepage() {
  /* 
  Contains a list of all created survey objects.
  Each survey object has the fields 'name', 'questions', and 'responses'.
  'surveys' is a prop of the Home, CreateSurvey, TakeSurvey, and Results pages.
  'setSurveys' is a prop of the Home (to delete surveys), CreateSurvey (to update 'name' and 'questions') and TakeSurvey (to update 'responses') pages.
  */
  const [surveys, setSurveys] = useState([]);

  /*
  Contains the index of the survey to be taken in the survey list.
  The index is set on the Home page when a 'take survey' button is pressed and passed to the TakeSurvey component.
  */
  const [surveyIndex, setSurveyIndex] = useState(0);

  return (
    <Router>
      {/* React Router routes to pages by loading different elements depending on the path */}
      <Routes>
        {/* Home page */}
        <Route
          exact
          path="/"
          element={
            <Home surveys={surveys} setSurveys={setSurveys} setSurveyIndex={setSurveyIndex} />
          }
        />
        {/* CreateSurvey page */}
        <Route
          path="/create"
          element={
            <CreateSurvey surveys={surveys} setSurveys={setSurveys} />
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
      </Routes>
    </Router>
  );
}

export default Homepage;
