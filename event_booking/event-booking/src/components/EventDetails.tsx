import  { useContext } from 'react'
import { AppContext } from '../useContext/Context'
import {Order} from '../types/types';


const EventDetails = () => {

  const { setShowDetail, selectState } = useContext(AppContext);

  const { name, order_id, event_type, contact,
    alternative_contact, mail_id, level, event_date, status,venue } = selectState[0] as Order;

  return (
    <div className="container mt-5">
      <table className='table table-bordered  table-hover'>
        <thead className='table-danger fs-4'>
          <tr>
            <td colSpan={2}>ABOUT EVENT</td>

          </tr>
        </thead>
        <tbody className=''>
          <tr>
            <td > ID</td>
            <td>{order_id}</td>
          </tr>
          {/* <tr>
            <td >CUSTOMER ID</td>
            <td>{customer_id}</td>
          </tr> */}
          <tr>
            <td > NAME</td>
            <td>{name.toUpperCase()}</td>
          </tr>
          <tr>
            <td > EVENT</td>
            <td>{event_type}</td>
          </tr>
          <tr>
            <td > DATE</td>
            <td>{event_date}</td>
          </tr>
          <tr>
            <td > VENUE</td>
            <td>{venue}</td>
          </tr>
          <tr>
            <td > BUDGET</td>
            <td>{level}</td>
          </tr>
          <tr>
            <td > CONTACT</td>
            <td>{contact}</td>
          </tr>
          <tr>
            <td > CONTACT</td>
            <td>{alternative_contact}</td>
          </tr>
          <tr>
            <td > STATUS</td>
            <td className={`${status === "confirmed" ? "table-success" : "table-info"}`}>{status.toUpperCase()}</td>
          </tr>
          <tr>
            <td>EMAIL ID</td>
            <td>{mail_id}</td>
          </tr>
        </tbody>
      </table>

      <button className='btn btn-dark' onClick={() => setShowDetail(false)}>close</button>
    </div>
  )
}

export default EventDetails
