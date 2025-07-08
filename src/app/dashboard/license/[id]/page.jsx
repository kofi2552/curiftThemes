"use client";
import { ArrowLeft } from "phosphor-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import createRequest from "@/utils/createRequest";

export default function LicenseDetails() {
  const router = useRouter();
  const { id } = useParams(); // ✅ use useParams in App Router Client Component

  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLicenseById = async () => {
      try {
        setLoading(true);
        const res = await createRequest.get(`/api/license/${id}`);
        console.log("Fetched this License:", res.data.data);
        const license = res.data?.data;
        setLicense(license);
        setForm(license);
      } catch (err) {
        console.error("Failed to fetch license:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLicenseById();
    }
  }, [id]);

  // console.log("license: ", id, license);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const res = await createRequest.put(`/api/license/${id}`, form);
      console.log("Update response:", res.data);
      animateBack();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this license?");
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await createRequest.delete(`/api/license/${id}`);
      animateBack();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const animateBack = () => {
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;

  return (
    <motion.div
      className="max-w-7xl mx-auto p-2 md:p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleCancel}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded cursor-pointer"
          disabled={submitting}
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          License - {license.key}
        </h1>
      </div>

      {form && (
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-6">
          {/* Editable Fields Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold mb-4 text-gray-800">
              Editable Records
            </h3>
            {["key", "customer", "type", "domain", "support", "maxUsages"].map(
              (field) => (
                <div key={field} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={form[field] ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )
            )}
            <div className="w-full mx-auto flex flex-col justify-center items-center py-8">
              <p className="text-sm text-gray-500 mb-4">
                <span className="text-red-500">*</span> All fields are editable
                except the <span className="text-blue-500">right</span>{" "}
                contents.
              </p>
              <div className="max-w-xl mx-auto flex items-center gap-6">
                <div className="w-full flex items-center gap-6">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg cursor-pointer"
                    disabled={submitting}
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700 px-8 py-4 rounded-lg cursor-pointer"
                    disabled={submitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Read-only Info Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold mb-4 text-gray-800">
              License Info
            </h3>
            {[
              "id",
              "soldAt",
              "price",
              "itemID",
              "itemName",
              "isActive",
              "activatedAt",
              "deactivatedAt",
              "Usages",
            ].map((field) => (
              <div key={field} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <p className="text-sm text-gray-800 bg-gray-100 px-3 py-2 rounded-md border border-gray-300">
                  {typeof form[field] === "boolean"
                    ? form[field]
                      ? "Yes"
                      : "No"
                    : form[field] ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div className="flex justify-between pt-4"></div> */}
    </motion.div>
  );
}
