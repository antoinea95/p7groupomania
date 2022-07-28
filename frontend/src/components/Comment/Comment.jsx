import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Context } from "../Context";
import FormComment from "./FormComment";

export default function Comment(props) {
  // import du context
  const { userId, userRole, setPostUpdate } = useContext(Context);

  //Etat qui permet d'afficher le formulaire pour modifier le commentaire
  const [isPut, setIsPut] = useState(false);

  // Stock les informations de l'utilisateur qui a commenté
  const [user, setUser] = useState({});

  // Permet de savoir si l'utilisateur existe encore
  const [oldUser, setOldUser] = useState(false);

  // fonction qui permet d'afficher et de masquer le formulaire de modification du commentaire
  function handlePut() {
    setIsPut((prevIsPut) => !prevIsPut);
  }

  // requête pour récupérer les informations de l'utilisateur
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${props.comment.commenterId}`,
      withCredentials: true,
    })
      .then((res) => {
        // si l'utilisateur n'existe pas on change l'état de OldUser si non on stock les informations
        res.data === null ? setOldUser(true) : setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [props.comment.commenterId]);

  // useEffect qui supprime les commentaires d'un utilisateur supprimé
  useEffect(() => {
    oldUser && deleteComment();
  }, [oldUser]);

  // requête axios pour supprimer le commentaire
  function deleteComment() {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        commentId: props.comment._id,
      },
    })
      .then(() => {
        // mise à jour du post
        setPostUpdate(true);
      })
      .catch((err) => console.log(err));
  }

  // requête pour la modification d'un commentaire
  function putComment(data) {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        commentId: props.comment._id,
        text: data.text,
      },
    })
      .then(() => {
        // mise à jour du post
        setPostUpdate(true);
        setIsPut(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    props.isComment && (
      <div className="comment">
        <div className="comment--header">
          <div className="comment--header__user">
            <div className="comment--header__userImg">
              {!oldUser && <img src={user.imageUrl} alt="photo de profil" />}
            </div>
            {!oldUser ? (
              <h3 className="post--header__userName">
                <Link to={`/profile/${user._id}`} id="userLink">
                  {user.firstName}
                </Link>
              </h3>
            ) : (
              <h3>Ancien utilisateur</h3>
            )}
          </div>

          {userId === props.comment.commenterId || userRole === "admin" ? (
            <div className="comment--header__btn">
              <button
                aria-label="modifer le commentaire"
                className="comment--header__btnModify"
                onClick={handlePut}
              >
                <i className="fa-solid fa-pencil"> </i>
              </button>
              <button
                aria-label="supprimer le commentaire"
                className="comment--header__btnDelete"
                onClick={deleteComment}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : null}
        </div>
        {/* si l'utilisateur clique sur le bouton modifié, modification de l'état isPut et affichage du component formComment*/}
        {isPut ? (
          <FormComment
            isPut={isPut}
            comment={props.comment}
            postId={props.postId}
            putComment={putComment}
          />
        ) : (
          <p className="comment--message">{props.comment.text}</p>
        )}
      </div>
    )
  );
}
