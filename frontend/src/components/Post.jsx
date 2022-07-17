import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "./Context";
import Comment from "./Comment";
import axios from "axios";
import FormUpdatePost from "./FormUpdatePost";
import FormComment from "./FormComment";


export default function Post(props) {

    const {userId, setAllPostsUpdate, postUpdate, setPostUpdate} = useContext(Context);

    const [usersData, setUsersData] = useState([]);
    const [post, setPost] = useState({});
    const [isComment, setIsComment] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isPut, setIsPut] = useState(false);
    const [commentsNumber, setCommentsNumber] = useState(0)

    useEffect(() => {

        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}`,
            withCredentials: true
        })
        .then(res => {
            setPostUpdate(false)
            setIsPut(false)
            setPost(res.data)
            setCommentsNumber(res.data.comments.length)
        })
        .catch(err => console.log(err))
    }, [postUpdate, props.postId, setPostUpdate])


    

    useEffect(() => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/auth/user`,
            withCredentials: true
        })
        .then(res => setUsersData(res.data))
        .catch(err => console.log(err))
    }, [])


    function handleLikePost() {

        const postLiked = post.usersLiked.includes(userId);

        if(postLiked) {
            setIsLiked(true)
        } else {
            setIsLiked(false)
        }

      if (isLiked === true) {

        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/posts/${post._id}/like`,
            withCredentials: true,
            data: {
                userId: userId,
                like: 0
            }
        })
        .then(res => {
            setPostUpdate(true)
            setIsLiked(false)
            console.log(res)})

      } else {

        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/posts/${post._id}/like`,
            withCredentials: true,
            data: {
                userId: userId,
                like: 1
            }
        })
        .then(res => {
            setPostUpdate(true)
            setIsLiked(true)
            console.log(res)})
      }    
    }


    function handleDeletePost() {
        axios({
            method: 'delete',
            url: `${process.env.REACT_APP_API_URL}/posts/${post._id}`,
            withCredentials: true
        })
        .then(() => {
            setAllPostsUpdate(true)
        })
    }

    function handlePut() {
        setIsPut(prevPut => !prevPut)
      }



    function displayComment() {
        setIsComment(prevIsComment => !prevIsComment);
    }


    

        

            { return (isPut ?

             <FormUpdatePost 
             postId={post._id}
             imageUrl={post.imageUrl}
             message={post.message}
             /> : 

             <article className="post">
             <div className="post--header">

                <div className="post--header__user">
                <div className="post--header__userImg">

                    <img src={usersData.map(user => 
                            {
                            if(user._id === post.userId) return user.imageUrl
                            }).join('')
                    }
                    crossOrigin="anonymous"
                    alt="photo"
                    />

                </div>

                <h3 className="post--header__userName"> 
                    {usersData.map((user, role) => 
                        {
                        if(user._id === post.userId) return user.firstName  
                        })
                    }
                </h3>
                </div>

                { userId === post.userId &&

                <div className="post--header__btn">
                    <button className="post--header__btnModify" onClick={handlePut}> <i className="fa-solid fa-pencil"> </i> </button>
                    <button className="post--header__btnDelete" onClick={handleDeletePost}> <i className="fa-solid fa-xmark"></i> </button> 
                </div>

                }


            </div>
            <div className="post--content">
            {post.imageUrl !== undefined && 

                <div className="post--content__img">
            
                <img crossOrigin="anonymous"
                src={post.imageUrl} 
                alt='photo du post'/> 

                </div>
                
            }
                <p className="post--content__text">{post.message}</p>
            </div>
            <div className="post--footer">

                <div className="post--footer__bloc">
                    <button className="post--footer__comment" onClick={displayComment}> {isComment ?<i className="fa-solid fa-message"></i> : <i className="fa-regular fa-message"></i> } </button>
                    <span className="post--footer__number">{commentsNumber}</span>
                </div>
                <div className="post--footer__bloc">
                    <button className="post--footer__like" onClick={handleLikePost}> {isLiked ? <i className="fa-solid fa-heart"></i> : <i class="fa-regular fa-heart"></i>} </button>
                    <span className="post--footer__number">{post.likes}</span>
                </div>
            </div>
           { isComment && <div className="post--comments">

            { post.comments.map(comment => 
                {return <Comment comment={comment} key={comment._id} users={usersData} postId={post._id} />}) 
            }

            <FormComment postId={post._id} />

            </div> }
        </article>
        
    )}

}