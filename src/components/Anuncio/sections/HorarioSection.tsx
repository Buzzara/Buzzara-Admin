import React, { useEffect } from "react";

interface DiaHorario {
  ativo: boolean;
  horario24h: boolean;
  dasHora: string;
  dasMinuto: string;
  ateHora: string;
  ateMinuto: string;
}

interface HorarioIndividual {
  diaSemana: string;
  atende: boolean;
  horarioInicio: string | null;
  horarioFim: string | null;
  vinteQuatroHoras: boolean;
}

interface Props {
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
  semana: Record<string, DiaHorario>;
  setSemana: (s: Record<string, DiaHorario>) => void;
  setHorarioUnico: (v: {
    diaSemana: string;
    atende: boolean;
    horarioInicio: string;
    horarioFim: string;
    vinteQuatroHoras: boolean;
  } | undefined) => void;
  setHorariosIndividuais: (v: HorarioIndividual[]) => void;
}

const HorarioSection: React.FC<Props> = ({
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
  semana,
  setSemana,
  setHorarioUnico,
  setHorariosIndividuais,
}) => {
  const horas = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutos = ["00", "15", "30", "45"];
  const dias = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];

  const handleChange = (dia: string, campo: keyof DiaHorario, valor: string | boolean) => {
    setSemana({
      ...semana,
      [dia]: {
        ...semana[dia],
        [campo]: valor,
      },
    });
  };

  const copiarParaTodos = (origem: string) => {
    const base = semana[origem];
    const novaSemana = Object.fromEntries(
      dias.map((dia) => [
        dia,
        {
          ...semana[dia],
          ...base,
        },
      ])
    );
    setSemana(novaSemana);
  };

  useEffect(() => {
    if (sameEveryDay === "Sim") {
      setHorariosIndividuais([]);
      setHorarioUnico({
        diaSemana: "Segunda",
        atende: true,
        horarioInicio: `${startHour}:${startMinute}`,
        horarioFim: `${endHour}:${endMinute}`,
        vinteQuatroHoras: horario24h,
      });
    } else {
      setHorarioUnico(undefined);
      const lista: HorarioIndividual[] = dias.map((dia) => {
        const diaObj = semana[dia];
        return {
          diaSemana: dia,
          atende: diaObj.ativo,
          horarioInicio: diaObj.horario24h
            ? null
            : `${diaObj.dasHora}:${diaObj.dasMinuto}`,
          horarioFim: diaObj.horario24h
            ? null
            : `${diaObj.ateHora}:${diaObj.ateMinuto}`,
          vinteQuatroHoras: diaObj.horario24h,
        };
      });
      setHorariosIndividuais(lista);
    }
  }, [
    sameEveryDay,
    startHour,
    startMinute,
    endHour,
    endMinute,
    horario24h,
    semana,
    setHorarioUnico,
    setHorariosIndividuais,
  ]);

  return (
    <div className="horario-section">
      <h3>Horário</h3>

      {sameEveryDay === "Sim" ? (
        <div className="horario-unico" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" checked={horario24h} onChange={(e) => setHorario24h(e.target.checked)} />
          <label>24 horas</label>

          <label>Das</label>
          <select disabled={horario24h} value={startHour} onChange={(e) => setStartHour(e.target.value)}>
            {horas.map((h) => <option key={h}>{h}</option>)}
          </select>
          <select disabled={horario24h} value={startMinute} onChange={(e) => setStartMinute(e.target.value)}>
            {minutos.map((m) => <option key={m}>{m}</option>)}
          </select>

          <label>Até as</label>
          <select disabled={horario24h} value={endHour} onChange={(e) => setEndHour(e.target.value)}>
            {horas.map((h) => <option key={h}>{h}</option>)}
          </select>
          <select disabled={horario24h} value={endMinute} onChange={(e) => setEndMinute(e.target.value)}>
            {minutos.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      ) : (
        <div className="horario-por-semana">
          {dias.map((dia) => (
            <div key={dia} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={semana[dia].ativo}
                onChange={(e) => handleChange(dia, "ativo", e.target.checked)}
              />
              <label style={{ width: 80, marginLeft: 8 }}>{dia}</label>

              <input
                type="checkbox"
                checked={semana[dia].horario24h}
                onChange={(e) => handleChange(dia, "horario24h", e.target.checked)}
              />
              <label style={{ marginLeft: 4 }}>24 horas</label>

              <label style={{ marginLeft: 12 }}>Das</label>
              <select
                disabled={semana[dia].horario24h}
                value={semana[dia].dasHora}
                onChange={(e) => handleChange(dia, "dasHora", e.target.value)}
              >
                {horas.map((h) => <option key={h}>{h}</option>)}
              </select>
              <select
                disabled={semana[dia].horario24h}
                value={semana[dia].dasMinuto}
                onChange={(e) => handleChange(dia, "dasMinuto", e.target.value)}
              >
                {minutos.map((m) => <option key={m}>{m}</option>)}
              </select>

              <label style={{ marginLeft: 8 }}>Até as</label>
              <select
                disabled={semana[dia].horario24h}
                value={semana[dia].ateHora}
                onChange={(e) => handleChange(dia, "ateHora", e.target.value)}
              >
                {horas.map((h) => <option key={h}>{h}</option>)}
              </select>
              <select
                disabled={semana[dia].horario24h}
                value={semana[dia].ateMinuto}
                onChange={(e) => handleChange(dia, "ateMinuto", e.target.value)}
              >
                {minutos.map((m) => <option key={m}>{m}</option>)}
              </select>

              {dia === "Segunda" && (
                <button
                  style={{
                    marginLeft: 12,
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  onClick={() => copiarParaTodos("Segunda")}
                >
                  Copiar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <label>Mesmo horário todos os dias?</label>
        <input
          type="radio"
          name="same"
          value="Sim"
          checked={sameEveryDay === "Sim"}
          onChange={() => setSameEveryDay("Sim")}
          style={{ marginLeft: 8 }}
        />
        <label style={{ marginRight: 12 }}>Sim</label>

        <input
          type="radio"
          name="same"
          value="Não"
          checked={sameEveryDay === "Não"}
          onChange={() => setSameEveryDay("Não")}
        />
        <label>Não</label>
      </div>
    </div>
  );
};

export default HorarioSection;
