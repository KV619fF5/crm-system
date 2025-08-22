import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getLeads } from "../api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function LeadsByStatus() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLeads();
      const counts = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
      res.data.forEach((l) => { counts[l.status] = (counts[l.status] || 0) + 1; });
      setData(Object.keys(counts).map((k) => ({ name: k, value: counts[k] })));
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Leads by Status</h3>
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
