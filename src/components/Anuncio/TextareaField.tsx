import React from "react";

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  className = "",
  rows = 3,
}) => (
  <label className={`modal__label ${className}`}>
    {label}
    {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
    <textarea
      className="modal__textarea"
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
    />
  </label>
);

export default TextareaField;
