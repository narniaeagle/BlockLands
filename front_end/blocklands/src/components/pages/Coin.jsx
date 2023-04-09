import '../styles/Discover.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

export default function Avatar () {
 

    return (
        <div>
            <p>$4.99</p><button>500C</button>
            <p>$9.99</p><button>1120C</button>
            <p>$19.99</p><button>2450C</button>
            <p>$49.99</p><button>5500C</button>
        </div>
    )
}
