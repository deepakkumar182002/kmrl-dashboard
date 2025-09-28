import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Upload,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Info,
} from "lucide-react";
import { FitnessCertificate } from "../types";

const FitnessCertificatesManagement: React.FC = () => {
  // Sample data - in real app, this would come from API
  const [certificates, setCertificates] = useState<FitnessCertificate[]>([
    {
      id: "FC001",
      trainId: "KMRL-001",
      department: "Rolling Stock",
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      status: "Fit",
      issuedBy: "John Smith",
      certificateNumber: "RS-2024-001",
      remarks: "All systems operational",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "FC002",
      trainId: "KMRL-002",
      department: "Signalling",
      validFrom: new Date("2024-02-01"),
      validUntil: new Date("2024-11-30"),
      status: "Not Fit",
      issuedBy: "Sarah Johnson",
      certificateNumber: "SIG-2024-002",
      remarks: "Signal system needs calibration",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-15"),
    },
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<FitnessCertificate | null>(null);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const infoDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoDropdownRef.current &&
        !infoDropdownRef.current.contains(event.target as Node)
      ) {
        setShowInfoDropdown(false);
      }
    };

    if (showInfoDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfoDropdown]);

  const [formData, setFormData] = useState({
    trainId: "",
    department: "Rolling Stock" as "Rolling Stock" | "Signalling" | "Telecom",
    validFrom: "",
    validUntil: "",
    status: "Fit" as "Fit" | "Not Fit",
    issuedBy: "",
    certificateNumber: "",
    remarks: "",
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // File upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Mock train IDs for dropdown
  const trainIds = ["KMRL-001", "KMRL-002", "KMRL-003", "KMRL-004", "KMRL-005"];

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch =
        cert.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cert.issuedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || cert.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || cert.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [certificates, searchTerm, departmentFilter, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCertificate: FitnessCertificate = {
      id: editingCertificate?.id || `FC${Date.now()}`,
      trainId: formData.trainId,
      department: formData.department,
      validFrom: new Date(formData.validFrom),
      validUntil: new Date(formData.validUntil),
      status: formData.status,
      issuedBy: formData.issuedBy,
      certificateNumber: formData.certificateNumber,
      remarks: formData.remarks,
      createdAt: editingCertificate?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingCertificate) {
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === editingCertificate.id ? newCertificate : cert
        )
      );
    } else {
      setCertificates((prev) => [...prev, newCertificate]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      trainId: "",
      department: "Rolling Stock",
      validFrom: "",
      validUntil: "",
      status: "Fit",
      issuedBy: "",
      certificateNumber: "",
      remarks: "",
    });
    setShowForm(false);
    setEditingCertificate(null);
  };

  const handleEdit = (certificate: FitnessCertificate) => {
    setEditingCertificate(certificate);
    setFormData({
      trainId: certificate.trainId,
      department: certificate.department,
      validFrom: certificate.validFrom.toISOString().split("T")[0],
      validUntil: certificate.validUntil.toISOString().split("T")[0],
      status: certificate.status,
      issuedBy: certificate.issuedBy,
      certificateNumber: certificate.certificateNumber,
      remarks: certificate.remarks || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCertificates((prev) => prev.filter((cert) => cert.id !== id));
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    // In real app, this would parse the file and validate data
    console.log("Processing file:", uploadFile.name);

    // Mock parsing result
    const mockParsedData: FitnessCertificate[] = [
      {
        id: `FC${Date.now()}`,
        trainId: "KMRL-006",
        department: "Telecom",
        validFrom: new Date("2024-03-01"),
        validUntil: new Date("2024-12-31"),
        status: "Fit",
        issuedBy: "Mike Wilson",
        certificateNumber: "TEL-2024-001",
        remarks: "Uploaded via CSV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setCertificates((prev) => [...prev, ...mockParsedData]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: FitnessCertificate["status"]) => {
    return status === "Fit"
      ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
      : "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium";
  };

  const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fitness Certificates Management
          </h1>
          <p className="text-gray-600">
            Manage train fitness certificates and validity
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
          {/* Info Dropdown */}
          <div className="relative" ref={infoDropdownRef}>
            <button
              onClick={() => setShowInfoDropdown(!showInfoDropdown)}
              className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              title="Data Flow Information"
            >
              <Info className="w-5 h-5" />
            </button>

            {showInfoDropdown && (
              <div className="absolute right-0 top-12 w-96 h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-6 animate-fadeIn">
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Fitness Certificates – Data Flow
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Rolling Stock Dept.</strong> → Train physical
                        condition, brake test, bogie, HVAC clearance.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Signalling Dept.</strong> → Train signalling &
                        interlocking clearance.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Telecom Dept.</strong> → Onboard communication &
                        CCTV clearance.
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Fetching Method:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Existing sources: Excel sheets, logbooks.</li>
                      <li>Sync: CSV import ya API endpoint.</li>
                      <li>
                        Example:{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          /api/fitness-certificates
                        </code>{" "}
                        (GET → valid/expired certificates).
                      </li>
                      <li>Option: Nightly sync from ERP / Maximo exports.</li>
                    </ul>
                  </div>

                  {/* <button
                    onClick={() => setShowInfoDropdown(false)}
                    className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Valid Certificates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.filter((c) => c.status === "Fit").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Invalid Certificates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.filter((c) => c.status === "Not Fit").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  certificates.filter((c) => isExpiringSoon(c.validUntil))
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Certificates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="Rolling Stock">Rolling Stock</option>
            <option value="Signalling">Signalling</option>
            <option value="Telecom">Telecom</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Fit">Fit</option>
            <option value="Not Fit">Not Fit</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((certificate) => (
                <tr key={certificate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {certificate.certificateNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Issued by: {certificate.issuedBy}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {certificate.trainId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {certificate.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {certificate.validFrom.toLocaleDateString()} -{" "}
                      {certificate.validUntil.toLocaleDateString()}
                    </div>
                    {isExpiringSoon(certificate.validUntil) && (
                      <div className="text-xs text-orange-600 font-medium">
                        Expiring Soon
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(certificate.status)}>
                      {certificate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(certificate)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(certificate.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Train ID
                </label>
                <select
                  value={formData.trainId}
                  onChange={(e) =>
                    setFormData({ ...formData, trainId: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Train</option>
                  {trainIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Rolling Stock">Rolling Stock</option>
                  <option value="Signalling">Signalling</option>
                  <option value="Telecom">Telecom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Fit">Fit</option>
                  <option value="Not Fit">Not Fit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Number
                </label>
                <input
                  type="text"
                  value={formData.certificateNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificateNumber: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issued By
                </label>
                <input
                  type="text"
                  value={formData.issuedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, issuedBy: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingCertificate ? "Update" : "Add"} Certificate
                </button>
              </div>
                 <div className="text-center">OR</div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex  justify-center mx-auto items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Upload Certificates
            </h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select CSV/Excel/TXT File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  Expected columns: Train ID, Department, Valid From, Valid
                  Until, Status, Certificate Number, Issued By, Remarks
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessCertificatesManagement;
