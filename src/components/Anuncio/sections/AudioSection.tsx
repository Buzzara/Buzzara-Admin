import React from "react";

const AudioSection: React.FC = () => {
  return (
    <div
      className="audio-section"
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    >
      <h3 className="audio-section__title">
        <span className="audio-section__icon">🔊</span>
        Audio de apresentação
      </h3>

      <div className="audio-section__content">
        <p>
          Sua voz poderá ser ouvida enquanto o seu{" "}
          <strong>anúncio estiver verificado</strong> e tenha subidas
          automáticas contratadas.
        </p>
        <p>
          Cada audio pode durar até <strong>30 segundos</strong>.
        </p>
        <p>
          Você pode <strong>Gravar um áudio</strong> sem sair do formulário, ou{" "}
          <strong>Carregar um arquivo</strong> de áudio gravado previamente:
        </p>

        <div className="audio-section__buttons">
          <button
            type="button"
            className="audio-section__btn audio-section__btn--record"
          >
            🎙️ Gravar + Carregar áudio
          </button>
          <button
            type="button"
            className="audio-section__btn audio-section__btn--upload"
          >
            ⬆️ Carregar arquivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioSection;
