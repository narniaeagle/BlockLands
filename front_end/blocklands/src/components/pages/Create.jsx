import '../styles/Discover.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

export default function Avatar () {


    return (
        <div>
            <form>
                <input type="text" name="name"/>
                <input type="text" name="description"/>
                <input type="text" name="image"/>
                <input type="submit"/>
            </form>
        </div>
    )
}
