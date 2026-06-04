"use client";

import { motion } from "framer-motion";

export default function QuestionCard({
  q,
  index,
  addQuestionCard,
  deleteQuestion,
  updateQuestion
}) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-slate-50 border border-slate-200 rounded-[28px] p-8 hover:shadow-lg transition duration-300"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <p className="text-sm text-slate-500 mb-1">
            Assessment Question
          </p>

          <h2 className="text-2xl font-bold">
            Question {index + 1}
          </h2>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => addQuestionCard(index)}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center text-xl"
          >
            +
          </button>

          <button
            onClick={() => deleteQuestion(index)}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center"
          >
            ×
          </button>

        </div>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* QUESTION */}
        <div className="lg:col-span-2">

          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Question
          </label>

          <textarea
            placeholder="Enter the assessment question..."
            className="w-full border border-slate-200 bg-white rounded-2xl p-5 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            value={q.question || ""}
            onChange={(e) =>
              updateQuestion(index, "question", e.target.value)
            }
          />

        </div>

        {/* ANSWER KEY */}
        <div className="lg:col-span-2">

          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Answer Key
          </label>

          <textarea
            placeholder="Enter expected answer..."
            className="w-full border border-slate-200 bg-white rounded-2xl p-5 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            value={q.answer_key || ""}
            onChange={(e) =>
              updateQuestion(index, "answer_key", e.target.value)
            }
          />

        </div>

        {/* RUBRIC */}
        <div>

          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Rubric
          </label>

          <textarea
            placeholder="Enter evaluation criteria..."
            className="w-full border border-slate-200 bg-white rounded-2xl p-5 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-slate-400 transition resize-none"
            value={q.rubric || ""}
            onChange={(e) =>
              updateQuestion(index, "rubric", e.target.value)
            }
          />

        </div>

        {/* MARKS */}
        <div>

          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Marks
          </label>

          <input
            type="number"
            placeholder="10"
            className="w-full border border-slate-200 bg-white rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            value={q.marks || ""}
            onChange={(e) =>
              updateQuestion(index, "marks", e.target.value)
            }
          />

        </div>

        {/* EXPECTED LENGTH */}
        <div className="lg:col-span-2">

          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Expected Answer Length
          </label>

          <input
            type="text"
            placeholder="Example: 150 words"
            className="w-full border border-slate-200 bg-white rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            value={q.expected_length || ""}
            onChange={(e) =>
              updateQuestion(index, "expected_length", e.target.value)
            }
          />

        </div>

      </div>

    </motion.div>
  );
}