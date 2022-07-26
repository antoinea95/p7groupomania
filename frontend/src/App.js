import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/main.scss";

import { Context } from "./components/Context";
import Header from "./components/Header/Header";
import Connexion from "./pages/Connexion";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Error from "./pages/Error";

export default function App() {
  // stock l'id de l'utilisateur connecté
  const [userId, setUserId] = useState('');

  // stock le role de l'utilisateur connecté
  const [userRole, setUserRole] = useState(null);

  // permet de lancer un rendu de tous les posts
  const [allPostsUpdate, setAllPostsUpdate] = useState(false);

  // permet de lancer un rendu d'un post
  const [postUpdate, setPostUpdate] = useState(false);

  // permet d'afficher le loader lorsque les données sont en cours de chargement
  const [isLoading, setIsLoading] = useState(false);

  // useEffect qui permet de récupérer l'id et le role de l'utilisateur connecté
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/jwt`,
      withCredentials: true,
    }).then((res) => {
      setUserId(res.data.userId);
      setUserRole(res.data.userRole);
    }).catch(err => console.log(err));
  }, [userId, userRole]);

  return (
    <Context.Provider
      value={{
        userId,
        userRole,
        allPostsUpdate,
        setAllPostsUpdate,
        postUpdate,
        setPostUpdate,
        isLoading,
        setIsLoading,
      }}
    >
      <Router>
        <Routes>
          <Route exact path="/" element={<Connexion />} />
          <Route
            exact
            path="/home"
            element={
              <>
                <Header /> <Home />
              </>
            }
          />
          <Route
            exact
            path="/profile/:id"
            element={
              <>
                <Header />
                <UserProfile />
              </>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
}
