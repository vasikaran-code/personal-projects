import '../components/contact.css'

const Contact = () => {
    return (
      <div  style={{ border:"0.5px solid aqua",minHeight:"79vh",backgroundImage:" linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)"}}>
      <div className="container contact my-5">
        <div className="text">
          Contact Us 
        </div>
        <form action="#">
          <div className="form-row">
            <div className="input-data">
              <input type="text" required name="firstName" />
              <div className="underline"></div>
              <label>First Name</label>
            </div>
            <div className="input-data">
              <input type="text" required name="lastName" />
              <div className="underline"></div>
              <label>Last Name</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data">
              <input type="email" required name="email" />
              <div className="underline"></div>
              <label>Email Address</label>
            </div>
            <div className="input-data">
              <input type="text" required name="website" />
              <div className="underline"></div>
              <label>Phone No</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data textarea">
              <textarea required name="message"></textarea>
              <br />
              <div className="underline"></div>
              <label>Write your message</label>
            </div>
          </div>
          <div className="form-row submit-btn">
            <div className="input-data">
              <div className="inner"></div>
              <input type="submit" value="Submit" />
            </div>
          </div>
        </form>
      </div>
      </div>
    );
  };
  
  export default Contact;
  