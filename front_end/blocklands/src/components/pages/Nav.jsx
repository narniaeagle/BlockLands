import {useContext} from 'react'
import { Link } from 'react-router-dom'
import '../styles/Nav.css'
import AuthContext from '../context/AuthContext'


export default function Nav () {
    let {user, logoutUser} = useContext(AuthContext)

    return (
        <div>
            <div className='navbuttons'>
            <Link to='/' className='navbutton'>Discover</Link>
            <Link to='/' className='navbutton'>Create</Link>
            <Link to='/' className='navbutton'>Avatar</Link>
            <Link to='/' className='navbutton'>Coin</Link>
            {user ? (
                <p onClick={logoutUser}>Logout </p>
            ) : (
                <Link to='/login' className='navbutton'>Login</Link>
            )}

                {user &&   <p>Hello {user.username}</p>}
            </div>
        </div>
    )
}