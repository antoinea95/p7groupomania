import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import axios from "axios";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import cookie from "js-cookie";

import { Context } from "../components/Context";
import Post from "../components/Post/Post";
import Loading from "../components/Loading";

export default function UserProfile() {
  // import context
  const {
    userId,
    userRole,
    setIsLoading,
    isLoading,
    allPostsUpdate,
    setAllPostsUpdate,
  } = useContext(Context);

  // stockage des données de l'utilisateur
  const [user, setUser] = useState({});

  // permet de lancer un rendu du component lorsque l'utilisateur est modifié
  const [isUserPut, setIsUserPut] = useState(false);

  //affiche le formulaire pour modifier les infos de l'utilisateur
  const [isPutForm, setIsPutForm] = useState(false);

  //affiche le formulaire pour modifier la photo de l'utilisateur
  const [isPutPicture, setIsPutPicture] = useState(false);

  // gestion de l'affichage prévisionnel de la photo de l'utilisateur
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  // stock les erreurs liées à la modification de la photo de profil
  const [imgErr, setImgErr] = useState({ type: "", erreur: "" });

  // état qui stock l'id de l'utilisataur
  let { id } = useParams();
  const [profileId, setProfileId] = useState(null);

  // stock les posts de l'utilisateur
  const [userPost, setUserPost] = useState([]);

  // requête pour récupérer les informations de l'utilisateur
  useEffect(() => {
    // isLoading permet d'afficher le loader lorsque la page charge les informations
    setProfileId(id);
    setIsLoading(true);

    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}`,
      withCredentials: true,
    })
      .then((res) => {
        // stockage des données et mise à jour des états
        setUser(res.data);
        setIsUserPut(false);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [id, profileId, isUserPut]);

  // requête pour récupérer les posts de l'utilisateur
  useEffect(() => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/posts`,
      withCredentials: true,
    })
      .then((res) => {
        //tri des post à l'aide la méthode filter = retourne un tableau contenant tout les post avec le même userId
        const post = res.data;
        const userPost = post.filter((post) => post.userId === profileId);
        //affichage des posts du plus récent au plus ancien
        const userPostSort = userPost.reverse();
        setUserPost(userPostSort);

        // mise à jour des états qui gère le rendu des components
        setAllPostsUpdate(false);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [profileId, allPostsUpdate, isUserPut]);

  // Objet Yup permet de contrôler les saisies du formulaire
  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(1, "Votre prénom n'est pas renseigné")
      .matches("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]{2,}$", "Prénom invalide"),

    function: Yup.string().max(50, "max 50 carac."),

    bio: Yup.string().max(
      500,
      "Votre desription est trop longue (500 carac. mac)"
    ),
  });

  // useForm pour valider le formulaire
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stockage des erreurs
  const { errors } = formState;

  // requête pour modifier le profil de l'utilisateur
  function putUser(data) {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}`,
      withCredentials: true,
      data: {
        ...data,
      },
    })
      .then(() => {
        // mise à jour des états et reset du formulaire
        setIsUserPut(true);
        setIsPutForm(false);
        reset();
      })
      .catch((err) => console.log(err));
  }

  // gestion de l'affichage du formulaire des infos
  function handlePutForm() {
    setIsPutForm((prevIsPutForm) => !prevIsPutForm);
  }

  // gestion de l'affichage du formulaire de la photo de profil
  function handlePutPicture() {
    setIsPutPicture((prevIsPutPicture) => !prevIsPutPicture);
  }

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

  // requête qui modifie la photo de l'utilisateur
  function putUserPicture() {
    const formData = new FormData();
    formData.append("file", file);

    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}/upload`,
      withCredentials: true,
      data: formData,
    })
      .then(() => {
        // mise à jour des états et reset du formulaire
        setIsUserPut(true);
        setIsPutPicture(false);
        reset();
      })
      .catch(() => setIsPutPicture(false));
  }

  // requête qui supprime la photo de l'utilisateur
  function deleteUserPicture() {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}/delete`,
      withCredentials: true,
    })
      .then(() => {
        // mise à jour des états et reset du formulaire
        setIsUserPut(true);
        setIsPutPicture(false);
      })
      .catch((err) => console.log(err));
  }

  // requete qui supprime tous les posts de l'utilisateur lorsqu'il supprime son profil
  function deleteAllPostsUser() {
    userPost.map((post) => {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}/posts/${post._id}`,
        withCredentials: true,
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  }

  // retire le cookie côté front lorsque l'utilisateur supprime son compte
  function removeCookie(key) {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  }

  // suppression du compte de l'utilisateur et de tous ses posts
  function deleteUser() {
    deleteAllPostsUser();

    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}`,
      withCredentials: true,
    })
      .then(() => {
        removeCookie("jwt");
      })
      .catch((err) => console.log(err));

    window.location = "/";
  }

  // affichage des posrs de l'utilisateur
  const userPostElement = userPost.map((post) => {
    return <Post key={post._id} postId={post._id} userPut={isUserPut} />;
  });

  return (
    <main className="main--user">
      {isLoading ? (
        <Loading />
      ) : (
        <article className="user">
          {/* si l'utilisateur clique pour modifier sa photo affichage du formulaire */}
          {isPutPicture ? (
            <>
              <form
                onSubmit={handleSubmit(putUserPicture)}
                className="user--card__picture"
              >
                <input
                  type="file"
                  id="file"
                  onChange={handleFile}
                  className="user--card__input"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <label
                  htmlFor="file"
                  className="user--card__pictureBtn"
                  aria-label="ajouter une image"
                >
                  <i className="fa-regular fa-image"></i>
                </label>
                <button
                  type="submit"
                  className="user--card__pictureSubmit"
                  aria-label="envoyez votre nouvelle photo"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
                <input
                  type="button"
                  onClick={deleteUserPicture}
                  id="deleteImg"
                  className="user--card__input"
                />
                <label
                  htmlFor="deleteImg"
                  className="user--card__pictureDelete"
                  aria-label="Suppression de la photo de profile"
                >
                  <i className="fa-solid fa-trash"></i>
                </label>
                {fileDataURL ? (
                  <div className="user--card__pictureImg">
                    <img src={fileDataURL} alt="preview" />
                  </div>
                ) : (
                  <div className="user--card__pictureImg">
                    <img src={user.imageUrl} alt="photo de profil" />
                  </div>
                )}
              </form>
              <small className="user--card__formError"> {imgErr.message}</small>
            </>
          ) : (
            <header className="user--card__picture">
              <div className="user--card__pictureImg">
                <img src={user.imageUrl} alt="image du post" />
              </div>
              {userId === profileId ? (
                <div>
                  <input
                    type="button"
                    onClick={handlePutPicture}
                    id="putPicture"
                    className="user--card__input"
                  />
                  <label
                    aria-label="modifier votre photo de profil"
                    htmlFor="putPicture"
                    className="user--card__pictureLabel"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </label>
                </div>
              ) : null}
            </header>
          )}
          {/* si l'utilisateur clique pour modifier son profil affichage du formulaire */}
          {isPutForm ? (
            <form onSubmit={handleSubmit(putUser)} className="user--card__form">
              <label className="user--card__formLabel" htmlFor="prenom">
                Prénom
              </label>
              <input
                aria-required="true"
                id="prenom"
                type="text"
                {...register("firstName")}
                defaultValue={user.firstName}
                className="user--card__formInput"
              />
              <small className="user--card__formError">
                 {errors.firstName?.message}
              </small>
              <label className="user--card__formLabel" htmlFor="poste">
                Poste
              </label>
              <input
                id="poste"
                type="text"
                {...register("function")}
                defaultValue={user.function}
                className="user--card__formInput"
              />
              <small className="user--card__formError">
                 {errors.function?.message}
              </small>
              <label className="user--card__formLabel" htmlFor="bio">
                Bio
              </label>
              <textarea
                {...register("bio")}
                defaultValue={user.bio}
                className="user--card__formText"
                id="bio"
              />

              <small className="user--card__formError">
                 {errors.firstName?.bio}
              </small>

              <button
                type="submit"
                className="user--card__formSubmit"
                aria-label="mettre à jour votre profil"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          ) : (
            <>
              <section className="user--card">
                <div className="user--card__header">
                  <h1 className="user--card__headerName">{user.firstName}</h1>
                  {userId === profileId ? (
                    <>
                      <input
                        type="button"
                        onClick={handlePutForm}
                        id="putBtn"
                        className="user--card__input"
                      />
                      <label
                        htmlFor="putBtn"
                        className="user--card__headerBtn"
                        aria-label="modifier votre profil"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </label>
                    </>
                  ) : null}
                </div>
                <h2 className="user--card__function">{user.function}</h2>
                <p className="user--card__bio">{user.bio}</p>
                {userId === profileId || userRole === "admin" ? (
                  <button
                    onClick={deleteUser}
                    className="user--card__deleteBtn"
                    aria-label="supprimer votre profil"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                ) : null}
              </section>
            </>
          )}
        </article>
      )}
      {userPost.length > 0 ? (
        isLoading ? (
          <Loading />
        ) : (
          <article className="user--post">
            <h2 className="user--post__title">Les posts de {user.firstName}</h2>
            {userPostElement}
          </article>
        )
      ) : null}
    </main>
  );
}
