import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UseUserContext } from "../context/AppContext";
import noAvatar from "../assets/image/no-avatar.png";
import { createUser, getUserById, updateUser } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
export default function TableUser() {
  const { state, dispatch } = UseUserContext();
  const params = useParams();
  const navigate = useNavigate();
  const listOfProvince = [
    "British Columbia",
    "Alberta",
    "Manitoba",
    "New Brunswick",
    "Nova Scotia",
    "Ontario",
    "Newfoundland and Labrador",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
  ];
  if (params.id) {
    useEffect(() => {
      const timeOut = setTimeout(fetchGetUser, 20);
      return () => clearTimeout(timeOut);
    }, []);

    useEffect(() => {
      dispatch({ type: "setIsSingleLoading", payload: true });
    }, []);
  }

  const id = params.id;
  async function fetchGetUser() {
    dispatch({ type: "setPageTitle", payload: "Edit User" });
    const result = await getUserById(id);
    console.log(result.body.province);
    if (result.success) {
      setValue("name", result.body.firstname);
      setValue("family", result.body.lastname);
      setValue("phone", result.body.phone);
      setValue("province", listOfProvince[result.body.province]);
      setValue("desc", result.body.description);
      setValue("image", result.body.avatarURL);
    } else {
      // dispatch({type:"singleLoadingError" ,payload:})
    }
    dispatch({ type: "setIsSingleLoading", payload: false });
  }
  const { register, handleSubmit, watch, setValue, formState } = useForm({
    defaultValues: {
      name: "",
      family: "",
      phone: "",
      province: "",
      image: `https://i.pravatar.cc/300?img=`,
      description: "",
    },
  });
  const { errors } = formState;

  async function onSubmit(data) {
    if (params.id) {
      const newUser = {
        id: params.id,
        firstname: data.name,
        lastname: data.family,
        phone: data.phone,
        province: listOfProvince[data.province],
        avatarURL: data.image,
        description: data.desc,
      };
      const result = await updateUser(newUser);
      dispatch({
        type: "showNewListUser",
        payload: result.body,
      });
      toast.success("User Updated successfully!");
    } else {
      const result = await createUser(
        data.name,
        data.family,
        data.phone,
        listOfProvince[data.province],
        data.image,
        data.description
      );
      dispatch({
        type: "showNewListUser",
        payload: result.body,
      });
      toast.success(result.message);
    }
    navigate("/");
    dispatch({ type: "setPageTitle", payload: "Home" });
  }

  let content = "";
  if (state.isSingleLoading) {
    content = (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <span>on loading...</span>
        <span className="spinner-grow text-primary"></span>
      </div>
    );
  } else if (state.singleLoadingError) {
    content = (
      <div className="d-flex flex-column justify-content-between align-items-center">
        <span className="fs-4">{state.singleLoadingError.message}</span>
        <button className="btn btn-primary mt-5">Try again</button>
      </div>
    );
  } else {
    content = (
      <div className="table">
        <div className="d-flex justify-content-between align-items-center mb-3 ">
          <div className="d-flex flex-column justify-content-center align-items-start ">
            <label className="mb-1 label">Name</label>
            <input
              type="text"
              className="input"
              {...register("name", {
                required: "You must enter a name",
                minLength: {
                  value: 3,
                  message: "Name must be 3 Characters at least",
                },
                maxLength: {
                  value: 10,
                  message: "Name must be 10 Characters at most",
                },
              })}
            />
            {errors.name && <p className="errors">{errors.name.message}</p>}
          </div>
          <div className="d-flex flex-column justify-content-center align-items-start ">
            <label className="mb-1 label">Family</label>
            <input
              type="text"
              className="input"
              {...register("family", {
                required: "You must enter a family",
                minLength: {
                  value: 3,
                  message: "Family must be 3 Characters at least",
                },
                maxLength: {
                  value: 10,
                  message: "Family must be 10 Characters at most",
                },
              })}
            />
            {errors.family && <p className="errors">{errors.family.message}</p>}
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center  mb-3">
          <div className="d-flex flex-column justify-content-center align-items-start ">
            <label className="mb-1 label">Phone</label>
            <input
              type="text"
              className="input"
              {...register("phone", {
                required: "You must enter a Phone number",
                minLength: {
                  value: 12,
                  message: "It is short, Phone number must be 12 number",
                },
                maxLength: {
                  value: 12,
                  message: "It is long, Phone number must be 12 number",
                },
              })}
            />
            {errors.phone && <p className="errors">{errors.phone.message}</p>}
          </div>
          <div className="d-flex flex-column justify-content-center align-items-start ">
            <label className="mb-1 label">Province</label>
            <select
              className="input"
              {...register("province", {
                required: "Select the province",
              })}
            >
              {listOfProvince.map((province) => (
                <option key={province}>{province}</option>
              ))}
            </select>
            {errors.province && (
              <p className="errors">{errors.province.message}</p>
            )}
          </div>
        </div>
        <div className="d-flex flex-column justify-content-start align-items-start mb-4">
          <div className="d-flex  justify-content-center align-items-center">
            <label className="mb-1 label">Address of Image</label>
            <img
              src={watch("image")}
              width="40"
              className="rounded-circle img"
            />
          </div>

          <input
            type="text"
            className="w-100 input"
            {...register("image", {
              required: "Select the image",
            })}
          />
          {errors.image && <p className="errors">{errors.image.message}</p>}
        </div>
        <div className="d-flex flex-column justify-content-start align-items-start mb-4">
          <label>Describe</label>
          <textarea
            className="form-control"
            type="text"
            {...register("desc")}
          ></textarea>
        </div>
        <div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className=" w-75 m-auto mt-5" onSubmit={handleSubmit(onSubmit)}>
      {content}
    </form>
  );
}
