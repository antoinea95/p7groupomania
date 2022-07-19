import React from "react";
import { useContext } from "react";
import {Link} from 'react-router-dom';
import { Context } from "./Context";
import cookie from 'js-cookie'
import axios from "axios";

export default function NavBar(props) {

    const {userId} = useContext(Context);

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

    return(
        <ul className="header--navbar">
            <li><Link to={`/profile/${userId}`} id='linkProfile'><i className="fa-solid fa-user-gear"></i></Link></li>
            <li><Link to={`/home`} id='linkHome'><i className="fa-solid fa-house"></i></Link></li>
            <li><button onClick={logOut} id='linkLogout'><i className="fa-solid fa-right-from-bracket"></i></button></li>
        </ul>
    )
}