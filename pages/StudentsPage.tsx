import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { Student, FollowUpRecord, Gender, StudentStatus, SponsorshipStatus, AcademicReport, WellbeingStatus, YesNo, RISK_FACTORS, ParentDetails, HealthStatus, InteractionStatus, TransportationType } from '../types';
import Modal from '../components/Modal';
import { PlusIcon, DocumentAddIcon, ArrowUpIcon, ArrowDownIcon } from '../components/Icons';
import { useNotification } from '../contexts/NotificationContext';

const DetailCard: React.FC<{ title: string; data: Record<string, any> }> = ({ title, data }) => (
    <div className="bg-white dark:bg-box-dark rounded-lg border border-stroke dark:border-strokedark shadow-sm p-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-4 border-b border-stroke dark:border-strokedark pb-2">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                    <p className="text-sm text-body-color dark:text-gray-300 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="font-medium text-black dark:text-white">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}</p>
                </div>
            ))}
        </div>
    </div>
);

const FollowUpDetailModal: React.FC<{ record: FollowUpRecord, onClose: () => void }> = ({ record, onClose }) => {
    const DetailItem: React.FC<{ label: string, value?: string | number | string[], note?: string, noteLabel?: string }> = ({ label, value, note, noteLabel }) => (
        <div className="py-2">
            <p className="text-sm text-body-color dark:text-gray-400">{label}</p>
            <p className="font-medium text-black dark:text-white">{Array.isArray(value) ? value.join(', ') : (value || 'N/A')}</p>
            {note && <p className="text-sm mt-1 pl-2 border-l-2 border-stroke dark:border-strokedark text-body-color dark:text-gray-300"><strong>{noteLabel || 'Notes'}:</strong> {note}</p>}
        </div>
    );

    return (
        <Modal isOpen={true} onClose={onClose} title={`Follow-Up Report: ${new Date(record.date_of_follow_up).toLocaleDateString()}`}>
            <div className="space-y-6">
                <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                    <legend className="px-2 font-medium text-black dark:text-white">Client Information</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Child's Name" value={record.child_name} />
                        <DetailItem label="Current Age" value={record.child_current_age} />
                        <DetailItem label="Location" value={record.location} />
                        <DetailItem label="Parent/Guardian" value={record.parent_guardian} />
                    </div>
                </fieldset>

                <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                    <legend className="px-2 font-medium text-black dark:text-white">Well-being Progress</legend>
                     <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Physical Health" value={record.physical_health} note={record.physical_health_notes} />
                        <DetailItem label="Social Interaction" value={record.social_interaction} note={record.social_interaction_notes} />
                        <DetailItem label="Home Life" value={record.home_life} note={record.home_life_notes} />
                        <DetailItem label="Drugs/Alcohol/Violence" value={record.drugs_alcohol_violence} note={record.drugs_alcohol_violence_notes} />
                    </div>
                </fieldset>
                
                 <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                    <legend className="px-2 font-medium text-black dark:text-white">Risk Factors</legend>
                    <DetailItem label="Identified Risks" value={record.risk_factors_list.length > 0 ? record.risk_factors_list : 'None'} note={record.risk_factors_details} noteLabel="Details"/>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                         <DetailItem label="Condition of Home" value={record.condition_of_home} note={record.condition_of_home_notes} />
                         <DetailItem label="Current Work" value={record.current_work_details} />
                         <DetailItem label="Mother Working" value={record.mother_working} />
                         <DetailItem label="Father Working" value={record.father_working} />
                    </div>
                </fieldset>

                <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                    <legend className="px-2 font-medium text-black dark:text-white">Conclusion</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Completed By" value={record.completed_by} />
                        <DetailItem label="Date Completed" value={new Date(record.date_completed).toLocaleDateString()} />
                        <DetailItem label="Reviewed By" value={record.reviewed_by} />
                        <DetailItem label="Date Reviewed" value={new Date(record.date_reviewed).toLocaleDateString()} />
                        <DetailItem label="Child Protection Concerns" value={record.child_protection_concerns} />
                        <DetailItem label="Human Trafficking Risk" value={record.human_trafficking_risk} />
                    </div>
                </fieldset>

                 <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                    <legend className="px-2 font-medium text-black dark:text-white">Staff Notes</legend>
                    <DetailItem label="General Notes" value={record.staff_notes} />
                    <DetailItem label="Changes / Recommendations" value={record.changes_recommendations} />
                </fieldset>
            </div>
        </Modal>
    );
};


