"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import QuestionCard from "./components/QuestionCard";
import AssessmentCard from "./components/AssessmentCard";

export default function Home() {

  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [savedAssessments, setSavedAssessments] = useState([]);

  const [editingAssessmentId, setEditingAssessmentId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [questions, setQuestions] = useState([
    {
      question: "",
      answer_key: "",
      rubric: "",
      marks: "",
      expected_length: ""
    }
  ]);


  // AUTH CHECK
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

      router.push("/login");
    }

  }, []);


  // LOAD AUTOSAVE
  useEffect(() => {

    const savedDraft = localStorage.getItem("assessmentDraft");

    if (savedDraft) {

      const parsedDraft = JSON.parse(savedDraft);

      setTitle(parsedDraft.title || "");

      setQuestions(
        parsedDraft.questions || [
          {
            question: "",
            answer_key: "",
            rubric: "",
            marks: "",
            expected_length: ""
          }
        ]
      );
    }

  }, []);


  // AUTOSAVE
  useEffect(() => {

    localStorage.setItem(
      "assessmentDraft",
      JSON.stringify({
        title,
        questions
      })
    );

  }, [title, questions]);


  // FETCH ASSESSMENTS
  useEffect(() => {

    fetchAssessments();

  }, []);


  const fetchAssessments = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/assessment/all"
      );

      const data = await response.json();

      setSavedAssessments(data);

    } catch (error) {

      console.error(error);
    }
  };


  // CREATE NEW ASSESSMENT
  const createNewAssessment = () => {

    setTitle("");

    setQuestions([
      {
        question: "",
        answer_key: "",
        rubric: "",
        marks: "",
        expected_length: ""
      }
    ]);

    setEditingAssessmentId(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ADD QUESTION
  const addQuestionCard = () => {

    setQuestions([
      ...questions,
      {
        question: "",
        answer_key: "",
        rubric: "",
        marks: "",
        expected_length: ""
      }
    ]);
  };


  // UPDATE QUESTION
  const updateQuestion = (index, field, value) => {

    const updatedQuestions = [...questions];

    updatedQuestions[index][field] = value;

    setQuestions(updatedQuestions);
  };


  // DELETE QUESTION
  const deleteQuestion = (index) => {

    const updatedQuestions = questions.filter(
      (_, i) => i !== index
    );

    setQuestions(updatedQuestions);
  };


  // SAVE ASSESSMENT
  const saveAssessment = async () => {

    if (!title.trim()) {

      toast.error("Assessment title is required");

      return;
    }


    for (let q of questions) {

      if (
        !q.question.trim() ||
        !q.answer_key.trim() ||
        !q.rubric.trim() ||
        !q.marks ||
        !q.expected_length.trim()
      ) {

        toast.error("Please fill all fields");

        return;
      }
    }


    const assessmentData = {
      title,
      questions,
      id: editingAssessmentId
    };


    try {

      setSaving(true);

      await fetch(
        "http://127.0.0.1:8000/assessment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(assessmentData)
        }
      );

      toast.success("Assessment saved successfully");

      setEditingAssessmentId(null);

      fetchAssessments();

    } catch (error) {

      console.error(error);

      toast.error("Failed to save assessment");

    } finally {

      setSaving(false);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-gray-900 flex">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      {/* MAIN CONTENT */}
      <div
        className={`w-full transition-all duration-300
        ${sidebarOpen ? "ml-[240px]" : "ml-[80px]"}`}
      >

        {/* NAVBAR */}
        <Navbar
          saveAssessment={saveAssessment}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          createNewAssessment={createNewAssessment}
          saving={saving}
        />


        {/* PAGE CONTENT */}
        <div className="px-10 py-10">

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-white/90 backdrop-blur-sm rounded-[30px] p-7 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition">

              <div className="mb-6">

                <p className="text-slate-500 text-sm mb-2">
                  Total Assessments
                </p>

                <h2 className="text-5xl font-bold text-slate-900">
                  {savedAssessments.length}
                </h2>

              </div>

              <p className="text-sm text-slate-500">
                Assessments created by faculty
              </p>

            </div>


            <div className="bg-white/90 backdrop-blur-sm rounded-[30px] p-7 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition">

              <div className="mb-6">

                <p className="text-slate-500 text-sm mb-2">
                  Total Questions
                </p>

                <h2 className="text-5xl font-bold text-slate-900">
                  {questions.length}
                </h2>

              </div>

              <p className="text-sm text-slate-500">
                Questions in current assessment
              </p>

            </div>


            <div className="bg-white/90 backdrop-blur-sm rounded-[30px] p-7 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition">

              <div className="mb-6">

                <p className="text-slate-500 text-sm mb-2">
                  Current Status
                </p>

                <h2 className="text-2xl font-bold text-slate-900">

                  {editingAssessmentId
                    ? "Editing Draft"
                    : "Draft Mode"}

                </h2>

              </div>

              <p className="text-sm text-slate-500">
                Assessment workflow status
              </p>

            </div>

          </div>


          {/* BUILDER */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-10 mb-12">

            <div className="mb-10">

              <h2 className="text-4xl font-bold tracking-tight text-slate-900">

                {editingAssessmentId
                  ? "Edit Assessment"
                  : "Create Assessment"}

              </h2>

              <p className="text-slate-500 mt-3 text-lg">
                Build professional assessments for students
              </p>

            </div>


            {/* TITLE */}
            <div className="mb-10">

              <label className="block text-sm font-semibold text-slate-600 mb-4">
                Assessment Title
              </label>

              <input
                type="text"
                placeholder="Enter assessment title"
                className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

            </div>


            {/* QUESTION CARDS */}
            {questions.length > 0 ? (

              <div className="space-y-8">

                {questions.map((q, index) => (

                  <QuestionCard
                    key={index}
                    q={q}
                    index={index}
                    addQuestionCard={addQuestionCard}
                    deleteQuestion={deleteQuestion}
                    updateQuestion={updateQuestion}
                  />

                ))}

              </div>

            ) : (

              <div className="border-2 border-dashed border-slate-300 rounded-[30px] p-16 flex flex-col items-center justify-center text-center bg-slate-50">

                <h2 className="text-3xl font-bold mb-3 text-slate-900">
                  No Questions Added
                </h2>

                <p className="text-slate-500 text-lg mb-8 max-w-md">
                  Start building your assessment by adding your first question card.
                </p>

                <button
                  onClick={addQuestionCard}
                  className="bg-slate-900 hover:bg-slate-700 transition text-white px-7 py-3 rounded-xl font-semibold text-sm shadow-sm"
                >
                  Add First Question
                </button>

              </div>

            )}

          </div>


          {/* PREVIEW */}
          {showPreview && (

            <div className="bg-white/90 backdrop-blur-sm rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-10 mb-12">

              <h2 className="text-4xl font-bold mb-10 text-slate-900">
                Student Preview
              </h2>

              <h3 className="text-2xl font-semibold mb-10">
                {title}
              </h3>

              <div className="space-y-6">

                {questions.map((q, index) => (

                  <div
                    key={index}
                    className="border border-slate-200 rounded-3xl p-7 bg-white"
                  >

                    <h4 className="font-semibold text-xl mb-4">
                      Question {index + 1}
                    </h4>

                    <p className="mb-6 text-slate-700">
                      {q.question}
                    </p>

                    <div className="flex gap-6 text-sm text-slate-500">

                      <p>
                        Marks: {q.marks}
                      </p>

                      <p>
                        Length: {q.expected_length}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* DRAFTS */}
          <div>

            <div className="mb-8">

              <h2 className="text-4xl font-bold text-slate-900">
                Draft Assessments
              </h2>

              <p className="text-slate-500 mt-2 text-lg">
                Continue editing previously saved drafts
              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

              {savedAssessments.map((assessment, index) => (

                <AssessmentCard
                  key={index}
                  assessment={assessment}

                  onEdit={() => {

                    setTitle(assessment.title);

                    setQuestions(
                      assessment.questions || [
                        {
                          question: "",
                          answer_key: "",
                          rubric: "",
                          marks: "",
                          expected_length: ""
                        }
                      ]
                    );

                    setEditingAssessmentId(
                      assessment._id
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });

                  }}

                  onDelete={async () => {

                    const confirmDelete = confirm(
                      "Delete this assessment?"
                    );

                    if (!confirmDelete) return;

                    try {

                      await fetch(
                        `http://127.0.0.1:8000/assessment/delete/${assessment._id}`,
                        {
                          method: "DELETE"
                        }
                      );

                      fetchAssessments();

                      toast.success("Assessment deleted");

                    } catch (error) {

                      console.error(error);

                      toast.error("Failed to delete assessment");
                    }

                  }}
                />

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}