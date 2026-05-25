"use client";

export default function PreviewPanel({
  title,
  questions
}) {

  return (

    <div className="bg-white rounded-[30px] border border-slate-200 p-10 shadow-sm">

      {/* HEADER */}
      <div className="mb-10 border-b border-slate-200 pb-6">

        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          {title || "Untitled Assessment"}
        </h1>

        <p className="text-slate-500 text-lg">
          Faculty Assessment Preview
        </p>

      </div>


      {/* QUESTIONS */}
      <div className="space-y-8">

        {questions.map((q, index) => (

          <div
            key={index}
            className="border border-slate-200 rounded-2xl p-7 bg-slate-50"
          >

            {/* QUESTION */}
            <div className="mb-6">

              <div className="flex items-center justify-between mb-3">

                <h2 className="text-2xl font-bold text-slate-900">
                  Question {index + 1}
                </h2>

                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  {q.marks || 0} Marks
                </div>

              </div>

              <p className="text-slate-700 text-lg leading-relaxed">
                {q.question || "No question added"}
              </p>

            </div>


            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-white rounded-xl p-5 border border-slate-200">

                <h3 className="font-semibold text-slate-900 mb-2">
                  Expected Answer
                </h3>

                <p className="text-slate-600">
                  {q.answer_key || "Not added"}
                </p>

              </div>


              <div className="bg-white rounded-xl p-5 border border-slate-200">

                <h3 className="font-semibold text-slate-900 mb-2">
                  Rubric
                </h3>

                <p className="text-slate-600">
                  {q.rubric || "Not added"}
                </p>

              </div>


              <div className="bg-white rounded-xl p-5 border border-slate-200 md:col-span-2">

                <h3 className="font-semibold text-slate-900 mb-2">
                  Expected Length
                </h3>

                <p className="text-slate-600">
                  {q.expected_length || "Not specified"}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}