// import React, { useState } from 'react'
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";
import Alert from "@mui/material/Alert";

export default function Login() {
  let navigate = useNavigate();
  let { setAdminToken } = useContext(AdminContext);

  let userSchema = Yup.object({
    email: Yup.string()
      .email("يرجي كتابه الايميل بشكل صحيح")
      .required("يرجي ادخال البريد الالكتروني"),
    password: Yup.string()
      .matches(
        /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{6,}$/,
        "كلمه السر غير صحيحه"
      )
      .required("يرجي ادخال كلمه السر"),
  });

  async function registrationhandle(values) {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/auth/login`,
        values
      );
      console.log(data);
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", data.data.role);
      setAdminToken(data.token);
      if (data.data.role !== "admin") {
        toast.error("لا يمكن تسجيل الدخول");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          duration: 3000,
        });
      }
    }
  }

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: userSchema,
    onSubmit: registrationhandle,
  });

  return (
    <div >
      <div className="w-75 mx-auto py-4 container m-5">
        <h2 className="text-main center-text m-3 mb-5">تسجيل الدخول</h2>
        <div className="d-flex justify-content-center">
          <form className="row w-75 container" onSubmit={formik.handleSubmit}>
            <input
              type="email"
              placeholder="البريد الالكتروني"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="inp mb-5 "
            />

            {formik.errors.email && formik.touched.email ? (
              <Alert severity="error" className="mb-3">{formik.errors.email}</Alert>
            ) : (
              ""
            )}
            <input
              type="password"
              placeholder="كلمه السر"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="inp mb-5"
            />

            {formik.errors.password && formik.touched.password ? (
              <Alert severity="error" className="mb-3"> {formik.errors.password} </Alert>
            ) : (
              ""
            )}
            <div className="col-4 d-flex justify-content-center align-items-center">
              <button className="btn botton my-2 text-light" type="submit">
                تاكيد
              </button>
              <Link to={"/forgetpassword"} className="m-2">
                هل نسيت كلمه السر؟
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
