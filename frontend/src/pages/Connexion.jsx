import React from "react";

import FormConnexion from "../components/FormConnexion";
import logo from "../images/icon-left-font-monochrome-black.svg";

export default function Connexion() {

  // affichage de la page de connexion et du component FormConnexion
  return (
    <>
      <header className="header--connexion">
        <div className="header--connexion__img">
          <img src={logo} alt="logo de groupomania" />
        </div>
      </header>
      <main className="main--connexion">
        <FormConnexion />
      </main>
    </>
  );
}
