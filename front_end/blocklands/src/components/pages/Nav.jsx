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
            <Link to='/create' className='navbutton'>Create</Link>
            <Link to='/avatar' className='navbutton'>Avatar</Link>

            {user && <Link to='/profile' className='navbutton'>{user.username}</Link>}

            {user ? (
                <>
                    <Link to='/coin' className='navbutton'>Coins: {user.coins}</Link>
                    <Link to='/login' className='navbutton' onClick={logoutUser}>Logout </Link>
                </>
            ) : (
                <Link to='/login' className='navbutton'>Login</Link>
            )}
            </div>
        </div>
    )
}