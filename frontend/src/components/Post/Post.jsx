import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Context } from "../Context";
import Comment from "../Comment/Comment";
import FormUpdatePost from "./FormUpdatePost";
import FormComment from "../Comment/FormComment";

export default function Post(props) {
  // import context
  const { userId, userRole, setAllPostsUpdate, postUpdate, setPostUpdate } =
    useContext(Context);

  // stockage des données de l'utiliseur
  const [usersData, setUsersData] = useState([]);

  // stockage des donées du post
  const [post, setPost] = useState({});

  // permet de gérer l'affichage des commentaires
  const [isComment, setIsComment] = useState(false);

  // permet de gérer l'envoie des likes
  const [isLiked, setIsLiked] = useState(false);

  // permet de gérer l'affichage du formulaire de modification du post
  const [isPut, setIsPut] = useState(false);

  // stock le nombre de commentaires d'un post
  const [commentsNumber, setCommentsNumber] = useState(0);

  // stock la date de création du post
  const [date, setDate] = useState("");

  // requête pour récupérer les données de chaque post
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}`,
      withCredentials: true,
    })
      .then((res) => {
        const post = res.data;

        // vérification des posts déjà likés par l'utilisateur
        const postLiked = post.usersLiked.includes(userId);

        // modification de isLiked
        if (postLiked) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }

        // date de création du post
        let createdDate = new Date(post.createdAt);
        let formatCreatedDate = createdDate.toLocaleDateString("fr");
        setDate(formatCreatedDate);

        // remise à 0 des états gérant le rendu du component
        setPostUpdate(false);
        setIsPut(false);

        // stockage des données
        setPost(post);
        setCommentsNumber(res.data.comments.length);
      })
      .catch((err) => console.log(err));
  }, [userId, postUpdate, props.postId, setPostUpdate]);

  // requête pour récupérer les données de tous les utilisateurs
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/user`,
      withCredentials: true,
    })
      .then((res) => {
        //enregistrement des données
        setUsersData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.userPut]);

  // gestion des requêtes like
  function handleLikePost() {
    // si l'utilisateur à déjà liké le post, envoie d'une requête avec like=0
    if (isLiked === true) {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/posts/${post._id}/like`,
        withCredentials: true,
        data: {
          userId: userId,
          like: 0,
        },
      })
        .then(() => {
          // mise à jour du post
          setPostUpdate(true);
        })
        .catch((err) => console.log(err));
    } else {
      // si isLiked = false, envoie d'une requête avec like=1
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/posts/${post._id}/like`,
        withCredentials: true,
        data: {
          userId: userId,
          like: 1,
        },
      })
        .then(() => {
          // mise à jour du post
          setPostUpdate(true);
        })
        .catch((err) => console.log(err));
    }
  }

  // requête pour la suppression d'un post
  function handleDeletePost() {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/posts/${post._id}`,
      withCredentials: true,
    }).then(() => {
      // mise à jour des posts
      setPostUpdate(true);
      setAllPostsUpdate(true);
    });
  }

  // permet d'afficher le formulaire de modification du post
  function handlePut() {
    setIsPut((prevPut) => !prevPut);
  }

  // permet d'afficher les commentaires
  function displayComment() {
    setIsComment((prevIsComment) => !prevIsComment);
  }

  /* affichage du component FormUpdatePost si l'utilisateur clique sur le bouton du modification */
  {
    return isPut ? (
      <FormUpdatePost
        postId={post._id}
        imageUrl={post.imageUrl}
        message={post.message}
      />
    ) : (
      <article className="post">
        <header className="post--header">
          <div className="post--header__user">
            <div className="post--header__userImg">
              {usersData.map((user) => {
                if (user._id === post.userId)
                  return (
                    <img
                      src={user.imageUrl}
                      alt="photo de profil"
                      key={user.imageUrl}
                    />
                  );
              })}
            </div>

            {usersData.map((user) => {
              if (user._id === post.userId)
                return (
                  <h2 className="post--header__userName" key={user._id}>
                    <Link to={`/profile/${user._id}`} id="userLink">
                      {user.firstName}
                    </Link>
                  </h2>
                );
            })}
          </div>

          {userId === post.userId || userRole === "admin" ? (
            <div className="post--header__btn">
              <button
                className="post--header__btnModify"
                onClick={handlePut}
                aria-label="modifier le post"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
              <button
                className="post--header__btnDelete"
                onClick={handleDeletePost}
                aria-label="supprimer le post"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : null}
        </header>
        <section className="post--content">
          <p className="post--content__text">{post.message}</p>
          {post.imageUrl !== undefined && (
            <div className="post--content__img">
              <img src={post.imageUrl} alt="photo du post" /> 
            </div>
          )}
        </section>
        <footer className="post--footer">
          <div className="post--footer__bloc">
            <button
              className="post--footer__comment"
              aria-label="afficher les commentaires"
              onClick={displayComment}
            >
              {isComment ? (
                <i className="fa-solid fa-message post--footer__commentFilled"></i>
              ) : (
                <i className="fa-regular fa-message"></i>
              )}
            </button>
            <span className="post--footer__number">{commentsNumber}</span>
          </div>
          <div className="post--footer__bloc">
            <button
              className="post--footer__like"
              onClick={handleLikePost}
              aria-label="aimer le post"
            >
              {isLiked ? (
                <i className="fa-solid fa-heart post--footer__likeFilled"></i>
              ) : (
                <i className="fa-regular fa-heart"></i>
              )}
            </button>
            <span className="post--footer__number">{post.likes}</span>
          </div>
          <span className="post--footer__date"> Publié le {date}</span>
        </footer>
        {isComment && (
          <section className="post--comment">
            {post.comments.map((comment) => {
              return (
                <Comment
                  comment={comment}
                  key={comment._id}
                  users={usersData}
                  postId={post._id}
                />
              );
            })}
            <FormComment postId={post._id} />
          </section>
        )}
      </article>
    );
  }
}
