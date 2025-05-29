import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/supportPage.scss";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Como crio um novo anúncio?",
    answer:
      'Clique em "Novo Anúncio" na página de Anúncios, preencha todos os campos obrigatórios e envie.',
  },
  {
    question: "Posso editar meus anúncios depois de publicados?",
    answer:
      'Sim! Na lista de Anúncios, use o ícone de lápis para editar título, imagens ou status.',
  },
  {
    question: "Qual o prazo de resposta do suporte?",
    answer:
      "Nosso time costuma responder em até 24 horas úteis após o envio da sua solicitação.",
  },
  {
    question: "Como alterar meu plano para ter mais fotos e vídeos?",
    answer:
      'Acesse sua conta, clique em "Planos" e escolha a opção que melhor atende suas necessidades.',
  },
];

const SupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) =>
    setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="support-page">
      <header className="support-page__header">
        <HelpCircle className="icon-help" />
        <h1>Central de Ajuda</h1>
      </header>

      <div className="support-page__content">
        <section className="support-page__faqs">
          <h2>Perguntas Frequentes</h2>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openFaq === idx ? "open" : ""}`}
            >
              <button
                className="faq-item__question"
                onClick={() => toggleFaq(idx)}
              >
                {faq.question}
                {openFaq === idx ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openFaq === idx && (
                <p className="faq-item__answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </section>

        <section className="support-page__whatsapp">
          <h2>Entrar em contato com o suporte</h2>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-box"
          >
            <FaWhatsapp />
            Falar com o Suporte via WhatsApp
          </a>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;
