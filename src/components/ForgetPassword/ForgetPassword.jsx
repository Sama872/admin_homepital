import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Alert from '@mui/material/Alert';

export default function ForgetPassword() {
  let navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  let userSchema = Yup.object({
    email: Yup.string().email("البريد الالكتروني غير صحيح").required("ادخل البريد الالكتروني"),
  });

  async function registerSubmit(values) {
    setLoading(true);
    try {
      let {data} = await axios.post(`http://localhost:8000/api/v1/auth/forgotPassword`, values);
        console.log(data);
        if(data.status==='success'){
          
          toast.success(data.message);
          navigate('/vcode')
        }
    } 
    catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
              toast.error(err.response.data.message);
            }
        }
  }
  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: userSchema,
    onSubmit: registerSubmit
  });

  return (
    <div className='w-75 mx-auto py-4 pt-5 mt-5'>
      <h2 className='text-main'>ادخل البريد الالكتروني</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor='email' className='text-muted h5 m-2'>البريد الالكتروني:</label>
        <input type='email' id='email' name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} className='form-control mb-2 inp' value={formik.values.email} />
        {formik.errors.email&&formik.touched.email?<Alert severity="error">{formik.errors.email}</Alert>:''}
        {loading ? <button type='button' className='btn bg-main text-light m-3'><i className='fas fa-spinner fa-spin'></i></button> :
          <button type='submit' className='btn form-button m-3' disabled={!(formik.dirty && formik.isValid)}>تاكيد</button>
        }
      </form>
    </div>
  );
}
