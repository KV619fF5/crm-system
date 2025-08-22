import { useEffect, useState } from "react";
import { getLeads, createLead, updateLead, deleteLead } from "../api";

export default function Leads() {
  const empty = { id: null, name: "", email: "", phone: "", source: "", status: "New", notes: "" };
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getLeads();
      setLeads(res.data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeads([]);
    }
  };

  const submit = async () => {
    if (!form.name) return alert("Name required");
    try {
      if (form.id) await updateLead(form.id, form);
      else await createLead(form);
      setForm(empty);
      load();
    } catch (err) {
      console.error("Error saving lead:", err);
    }
  };

  const edit = (l) => setForm({ ...l });
  const remove = async (id) => {
    if (window.confirm("Delete this lead?")) {
      try {
        await deleteLead(id);
        load();
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }
  };

  const filtered = Array.isArray(leads)
    ? leads.filter(
        (l) =>
          (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (l.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (l.source || "").toLowerCase().includes(search.toLowerCase()) ||
          (l.status || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">{form.id ? "Edit Lead" : "Add Lead"}</h2>
      <div className="flex flex-wrap gap-2 mb-5">
        <input className="border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <input className="border p-2" placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input className="border p-2" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
        <input className="border p-2" placeholder="Source" value={form.source || ""} onChange={(e) => setForm({ ...form, source: e.target.value })}/>
        <select className="border p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
        </select>
        <input className="border p-2" placeholder="Notes" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })}/>
        <button onClick={submit} className="bg-green-500 text-white px-4 py-2 rounded">{form.id ? "Update" : "Add"}</button>
        {form.id && (
          <button onClick={() => setForm(empty)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-3">Leads</h2>
      <input className="border p-2 mb-3 w-full" placeholder="Search name, email, source, status" value={search} onChange={(e) => setSearch(e.target.value)} />

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Source</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Notes</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? filtered.map((l) => (
            <tr key={l.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{l.name}</td>
              <td className="border px-3 py-2">{l.email}</td>
              <td className="border px-3 py-2">{l.phone}</td>
              <td className="border px-3 py-2">{l.source}</td>
              <td className="border px-3 py-2">{l.status}</td>
              <td className="border px-3 py-2">{l.notes}</td>
              <td className="border px-3 py-2 space-x-2">
                <button onClick={() => edit(l)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => remove(l.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={7} className="border text-center p-4">No leads found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
