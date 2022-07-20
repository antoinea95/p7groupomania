import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import Post from "../components/Post";
import FormPost from "../components/FormPost";
import { useContext } from "react";
import { Context } from "../components/Context";
import Loading from "../components/Loading";

export default function Home() {
  const {isLoading, setIsLoading , allPostsUpdate, setAllPostsUpdate } = useContext(Context);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    setIsLoading(true)
    axios({
      method: "get",
      url: "http://localhost:3000/api/posts",
      withCredentials: true,
    })
      .then((res) => {
        setIsLoading(false)
        setAllPostsUpdate(false);
        const posts = res.data;
        const postsSort = posts.reverse()
        setAllPosts(postsSort);
      })
      .catch((err) => {
        console.log(err)});
  }, [allPostsUpdate]);

  const post = allPosts.map((post) => {
    return <Post key={post._id} postId={post._id} />;
  });

  return (
    <>
      <FormPost />
      {post}
    </>
  );
}
