import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyActivityChart({
  data,
  weeklyActivity,
}: {
  data: any[];
  weeklyActivity: any;
}) {
  return (
    <div className="w-full h-72 border-2 border-gray-700 bg-gray-800 rounded-lg p-4 mt-5">
      <h3
        className="text-1xl lg:text-2xl font-bold text-white"
        style={{ fontFamily: "chapFont" }}
      >
        Actividad semanal:{" "}
        {weeklyActivity?.week_range
          ? `${weeklyActivity.week_range.start} - ${weeklyActivity.week_range.end}`
          : ""}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              border: "none",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar
            dataKey="walked_minutes"
            fill="#14b8a6"
            name="Minutos caminados"
          />
          <Bar dataKey="sleep_hours" fill="#6366f1" name="Horas de sueño" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
