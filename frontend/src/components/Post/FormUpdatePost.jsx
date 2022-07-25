import React, { useEffect, useState, useContext} from "react";
import axios from "axios";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Context } from "../Context";


export default function FormUpdatePost(props) {
  // import context
  const {setPostUpdate, setAllPostsUpdate } = useContext(Context);

  // permet de stocker l'image de l'utilisateur
  const [file, setFile] = useState(null);

  // permet d'afficher une preview de l'image de l'utilisateur
  const [fileDataURL, setFileDataURL] = useState(null);

  // permet de stocker les erreurs liées à l'image sélectionnée par l'utilisateur
  const [imgErr, setImgErr] = useState({ type: "", erreur: "" });

  // useEffect qui permet d'afficher une preview de l'image selectionné par l'utilisateur
  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;

        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };

      fileReader.readAsDataURL(file);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  // gestion et validation du fichier de l'utilisateur
  function handleFile(e) {
    const file = e.target.files[0];

    if (file.size > 5242880) {
      setImgErr({ type: "format", message: "Taille maximal: 5MB" });
      return imgErr;
    } else {
      setFile(file);
      setImgErr({ type: "", message: "" });
    }
  }

  // fonction qui permet de supprimer le fichier selectionné par l'utilisateur
  function resetFile() {
    const input = document.querySelector("#file");
    input.value = "";
    setFile(null);
    setFileDataURL(null);
  }

  // Objet Yup qui permet de contrôler le formulaire
  const ValidationSchema = Yup.object().shape({
    message: Yup.string()
      .max(1024, "Votre message est trop long")
      .min(1, "Le message de votre post est vide")
      .required("Merci de saisir votre message"),
  });

  // useForm pour gérer la validation du formulaire
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stockage des erreurs
  const { errors } = formState;

  // requête pour la modification du post
  function updatePost(data) {
    const formData = new FormData();
    formData.append("message", data.message);
    {
      file !== null && formData.append("file", file);
    }

    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}`,
      withCredentials: true,
      data: formData,
    })
      .then(() => {
        setPostUpdate(true);
        setAllPostsUpdate(true);
        setFile(null);
        setFileDataURL(null);
        reset();
      })
      .catch((err) => {
        throw err;
      });
  }

  return (
    <form
      className="form--post form--post__update"
      onSubmit={handleSubmit(updatePost)}
    >
      <div className="form--post__header">
        <textarea
          {...register("message")}
          className="form--post__text form--post__textUpdate"
          defaultValue={props.message}
        ></textarea>

        <input
          type="file"
          id="fileUpdate"
          className="form--post__input"
          onChange={handleFile}
          accept="image/png, image/jpeg, image/jpg"
        />
        <label
          htmlFor="fileUpdate"
          className="form--post__btnImg"
          aria-label="ajouter une image"
        >
          <i className="fa-regular fa-image"></i>
        </label>

        {file !== null && (
          <button
            className="form--post__deleteImg"
            type="button"
            onClick={resetFile}
            aria-label="supprimer image"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>

      <small className="form--post__error">{errors.message?.message}</small>

      {fileDataURL ? (
        <div className="post--content__imgPreview">
          <img src={fileDataURL} alt="preview" />
        </div>
      ) : (
        props.imageUrl && (
          <div className="post--content__imgPreview">
            <img
              src={props.imageUrl}
              alt="image du post"
              crossOrigin="anonymous"
            />
          </div>
        )
      )}
      <small className="form--post__error">{imgErr.message}</small>
      <button type="submit" className="form--post__submit">
        Modifier
      </button>
    </form>
  );
}
