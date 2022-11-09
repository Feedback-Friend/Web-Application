import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/loginPage'
import RegisterPage from './components/registerPage'
import Homepage from './Homepage'
import TakeSurvey from './components/takeSurvey'
import EndPage from './components/endPage'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { amber } from '@mui/material/colors';


// allow userID to be "global" to make it easy to log out or access mysql info at any point
// Reference: https://reactjs.org/docs/context.html
export const ContextUserID = React.createContext(null);

// This function sets up the URL routing for the web application
// Reference: https://reactrouter.com/en/v6.3.0/getting-started/tutorial
function App() {
    const [userID, setUserID] = React.useState(localStorage.getItem("userID"));

    const theme = createTheme({
        palette: {
            primary: amber,
        },
        typography: {
            allVariants: {
                fontFamily: 'Verdana',
                letterSpacing: -1,
            },
        },
    });

    if (userID === null) {
        // user is not logged in yet
        return (
            <ThemeProvider theme={theme}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage setUserID={setUserID} />} />
                        <Route path='register' element={<RegisterPage />} />
                        {/* TakeSurvey page */}
                        <Route
                            path="/survey/:id"
                            element={
                                <TakeSurvey />
                            }
                        />
                        <Route
                            path="endPage"
                            element={
                                <EndPage />
                            }
                        />

                        {/* routes other paths to login page */}
                        <Route path="*" element={
                            <Navigate to="/" />
                        } />
                    </Routes>
                </HashRouter>
            </ThemeProvider>
        )
    } else {
        // user is logged in and their page should be routed accordingly
        return (
            <ThemeProvider theme={theme}>
                <ContextUserID.Provider value={[userID, setUserID]} >
                    <Homepage userID={userID} />
                </ContextUserID.Provider>
            </ThemeProvider>
        )
    }
}

export default App
