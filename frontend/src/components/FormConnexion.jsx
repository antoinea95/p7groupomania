import React, { useState } from "react";
import axios from "axios";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export default function FormConnexion() {
  // état qui permet de contrôler le formulaire à afficher
  const [isLogin, setIsLogin] = useState(false);

  // état qui permet d'afficher le formulaire de connexion une fois l'inscription validée
  const [isSignup, setIsSignup] = useState(false);

  // contrôle et validation de la clé firstName seulement lors de l'inscription
  const firstName = !isLogin && {
    firstName: Yup.string()
      .required("Merci de renseigner votre prénom")
      .matches("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]{2,}$", "Prénom invalide"),
  };

  // Schéma Yup qui permet de contrôler le formulaire
  const ValidationSchema = Yup.object().shape({
    ...firstName,

    email: Yup.string()
      .email("Merci de renseigner un email valide")
      .required("Merci de renseigner votre email"),

    password: Yup.string()
      .required("Merci de renseigner un mot de passe")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
        "Le mot de passe doit contenir au minimum 6 caractères, 1 majuscule et 1 nombre"
      ),
  });

  // UseForm permet de gérer la validation du formulaire
  const { register, handleSubmit, formState} = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stockage des erreurs
  const { errors } = formState;

  // Requête pour l'inscription de l'utilisateur
function onSignUp(data) {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/signup`,

      data: {
        ...data,
      },
    })
      .then((res) => {
        if (res.data.errors) {
          // récupération et affichage des erreurs générées par la requête
          const errors = res.data.errors;
          const errorSmall = document.querySelector(".postError");
          errorSmall.textContent = errors.email;
        } else {
          // si l'inscription est validée, modification des états pour afficher le formulaire de connexion
          // réinitialisation des erreurs
          const errorSmall = document.querySelector(".postError");
          errorSmall.textContent = "";
          setIsSignup(true);
          setIsLogin(true);
        }
      })
      .catch((err) => console.log(err));
  };

  // requête pour la connexion de l'utilisateur
function onLogin(data) {
    axios({
      method: "post",
      url: "http://localhost:3000/api/auth/login",
      withCredentials: true,
      data: {
        ...data,
      },
    })
      .then((res) => {
        if (res.data.message) {
          // récupération et affichage des erreurs générées par la requête
          const errorSmall = document.querySelector(".postError");
          const error = res.data;
          errorSmall.textContent = error.message;
        } else {
          // si la connexion est validée, l'utilisateur est redirigée vers la page d'accueil
          window.location = "/home";
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  // className qui s'applique selon les états du composants
  const btnSignup = !isLogin
    ? "form--mode__btn form--mode__btn--clicked"
    : "form--mode__btn";
  const btnLogin = `
    ${isLogin ? "form--mode__btn form--mode__btn--clicked" : "form--mode__btn"}
    ${isSignup && "form--mode__btn form--mode__btn form--mode__btn--isSignup"}`;

  return (
    <div className="form--container">
      <div className="form--mode">
        {!isSignup && (
          <button
            onClick={() => setIsLogin(false)}
            className={btnSignup}
            aria-label="inscription"
          >
            Inscription
          </button>
        )}
        <button
          onClick={() => setIsLogin(true)}
          className={btnLogin}
          aria-label="connexion"
        >
          Connexion
        </button>
      </div>

      {/* Modification de la fonction submit selon l'état de isLogin*/}

      <form
        onSubmit={isLogin ? handleSubmit(onLogin) : handleSubmit(onSignUp)}
        className="form--connexion"
      >
        {!isLogin && (
          <>
            <div className="form--connexion__inputBloc">
              <label htmlFor="firstName" className="form--connexion__label">
                <i className="fa-solid fa-face-smile"></i>
              </label>
              <input
                aria-required="true"
                className="form--connexion__input"
                type="firstName"
                id="firstName"
                placeholder="Prénom*"
                name="firstName"
                {...register("firstName")}
              />
            </div>
            <small className="form--connexion__error">
              {errors.firstName?.message}
            </small>
          </>
        )}

        <div className="form--connexion__inputBloc">
          <label htmlFor="email" className="form--connexion__label">
            <i className="fa-solid fa-at"></i>
          </label>
          <input
            aria-required="true"
            className="form--connexion__input"
            type="email"
            id="email"
            placeholder="Email*"
            name="email"
            {...register("email")}
          />
        </div>
        <small className="form--connexion__error">
          {errors.email?.message}
        </small>

        <div className="form--connexion__inputBloc">
          <label htmlFor="password" className="form--connexion__label">
            <i className="fa-solid fa-key"></i>
          </label>
          <input
            aria-required="true"
            className="form--connexion__input"
            type="password"
            id="password"
            placeholder="Mot de passe*"
            name="password"
            {...register("password")}
          />
        </div>
        <small className="form--connexion__error">
          {errors.password?.message}
        </small>

        {!isLogin ? (
          <button type="submit" className="form--connexion__submit">
            Créer un compte
          </button>
        ) : (
          <button type="submit" className="form--connexion__submit">
            Se connecter
          </button>
        )}
        <small className="form--connexion__error postError"></small>
      </form>
    </div>
  );
}
