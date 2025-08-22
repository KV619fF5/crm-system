import React, { useState, useEffect } from "react";
import axios from "axios";

function Deals() {
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState({
    deal_name: "",
    value: "",
    stage: "Negotiation",
    customer_id: ""
  });
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the deal being edited

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/deals/");
      setDeals(res.data);
    } catch (err) {
      console.error("Error fetching deals:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/customers/");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deal_name || !form.value || !form.customer_id) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      deal_name: form.deal_name,
      value: parseFloat(form.value),
      stage: form.stage,
      customer_id: parseInt(form.customer_id)
    };

    try {
      if (editingId) {
        // Edit existing deal
        await axios.put(`http://127.0.0.1:8000/deals/${editingId}`, payload);
        setEditingId(null);
      } else {
        // Add new deal
        await axios.post("http://127.0.0.1:8000/deals/", payload);
      }
      setForm({ deal_name: "", value: "", stage: "Negotiation", customer_id: "" });
      fetchDeals();
    } catch (err) {
      console.error("Failed to submit deal:", err.response?.data || err.message);
      alert("Failed to submit deal. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/deals/${id}`);
      fetchDeals();
    } catch (err) {
      console.error("Failed to delete deal:", err.response?.data || err.message);
      alert("Failed to delete deal. Check console for details.");
    }
  };

  const handleEdit = (deal) => {
    setForm({
      deal_name: deal.deal_name,
      value: deal.value,
      stage: deal.stage,
      customer_id: deal.customer_id
    });
    setEditingId(deal.id);
  };

  const handleCancelEdit = () => {
    setForm({ deal_name: "", value: "", stage: "Negotiation", customer_id: "" });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Deals</h2>

      {/* Add/Edit Deal Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-white p-4 rounded-xl shadow"
      >
        <input
          type="text"
          placeholder="Deal Name"
          value={form.deal_name}
          onChange={(e) => setForm({ ...form, deal_name: e.target.value })}
          className="border p-2 rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="border p-2 rounded-lg"
          required
        />
        <select
          value={form.stage}
          onChange={(e) => setForm({ ...form, stage: e.target.value })}
          className="border p-2 rounded-lg"
        >
          <option value="Negotiation">Negotiation</option>
          <option value="Proposal">Proposal</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
        </select>
        <select
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          className="border p-2 rounded-lg"
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editingId ? "Update Deal" : "Add Deal"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Deals Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Deal Name</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
            <th className="border border-gray-300 px-4 py-2">Stage</th>
            <th className="border border-gray-300 px-4 py-2">Customer</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.length ? (
            deals.map((d) => (
              <tr key={d.id}>
                <td className="border border-gray-300 px-4 py-2">{d.id}</td>
                <td className="border border-gray-300 px-4 py-2">{d.deal_name}</td>
                <td className="border border-gray-300 px-4 py-2">${d.value}</td>
                <td className="border border-gray-300 px-4 py-2">{d.stage}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {customers.find((c) => c.id === d.customer_id)?.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No deals yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Deals;
