import React, { useContext } from "react";
import axios from "axios";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Context } from "../Context";

export default function FormComment(props) {
  // import du context
  const { userId, setPostUpdate } = useContext(Context);

  // Objet yup qui permet de contrôler la saisie des utilisateurs avant la requête post
  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .max(500, "Votre commentaire est trop long")
      .min(1, "Votre commentaire est vide")
      .required("Merci de saisir votre commentaire"),
  });

  // UseForm permet de gérer les formulaires
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stockage des erreurs
  const { errors } = formState;

  // requête post pour l'envoie du commentaire
  function postComment(data) {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        userId: userId,
        text: data.text,
      },
    })
      .then(() => {
        // mise à jour du post et reset du formulaire
        setPostUpdate(true);
        reset();
      })
      .catch((err) => console.log(err));
  }

  // formComment permet de poster un nouveau commentaire et de modifier un commentaire, si isPut est true,
  // la fonction submit du form est modifié et une requête put est envoyée
  return (
    <>
      <form
        onSubmit={
          !props.isPut
            ? handleSubmit(postComment)
            : handleSubmit(props.putComment)
        }
        className="form--comment"
      >
        <input
          aria-required="true"
          type="text"
          {...register("text")}
          className="form--comment__input"
          defaultValue={props.isPut ? props.comment.text : null}
          placeholder="Votre commentaire"
        />
        <button
          aria-label="mettre à jour le commentaire"
          type="submit"
          className="form--comment__btn"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
      <small className="form--comment__error">{errors.text?.message}</small>
    </>
  );
}
