import React from "react";

interface InputFieldProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string; 
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  max,
  step,
  placeholder,
  className = "",
}) => (
  <label className={`modal__label ${className}`}>
    {label}
    {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
    <input
      type={type}
      className="modal__input"
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
    />
  </label>
);

export default InputField;
