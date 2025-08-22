import { useState, useEffect } from "react";
import { getActivities, createActivity, updateActivity, deleteActivity, getCustomers } from "../api";

export default function Activities() {
  const empty = { id: null, customer_id: "", activity: "", status: "Pending" };
  const [activities, setActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [actsRes, custsRes] = await Promise.all([getActivities(), getCustomers()]);
    setActivities(actsRes.data); // <-- access .data
    setCustomers(custsRes.data); // <-- access .data
  };

  const submit = async () => {
    if (!form.customer_id || !form.activity) return alert("Customer and Activity required");

    if (form.id) {
      await updateActivity(form.id, form); // <-- pass id and data
    } else {
      await createActivity(form); // <-- renamed from addActivity
    }
    setForm(empty);
    load();
  };

  const edit = (a) => setForm({ ...a });
  const remove = async (id) => {
    if (window.confirm("Delete this activity?")) {
      await deleteActivity(id);
      load();
    }
  };

  // Lookup for displaying customer name
  const nameById = Object.fromEntries(customers.map(c => [c.id, c.name]));
  const withNames = activities.map(a => ({ ...a, customerName: nameById[a.customer_id] || `#${a.customer_id}` }));

  const filtered = withNames.filter(
    (a) =>
      (a.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.status || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.activity || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">{form.id ? "Edit Activity" : "Add Activity"}</h2>
      <div className="flex flex-wrap gap-2 mb-5">
        <select className="border p-2" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: Number(e.target.value) })}>
          <option value="">Select Customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="border p-2" placeholder="Activity" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })}/>
        <select className="border p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Pending</option>
          <option>Completed</option>
          <option>Follow-up</option>
        </select>
        <button onClick={submit} className="bg-green-500 text-white px-4 py-2 rounded">{form.id ? "Update" : "Add"}</button>
        {form.id && (
          <button onClick={() => setForm(empty)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-3">Activities</h2>
      <input className="border p-2 mb-3 w-full" placeholder="Search by customer, status, activity" value={search} onChange={(e) => setSearch(e.target.value)} />

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-3 py-2">Customer</th>
            <th className="border px-3 py-2">Activity</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? filtered.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{a.customerName}</td>
              <td className="border px-3 py-2">{a.activity}</td>
              <td className="border px-3 py-2">{a.status}</td>
              <td className="border px-3 py-2 space-x-2">
                <button onClick={() => edit(a)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => remove(a.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={4} className="border text-center p-4">No activities found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
