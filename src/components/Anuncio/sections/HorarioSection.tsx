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
  startHour,
  setStartHour,
  startMinute,
  setStartMinute,
  endHour,
  setEndHour,
  endMinute,
  setEndMinute,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="horario-section">
      <h3 className="horario-section__title">Horário</h3>
      <div className="horario-section__row horario-section__time-range">
        <span className="horario-section__label">Das</span>
        <select
          className="horario-section__select"
          value={startHour}
          onChange={(e) => setStartHour(e.target.value)}
          disabled={horario24h}
        >
          {hours.map((hh) => (
            <option key={hh} value={hh}>
              {hh}
            </option>
          ))}
        </select>
        <select
          className="horario-section__select"
          value={startMinute}
          onChange={(e) => setStartMinute(e.target.value)}
          disabled={horario24h}
        >
          {minutes.map((mm) => (
            <option key={mm} value={mm}>
              {mm}
            </option>
          ))}
        </select>

        <span className="horario-section__label">Até as</span>
        <select
          className="horario-section__select"
          value={endHour}
          onChange={(e) => setEndHour(e.target.value)}
          disabled={horario24h}
        >
          {hours.map((hh) => (
            <option key={hh} value={hh}>
              {hh}
            </option>
          ))}
        </select>
        <select
          className="horario-section__select"
          value={endMinute}
          onChange={(e) => setEndMinute(e.target.value)}
          disabled={horario24h}
        >
          {minutes.map((mm) => (
            <option key={mm} value={mm}>
              {mm}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default HorarioSection;
