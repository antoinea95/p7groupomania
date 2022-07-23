import React from "react";
import logo from "../images/icon-left-font-monochrome-red.svg"

export default function Error() {
    return (
        <main className="page--error">
            <img src={logo} alt='logo de groupomania' />
            <h1 className="page--error__title">404</h1>
            <p className="page--error__text">Désolé ette page n'existe pas</p>
        </main>
    )
}