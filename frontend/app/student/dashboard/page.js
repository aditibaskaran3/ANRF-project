"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {

  const router = useRouter();

  const [assessments, setAssessments] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentInfo, setStudentInfo] = useState({
    registerNumber: "",
    department: "",
    year: ""
  });

  useEffect(() => {

    setStudentInfo({
      registerNumber:
        localStorage.getItem(
          "registerNumber"
        ) || "",

      department:
        localStorage.getItem(
          "department"
        ) || "",

      year:
        localStorage.getItem(
          "year"
        ) || ""
    });

    fetchAssessments();

  }, []);

  const fetchAssessments = async () => {

    try {

      const department =
        localStorage.getItem(
          "department"
        );

      const year =
        localStorage.getItem(
          "year"
        );

      const email =
        localStorage.getItem(
          "userEmail"
        );

      const assessmentResponse =
        await fetch(
          `http://localhost:8000/assessment/student/${department}/${year}`
        );

      const assessmentData =
        await assessmentResponse.json();

      setAssessments(
        assessmentData
      );

      const submissionResponse =
        await fetch(
          `http://localhost:8000/submission/student/${email}`
        );

      const submissionData =
        await submissionResponse.json();

      const submittedAssessmentIds =
        submissionData.map(
          (submission) =>
            submission.assessment_id
        );

      setSubmittedIds(
        submittedAssessmentIds
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <h2 className="text-xl font-semibold text-slate-900">
          Loading Assessments...
        </h2>

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      {/* PROFILE CARD */}

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-slate-900">
            Student Dashboard
          </h1>

          <button
            onClick={() => {

              localStorage.clear();

              router.push("/");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-slate-500 text-sm">
              Register Number
            </p>

            <p className="text-xl font-semibold text-slate-900">
              {studentInfo.registerNumber}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Department
            </p>

            <p className="text-xl font-semibold text-slate-900">
              {studentInfo.department}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Year
            </p>

            <p className="text-xl font-semibold text-slate-900">
              {studentInfo.year}
            </p>
          </div>

        </div>

      </div>

      {/* ASSESSMENTS */}

      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        Available Assessments
      </h2>

      {assessments.length === 0 ? (

        <div className="bg-white rounded-3xl p-8 border border-slate-200">

          <h2 className="text-xl font-semibold text-slate-900">
            No Assessments Available
          </h2>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {assessments.map(
            (assessment) => {

              const isSubmitted =
                submittedIds.includes(
                  assessment._id
                );

              return (

                <div
                  key={assessment._id}
                  className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
                >

                  <div className="flex justify-between items-center mb-4">

                    <h2 className="text-2xl font-bold text-slate-900">
                      {assessment.title}
                    </h2>

                    {isSubmitted ? (

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Submitted
                      </span>

                    ) : (

                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Available
                      </span>

                    )}

                  </div>

                  <div className="space-y-2 mb-6">

                    <p className="text-slate-700">
                      <strong>
                        Subject:
                      </strong>{" "}
                      {assessment.subjectName}
                    </p>

                    <p className="text-slate-700">
                      <strong>
                        Subject Code:
                      </strong>{" "}
                      {assessment.subjectCode}
                    </p>

                    <p className="text-slate-700">
                      <strong>
                        Duration:
                      </strong>{" "}
                      {assessment.duration}
                    </p>

                    <p className="text-slate-700">
                      <strong>
                        Exam Date:
                      </strong>{" "}
                      {new Date(
                        assessment.examDate
                      ).toLocaleDateString("en-GB")}
                    </p>

                  </div>

                  {isSubmitted ? (

                    <button
                      disabled
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
                    >
                      ✓ Submitted
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        router.push(
                          `/student/assessment/${assessment._id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                      Open Assessment
                    </button>

                  )}

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}