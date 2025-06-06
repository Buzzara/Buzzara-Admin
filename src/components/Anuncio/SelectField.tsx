import React from "react";
import Select, { SingleValue } from "react-select";

export interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectFieldOption[];
  value: string;
  onChange: (opt: SingleValue<SelectFieldOption>) => void;
  isClearable?: boolean;
  placeholder?: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  isClearable = true,
  placeholder = "Selecione",
  className = "",
}) => (
  <div className={`modal__subsection ${className}`}>
    <label className="modal__label--full">{label}</label>
    <Select
      options={options}
      className="modal__select"
      classNamePrefix="modal__select"
      placeholder={placeholder}
      isClearable={isClearable}
      value={options.find((opt) => opt.value === value) || null}
      onChange={onChange}
      noOptionsMessage={() => "Nenhuma opção"}
    />
  </div>
);

export default SelectField;
