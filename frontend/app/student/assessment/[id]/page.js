"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentAssessmentPage() {

  const params = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {

    try {

      const response = await fetch(
        `http://localhost:8000/assessment/view/${params.id}`
      );

      const data = await response.json();

      setAssessment(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  const handleAnswerChange = (
    questionIndex,
    value
  ) => {

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const submitAssessment = async () => {

    try {

      setSubmitting(true);

      const response = await fetch(
        "http://localhost:8000/submission/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            assessment_id:
              assessment._id,

            student_email:
              localStorage.getItem(
                "userEmail"
              ),

            answers
          })
        }
      );

      const data =
        await response.json();

      alert(
        data.message ||
        "Assessment Submitted Successfully"
      );

      router.push(
        "/student/dashboard"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to submit assessment"
      );

    } finally {

      setSubmitting(false);
    }
  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <h2 className="text-xl font-semibold text-slate-900">
          Loading Assessment...
        </h2>

      </div>

    );
  }

  if (!assessment) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <h2 className="text-xl font-semibold text-red-600">
          Assessment Not Found
        </h2>

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-[30px] border border-slate-200 p-10 shadow-sm mb-8">

          <div className="mb-6 border-b border-slate-200 pb-6">

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {assessment.title}
            </h1>

            <p className="text-slate-500 text-lg">
              Student Assessment
            </p>

          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <p>
                <span className="font-semibold">
                  Subject Code:
                </span>{" "}
                {assessment.subjectCode}
              </p>

              <p>
                <span className="font-semibold">
                  Subject Name:
                </span>{" "}
                {assessment.subjectName}
              </p>

              <p>
                <span className="font-semibold">
                  Examination Date:
                </span>{" "}
                {new Date(
                  assessment.examDate
                ).toLocaleDateString("en-GB")}
              </p>

              <p>
                <span className="font-semibold">
                  Duration:
                </span>{" "}
                {assessment.duration}
              </p>

              <p>
                <span className="font-semibold">
                  Department:
                </span>{" "}
                {assessment.departments?.join(", ")}
              </p>

              <p>
                <span className="font-semibold">
                  Year:
                </span>{" "}
                {assessment.years?.join(", ")}
              </p>

              <p>
                <span className="font-semibold">
                  Available From:
                </span>{" "}
                {new Date(
                  assessment.availableFrom
                ).toLocaleString("en-GB")}
              </p>

              <p>
                <span className="font-semibold">
                  Available To:
                </span>{" "}
                {new Date(
                  assessment.availableTo
                ).toLocaleString("en-GB")}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6 mb-8">

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Instructions
          </h2>

          <p className="text-slate-700 whitespace-pre-line">
            {assessment.instructions}
          </p>

        </div>

        <div className="space-y-8">

          {assessment.questions?.map(
            (question, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
              >

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-2xl font-bold text-slate-900">
                    Question {index + 1}
                  </h2>

                  <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
                    {question.marks} Marks
                  </div>

                </div>

                <div className="mb-6">

                  <p className="text-slate-800 text-lg">
                    {question.question}
                  </p>

                </div>

                <textarea
                  rows={8}
                  value={
                    answers[index] || ""
                  }
                  onChange={(e) =>
                    handleAnswerChange(
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Write your answer here..."
                  className="w-full border border-slate-300 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />

              </div>

            )
          )}

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={() => {

              const confirmSubmit = window.confirm(
                "Once submitted, you cannot edit your answers. Do you want to continue?"
              );

              if (confirmSubmit) {
                submitAssessment();
              }

            }}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Assessment"}
          </button>

        </div>

      </div>

    </div>
  );
}