"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import QuestionCard from "./components/QuestionCard";
import AssessmentCard from "./components/AssessmentCard";
import PreviewPanel from "./components/PreviewPanel";
import AnalyticsChart from "./components/AnalyticsChart";
import RecentActivity from "./components/RecentActivity";

export default function Home() {

  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activeSection, setActiveSection] = useState("Dashboard");

  const [title, setTitle] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  const [savedAssessments, setSavedAssessments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

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

    } else {

      setCheckingAuth(false);
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
        "http://localhost:8000/assessment/all"
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

    setActiveSection("Create Assessment");

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
      id: editingAssessmentId,
      status: "Draft"
    };


    try {

      setSaving(true);

      const response = await fetch(
        "http://localhost:8000/assessment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(assessmentData)
        }
      );

      if (!response.ok) {

        throw new Error("Failed to save");
      }

      toast.success("Assessment saved successfully");

      setEditingAssessmentId(null);

      fetchAssessments();

      setActiveSection("Drafts");

    } catch (error) {

      console.error(error);

      toast.error("Failed to save assessment");

    } finally {

      setSaving(false);
    }
  };


  // PUBLISH ASSESSMENT
  const publishAssessment = async () => {

    if (!title.trim()) {

      toast.error("Assessment title is required");

      return;
    }


    try {

      setSaving(true);

      const response = await fetch(
        "http://localhost:8000/assessment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            questions,
            id: editingAssessmentId,
            status: "Published"
          })
        }
      );

      if (!response.ok) {

        throw new Error();
      }

      toast.success(
        "Assessment published successfully"
      );

      fetchAssessments();

      setActiveSection("Published");

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to publish assessment"
      );

    } finally {

      setSaving(false);
    }
  };


  // LOADING SCREEN
  if (checkingAuth) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-2xl font-bold text-slate-900">
            Loading AssessPro
          </h2>

          <p className="text-slate-500 mt-2">
            Verifying authentication session...
          </p>

        </div>

      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-gray-900 flex">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />


      {/* MAIN CONTENT */}
      <div
        className={`w-full transition-all duration-300
        ${sidebarOpen ? "ml-[240px]" : "ml-[80px]"}`}
      >

        {/* NAVBAR */}
        <Navbar
          saveAssessment={saveAssessment}
          publishAssessment={publishAssessment}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          createNewAssessment={createNewAssessment}
          saving={saving}
        />


        {/* PAGE CONTENT */}
        <div className="px-10 py-10">

          {/* DASHBOARD */}
          {activeSection === "Dashboard" && (

            <div>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-[30px] p-7 border border-slate-200 shadow-sm">

                  <p className="text-slate-500 text-sm mb-2">
                    Total Assessments
                  </p>

                  <h2 className="text-5xl font-bold text-slate-900">
                    {savedAssessments.length}
                  </h2>

                </div>


                <div className="bg-white rounded-[30px] p-7 border border-slate-200 shadow-sm">

                  <p className="text-slate-500 text-sm mb-2">
                    Draft Assessments
                  </p>

                  <h2 className="text-5xl font-bold text-slate-900">
                    {
                      savedAssessments.filter(
                        (a) => a.status === "Draft"
                      ).length
                    }
                  </h2>

                </div>


                <div className="bg-white rounded-[30px] p-7 border border-slate-200 shadow-sm">

                  <p className="text-slate-500 text-sm mb-2">
                    Published Assessments
                  </p>

                  <h2 className="text-5xl font-bold text-slate-900">
                    {
                      savedAssessments.filter(
                        (a) => a.status === "Published"
                      ).length
                    }
                  </h2>

                </div>

              </div>


              {/* RECENT ACTIVITY */}
              <div className="mt-10">

                <RecentActivity
                  savedAssessments={savedAssessments}
                />

              </div>

            </div>

          )}


          {/* CREATE ASSESSMENT */}
          {activeSection === "Create Assessment" && (

            <div className="space-y-10">

              {/* BUILDER */}
              <div className="bg-white rounded-[30px] border border-slate-200 p-10 mb-12 shadow-sm">

                <div className="mb-10">

                  <h2 className="text-4xl font-bold text-slate-900">

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


                {/* QUESTIONS */}
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

              </div>


              {/* PREVIEW PANEL */}
              {showPreview && (

                <PreviewPanel
                  title={title}
                  questions={questions}
                />

              )}

            </div>

          )}


          {/* SEARCH BAR */}
          {(activeSection === "Drafts" ||
            activeSection === "Published") && (

            <div className="mb-8">

              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full md:w-[400px] border border-slate-200 bg-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition shadow-sm"
              />

            </div>

          )}


          {/* DRAFTS */}
          {activeSection === "Drafts" && (

            <div>

              <div className="mb-8">

                <h2 className="text-4xl font-bold text-slate-900 mb-3">
                  Draft Assessments
                </h2>

                <p className="text-slate-500 text-lg">
                  Continue editing previously saved drafts
                </p>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {savedAssessments
                  .filter(
                    (assessment) =>
                      assessment.status === "Draft" &&
                      assessment.title
                        .toLowerCase()
                        .includes(
                          searchTerm.toLowerCase()
                        )
                  )
                  .map((assessment) => (

                    <AssessmentCard
                      key={assessment._id}
                      assessment={assessment}
                      fetchAssessments={fetchAssessments}
                      setTitle={setTitle}
                      setQuestions={setQuestions}
                      setEditingAssessmentId={setEditingAssessmentId}
                      setActiveSection={setActiveSection}
                    />

                  ))}

              </div>

            </div>

          )}


          {/* PUBLISHED */}
          {activeSection === "Published" && (

            <div>

              <div className="mb-8">

                <h2 className="text-4xl font-bold text-slate-900 mb-3">
                  Published Assessments
                </h2>

                <p className="text-slate-500 text-lg">
                  Live assessments available for students
                </p>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {savedAssessments
                  .filter(
                    (assessment) =>
                      assessment.status === "Published" &&
                      assessment.title
                        .toLowerCase()
                        .includes(
                          searchTerm.toLowerCase()
                        )
                  )
                  .map((assessment) => (

                    <AssessmentCard
                      key={assessment._id}
                      assessment={assessment}
                      fetchAssessments={fetchAssessments}
                      setTitle={setTitle}
                      setQuestions={setQuestions}
                      setEditingAssessmentId={setEditingAssessmentId}
                      setActiveSection={setActiveSection}
                    />

                  ))}

              </div>

            </div>

          )}


          {/* ANALYTICS */}
          {activeSection === "Analytics" && (

            <div className="space-y-8">

              <AnalyticsChart
                savedAssessments={savedAssessments}
              />

            </div>

          )}

        </div>

      </div>

    </div>
  );
}