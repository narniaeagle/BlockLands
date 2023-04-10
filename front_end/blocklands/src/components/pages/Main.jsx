import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // it requires Router too
import PrivateRoutes from '../utils/PrivateRoutes'

import Create from './Create'
import Avatar from './Avatar'
import Coin from './Coin'
import Profile from './Profile'

import Discover from './Discover'  
import Game from './Game' 
import Login from './Login'   

export default function Main () {
    return (
        <div className='main'>
                <Routes>
                    <Route element={<PrivateRoutes/>}>
                        <Route element={<Discover/>} path='/'/>
                        <Route element={<Game/>} path='/game/:game_id'/>
                        <Route element={<Profile/>} path='/profile'/>
                        <Route element={<Create/>} path='/create'/>
                        <Route element={<Avatar/>} path='/avatar'/>
                        <Route element={<Coin/>} path='/coin'/>
                        <Route element={<Profile/>} path='/profile'/>
                    </Route>
                    <Route element={<Login/>} path='/login'/>
                </Routes>
        </div>
    )
}