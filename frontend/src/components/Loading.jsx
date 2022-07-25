import React from "react";
import logo from '../images/logo-left-font.svg'

export default function Loading() {

    // Loading spinner lors du chargement des données
    return (
        <div className='loader'>
            <img src={logo} alt='logo de groupomania'/>
        </div>
    )
}