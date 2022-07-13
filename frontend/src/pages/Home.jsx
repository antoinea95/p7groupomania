import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import Post from "../components/Post";
import FormPost from "../components/FormPost";

export default function Home() {

    const [allPosts, setAllPosts] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/posts',
            withCredentials: true,    
        })
        .then(res => setAllPosts(res.data))
        .catch(err => console.log(err))  
    }, [])



    return (

        <>
        <FormPost/>
        <Post />
        </>
    )
}