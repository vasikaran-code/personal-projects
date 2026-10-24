import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { Customer } from '../types/types';
import { createCustomer, getCustomers } from '../service/_request';
import { AppContext } from '../useContext/Context';

const Login = () => {
    const [active, setActive] = useState("");
    const [loginPage, setLoginPage] = useState<Customer>({
        cust_name: '',
        password: '',
        email: '',
        confirmPwd: "",
        customer_id: ''
    })
    const [showpwd, setShowpwd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);

    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const loginPageHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginPage((prevstate) => ({ ...prevstate, [e.target.name]: e.target.value }))
        if (error) setError(null);
    }

    const handleLogin = async () => {
        if (!loginPage.email || !loginPage.password) {
            setError('Please enter email and password');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const customers = await getCustomers();
            const user = customers.find(
                (u: Customer) => u.email === loginPage.email && u.password === loginPage.password
            );
            if (user) {
                localStorage.setItem('flameToken', user.customer_id);
                setIsAuthenticated(true);
                navigate('/home');
            } else {
                setError('Incorrect email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const addLoginPage = async () => {
        const { password, confirmPwd } = loginPage;
        if (password !== confirmPwd) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const id = "cust_" + Math.random().toString(36).substr(2, 10);
            await createCustomer({ ...loginPage, customer_id: id });
            setActive("");
            setLoginPage({ cust_name: '', password: '', email: '', confirmPwd: '', customer_id: '' });
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const registerLink = () => {
        setActive("active");
        setError(null);
    };
    const loginLink = () => {
        setActive(" ");
        setError(null);
    };

    return (
        <div className="login-page">
            <div className={`wrapper ${active}`}>
                <div className="form-box login">
                    <form action="">
                        <h1>Login</h1>
                        {error && !active && <div className="text-warning text-center mb-2" style={{ fontSize: '14px' }}>{error}</div>}
                        <div className="input-box">
                            <input type="text" placeholder="Email" value={loginPage.email} name="email" onChange={loginPageHandleChange} required />
                        </div>
                        <div className="input-box d-flex">
                            <input type={showpwd ? "text" : "password"} placeholder="password" value={loginPage.password} name="password" onChange={loginPageHandleChange} required />
                            <span className='text-light mt-3 ms-2' onClick={() => setShowpwd(!showpwd)}>{showpwd ? <FaRegEyeSlash /> : <FaEye />}</span>
                        </div>

                        <button type="button" onClick={handleLogin} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="register-link">
                            <p>
                                Don't have account ?{" "}
                                <a href="#" onClick={(e) => { e.preventDefault(); registerLink(); }}>
                                    Register
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="form-box Register">
                    <form>
                        <h1>Register</h1>
                        {error && active === "active" && <div className="text-warning text-center mb-2" style={{ fontSize: '14px' }}>{error}</div>}
                        <div className="input-box">
                            <input type="text" placeholder="Username" value={loginPage.cust_name} name="cust_name" onChange={loginPageHandleChange} required />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="Email" name="email" value={loginPage.email} onChange={loginPageHandleChange} required />
                        </div>
                        <div className="input-box d-flex">
                            <input type={showpwd ? "text" : "password"} placeholder="password" value={loginPage.password} name="password" onChange={loginPageHandleChange} required />
                            <span className='text-light mt-3 ms-2' onClick={() => setShowpwd(!showpwd)}>{showpwd ? <FaRegEyeSlash /> : <FaEye />}</span>
                        </div>
                        <div className="input-box d-flex">
                            <input type="password" placeholder="Confirm password" value={loginPage.confirmPwd} name="confirmPwd" onChange={loginPageHandleChange} required />
                        </div>
                        <button type="button" className='btn btn-outline-secondary' onClick={addLoginPage} disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                        <div className="register-link">
                            <p>Already have an account ?{" "}
                                <a href="#" onClick={(e) => { e.preventDefault(); loginLink(); }}>
                                    Login
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login
