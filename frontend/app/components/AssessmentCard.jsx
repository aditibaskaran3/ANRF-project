"use client";

import toast from "react-hot-toast";

export default function AssessmentCard({
  assessment,
  fetchAssessments,
  setTitle,
  setQuestions,
  setEditingAssessmentId,
  setActiveSection
}) {

  // LOAD DRAFT
  const continueEditing = () => {

    setTitle(
      assessment.title
    );

    setQuestions(
      assessment.questions
    );

    setEditingAssessmentId(
      assessment._id
    );

    // IMPORTANT
    setActiveSection(
      "Create Assessment"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    toast.success(
      "Draft loaded successfully"
    );
  };


  // DELETE
  const deleteAssessment = async () => {

    const confirmDelete = confirm(
      "Delete this assessment?"
    );

    if (!confirmDelete) return;


    try {

      const response = await fetch(
        `http://localhost:8000/assessment/delete/${assessment._id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        throw new Error();
      }

      toast.success(
        "Assessment deleted"
      );

      fetchAssessments();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to delete"
      );
    }
  };


  return (

    <div className="bg-white rounded-[30px] border border-slate-200 p-8 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <div className="mb-6">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">

            <div className="w-3 h-3 rounded-full bg-slate-500"></div>

            <p className="text-sm font-semibold text-slate-600">
              {assessment.status}
            </p>

          </div>


          <span className={`text-xs px-3 py-1 rounded-full font-medium

            ${assessment.status === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-700"}
          `}
          >
            {assessment.status}
          </span>

        </div>


        <h2 className="text-3xl font-bold text-slate-900 leading-tight">
          {assessment.title}
        </h2>

      </div>


      {/* DETAILS */}
      <div className="space-y-4 mb-8">

        <div className="flex justify-between items-center">

          <p className="text-slate-500">
            Questions
          </p>

          <p className="font-bold text-slate-900">
            {assessment.questions.length}
          </p>

        </div>

      </div>


      {/* ACTIONS */}
      <div className="flex gap-3">

        <button
          onClick={continueEditing}
          className="flex-1 bg-slate-900 hover:bg-slate-700 transition text-white py-3 rounded-xl font-semibold text-sm"
        >
          Continue Editing
        </button>


        <button
          onClick={deleteAssessment}
          className="px-5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-semibold text-sm transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
}