import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import Post from "../components/Post";
import FormPost from "../components/FormPost";
import { useContext } from "react";
import { Context } from "../components/Context";

export default function Home() {

    const {userId, allPostsUpdate, setAllPostsUpdate} = useContext(Context);
    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/posts',
            withCredentials: true,    
        })
        .then(res => {
            setAllPostsUpdate(false)
            setAllPosts(res.data)
        })
        .catch(err => console.log(err))  
    }, [allPostsUpdate])




    const post = allPosts.map(post => {

        return <Post 
        key={post._id} 
        postId={post._id}
        /> 
    })



    return (

        <>
        <FormPost/>
        {post}
        </>
    )
}