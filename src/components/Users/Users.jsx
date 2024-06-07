import React, { useContext, useEffect, useRef, useState } from 'react';
import { UsersContext } from '../../Context/UsersContext';
import { BallTriangle } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Link, useParams } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';
import male from '../../Images/male-removebg-preview.png'
import female from '../../Images/female-removebg-preview.png'
export default function Users() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    userName:'',
    email: '',
    phone: '',
    age: ''
  });
  
  
  
  // validation of new user 
  let addUserSchema=Yup.object({
    userName:Yup.string().min(2,"الاسم صغير").required("من فضلك ادخل الاسم"),
    email:Yup.string().email("يرجي كتابه الايميل بشكل صحيح").required("من فضلك ادخل كلمه المرور"),
    // 123 456 7890
    
    password: Yup.string().required('يرجى إدخال كلمة السر').matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{6,}$/," ($,@,&,!)كلمه السر يجب ان تحتوي علي حرف كبير و خاص" ),
    passwordConfirm:Yup.string().oneOf([Yup.ref("password")],"كلمه السر غير صحيحه").required("يرجي تاكيد كلمه السر"),
    phone:Yup.string().matches(/^01[0125][0-9]{8}$/,"رقم الهاتف غير صحيح").required("يرجي ادخال رقم الهاتف"),
    gender:Yup.string().required("يرجي ادخال النوع"),
    age:Yup.string().required("يرجي ادخال العمر")
  })
  
   // second modal 
   const [showModal2, setShowModal2] = useState(false);
   const [newId ,setId]=useState(null)
   const handleShowModal2 = (id,userName,email,phone,age) => {setShowModal2(true);
    console.log(` id is :${id}`)
    setId(id)
    setFormData({userName,email,phone,age})

  }
   const handleCloseModal2 = () => setShowModal2(false);
  // update user
  const userNameRef=useRef(null)
  const emailRef=useRef(null)
  const phoneRef=useRef(null)
  const ageRef=useRef(null)
  useEffect(() => {
    if (newId) {
      // Assuming you have a function to fetch hospital data by ID
      fetchUserData(newId);
    }
  }, [newId]);
  const fetchUserData = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`http://localhost:8000/api/v1/hospital/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { data } = response;
      const { userName, email, phone, age } = data;
      setFormData({ userName , email ,phone, age}); // Set the form data with the fetched data
      console.log('Updated formData:', { userName, email, phone, age}); // Log updated formData
    } catch (error) {
      console.log(error);
      // Handle error fetching hospital data
    }
  };

  // update 
  const updateHandler = async () => {
     setErrors({});

     //validation
     const newErrors = {};
     if (!userNameRef.current.value.trim()) {
       newErrors.userName = 'يرجى إدخال اسم المستخدم';
     }
 
     if (!emailRef.current.value.trim()) {
       newErrors.email = 'يرجى إدخال البريد الإلكتروني';
     } else if (!/^\S+@\S+\.\S+$/.test(emailRef.current.value)) {
       newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
     }
     if (!ageRef.current.value.trim()) {
      newErrors.age = 'يرجى إدخال العمر';
    } else if (isNaN(ageRef.current.value)) {
      newErrors.age = 'يرجى إدخال قيمة عددية للعمر';
    } else if (parseInt(ageRef.current.value) <= 0) {
      newErrors.age = 'يرجى إدخال قيمة عددية صحيحة للعمر';
    }
  
    if (!phoneRef.current.value.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف';
    } else if (!/^01[0125][0-9]{8}$/.test(phoneRef.current.value)) {
      newErrors.phone = 'يرجى إدخال رقم هاتف صحيح';
    }
    
     if (Object.keys(newErrors).length > 0) {
      
       setErrors(newErrors); 
       return;
     }
// end validation
    try {
      const token = localStorage.getItem('userToken');
      console.log(`token is :${token}`);
      console.log(newId);
  
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/users/${newId}`,
        {
          userName: userNameRef.current.value,
          email: emailRef.current.value,
          age: ageRef.current.value,
          phone: phoneRef.current.value
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (data.data) {
        toast.success("تم تعديل المستخدم");
      }
  
      console.log(data);
      handleClose();
      usersItems();
    } catch (error) {
      console.log(error);
      toast.error("حدث  خطا");
    }
  };
 

  const {npage}=useParams()
   // modal 
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   // second modal 
   // add new user 
   async function handleAddnewuser(values) {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.post('http://localhost:8000/api/v1/users', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(values)
  
      if (data.data) {
        toast.success("تم اضافه مستخدم جديد");
      }
      console.log(data);
      handleClose();
      usersItems();
    } catch (error) {
      console.log(error);
      toast.error("هذا المستخدم موجود بالفعل");
    }
  }
  // end update user
  let formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
      gender: "",
      age: ""
    },validationSchema:addUserSchema,
    onSubmit: handleAddnewuser
  });
  
  
  const { getUsers, deleteSpecificUser} = useContext(UsersContext);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  

  // Function to delete one user
  async function deleteOneUser(userId) {
    try {
      const { data } = await deleteSpecificUser(userId);
      console.log(data);
      if (data.errors && data.errors.length > 0) {
        const error = data.errors[0];
        if (error.type === "field" && error.msg === "user is diactivated already") {
          toast.error('هذا المستخدم معطل بالفعل', {
            duration: 3000
          });
        }
      } else {
        // User deleted successfully
        toast.success('تم حذف المستخدم', {
          duration: 3000
        });
        // Update the users list after deletion
        usersItems();
      }
    } catch (error) {
      // Handle error if any
      console.error("Error deleting user:", error);
      // Display a generic error message
      toast.error('هذا المستخدم معطل بالفعل', {
        duration: 3000
      });
    }
  }

  // Function to fetch all users
  async function usersItems(index) {
    try {
      const { data } = await getUsers(index);
      console.log(data);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    usersItems(npage);
  }, [npage]);

  // Return JSX
   return (
    <div className='row m-4 pt-5'>
      {loading ? (
        <BallTriangle
          visible={true}
          height='80'
          width='80'
          color='#9abf4d'
          ariaLabel='puff-loading'
          wrapperClass="d-flex mt-5 justify-content-center"
        />
      ) : users ? (
        <Fade>
        <div className='row' >
          
        <div>
        <button className='btn botton d-flex justify-content-center mx-auto my-2' onClick={handleShow} >
               اضافه مستخدم جديد
      </button>
        </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className='mx-auto fw-bold text-main'>مستخدم جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form className='row container mx-auto my-2'>
                <input placeholder='اسم المستخدم' id='userName' name='userName' type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.userName} className='input-modal my-2'/>
                {formik.errors.userName&&formik.touched.userName?<Alert severity="error">{formik.errors.userName}</Alert>:''}
                <input placeholder='البريد الالكتروني' id='email' name='email' type='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className='input-modal my-2'/>
                {formik.errors.email&&formik.touched.email?<Alert severity="error">{formik.errors.email}</Alert>:''}
                <input placeholder='رقم الهاتف' id='phone' name='phone' type='tel' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} className='input-modal my-2'/>
                {formik.errors.phone&&formik.touched.phone?<Alert severity="error">{formik.errors.phone}</Alert>:''}
                <input placeholder='كلمه السر' id='password' name='password' type='password' onChange={formik.handleChange} onBlur={formik.handleBlur}  value={formik.values.password} className='input-modal my-2'/>
                {formik.errors.password&&formik.touched.password?<Alert severity="error">{formik.errors.password}</Alert>:''}
                <input placeholder='تاكيد كلمه السر' id='passwordConfirm' name='passwordConfirm' type='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.passwordConfirm} className='input-modal my-2'/>
                {formik.errors.passwordConfirm&&formik.touched.passwordConfirm?<Alert severity="error">{formik.errors.passwordConfirm}</Alert>:''}
                <select name="gender" id="gender" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.gender} className='input-modal my-2 h-25'>
                    <option>النوع</option>
                    <option value="female">female</option>
                    <option value="male">male</option>
                </select>
                {formik.errors.gender&&formik.touched.gender?<Alert severity="error">{formik.errors.gender}</Alert>:''}
                <input placeholder='العمر' id='age' name='age' type='number' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.age} className='input-modal my-2'/>
                {formik.errors.age&&formik.touched.age?<Alert severity="error">{formik.errors.age}</Alert>:''}
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            اغلق
          </Button>
          <Button className='botton' onClick={formik.handleSubmit}>
            اضافه
          </Button>
        </Modal.Footer>
      </Modal>
      {/* second modal for edit  */}
      {/* Modal 2 */}
      <Modal show={showModal2} onHide={handleCloseModal2}>
        
        <Modal.Header>
          <Modal.Title className='mx-auto text-main'>تعديل المستخدم</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form className='row container'>
              <label className='text-main h6 mt-2' htmlFor='userName'>اسم المستخدم</label>
                <input placeholder='اسم المستخدم' id='userName' name='userName' type='text' ref={userNameRef} className='input-modal my-2'
                value={formData.userName} 
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
                {errors.userName && <Alert severity="error">{errors.userName}</Alert>}
                <label className='text-main h6 mt-2' htmlFor='email'> البريد الالكتروني</label>
                <input placeholder='البريد الالكتروني' id='email' name='email' type='email'  ref={emailRef} className='input-modal my-2'
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <Alert severity="error">{errors.email}</Alert>}
                <label className='text-main h6 mt-2' htmlFor='phone'>رقم الهاتف</label>
                <input placeholder='رقم الهاتف' id='phone' name='phone' type='tel'  ref={phoneRef} className='input-modal my-2'
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <Alert severity="error">{errors.phone}</Alert>}
                <label className='text-main h6 mt-2' htmlFor='age'> العمر</label>
                <input placeholder='العمر' id='age' name='age' type='number'  ref={ageRef} className='input-modal my-2'
                value={formData.age} 
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
                {errors.age && <Alert severity="error">{errors.age}</Alert>}
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal2}>
            اغلق
          </Button>
          <Button className='botton' onClick={updateHandler}>
            تاكيد
          </Button>
        </Modal.Footer>
      </Modal>
          {users.data.map((user) => (
            <div key={user._id} className='col-lg-4'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <div className='d-flex'>
                  {user.gender === "male"?<img src={male} alt='male' width={50}/>:<img src={female} alt='female' width={50}/>}
                  <h5 className='card-title text-main mt-3'>{user.userName}</h5>
                  </div>
                  <h6 className='card-subtitle mb-2 text-muted'>{user.email}</h6>
                  <h5 className='text-muted'>{user.phone}</h5>
                  <h5 className='text-muted'>{user.gender}</h5>
                  <h5 className='text-muted'>{user.age}</h5>
                  <div className='d-flex justify-content-center align-items-center'>
                    {user.active === true ? (
                      <i className="fas fa-circle m-2" style={{ color: "green" }}></i>
                    ) : (
                      <i className="fas fa-circle m-2" style={{ color: "red" }}></i>
                    )}
                    <i className="fa-solid fa-trash fa-l m-2" style={{ color: "#ec0909" }} onClick={() => deleteOneUser(user._id)}></i>
                    <i className="fas fa-edit m-2" onClick={()=>handleShowModal2(user._id,user.userName,user.email,user.phone,user.age)}></i>
                  </div>
                </div>
              </div>
            </div>
            
          ))}
          <div className='d-flex justify-content-center mt-2'>
          <Pagination
          color='success'
          defaultPage={2}
          
        count={users.paginationResult.numberOfPages}
        renderItem={(item) => 
          (
          
          <Link to={`/users/${item.page}`}>
          <PaginationItem 
            {...item}
          />
          </Link>
        
        )
      

    }
      />
      
          </div>
          </div>
          </Fade>
      ) : null}
    </div>
  );
}
