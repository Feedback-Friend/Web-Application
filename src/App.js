import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/loginPage'
import RegisterPage from './components/registerPage'
import Homepage from './Homepage'

// This function sets up the URL routing for the web application
// Reference: https://reactrouter.com/en/v6.3.0/getting-started/tutorial
function App() {
    const [userID, setUserID] = React.useState("")
    const [name, setName] = React.useState("")

    if(userID === "") {
        // user is not logged in yet
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage setUserID={setUserID} setName={setName} />} />
                    <Route path='register' element={<RegisterPage />} />

                    {/* routes other paths to login page */}
                    <Route path="*" element={
                        <Navigate to="/" />
                    } />
                </Routes>
            </BrowserRouter>
        )
    } else {
        // user is logged in and their page should be routed accordingly
        return (
            <Homepage />
        )
    }
}

export default App
