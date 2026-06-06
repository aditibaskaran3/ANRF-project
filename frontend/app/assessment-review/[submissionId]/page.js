"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AssessmentReviewPage() {

  const params = useParams();
  const submissionId = params.submissionId;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {

    try {

      const response = await fetch(
        `http://localhost:8000/submission/review/${submissionId}`
      );

      const data = await response.json();

      setQuestions(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const totalMarks = questions.reduce(
    (sum, q) => sum + Number(q.ai_marks || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <h1 className="text-4xl font-bold text-slate-900 mb-10">
        Assessment Review
      </h1>

      {questions.map((q, index) => (

        <div
          key={index}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8"
        >

          <h2 className="text-2xl font-bold text-blue-700 mb-8">
            Question {q.question_id}
          </h2>

          <div className="mb-8">

            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Question
            </h3>

            <p className="text-slate-700">
              {q.question}
            </p>

          </div>

          <div className="mb-8">

            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Maximum Marks
            </h3>

            <p className="text-slate-700 text-lg">
              {q.max_marks}
            </p>

          </div>

          <div className="mb-8">

            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Student Answer
            </h3>

            <p className="text-slate-700 whitespace-pre-wrap leading-8">
              {q.student_answer}
            </p>

          </div>

          <div className="border-t pt-6 flex items-center">

            <span className="font-semibold text-slate-800 text-lg">
              AI Marks :
            </span>

            <span className="ml-3 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-xl">
              {q.ai_marks}
            </span>

            <span className="ml-2 text-slate-600">
              / {q.max_marks}
            </span>

          </div>

        </div>

      ))}

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-lg p-8 text-white">

        <h2 className="text-3xl font-bold">
          Total AI Marks
        </h2>

        <p className="text-6xl font-bold mt-4">
          {totalMarks.toFixed(2)}
        </p>

      </div>

    </div>

  );
}