import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuAlertCircle, LuArrowRight, LuInfo, LuMapPin } from 'react-icons/lu';
import { Field } from './common/ui';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", message: "" };
type ContactForm = typeof EMPTY;

const validate = (form: ContactForm) => {
  const errors: Partial<ContactForm> = {};
  if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!form.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (form.phone && !/^\d{10}$/.test(form.phone)) errors.phone = "Enter a 10-digit phone number.";
  if (!form.message.trim()) errors.message = "Write a short message.";
  return errors;
};

const Contact = () => {
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState(false);

  const errors = validate(form);
  const err = (field: keyof ContactForm) => (submitted ? errors[field] : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value }));
    setNotice(false);
  };

  // There is no message API yet, so be explicit that nothing was sent.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length === 0) setNotice(true);
  };

  const a11y = (field: keyof ContactForm) => ({
    "aria-invalid": !!err(field),
    "aria-describedby": err(field) ? `${field}-msg` : undefined,
  });

  return (
    <div className="container page">
      <div className="contact-layout">
        <div className="contact-info">
          <span className="eyebrow">Contact</span>
          <h1 className="page-header__title">Talk to our events team</h1>
          <p className="page-header__lead">
            Questions about a venue, a date or an existing booking? Visit our office or send us the details below.
          </p>
          <address className="contact-card">
            <LuMapPin aria-hidden="true" />
            <div>
              <strong>VK Weddings office</strong>
              <span>No.986 Anna Nagar, Chennai 28</span>
            </div>
          </address>
          <p className="contact-info__aside">
            Already booked? Check its status in <Link to="/myorder" className="text-link">My bookings <LuArrowRight /></Link>
          </p>
        </div>

        <form className="contact-form summary__card" onSubmit={handleSubmit} noValidate>
          {notice && (
            <div className="alert alert--info" role="status">
              <LuInfo aria-hidden="true" />
              <span>
                Online messages aren't connected yet, so this message was <strong>not sent</strong>. Please visit our Anna
                Nagar office and we'll be glad to help.
              </span>
            </div>
          )}
          {submitted && Object.keys(errors).length > 0 && (
            <div className="alert alert--error" role="alert"><LuAlertCircle aria-hidden="true" /> Please fix the highlighted fields.</div>
          )}
          <div className="form-grid">
            <Field id="firstName" label="First name" error={err("firstName")}>
              <input id="firstName" name="firstName" className="input" value={form.firstName} onChange={handleChange} autoComplete="given-name" {...a11y("firstName")} />
            </Field>
            <Field id="lastName" label="Last name" optional>
              <input id="lastName" name="lastName" className="input" value={form.lastName} onChange={handleChange} autoComplete="family-name" />
            </Field>
            <Field id="email" label="Email" error={err("email")}>
              <input id="email" name="email" type="email" className="input" value={form.email} onChange={handleChange} autoComplete="email" {...a11y("email")} />
            </Field>
            <Field id="phone" label="Phone" optional error={err("phone")}>
              <input id="phone" name="phone" type="tel" inputMode="numeric" className="input" value={form.phone} onChange={handleChange} autoComplete="tel-national" {...a11y("phone")} />
            </Field>
          </div>
          <Field id="message" label="Message" error={err("message")}>
            <textarea id="message" name="message" className="textarea" value={form.message} onChange={handleChange} {...a11y("message")} />
          </Field>
          <div className="form-actions">
            <button type="submit" className="btn btn--dark btn--lg">Submit <LuArrowRight /></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
