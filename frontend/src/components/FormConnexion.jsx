import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import axios from "axios";

export default function FormConnexion() {
  // control form to display
  const [isLogin, setIsLogin] = useState(false);

  // login after signup
  const [isSignup, setIsSignup] = useState(false);

  // Yup key for the firstName, if Login Form is on display, firstName is not required
  const firstName = !isLogin && {
    firstName: Yup.string()
      .required("Merci de renseigner votre prénom")
      .matches("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]{2,}$", "Prénom invalide"),
  };

  // Yup object for control form
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

  // validation form
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stock errors
  const { errors } = formState;

  // Send signup's data with axios
  const onSignUp = (data) => {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/signup`,

      data: {
        ...data,
      },
    })
      .then((res) => {
        if (res.data.errors) {
          const errors = res.data.errors;
          const errorSmall = document.querySelector(".postError");
          errorSmall.textContent = errors.email;
        } else {
          setIsSignup(true);
          setIsLogin(true);
        }
      })
      .catch((err) => console.log(err));
  };

  // send login's data with axios
  const onLogin = (data) => {
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
          const errorSmall = document.querySelector(".postError");
          const error = res.data;
          errorSmall.textContent = error.message;
        } else {
          window.location = "/home";
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  // className for headers btn conditionnal
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
            {" "}
            Inscription
          </button>
        )}
        <button
          onClick={() => setIsLogin(true)}
          className={btnLogin}
          aria-label="connexion"
        >
          {" "}
          Connexion{" "}
        </button>
      </div>

      {/* { !isLogin && !isSignup ? */}

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
                placeholder="Prénom"
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
            placeholder="Email"
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
            placeholder="Mot de passe"
            name="password"
            {...register("password")}
          />
        </div>
        <small className="form--connexion__error">
          {errors.password?.message}
        </small>

        {!isLogin ? (
          <button type="submit" className="form--connexion__submit">
            {" "}
            Créer un compte{" "}
          </button>
        ) : (
          <button type="submit" className="form--connexion__submit">
            {" "}
            Se connecter{" "}
          </button>
        )}
        <small className="form--connexion__error postError"></small>
      </form>
    </div>
  );
}
