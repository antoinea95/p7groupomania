import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/main.scss'

import Home from "./pages/Home";
import Connexion from './pages/Connexion'
import { Context } from "./components/Context";
import axios from "axios";

export default function App() {

    const [userId, setUserId] = useState(null);
    const [allPostsUpdate, setAllPostsUpdate] = useState(false);
    const [postUpdate, setPostUpdate] = useState(false);

    useEffect(() => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/auth/jwt`,
            withCredentials: true
        })
        .then((res) => setUserId(res.data.userId))
        .catch(err => console.log(err))
    }, [userId])

   

    return (
        
        <Context.Provider value={{userId, allPostsUpdate, setAllPostsUpdate, postUpdate, setPostUpdate}}>
        <Router>
            <Routes>
                <Route exact path='/' element={<Connexion />} />
                <Route exact path='/home' element={<Home />} />
            </Routes>
        </Router>
        </Context.Provider>

    )
}