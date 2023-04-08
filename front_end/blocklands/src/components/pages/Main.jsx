import { Routes, Route } from 'react-router-dom'
import Discover from './Discover'   
import Login from './Login'   

export default function Main () {
    return (
        <div className='main'>
            <Routes>
                <Route path='/' element={<Discover />}/>
                <Route path='/' element={<Discover />}/>
                <Route path='/' element={<Discover />}/>
                <Route path='/' element={<Discover />}/>
                <Route path='/login' element={<Login />}/>
            </Routes>
        </div>
    )
}