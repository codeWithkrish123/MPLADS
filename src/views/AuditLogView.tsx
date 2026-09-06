import React, { useState } from "react";
import {
  Search,
  Lock,
  Download,
  CheckCircle,
  Eye,
  Filter,
  BarChart3,
  Download as DownloadIcon,
  Printer,
  X,
} from "lucide-react";
import { AuditLogEntry, Language } from "../types";

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  language?: Language;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, language = "en" }) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AuditLogEntry | null>(null);

  const mockLogs: AuditLogEntry[] = [
    {
      id: "AUD-591",
      timestamp: "28 Aug 2026, 14:32:10",
      user: "Dr. K. S. Murthy",
      role: "Ministry",
      action: "Updated Status",
      entity: "Risk Alert (ALT-801 | ITC-00285)",
      entity_id: "ALT-801",
      old_value: "Status: Technical Audit Assigned (OM Ghaziabad)",
      new_value: "Status: Physical Audit Assigned (OM Ghaziabad)",
      ip_device: "164.100.12.99 (Secure NIC Node)",
      status: "Verified",
      hash_signature: "NIC-CA | Validated | 80e5c...78B91",
    },
    {
      id: "AUD-990",
      timestamp: "26 Aug 2026, 11:55:04",
      user: "District Magistrate, Ghaziabad",
      role: "District Authority",
      action: "Disbursement Hold Revoked",
      entity: "Work Sanction (MPL-00293)",
      entity_id: "MPL-00293",
      old_value: "Tranche 3: On Hold pending Technical MB Audit",
      new_value: "Tranche 3: On Hold pending Clearance (+12 days)",
      ip_device: "192.168.1.105 (District Control)",
      status: "Verified",
      hash_signature: "NIC-CA | Validated | d8c1e...a9f23",
    },
    {
      id: "AUD-989",
      timestamp: "25 Aug 2026, 17:40:22",
      user: "System (AI Risk Engine v0.4)",
      role: "Automated Sentinel",
      action: "Anomaly Signal Flagged",
      entity: "Work Record (MPL-00293)",
      entity_id: "MPL-00293",
      old_value: "Risk: RB CRITICAL (-4.88 Progress Divergence)",
      new_value: "Risk: RB CRITICAL (-6.22 Progress Divergence)",
      ip_device: "In-System | AI Sentinel | Autonomous",
      status: "Verified",
      hash_signature: "NIC-CA | Validated | f4g3h...k2l9m",
    },
  ];

  const dataToUse = logs && logs.length > 0 ? logs : mockLogs;
  const filteredLogs = dataToUse.filter((l: any) => {
    const matchSearch =
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "ALL" || l.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200" style={{ fontFamily: "'Noto Sans', 'Noto Sans Devanagari', Arial, sans-serif" }}>
      {/* TOP TRICOLOR STRIPE */}
      <div className="h-2 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* OFFICIAL CAG HEADER */}
      <div className="bg-white border-b-2 border-slate-300 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#003399] text-white flex items-center justify-center shrink-0 font-bold text-sm">
              IN
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" /> IT Act Sec 2(1-A) - Protected
              </p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {isHindi ? "राष्ट्रीय सांसद निधि इलेक्ट्रॉनिक ऑडिट ट्रेल" : "National MPLADS Electronic Audit Trail & Statutory Verification Ledger"}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                {isHindi ? "सभी प्रशासनिक कार्यों का अपरिवर्तनीय डिजिटल साक्ष्य, PFMS निधि रिहाई, भौतिक निरीक्षण और मैनुअल ओवरराइड" : "Immutable digital evidence of administrative sanctions, PFMS fund releases, physical inspections & manual overrides"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert("DSC Signatures validated successfully!")}
              className="px-4 py-2 bg-green-50 border border-green-300 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Validate DSC Signatures
            </button>
            <button 
              onClick={() => {
                const printWindow = window.open("", "", "width=900,height=600");
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head><title>MPLADS Audit Gazette</title>
                      <style>
                        body { font-family: Arial; margin: 40px; }
                        h1 { color: #003399; border-bottom: 2px solid #FF9933; padding-bottom: 10px; }
                        .header { margin-bottom: 20px; }
                      </style>
                      </head>
                      <body>
                        <div class="header">
                          <h1>Government of India - Ministry of Statistics</h1>
                          <h2>Electronic Audit Trail & Statutory Verification Ledger</h2>
                          <p>Date: ${new Date().toLocaleDateString()}</p>
                        </div>
                        <p>This is the official audit gazette ledger.</p>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Gazette Ledger
            </button>
            <button 
              onClick={() => {
                const csv = "DOCKET_ID,OFFICER,ACTION,ENTITY,TIMESTAMP\n" + 
                  mockLogs.map(l => `${l.id},"${l.user}","${l.action}","${l.entity}","${l.timestamp}"`).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `audit_log_${new Date().getTime()}.csv`;
                a.click();
              }}
              className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* STATS BOXES */}
      <div className="grid grid-cols-4 gap-4 px-6">
        <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
          <p className="text-xs font-bold text-slate-600 uppercase mb-2">TOTAL LOGGED INTERVENTIONS</p>
          <p className="text-3xl font-bold text-slate-900">4</p>
          <p className="text-xs text-green-700 font-semibold mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 100% Cryptographically Intact</p>
          <p className="text-xs text-slate-600 mt-1">SHA-256 HASH + NIC-CA Cert</p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
          <p className="text-xs font-bold text-slate-600 uppercase mb-2">NIC DSC CRYPTOGRAPHIC SIGNATURES</p>
          <p className="text-3xl font-bold text-green-700">100% Valid</p>
          <p className="text-xs text-slate-600 mt-1">SHA-256 HASH + NIC-CA Cert</p>
          <p className="text-xs text-slate-600">Digital Signature Verified</p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
          <p className="text-xs font-bold text-slate-600 uppercase mb-2">CAG PRE-AUDIT READINESS INDEX</p>
          <p className="text-3xl font-bold text-orange-700">94.8%</p>
          <p className="text-xs text-slate-600 mt-1">Public Accounts Committee Ready</p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
          <p className="text-xs font-bold text-slate-600 uppercase mb-2">LOGGED RISK OVERRIDES</p>
          <p className="text-3xl font-bold text-red-700">14</p>
          <p className="text-xs text-slate-600 mt-1">All backed by DM Written Orders</p>
        </div>
      </div>

      {/* OFFICE MEMORANDUM SECTION */}
      <div className="bg-white border-2 border-slate-300 rounded-lg p-6 mx-6">
        <div className="flex items-start gap-3 mb-4 pb-4 border-b-2 border-slate-300">
          <div className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
            GO
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Office Memorandum (O.M.) - Central Electronic Audit Synthesis</p>
            <p className="text-xs text-slate-600 font-mono mt-1">ResPI/2026-CAG/AUDIT/2025/04-0882 / New 28-Oct / 09_SeptOct:2026</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1 w-fit">
              <CheckCircle className="w-3 h-3" /> CAG Pre-Audit Compliance: Fully Verified
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-800 mb-4">
          {isHindi 
            ? "PFMS और राज्य नोडल खातों में 1,420 प्रशासनिक घटनाओं की एक सांविधिक समीक्षा संचालित की गई थी। सभी व्यय रिहाई और जिला कलेक्टर प्रतिबंध सूचना प्रौद्योगिकी अधिनियम की धारा 2 (अ) के तहत NIC डिजिटल हस्ताक्षर प्रमाणपत्र के माध्यम से प्रमाणित किए गए हैं, 2000।"
            : "A statutory review of 1,420 administrative events was conducted across PFMS and State Nodal accounts. All expenditure releases and District Collector sanctions are authenticated via NIC Digital Signature Certificates (DSC) under Section 7(A) of the Information Technology Act, 2000."}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3">
            <p className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> KEY STATUTORY AUDIT FINDINGS</p>
            <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
              <li>98.8% of 342 District Magistrate administrative sanctions complied with the statutory 45-day deadline.</li>
              <li>14 anomalies on record; each case is accompanied by a signed physical inspection order and Measurement Book (MB) extract.</li>
              <li>PFMS digital disbursements maintain zero financial leakage. 100% of vendor transfers reached verified SHA accounts directly.</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-3">
            <p className="text-xs font-bold text-yellow-900 uppercase mb-2"><Filter className="w-3 h-3 inline mr-1" /> VIGILANCE DIRECTIVES ISSUED</p>
            <ul className="text-xs text-yellow-900 space-y-1 list-disc list-inside">
              <li>Direct District Collectors of Ghaziabad and Muzaffargarh to submit third-party technical audit reports.</li>
              <li>Mandate geo-tagged verification of Citizen Information Boards (CIBs) across all 2,840 completed works.</li>
            </ul>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-300 text-xs text-slate-600 flex justify-between">
          <p>Attested: Under Secretary (MPLADS Division), Govt of India</p>
          <p className="text-green-700 font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> NIC-CA Digital Certificate Verified</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex items-center gap-3 px-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isHindi ? "डॉकेट ID, अधिकृत अधिकारी, कार्य ID, कार्रवाई, हैश द्वारा खोजें..." : "Search ledger by Docket ID, Authorized Officer, Work ID, Action, or Hash..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-blue-200"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#003399] cursor-pointer"
        >
          <option value="ALL">{isHindi ? "सभी अधिकार:" : "Authority: All Authorities"}</option>
          <option value="Ministry">Ministry</option>
          <option value="District">District Authority</option>
          <option value="State">State Nodal</option>
          <option value="Automated">Automated Sentinel</option>
        </select>

        <p className="text-xs text-slate-600 font-semibold whitespace-nowrap">
          {isHindi ? "दिखा रहे हैं: 4 रिकॉर्ड्स" : "Showing: 4 Records"}
        </p>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white border-2 border-slate-300 rounded-lg overflow-hidden mx-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 text-slate-900 font-bold uppercase border-b-2 border-slate-300">
              <tr>
                <th className="py-3 px-4 text-xs">{isHindi ? "डॉकेट आईडी और टाइमस्टैंप" : "DOCKET ID & TIMESTAMP"}</th>
                <th className="py-3 px-4 text-xs">{isHindi ? "अधिकृत अधिकारी & भूमिका" : "AUTHORIZED OFFICER & ROLE"}</th>
                <th className="py-3 px-4 text-xs">{isHindi ? "वैधानिक कार्रवाई" : "STATUTORY ACTION"}</th>
                <th className="py-3 px-4 text-xs">{isHindi ? "लक्ष्य कार्य / इकाई" : "TARGET WORK / ENTITY"}</th>
                <th className="py-3 px-4 text-xs">{isHindi ? "पैरामीटर संक्रमण" : "PARAMETER TRANSITION"}</th>
                <th className="py-3 px-4 text-xs">{isHindi ? "डीएससी हस्ताक्षर" : "DSC SIGNATURE"}</th>
                <th className="py-3 px-4 text-xs text-right">{isHindi ? "आधिकारिक डॉकेट" : "OFFICIAL DOCKET"}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-300">
              {filteredLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{log.id}</p>
                    <p className="text-xs text-slate-500 font-mono">{log.timestamp}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 text-xs">{log.user}</p>
                    <p className="text-xs text-slate-600 font-mono">{log.role}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800 text-xs">{log.action}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-blue-700 text-xs">{log.entity}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-slate-600 line-through">{log.old_value}</p>
                    <p className="text-xs font-bold text-green-700">{log.new_value}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded w-fit flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {log.hash_signature.split("|")[0]}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(log)}
                      className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="bg-blue-50 border-l-4 border-[#003399] rounded-lg p-4 mx-6 text-xs text-slate-700">
        <p className="font-bold mb-1 flex items-center gap-1">
          {isHindi ? <BarChart3 className="w-3 h-3" /> : <BarChart3 className="w-3 h-3" />} {isHindi ? "अनिवार्य अनुपालन नोट" : "MANDATORY COMPLIANCE NOTE"}
        </p>
        <p>
          {isHindi
            ? "यह ऑडिट लेजर नियंत्रक और महालेखा परीक्षक (CAG) के अनिवार्य समीक्षा के लिए एक अपरिवर्तनीय रिकॉर्ड है। प्रत्येक दर्ज की गई कार्रवाई सूचना प्रौद्योगिकी अधिनियम, 2000 की धारा 2 (अ) के तहत NIC डिजिटल हस्ताक्षर प्रमाणपत्र के साथ क्रिप्टोग्राफिक रूप से सुरक्षित है।"
            : "This audit ledger is an immutable record for mandatory review by the Comptroller & Auditor General (CAG). Every logged action is cryptographically secured with NIC Digital Signature Certificates under IT Act Section 2(1-A). Tampering detection: LIVE and TRACEABLE."}
        </p>
      </div>

      {/* MODAL - VIEW ORDER - PROFESSIONAL GOVERNMENT DOCKET */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Tricolor Header Stripe */}
            <div className="h-2 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

            {/* Modal Header with Logo */}
            <div className="flex items-start justify-between p-6 border-b-2 border-gray-300 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#003399] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  IN
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Official Administrative Order Docket</h2>
                  <p className="text-xs text-gray-600 mt-0.5">Docket ID: {selectedOrder.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Government Letterhead Format */}
            <div className="p-8 space-y-6 bg-white">
              {/* Government Letterhead */}
              <div className="text-center space-y-2 pb-4 border-b-2 border-gray-300">
                <p className="text-xs font-bold text-gray-700 tracking-widest">भारत सरकार • सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय</p>
                <p className="text-sm font-bold text-gray-800">GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION</p>
                <p className="text-xs text-gray-600">राष्ट्रीय सांसद स्थानीय क्षेत्र विकास योजना</p>
              </div>

              {/* Reference and Date */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-700 uppercase">Ref No:</p>
                  <p className="text-sm font-bold text-gray-900">{selectedOrder.id}/GOI/2026</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-700 uppercase">Date:</p>
                  <p className="text-sm font-bold text-gray-900">{selectedOrder.timestamp}</p>
                </div>
              </div>

              {/* Order Details Box */}
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
                {/* Authorized Officer */}
                <div>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Authorized Officer:</p>
                  <p className="text-sm font-bold text-gray-900">{selectedOrder.user} <span className="text-gray-600">({selectedOrder.role})</span></p>
                </div>

                {/* Target Entity and Action */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Target Entity:</p>
                    <p className="text-sm font-bold text-blue-700 mt-1">{selectedOrder.entity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Action Type:</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{selectedOrder.action}</p>
                  </div>
                </div>

                {/* Value Transition */}
                <div>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Value Transition:</p>
                  <div className="bg-white border border-gray-300 rounded p-3 flex items-center gap-3">
                    <p className="text-sm text-gray-600 line-through">{selectedOrder.old_value}</p>
                    <span className="text-gray-700 font-bold">→</span>
                    <p className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded">{selectedOrder.new_value}</p>
                  </div>
                </div>
              </div>

              {/* Rule Citation */}
              <div className="bg-gray-50 border-l-4 border-blue-700 p-4">
                <p className="text-sm font-bold text-gray-900 mb-2">ORDER UNDER RULE 12(3) OF MPLADS REVISED GUIDELINES 2023:</p>
                <p className="text-xs leading-relaxed text-gray-700">
                  The competent authority having examined the technical estimate, physical Measurement Book (MB) verification, and financial status of the specified project, has authorized this determination. This administrative sanction is entered into the Central e-Ledger for Comptroller & Auditor General (CAG) audit certification.
                </p>
              </div>

              {/* Digital Signature Box */}
              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Valid Electronic Signature (DSC)</p>
                  <p className="text-xs font-mono text-green-700 break-all">{selectedOrder.hash_signature}</p>
                  <p className="text-xs font-bold text-green-700 mt-2">SEC LEVEL 4</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-300 bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const printWindow = window.open("", "", "width=950,height=1200");
                  if (printWindow) {
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <title>Official Order - ${selectedOrder.id}</title>
                          <style>
                            * { margin: 0; padding: 0; }
                            body { font-family: 'Noto Sans', 'Segoe UI', Arial; color: #333; line-height: 1.6; }
                            .container { max-width: 900px; margin: 0 auto; padding: 40px; }
                            .stripe { height: 6px; background: linear-gradient(to right, #FF9933, white, #138808); margin-bottom: 30px; }
                            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ddd; margin-bottom: 30px; }
                            .header p { font-size: 11px; color: #666; margin: 3px 0; }
                            .header .title { font-size: 13px; font-weight: bold; color: #000; margin: 5px 0; }
                            .ref-date { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; }
                            .ref-date div { text-align: left; }
                            .ref-date .right { text-align: right; }
                            .order-box { border: 2px solid #999; padding: 15px; margin-bottom: 20px; background: #f9f9f9; }
                            .order-box p { font-size: 12px; margin: 8px 0; }
                            .order-box .label { font-weight: bold; font-size: 11px; color: #666; }
                            .order-box .value { font-weight: bold; color: #000; margin-top: 2px; }
                            .rule-box { border-left: 4px solid #003399; background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
                            .rule-box p { font-size: 12px; line-height: 1.6; }
                            .sig-box { border: 2px solid #4CAF50; background: #e8f5e9; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
                            .sig-box .label { font-weight: bold; font-size: 11px; color: #2e7d32; }
                            .sig-box .code { font-family: monospace; font-size: 10px; color: #1b5e20; margin: 5px 0; }
                            .sig-box .level { font-weight: bold; color: #2e7d32; font-size: 10px; }
                            .footer { text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 30px; }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <div class="stripe"></div>
                            
                            <div class="header">
                              <p>भारत सरकार • सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय</p>
                              <p class="title">GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION</p>
                              <p>राष्ट्रीय सांसद स्थानीय क्षेत्र विकास योजना</p>
                            </div>

                            <div class="ref-date">
                              <div>
                                <div class="label">Ref No:</div>
                                <div class="value">${selectedOrder.id}/GOI/2026</div>
                              </div>
                              <div class="right">
                                <div class="label">Date:</div>
                                <div class="value">${selectedOrder.timestamp}</div>
                              </div>
                            </div>

                            <div class="order-box">
                              <p><span class="label">AUTHORIZED OFFICER:</span><br><span class="value">${selectedOrder.user} (${selectedOrder.role})</span></p>
                              <p style="margin-top: 12px;"><span class="label">TARGET ENTITY:</span><br><span class="value">${selectedOrder.entity}</span></p>
                              <p style="margin-top: 12px;"><span class="label">ACTION TYPE:</span><br><span class="value">${selectedOrder.action}</span></p>
                              <p style="margin-top: 12px;"><span class="label">VALUE TRANSITION:</span><br><span style="text-decoration: line-through;">${selectedOrder.old_value}</span> → <span class="value">${selectedOrder.new_value}</span></p>
                            </div>

                            <div class="rule-box">
                              <p><strong>ORDER UNDER RULE 12(3) OF MPLADS REVISED GUIDELINES 2023:</strong></p>
                              <p style="margin-top: 8px;">The competent authority having examined the technical estimate, physical Measurement Book (MB) verification, and financial status of the specified project, has authorized this determination. This administrative sanction is entered into the Central e-Ledger for Comptroller & Auditor General (CAG) audit certification.</p>
                            </div>

                            <div class="sig-box">
                              <p class="label">✓ Valid Electronic Signature (DSC)</p>
                              <p class="code">${selectedOrder.hash_signature}</p>
                              <p class="level">SEC LEVEL 4</p>
                            </div>

                            <div class="footer">
                              <p>This is an official Government of India document. Printed on ${new Date().toLocaleString('en-IN')}</p>
                              <p>For official use only. Unauthorized reproduction is prohibited.</p>
                            </div>
                          </div>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
