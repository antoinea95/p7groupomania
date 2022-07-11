import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Connexion from './pages/Connexion'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Connexion />} />
            </Routes>
        </Router>
    )
}