import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  let navigate = useNavigate();

  let userSchema = Yup.object({
    newPassword: Yup.string().required('يرجى إدخال كلمة السر').matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{6,}$/," ($,@,&,!)كلمه السر يجب ان تحتوي علي حرف كبير و خاص" ),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'كلمة السر غير صحيحة')
      .required('يرجى إدخال كلمة السر'),
  });

  async function registerSubmit(values) {
    try {
      const userToken = localStorage.getItem('userToken');
      const { data } = await axios.put(
        'http://localhost:8000/api/v1/auth/resetPassword',
        values,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
console.log(data)
      // Clear the reset token from local storage after successful reset
    //   localStorage.removeItem('resetToken');

      toast.success('تمت إعادة تعيين كلمة السر بنجاح');
      navigate('/login');
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(
          'حدث خطأ أثناء إعادة تعيين كلمة السر. يرجى المحاولة مرة أخرى.'
        );
      }
    }
  }

  let formik = useFormik({
    initialValues: {
      newPassword: '',
      passwordConfirm: '',
    },
    validationSchema: userSchema,
    onSubmit: registerSubmit,
  });

  return (
    <div className='w-75 mx-auto py-4 pt-5 mt-5'>
      <h2 className='text-main'>إعادة تعيين كلمة السر</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor='newPassword'>كلمة المرور</label>
        <input
          type='password'
          id='newPassword'
          name='newPassword'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control mb-2'
          value={formik.values.newPassword}
        />
        {formik.errors.newPassword && formik.touched.newPassword ? (
          <div className='alert alert-danger p-2 mt2'>
            {formik.errors.newPassword}
          </div>
        ) : (
          ''
        )}
        <label htmlFor='passwordConfirm'>تاكيد كلمة المرور</label>
        <input
          type='password'
          id='passwordConfirm'
          name='passwordConfirm'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control mb-2'
          value={formik.values.passwordConfirm}
        />
        {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? (
          <div className='alert alert-danger p-2 mt2'>
            {formik.errors.passwordConfirm}
          </div>
        ) : (
          ''
        )}
        <button
          type='submit'
          className='btn form-button'
          disabled={!(formik.dirty && formik.isValid)}
        >
          تاكيد
        </button>
      </form>
    </div>
  );
}
