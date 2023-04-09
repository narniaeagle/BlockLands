import '../styles/Discover.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

export default function Avatar () {

    return (
        <div>
            <form>
                <p>Head:</p><input type="text" name="head"/>
                <p>Torso:</p><input type="text" name="torso"/>
                <p>Right Arm:</p><input type="text" name="right-arm"/>
                <p>Left Arm:</p><input type="text" name="left-arm"/>
                <p>Right Leg:</p><input type="text" name="right-leg"/>
                <p>Left Leg:</p><input type="text" name="left-leg"/>
                <input type="submit"/>
            </form>
        </div>
    )
}
