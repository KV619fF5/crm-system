import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers, getActivities, getLeads, getDeals } from "../api";
import LeadsByStatus from "./LeadsByStatus";
import DealsByStage from "./DealsByStage";

export default function Dashboard({ setUser }) {
  const [customerCount, setCustomerCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [dealCount, setDealCount] = useState(0);
  const [user, setLocalUser] = useState({ name: "User" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [c, a, l, d] = await Promise.all([
          getCustomers(),
          getActivities(),
          getLeads(),
          getDeals(),
        ]);
        setCustomerCount(c.data.length || 0);
        setActivityCount(a.data.length || 0);
        setLeadCount(l.data.length || 0);
        setDealCount(d.data.length || 0);
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      }
    };
    fetchCounts();

    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) setLocalUser({ name: storedUser.username });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser && setUser(null);  // Update App.jsx state
    navigate("/login");         // Redirect immediately
  };

  const Card = ({ title, value, from, to, hoverShadow, onClick }) => (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl text-white shadow-lg transform transition duration-300 cursor-pointer
        bg-gradient-to-r ${from} ${to} hover:scale-105 ${hoverShadow}`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&rounded=true`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          {/* Username */}
          <span className="font-semibold">{user.name}</span>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Customers"
          value={customerCount}
          from="from-blue-500"
          to="to-blue-600"
          hoverShadow="hover:shadow-[0_0_24px_rgba(59,130,246,0.8)]"
          onClick={() => navigate("/customers")}
        />
        <Card
          title="Activities"
          value={activityCount}
          from="from-green-500"
          to="to-green-600"
          hoverShadow="hover:shadow-[0_0_24px_rgba(34,197,94,0.8)]"
          onClick={() => navigate("/activities")}
        />
        <Card
          title="Leads"
          value={leadCount}
          from="from-purple-500"
          to="to-purple-600"
          hoverShadow="hover:shadow-[0_0_24px_rgba(168,85,247,0.8)]"
          onClick={() => navigate("/leads")}
        />
        <Card
          title="Deals"
          value={dealCount}
          from="from-pink-500"
          to="to-pink-600"
          hoverShadow="hover:shadow-[0_0_24px_rgba(236,72,153,0.8)]"
          onClick={() => navigate("/deals")}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LeadsByStatus />
        <DealsByStage />
      </div>
    </div>
  );
}
