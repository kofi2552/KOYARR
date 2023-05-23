import React, { useReducer, useState, useEffect } from "react";
import axios from "axios";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
// import getCurrentUser from "../../utils/getCurrentUser";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  // const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/categories/all"
        );
        setCategories(response.data);
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleCategoryChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "cat", value: e.target.value },
    });
  };

  // const handleFeature = (e) => {
  //   e.preventDefault();
  //   dispatch({
  //     type: "ADD_FEATURE",
  //     payload: e.target[0].value,
  //   });
  //   e.target[0].value = "";
  // };

  const handleUploadAndSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          console.log(url);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });

      // Submit the form after successful upload
      handleSubmit();
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {
    const payload = { ...state, categoryId: state.cat }; // Include categoryId in the payload
    mutation.mutate(payload);
    console.log(state);
    // mutation.mutate(state);
    // // navigate("/mygigs/");
    // navigate(`/user/myGigs/${currentUser.id}`);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select
              name="categoryId"
              id="cat"
              value={state.cat}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              {/*<button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>*/}
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="price">Price</label>
            <input type="number" onChange={handleChange} name="price" />
            <div className="details">
              <label htmlFor="">Service Title</label>
              <input
                type="text"
                name="shortTitle"
                placeholder="e.g. One-page web design"
                onChange={handleChange}
              />
            </div>
            <button onClick={handleUploadAndSubmit}>
              {uploading ? "Uploading" : "Create"}
            </button>
          </div>

          {/*
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            */}
        </div>
      </div>
    </div>
  );
};

export default Add;
