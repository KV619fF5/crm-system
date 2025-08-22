import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const activeClass = "bg-blue-600 text-white rounded-lg";

  return (
    <div className="w-60 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold mb-8">CRM System</h2>
      <ul className="space-y-3">
        <li>
          <Link
            to="/"
            className={`block px-4 py-2 hover:bg-gray-700 rounded-lg ${
              location.pathname === "/" ? activeClass : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/customers"
            className={`block px-4 py-2 hover:bg-gray-700 rounded-lg ${
              location.pathname === "/customers" ? activeClass : ""
            }`}
          >
            Customers
          </Link>
        </li>
        <li>
          <Link
            to="/activities"
            className={`block px-4 py-2 hover:bg-gray-700 rounded-lg ${
              location.pathname === "/activities" ? activeClass : ""
            }`}
          >
            Activities
          </Link>
        </li>
        <li>
          <Link
            to="/leads"
            className={`block px-4 py-2 hover:bg-gray-700 rounded-lg ${
              location.pathname === "/leads" ? activeClass : ""
            }`}
          >
            Leads
          </Link>
        </li>
        <li>
          <Link
            to="/deals"
            className={`block px-4 py-2 hover:bg-gray-700 rounded-lg ${
              location.pathname === "/deals" ? activeClass : ""
            }`}
          >
            Deals
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
