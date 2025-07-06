"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Lock,
  LockOpen,
  Globe,
  UserCircle,
  CopySimple,
  CircleNotch,
} from "phosphor-react";
import createRequest from "@/utils/createRequest";

export default function Dashboard() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ customer: "", email: "" });

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const res = await createRequest.get("/api/license/licenses");
      setLicenses(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching licenses:", error);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleGenerate = async () => {
    if (!form.customer || !form.email) {
      return alert("Please fill in the customer name and email fields.");
    }

    try {
      setGenerating(true);
      await createRequest.post("/api/license/generate", form);
      setForm({ customer: "", email: "" });
      await fetchLicenses();
    } catch (error) {
      console.error("Error generating license:", error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleActivation = async (key, isActive) => {
    const endpoint = isActive ? "deactivate" : "activate";

    const confirmMsg = isActive
      ? "Are you sure you want to deactivate this license?"
      : "Are you sure you want to activate this license?";

    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await createRequest.post(`/api/license/${endpoint}`, {
        key,
        domain: "example.com",
      });
      await fetchLicenses();
    } catch (error) {
      console.error("Error toggling activation:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = licenses.filter(
    (l) =>
      l.key.toLowerCase().includes(search) ||
      (l.email && l.email.toLowerCase().includes(search))
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-r-[#e4e4e4] hidden md:block">
        <div className="p-6 font-bold text-xl">Curift Themes</div>
        <nav className="px-6">
          <ul className="space-y-4 mt-8 text-sm">
            <li className="text-gray-600 font-medium cursor-pointer hover:text-gray-800">
              Manage Licenses
            </li>
            <li className="text-gray-600 font-medium cursor-pointer hover:text-gray-800">
              Support
            </li>
            <li className="text-gray-600 font-medium cursor-pointer hover:text-gray-800">
              Notice
            </li>
            {/* Add more nav items if needed */}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 bg-gray-50">
        {/* Topbar */}
        <header className="bg-white border-b border-b-[#e4e4e4] px-6 py-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Manage Licenses</h1>
        </header>

        {/* Main Content */}
        <main className="p-6 mt-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">New License</h2>
              <div className="flex flex-col md:flex-row gap-4 pb-2">
                <input
                  type="text"
                  className="border px-4 py-2 rounded-md w-full border-[#e4e4e4]"
                  placeholder="Customer Name"
                  value={form.customer}
                  onChange={(e) =>
                    setForm({ ...form, customer: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="border px-4 py-2 rounded-md w-full border-[#e4e4e4]"
                  placeholder="Customer Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <CircleNotch size={20} className="animate-spin" />
                  ) : (
                    <Plus size={20} />
                  )}
                  Generate
                </button>
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold mb-4">
                  Purchased Licenses
                </h2>

                <input
                  type="text"
                  placeholder="Search by key or email..."
                  className="border px-4 py-2 rounded-md w-full md:w-1/2 mb-4 border-[#e4e4e4]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-b-[#e4e4e4] text-sm text-gray-500">
                      <th className="py-2 font-normal">Key</th>
                      <th className="py-2 font-normal">Customer</th>
                      <th className="py-2 font-normal">Email</th>
                      <th className="py-2 font-normal">Domain</th>
                      <th className="py-2 font-normal">Status</th>
                      <th className="py-2 text-center font-normal">Activate</th>
                    </tr>
                  </thead>
                  <tbody className="pb-2">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 text-center text-blue-500"
                        >
                          <CircleNotch size={30} className="animate-spin" />
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-400"
                        >
                          No licenses found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((license) => (
                        <tr
                          key={license.key}
                          className="border-b border-b-[#e4e4e4] hover:bg-gray-50"
                        >
                          <td className="py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span>{license.key}</span>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(license.key)
                                }
                                className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                title="Copy to clipboard"
                              >
                                <CopySimple size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="py-2 text-sm flex items-center gap-2 text-gray-500">
                            <UserCircle size={18} />
                            {license.customer || "—"}
                          </td>
                          <td className="py-2 text-sm text-gray-500">
                            {license.email || "—"}
                          </td>
                          <td className="py-2 text-sm flex items-center gap-1 text-blue-700">
                            <Globe size={16} />
                            {license.domain || "—"}
                          </td>
                          <td className="py-2 text-sm text-center">
                            {license.isActive ? (
                              <span className="p-0 m-0 text-green-600 font-medium">
                                Active
                              </span>
                            ) : (
                              <span className="p-0 m-0 text-gray-500">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-center">
                            <button
                              onClick={() =>
                                toggleActivation(license.key, license.isActive)
                              }
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              {license.isActive ? (
                                <LockOpen size={18} />
                              ) : (
                                <Lock size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
