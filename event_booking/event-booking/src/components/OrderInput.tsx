import React, { useContext, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { LuAlertCircle, LuArrowRight, LuCheck, LuMapPin, LuWallet, LuCalendarDays } from 'react-icons/lu';
import { AppContext } from '../useContext/Context';
import { EventInput, Order } from '../types/types';
import { getId } from '../layout/Header';
import { createOrder } from '../service/_request';
import { EVENT_TYPES, PACKAGES, findEventType, findPackage } from '../lib/catalog';
import { formatDate } from '../lib/format';
import { Field, Spinner, StatusBadge } from './common/ui';

type Errors = Partial<Record<keyof EventInput, string>>;

const EMPTY_INPUT: EventInput = {
    name: "",
    event_type: "",
    event_date: "",
    level: "",
    contact: "",
    alternative_contact: "",
    mail_id: "",
    venue: ""
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;

const validate = (input: EventInput, today: string): Errors => {
    const errors: Errors = {};
    if (!input.event_type) errors.event_type = "Choose the occasion you're booking for.";
    if (!input.event_date) errors.event_date = "Pick the event date.";
    else if (input.event_date < today) errors.event_date = "The event date can't be in the past.";
    if (!input.venue.trim()) errors.venue = "Enter the venue or area.";
    if (!input.level) errors.level = "Choose a package.";
    if (!input.name.trim()) errors.name = "Enter the name for this booking.";
    if (!input.contact) errors.contact = "Enter a contact number.";
    else if (!PHONE_PATTERN.test(input.contact)) errors.contact = "Enter a 10-digit phone number.";
    if (input.alternative_contact && !PHONE_PATTERN.test(input.alternative_contact))
        errors.alternative_contact = "Enter a 10-digit phone number, or leave this empty.";
    if (!input.mail_id.trim()) errors.mail_id = "Enter an email address.";
    else if (!EMAIL_PATTERN.test(input.mail_id.trim())) errors.mail_id = "Enter a valid email address.";
    return errors;
};

// Accept only values the booking form itself offers when prefilling from the URL.
const prefillFrom = (params: URLSearchParams, today: string): EventInput => {
    const type = params.get("type") ?? "";
    const level = params.get("level") ?? "";
    const date = params.get("date") ?? "";
    return {
        ...EMPTY_INPUT,
        event_type: EVENT_TYPES.some((t) => t.value === type) ? type : "",
        level: PACKAGES.some((p) => p.value === level) ? level : "",
        event_date: /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today ? date : "",
        venue: (params.get("venue") ?? "").slice(0, 120),
    };
};

const OrderInput = () => {
    const today = new Date().toISOString().split('T')[0];
    const [searchParams] = useSearchParams();

    const [eventInput, setEventInput] = useState<EventInput>(() => prefillFrom(searchParams, today))
    const [touched, setTouched] = useState<Partial<Record<keyof EventInput, boolean>>>({})
    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [created, setCreated] = useState<Order | null>(null)
    const submittingRef = useRef(false)
    const formRef = useRef<HTMLFormElement>(null)

    const { orders, setOrders, } = useContext(AppContext)
    const { name, event_type, event_date, level, contact, alternative_contact, mail_id, venue } = eventInput;

    const errors = useMemo(() => validate(eventInput, today), [eventInput, today]);
    const showError = (field: keyof EventInput) => (submitAttempted || touched[field]) ? errors[field] : undefined;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isPhone = name === "contact" || name === "alternative_contact";
        setEventInput(prevState => ({ ...prevState, [name]: isPhone ? value.replace(/\D/g, "").slice(0, 10) : value }))
        if (submitError) setSubmitError(null);
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
        setTouched(prev => ({ ...prev, [e.target.name]: true }));

    const resetButton = () => {
        setEventInput(EMPTY_INPUT)
        setTouched({})
        setSubmitAttempted(false)
        setSubmitError(null)
    }

    const createNewOrder = async (eventInput: EventInput) => {
        submittingRef.current = true;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const id = getId();
            const response = await createOrder({...eventInput, customer_id: id!} as any)
            if (response) {
                setOrders([response, ...orders]);
                setCreated(response);
                resetButton()
                window.scrollTo(0, 0);
            } else {
                setSubmitError("We couldn't confirm that your request was saved. Please check My bookings before trying again.");
            }
        } catch (err) {
            console.error("Error creating order:", err);
            setSubmitError("We couldn't send your booking request. Please try again.");
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submittingRef.current) return;
        const id = getId();
        if (!id) {
            setSubmitError("Your session has ended. Please sign in again to book.");
            return;
        }
        setSubmitAttempted(true);
        if (Object.keys(errors).length > 0) {
            const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
            firstInvalid?.focus();
            return;
        }
        createNewOrder({ ...eventInput, name: name.trim(), venue: venue.trim(), mail_id: mail_id.trim() });
    };

    const selectedType = event_type ? findEventType(event_type) : null;
    const selectedPackage = findPackage(level);

    if (created) {
        const createdType = findEventType(created.event_type);
        const createdPackage = findPackage(created.level);
        return (
            <div className="container page">
                <section className="confirmation" aria-labelledby="confirmation-title">
                    <span className="confirmation__icon" aria-hidden="true"><LuCheck /></span>
                    <span className="eyebrow">Request received</span>
                    <h1 id="confirmation-title">Your booking request has been sent</h1>
                    <p>
                        Our team will review it and update the status. You can track it any time from My bookings.
                    </p>
                    <dl className="confirmation__details">
                        <div><dt>Reference</dt><dd className="mono">{created.order_id}</dd></div>
                        <div><dt>Status</dt><dd><StatusBadge status={created.status} /></dd></div>
                        <div><dt>Occasion</dt><dd>{createdType.label}</dd></div>
                        <div><dt>Date</dt><dd>{formatDate(created.event_date)}</dd></div>
                        <div><dt>Venue</dt><dd>{created.venue}</dd></div>
                        <div><dt>Package</dt><dd>{createdPackage ? `${createdPackage.label} · ${createdPackage.range}` : created.level}</dd></div>
                    </dl>
                    <div className="confirmation__actions">
                        <Link to={`/booking/${created.order_id}`} className="btn btn--dark">View booking <LuArrowRight /></Link>
                        <button type="button" className="btn" onClick={() => setCreated(null)}>Book another event</button>
                    </div>
                </section>
            </div>
        );
    }

    const describedBy = (field: keyof EventInput) => (showError(field) ? `${field}-msg` : undefined);

    return (
        <div className="container page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Book an event</span>
                    <h1 className="page-header__title">Request your date</h1>
                    <p className="page-header__lead">
                        Tell us about the celebration. We'll review your request and confirm availability.
                    </p>
                </div>
            </div>

            <div className="booking-layout">
                <form ref={formRef} className="booking-form" onSubmit={handleSubmit} noValidate>
                    {submitError && (
                        <div className="alert alert--error" role="alert">
                            <LuAlertCircle aria-hidden="true" /> {submitError}
                        </div>
                    )}

                    <fieldset className="form-section">
                        <legend className="form-section__title"><span>01</span> Occasion</legend>
                        <div className="choice-grid" role="radiogroup" aria-label="Occasion"
                            aria-invalid={!!showError("event_type")} aria-describedby={describedBy("event_type")}>
                            {EVENT_TYPES.map(({ value, label, icon: Icon }) => (
                                <label key={value} className={`choice ${event_type === value ? "is-selected" : ""}`}>
                                    <input type="radio" name="event_type" value={value} checked={event_type === value}
                                        onChange={handleInputChange} onBlur={handleBlur} />
                                    <Icon className="choice__icon" aria-hidden="true" />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                        {showError("event_type") && (
                            <span className="field__error" id="event_type-msg"><LuAlertCircle aria-hidden="true" /> {errors.event_type}</span>
                        )}
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="form-section__title"><span>02</span> Date &amp; venue</legend>
                        <div className="form-grid">
                            <Field id="event_date" label="Event date" error={showError("event_date")}>
                                <input id="event_date" type='date' className='input' name='event_date' value={event_date} min={today}
                                    onChange={handleInputChange} onBlur={handleBlur}
                                    aria-invalid={!!showError("event_date")} aria-describedby={describedBy("event_date")} />
                            </Field>
                            <Field id="venue" label="Venue" error={showError("venue")}>
                                <input id="venue" type='text' className='input' name='venue' value={venue} placeholder="Venue name or area"
                                    onChange={handleInputChange} onBlur={handleBlur} autoComplete="off"
                                    aria-invalid={!!showError("venue")} aria-describedby={describedBy("venue")} />
                            </Field>
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="form-section__title"><span>03</span> Package</legend>
                        <div className="package-choices" role="radiogroup" aria-label="Package"
                            aria-invalid={!!showError("level")} aria-describedby={describedBy("level")}>
                            {PACKAGES.map((p) => (
                                <label key={p.value} className={`package-choice ${level === p.value ? "is-selected" : ""}`}>
                                    <input type="radio" name="level" value={p.value} checked={level === p.value}
                                        onChange={handleInputChange} onBlur={handleBlur} />
                                    <span className="package-choice__name">{p.label}</span>
                                    <span className="package-choice__range">{p.range}</span>
                                </label>
                            ))}
                        </div>
                        {showError("level") && (
                            <span className="field__error" id="level-msg"><LuAlertCircle aria-hidden="true" /> {errors.level}</span>
                        )}
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="form-section__title"><span>04</span> Contact details</legend>
                        <div className="form-grid">
                            <Field id="name" label="Name" error={showError("name")}>
                                <input id="name" type='text' className='input' name='name' value={name} autoComplete="name"
                                    onChange={handleInputChange} onBlur={handleBlur}
                                    aria-invalid={!!showError("name")} aria-describedby={describedBy("name")} />
                            </Field>
                            <Field id="mail_id" label="Email" error={showError("mail_id")}>
                                <input id="mail_id" type='email' className='input' name='mail_id' value={mail_id} autoComplete="email"
                                    onChange={handleInputChange} onBlur={handleBlur}
                                    aria-invalid={!!showError("mail_id")} aria-describedby={describedBy("mail_id")} />
                            </Field>
                            <Field id="contact" label="Phone" error={showError("contact")} hint={showError("contact") ? undefined : "10 digits"}>
                                <input id="contact" type='tel' className='input' name='contact' value={contact} inputMode='numeric'
                                    maxLength={10} autoComplete="tel-national" onChange={handleInputChange} onBlur={handleBlur}
                                    aria-invalid={!!showError("contact")} aria-describedby="contact-msg" />
                            </Field>
                            <Field id="alternative_contact" label="Alternative phone" optional error={showError("alternative_contact")}>
                                <input id="alternative_contact" type='tel' className='input' name='alternative_contact' value={alternative_contact}
                                    inputMode='numeric' maxLength={10} onChange={handleInputChange} onBlur={handleBlur}
                                    aria-invalid={!!showError("alternative_contact")} aria-describedby={describedBy("alternative_contact")} />
                            </Field>
                        </div>
                    </fieldset>

                    <div className="form-actions">
                        <button type="button" className='btn btn--ghost' onClick={resetButton} disabled={submitting}>Clear form</button>
                        <button type="submit" className="btn btn--primary btn--lg" disabled={submitting} aria-busy={submitting}>
                            {submitting ? <><Spinner /> Sending request…</> : <>Send booking request <LuArrowRight /></>}
                        </button>
                    </div>
                </form>

                <aside className="summary" aria-labelledby="summary-title">
                    <div className="summary__card">
                        <h2 id="summary-title" className="summary__title">Booking summary</h2>
                        <dl className="summary__list">
                            <div>
                                <dt>Occasion</dt>
                                <dd>{selectedType ? <><selectedType.icon aria-hidden="true" /> {selectedType.label}</> : <span className="summary__empty">Not selected</span>}</dd>
                            </div>
                            <div>
                                <dt><LuCalendarDays aria-hidden="true" /> Date</dt>
                                <dd>{event_date ? formatDate(event_date) : <span className="summary__empty">Not selected</span>}</dd>
                            </div>
                            <div>
                                <dt><LuMapPin aria-hidden="true" /> Venue</dt>
                                <dd>{venue.trim() || <span className="summary__empty">Not entered</span>}</dd>
                            </div>
                            <div>
                                <dt><LuWallet aria-hidden="true" /> Package</dt>
                                <dd>{selectedPackage ? selectedPackage.label : <span className="summary__empty">Not selected</span>}</dd>
                            </div>
                        </dl>
                        <div className="summary__total">
                            <span>Budget range</span>
                            <strong>{selectedPackage ? selectedPackage.range : "—"}</strong>
                        </div>
                        <p className="summary__note">
                            Submitting sends a request with status <strong>Pending review</strong>. Nothing is charged online — your booking is
                            confirmed only after our team approves it.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default OrderInput
