import React from "react";

export default function Post() {

    return(
        <article className="post">
            <div className="post--header">
                <img className="post--header__userImg"/>
                <h3 className="post--header__userName"></h3>
                <button className="post--header__modify"></button>
                <button className="post--header__delete"></button>
            </div>
            <div className="post--content">
                <p className="post--content__text"></p>
                <img className="post--content__img" />
            </div>
            <div className="post--footer">
                <button className="post--footer__comment"></button>
                <button className="post--footer__like"></button>
                <span className="post--footer-likesNumber"></span>
            </div>
            <div className="post--comments"></div>
        </article>
    )

}