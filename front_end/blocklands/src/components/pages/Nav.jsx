import { Link } from 'react-router-dom'
import '../styles/Nav.css'


export default function Nav () {



    return (
        <div>
            <div className='navbuttons'>
            <Link to='/' className='navbutton'>Discover</Link>
            <Link to='/' className='navbutton'>Create</Link>
            <Link to='/' className='navbutton'>Avatar</Link>
            <Link to='/' className='navbutton'>Coin</Link>
            <Link to='/login' className='navbutton'>Login</Link>
            </div>
        </div>
    )
}