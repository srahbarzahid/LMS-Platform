import { useState, useEffect } from "react";
import { MoreVertical, Search, ChevronLeft, ChevronRight, Download, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

const UserTable = ({
  columns,
  data,
  total,
  page,
  totalPages,
  onPageChange,
  onSearch,
  onAction,
  searchPlaceholder = "Search...",
  filters,
  entityName = "Users",
  detailPathPrefix
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState(null);
  const [newStatus, setNewStatus] = useState("Active");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(data.map((item) => item.id));
    else setSelectedIds([]);
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close open action dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".action-menu-container")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    toast.loading("Generating PDF...", { id: "pdf-export-toast" });

    const tableRows = data
      .map((row, i) => {
        return `
        <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${i % 2 === 0 ? "#ffffff" : "#f9fafb"};">
          ${columns
            .map((c) => {
              let cellData = row[c.key];
              if (c.key === "progress") {
                cellData = cellData ? cellData + "%" : "0%";
              }
              if (cellData === null || cellData === undefined) cellData = "-";
              if (typeof cellData === "object") cellData = JSON.stringify(cellData);
              return `<td style="padding: 12px 16px; font-size: 12px; color: #374151;">${String(cellData)}</td>`;
            })
            .join("")}
        </tr>
      `;
      })
      .join("");

    const htmlString = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #111827; font-size: 24px; margin: 0 0 10px 0; font-weight: bold;">${entityName} Report</h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
              ${columns
                .map((c) => `<th style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase;">${c.label}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: right; color: #9ca3af; font-size: 10px;">
          <p>Total Records: ${data.length}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 15,
      filename: `${entityName.toLowerCase().replace(/\s+/g, "_")}_report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    };

    html2pdf()
      .set(opt)
      .from(htmlString)
      .save()
      .then(() => {
        toast.dismiss("pdf-export-toast");
        toast.success("PDF generated successfully");
      })
      .catch(() => {
        toast.dismiss("pdf-export-toast");
        toast.error("Failed to generate PDF");
      });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex flex-col min-h-[560px] justify-between">
      <div>
        {/* Table Toolbar */}
        <div className="p-6 border-b border-border dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30 rounded-t-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caption" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-neutral-700 bg-white dark:bg-neutral-900 text-heading dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </form>

          {/* Actions & Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {filters}

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 border-l border-border dark:border-neutral-800 pl-3">
                <span className="text-sm font-bold text-primary">{selectedIds.length} Selected</span>
                <button
                  onClick={() => onAction("delete", selectedIds)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-border dark:border-neutral-700 rounded-xl text-heading dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[460px] pb-64">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="p-4 font-semibold whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="p-16 text-center text-caption font-medium">
                    No {entityName.toLowerCase()} found.
                  </td>
                </tr>
              ) : (
                data.map((row, index) => {
                  const shouldOpenUpward = index > 2 && index >= data.length - 2;

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border/50 dark:border-neutral-800/50 hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => handleSelect(row.id)}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                      </td>

                      {columns.map((col) => (
                        <td key={col.key} className="p-4">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}

                      <td className="p-4 text-right">
                        <div className="relative inline-block action-menu-container z-20">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)}
                            className="p-2 text-caption hover:text-primary hover:bg-orange-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdownId === row.id && (
                            <div
                              className={`absolute right-0 ${
                                shouldOpenUpward ? "bottom-full mb-2" : "top-full mt-2"
                              } w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-border dark:border-neutral-700 z-50 flex flex-col py-2 transition-all animate-in fade-in duration-150`}
                            >
                              {detailPathPrefix && (
                                <Link
                                  to={`${detailPathPrefix}/${row.id}`}
                                  className="px-4 py-2.5 text-sm text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium text-left flex items-center gap-2"
                                  onClick={() => setOpenDropdownId(null)}
                                >
                                  View Details
                                </Link>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedUserForAction(row.id);
                                  setStatusModalOpen(true);
                                  setOpenDropdownId(null);
                                }}
                                className="px-4 py-2.5 text-sm text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium text-left"
                              >
                                Change Status
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUserForAction(row.id);
                                  setResetPasswordModalOpen(true);
                                  setOpenDropdownId(null);
                                }}
                                className="px-4 py-2.5 text-sm text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium text-left"
                              >
                                Reset Password
                              </button>
                              <div className="h-px bg-border dark:bg-neutral-700 my-1 w-full" />
                              <button
                                onClick={() => {
                                  onAction("delete", [row.id]);
                                  setOpenDropdownId(null);
                                }}
                                className="px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-left"
                              >
                                Delete {entityName}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-border dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/30 rounded-b-3xl">
        <div className="text-sm text-caption font-medium">
          Showing <span className="text-heading dark:text-white font-bold">{data.length}</span> of{" "}
          <span className="text-heading dark:text-white font-bold">{total}</span> {entityName}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="p-2 border border-border dark:border-neutral-700 rounded-lg text-heading dark:text-white hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-2 border border-border dark:border-neutral-700 rounded-lg text-heading dark:text-white hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-heading dark:text-white mb-4">Change Status</h3>
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={newStatus === "Active"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="font-bold text-emerald-600">Active</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={newStatus === "Inactive"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="font-bold text-gray-600">Inactive</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">
                <input
                  type="radio"
                  name="status"
                  value="Blocked"
                  checked={newStatus === "Blocked"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="font-bold text-red-600">Suspend (Blocked)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedUserForAction) onAction("status", [selectedUserForAction], { status: newStatus });
                  setStatusModalOpen(false);
                }}
                className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-heading dark:text-white mb-2">Reset Password</h3>
            <p className="text-sm text-caption mb-6">Set a new password for this user.</p>
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-border dark:border-neutral-700 bg-transparent text-heading dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-caption hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setResetPasswordModalOpen(false);
                  setNewPassword("");
                  setShowPassword(false);
                }}
                className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedUserForAction && newPassword) {
                    onAction("reset", [selectedUserForAction], { password: newPassword });
                    setResetPasswordModalOpen(false);
                    setNewPassword("");
                  } else {
                    toast.error("Please enter a new password");
                  }
                }}
                className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
