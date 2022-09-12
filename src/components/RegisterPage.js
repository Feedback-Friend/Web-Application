import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

function RegisterPage() {
    const [userInfo, setUserInfo] = React.useState({})
    const setURL = useNavigate() // useNavigate can't be used in button below, needs to be set to a variable

    // contains all credentials
    function submit() {
        alert(JSON.stringify(userInfo));
    }
  
    function updateUserInfo(event) {
        var name = event.target.name;
        var value = event.target.value;
        // only update value of credential that is actually updated
        setUserInfo(userInfo => ({...userInfo, [name]: value}))
    }
  
    return (
        <>
        <h3>Register</h3>
    
        {/* TODO: check if methods below are the "safe" way to handle usernames and passwords */}
        <form onSubmit={submit}>
            <label>
                Full Name:&nbsp; {/* &nbsp; is used to add a space when HTML doesn't consider spaces text */}
                <input type="text" onChange={updateUserInfo} name="fullName" required />
            </label>
            <br/><br/>
            <label>
                Email:&nbsp;
                <input type="text" onChange={updateUserInfo} name="email" required />
            </label>
            <br/><br/>
            <label>
                Username:&nbsp;
                <input type="text" onChange={updateUserInfo} name="username" required />
            </label>
            <br/><br/>
            <label>
                Password:&nbsp;
                <input type="password" onChange={updateUserInfo} name="password" required />
            </label>
            <br/><br/>
            <label>
                Retype password:&nbsp;
                <input type="password" onChange={updateUserInfo} name="retypePassword" required />
            </label>
            <br/><br/>
            <input type="submit" value="Register" />
        </form>
        
        <br/><br/>
        Already have an account?&nbsp;
        <Link to="/">Log in</Link>
        </>
    )
}

export default RegisterPage