import React, { useState, useCallback } from 'react';
import { api } from '../services/api';
import { Student, SponsorshipStatus, Transaction, TransactionType } from '../types';
import { PrintIcon, ArrowDownIcon, ArrowUpIcon } from '../components/Icons';
import { SkeletonTable } from '../components/SkeletonLoader';
import { useNotification } from '../contexts/NotificationContext';


interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => (
    <div className="border border-stroke dark:border-strokedark rounded-lg">
        <h2>
            <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-black dark:text-white bg-gray-2 dark:bg-box-dark-2 hover:bg-gray-300 dark:hover:bg-box-dark transition-colors rounded-t-lg"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </button>
        </h2>
        {isOpen && (
            <div className="p-5 border-t border-stroke dark:border-strokedark bg-white dark:bg-box-dark">
                {children}
            </div>
        )}
    </div>
);

const ReportWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="print-container">
            <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="text-xl font-semibold text-black dark:text-white">{title}</h3>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90"
                >
                    <PrintIcon /> Print Report
                </button>
            </div>
            {/* The div below is what gets printed */}
            <div>
                 <div className="hidden print:block text-2xl font-bold text-black mb-4">{title}</div>
                {children}
            </div>
        </div>
    );
};


const StudentMasterList = () => {
    const [reportData, setReportData] = useState<Student[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useNotification();

    const generateReport = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getStudents();
            setReportData(data);
        } catch (error) {
            showToast('Failed to generate report', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    return (
        <div>
            <p className="text-body-color dark:text-gray-300 mb-4">Generates a complete list of all students in the system.</p>
            <button onClick={generateReport} className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
            </button>
            <div className="mt-6">
                {loading && <SkeletonTable rows={3} cols={6} />}
                {reportData && (
                     <ReportWrapper title="Student Master List">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-2 dark:bg-box-dark-2">
                                <tr>
                                    <th className="p-2 font-medium text-black dark:text-white">Student ID</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Full Name</th>
                                    <th className="p-2 font-medium text-black dark:text-white">DOB</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Grade</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Status</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Sponsorship</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((s, i) => (
                                    <tr key={s.student_id} className={i === reportData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}>
                                        <td className="p-2 text-black dark:text-white">{s.student_id}</td>
                                        <td className="p-2 text-black dark:text-white">{s.first_name} {s.last_name}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{new Date(s.date_of_birth).toLocaleDateString()}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{s.current_grade}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{s.student_status}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{s.sponsorship_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ReportWrapper>
                )}
            </div>
        </div>
    );
}

const SponsorshipStatusReport = () => {
    const [filter, setFilter] = useState<'All' | SponsorshipStatus>('All');
    const [reportData, setReportData] = useState<Student[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useNotification();
    
    const generateReport = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getSponsorshipReport(filter);
            setReportData(data);
        } catch(error) {
            showToast('Failed to generate report', 'error');
        } finally {
            setLoading(false);
        }
    }, [filter, showToast]);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <select value={filter} onChange={e => setFilter(e.target.value as any)} className="rounded-lg border-[1.5px] border-stroke bg-gray-2 py-2 px-5 font-medium outline-none transition focus:border-primary text-black dark:border-strokedark dark:bg-form-input dark:text-white">
                    <option value="All">All Students</option>
                    <option value={SponsorshipStatus.SPONSORED}>Sponsored</option>
                    <option value={SponsorshipStatus.UNSPONSORED}>Unsponsored</option>
                </select>
                <button onClick={generateReport} className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
             <div className="mt-6">
                {loading && <SkeletonTable rows={3} cols={5} />}
                {reportData && (
                     <ReportWrapper title={`Sponsorship Status Report: ${filter}`}>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-2 dark:bg-box-dark-2">
                                <tr>
                                    <th className="p-2 font-medium text-black dark:text-white">Student ID</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Full Name</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Grade</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Sponsorship</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Sponsor Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((s, i) => (
                                    <tr key={s.student_id} className={i === reportData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}>
                                        <td className="p-2 text-black dark:text-white">{s.student_id}</td>
                                        <td className="p-2 text-black dark:text-white">{s.first_name} {s.last_name}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{s.current_grade}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{s.sponsorship_status}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{s.sponsor_name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ReportWrapper>
                )}
            </div>
        </div>
    );
};

interface FinancialSummaryData {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    transactions: Transaction[];
}
const FinancialSummaryReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState<FinancialSummaryData | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useNotification();
    
    const generateReport = useCallback(async () => {
        if (!startDate || !endDate) {
            showToast('Please select both a start and end date.', 'error');
            return;
        }
        setLoading(true);
        try {
            const data = await api.getFinancialSummary(startDate, endDate);
            setReportData(data);
        } catch(error) {
            showToast('Failed to generate report', 'error');
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, showToast]);

    return (
        <div>
             <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded-lg border-[1.5px] border-stroke bg-gray-2 py-2 px-5 font-medium outline-none transition focus:border-primary text-black dark:border-strokedark dark:bg-form-input dark:text-white" />
                <span className="text-black dark:text-white">to</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-lg border-[1.5px] border-stroke bg-gray-2 py-2 px-5 font-medium outline-none transition focus:border-primary text-black dark:border-strokedark dark:bg-form-input dark:text-white" />
                <button onClick={generateReport} className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
            <div className="mt-6">
                 {loading && <SkeletonTable rows={3} cols={4} />}
                 {reportData && (
                     <ReportWrapper title={`Financial Summary: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}>
                        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                            <div className="p-4 bg-success/10 rounded-lg"><p className="text-sm text-success">Total Income</p><p className="text-2xl font-bold text-success">${reportData.totalIncome.toFixed(2)}</p></div>
                            <div className="p-4 bg-danger/10 rounded-lg"><p className="text-sm text-danger">Total Expense</p><p className="text-2xl font-bold text-danger">${reportData.totalExpense.toFixed(2)}</p></div>
                            <div className="p-4 bg-primary/10 rounded-lg"><p className="text-sm text-primary">Net Balance</p><p className="text-2xl font-bold text-primary">${reportData.netBalance.toFixed(2)}</p></div>
                        </div>

                         <table className="w-full text-left text-sm">
                            <thead className="bg-gray-2 dark:bg-box-dark-2">
                                <tr>
                                    <th className="p-2 font-medium text-black dark:text-white">Date</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Description</th>
                                    <th className="p-2 font-medium text-black dark:text-white">Category</th>
                                    <th className="p-2 font-medium text-black dark:text-white text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.transactions.map((t, i) => (
                                    <tr key={t.id} className={i === reportData.transactions.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}>
                                        <td className="p-2 text-black dark:text-white">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-2 text-black dark:text-white">{t.description}</td>
                                        <td className="p-2 text-body-color dark:text-gray-300">{t.category}</td>
                                        <td className={`p-2 text-right font-medium ${t.type === TransactionType.INCOME ? 'text-success' : 'text-danger'}`}>${t.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ReportWrapper>
                 )}
            </div>
        </div>
    );
};


const ReportsPage: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>('students');

    const handleToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">Reports & Analytics</h1>

            <div className="space-y-2">
                <AccordionItem title="Student Master List" isOpen={openAccordion === 'students'} onToggle={() => handleToggle('students')}>
                    <StudentMasterList />
                </AccordionItem>
                <AccordionItem title="Sponsorship Status Report" isOpen={openAccordion === 'sponsorship'} onToggle={() => handleToggle('sponsorship')}>
                    <SponsorshipStatusReport />
                </AccordionItem>
                <AccordionItem title="Financial Summary Report" isOpen={openAccordion === 'financial'} onToggle={() => handleToggle('financial')}>
                    <FinancialSummaryReport />
                </AccordionItem>
            </div>
        </div>
    );
};

export default ReportsPage;