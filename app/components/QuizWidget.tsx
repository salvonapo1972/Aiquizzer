"use client";

import { useObject } from "@ai-sdk/react";
import { useState, useEffect } from "react";

import { quizSchema } from "../api/quiz/schema";

interface QuizWidgetProps {
  articleId?: string;
  limitSup?: string;
  limitDown?: string;
  knowledgeid?: string;
}

const KNOWLEDGE_OPTIONS = [
  { id: "0", label: "Project Management" },
  { id: "1", label: "Guerra Greci - Persiani" },
  { id: "2", label: "Polinomi" },
  { id: "3", label: "Economia e Finanza" },
  { id: "4", label: "Medicina e Salute" },
];

export default function QuizWidget({
  articleId = "0",
  limitSup = "1000",
  limitDown = "0",
  knowledgeid = "0",
}: QuizWidgetProps) {
  /* =====================================================
     APERTURA PANNELLO
  ===================================================== */

  const [isOpen, setIsOpen] = useState(false);

  /* =====================================================
     QUIZ
  ===================================================== */

  const [quizStarted, setQuizStarted] = useState(false);

  const [quizFinished, setQuizFinished] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  const [score, setScore] = useState(0);

  const [limitSupValue, setLimitSupValue] = useState(limitSup);
  const [limitDownValue, setLimitDownValue] = useState(limitDown);
  const [knowledgeidValue, setKnowledgeidValue] = useState(knowledgeid);

  useEffect(() => {
    setKnowledgeidValue(knowledgeid);
  }, [knowledgeid]);

  /* =====================================================
     USE OBJECT
  ===================================================== */

  const {
    object: quiz,
    submit: submitQuiz,
    isLoading: isQuizLoading,
    error: quizError,
  } = useObject({
    api: "/api/quiz",
    schema: quizSchema,
  });

  /* =====================================================
     DOMANDE
  ===================================================== */

  const questions = quiz?.questions ?? [];

  const question = questions[currentQuestion];

  /* =====================================================
     RISPOSTA SELEZIONATA
  ===================================================== */

  const selectedAnswer = selectedAnswers[currentQuestion];

  const hasAnswered = selectedAnswer !== undefined;

  /* =====================================================
     APRI / CHIUDI
  ===================================================== */

  const toggleQuiz = () => {
    setIsOpen((previous) => !previous);
  };

  /* =====================================================
     AVVIA QUIZ
  ===================================================== */

  const startQuiz = () => {
    if (!articleId) {
      console.error("articleId non presente");

      return;
    }

    console.log("Avvio quiz per articleId:", articleId);

    /*
     * Reset
     */

    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);

    /*
     * Chiamata /api/quiz
     */

    submitQuiz({
      articleId,
      limitSup: limitSupValue,
      limitDown: limitDownValue,
      knowledgeid: knowledgeidValue,
    });
  };

  /* =====================================================
     RISPOSTA ALLA DOMANDA
  ===================================================== */

  const answerQuestion = (index: number) => {
    if (!question) {
      return;
    }

    /*
     * Una sola risposta
     */

    if (hasAnswered) {
      return;
    }

    /*
     * Salva risposta
     */

    setSelectedAnswers((previous) => ({
      ...previous,
      [currentQuestion]: index,
    }));

    /*
     * Aggiorna punteggio
     */

    if (index === question.correctAnswerIndex) {
      setScore((previous) => previous + 1);
    }
  };

  /* =====================================================
     DOMANDA SUCCESSIVA
  ===================================================== */

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);

      return;
    }

    /*
     * Ultima domanda
     */

    setQuizFinished(true);
  };

  /* =====================================================
     RICOMINCIA
  ===================================================== */

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        fixed
        bottom-6
        right-6
        z-[9999]
        flex
        flex-col
        items-end
      "
    >
      {/* =================================================
          PANNELLO QUIZ
      ================================================= */}

      {isOpen && (
        <div
          className="
            w-[360px]
            sm:w-[420px]
            max-h-[calc(100vh-110px)]
            mb-4
            bg-white
            dark:bg-zinc-900
            rounded-2xl
            shadow-2xl
            border
            border-zinc-200
            dark:border-zinc-800
            overflow-hidden
            flex
            flex-col
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              p-4
              bg-indigo-600
              text-white
              flex
              items-center
              justify-between
              flex-shrink-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-white/20
                  flex
                  items-center
                  justify-center
                  text-xl
                "
              >
                📝
              </div>

              <div>
                <div
                  className="
                    font-bold
                    text-sm
                  "
                >
                  Quiz chatbot
                </div>

                <div
                  className="
                    text-[11px]
                    text-indigo-100
                  "
                >
                  Mettiti alla prova
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleQuiz}
              className="
                text-xl
                hover:opacity-70
                transition
              "
              aria-label="Chiudi quiz"
            >
              ✕
            </button>
          </header>

          {/* =================================================
              CONTENUTO
          ================================================= */}

          <div
            className="
              overflow-y-auto
              flex-1
            "
          >
            {/* =================================================
                ARTICLE ID MANCANTE
            ================================================= */}

            {!articleId && (
              <div
                className="
                  m-4
                  p-4
                  rounded-xl
                  bg-yellow-50
                  border
                  border-yellow-200
                  text-yellow-800
                  text-sm
                "
              >
                <strong>Attenzione</strong>

                <p className="mt-1">Non è stato fornito l'articleId.</p>
              </div>
            )}

            {/* =================================================
                START QUIZ
            ================================================= */}

            {!quizStarted && (
              <div
                className="
                  p-6
                  text-center
                "
              >
                <div
                  className="
                    text-5xl
                    mb-4
                  "
                >
                  🧠
                </div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-zinc-900
                    dark:text-white
                  "
                >
                  Quiz
                </h2>

                <p
                  className="
                    text-sm
                    text-zinc-500
                    mt-2
                    mb-6
                  "
                >
                  Rispondi alle domande.
                </p>

                {/* COMBOBOX (SELECT) */}
                <div className="text-left mb-6">
                  <label
                    htmlFor="knowledge-select"
                    className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
                  >
                    Ambito di Conoscenza
                  </label>
                  <select
                    id="knowledge-select"
                    value={knowledgeidValue}
                    onChange={(e) => setKnowledgeidValue(e.target.value)}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
                  >
                    {KNOWLEDGE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5 text-left">
                  <label
                    htmlFor="limitDown"
                    className="
      block
      text-xs
      font-semibold
      text-zinc-700
      dark:text-zinc-300
      mb-1
    "
                  >
                    Limite minimo elementi
                  </label>

                  <input
                    id="limitDown"
                    type="number"
                    min="100"
                    max="50000"
                    value={limitDownValue}
                    onChange={(e) => setLimitDownValue(e.target.value)}
                    className="
      w-full
      px-3
      py-2
      rounded-lg
      border
      border-zinc-300
      dark:border-zinc-700
      bg-white
      dark:bg-zinc-800
      text-sm
      text-zinc-900
      dark:text-white
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
    "
                  />

                  <p className="mt-1 text-[10px] text-zinc-500">
                    Il contenuto deve avere almeno questo numero di elementi.
                  </p>

                  <label
                    htmlFor="limitSup"
                    className="
      block
      text-xs
      font-semibold
      text-zinc-700
      dark:text-zinc-300
      mt-4
      mb-1
    "
                  >
                    Limite massimo elementi
                  </label>

                  <input
                    id="limitSup"
                    type="number"
                    min="100"
                    max="50000"
                    value={limitSupValue}
                    onChange={(e) => setLimitSupValue(e.target.value)}
                    className="
      w-full
      px-3
      py-2
      rounded-lg
      border
      border-zinc-300
      dark:border-zinc-700
      bg-white
      dark:bg-zinc-800
      text-sm
      text-zinc-900
      dark:text-white
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
    "
                  />

                  <p className="mt-1 text-[10px] text-zinc-500">
                    Il contenuto verrà limitato a questo numero di elementi.
                  </p>

                  {Number(limitDownValue) >= Number(limitSupValue) && (
                    <p className="mt-2 text-xs text-red-600">
                      Il limite minimo deve essere inferiore al limite massimo.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={startQuiz}
                  disabled={
                    !articleId ||
                    isQuizLoading ||
                    !limitDownValue ||
                    !limitSupValue ||
                    !knowledgeidValue ||
                    Number(limitDownValue) >= Number(limitSupValue)
                  }
                  className="
                    w-full
                    bg-indigo-600
                    hover:bg-indigo-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    text-white
                    rounded-xl
                    py-3
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  {isQuizLoading ? "Generazione..." : "Genera Quiz"}
                </button>
              </div>
            )}

            {/* =================================================
                ERRORE
            ================================================= */}

            {quizError && (
              <div
                className="
                  m-4
                  p-4
                  rounded-xl
                  bg-red-50
                  border
                  border-red-200
                  text-red-700
                  text-sm
                "
              >
                <div
                  className="
                    font-bold
                    mb-1
                  "
                >
                  Errore nella generazione
                </div>

                <div>{quizError.message}</div>

                <button
                  type="button"
                  onClick={startQuiz}
                  disabled={
                    !articleId ||
                    isQuizLoading ||
                    !limitDownValue ||
                    !limitSupValue ||
                    !knowledgeidValue ||
                    Number(limitDownValue) >= Number(limitSupValue)
                  }
                  className="
                    mt-3
                    px-4
                    py-2
                    bg-red-600
                    hover:bg-red-700
                    disabled:opacity-50
                    text-white
                    rounded-lg
                    text-sm
                    font-semibold
                  "
                >
                  Riprova
                </button>
              </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {quizStarted && isQuizLoading && questions.length === 0 && (
              <div
                className="
                    p-8
                    text-center
                  "
              >
                <div
                  className="
                      w-10
                      h-10
                      mx-auto
                      mb-4
                      border-4
                      border-indigo-200
                      border-t-indigo-600
                      rounded-full
                      animate-spin
                    "
                />

                <p
                  className="
                      text-sm
                      text-zinc-500
                    "
                >
                  Sto preparando il quiz...
                </p>
              </div>
            )}

            {/* =================================================
                DOMANDA
            ================================================= */}

            {quizStarted && !quizFinished && question && (
              <div
                className="
                    p-5
                  "
              >
                {/* =================================================
                      TITOLO
                  ================================================= */}

                <div
                  className="
                      border-b
                      border-zinc-200
                      dark:border-zinc-700
                      pb-4
                      mb-5
                    "
                >
                  <h2
                    className="
                        font-bold
                        text-base
                        text-zinc-900
                        dark:text-white
                      "
                  >
                    {quiz?.quizTitle ?? "Quiz"}
                  </h2>

                  <div
                    className="
                        flex
                        justify-between
                        mt-3
                        text-xs
                        text-zinc-500
                      "
                  >
                    <span>
                      Domanda {currentQuestion + 1} di {questions.length}
                    </span>

                    <span
                      className="
                          font-semibold
                          text-indigo-600
                        "
                    >
                      Punteggio: {score}
                    </span>
                  </div>
                </div>

                {/* =================================================
                      DOMANDA
                  ================================================= */}

                <p
                  className="
                      font-semibold
                      text-sm
                      mb-5
                      text-zinc-900
                      dark:text-white
                    "
                >
                  {question.questionText}
                </p>

                {/* =================================================
                      RISPOSTE
                  ================================================= */}

                <div
                  className="
                      grid
                      gap-3
                    "
                >
                  {question.options?.map((option, index) => {
                    const correct = index === question.correctAnswerIndex;

                    const selected = index === selectedAnswer;

                    let optionClass = `
                          border-zinc-200
                          dark:border-zinc-700
                          bg-white
                          dark:bg-zinc-800
                          hover:border-indigo-400
                          hover:bg-indigo-50
                          dark:hover:bg-indigo-950
                        `;

                    if (hasAnswered) {
                      if (correct) {
                        optionClass = `
                              border-green-500
                              bg-green-50
                              dark:bg-green-950
                            `;
                      } else if (selected) {
                        optionClass = `
                              border-red-500
                              bg-red-50
                              dark:bg-red-950
                            `;
                      }
                    }

                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={hasAnswered}
                        onClick={() => answerQuestion(index)}
                        className={`
                              w-full
                              p-3
                              rounded-xl
                              border
                              text-left
                              text-sm
                              transition
                              ${optionClass}
                            `}
                      >
                        <span
                          className="
                                inline-flex
                                items-center
                                justify-center
                                w-7
                                h-7
                                mr-2
                                rounded-full
                                bg-indigo-100
                                text-indigo-700
                                font-bold
                              "
                        >
                          {String.fromCharCode(65 + index)}
                        </span>

                        {option}

                        {hasAnswered && correct && (
                          <span
                            className="
                                    float-right
                                    text-green-600
                                    font-bold
                                    text-lg
                                  "
                          >
                            ✓
                          </span>
                        )}

                        {hasAnswered && selected && !correct && (
                          <span
                            className="
                                    float-right
                                    text-red-600
                                    font-bold
                                    text-lg
                                  "
                          >
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* =================================================
                      SPIEGAZIONE
                  ================================================= */}

                {hasAnswered && (
                  <div
                    className="
                        mt-4
                        p-4
                        rounded-xl
                        bg-zinc-50
                        dark:bg-zinc-800
                        border
                        border-zinc-200
                        dark:border-zinc-700
                      "
                  >
                    <div
                      className="
                          text-xs
                          font-bold
                          mb-2
                        "
                    >
                      {selectedAnswer === question.correctAnswerIndex
                        ? "✓ Risposta corretta"
                        : "✕ Risposta errata"}
                    </div>

                    <p
                      className="
                          text-xs
                          leading-relaxed
                          text-zinc-600
                          dark:text-zinc-300
                        "
                    >
                      {question.explanation}
                    </p>
                  </div>
                )}

                {/* =================================================
                      NEXT
                  ================================================= */}

                {hasAnswered && (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="
                        mt-4
                        w-full
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        rounded-xl
                        py-3
                        text-sm
                        font-semibold
                        transition
                      "
                  >
                    {currentQuestion < questions.length - 1
                      ? "Domanda successiva →"
                      : "Termina quiz"}
                  </button>
                )}
              </div>
            )}

            {/* =================================================
                RISULTATO
            ================================================= */}

            {quizFinished && (
              <div
                className="
                  p-7
                  text-center
                "
              >
                <div
                  className="
                    text-5xl
                    mb-4
                  "
                >
                  🎉
                </div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-zinc-900
                    dark:text-white
                  "
                >
                  Quiz completato!
                </h2>

                <p
                  className="
                    text-sm
                    text-zinc-500
                    mt-2
                  "
                >
                  Hai totalizzato
                </p>

                <div
                  className="
                    text-4xl
                    font-bold
                    text-indigo-600
                    my-4
                  "
                >
                  {score} / {questions.length}
                </div>

                <button
                  type="button"
                  onClick={restartQuiz}
                  className="
                    w-full
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    rounded-xl
                    py-3
                    text-sm
                    font-semibold
                  "
                >
                  Rifai il quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          PULSANTE FLOTTANTE
      ===================================================== */}

      <button
        type="button"
        onClick={toggleQuiz}
        aria-label={isOpen ? "Chiudi quiz" : "Apri quiz"}
        className="
          fixed
          bottom-6
          right-6
          z-[10000]
          w-16
          h-16
          rounded-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          shadow-2xl
          flex
          items-center
          justify-center
          text-3xl
          border-2
          border-white
          cursor-pointer
          transition
          hover:scale-105
        "
      >
        {isOpen ? "✕" : "📝"}
      </button>
    </div>
  );
}
