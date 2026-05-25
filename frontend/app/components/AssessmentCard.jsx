export default function AssessmentCard({
  assessment,
  onEdit,
  onDelete
}) {

  return (

    <div className="bg-white rounded-[28px] p-7 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition duration-300 group">

      {/* TOP */}
      <div className="flex items-start justify-between mb-6">

        <div>

          <div className="flex items-center gap-3 mb-3">

            <div className="w-3 h-3 rounded-full bg-sky-600" />

            <span className="text-sm font-semibold text-sky-600">
              Draft Assessment
            </span>

          </div>


          <h2 className="text-2xl font-bold text-slate-900 leading-tight">

            {assessment.title}

          </h2>

        </div>


        {/* DELETE */}
        <button
          onClick={onDelete}
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm"
        >
          ×
        </button>

      </div>


      {/* DETAILS */}
      <div className="space-y-4 mb-7">

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Questions
          </span>

          <span className="font-semibold text-slate-800">
            {assessment.questions?.length || 0}
          </span>

        </div>


        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Status
          </span>

          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-medium text-xs">
            Draft
          </span>

        </div>

      </div>


      {/* ACTION */}
      <button
        onClick={onEdit}
        className="w-full bg-slate-900 hover:bg-sky-600 transition text-white py-3 rounded-xl font-semibold text-sm"
      >
        Continue Editing
      </button>

    </div>
  );
}