const StudentDetailView: React.FC<{ student: Student, onBack: () => void, onAddFollowUp: () => void, onAddAcademicReport: () => void }> = ({ student, onBack, onAddFollowUp, onAddAcademicReport }) => {
    const [viewingFollowUp, setViewingFollowUp] = useState<FollowUpRecord | null>(null);
    
    return (
        <div className="space-y-6">
            <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:underline">
                &larr; Back to Student List
            </button>

            <div className="bg-white dark:bg-box-dark p-6 rounded-lg border border-stroke dark:border-strokedark shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={student.profile_photo || 'https://i.pravatar.cc/150'} alt="Profile" className="w-32 h-32 rounded-full" />
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-black dark:text-white">{student.first_name} {student.last_name}</h2>
                        <p className="text-body-color dark:text-gray-300">{student.student_id}</p>
                        <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${student.student_status === StudentStatus.ACTIVE ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                {student.student_status}
                            </span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${student.sponsorship_status === SponsorshipStatus.SPONSORED ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                                {student.sponsorship_status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailCard title="Personal Information" data={{ 'Application Date': new Date(student.application_date).toLocaleDateString(), date_of_birth: new Date(student.date_of_birth).toLocaleDateString(), gender: student.gender, city: student.city, 'Village/Slum': student.village_slum, home_location: student.home_location, has_birth_certificate: student.has_birth_certificate }} />
                <DetailCard title="Family Information" data={{ guardian_name: student.guardian_name, guardian_contact_info: student.guardian_contact_info, 'Guardian if not parents': student.guardian_if_not_parents, siblings: student.siblings_count, 'Household Members': student.household_members_count, 'Annual Income': `$${student.annual_income}`, 'Parent Support Level': `${student.parent_support_level}/5` }} />
                <DetailCard title="Father's Details" data={{ 'Living?': student.father_details.is_living, 'At Home?': student.father_details.is_at_home, 'Working?': student.father_details.is_working, Occupation: student.father_details.occupation, Skills: student.father_details.skills }} />
                <DetailCard title="Mother's Details" data={{ 'Living?': student.mother_details.is_living, 'At Home?': student.mother_details.is_at_home, 'Working?': student.mother_details.is_working, Occupation: student.mother_details.occupation, Skills: student.mother_details.skills }} />
                <DetailCard title="Education & Health" data={{ 'Currently in School?': student.currently_in_school, 'Previous Schooling?': student.previous_schooling, 'Grade Before EEP': student.grade_level_before_eep, 'Health Status': student.health_status, 'Interaction': student.interaction_with_others, 'Risk Level': `${student.risk_level}/5` }} />
                <DetailCard title="Program & Sponsorship" data={{ school: student.school, current_grade: student.current_grade, eep_enroll_date: new Date(student.eep_enroll_date).toLocaleDateString(), sponsor_name: student.sponsor_name, has_housing_sponsorship: student.has_housing_sponsorship, has_sponsorship_contract: student.has_sponsorship_contract }} />
            </div>
            
            <div className="bg-white dark:bg-box-dark rounded-lg border border-stroke dark:border-strokedark shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">Academic Reports</h3>
                    <button onClick={onAddAcademicReport} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                        <DocumentAddIcon /> <span className="ml-2">Add Report</span>
                    </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {student.academic_reports && student.academic_reports.length > 0 ? [...student.academic_reports].reverse().map(report => (
                        <div key={report.id} className="bg-gray-2 dark:bg-box-dark-2 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-black dark:text-white">{report.report_period} - {report.grade_level}</p>
                                    <p className="text-sm text-body-color dark:text-gray-300 mt-1">{report.subjects_and_grades}</p>
                                    <p className="text-sm text-body-color dark:text-gray-300 mt-2">
                                        <span className="font-medium text-black dark:text-white">Teacher Comments:</span> {report.teacher_comments}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="font-bold text-lg text-black dark:text-white">{report.overall_average}%</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.pass_fail_status === 'Pass' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                        {report.pass_fail_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-body-color dark:text-gray-300 text-center py-4">No academic reports found.</p>}
                </div>
            </div>
            
            <div className="bg-white dark:bg-box-dark rounded-lg border border-stroke dark:border-strokedark shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">Follow-up Records</h3>
                    <button onClick={onAddFollowUp} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                        <PlusIcon /> <span className="ml-2">Add Follow-up</span>
                    </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {student.follow_up_records && student.follow_up_records.length > 0 ? [...student.follow_up_records].reverse().map(record => (
                        <div key={record.id} onClick={() => setViewingFollowUp(record)} className="bg-gray-2 dark:bg-box-dark-2 p-4 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-box-dark">
                            <p className="font-semibold text-black dark:text-white">Follow-up on: {new Date(record.date_of_follow_up).toLocaleDateString()}</p>
                            <p className="text-sm text-body-color dark:text-gray-300 truncate">{record.staff_notes || 'No general notes'}</p>
                            <p className="text-xs text-body-color dark:text-gray-300 mt-2">Completed By: {record.completed_by}</p>
                        </div>
                    )) : <p className="text-body-color dark:text-gray-300 text-center py-4">No follow-up records found.</p>}
                </div>
            </div>
            {viewingFollowUp && <FollowUpDetailModal record={viewingFollowUp} onClose={() => setViewingFollowUp(null)} />}
        </div>
    );
};

type StudentFormData = Omit<Student, 'profile_photo' | 'academic_reports' | 'follow_up_records' | 'out_of_program_date'> & {
    profile_photo?: File;
};

const StudentForm: React.FC<{ onSave: (student: StudentFormData) => Promise<void>, onCancel: () => void }> = ({ onSave, onCancel }) => {
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState<StudentFormData>({
        student_id: '', first_name: '', last_name: '', date_of_birth: '', gender: Gender.MALE, school: '', current_grade: '',
        eep_enroll_date: today, student_status: StudentStatus.PENDING_QUALIFICATION, sponsorship_status: SponsorshipStatus.UNSPONSORED,
        has_housing_sponsorship: false, sponsor_name: '',
        application_date: today, has_birth_certificate: false, siblings_count: 0, household_members_count: 0,
        city: '', village_slum: '', guardian_name: '', guardian_contact_info: '', home_location: '',
        father_details: { is_living: YesNo.NA, is_at_home: YesNo.NA, is_working: YesNo.NA, occupation: '', skills: '' },
        mother_details: { is_living: YesNo.NA, is_at_home: YesNo.NA, is_working: YesNo.NA, occupation: '', skills: '' },
        annual_income: 0, guardian_if_not_parents: '', parent_support_level: 3, closest_private_school: '',
        currently_in_school: YesNo.NA, previous_schooling: YesNo.NA,
        previous_schooling_details: { when: '', how_long: '', where: '' },
        grade_level_before_eep: '', child_responsibilities: '', health_status: HealthStatus.AVERAGE, health_issues: '',
        interaction_with_others: InteractionStatus.AVERAGE, interaction_issues: '', child_story: '', other_notes: '',
        risk_level: 3, transportation: TransportationType.WALKING, has_sponsorship_contract: false
    });
    const formInputClass = "w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black placeholder:text-gray-600 dark:border-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary";
    const labelClass = "block text-sm font-medium text-black dark:text-white mb-1";
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value,
                }
            }));
            return;
        }

        if (type === 'file') {
            const file = (e.target as HTMLInputElement).files?.[0];
            setFormData(prev => ({ ...prev, [name]: file || undefined }));
        } else {
            const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) : value;
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };
    
    const ParentDetailsForm: React.FC<{ type: 'father' | 'mother', data: ParentDetails }> = ({ type, data }) => (
        <fieldset className="border border-stroke dark:border-strokedark p-3 rounded-md">
            <legend className="px-2 text-sm font-medium text-black dark:text-white capitalize">{type}'s Details</legend>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div><label className={labelClass}>Living?</label><select name={`${type}_details.is_living`} value={data.is_living} onChange={handleChange} className={formInputClass}>{Object.values(YesNo).map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                <div><label className={labelClass}>At Home?</label><select name={`${type}_details.is_at_home`} value={data.is_at_home} onChange={handleChange} className={formInputClass}>{Object.values(YesNo).map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                <div><label className={labelClass}>Working?</label><select name={`${type}_details.is_working`} value={data.is_working} onChange={handleChange} className={formInputClass}>{Object.values(YesNo).map(v => <option key={v} value={v}>{v}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <input type="text" name={`${type}_details.occupation`} placeholder="Occupation" value={data.occupation} onChange={handleChange} className={formInputClass} />
                 <input type="text" name={`${type}_details.skills`} placeholder="Skills" value={data.skills} onChange={handleChange} className={formInputClass} />
            </div>
        </fieldset>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Personal & Family Information</legend>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="student_id" placeholder="Student ID" value={formData.student_id} onChange={handleChange} className={formInputClass} required />
                        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className={formInputClass} required />
                        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className={formInputClass} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div><label className={labelClass}>Date of Birth</label><input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className={formInputClass} required /></div>
                        <select name="gender" value={formData.gender} onChange={handleChange} className={`${formInputClass} mt-7`}>{Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}</select>
                         <div><label className={labelClass}>Application Date</label><input type="date" name="application_date" value={formData.application_date} onChange={handleChange} className={formInputClass} required /></div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className={formInputClass} />
                        <input type="text" name="village_slum" placeholder="Village / Slum" value={formData.village_slum} onChange={handleChange} className={formInputClass} />
                     </div>
                      <ParentDetailsForm type="father" data={formData.father_details} />
                      <ParentDetailsForm type="mother" data={formData.mother_details} />
                </div>
            </fieldset>

            <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Education & Health</legend>
                <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className={labelClass}>Currently in school?</label><select name="currently_in_school" value={formData.currently_in_school} onChange={handleChange} className={formInputClass}>{Object.values(YesNo).map(v=><option key={v} value={v}>{v}</option>)}</select></div>
                        <div><label className={labelClass}>Previous schooling?</label><select name="previous_schooling" value={formData.previous_schooling} onChange={handleChange} className={formInputClass}>{Object.values(YesNo).map(v=><option key={v} value={v}>{v}</option>)}</select></div>
                     </div>
                     {formData.previous_schooling === YesNo.YES && (
                        <div className="grid grid-cols-3 gap-4 border p-3 rounded-md">
                            <input type="text" name="previous_schooling_details.when" placeholder="When?" value={formData.previous_schooling_details.when} onChange={handleChange} className={formInputClass} />
                            <input type="text" name="previous_schooling_details.how_long" placeholder="How long?" value={formData.previous_schooling_details.how_long} onChange={handleChange} className={formInputClass} />
                            <input type="text" name="previous_schooling_details.where" placeholder="Where?" value={formData.previous_schooling_details.where} onChange={handleChange} className={formInputClass} />
                        </div>
                     )}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className={labelClass}>Health Status</label><select name="health_status" value={formData.health_status} onChange={handleChange} className={formInputClass}>{Object.values(HealthStatus).map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                         <div><label className={labelClass}>Interaction with Others</label><select name="interaction_with_others" value={formData.interaction_with_others} onChange={handleChange} className={formInputClass}>{Object.values(InteractionStatus).map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                     </div>
                </div>
            </fieldset>

             <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Notes & Risk Assessment</legend>
                 <div className="space-y-4">
                    <textarea name="child_story" placeholder="Their Story / Why do they want to go to school?" value={formData.child_story} onChange={handleChange} className={`${formInputClass} min-h-[100px]`}></textarea>
                    <textarea name="other_notes" placeholder="Other Notes" value={formData.other_notes} onChange={handleChange} className={`${formInputClass} min-h-[100px]`}></textarea>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="risk_level" className={labelClass}>Risk Level (1=Lowest, 5=Highest)</label>
                             <input type="range" id="risk_level" name="risk_level" min="1" max="5" value={formData.risk_level} onChange={handleChange} className="w-full" />
                             <div className="text-center font-bold text-lg">{formData.risk_level}</div>
                        </div>
                        <div>
                             <label htmlFor="parent_support_level" className={labelClass}>Parent Support (1=Lowest, 5=Highest)</label>
                             <input type="range" id="parent_support_level" name="parent_support_level" min="1" max="5" value={formData.parent_support_level} onChange={handleChange} className="w-full" />
                             <div className="text-center font-bold text-lg">{formData.parent_support_level}</div>
                        </div>
                     </div>
                 </div>
            </fieldset>

             <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Program Enrollment</legend>
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" name="school" placeholder="School" value={formData.school} onChange={handleChange} className={formInputClass} required />
                         <input type="text" name="current_grade" placeholder="Current Grade" value={formData.current_grade} onChange={handleChange} className={formInputClass} required />
                         <div><label className={labelClass}>EEP Enroll Date</label><input type="date" name="eep_enroll_date" value={formData.eep_enroll_date} onChange={handleChange} className={formInputClass} required /></div>
                         <select name="student_status" value={formData.student_status} onChange={handleChange} className={`${formInputClass} mt-7`}>{Object.values(StudentStatus).map(s => <option key={s} value={s}>{s}</option>)}</select>
                    </div>
                     <div className="pt-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 text-black dark:text-white"><input type="checkbox" name="has_birth_certificate" checked={formData.has_birth_certificate} onChange={handleChange} /> Has Birth Certificate?</label>
                        <label className="flex items-center gap-2 text-black dark:text-white"><input type="checkbox" name="has_sponsorship_contract" checked={formData.has_sponsorship_contract} onChange={handleChange} /> Has Sponsorship Contract?</label>
                    </div>
                 </div>
            </fieldset>
            

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray dark:bg-box-dark-2 hover:opacity-90">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:opacity-90 disabled:opacity-50" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Student'}
                </button>
            </div>
        </form>
    );
};

type AcademicReportFormData = Omit<AcademicReport, 'id' | 'student_id'>;

const AcademicReportForm: React.FC<{ onSave: (report: AcademicReportFormData) => Promise<void>; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<AcademicReportFormData>({
        report_period: '',
        grade_level: '',
        subjects_and_grades: '',
        overall_average: 0,
        pass_fail_status: 'Pass',
        teacher_comments: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const formInputClass = "w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black placeholder:text-gray-600 dark:border-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'overall_average' ? parseFloat(value) : value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="report_period" placeholder="Report Period (e.g., Term 1 2024)" value={formData.report_period} onChange={handleChange} className={formInputClass} required />
                <input type="text" name="grade_level" placeholder="Grade Level" value={formData.grade_level} onChange={handleChange} className={formInputClass} required />
            </div>
            <textarea name="subjects_and_grades" placeholder="Subjects and Grades (e.g., Math: A, Science: B+)" value={formData.subjects_and_grades} onChange={handleChange} className={`${formInputClass} min-h-[120px]`} required></textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" step="0.1" name="overall_average" placeholder="Overall Average (%)" value={formData.overall_average} onChange={handleChange} className={formInputClass} required />
                <select name="pass_fail_status" value={formData.pass_fail_status} onChange={handleChange} className={formInputClass} required>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                </select>
            </div>
            <textarea name="teacher_comments" placeholder="Teacher Comments" value={formData.teacher_comments} onChange={handleChange} className={`${formInputClass} min-h-[120px]`} required></textarea>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray dark:bg-box-dark-2 hover:opacity-90">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:opacity-90 disabled:opacity-50" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Report'}
                </button>
            </div>
        </form>
    );
};


type FollowUpFormData = Omit<FollowUpRecord, 'id' | 'student_id'>;

const FollowUpForm: React.FC<{ student: Student; onSave: (record: FollowUpFormData) => Promise<void>; onCancel: () => void }> = ({ student, onSave, onCancel }) => {
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState<FollowUpFormData>({
        child_name: `${student.first_name} ${student.last_name}`,
        child_current_age: new Date().getFullYear() - new Date(student.date_of_birth).getFullYear(),
        date_of_follow_up: today,
        location: student.home_location,
        parent_guardian: student.guardian_name,
        physical_health: WellbeingStatus.NA,
        physical_health_notes: '',
        social_interaction: WellbeingStatus.NA,
        social_interaction_notes: '',
        home_life: WellbeingStatus.NA,
        home_life_notes: '',
        drugs_alcohol_violence: YesNo.NA,
        drugs_alcohol_violence_notes: '',
        risk_factors_list: [],
        risk_factors_details: '',
        condition_of_home: WellbeingStatus.NA,
        condition_of_home_notes: '',
        mother_working: YesNo.NA,
        father_working: YesNo.NA,
        other_family_member_working: YesNo.NA,
        current_work_details: '',
        attending_church: YesNo.NA,
        school_name: student.school,
        grade_level: student.current_grade,
        attendance: '',
        subjects_grades: [],
        learning_difficulties: YesNo.NA,
        learning_difficulties_notes: '',
        behaviour_in_class: WellbeingStatus.NA,
        behaviour_in_class_notes: '',
        peer_issues: YesNo.NA,
        peer_issues_notes: '',
        teacher_involvement: YesNo.NA,
        teacher_involvement_notes: '',
        transportation: WellbeingStatus.NA,
        transportation_notes: '',
        tutoring_participation: WellbeingStatus.NA,
        tutoring_participation_notes: '',
        staff_notes: '',
        changes_recommendations: '',
        child_protection_concerns: YesNo.NO,
        human_trafficking_risk: YesNo.NO,
        completed_by: 'Admin User',
        date_completed: today,
        reviewed_by: '',
        date_reviewed: today,
    });
    const [isSaving, setIsSaving] = useState(false);
    const formInputClass = "w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black placeholder:text-gray-600 dark:border-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary";
    const labelClass = "block text-sm font-medium text-black dark:text-white mb-1";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === "risk_factors_list") {
            setFormData(prev => ({
                ...prev,
                risk_factors_list: checked ? [...prev.risk_factors_list, value] : prev.risk_factors_list.filter(item => item !== value)
            }));
        } else {
             setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };
    
    const WellbeingSelect: React.FC<{name: keyof FollowUpFormData, label: string, noteName: keyof FollowUpFormData, noteLabel: string}> = ({name, label, noteName, noteLabel}) => (
         <div>
            <label className={labelClass}>{label}</label>
            <select name={name} value={formData[name] as string} onChange={handleChange} className={formInputClass}>
                {Object.values(WellbeingStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
             {(formData[name] === WellbeingStatus.AVERAGE || formData[name] === WellbeingStatus.POOR) && (
                <textarea name={noteName} value={formData[noteName] as string} onChange={handleChange} placeholder={noteLabel} className={`${formInputClass} mt-2`}></textarea>
             )}
        </div>
    );
    
    const YesNoSelect: React.FC<{name: keyof FollowUpFormData, label: string, noteName: keyof FollowUpFormData, noteLabel: string}> = ({name, label, noteName, noteLabel}) => (
        <div>
            <label className={labelClass}>{label}</label>
            <select name={name} value={formData[name] as string} onChange={handleChange} className={formInputClass}>
                {Object.values(YesNo).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {formData[name] === YesNo.YES && (
                 <textarea name={noteName} value={formData[noteName] as string} onChange={handleChange} placeholder={noteLabel} className={`${formInputClass} mt-2`}></textarea>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Section 1: Client Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="child_name" value={formData.child_name} onChange={handleChange} className={formInputClass} required disabled />
                    <input type="number" name="child_current_age" placeholder="Current Age" value={formData.child_current_age} onChange={handleChange} className={formInputClass} required />
                    <input type="date" name="date_of_follow_up" value={formData.date_of_follow_up} onChange={handleChange} className={formInputClass} required />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={formInputClass} required />
                    <div className="md:col-span-2">
                        <input type="text" name="parent_guardian" placeholder="Parent/Guardian present" value={formData.parent_guardian} onChange={handleChange} className={formInputClass} required />
                    </div>
                </div>
            </fieldset>

            <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Section 2: Well-being Progress</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <WellbeingSelect name="physical_health" label="Physical Health" noteName="physical_health_notes" noteLabel="Main problem and how we can help..." />
                    <WellbeingSelect name="social_interaction" label="Social Interaction" noteName="social_interaction_notes" noteLabel="Main problem and how we can help..." />
                    <WellbeingSelect name="home_life" label="Home Life" noteName="home_life_notes" noteLabel="Main problem and how we can help..." />
                    <YesNoSelect name="drugs_alcohol_violence" label="Drugs, Alcohol, or Violence?" noteName="drugs_alcohol_violence_notes" noteLabel="What evidence you learned about..." />
                </div>
            </fieldset>

            <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Section 2a: Risk Factors</legend>
                <label className={labelClass}>Current Risk Factors (Select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-2 dark:bg-box-dark-2 rounded-md">
                    {RISK_FACTORS.map(risk => (
                        <label key={risk} className="flex items-center gap-2 text-sm text-black dark:text-white">
                            <input type="checkbox" name="risk_factors_list" value={risk} checked={formData.risk_factors_list.includes(risk)} onChange={handleChange} />
                            {risk}
                        </label>
                    ))}
                </div>
                <textarea name="risk_factors_details" value={formData.risk_factors_details} onChange={handleChange} placeholder="Share details for ALL selections chosen above." className={`${formInputClass} mt-4`}></textarea>
            </fieldset>
            
            <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Section 4: Staff Notes</legend>
                <textarea name="staff_notes" placeholder="Notes - Please write any information you learned that is not included in this form." value={formData.staff_notes} onChange={handleChange} className={`${formInputClass} min-h-[120px]`}></textarea>
                <textarea name="changes_recommendations" placeholder="Changes/Recommendations - Please share any changes that you believe may be helpful." value={formData.changes_recommendations} onChange={handleChange} className={`${formInputClass} min-h-[120px] mt-4`}></textarea>
            </fieldset>
            
             <fieldset className="border border-stroke dark:border-strokedark p-4 rounded-md">
                <legend className="px-2 font-medium text-black dark:text-white">Section 5: Conclusion</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Child Protection Concerns?</label>
                        <select name="child_protection_concerns" value={formData.child_protection_concerns} onChange={handleChange} className={formInputClass}>
                            {Object.values(YesNo).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className={labelClass}>Increased Risk of Human Trafficking?</label>
                        <select name="human_trafficking_risk" value={formData.human_trafficking_risk} onChange={handleChange} className={formInputClass}>
                            {Object.values(YesNo).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <input type="text" name="completed_by" placeholder="Completed By" value={formData.completed_by} onChange={handleChange} className={formInputClass} required />
                     <input type="text" name="reviewed_by" placeholder="Reviewed By" value={formData.reviewed_by} onChange={handleChange} className={formInputClass} />
                 </div>
            </fieldset>

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray dark:bg-box-dark-2 hover:opacity-90">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:opacity-90 disabled:opacity-50" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Record'}
                </button>
            </div>
        </form>
    );
};


const StudentsPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);
    const [isAddingAcademicReport, setIsAddingAcademicReport] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Student; order: 'asc' | 'desc' } | null>(null);
    const { showToast } = useNotification();

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students", error);
            showToast('Failed to load students.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleSort = (key: keyof Student) => {
        let order: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
            order = 'desc';
        }
        setSortConfig({ key, order });
    };

    const sortedAndFilteredStudents = useMemo(() => {
        const filtered = students.filter(s =>
            `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.student_id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) {
                    return sortConfig.order === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.order === 'asc' ? 1 : -1;
                }
                // Secondary sort by last name if first names are equal
                if (sortConfig.key === 'first_name') {
                    return a.last_name.localeCompare(b.last_name);
                }
                return 0;
            });
        }
        
        return filtered;
    }, [students, searchTerm, sortConfig]);

    const handleSaveStudent = async (studentData: StudentFormData) => {
        try {
            await api.addStudent(studentData);
            setIsAddingStudent(false);
            showToast('Student added successfully!', 'success');
            fetchStudents();
        } catch (error: any) {
            console.error("Failed to add student", error);
            showToast(error.message || 'Failed to add student.', 'error');
        }
    };
    
    const handleSaveAcademicReport = async (reportData: AcademicReportFormData) => {
        if (selectedStudent) {
            try {
                await api.addAcademicReport(selectedStudent.student_id, reportData);
                setIsAddingAcademicReport(false);
                const updatedStudent = await api.getStudentById(selectedStudent.student_id);
                setSelectedStudent(updatedStudent || null);
                showToast('Academic report added.', 'success');
            } catch (error) {
                console.error('Failed to add academic report', error);
                showToast('Failed to add academic report.', 'error');
            }
        }
    };

    const handleSaveFollowUp = async (recordData: Omit<FollowUpRecord, 'id' | 'student_id'>) => {
        if (selectedStudent) {
            try {
                await api.addFollowUpRecord(selectedStudent.student_id, recordData);
                setIsAddingFollowUp(false);
                const updatedStudent = await api.getStudentById(selectedStudent.student_id);
                setSelectedStudent(updatedStudent || null);
                showToast('Follow-up record added.', 'success');
            } catch (error) {
                console.error('Failed to add follow up', error);
                showToast('Failed to add follow-up record.', 'error');
            }
        }
    };

    if (loading) return <div className="text-center p-10 text-body-color dark:text-gray-300">Loading students...</div>;

    if (selectedStudent) {
        return (
            <>
                <StudentDetailView
                    student={selectedStudent}
                    onBack={() => setSelectedStudent(null)}
                    onAddFollowUp={() => setIsAddingFollowUp(true)}
                    onAddAcademicReport={() => setIsAddingAcademicReport(true)}
                />
                <Modal
                    isOpen={isAddingFollowUp}
                    onClose={() => setIsAddingFollowUp(false)}
                    title={`New Follow-up for ${selectedStudent.first_name}`}
                >
                   <FollowUpForm student={selectedStudent} onSave={handleSaveFollowUp} onCancel={() => setIsAddingFollowUp(false)} />
                </Modal>
                <Modal
                    isOpen={isAddingAcademicReport}
                    onClose={() => setIsAddingAcademicReport(false)}
                    title={`Add Academic Report for ${selectedStudent.first_name}`}
                >
                   <AcademicReportForm onSave={handleSaveAcademicReport} onCancel={() => setIsAddingAcademicReport(false)} />
                </Modal>
            </>
        );
    }
    
    return (
        <div className="rounded-lg border border-stroke bg-white dark:bg-box-dark p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-1/3">
                    <input
                        type="text"
                        placeholder="Search students by name or ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-2 py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black placeholder:text-gray-600 dark:border-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary"
                    />
                </div>
                <button onClick={() => setIsAddingStudent(true)} className="flex w-full sm:w-auto justify-center items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <PlusIcon /> <span className="ml-2">Add Student</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-2 dark:bg-box-dark-2">
                            <th className="p-4 font-medium text-black dark:text-white">
                                 <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('first_name')}>
                                    Name
                                    {sortConfig?.key === 'first_name' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('current_grade')}>
                                    Grade
                                    {sortConfig?.key === 'current_grade' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('student_status')}>
                                    Status
                                    {sortConfig?.key === 'student_status' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                            <th className="p-4 font-medium text-black dark:text-white">
                                <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors" onClick={() => handleSort('sponsorship_status')}>
                                    Sponsorship
                                    {sortConfig?.key === 'sponsorship_status' && (sortConfig.order === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredStudents.map((student, index) => (
                            <tr key={student.student_id} onClick={() => setSelectedStudent(student)} className={`cursor-pointer hover:bg-gray dark:hover:bg-box-dark-2 ${index === sortedAndFilteredStudents.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}>
                                <td className="p-4 text-black dark:text-white">
                                    <div className="flex items-center gap-3">
                                        <img src={student.profile_photo} alt="avatar" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-medium">{student.first_name} {student.last_name}</p>
                                            <p className="text-sm text-body-color dark:text-gray-300">{student.student_id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-body-color dark:text-gray-300">{student.current_grade}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.student_status === StudentStatus.ACTIVE ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{student.student_status}</span></td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.sponsorship_status === SponsorshipStatus.SPONSORED ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{student.sponsorship_status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Fix: Changed lowercase `modal` to uppercase `Modal`. React components must be capitalized. */}
            <Modal isOpen={isAddingStudent} onClose={() => setIsAddingStudent(false)} title="Create New Student Record">
                <StudentForm onSave={handleSaveStudent} onCancel={() => setIsAddingStudent(false)} />
            </Modal>
        </div>
    );
};

export default StudentsPage;