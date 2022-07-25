import React, { useState, useEffect, useContext } from "react";
import axios from "axios";


import { Context } from "../components/Context";
import Post from "../components/Post/Post";
import FormPost from "../components/Post/FormPost";
import Loading from "../components/Loading";

export default function Home() {
  // import context
  const { isLoading, setIsLoading, allPostsUpdate, setAllPostsUpdate } =
    useContext(Context);

  // stockage de tous les posts
  const [allPosts, setAllPosts] = useState([]);

  // requête pour récupérer les données de tous les posts
  useEffect(() => {
    // permet d'afficher le component Loading lors du chargement des données
    setIsLoading(true);
    axios({
      method: "get",
      url: "http://localhost:3000/api/posts",
      withCredentials: true,
    })
      .then((res) => {
        // mise à jour des états gérant le rendu des components
        setAllPostsUpdate(false);

        // la méthode reverse permet d'inverser les élements d'un tableau les posts sont alors affichés du plus récent au plus ancien
        const posts = res.data;
        const postsSort = posts.reverse();

        //stockage des posts et mise à jour de l'état isLoading pour afficher le contenu de la page
        setAllPosts(postsSort);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [allPostsUpdate]);

  // pour chaque post, affichage du component Post
  const post = allPosts.map((post) => {
    return <Post key={post._id} postId={post._id} />;
  });

  return (
    <main>
      <FormPost />
      {isLoading ? (
        <Loading />
      ) : post.length === 0 ? (
        <p className="home--message__post"> Aucun post à afficher</p>
      ) : (
        post
      )}
    </main>
  );
}
