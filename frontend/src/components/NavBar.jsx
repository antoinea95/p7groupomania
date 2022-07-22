import React, { useState } from "react";
import { useContext } from "react";
import {Link, useLocation} from 'react-router-dom';
import { Context } from "./Context";
import cookie from 'js-cookie'
import axios from "axios";
import { useEffect } from "react";

export default function NavBar(props) {

    const {userId} = useContext(Context);
    const [url, setUrl] = useState()



    const removeCookie = (key) => {
        if(window !== "undefined") {
            cookie.remove(key, {expires: 1});
        }
    }

    function logOut() {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/auth/${userId}/logout`,
            withCredentials: true
        })
        .then(() => removeCookie('jwt')) 

        window.location = '/';
    }
    
    const {pathname} = useLocation();
    


    return(
        <ul className="header--navbar">
            <li><Link to={`/home`} className={(pathname === '/home') ? 'header--navbar__link link--active' : 'header--navbar__link'} ><i className="fa-solid fa-house"></i></Link></li>
            <li><Link className={(pathname === `/profile/${userId}`) ? 'header--navbar__link link--active' : 'header--navbar__link'} to={`/profile/${userId}`}><i className="fa-solid fa-user-gear"></i></Link></li>
            <li><button onClick={logOut} className='header--navbar__link'><i className="fa-solid fa-right-from-bracket"></i></button></li>
        </ul>
    )
}