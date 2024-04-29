import React, { useContext, useEffect, useRef, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import { HospitalsContext } from '../../Context/HospitalsContext';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { Fade } from "react-awesome-reveal";
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';
export default function Hospitals() {

  const [formData, setFormData] = useState({
    name:'',
    address: '',
    beds: '',
    phone: ''
  });
 
  const [errors, setErrors] = useState({});
  // validation of add hospital 
  let addhospitalSchema=Yup.object({
    name:Yup.string().min(4,"الاسم صغير").required("يرجي ادخال اسم المستشفي"),
    address:Yup.string().required("يرجي ادخال العنوان"),
    // 123 456 7890
    phone:Yup.string().matches(/^01[0125][0-9]{8}$/,"رقم الهاتف غير صحيح").required("يرجي ادخال رقم الهاتف"),
    type:Yup.string().required("يرجي ادخال القطاع"),
    beds:Yup.string().required("يرجي ادخال السراير المتاحه"),
    cases:Yup.string().required("يرجي ادخال الحالات المتاحه"),
    latitude:Yup.string().required(" latitude يرجي ادخال "),
    longitude:Yup.string().required(" longitude يرجي ادخال "),

  })
  // update hospital 
  const [showModal2, setShowModal2] = useState(false);
   const [newId ,setId]=useState(null)
   const handleShowModal2 = (id,name,address,beds,phone) => {setShowModal2(true);
    console.log(` id is :${id}`)
    setId(id)
   setFormData({name,address,beds,phone})
  }
   const handleCloseModal2 = () => setShowModal2(false);
  // update user
  const nameRef=useRef(null)
  const addressRef=useRef(null)
  const bedsRef=useRef(null)
  const phoneRef=useRef(null)
  useEffect(() => {
    if (newId) {
      // Assuming you have a function to fetch hospital data by ID
      fetchHospitalData(newId);
    }
  }, [newId]);
  
  const fetchHospitalData = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`http://localhost:8000/api/v1/hospital/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { data } = response;
      const { name, address, beds, phone } = data;
      setFormData({ name , phone , address, beds}); // Set the form data with the fetched data
      console.log('Updated formData:', { name, phone, address, beds}); // Log updated formData
    } catch (error) {
      console.log(error);
      // Handle error fetching hospital data
    }
  };
  

  // update 
  const updateHandler = async ()=>{
    setErrors({});

    //validation
    const newErrors = {};
    if (!nameRef.current.value.trim()) {
      newErrors.name = 'يرجى إدخال اسم المستشفي';
    }

    if (!addressRef.current.value.trim()) {
      newErrors.address = 'يرجى إدخال العنوان';
    } 
    if (!bedsRef.current.value.trim()) {
     newErrors.beds = 'يرجى إدخال عدد السراير';
   } else if (isNaN(bedsRef.current.value)) {
     newErrors.beds = 'يرجى إدخال عدد السراير';
   } else if (parseInt(bedsRef.current.value) <= 0) {
     newErrors.beds = 'يرجى إدخال عدد السراير المتاحه';
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

    try{const token = localStorage.getItem('userToken');
    console.log(`token is :${token}`)
    console.log(newId)
    const {data} = await axios.put(`http://localhost:8000/api/v1/hospital/${newId}` ,
     {name:nameRef.current.value,
    address:addressRef.current.value,
    phone:phoneRef.current.value,
    beds:bedsRef.current.value}, {
      headers : {
        Authorization : `Bearer ${token}`
      }
      

    }
  ) 
    
    if (data.data) {
      toast.success("تم تعديل المستشفي");
    }
    console.log(data);
    handleClose();
    hospitalsItems();
  } catch (error) {
    console.log(error);
    toast.error("هذا المستشفي موجود بالفعل");
  }

  }

  // modal 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { getHospitals, deleteSpecificHospital} = useContext(HospitalsContext);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospital] = useState([]);
  // add new hospital
  // add new user 
  async function handleAddhospital(values) {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.post('http://localhost:8000/api/v1/hospital', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (data.data) {
        toast.success("تم اضافه مستشفي جديد");
      }
      console.log(data);
      handleClose();
      hospitalsItems();
    } catch (error) {
      console.log(error);
      toast.error("هذا المستشفي موجود بالفعل");
    }
  }
  // hospital formik
  let formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      beds: "",
      phone: "",
      cases: "",
      type: "",
      latitude: "",
      longitude:""
    },validationSchema:addhospitalSchema,
    onSubmit: handleAddhospital
  });
  
  // Function to delete one user
  async function deleteOneUser(userId) {
    try {
      const { data } = await deleteSpecificHospital(userId);
      console.log(data);
      if (data.errors && data.errors.length > 0) {
        const error = data.errors[0];
        if (error.type === "field") {
          toast.error('حدث خطا', {
            duration: 3000
          });
        }
      } else {
        // User deleted successfully
        toast.success('تم حذف المستشفي', {
          duration: 3000
        });
        // Update the users list after deletion
        hospitalsItems();
      }
    } catch (error) {
      // Handle error if any
      console.error("Error deleting user:", error);
    }
  }
  // Function to fetch all users
  async function hospitalsItems() {
    try {
      const { data } = await getHospitals();
      console.log(data);
      setHospital(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    hospitalsItems();
  }, []);

  return (
    <div className='row m-4 pt-5'>
      {loading ? (
        <BallTriangle
          visible={true}
          height='80'
          width='80'
          color='#071355'
          ariaLabel='puff-loading'
          wrapperClass="d-flex mt-5 justify-content-center"
        />
      ) : hospitals ? (
        <Fade>
          <div className='row'>
         <div>
         <button onClick={handleShow} className='btn btn-primary d-flex justify-content-center mx-auto my-2'>
               اضافه مستشفي جديد
      </button>
         </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className='mx-auto fw-bold text-main'>اضافه مستشفي جديده</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form className='row container mx-auto'>
                <input placeholder='اسم المستشفي' id='name' name='name' type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} className='input-modal my-2'/>
                {formik.errors.name&&formik.touched.name?<Alert severity="error">{formik.errors.name}</Alert>:''}
                <input placeholder='الموقع' id='address' name='address' type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.address} className='input-modal my-2'/>
                {formik.errors.address&&formik.touched.address?<Alert severity="error">{formik.errors.address}</Alert>:''}
                <input placeholder='رقم الهاتف' id='phone' name='phone' type='tel' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} className='input-modal my-2'/>
                {formik.errors.phone&&formik.touched.phone?<Alert severity="error">{formik.errors.phone}</Alert>:''}
                <input placeholder='عدد السراير' id='beds' name='beds' type='number' onChange={formik.handleChange} onBlur={formik.handleBlur}  value={formik.values.beds} className='input-modal my-2'/>
                {formik.errors.beds&&formik.touched.beds?<Alert severity="error">{formik.errors.beds}</Alert>:''}
                <textarea placeholder='التخصصات' id='cases' name='cases' type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.cases} className='input-modal my-2'/>
                {formik.errors.cases&&formik.touched.cases?<Alert severity="error">{formik.errors.cases}</Alert>:''}
                <select name="type" id="type" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.type}>
                    <option>القطاع</option>
                    <option value="Private">Private</option>
                    <option value="Governmental">Governmental</option>
                </select>
                {formik.errors.type&&formik.touched.type?<Alert severity="error">{formik.errors.type}</Alert>:''}
  
                <input placeholder='latitude' id='latitude' name='latitude' type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.latitude} className='input-modal my-2'/>
                {formik.errors.latitude&&formik.touched.latitude?<Alert severity="error">{formik.errors.latitude}</Alert>:''}
                <input placeholder='longitude' id='longitude' name='longitude' type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.longitude} className='input-modal my-2'/>
                {formik.errors.longitude&&formik.touched.longitude?<Alert severity="error">{formik.errors.longitude}</Alert>:''}
                
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            اغلق
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            اضافه
          </Button>
        </Modal.Footer>
      </Modal>
      {/* second modal for edit  */}
      {/* Modal 2 */}
      <Modal show={showModal2} onHide={handleCloseModal2}>
  <Modal.Header>
    <Modal.Title className='mx-auto'>تعديل المستشفى</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form className='row container'>
      <input
        placeholder='اسم المستشفى'
        id='name'
        name='name'
        type='text'
        ref={nameRef}
        className='input-modal my-2'
        value={formData.name} // Set value from formData state
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {errors.name && <Alert severity="error">{errors.name}</Alert>}
      <textarea
        placeholder='الموقع'
        id='address'
        name='address'
        type='text'
        ref={addressRef}
        className='input-modal my-2'
        value={formData.address} // Set value from formData state
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      {errors.address && <Alert severity="error">{errors.address}</Alert>}
      <input
        placeholder='عدد السرائر'
        id='number'
        name='beds'
        type='number'
        ref={bedsRef}
        className='input-modal my-2'
        value={formData.beds} // Set value from formData state
        onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
      />
      {errors.beds && <Alert severity="error">{errors.beds}</Alert>}
      <input
        placeholder='رقم الهاتف'
        id='phone'
        name='phone'
        type='tel'
        ref={phoneRef}
        className='input-modal my-2'
        value={formData.phone} // Set value from formData state
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      {errors.phone && <Alert severity="error">{errors.phone}</Alert>}
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal2}>
      اغلق
    </Button>
    <Button variant="primary" onClick={updateHandler}>
      تاكيد
    </Button>
  </Modal.Footer>
</Modal>

          {hospitals.data.map((hospital) => (
            
            <div key={hospital._id} className='col-4 mb-4'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title text-main'>{hospital.name}</h5>
                  <h6 className='card-subtitle mb-2 text-muted' >عدد السراير المتاحه: {hospital.beds}</h6>
                  <h5 className='text-main'>{hospital.phone}</h5>
                  <h6 className='text-main'>{hospital.cases}</h6>
                  <h5 className='text-main'>{hospital.type}</h5>
                  <h6 className='card-subtitle mb-2 text-muted text-pointer' onClick={() => window.location.href = hospital.address}>
                  <i className="fa-solid fa-location-dot m-2"></i>
                    الموقع
    
                  </h6>
                  
                  
                  <div className='d-flex justify-content-center align-items-center'>
                    <i className="fa-solid fa-trash fa-l m-2" style={{ color: "#ec0909" }} onClick={() => deleteOneUser(hospital._id)}></i>
                    <i className="fas fa-edit m-2" onClick={()=>handleShowModal2(hospital._id,hospital.name,hospital.address,hospital.beds,hospital.phone)}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </Fade>
      ) : null}
    </div>
  );
}
