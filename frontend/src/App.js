import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/main.scss'

import Home from "./pages/Home";
import Connexion from './pages/Connexion'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<Connexion />} />
                <Route exact path='/home' element={<Home />} />
            </Routes>
        </Router>
    )
}