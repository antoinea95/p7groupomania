import React from "react";
import logo from '../images/logo-left-font.svg'

export default function Loading() {

    return (
        <div className='loader'>
            <img src={logo} alt='logo de groupomania'/>
        </div>
    )
}