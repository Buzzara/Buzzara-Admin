// src/components/Anuncio/sections/HorarioSection.tsx
import React from "react";

interface HorarioProps {
  horario24h: boolean;
  setHorario24h: (v: boolean) => void;
  startHour: string;
  setStartHour: (v: string) => void;
  startMinute: string;
  setStartMinute: (v: string) => void;
  endHour: string;
  setEndHour: (v: string) => void;
  endMinute: string;
  setEndMinute: (v: string) => void;
  sameEveryDay: "Sim" | "Não";
  setSameEveryDay: (v: "Sim" | "Não") => void;
}

const HorarioSection: React.FC<HorarioProps> = ({
  horario24h,
  setHorario24h,
  startHour,
  setStartHour,
  startMinute,
  setStartMinute,
  endHour,
  setEndHour,
  endMinute,
  setEndMinute,
  sameEveryDay,
  setSameEveryDay,
}) => {
  return (
    <div
      className="modal__section"
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    >
      <h3 className="modal__section-title">Horário</h3>

      {/* 1) Checkbox “24 horas” */}
      <div
        className="modal__subsection"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <input
          type="checkbox"
          id="horario24h"
          checked={horario24h}
          onChange={(e) => setHorario24h(e.target.checked)}
        />
        <label htmlFor="horario24h">24 horas</label>
      </div>

      {/* 2) “Das HH:MM Até as HH:MM” */}
      <div
        className="modal__subsection"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <span>Das</span>
        <select
          className="modal__input"
          value={startHour}
          onChange={(e) => setStartHour(e.target.value)}
          disabled={horario24h}
          style={{ width: "60px" }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hh = i.toString().padStart(2, "0");
            return (
              <option key={hh} value={hh}>
                {hh}
              </option>
            );
          })}
        </select>
        <select
          className="modal__input"
          value={startMinute}
          onChange={(e) => setStartMinute(e.target.value)}
          disabled={horario24h}
          style={{ width: "60px" }}
        >
          {["00", "15", "30", "45"].map((mm) => (
            <option key={mm} value={mm}>
              {mm}
            </option>
          ))}
        </select>

        <span>Até as</span>
        <select
          className="modal__input"
          value={endHour}
          onChange={(e) => setEndHour(e.target.value)}
          disabled={horario24h}
          style={{ width: "60px" }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hh = i.toString().padStart(2, "0");
            return (
              <option key={hh} value={hh}>
                {hh}
              </option>
            );
          })}
        </select>
        <select
          className="modal__input"
          value={endMinute}
          onChange={(e) => setEndMinute(e.target.value)}
          disabled={horario24h}
          style={{ width: "60px" }}
        >
          {["00", "15", "30", "45"].map((mm) => (
            <option key={mm} value={mm}>
              {mm}
            </option>
          ))}
        </select>
      </div>

      {/* 3) Rádios “Mesmo horário todos os dias?” */}
      <div
        className="modal__subsection"
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
      >
        <span className="modal__small-label">
          Mesmo horário todos os dias?
        </span>
        <label
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <input
            type="radio"
            name="sameEveryDay"
            value="Sim"
            checked={sameEveryDay === "Sim"}
            onChange={() => setSameEveryDay("Sim")}
          />
          Sim
        </label>
        <label
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <input
            type="radio"
            name="sameEveryDay"
            value="Não"
            checked={sameEveryDay === "Não"}
            onChange={() => setSameEveryDay("Não")}
          />
          Não
        </label>
      </div>
    </div>
  );
};

export default HorarioSection;
