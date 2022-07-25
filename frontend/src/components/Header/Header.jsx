import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Context } from "../Context";
import NavBar from "./NavBar";

import logo from "../../images/icon-left-font-monochrome-red.svg";



export default function Header() {
  // import context
  const { userId } = useContext(Context);

  // stock des infos de l'utilisateur
  const [user, setUser] = useState({});

  // requête pour récupérer les information de l'utilisateur
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${userId}`,
      withCredentials: true,
    }).then((res) => setUser(res.data));
  }, [userId]);

  return (
    <header className="header">
      <div className="header--welcome">
        <Link to={"/home"} className="header--welcome__logo" aria-label="lien vers la page d'accueil">
          <img src={logo} alt="groupomania logo"/>
        </Link>
        <p className="header--welcome__user"> Bienvenue {user.firstName}</p>
      </div>
      <nav>
      <NavBar user={user} />
      </nav>
    </header>
  );
}
