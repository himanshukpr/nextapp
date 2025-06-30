"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/test");
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field1, field2 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error + (json.details && json.details.message ? ": " + json.details.message : ""));
        return;
      }
      setField1("");
      setField2("");
      fetchData();
    } catch (err) {
      setError("Failed to submit data");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      const res = await fetch(`/api/test?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error + (json.details && json.details.message ? ": " + json.details.message : ""));
        return;
      }
      fetchData();
    } catch (err) {
      setError("Failed to delete data");
    }
  };

  const [editId, setEditId] = useState(null);
  const [editField1, setEditField1] = useState("");
  const [editField2, setEditField2] = useState("");

  const startEdit = (row) => {
    setEditId(row.id);
    setEditField1(row.field1);
    setEditField2(row.field2);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditField1("");
    setEditField2("");
  };

  const handleEdit = async (id) => {
    setError("");
    try {
      const res = await fetch(`/api/test?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field1: editField1, field2: editField2 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error + (json.details && json.details.message ? ": " + json.details.message : ""));
        return;
      }
      cancelEdit();
      fetchData();
    } catch (err) {
      setError("Failed to update data");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1>This is just the delpoying test</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Field 1"
            value={field1}
            onChange={e => setField1(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Field 2"
            value={field2}
            onChange={e => setField2(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Submit</button>
        </div>
      </form>
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Field 1</th>
                <th className="py-2 px-4 text-left">Field 2</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map(row => (
                  <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-4">{row.id}</td>
                    <td className="py-2 px-4">
                      {editId === row.id ? (
                        <input value={editField1} onChange={e => setEditField1(e.target.value)} className="px-2 py-1 border border-gray-300 rounded w-full" />
                      ) : (
                        row.field1
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editId === row.id ? (
                        <input value={editField2} onChange={e => setEditField2(e.target.value)} className="px-2 py-1 border border-gray-300 rounded w-full" />
                      ) : (
                        row.field2
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editId === row.id ? (
                        <>
                          <button onClick={() => handleEdit(row.id)} className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">Save</button>
                          <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(row)} className="mr-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">Edit</button>
                          <button onClick={() => handleDelete(row.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="py-4 text-center text-gray-400">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
