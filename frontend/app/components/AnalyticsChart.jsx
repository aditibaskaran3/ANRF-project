"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
export default function AnalyticsChart({
  savedAssessments
}) {

  const draftCount = savedAssessments.filter(
    (a) => a.status === "Draft"
  ).length;

  const publishedCount = savedAssessments.filter(
    (a) => a.status === "Published"
  ).length;


  const data = [
    {
      name: "Drafts",
      value: draftCount
    },
    {
      name: "Published",
      value: publishedCount
    }
  ];


  const COLORS = [
    "#64748b",
    "#0f172a"
  ];


  return (

    <div className="bg-white rounded-[30px] border border-slate-200 p-8 shadow-sm">

      <div className="mb-6">

        <h2 className="text-3xl font-bold text-slate-900">
          Assessment Analytics
        </h2>

        <p className="text-slate-500 mt-2">
          Draft vs Published overview
        </p>

      </div>


      <div className="w-full h-[350px]">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              innerRadius={70}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />
<Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}
