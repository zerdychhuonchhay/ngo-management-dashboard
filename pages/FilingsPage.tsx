
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { GovernmentFiling, FilingStatus } from '../types';
import Modal from '../components/Modal';
import { useNotification } from '../contexts/NotificationContext';
import { ArrowUpIcon, ArrowDownIcon } from '../components/Icons';

const FilingForm: React.FC<{ filing: GovernmentFiling; onSave: (filing: GovernmentFiling) => void; onCancel: () => void; }> = ({ filing, onSave, onCancel }) => {
    const [formData, setFormData] = useState<GovernmentFiling>(filing);
    const [file, setFile] = useState<File | null>(null);
    const formInputClass = "w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black placeholder:text-gray-500 dark:border-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary";

    useEffect(() => {
        setFormData(filing);
    }, [filing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value, status: name === 'submission_date' && value ? FilingStatus.SUBMITTED : prev.status }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...formData, attached_file: file || formData.attached_file });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-black dark:text-white">Document Name</label>
                <p className="mt-1 text-lg font-semibold text-black dark:text-white">{formData.document_name}</p>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-black dark:text-white mb-1">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={formInputClass}>
                    {Object.values(FilingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="submission_date" className="block text-sm font-medium text-black dark:text-white mb-1">Submission Date</label>
                <input type="date" id="submission_date" name="submission_date" value={formData.submission_date?.split('T')[0] || ''} onChange={handleChange} className={formInputClass} />
            </div>
            <div>
                <label htmlFor="attached_file" className="block text-sm font-medium text-black dark:text-white mb-1">Attach File</label>
                <input type="file" id="attached_file" name="attached_file" onChange={handleFileChange} className={formInputClass} />
                {formData.attached_file && typeof formData.attached_file === 'string' && <p className="text-xs mt-1 text-body-color dark:text-gray-300">Current file: {formData.attached_file}</p>}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray dark:bg-box-dark-2 hover:opacity-90">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:opacity-90">Update Filing</button>
            </div>
        </form>
    );
};

const FilingsPage: React.FC = () => {
    const [filings, setFilings] = useState<GovernmentFiling[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiling, setSelectedFiling] = useState<GovernmentFiling | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof GovernmentFiling; order: 'asc' | 'desc' } | null>({ key: 'due_date', order: 'asc' });
    const { showToast } = useNotification();
    
    const fetchFilings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getFilings();
            setFilings(data);
        } catch (error) {
            console.error("Failed to fetch filings", error);
            showToast('Failed to load filings.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchFilings();
    }, [fetchFilings]);
    
    const handleSort = (key: keyof GovernmentFiling) => {
        let order: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
            order = 'desc';
        }
        setSortConfig({ key, order });
    };

    const sortedFilings = useMemo(() => {
        let sortableItems = [...filings];
        if (sortConfig !== null) {
            const { key, order } = sortConfig;
            sortableItems.sort((a, b) => {
                const aValue = a[key];
                const bValue = b[key];
                
                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (key === 'due_date' || key === 'submission_date') {
                    const dateA = new Date(aValue as string).getTime();
                    const dateB = new Date(bValue as string).getTime();
                    return (dateA - dateB) * (order === 'asc' ? 1 : -1);
                }
                
                return String(aValue).localeCompare(String(bValue)) * (order === 'asc' ? 1 : -1);
            });
        }
        return sortableItems;
    }, [filings, sortConfig]);


    const handleSave = async (filing: GovernmentFiling) => {
        try {
            await api.updateFiling(filing);
            setSelectedFiling(null);
            showToast('Filing updated successfully!', 'success');
            fetchFilings();
        } catch (error) {
            console.error('Failed to update filing', error);
            showToast('Failed to update filing.', 'error');
        }
    };

    if (loading) return <div className="text-center p-10 text-body-color dark:text-gray-300">Loading filings...</div>;

    return (
        <div className="rounded-lg border border-stroke bg-white dark:bg-box-dark p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Government Filings</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-2 dark:bg-box-dark-2">
                        <tr>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('document_name')}>
                                    Document Name
                                    {sortConfig?.key === 'document_name' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('authority')}>
                                    Authority
                                    {sortConfig?.key === 'authority' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('due_date')}>
                                    Due Date
                                    {sortConfig?.key === 'due_date' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('submission_date')}>
                                    Submitted
                                    {sortConfig?.key === 'submission_date' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('status')}>
                                    Status
                                    {sortConfig?.key === 'status' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFilings.map((f, index) => (
                            <tr key={f.id} onClick={() => setSelectedFiling(f)} className={`cursor-pointer hover:bg-gray dark:hover:bg-box-dark-2 ${index === sortedFilings.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}>
                                <td className="p-4 font-medium text-black dark:text-white">{f.document_name}</td>
                                <td className="p-4 text-body-color dark:text-gray-300">{f.authority}</td>
                                <td className="p-4 text-body-color dark:text-gray-300">{new Date(f.due_date).toLocaleDateString()}</td>
                                <td className="p-4 text-body-color dark:text-gray-300">{f.submission_date ? new Date(f.submission_date).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${f.status === FilingStatus.SUBMITTED ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                        {f.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedFiling && (
                <Modal isOpen={!!selectedFiling} onClose={() => setSelectedFiling(null)} title="Update Government Filing">
                    <FilingForm filing={selectedFiling} onSave={handleSave} onCancel={() => setSelectedFiling(null)} />
                </Modal>
            )}
        </div>
    );
};

export default FilingsPage;
