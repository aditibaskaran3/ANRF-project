export default function Navbar({
  saveAssessment,
  showPreview,
  setShowPreview,
  createNewAssessment
}) {

  return (

    <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200 px-8 py-4 flex items-center justify-between">

      {/* LEFT */}
      <div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Faculty Dashboard
        </h1>

        <p className="text-slate-500 mt-1 text-sm">
          Manage assessments and drafts
        </p>

      </div>


      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* SEARCH */}
        <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 w-[220px]">

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-sm"
          />

        </div>


        {/* NEW */}
        <button
          onClick={createNewAssessment}
          className="bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition px-4 py-2 rounded-xl font-medium text-sm"
        >
          New
        </button>


        {/* PREVIEW */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition px-4 py-2 rounded-xl font-medium text-sm"
        >
          Preview
        </button>


        {/* SAVE */}
        <button
          onClick={saveAssessment}
          className="bg-sky-600 hover:bg-sky-700 transition text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-sm"
        >
          Save
        </button>


        {/* PROFILE */}
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">

          F

        </div>

      </div>

    </div>
  );
}