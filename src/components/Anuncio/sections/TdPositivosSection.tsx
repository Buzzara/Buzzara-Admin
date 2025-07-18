import React from "react";

interface TdPositivosSectionProps {
  linkTD: string;
  setLinkTD: (value: string) => void;
}

const TdPositivosSection: React.FC<TdPositivosSectionProps> = ({
  linkTD,
  setLinkTD,
}) => {
  return (
    <div className="modal__section tdpositivos-section">
      <div className="tdpositivos-section__header">
        <div className="tdpositivos-section__title-wrapper">
          <span className="tdpositivos-section__title">TD positivos</span>
        </div>
      </div>

      <div className="tdpositivos-section__body">
        <p className="tdpositivos-section__text">
          Se você tem TD positivos publicados em fóruns sobre acompanhantes,
          como <strong>GPGuia</strong>, <strong>GP Arena</strong>,{" "}
          <strong>ForumX</strong>, etc. e você quer que os vinculemos a partir
          do seu anúncio, indique abaixo os links:
        </p>
        <input
          type="url"
          className="tdpositivos-section__input"
          placeholder="http://"
          value={linkTD}
          onChange={(e) => setLinkTD(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TdPositivosSection;
