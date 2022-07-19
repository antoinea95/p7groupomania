import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/main.scss'

import Home from "./pages/Home";
import Connexion from './pages/Connexion'
import Header from './components/Header'
import { Context } from "./components/Context";
import axios from "axios";
import UserProfile from "./pages/UserProfile";
import Loading from "./components/Loading";

export default function App() {

    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null)
    const [allPostsUpdate, setAllPostsUpdate] = useState(false);
    const [postUpdate, setPostUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    
    async function getUserToken() {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/auth/jwt`,
            withCredentials: true
        })
        .then((res) => {
            setUserId(res.data.userId)
            setUserRole(res.data.userRole)
        })
        .catch(err => 
            {console.log(err)})
    }
    getUserToken()},[userId, userRole, isLoading])

   const logPath = '/'
   const url = window.location.pathname

    return (
        
        <Context.Provider value={{userId, userRole, allPostsUpdate, setAllPostsUpdate, postUpdate, setPostUpdate, isLoading, setIsLoading}}>
        <Router>
           { url !== logPath && <Header/>}
            <Routes>
                <Route exact path='/' element={<Connexion />} />
                <Route exact path='/home' element={<Home />} />
                <Route path="/profile/:id" element={<UserProfile />} />
            </Routes>
        </Router>
        </Context.Provider>

    )
}