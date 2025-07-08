"use client";
import { useEffect, useState } from "react";
import {
  Check,
  Lock,
  LockOpen,
  Globe,
  UserCircle,
  CopySimple,
  CircleNotch,
  CheckCircle,
} from "phosphor-react";
import createRequest from "@/utils/createRequest";

export default function Dashboard() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ code: "", domain: "" });
  const [copied, setCopied] = useState(false);

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // revert after 2s
    });
  };

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const res = await createRequest.get("/api/license/all");
      setLicenses(res.data);
      console.log("Fetched licenses:", res.data);
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
    if (!form.code || !form.domain) {
      return alert("Please fill in the code and domain.");
    }

    try {
      setGenerating(true);
      await createRequest.post(
        `/api/license/activate?code=${form.code}&domain=${form.domain}`
      );
      setForm({ code: "", domain: "" });
      await fetchLicenses();
    } catch (error) {
      console.error("Error generating license:", error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleActivation = async (key, domain, isActive) => {
    const endpoint = isActive ? "deactivate" : "reactivate";

    const confirmMsg = isActive
      ? "Are you sure you want to deactivate this license?"
      : "Are you sure you want to activate this license?";

    if (!confirm(confirmMsg)) return;
    const code = key;
    try {
      setLoading(true);
      if (isActive) {
        await createRequest.post(
          `/api/license/${endpoint}?code=${code}&domain=${domain}`
        );
      } else {
        await createRequest.get(
          `/api/license/${endpoint}?code=${code}&domain=${domain}`
        );
      }
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
    <div className="w-full flex">
      {/* Main Content */}
      <div className="w-full p-6 mt-4">
        <div className="w-full mx-auto space-y-8">
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Activate License</h2>
            <div className="flex flex-col md:flex-row gap-4 pb-2">
              <input
                type="text"
                className="border px-4 py-2 rounded-md w-full border-[#e4e4e4]"
                placeholder="license key"
                value={form.code}
                required
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              <input
                type="text"
                className="border px-4 py-2 rounded-md w-full border-[#e4e4e4]"
                placeholder="domain"
                value={form.domain}
                required
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
              />
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex flex-row justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <CircleNotch size={20} className="animate-spin" />
                ) : (
                  <Check size={20} />
                )}
                Activate
              </button>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Purchased Licenses
              </h2>

              <input
                type="text"
                placeholder="Search by key or email..."
                className="border px-4 py-2 rounded-md w-full sm:w-1/2 border-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2 font-medium">Key</th>
                    <th className="py-2 font-medium">Customer</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Domain</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-blue-500"
                      >
                        <CircleNotch
                          size={30}
                          className="animate-spin mx-auto"
                        />
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-400"
                      >
                        No licenses found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((license) => (
                      <tr
                        key={license.key}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-2 text-gray-800">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-lg cursor-pointer underline hover:text-gray-600"
                              onClick={() =>
                                (window.location.href = `/dashboard/license/${license.key}`)
                              }
                            >
                              {license.key}
                            </span>
                            <button
                              onClick={() => handleCopy(license.key)}
                              className={`transition-colors duration-200 cursor-pointer ${
                                copied
                                  ? "text-green-500"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                              title={copied ? "Copied!" : "Copy to clipboard"}
                            >
                              {copied ? (
                                <CheckCircle size={20} />
                              ) : (
                                <CopySimple size={20} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-2 text-gray-600 flex items-center gap-2">
                          <UserCircle size={18} />
                          {license.customer || "—"}
                        </td>
                        <td className="py-2 text-gray-600">
                          {license.type || "—"}
                          <div className="text-xs text-gray-500">
                            Support: {license.support || "—"}
                          </div>
                        </td>
                        <td className="py-2 text-blue-700 flex items-center gap-1">
                          <Globe size={16} />
                          {license.domain || "—"}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                license.isActive
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {license.isActive ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={() =>
                                toggleActivation(
                                  license.key,
                                  license.domain,
                                  license.isActive
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              title="Click to toggle activation"
                            >
                              {license.isActive ? (
                                <LockOpen size={20} />
                              ) : (
                                <Lock size={20} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Card View for mobile */}
            <div className="block sm:hidden space-y-4">
              {loading ? (
                <div className="text-center text-blue-500 py-6">
                  <CircleNotch size={30} className="animate-spin mx-auto" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-gray-400 py-6">
                  No licenses found.
                </div>
              ) : (
                filtered.map((license) => (
                  <div
                    key={license.key}
                    className="border border-gray-200 rounded-lg p-4 bg-white border-[#e4e4e4]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-sm font-medium underline text-gray-800 cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/dashboard/license/${license.key}`)
                        }
                      >
                        {license.key}
                      </span>
                      <button
                        onClick={() => handleCopy(license.key)}
                        className={`transition-colors duration-200 cursor-pointer ${
                          copied
                            ? "text-green-500"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                      >
                        {copied ? (
                          <CheckCircle size={18} />
                        ) : (
                          <CopySimple size={18} />
                        )}
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <UserCircle size={16} /> {license.customer || "—"}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Type: {license.type || "—"}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      Support: {license.support || "—"}
                    </div>
                    <div className="text-sm text-blue-700 flex items-center gap-1 mb-1">
                      <Globe size={16} /> {license.domain || "—"}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-sm font-medium ${
                          license.isActive ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {license.isActive ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() =>
                          toggleActivation(
                            license.key,
                            license.domain,
                            license.isActive
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {license.isActive ? (
                          <LockOpen size={20} />
                        ) : (
                          <Lock size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
