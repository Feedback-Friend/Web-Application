import React, { useEffect, useState } from 'react';
// import Profile from 'Home';
// This turns buttons into links
import { Link } from 'react-router-dom';
// Imports the navigation bar
import Nav from './nav';

function ProfilePage(props){
    const {userID} = props
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    firstName.setUsername
    
    useEffect(() => {
        // res = fetch()
    }
    )
    
    return(      
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
            <Item>1</Item>
        </Grid>
        <Grid item xs={6}>
            <Item>2</Item>
        </Grid>
        <Grid item xs={6}>
            <Item>3</Item>
        </Grid>
        <Grid item xs={6}>
            <Item>4</Item>
        </Grid>
        </Grid>
    )
} 

// Makes the function exportable
export default ProfilePage