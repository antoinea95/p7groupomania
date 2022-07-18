import React, { useState } from "react";
import FormConnexion from "../components/FormConnexion";
import typo from "../images/icon-left-font.svg";
import logo from "../images/logo-left-font.svg";

export default function Connexion() {
  return (
    <>
      <header className="header--connexion">
        <div className="header--connexion__img">
          <img src={typo} alt="logo de groupomania" />
        </div>
      </header>
      <main>
        <img src={logo} alt="logo de groupomania" />
        <FormConnexion />
      </main>
    </>
  );
}
