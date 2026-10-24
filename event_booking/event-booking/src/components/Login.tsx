import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { LuAlertCircle, LuArrowRight, LuCheckCircle2, LuEye, LuEyeOff } from "react-icons/lu";
import { Customer } from '../types/types';
import { apiErrorMessage, createCustomer, login } from '../service/_request';
import { saveSession } from '../lib/session';
import { AppContext } from '../useContext/Context';
import { Field, Spinner } from './common/ui';
import gardenCeremony from '../images/web/garden-ceremony.jpg';

type Mode = "login" | "register";
type Errors = Partial<Record<keyof Customer, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: Customer = { cust_name: '', password: '', email: '', confirmPwd: "", customer_id: '' };

const validate = (mode: Mode, form: Customer): Errors => {
    const errors: Errors = {};
    if (mode === "register" && !form.cust_name.trim()) errors.cust_name = "Enter your name.";
    if (!form.email.trim()) errors.email = "Enter your email address.";
    else if (mode === "register" && !EMAIL_PATTERN.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (!form.password) errors.password = "Enter your password.";
    if (mode === "register") {
        if (!form.confirmPwd) errors.confirmPwd = "Confirm your password.";
        else if (form.password !== form.confirmPwd) errors.confirmPwd = "Passwords do not match";
    }
    return errors;
};

const Login = () => {
    const [mode, setMode] = useState<Mode>("login");
    const [loginPage, setLoginPage] = useState<Customer>(EMPTY_FORM)
    const [showpwd, setShowpwd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [notice, setNotice] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);

    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const errors = validate(mode, loginPage);
    const fieldError = (field: keyof Customer) => (submitted ? errors[field] : undefined);

    const loginPageHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginPage((prevstate) => ({ ...prevstate, [e.target.name]: e.target.value }))
        if (error) setError(null);
    }

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { access_token, customer } = await login(loginPage.email.trim(), loginPage.password);
            saveSession(customer.customer_id, access_token);
            setIsAuthenticated(true);
            navigate('/home');
        } catch (err) {
            setError(apiErrorMessage(err, 'Login failed. Please try again later.'));
        } finally {
            setLoading(false);
        }
    }

    const addLoginPage = async () => {
        setLoading(true);
        setError(null);
        try {
            const { cust_name, email, password } = loginPage;
            await createCustomer({ cust_name: cust_name.trim(), email: email.trim(), password });
            setMode("login");
            setSubmitted(false);
            setLoginPage({ ...EMPTY_FORM, email: email.trim() });
            setNotice("Account created. Sign in with your new details.");
        } catch (err) {
            setError(apiErrorMessage(err, 'Registration failed. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setSubmitted(true);
        setNotice(null);
        if (Object.keys(errors).length > 0) return;
        if (mode === "login") handleLogin();
        else addLoginPage();
    };

    const switchMode = (next: Mode) => {
        if (next === mode) return;
        setMode(next);
        setError(null);
        setNotice(null);
        setSubmitted(false);
    };

    const passwordToggle = (
        <button type="button" className="icon-btn field__action" onClick={() => setShowpwd(!showpwd)}
            aria-label={showpwd ? "Hide password" : "Show password"} aria-pressed={showpwd}>
            {showpwd ? <LuEyeOff /> : <LuEye />}
        </button>
    );

    const isLogin = mode === "login";

    return (
        <div className="auth">
            <aside className="auth__media">
                <img src={gardenCeremony} alt="" />
                <div className="auth__media-copy">
                    <span className="brand">
                        <span className="brand__mark" aria-hidden="true">VK</span>
                        <span className="brand__text">
                            <span className="brand__name">VK Weddings</span>
                            <span className="brand__tag">Events &amp; venues</span>
                        </span>
                    </span>
                    <p>Weddings, receptions and family celebrations — request your date and track every booking in one place.</p>
                </div>
            </aside>

            <main className="auth__panel">
                <div className="auth__card">
                    <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
                    <p className="auth__lead">
                        {isLogin ? "Sign in to book events and follow your requests." : "Register to start booking your celebrations."}
                    </p>

                    <div className="tabs auth__tabs" role="tablist" aria-label="Account">
                        <button type="button" role="tab" id="tab-login" className="tab" aria-selected={isLogin}
                            aria-controls="auth-form" onClick={() => switchMode("login")}>Sign in</button>
                        <button type="button" role="tab" id="tab-register" className="tab" aria-selected={!isLogin}
                            aria-controls="auth-form" onClick={() => switchMode("register")}>Register</button>
                    </div>

                    <form id="auth-form" role="tabpanel" aria-labelledby={isLogin ? "tab-login" : "tab-register"}
                        className="auth__form" onSubmit={handleSubmit} noValidate>
                        {notice && (
                            <div className="alert alert--success" role="status"><LuCheckCircle2 aria-hidden="true" /> {notice}</div>
                        )}
                        {error && (
                            <div className="alert alert--error" role="alert"><LuAlertCircle aria-hidden="true" /> {error}</div>
                        )}

                        {!isLogin && (
                            <Field id="cust_name" label="Name" error={fieldError("cust_name")}>
                                <input id="cust_name" type="text" className="input" name="cust_name" value={loginPage.cust_name}
                                    onChange={loginPageHandleChange} autoComplete="name"
                                    aria-invalid={!!fieldError("cust_name")} aria-describedby={fieldError("cust_name") ? "cust_name-msg" : undefined} />
                            </Field>
                        )}
                        <Field id="email" label="Email" error={fieldError("email")}>
                            <input id="email" type="email" className="input" name="email" value={loginPage.email}
                                onChange={loginPageHandleChange} autoComplete="email"
                                aria-invalid={!!fieldError("email")} aria-describedby={fieldError("email") ? "email-msg" : undefined} />
                        </Field>
                        <Field id="password" label="Password" error={fieldError("password")}>
                            <div className="field__control">
                                <input id="password" type={showpwd ? "text" : "password"} className="input input--with-action" name="password"
                                    value={loginPage.password} onChange={loginPageHandleChange}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    aria-invalid={!!fieldError("password")} aria-describedby={fieldError("password") ? "password-msg" : undefined} />
                                {passwordToggle}
                            </div>
                        </Field>
                        {!isLogin && (
                            <Field id="confirmPwd" label="Confirm password" error={fieldError("confirmPwd")}>
                                <input id="confirmPwd" type="password" className="input" name="confirmPwd" value={loginPage.confirmPwd}
                                    onChange={loginPageHandleChange} autoComplete="new-password"
                                    aria-invalid={!!fieldError("confirmPwd")} aria-describedby={fieldError("confirmPwd") ? "confirmPwd-msg" : undefined} />
                            </Field>
                        )}

                        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading} aria-busy={loading}>
                            {loading
                                ? <><Spinner /> {isLogin ? "Signing in…" : "Creating account…"}</>
                                : <>{isLogin ? "Sign in" : "Create account"} <LuArrowRight /></>}
                        </button>

                        <p className="auth__switch">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button type="button" className="link-button" onClick={() => switchMode(isLogin ? "register" : "login")}>
                                {isLogin ? "Register" : "Sign in"}
                            </button>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Login
