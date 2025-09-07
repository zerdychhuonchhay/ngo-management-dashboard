import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { AcademicReport, Student } from '../types';
import Modal from '../components/Modal';
import { PlusIcon, EditIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '../components/Icons';
import { useNotification } from '../contexts/NotificationContext';
import { SkeletonTable } from '../components/SkeletonLoader';

type ReportFormData = Omit<AcademicReport, 'id' | 'student_id' | 'student_name'>;

const AcademicReportForm: React.FC<{ 
    onSave: (data: ReportFormData, student_id: string) => void;
    onCancel: () => void;
    students: Student[];
    initialData?: AcademicReport | null; 
}> = ({ onSave, onCancel, students, initialData }) => {
    const isEdit = !!initialData;
    const formInputClass = "w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black placeholder:text-gray-600 dark:border-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary";
    const labelClass = "block text-sm font-medium text-black dark:text-white mb-1";

    const [studentId, setStudentId] = useState(initialData?.student_id || '');
    const [formData, setFormData] = useState<ReportFormData>({
        report_period: initialData?.report_period || '',
        grade_level: initialData?.grade_level || '',
        subjects_and_grades: initialData?.subjects_and_grades || '',
        overall_average: initialData?.overall_average || 0,
        pass_fail_status: initialData?.pass_fail_status || 'Pass',
        teacher_comments: initialData?.teacher_comments || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'overall_average' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) {
            alert('Please select a student.');
            return;
        }
        onSave(formData, studentId);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="student_id" className={labelClass}>Student</label>
                <select id="student_id" name="student_id" value={studentId} onChange={e => setStudentId(e.target.value)} className={formInputClass} required disabled={isEdit}>
                    <option value="">-- Select Student --</option>
                    {students.map(s => <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.student_id})</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="report_period" className={labelClass}>Report Period (e.g., Term 1 2024)</label>
                    <input id="report_period" name="report_period" value={formData.report_period} onChange={handleChange} className={formInputClass} required />
                </div>
                <div>
                    <label htmlFor="grade_level" className={labelClass}>Grade Level</label>
                    <input id="grade_level" name="grade_level" value={formData.grade_level} onChange={handleChange} className={formInputClass} required />
                </div>
                 <div>
                    <label htmlFor="overall_average" className={labelClass}>Overall Average</label>
                    <input id="overall_average" name="overall_average" type="number" step="0.1" value={formData.overall_average} onChange={handleChange} className={formInputClass} />
                </div>
                <div>
                    <label htmlFor="pass_fail_status" className={labelClass}>Pass/Fail Status</label>
                    <select id="pass_fail_status" name="pass_fail_status" value={formData.pass_fail_status} onChange={handleChange} className={formInputClass}>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                    </select>
                </div>
            </div>
            <div>
                 <label htmlFor="subjects_and_grades" className={labelClass}>Subjects & Grades</label>
                <textarea id="subjects_and_grades" name="subjects_and_grades" value={formData.subjects_and_grades} onChange={handleChange} placeholder="e.g., Math: A, Science: B+" className={`${formInputClass} min-h-[100px]`} />
            </div>
            <div>
                 <label htmlFor="teacher_comments" className={labelClass}>Teacher Comments</label>
                <textarea id="teacher_comments" name="teacher_comments" value={formData.teacher_comments} onChange={handleChange} className={`${formInputClass} min-h-[100px]`} />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray dark:bg-box-dark-2 hover:opacity-90">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:opacity-90">{isEdit ? 'Update Report' : 'Save Report'}</button>
            </div>
        </form>
    );
};


const AcademicsPage: React.FC = () => {
    const [allReports, setAllReports] = useState<AcademicReport[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<'add' | 'edit' | null>(null);
    const [selectedReport, setSelectedReport] = useState<AcademicReport | null>(null);
    
    const [yearFilter, setYearFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState<{ key: keyof AcademicReport; order: 'asc' | 'desc' }>({ key: 'report_period', order: 'desc' });
    
    const { showToast } = useNotification();

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [reportsData, studentsData] = await Promise.all([
                api.getAllAcademicReports(),
                api.getStudents()
            ]);
            setAllReports(reportsData);
            setStudents(studentsData);
        } catch (error) {
            showToast('Failed to load academic data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleSaveReport = async (formData: ReportFormData, studentId: string) => {
        try {
            if (modalState === 'edit' && selectedReport) {
                await api.updateAcademicReport(selectedReport.student_id, selectedReport.id, formData);
                showToast('Report updated successfully!', 'success');
            } else {
                await api.addAcademicReport(studentId, formData);
                showToast('Report added successfully!', 'success');
            }
            setModalState(null);
            setSelectedReport(null);
            fetchAllData();
        } catch (error: any) {
            showToast(error.message || 'Failed to save report.', 'error');
        }
    };

    const handleDeleteReport = async (report: AcademicReport) => {
        if (window.confirm(`Are you sure you want to delete the report for ${report.student_name} from ${report.report_period}?`)) {
            try {
                await api.deleteAcademicReport(report.student_id, report.id);
                showToast('Report deleted.', 'success');
                fetchAllData();
            } catch (error: any) {
                showToast(error.message || 'Failed to delete report.', 'error');
            }
        }
    };
    
    const { uniqueYears, uniqueGrades } = useMemo(() => {
        const yearSet = new Set<string>();
        const gradeSet = new Set<string>();
        allReports.forEach(report => {
            gradeSet.add(report.grade_level);
            const yearMatch = report.report_period.match(/\d{4}/);
            if (yearMatch) {
                yearSet.add(yearMatch[0]);
            }
        });
        return { 
            uniqueYears: Array.from(yearSet).sort((a,b) => b.localeCompare(a)),
            uniqueGrades: Array.from(gradeSet).sort()
        };
    }, [allReports]);

    const filteredAndSortedReports = useMemo(() => {
        let filtered = allReports.filter(report => {
            const yearMatch = report.report_period.match(/\d{4}/);
            const reportYear = yearMatch ? yearMatch[0] : null;
            
            const yearCondition = yearFilter === 'all' || reportYear === yearFilter;
            const gradeCondition = gradeFilter === 'all' || report.grade_level === gradeFilter;
            const statusCondition = statusFilter === 'all' || report.pass_fail_status === statusFilter;

            return yearCondition && gradeCondition && statusCondition;
        });

        filtered.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            
            let comparison = 0;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            } else {
                comparison = String(aVal).localeCompare(String(bVal));
            }
            return comparison * (sortConfig.order === 'asc' ? 1 : -1);
        });

        return filtered;
    }, [allReports, sortConfig, yearFilter, gradeFilter, statusFilter]);
    
    const handleSort = (key: keyof AcademicReport) => {
        setSortConfig(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    if (loading) return <SkeletonTable rows={10} cols={6} />;

    return (
        <div className="rounded-lg border border-stroke bg-white dark:bg-box-dark p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-black dark:text-white">Academic Reports</h2>
                <button onClick={() => { setSelectedReport(null); setModalState('add'); }} className="flex w-full sm:w-auto justify-center items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <PlusIcon /> <span className="ml-2">Add Report</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 bg-gray-2 dark:bg-box-dark-2 rounded-lg">
                <select onChange={e => setYearFilter(e.target.value)} value={yearFilter} className="w-full rounded border-stroke bg-white py-2 px-3 text-black dark:border-strokedark dark:bg-form-input dark:text-white">
                    <option value="all">All Years</option>
                    {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <select onChange={e => setGradeFilter(e.target.value)} value={gradeFilter} className="w-full rounded border-stroke bg-white py-2 px-3 text-black dark:border-strokedark dark:bg-form-input dark:text-white">
                    <option value="all">All Grades</option>
                    {uniqueGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                </select>
                <select onChange={e => setStatusFilter(e.target.value)} value={statusFilter} className="w-full rounded border-stroke bg-white py-2 px-3 text-black dark:border-strokedark dark:bg-form-input dark:text-white">
                    <option value="all">All Statuses</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-2 dark:bg-box-dark-2">
                         <tr>
                            {([
                                { key: 'student_name', label: 'Student' },
                                { key: 'report_period', label: 'Period' },
                                { key: 'grade_level', label: 'Grade' },
                                { key: 'overall_average', label: 'Average' },
                                { key: 'pass_fail_status', label: 'Status' },
                            ] as {key: keyof AcademicReport, label: string}[]).map(({key, label}) => (
                                <th key={key} className="p-4 font-medium text-black dark:text-white">
                                    <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort(key)}>
                                        {label}
                                        {sortConfig?.key === key && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                    </button>
                                </th>
                            ))}
                            <th className="p-4 font-medium text-black dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedReports.map(report => (
                             <tr key={report.id} className="border-b border-stroke dark:border-strokedark">
                                <td className="p-4 font-medium text-black dark:text-white">{report.student_name}</td>
                                <td className="p-4 text-body-color dark:text-gray-300">{report.report_period}</td>
                                <td className="p-4 text-body-color dark:text-gray-300">{report.grade_level}</td>
                                <td className="p-4 text-body-color dark:text-gray-300">{report.overall_average.toFixed(1)}%</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.pass_fail_status === 'Pass' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{report.pass_fail_status}</span>
                                </td>
                                <td className="p-4">
                                     <div className="flex items-center space-x-3.5">
                                        <button onClick={() => { setSelectedReport(report); setModalState('edit'); }} className="hover:text-primary"><EditIcon /></button>
                                        <button onClick={() => handleDeleteReport(report)} className="hover:text-danger"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredAndSortedReports.length === 0 && (
                    <div className="text-center p-10 text-body-color dark:text-gray-400">
                        No academic reports match the current filters.
                    </div>
                )}
            </div>
            
            <Modal isOpen={!!modalState} onClose={() => setModalState(null)} title={modalState === 'edit' ? 'Edit Academic Report' : 'Add New Academic Report'}>
                <AcademicReportForm 
                    key={selectedReport ? selectedReport.id : 'new-report'}
                    onSave={handleSaveReport} 
                    onCancel={() => setModalState(null)}
                    students={students}
                    initialData={selectedReport}
                />
            </Modal>
        </div>
    );
};

export default AcademicsPage;
