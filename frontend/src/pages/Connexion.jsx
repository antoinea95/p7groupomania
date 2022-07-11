import React, { useState } from "react";
import Form from "../components/Form";
// import { useEffect } from "react";

export default function Connexion() {

    // defined if user is signup or login
    const [isLogin, setIsLogin] = useState(false);

    return(

        <div>
            <button onClick={() => setIsLogin(false)}> Créer un compte </button>
            <button onClick={() => setIsLogin(true)} checked={isLogin}> Se connecter </button>
            <Form isLogin={isLogin} />
        </div>
    )
}