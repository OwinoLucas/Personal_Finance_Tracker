import React from 'react';

export default function TextInput({ label, error, className = '', ...props }) {
  return (
    <div className={`mb-3 ${className}`.trim()}>
      {label && <label className="form-label">{label}</label>}
      <input
        className={`form-control${error ? ' is-invalid' : ''}`}
        {...props}
      />
      {error && (
        <div className="invalid-feedback">
          {Array.isArray(error)
            ? error.map((msg, i) => <div key={i}>{msg}</div>)
            : error}
        </div>
      )}
    </div>
  );
} 