import '../styles/Discover.css'

 //removed from mvp

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { BASE_URL } from '../context/Url';

export default function Avatar () {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getNotes()
    }, [])


    let getNotes = async() =>{
        let response = await fetch(`${BASE_URL}games/`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setNotes(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    return (
        <div>
            <form>
                <p>name:</p><input type="text" name="name"/>
                <p>password:</p><input type="text" name="password"/>
                <input type="submit"/>
            </form>
        </div>
    )
}
