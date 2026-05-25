export default function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {

  return (

    <>

      {/* OVERLAY */}
      {sidebarOpen && (

        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        />

      )}


      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen bg-slate-900 text-white z-50 transition-all duration-300 flex flex-col justify-between p-5

        ${sidebarOpen
          ? "w-[240px] translate-x-0"
          : "w-[80px] -translate-x-full lg:translate-x-0 lg:w-[80px]"
        }`}
      >

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="flex items-center justify-between mb-10">

            {sidebarOpen && (

              <div>

                <h1 className="text-2xl font-bold tracking-tight">
                  AssessPro
                </h1>

                <p className="text-slate-400 text-xs mt-1">
                  Faculty Platform
                </p>

              </div>

            )}


            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-slate-800 hover:bg-slate-700 transition w-9 h-9 rounded-xl flex items-center justify-center text-sm"
            >
              ☰
            </button>

          </div>


          {/* NAVIGATION */}
          <div className="space-y-2">

            <button className="w-full flex items-center gap-3 bg-sky-600 hover:bg-sky-700 transition px-4 py-3 rounded-xl">

              <div className="w-2 h-2 rounded-full bg-white" />

              {sidebarOpen && (
                <span className="font-medium text-sm">
                  Dashboard
                </span>
              )}

            </button>


            <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition px-4 py-3 rounded-xl">

              <div className="w-2 h-2 rounded-full bg-slate-400" />

              {sidebarOpen && (
                <span className="text-sm">
                  Create Assessment
                </span>
              )}

            </button>


            <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition px-4 py-3 rounded-xl">

              <div className="w-2 h-2 rounded-full bg-slate-400" />

              {sidebarOpen && (
                <span className="text-sm">
                  Drafts
                </span>
              )}

            </button>


            <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition px-4 py-3 rounded-xl">

              <div className="w-2 h-2 rounded-full bg-slate-400" />

              {sidebarOpen && (
                <span className="text-sm">
                  Published
                </span>
              )}

            </button>


            <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition px-4 py-3 rounded-xl">

              <div className="w-2 h-2 rounded-full bg-slate-400" />

              {sidebarOpen && (
                <span className="text-sm">
                  Analytics
                </span>
              )}

            </button>

          </div>

        </div>


        {/* PROFILE */}
        <div className="border-t border-slate-800 pt-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold text-sm">
              F
            </div>


            {sidebarOpen && (

              <div>

                <h3 className="font-semibold text-sm">
                  Faculty
                </h3>

                <p className="text-xs text-slate-400">
                  Admin Access
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </>
  );
}