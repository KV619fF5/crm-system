import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getDeals } from "../api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DealsByStage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDeals();
      const counts = { "Negotiation": 0, "Proposal": 0, "Closed Won": 0, "Closed Lost": 0 };
      res.data.forEach((d) => { counts[d.stage] = (counts[d.stage] || 0) + 1; });
      setData(Object.keys(counts).map((k) => ({ name: k, value: counts[k] })));
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Deals by Stage</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
