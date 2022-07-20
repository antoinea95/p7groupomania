import axios from "axios";
import React from "react";
import { useContext } from "react";
import { Context } from "./Context";
import cookie from 'js-cookie'
import { useEffect } from "react";
import { useState } from "react";
import logo from '../images/icon-left-font-monochrome-black.svg'
import NavBar from "./NavBar";

export default function Header() {

    const {userId} = useContext(Context);
    const [user, setUser] = useState({})

    useEffect(() => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/auth/user/${userId}`,
            withCredentials: true
        })
        .then((res) => setUser(res.data)) 
    }, [userId])

    return(

        <header className="header">

            <div className="header--welcome__logo">
            <img src={logo} alt='groupomania logo'/>
            </div>
            <div className="header--welcome__user">
            <p className="header--welcome__user"> Bienvenue {user.firstName}</p>
            </div>

            <NavBar 
                user={user}
            />

        </header>
    )
}