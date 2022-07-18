import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/main.scss'

import Home from "./pages/Home";
import Connexion from './pages/Connexion'
import Header from './components/Header'
import { Context } from "./components/Context";
import axios from "axios";
import UserProfile from "./pages/UserProfile";

export default function App() {

    const [userId, setUserId] = useState(null);
    const [allPostsUpdate, setAllPostsUpdate] = useState(false);
    const [postUpdate, setPostUpdate] = useState(false);

    useEffect(() => {
    
    async function getUserId() {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/auth/jwt`,
            withCredentials: true
        })
        .then((res) => setUserId(res.data.userId))
        .catch(err => console.log(err))
    }
    getUserId()},[userId])

   

    return (
        
        <Context.Provider value={{userId, allPostsUpdate, setAllPostsUpdate, postUpdate, setPostUpdate}}>
        <Router>
           { userId && <Header/> }
            <Routes>
                <Route exact path='/' element={<Connexion />} />
                <Route exact path='/home' element={<Home />} />
                <Route path="/profile/:id" element={<UserProfile />} />
            </Routes>
        </Router>
        </Context.Provider>

    )
}