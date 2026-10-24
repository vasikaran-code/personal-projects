import React from "react";
import { IconType } from "react-icons";
import { LuAlertCircle, LuInbox, LuRefreshCw } from "react-icons/lu";
import { STATUS_LABELS, statusKey } from "../../lib/format";

export const Spinner = ({ label }: { label?: string }) => (
  <span className="spinner" role={label ? "status" : undefined} aria-label={label} />
);

export const StatusBadge = ({ status }: { status?: string }) => {
  const key = statusKey(status);
  return <span className={`status status--${key}`}>{STATUS_LABELS[key]}</span>;
};

export const LoadingBlock = ({ label = "Loading" }: { label?: string }) => (
  <div className="loading-block" role="status">
    <Spinner />
    <span>{label}…</span>
  </div>
);

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon = LuInbox, title, children, action }: EmptyStateProps) => (
  <div className="state">
    <span className="state__icon" aria-hidden="true">
      <Icon />
    </span>
    <h3>{title}</h3>
    {children && <p>{children}</p>}
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="state state--error" role="alert">
    <span className="state__icon" aria-hidden="true">
      <LuAlertCircle />
    </span>
    <h3>Something went wrong</h3>
    <p>{message}</p>
    {onRetry && (
      <button type="button" className="btn" onClick={onRetry}>
        <LuRefreshCw /> Try again
      </button>
    )}
  </div>
);

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}

// Inputs inside a Field should set aria-invalid and aria-describedby={`${id}-msg`}.
export const Field = ({ id, label, error, hint, optional, children }: FieldProps) => (
  <div className="field">
    <label className="field__label" htmlFor={id}>
      {label}
      {optional && <span className="field__optional">Optional</span>}
    </label>
    {children}
    {error ? (
      <span className="field__error" id={`${id}-msg`}>
        <LuAlertCircle aria-hidden="true" /> {error}
      </span>
    ) : (
      hint && (
        <span className="field__hint" id={`${id}-msg`}>
          {hint}
        </span>
      )
    )}
  </div>
);
