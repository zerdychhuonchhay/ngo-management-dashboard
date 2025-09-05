import { Student, Transaction, GovernmentFiling, Gender, StudentStatus, SponsorshipStatus, TransactionType, FilingStatus, FollowUpRecord, AcademicReport, YesNo, HealthStatus, InteractionStatus, TransportationType } from '../types';

// --- LocalStorage Helper Functions ---
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
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

// --- Initialize Data from localStorage or Defaults ---
const STORAGE_KEYS = {
    STUDENTS: 'ngo_students',
    TRANSACTIONS: 'ngo_transactions',
    FILINGS: 'ngo_filings',
};

let students: Student[] = getFromStorage(STORAGE_KEYS.STUDENTS, defaultStudents);
let transactions: Transaction[] = getFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
let filings: GovernmentFiling[] = getFromStorage(STORAGE_KEYS.FILINGS, defaultFilings);

// Save initial data if localStorage is empty
if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
}
if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
}
if (!localStorage.getItem(STORAGE_KEYS.FILINGS)) {
    saveToStorage(STORAGE_KEYS.FILINGS, filings);
}

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

export const api = {
    getDashboardStats: async () => {
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

    getStudents: async () => simulateNetwork(students),

    getStudentById: async (id: string) => simulateNetwork(students.find(s => s.student_id === id)),

    addStudent: async (studentData: Omit<Student, 'profile_photo' | 'academic_reports' | 'follow_up_records'> & { profile_photo?: File }) => {
        if (students.some(s => s.student_id === studentData.student_id)) {
            return new Promise((_, reject) => setTimeout(() => reject(new Error(`Student ID ${studentData.student_id} already exists.`)), 500));
        }

        let photoUrl = `https://i.pravatar.cc/150?u=${studentData.student_id}`;

        if (studentData.profile_photo) {
            photoUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
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
        students.push(newStudent);
        saveToStorage(STORAGE_KEYS.STUDENTS, students);
        return simulateNetwork(newStudent);
    },

    addAcademicReport: async (studentId: string, report: Omit<AcademicReport, 'id' | 'student_id'>) => {
        const student = students.find(s => s.student_id === studentId);
        if (student) {
            const newReport: AcademicReport = { ...report, id: `AR-${Date.now()}`, student_id: studentId };
            if (!student.academic_reports) {
                student.academic_reports = [];
            }
            student.academic_reports.push(newReport);
            saveToStorage(STORAGE_KEYS.STUDENTS, students);
            return simulateNetwork(newReport);
        }
        throw new Error('Student not found');
    },

    addFollowUpRecord: async (studentId: string, record: Omit<FollowUpRecord, 'id' | 'student_id'>) => {
        const student = students.find(s => s.student_id === studentId);
        if (student) {
            const newRecord: FollowUpRecord = { ...record, id: `FUR-${Date.now()}`, student_id: studentId };
            if (!student.follow_up_records) {
                student.follow_up_records = [];
            }
            student.follow_up_records.push(newRecord);
            saveToStorage(STORAGE_KEYS.STUDENTS, students);
            return simulateNetwork(newRecord);
        }
        throw new Error('Student not found');
    },

    getTransactions: async () => simulateNetwork(transactions),

    getRecentTransactions: async () => simulateNetwork([...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)),

    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = { ...transaction, id: `T-${Date.now()}` };
        transactions.unshift(newTransaction);
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
        return simulateNetwork(newTransaction);
    },

    getFilings: async () => simulateNetwork(filings),

    updateFiling: async (updatedFiling: GovernmentFiling) => {
        const index = filings.findIndex(f => f.id === updatedFiling.id);
        if (index !== -1) {
            filings[index] = updatedFiling;
            saveToStorage(STORAGE_KEYS.FILINGS, filings);
            return simulateNetwork(updatedFiling);
        }
        throw new Error('Filing not found');
    },

    resetData: () => {
        Object.values(STORAGE_KEYS).forEach(key => {
            window.localStorage.removeItem(key);
        });
    },

    getSponsorshipReport: async (status: 'All' | SponsorshipStatus) => {
        let reportStudents = students;
        if (status !== 'All') {
            reportStudents = students.filter(s => s.sponsorship_status === status);
        }
        return simulateNetwork(reportStudents);
    },
    
    getFinancialSummary: async (startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
    
        const filteredTransactions = transactions.filter(t => {
            const tDate = new Date(t.date).getTime();
            return tDate >= start && tDate <= end;
        });
    
        const income = filteredTransactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
    
        const expense = filteredTransactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
    
        return simulateNetwork({
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense,
            transactions: filteredTransactions,
        });
    },
};