import React, { useContext, useState } from 'react'
import { AppContext } from '../useContext/Context';
import swal from 'sweetalert';
import { EventInput } from '../types/types';
import { getId } from '../layout/Header';
import { createOrder } from '../service/_request';



const OrderInput = () => {
    let inputFeild = "form-floating mb-3 col-md-5 col-sm-12 col-12 "
    const today = new Date().toISOString().split('T')[0];

    const [eventInput, setEventInput] = useState<EventInput>({
        name: "",
        event_type: "",
        event_date: "",
        level: "",
        contact: "",
        alternative_contact: "",
        mail_id: "",
        venue:"" 
    })

    const { orders, setOrders, } = useContext(AppContext)
    const { name, event_type, event_date, level, contact, alternative_contact, mail_id,venue } = eventInput;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEventInput(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    }


    const handleSubmit = (e: React.MouseEvent, eventInput: EventInput) => {
        e.preventDefault();
        const id = getId();
        if (!id) {
            alert("Please login properly");
            return;
        }
        const { name, event_type, event_date, level, contact, mail_id, venue } = eventInput;
        if (!name || !event_type || !event_date || !level || !contact || !mail_id || !venue) {
            alert("All fields are required");
            return;
        }
        createNewOrder(eventInput);
    };

    const resetButton = () => {
        setEventInput({
            name: "",
            event_type: "",
            event_date: "",
            level: "",
            contact: "",
            alternative_contact: "",
            mail_id: "",
            venue:""
        })
    }

    const createNewOrder = async (eventInput: EventInput) => {
        try {
            const id = getId();
            const response = await createOrder({...eventInput, customer_id: id!} as any)
            if (response) {
                setOrders([response, ...orders]);
                swal({
                    title: "Request sent successfully",
                    text: "You can track your order by clicking My Orders",
                    icon: "success",
                })
                resetButton()
            }
        } catch (err) {
            console.error("Error creating order:", err);
            alert("Failed to create order. Please try again.");
        }
    };

    return (
        <React.Fragment>
            <div className=' container-fluid new-order pt-5'>
                <h3>Order Here</h3>
                <div className="input-box container ">
                    <div className='  ps-3 d-flex justify-content-center' >

                        <div className='col-12 '>
                            <form  >
                                <div className="col-12 d-flex justify-content-between flex-wrap">
                                    <div className={inputFeild}>
                                        <input type='text' className='form-control' name='name' value={name} placeholder='name' required onChange={handleInputChange}  style={{boxShadow:"none"}}/>
                                        <label htmlFor="floatingInput">Name</label>
                                    </div>
                                    <div className={inputFeild}>
                                        <select className="form-select" id="floatingSelectGrid" name='event_type' value={event_type} required onChange={handleInputChange } style={{boxShadow:"none"}}>
                                            <option >choose one</option>
                                            <option value="Birthday"  >Birth day</option>
                                            <option value="Marriage">Marriage</option>
                                            <option value="Reception">Reception</option>
                                            <option value="Engagement">Engagement</option>
                                            <option value="Babyshower">Baby shower</option>
                                            <option value="others">other rituals</option>
                                        </select>
                                        <label htmlFor="floatingSelectGrid">Function Type</label>
                                    </div>
                                    <div className={inputFeild} >
                                        <input type='date' className='form-control' placeholder="Event Date" required
                                            name='event_date' value={event_date} min={today} onChange={handleInputChange} style={{boxShadow:"none"}}/>
                                        <label htmlFor="floatingInput">Event Date</label>
                                    </div>
                                    <div className={inputFeild}>
                                        <select className="form-select" id="floatingSelectGrid" name='level' required value={level} onChange={handleInputChange} style={{boxShadow:"none"}}>
                                            <option className='text-secondary' >choose one</option>
                                            <option value="SILVER"  >SILVER ( 50k - 80k )</option>
                                            <option value="GOLD"  >GOLD ( 80k - 120k )</option>
                                            <option value="PLATINUM">PLATINUM ( 120k - 200k )</option>
                                            <option value="DIAMOND">DIAMOND ( 200k & above )</option>
                                        </select>
                                        <label htmlFor="floatingSelectGrid">Price( ₹ )</label>
                                    </div>
                                    <div className={inputFeild}>
                                        <input type='text' className='form-control' name='venue' value={venue} placeholder='name' required onChange={handleInputChange} style={{boxShadow:"none"}} />
                                        <label htmlFor="floatingInput">Venue</label>
                                    </div>
                                    <div className={inputFeild}>
                                        <input type='text' className='form-control' placeholder="contact"
                                            inputMode='numeric' maxLength={10} minLength={10} name='contact' required value={contact} onChange={handleInputChange} style={{boxShadow:"none"}}/>
                                        <label htmlFor="floatingInput">Contact</label>
                                    </div>
                                    <div className={inputFeild}>
                                        <input type='text' className='form-control' placeholder="Alternative contact"
                                            inputMode='numeric' maxLength={10} minLength={10} name='alternative_contact' value={alternative_contact} onChange={handleInputChange} style={{boxShadow:"none"}} />
                                        <label htmlFor="floatingInput">Alternative contact<span className='text-secondary'>&nbsp;(optional)</span></label>
                                    </div>
                                    <div className={inputFeild}>
                                        <input type='email' className='form-control' required placeholder="Email Id"
                                            name='mail_id' value={mail_id} onChange={handleInputChange} style={{boxShadow:"none"}}/>
                                        <label htmlFor="floatingInput">Email Id</label>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-end '>
                                    <button type="button" className='btn btn-danger me-4' onClick={resetButton}>clear</button>

                                    <button className="btn btn-success me-4 ms-3" onClick={(e)=>handleSubmit(e, eventInput)} style={{boxShadow:"none"}}>submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default OrderInput
