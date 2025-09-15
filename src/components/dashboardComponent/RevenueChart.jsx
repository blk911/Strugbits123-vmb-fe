
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SelectField from "./SelectField";

const data = [
  { day: "Mon", revenue: 900 },
  { day: "Tue", revenue: 1230 },
  { day: "Wed", revenue: 1020 },
  { day: "Thu", revenue: 1500 },
  { day: "Fri", revenue: 1430 },
  { day: "Sat", revenue: 1100 },
  { day: "Sun", revenue: 1500 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#6d013a]"> <span
          className="max-xl:text-[18px] text-[#581838] xl:text-[21px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Revenue Overviews
        </span></h2>
        <SelectField option={["Last 7 days", "Last 6 days", "Last 5 days"]} classes="!w-[144px] !text-[#000000] !rounded-[8px]" icon={<svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.276045 0.651943C0.447956 0.486547 0.678499 0.396169 0.917013 0.400669C1.15553 0.405169 1.3825 0.50418 1.54805 0.675943L6.00005 5.40154L10.452 0.675943C10.533 0.58673 10.631 0.514667 10.7403 0.464026C10.8495 0.413385 10.9679 0.385196 11.0883 0.381129C11.2086 0.377061 11.3286 0.397198 11.4411 0.440347C11.5535 0.483496 11.6562 0.548779 11.7429 0.632327C11.8297 0.715875 11.8988 0.815988 11.9462 0.926734C11.9935 1.03748 12.0182 1.15661 12.0187 1.27705C12.0191 1.3975 11.9954 1.51682 11.9489 1.62794C11.9025 1.73905 11.8341 1.83971 11.748 1.92394L6.64805 7.32394C6.56409 7.41105 6.46344 7.48033 6.3521 7.52765C6.24076 7.57498 6.12102 7.59937 6.00005 7.59937C5.87907 7.59937 5.75933 7.57498 5.64799 7.52765C5.53665 7.48033 5.436 7.41105 5.35205 7.32394L0.252045 1.92394C0.086649 1.75203 -0.00372955 1.52149 0.000770709 1.28298C0.00527097 1.04446 0.104282 0.817492 0.276045 0.651943Z" fill="black" />
        </svg>
        } label={false} />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
          {/* Axes */}
          <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} padding={{ left: 20, right: 20 }} />
          <YAxis axisLine={false} tickLine={false} tickMargin={10} />

          {/* Tooltip */}
          <CartesianGrid
            stroke="#e5e7eb" // light gray
            vertical={false} // hide vertical lines
            strokeDasharray="0" // solid lines (not dotted)
          />

          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              background: "white",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
            }}
          />

          {/* Line with gradient */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7aa6" stopOpacity={1} />
              <stop offset="100%" stopColor="#6d013a" stopOpacity={1} />
            </linearGradient>
          </defs>

          <Line
            type="linear"
            dataKey="revenue"
            stroke="url(#colorRevenue)"
            strokeWidth={3}
            dot={{ r: 6, fill: "#ff7aa6", stroke: "#6d013a", strokeWidth: 2 }}
            activeDot={{ r: 8, fill: "#ff7aa6", stroke: "#6d013a", strokeWidth: 2 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
