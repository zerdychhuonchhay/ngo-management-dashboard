import { Student, Transaction, GovernmentFiling, Gender, StudentStatus, SponsorshipStatus, TransactionType, FilingStatus, FollowUpRecord, AcademicReport, YesNo, HealthStatus, InteractionStatus, TransportationType, Task, TaskStatus, TaskPriority } from '../types';

// --- LocalStorage Helper Functions ---
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        // If item exists, JSON.parse creates a new object graph.
        // If item does NOT exist, we must return a deep copy of the default value
        // to prevent the caller from mutating the module-level default array.
        return item ? JSON.parse(item) : JSON.parse(JSON.stringify(defaultValue));
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return JSON.parse(JSON.stringify(defaultValue));
    }
};

const saveToStorage = <T,>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage key “${key}”:`, error);
    }
};

// --- Mock Data (Defaults) ---
const defaultStudents: Student[] = [
    { 
        student_id: 'CPB00001', first_name: 'John', last_name: 'Doe', date_of_birth: '2010-05-15', gender: Gender.MALE, profile_photo: 'https://i.pravatar.cc/150?u=CPB00001', 
        school: 'Hope International School', current_grade: '8th Grade', eep_enroll_date: '2018-01-20', student_status: StudentStatus.ACTIVE, sponsorship_status: SponsorshipStatus.SPONSORED, has_housing_sponsorship: false, sponsor_name: 'Jane Smith',
        application_date: '2018-01-10', has_birth_certificate: true, siblings_count: 2, household_members_count: 5, city: 'Nairobi', village_slum: 'Kibera', guardian_name: 'Mary Doe', guardian_contact_info: '123-456-7890', home_location: 'Kibera Slum',
        father_details: { is_living: YesNo.YES, is_at_home: YesNo.YES, is_working: YesNo.YES, occupation: 'Carpenter', skills: 'Woodworking' },
        mother_details: { is_living: YesNo.YES, is_at_home: YesNo.YES, is_working: YesNo.NO, occupation: 'Homemaker', skills: 'Sewing' },
        annual_income: 5000, guardian_if_not_parents: '', parent_support_level: 4, closest_private_school: 'Hope Intl.', currently_in_school: YesNo.YES, previous_schooling: YesNo.NO,
        previous_schooling_details: { when: '', how_long: '', where: '' }, grade_level_before_eep: '1st Grade', child_responsibilities: 'Fetching water', health_status: HealthStatus.GOOD, health_issues: '',
        interaction_with_others: InteractionStatus.GOOD, interaction_issues: '', child_story: 'Eager to learn.', other_notes: '', risk_level: 2, transportation: TransportationType.WALKING, has_sponsorship_contract: true,
        academic_reports: [
            { id: 'AR001', student_id: 'CPB00001', report_period: 'Term 2 2024', grade_level: '8th Grade', subjects_and_grades: 'Math: A, Science: B+, English: A-', overall_average: 88.5, pass_fail_status: 'Pass', teacher_comments: 'Excellent progress in Math.' },
        ], 
        follow_up_records: [] 
    },
    { 
        student_id: 'CPB00002', first_name: 'Alice', last_name: 'Williams', date_of_birth: '2012-08-22', gender: Gender.FEMALE, profile_photo: 'https://i.pravatar.cc/150?u=CPB00002', 
        school: 'Future Leaders Academy', current_grade: '6th Grade', eep_enroll_date: '2019-03-10', student_status: StudentStatus.ACTIVE, sponsorship_status: SponsorshipStatus.UNSPONSORED, has_housing_sponsorship: true,
        application_date: '2019-02-15', has_birth_certificate: false, siblings_count: 3, household_members_count: 6, city: 'Nairobi', village_slum: 'Mathare', guardian_name: 'Peter Williams', guardian_contact_info: '987-654-3210', home_location: 'Mathare Slum',
        father_details: { is_living: YesNo.NO, is_at_home: YesNo.NA, is_working: YesNo.NA, occupation: '', skills: '' },
        mother_details: { is_living: YesNo.YES, is_at_home: YesNo.YES, is_working: YesNo.YES, occupation: 'Street Vendor', skills: 'Sales' },
        annual_income: 3000, guardian_if_not_parents: 'Uncle', parent_support_level: 3, closest_private_school: 'Future Leaders', currently_in_school: YesNo.YES, previous_schooling: YesNo.YES,
        previous_schooling_details: { when: '2018', how_long: '1 year', where: 'Local school' }, grade_level_before_eep: 'Kindergarten', child_responsibilities: 'Caring for younger siblings', health_status: HealthStatus.AVERAGE, health_issues: 'Frequent colds',
        interaction_with_others: InteractionStatus.GOOD, interaction_issues: '', child_story: 'Wants to be a doctor.', other_notes: 'Needs nutritional support.', risk_level: 4, transportation: TransportationType.WALKING, has_sponsorship_contract: true,
        academic_reports: [], 
        follow_up_records: [] 
    },
];

const defaultTransactions: Transaction[] = [
    { id: 'T001', date: '2024-07-20', description: 'School Fees - Term 3', location: 'Hope Int. School', amount: 250.00, type: TransactionType.EXPENSE, category: 'School Fees', student_id: 'CPB00001' },
    { id: 'T002', date: '2024-07-18', description: 'Monthly Donation', location: 'Online', amount: 500.00, type: TransactionType.INCOME, category: 'Donation' },
    { id: 'T003', date: '2024-07-15', description: 'Hot Lunches Program', location: 'Catering Service', amount: 150.00, type: TransactionType.EXPENSE, category: 'Hot Lunches' },
    { id: 'T004', date: '2024-06-10', description: 'Office Gas Bill', location: 'Gas Company', amount: 75.50, type: TransactionType.EXPENSE, category: 'Utilities' },
    { id: 'T005', date: '2024-06-05', description: 'Sponsor gift for Alice', location: 'Supermarket', amount: 25.00, type: TransactionType.EXPENSE, category: 'Gifts', student_id: 'CPB00002' },
    { id: 'T006', date: '2024-05-02', description: 'Grant from Foundation', location: 'Bank Transfer', amount: 2500.00, type: TransactionType.INCOME, category: 'Grant' },
];

const defaultFilings: GovernmentFiling[] = [
    { id: 'F001', document_name: 'Annual NGO Report', authority: 'NGO Coordination Board', due_date: '2024-08-31', status: FilingStatus.PENDING },
    { id: 'F002', document_name: 'Q2 Tax Filing', authority: 'Revenue Authority', due_date: '2024-07-30', submission_date: '2024-07-22', status: FilingStatus.SUBMITTED },
];

const defaultTasks: Task[] = [
    { id: 'TASK-001', title: 'Prepare Q3 Sponsor Reports', description: 'Compile academic reports and follow-up notes for all sponsored students.', dueDate: '2024-09-15', priority: TaskPriority.HIGH, status: TaskStatus.IN_PROGRESS },
    { id: 'TASK-002', title: 'Organize Annual Fundraiser Event', description: 'Book venue, contact vendors, and prepare marketing materials.', dueDate: '2024-10-30', priority: TaskPriority.HIGH, status: TaskStatus.TO_DO },
    { id: 'TASK-003', title: 'Renew Business Permit', description: 'Submit all necessary paperwork to the local city council.', dueDate: '2024-08-20', priority: TaskPriority.MEDIUM, status: TaskStatus.DONE },
    { id: 'TASK-004', title: 'Update Website with New Student Profiles', description: 'Add profiles for 5 new students who joined in July.', dueDate: '2024-08-10', priority: TaskPriority.LOW, status: TaskStatus.TO_DO },
];

// --- Storage Keys ---
const STORAGE_KEYS = {
    STUDENTS: 'ngo_students',
    TRANSACTIONS: 'ngo_transactions',
    FILINGS: 'ngo_filings',
    TASKS: 'ngo_tasks',
};

// --- Data Initialization ---
const initializeData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        saveToStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FILINGS)) {
        saveToStorage(STORAGE_KEYS.FILINGS, defaultFilings);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        saveToStorage(STORAGE_KEYS.TASKS, defaultTasks);
    }
};
initializeData();


const simulateNetwork = <T,>(data: T, errorRate = 0): Promise<T> => 
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < errorRate) {
                reject(new Error('A network error occurred.'));
            } else {
                resolve(data);
            }
        }, 500);
    });

type StudentFormData = Omit<Student, 'profile_photo' | 'academic_reports' | 'follow_up_records' | 'out_of_program_date'> & { profile_photo?: File };

export const api = {
    getDashboardStats: async () => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
        const filings = getFromStorage(STORAGE_KEYS.FILINGS, defaultFilings);

        const totalStudents = students.length;
        const activeStudents = students.filter(s => s.student_status === StudentStatus.ACTIVE).length;
        const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        const upcomingFilings = filings.filter(f => f.status === FilingStatus.PENDING).length;

        const monthlyBreakdown = transactions.reduce((acc, t) => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!acc[monthKey]) {
                acc[monthKey] = {
                    month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
                    income: 0,
                    expense: 0,
                };
            }
            if (t.type === TransactionType.INCOME) {
                acc[monthKey].income += t.amount;
            } else {
                acc[monthKey].expense += t.amount;
            }
            return acc;
        }, {} as Record<string, { month: string; income: number; expense: number }>);
        
        const sortedMonthlyData = Object.keys(monthlyBreakdown)
            .sort()
            .map(key => monthlyBreakdown[key]);

        return simulateNetwork({
            totalStudents,
            activeStudents,
            netBalance: totalIncome - totalExpense,
            upcomingFilings,
            incomeVsExpense: { income: totalIncome, expense: totalExpense },
            studentStatusDistribution: students.reduce((acc, s) => {
                acc[s.student_status] = (acc[s.student_status] || 0) + 1;
                return acc;
            }, {} as Record<StudentStatus, number>),
            monthlyBreakdown: sortedMonthlyData,
        });
    },

    getStudents: async () => simulateNetwork(getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents)),

    getStudentById: async (id: string) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const student = students.find(s => s.student_id === id);
        return simulateNetwork(student ? JSON.parse(JSON.stringify(student)) : undefined);
    },

    addStudent: async (studentData: Omit<Student, 'profile_photo' | 'academic_reports' | 'follow_up_records'> & { profile_photo?: File }) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        if (students.some(s => s.student_id === studentData.student_id)) {
            return new Promise((_, reject) => setTimeout(() => reject(new Error(`Student ID ${studentData.student_id} already exists.`)), 500));
        }

        let photoUrl = `https://i.pravatar.cc/150?u=${studentData.student_id}`;

        if (studentData.profile_photo) {
            photoUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(studentData.profile_photo as File);
            });
        }

        const { profile_photo, ...restOfStudentData } = studentData;

        const newStudent: Student = {
            ...restOfStudentData,
            profile_photo: photoUrl,
            academic_reports: [],
            follow_up_records: [],
        };
        const newStudents = [newStudent, ...students];
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        return simulateNetwork(newStudent);
    },

    updateStudent: async (studentData: StudentFormData) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const index = students.findIndex(s => s.student_id === studentData.student_id);
        if (index === -1) {
            throw new Error('Student not found for update.');
        }

        const existingStudent = students[index];
        let photoUrl = existingStudent.profile_photo;

        if (studentData.profile_photo instanceof File) {
            photoUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(studentData.profile_photo);
            });
        }
        
        const { profile_photo, ...restOfStudentData } = studentData;

        const updatedStudent: Student = {
            ...existingStudent,
            ...restOfStudentData,
            profile_photo: photoUrl,
        };
        
        const updatedStudents = students.map((s, i) => (i === index ? updatedStudent : s));
        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
        return simulateNetwork(updatedStudent);
    },

    deleteStudent: async (studentId: string) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const updatedStudents = students.filter(s => s.student_id !== studentId);
        if (students.length === updatedStudents.length) {
            throw new Error('Student not found for deletion.');
        }
        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
        return simulateNetwork({ success: true });
    },

    getAllAcademicReports: async (): Promise<AcademicReport[]> => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const allReports = students.flatMap(student => 
            (student.academic_reports || []).map(report => ({
                ...report,
                student_name: `${student.first_name} ${student.last_name}`,
            }))
        );
        return simulateNetwork(allReports);
    },

    addAcademicReport: async (studentId: string, report: Omit<AcademicReport, 'id' | 'student_id'>) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const studentIndex = students.findIndex(s => s.student_id === studentId);
        if (studentIndex !== -1) {
            const student = students[studentIndex];
            const newReport: AcademicReport = { ...report, id: `AR-${Date.now()}`, student_id: studentId };
            
            const updatedStudent = {
                ...student,
                academic_reports: [...(student.academic_reports || []), newReport]
            };
    
            const updatedStudents = students.map((s, index) => 
                index === studentIndex ? updatedStudent : s
            );
            
            saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
            return simulateNetwork(newReport);
        }
        throw new Error('Student not found');
    },

    updateAcademicReport: async (studentId: string, reportId: string, updatedReportData: Omit<AcademicReport, 'id' | 'student_id' | 'student_name'>): Promise<AcademicReport> => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const studentIndex = students.findIndex(s => s.student_id === studentId);
        if (studentIndex === -1) {
            throw new Error('Student not found');
        }

        const student = students[studentIndex];
        const reportIndex = student.academic_reports?.findIndex(r => r.id === reportId) ?? -1;
        if (reportIndex === -1) {
            throw new Error('Academic report not found');
        }

        const finalReport: AcademicReport = {
            ...student.academic_reports![reportIndex],
            ...updatedReportData,
        };

        const updatedReports = student.academic_reports!.map((r, i) => 
            i === reportIndex ? finalReport : r
        );
        
        const updatedStudent: Student = { ...student, academic_reports: updatedReports };
        const updatedStudents = students.map((s, i) => (i === studentIndex ? updatedStudent : s));
        
        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
        return simulateNetwork(finalReport);
    },

    deleteAcademicReport: async (studentId: string, reportId: string): Promise<{ success: true }> => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const studentIndex = students.findIndex(s => s.student_id === studentId);
        if (studentIndex === -1) {
            throw new Error('Student not found');
        }

        const student = students[studentIndex];
        const initialReportCount = student.academic_reports?.length ?? 0;
        const updatedReports = student.academic_reports?.filter(r => r.id !== reportId) ?? [];

        if (initialReportCount === updatedReports.length) {
            throw new Error('Academic report not found for deletion');
        }

        const updatedStudent: Student = { ...student, academic_reports: updatedReports };
        const updatedStudents = students.map((s, i) => (i === studentIndex ? updatedStudent : s));

        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
        return simulateNetwork({ success: true });
    },

    addFollowUpRecord: async (studentId: string, record: Omit<FollowUpRecord, 'id' | 'student_id'>) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const studentIndex = students.findIndex(s => s.student_id === studentId);
        if (studentIndex !== -1) {
            const student = students[studentIndex];
            const newRecord: FollowUpRecord = {
                ...record,
                id: `FUR-${Date.now()}`,
                student_id: studentId,
            };
            const updatedStudent = {
                ...student,
                follow_up_records: [...(student.follow_up_records || []), newRecord]
            };
            const updatedStudents = students.map((s, index) => 
                index === studentIndex ? updatedStudent : s
            );
            saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
            return simulateNetwork(newRecord);
        }
        throw new Error('Student not found');
    },

    updateFollowUpRecord: async (studentId: string, updatedRecord: FollowUpRecord): Promise<FollowUpRecord> => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const studentIndex = students.findIndex(s => s.student_id === studentId);
        if (studentIndex === -1) {
            throw new Error('Student not found for updating follow-up record.');
        }

        const student = students[studentIndex];
        const recordIndex = student.follow_up_records?.findIndex(r => r.id === updatedRecord.id) ?? -1;
        if (recordIndex === -1) {
            throw new Error('Follow-up record not found for update.');
        }
        
        const updatedRecords = student.follow_up_records!.map((r, i) => 
            i === recordIndex ? updatedRecord : r
        );

        const updatedStudent: Student = {
            ...student,
            follow_up_records: updatedRecords,
        };

        const updatedStudents = students.map((s, i) => (i === studentIndex ? updatedStudent : s));
        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
        return simulateNetwork(updatedRecord);
    },

    updateStudentAcademicReports: async (studentId: string, reports: AcademicReport[]) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const studentIndex = students.findIndex(s => s.student_id === studentId);
        if (studentIndex === -1) {
            throw new Error('Student not found');
        }
        
        const student = students[studentIndex];
        const updatedStudent: Student = {
            ...student,
            academic_reports: reports,
        };
        
        const updatedStudents = students.map((s, i) => 
            i === studentIndex ? updatedStudent : s
        );

        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
        return simulateNetwork(updatedStudent);
    },

    addBulkStudents: async (newStudentsData: Partial<Student>[]) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
        const existingIds = new Set(students.map(s => s.student_id));
        
        let importedCount = 0;
        let skippedCount = 0;

        const studentsToAdd: Student[] = [];

        newStudentsData.forEach(studentData => {
            if (!studentData.student_id || existingIds.has(studentData.student_id)) {
                skippedCount++;
                return;
            }
            
            const newStudent: Student = {
                student_id: '',
                first_name: '',
                last_name: '',
                date_of_birth: '',
                gender: Gender.OTHER,
                profile_photo: `https://i.pravatar.cc/150?u=${studentData.student_id}`,
                school: 'N/A',
                current_grade: 'N/A',
                eep_enroll_date: new Date().toISOString().split('T')[0],
                student_status: StudentStatus.PENDING_QUALIFICATION,
                sponsorship_status: SponsorshipStatus.UNSPONSORED,
                has_housing_sponsorship: false,
                sponsor_name: '',
                application_date: new Date().toISOString().split('T')[0],
                has_birth_certificate: false,
                siblings_count: 0,
                household_members_count: 0,
                city: '',
                village_slum: '',
                guardian_name: '',
                guardian_contact_info: '',
                home_location: '',
                father_details: { is_living: YesNo.NA, is_at_home: YesNo.NA, is_working: YesNo.NA, occupation: '', skills: '' },
                mother_details: { is_living: YesNo.NA, is_at_home: YesNo.NA, is_working: YesNo.NA, occupation: '', skills: '' },
                annual_income: 0,
                guardian_if_not_parents: '',
                parent_support_level: 3,
                closest_private_school: '',
                currently_in_school: YesNo.NA,
                previous_schooling: YesNo.NA,
                previous_schooling_details: { when: '', how_long: '', where: '' },
                grade_level_before_eep: '',
                child_responsibilities: '',
                health_status: HealthStatus.AVERAGE,
                health_issues: '',
                interaction_with_others: InteractionStatus.AVERAGE,
                interaction_issues: '',
                child_story: '',
                other_notes: '',
                risk_level: 3,
                transportation: TransportationType.WALKING,
                has_sponsorship_contract: false,
                academic_reports: [],
                follow_up_records: [],
                ...studentData,
            };

            studentsToAdd.push(newStudent);
            importedCount++;
        });

        const updatedStudents = [...studentsToAdd, ...students];
        saveToStorage(STORAGE_KEYS.STUDENTS, updatedStudents);

        return simulateNetwork({ importedCount, skippedCount });
    },

    getRecentTransactions: async () => {
        const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
        const sorted = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return simulateNetwork(sorted.slice(0, 5));
    },

    getTransactions: async () => simulateNetwork(getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions)),

    addTransaction: async (transactionData: Omit<Transaction, 'id'>) => {
        const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
        const newTransaction: Transaction = {
            ...transactionData,
            id: `T-${Date.now()}`,
        };
        const newTransactions = [newTransaction, ...transactions];
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
        return simulateNetwork(newTransaction);
    },

    updateTransaction: async (transactionData: Transaction) => {
        const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
        const index = transactions.findIndex(t => t.id === transactionData.id);
        if (index === -1) {
            throw new Error('Transaction not found for update.');
        }
        const updatedTransactions = transactions.map((t, i) => (i === index ? transactionData : t));
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
        return simulateNetwork(transactionData);
    },
    
    deleteTransaction: async (transactionId: string) => {
        const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        if (transactions.length === updatedTransactions.length) {
            throw new Error('Transaction not found for deletion.');
        }
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
        return simulateNetwork({ success: true });
    },

    getFilings: async () => simulateNetwork(getFromStorage(STORAGE_KEYS.FILINGS, defaultFilings)),

    addFiling: async (filingData: Omit<GovernmentFiling, 'id'> & { attached_file?: File | string }) => {
        const filings = getFromStorage(STORAGE_KEYS.FILINGS, defaultFilings);
        
        let fileName: string | undefined = undefined;
        if (filingData.attached_file instanceof File) {
            fileName = filingData.attached_file.name;
        }

        const newFiling: GovernmentFiling = {
            ...filingData,
            id: `F-${Date.now()}`,
            attached_file: fileName,
        };
        const newFilings = [newFiling, ...filings];
        saveToStorage(STORAGE_KEYS.FILINGS, newFilings);
        return simulateNetwork(newFiling);
    },
    
    updateFiling: async (filingData: GovernmentFiling & { attached_file?: File | string }) => {
        const filings = getFromStorage(STORAGE_KEYS.FILINGS, defaultFilings);
        const index = filings.findIndex(f => f.id === filingData.id);
        if (index === -1) {
            throw new Error('Filing not found for update.');
        }

        let fileName: string | undefined = filingData.attached_file as string | undefined;
        if (filingData.attached_file instanceof File) {
            fileName = filingData.attached_file.name;
        }
        
        const updatedFiling = { ...filingData, attached_file: fileName };

        const updatedFilings = filings.map((f, i) => (i === index ? updatedFiling : f));
        saveToStorage(STORAGE_KEYS.FILINGS, updatedFilings);
        return simulateNetwork(updatedFiling);
    },

    deleteFiling: async (filingId: string) => {
        const filings = getFromStorage(STORAGE_KEYS.FILINGS, defaultFilings);
        const updatedFilings = filings.filter(f => f.id !== filingId);
        if (filings.length === updatedFilings.length) {
            throw new Error('Filing not found for deletion.');
        }
        saveToStorage(STORAGE_KEYS.FILINGS, updatedFilings);
        return simulateNetwork({ success: true });
    },

    getTasks: async (): Promise<Task[]> => simulateNetwork(getFromStorage(STORAGE_KEYS.TASKS, defaultTasks)),

    addTask: async (taskData: Omit<Task, 'id'>): Promise<Task> => {
        const tasks = getFromStorage(STORAGE_KEYS.TASKS, defaultTasks);
        const newTask: Task = {
            ...taskData,
            id: `TASK-${Date.now()}`
        };
        const updatedTasks = [newTask, ...tasks];
        saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
        return simulateNetwork(newTask);
    },

    updateTask: async (taskData: Task): Promise<Task> => {
        const tasks = getFromStorage(STORAGE_KEYS.TASKS, defaultTasks);
        const index = tasks.findIndex(t => t.id === taskData.id);
        if (index === -1) {
            throw new Error('Task not found for update.');
        }
        const updatedTasks = tasks.map((t, i) => i === index ? taskData : t);
        saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
        return simulateNetwork(taskData);
    },

    deleteTask: async (taskId: string): Promise<{ success: boolean }> => {
        const tasks = getFromStorage(STORAGE_KEYS.TASKS, defaultTasks);
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        if (tasks.length === updatedTasks.length) {
            throw new Error('Task not found for deletion.');
        }
        saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
        return simulateNetwork({ success: true });
    },
    
    resetData: () => {
        Object.values(STORAGE_KEYS).forEach(key => {
            window.localStorage.removeItem(key);
        });
    }
};
