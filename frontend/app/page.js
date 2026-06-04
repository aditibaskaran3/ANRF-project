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
import Select from "react-select";

export default function Home() {

  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activeSection, setActiveSection] = useState("Dashboard");

  const [title, setTitle] = useState("");

  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [year, setYear] = useState("All Years");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const departmentOptions = [
    "CS", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL"
  ];

  const yearOptions = ["1", "2", "3", "4"];

  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
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


  // UNSAVED CHANGES WARNING
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeSection === "Create Assessment" && title.trim()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeSection, title]);


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

    if (!parsedDraft.title && (!parsedDraft.questions || !parsedDraft.questions[0]?.question)) {
      return;
    }

    setTitle(parsedDraft.title || "");
    setSubjectCode(parsedDraft.subjectCode || "");
    setSubjectName(parsedDraft.subjectName || "");
    setExamDate(parsedDraft.examDate || "");
    setDuration(parsedDraft.duration || "");
    setInstructions(parsedDraft.instructions || "");
    setDepartment(parsedDraft.department || "All Departments");
    setYear(parsedDraft.year || "All Years");
    setAvailableFrom(parsedDraft.availableFrom || "");
    setAvailableTo(parsedDraft.availableTo || "");
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
        subjectCode,
        subjectName,
        examDate,
        duration,
        instructions,
        department,
        year,
        availableFrom,
        availableTo,
        questions
      })
    );

  }, [title, subjectCode, subjectName, examDate, duration, instructions, department, year, availableFrom, availableTo, questions]);


  // FETCH ASSESSMENTS
  useEffect(() => {

    fetchAssessments();

  }, []);


  const fetchAssessments = async () => {

    try {
      const facultyEmail = localStorage.getItem("userEmail");
      const response = await fetch(
        `http://localhost:8000/assessment/all/${facultyEmail}`
      );

      const data = await response.json();

      const sorted = [...data].sort((a, b) => {
        if (a._id < b._id) return 1;
        if (a._id > b._id) return -1;
        return 0;
      });

      setSavedAssessments(sorted);

    } catch (error) {

      console.error(error);
    }
  };


  // RESET ALL FIELDS
  const resetFields = () => {
    setTitle("");
    setSubjectCode("");
    setSubjectName("");
    setExamDate("");
    setDuration("");
    setInstructions("");
    setDepartment("All Departments");
    setYear("All Years");
    setSelectedDepartments([]);
    setSelectedYears([]);
    setAvailableFrom("");
    setAvailableTo("");
    setQuestions([{
      question: "",
      answer_key: "",
      rubric: "",
      marks: "",
      expected_length: ""
    }]);
    setEditingAssessmentId(null);
  };


  // CREATE NEW ASSESSMENT
  const createNewAssessment = () => {

    resetFields();

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


  // BUILD PAYLOAD
  const buildPayload = (status) => ({
    title,
    subjectCode,
    subjectName,
    examDate,
    duration,
    instructions,
    departments: selectedDepartments.map((dept) => dept.value),
    years: selectedYears.map((year) => year.value),
    availableFrom,
    availableTo,
    questions,
    id: editingAssessmentId,
    status,
    faculty_email: localStorage.getItem("userEmail")
  });


  // VALIDATE FIELDS
  const validateFields = () => {

    if (!title.trim()) {
      toast.error("Assessment title is required");
      return false;
    }

    for (let q of questions) {

      if (
  !q.question.trim() ||
  !q.answer_key.trim() ||
  !q.rubric.trim() ||
  !q.marks ||
  !q.expected_length.trim()
) {
  toast.error("Please fill all question fields");
  return false;
}

const marksVal = parseInt(q.marks);
if (isNaN(marksVal) || marksVal < 1 || marksVal > 100) {
  toast.error("Marks must be between 1 and 100");
  return false;
}
    }

    return true;
  };


  // SAVE ASSESSMENT
  const saveAssessment = async () => {

    if (!validateFields()) return;

    try {

      setSaving(true);

      const response = await fetch(
        "http://localhost:8000/assessment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(buildPayload("Draft"))
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast.success("Assessment saved successfully");

      resetFields();

      localStorage.removeItem("assessmentDraft");

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

    if (!validateFields()) return;

    try {

      setSaving(true);

      const response = await fetch(
        "http://localhost:8000/assessment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(buildPayload("Published"))
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Assessment published successfully");

      resetFields();

      localStorage.removeItem("assessmentDraft");

      fetchAssessments();

      setActiveSection("Published");

    } catch (error) {

      console.error(error);

      toast.error("Failed to publish assessment");

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
          activeSection={activeSection}
        />

        {/* PAGE CONTENT */}
        <div className="px-10 py-10">

          {/* DASHBOARD */}
          {activeSection === "Dashboard" && (

            <div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-[30px] p-7 border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm mb-2">Total Assessments</p>
                  <h2 className="text-5xl font-bold text-slate-900">
                    {savedAssessments.length}
                  </h2>
                </div>

                <div className="bg-white rounded-[30px] p-7 border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm mb-2">Draft Assessments</p>
                  <h2 className="text-5xl font-bold text-slate-900">
                    {savedAssessments.filter((a) => a.status === "Draft").length}
                  </h2>
                </div>

                <div className="bg-white rounded-[30px] p-7 border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm mb-2">Published Assessments</p>
                  <h2 className="text-5xl font-bold text-slate-900">
                    {savedAssessments.filter((a) => a.status === "Published").length}
                  </h2>
                </div>

              </div>

              <div className="mt-10">
                <RecentActivity savedAssessments={savedAssessments} />
              </div>

            </div>

          )}


          {/* CREATE ASSESSMENT */}
          {activeSection === "Create Assessment" && (

            <div className="space-y-10">

              <div className="bg-white rounded-[30px] border border-slate-200 p-10 mb-12 shadow-sm">

                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-slate-900">
                    {editingAssessmentId ? "Edit Assessment" : "Create Assessment"}
                  </h2>
                  <p className="text-slate-500 mt-3 text-lg">
                    Build professional assessments for students
                  </p>
                </div>

                {/* TITLE */}
                <div className="mb-8">
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

                {/* SUBJECT CODE & NAME */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Subject Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS301"
                      className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Database Management Systems"
                      className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                    />
                  </div>

                </div>

                {/* DEPARTMENT & YEAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Department
                    </label>
                    <Select
                      isMulti
                      options={[
                        { value: "CSE", label: "CSE" },
                        { value: "IT", label: "IT" },
                        { value: "AIDS", label: "AIDS" },
                        { value: "ECE", label: "ECE" },
                        { value: "EEE", label: "EEE" },
                        { value: "MECH", label: "MECH" },
                        { value: "CIVIL", label: "CIVIL" }
                      ]}
                      value={selectedDepartments}
                      onChange={setSelectedDepartments}
                      placeholder="Select Departments"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Year
                    </label>
                    <Select
                      isMulti
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" }
                      ]}
                      value={selectedYears}
                      onChange={setSelectedYears}
                      placeholder="Select Years"
                    />
                  </div>

                </div>

                {/* DATE & DURATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Date of Examination
                    </label>
                    <input
                      type="date"
                      className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition text-slate-700"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Total Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 90 Minutes"
                      className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                </div>

                {/* AVAILABLE FROM & TO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Available From
                    </label>
                    <input
                      type="datetime-local"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Available To
                    </label>
                    <input
                      type="datetime-local"
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                    />
                  </div>

                </div>

                {/* INSTRUCTIONS */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold text-slate-600 mb-4">
                    Exam Instructions
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Enter exam instructions for students"
                    className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition resize-none text-slate-700"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
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
                  subjectCode={subjectCode}
                  subjectName={subjectName}
                  examDate={examDate}
                  duration={duration}
                  department={selectedDepartments.map(d => d.value).join(", ") || "All Departments"}
                  year={selectedYears.map(y => y.value).join(", ") || "All Years"}
                  availableFrom={availableFrom}
                  availableTo={availableTo}
                  instructions={instructions}
                  questions={questions}
                />
              )}

            </div>

          )}


          {/* SEARCH BAR */}
          {(activeSection === "Drafts" || activeSection === "Published") && (
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                      setSubjectCode={setSubjectCode}
                      setSubjectName={setSubjectName}
                      setExamDate={setExamDate}
                      setDuration={setDuration}
                      setInstructions={setInstructions}
                      setSelectedDepartments={setSelectedDepartments}
                      setSelectedYears={setSelectedYears}
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
                      assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                      setSubjectCode={setSubjectCode}
                      setSubjectName={setSubjectName}
                      setExamDate={setExamDate}
                      setDuration={setDuration}
                      setInstructions={setInstructions}
                      setSelectedDepartments={setSelectedDepartments}
                      setSelectedYears={setSelectedYears}
                    />
                  ))}
              </div>

            </div>

          )}


          {/* ANALYTICS */}
          {activeSection === "Analytics" && (

            <div className="space-y-8">
              <AnalyticsChart savedAssessments={savedAssessments} />
            </div>

          )}

        </div>

      </div>

    </div>
  );
}