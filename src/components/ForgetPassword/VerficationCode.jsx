import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

export default function VerificationCode() {
  const navigate = useNavigate();

  const userSchema = Yup.object({
    resetCode: Yup.string().required('ادخل كود التاكيد'),
  });

  async function registerSubmit(values) {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/auth/verifyResetCode`,
        values
      );

      // Save the token to local storage
      localStorage.setItem('userToken', data.token);

      if (data.message === 'الكود صحيح') {
        toast.success(data.message);
        navigate('/resetpassword');
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      resetCode: '',
    },
    validationSchema: userSchema,
    onSubmit: registerSubmit,
  });

  return (
    <div className='w-75 mx-auto py-4 pt-5 mt-5'>
      <h2 className='text-main'>ادخال كود التاكيد</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor='resetCode text-muted'>كود التاكيد</label>
        <input
          type='text'
          id='resetCode'
          name='resetCode'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control mb-2'
          value={formik.values.resetCode}
        />
        {formik.errors.resetCode && formik.touched.resetCode ? (
          <Alert severity='error'>{formik.errors.resetCode}</Alert>
        ) : (
          ''
        )}
        <button
          type='submit'
          className='btn form-button m-3'
          disabled={!formik.isValid}
        >
          تاكيد
        </button>
      </form>
    </div>
  );
}
