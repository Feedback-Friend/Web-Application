import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

function LoginPage() {
    const [credentials, setCredentials] = React.useState({})
    const setURL = useNavigate() // useNavigate can't be used in button below, needs to be set to a variable

    // contains username and password when submitted
    function submit() {
        alert(credentials.username + " is username, and " + credentials.password + " is password")
    }
  
    function updateCredentials(event) {
        var name = event.target.name;
        var value = event.target.value;
        // only update value of credential that is actually updated
        setCredentials(credentials => ({...credentials, [name]: value}))
    }
  
    return (
        <>
        <h3>Log In</h3>
    
        {/* TODO: check if methods below are the "safe" way to handle usernames and passwords */}
        <form onSubmit={submit}>
            <label>
                Username:&nbsp; {/* &nbsp; is used to add a space when HTML doesn't consider spaces text */}
                <input type="text" onChange={updateCredentials} name="username" required />
            </label>
            <br/><br/>
            <label>
                Password:&nbsp;
                <input type="password" onChange={updateCredentials} name="password" required />
            </label>
            <br/><br/>
            <input type="submit" value="Log In" />
        </form>
        
        <br/><br/>
        New User?&nbsp;
        <Link to="/register">Click here to register</Link>
        </>
    )
}

export default LoginPage