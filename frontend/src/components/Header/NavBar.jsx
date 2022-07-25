import React, {useContext} from "react";
import { Link, useLocation } from "react-router-dom";
import cookie from "js-cookie";
import axios from "axios";

import { Context } from "../Context";

export default function NavBar(props) {
  // import context
  const { userId } = useContext(Context);

  // fonction qui permet de supprimer le cookie côté front grâce à js-cookie
  function removeCookie(key) {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  }

  // reqûete pour la déconnexion de l'utilisateur
  function logOut() {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/${userId}/logout`,
      withCredentials: true,
    }).then(() => removeCookie("jwt"));

    window.location = "/";
  }

  // useLocation permet de récupérer le pathname sur lequel se trouve l'utilisateur
  const { pathname } = useLocation();

  return (
    <ul className="header--navbar">
      <li>
        <Link
          aria-label="lien vers la page d'accueil"
          to={`/home`}
          className={
            pathname === "/home"
              ? "header--navbar__link link--active"
              : "header--navbar__link"
          }
        >
          <i className="fa-solid fa-house"></i>
        </Link>
      </li>
      <li>
        <Link
          aria-label="lien vers votre profil utilisateur"
          className={
            pathname === `/profile/${userId}`
              ? "header--navbar__link link--active"
              : "header--navbar__link"
          }
          to={`/profile/${userId}`}
        >
          <i className="fa-solid fa-user-gear"></i>
        </Link>
      </li>
      <li>
        <button
          onClick={logOut}
          className="header--navbar__link"
          aria-label="se déconnecter"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </li>
    </ul>
  );
}
