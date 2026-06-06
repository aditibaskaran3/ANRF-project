"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AssessmentReviewPage() {

    const params = useParams();
    const submissionId = params.submissionId;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [facultyMarks, setFacultyMarks] = useState({});
    const [editingMarks, setEditingMarks] = useState({});

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

    const finalizeEvaluation = async () => {
        try {
            for (const q of questions) {
                const facultyMark =
                    facultyMarks[q.question_id] ??
                    q.ai_marks;

                await fetch(
                    "http://localhost:8000/submission/save-correction",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            submission_id: submissionId,
                            question_id: q.question_id,
                            ai_marks: q.ai_marks,
                            faculty_marks: Number(facultyMark)
                        })
                    }
                );
            }
            alert("Evaluation Finalized Successfully");
        } catch (error) {
            console.error(error);
            alert("Error Saving Evaluation");
        }
    };

    const finalTotal = questions.reduce(
        (sum, q) =>
            sum +
            Number(
                facultyMarks[q.question_id] ??
                q.ai_marks ??
                0
            ),
        0
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fb] p-8">

            <h1 className="text-3xl font-bold text-slate-900 mb-8">
                Assessment Review
            </h1>

            {questions.map((q, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6"
                >
                    <div className="flex justify-between items-center border-b pb-4 mb-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Question {q.question_id}
                        </h2>
                        <div className="bg-[#071330] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                            Max Marks : {q.max_marks}
                        </div>
                    </div>

                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-800 mb-2">
                            Question
                        </h3>
                        <p className="text-slate-700 leading-7">
                            {q.question}
                        </p>
                    </div>

                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-800 mb-2">
                            Student Answer
                        </h3>
                        <p className="text-slate-700 leading-8 whitespace-pre-wrap">
                            {q.student_answer}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center gap-4 flex-wrap">

                            <span className="font-semibold text-slate-800">AI Marks</span>
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">
                                {q.ai_marks}
                            </span>
                            <span className="text-slate-500">/ {q.max_marks}</span>

                            {facultyMarks[q.question_id] && (
                                <>
                                    <span className="font-semibold text-slate-800 ml-4">Final Marks</span>
                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">
                                        {facultyMarks[q.question_id]}
                                    </span>
                                    <span className="text-slate-500">/ {q.max_marks}</span>
                                </>
                            )}

                            {!editingMarks[q.question_id] ? (
                                <button
                                    onClick={() =>
                                        setEditingMarks({
                                            ...editingMarks,
                                            [q.question_id]: true
                                        })
                                    }
                                    className="bg-[#1089d3] hover:bg-[#0d78bb] text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Edit Marks
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-slate-800">
                                        Faculty Marks
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={q.max_marks}
                                        value={facultyMarks[q.question_id] ?? q.ai_marks}
                                        onChange={(e) =>
                                            setFacultyMarks({
                                                ...facultyMarks,
                                                [q.question_id]: e.target.value
                                            })
                                        }
                                        className="border-2 border-slate-300 rounded-lg px-3 py-2 w-24 bg-white text-slate-900 font-semibold"
                                    />
                                    <button
                                        onClick={() =>
                                            setEditingMarks({
                                                ...editingMarks,
                                                [q.question_id]: false
                                            })
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                                    >
                                        Save
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            ))}

            <div className="bg-[#071330] text-white rounded-xl shadow p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-300">
                            Final Assessment Marks
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            {Math.round(finalTotal)}
                        </p>
                    </div>
                    <button
                        onClick={finalizeEvaluation}
                        className="bg-[#1089d3] hover:bg-[#0d78bb] text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Finalize Evaluation
                    </button>
                </div>
            </div>

        </div>
    );
}