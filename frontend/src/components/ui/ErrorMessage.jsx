import React from 'react';

export default function ErrorMessage({ children }) {
  if (!children) return null;
  return <div className="text-red-500 text-sm my-2">{children}</div>;
} 