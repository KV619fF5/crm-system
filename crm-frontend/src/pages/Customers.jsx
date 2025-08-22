import { useState, useEffect } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api";

export default function Customers() {
  const empty = { id: null, name: "", email: "", phone: "", company: "", notes: "" };
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getCustomers();
    setCustomers(res.data); // <-- make sure to access `res.data` from axios
  };

  const submit = async () => {
    if (!form.name || !form.email) return alert("Name and Email required");

    if (form.id) {
      await updateCustomer(form.id, form); // <-- pass id and data
    } else {
      await createCustomer(form); // <-- renamed from addCustomer
    }
    setForm(empty);
    load();
  };

  const edit = (c) => setForm({ ...c });
  const remove = async (id) => {
    if (window.confirm("Delete this customer?")) {
      await deleteCustomer(id);
      load();
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">{form.id ? "Edit Customer" : "Add Customer"}</h2>
      <div className="flex flex-wrap gap-2 mb-5">
        <input className="border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <input className="border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input className="border p-2" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
        <input className="border p-2" placeholder="Company" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })}/>
        <input className="border p-2" placeholder="Notes" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })}/>
        <button onClick={submit} className="bg-green-500 text-white px-4 py-2 rounded">{form.id ? "Update" : "Add"}</button>
        {form.id && (
          <button onClick={() => setForm(empty)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-3">Customers</h2>
      <input className="border p-2 mb-3 w-full" placeholder="Search by name, email, company" value={search} onChange={(e) => setSearch(e.target.value)} />

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Company</th>
            <th className="border px-3 py-2">Notes</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? filtered.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{c.name}</td>
              <td className="border px-3 py-2">{c.email}</td>
              <td className="border px-3 py-2">{c.phone}</td>
              <td className="border px-3 py-2">{c.company}</td>
              <td className="border px-3 py-2">{c.notes}</td>
              <td className="border px-3 py-2 space-x-2">
                <button onClick={() => edit(c)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => remove(c.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={6} className="border text-center p-4">No customers found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
