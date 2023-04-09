import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // it requires Router too
import PrivateRoutes from '../utils/PrivateRoutes'


import Discover from './Discover'   
import Login from './Login'   

export default function Main () {
    return (
        <div className='main'>
                <Routes>
                    <Route element={<PrivateRoutes/>}>
                        <Route element={<Discover/>} path='/'/>
                    </Route>

                    <Route element={<Login/>} path='/login'/>
                </Routes>
        </div>
    )
}