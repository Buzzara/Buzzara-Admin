import React from "react";
import Select, { MultiValue } from "react-select";

export interface MultiSelectFieldOption {
  value: string;
  label: string;
}

interface MultiSelectFieldProps {
  label: string;
  placeholder?: string;
  options: MultiSelectFieldOption[];
  values: string[];
  onChange: (vals: MultiValue<MultiSelectFieldOption>) => void;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  placeholder = "Selecione",
  options,
  values,
  onChange,
}) => (
  <div className="modal__subsection">
    <label className="modal__label--full">{label}</label>
    <Select
      isMulti
      options={options}
      className="modal__select"
      classNamePrefix="modal__select"
      placeholder={placeholder}
      value={options.filter((opt) => values.includes(opt.value))}
      onChange={onChange}
      noOptionsMessage={() => "Nenhuma opção"}
    />
  </div>
);

export default MultiSelectField;
