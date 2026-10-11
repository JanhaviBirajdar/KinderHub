import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CalendarCheck, 
  CreditCard, 
  School, 
  Sparkles,
  Search,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('attendance'); // 'attendance' | 'fees' | 'enrollment'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState('');

  const toast = useToast();

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.getReports(reportType);
      setReportData(res);
      setTableSearch('');
    } catch (err) {
      toast.error('Failed to load report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleExportCSV = () => {
    if (!reportData?.records?.length) {
      toast.warning('No records to export.');
      return;
    }

    const headers = Object.keys(reportData.records[0]).join(',');
    const rows = reportData.records.map(r => Object.values(r).map(v => `"${v}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kinderhub_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV report generated and downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter records based on table search
  const filteredRecords = (reportData?.records || []).filter(row => {
    if (!tableSearch) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(tableSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Preschool Operations & Compliance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Operational Audits & Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Searchable regulatory records for student turnout, tuition reconciliation, and classroom capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-200/80 shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-1.5 shadow-md shadow-purple-200 active:scale-95"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 gap-1.5 max-w-fit no-print">
        {[
          { id: 'attendance', label: 'Attendance Audit', icon: CalendarCheck },
          { id: 'fees', label: 'Tuition & Fee Collection', icon: CreditCard },
          { id: 'enrollment', label: 'Enrollment & Ratios', icon: School },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              reportType === r.id
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <r.icon className="w-4 h-4" />
            {r.label}
          </button>
        ))}
      </div>

      {/* Report Data Container */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span>Compiling preschool report data...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm p-6 space-y-5">
          {/* Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg capitalize">
                KinderHub {reportType} Summary
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Total Records: <strong className="text-purple-700">{reportData?.count || 0}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Table search filter */}
              <div className="relative no-print">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter report rows..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 whitespace-nowrap">
                Official Preschool Audit
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  {reportData?.records?.[0] && Object.keys(reportData.records[0]).map(k => (
                    <th key={k} className="px-4 py-3.5 capitalize font-extrabold tracking-wider">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      {Object.entries(row).map(([k, val], cIdx) => {
                        const isStatusKey = k.toLowerCase().includes('status');
                        return (
                          <td key={cIdx} className="px-4 py-3.5 font-medium text-slate-700">
                            {isStatusKey ? (
                              <Badge variant={String(val)}>{String(val)}</Badge>
                            ) : typeof val === 'number' && (k.toLowerCase().includes('amount') || k.toLowerCase().includes('fee') || k.toLowerCase().includes('paid')) ? (
                              <span className="font-bold text-slate-800">${val}</span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={reportData?.records?.[0] ? Object.keys(reportData.records[0]).length : 4} className="py-8 text-center text-slate-400 font-semibold">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
