import React, {  useEffect, useState } from 'react'
import { getCustomer} from '../service/_request';
import { getId } from '../layout/Header';

const Home = () => {

  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const id = getId();
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await getCustomer(id);
        setUserData(res);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <React.Fragment>
      <div className='home'>  
      <div className='user text-end me-3'>
          {userData?.cust_name ? userData.cust_name.toUpperCase() : "Loading..."}
        </div>
        <div className="home1 ">
          <h3>Welcome to Our <span className='text-success' style={{ fontFamily: "fantasy", }}>VK</span> Weddings</h3>
          <div className='home-text '>
            <h4>Discover the perfect event venue for your special occasion. From elegant receptions to unforgettable weddings, we have the venue to make your dreams come true</h4>
            <h4>
              Unlock the magic of our event venues. Discover spaces that blend timeless elegance with modern sophistication, setting the stage for unforgettable moments you and your guests will treasure
            </h4>
          </div>
        </div>
      </div>
      <div className="home2 ">
        <div className='text-box '>
          <h2>Explore Our Curated Venues</h2>
          <h4>Exceptional event spaces that captivate and inspire. From grand ballrooms to intimate gatherings, our curated selection offers the perfect backdrop for your most cherished celebrations</h4>
        </div>
        {/* <div className='gallery-container d-flex justify-content-between '> */}
        <div className="gallery">
          < img className="pic " src='https://t3.ftcdn.net/jpg/06/23/19/08/360_F_623190856_r6SqcmUL3wxsjhWbRiCkbklTk19PPNW4.jpg' alt='pic1' />
          < img className="pic " src='https://media.istockphoto.com/id/1126031147/vector/muslim-bride-and-groom-looking-at-each-other-cartoon-character-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=hG9l4bvN22mQ1oGvWZTSgBQs3g2vGgsfWJL-Qiy6uPk=' alt='pic2' />
          < img className="pic " src='https://t4.ftcdn.net/jpg/06/23/19/05/360_F_623190597_vKwXSZNFqr5IZtPk6nIVwwkWfMPyvOj5.jpg' alt='pic3' />

        </div>
        {/* </div> */}

      </div>
     
    </React.Fragment>
  )
}

export default Home
