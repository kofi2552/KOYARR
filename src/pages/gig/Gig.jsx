import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: gigData,
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = gigData?.userId;

  // console.log(userId);

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: userData,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              Koyarr {">"} Graphics & Design {">"}
            </span>
            <h1>{gigData.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={userData.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{userData.username}</span>
                {!isNaN(gigData.totalStars / gigData.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(gigData.totalStars / gigData.starNumber))
                      .fill()
                      .map((_, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>
                      {Math.round(gigData.totalStars / gigData.starNumber)}
                    </span>
                  </div>
                )}
              </div>
            )}
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {gigData.images &&
                gigData.images.map((img) => <img key={img} src={img} alt="" />)}
            </Slider>
            <h2>About This Gig</h2>
            <p>{gigData.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={userData.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{userData.username}</span>
                    {!isNaN(gigData.totalStars / gigData.starNumber) && (
                      <div className="stars">
                        {Array(
                          Math.round(gigData.totalStars / gigData.starNumber)
                        )
                          .fill()
                          .map((_, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(gigData.totalStars / gigData.starNumber)}
                        </span>
                      </div>
                    )}
                    <button>Contact Me</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{userData.address}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{userData.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{gigData.shortTitle}</h3>
              <h2>$ {gigData.price}</h2>
            </div>
            <p>{gigData.shortDesc}</p>

            <Link to={`/pay/${id}`}>
              <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
