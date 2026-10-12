import bcrypt from 'bcryptjs';

// In-Memory Data Store with rich, realistic KinderHub preschool data
export class DataStore {
  constructor() {
    this.users = [];
    this.classes = [];
    this.children = [];
    this.admissions = [];
    this.attendances = [];
    this.feeStructures = [];
    this.invoices = [];
    this.payments = [];
    this.activities = [];
    this.progressRecords = [];
    this.timetables = [];
    this.events = [];
    this.announcements = [];
    this.messages = [];
    this.leaveRequests = [];
    this.observations = [];
    this.aiSuggestions = [];
    this.monthlySummaries = [];
    this.dailyTimelines = [];
    this.pickupPasses = [];
    this.safetyIncidents = [];
    this.safetyAuditLogs = [];
    this.questJourneys = [];
    this.privacySettings = {};
    this.resolvedAlerts = {};
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    const defaultPasswordHash = await bcrypt.hash('Admin@123', 10);
    const teacherPasswordHash = await bcrypt.hash('Teacher@123', 10);
    const parentPasswordHash = await bcrypt.hash('Parent@123', 10);
    const admin123Hash = await bcrypt.hash('admin123', 10);
    const teacher123Hash = await bcrypt.hash('teacher123', 10);
    const parent123Hash = await bcrypt.hash('parent123', 10);

    // 1. Initial Users
    this.users = [
      {
        _id: 'usr_001',
        name: 'Eleanor Vance',
        email: 'admin@kinderhub.edu',
        password: defaultPasswordHash,
        role: 'super_admin',
        phone: '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        createdAt: new Date('2025-01-10')
      },
      {
        _id: 'usr_001_alias',
        name: 'Eleanor Vance',
        email: 'admin@kinderhub.com',
        password: admin123Hash,
        role: 'super_admin',
        phone: '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        createdAt: new Date('2025-01-10')
      },
      {
        _id: 'usr_002',
        name: 'Marcus Sterling',
        email: 'principal@kinderhub.edu',
        password: defaultPasswordHash,
        role: 'school_admin',
        phone: '+1 (555) 019-8822',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        createdAt: new Date('2025-01-15')
      },
      {
        _id: 'usr_003',
        name: 'Clara Oswald',
        email: 'clara.teacher@kinderhub.edu',
        password: teacherPasswordHash,
        role: 'teacher',
        phone: '+1 (555) 014-9911',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        assignedClassId: 'cls_001',
        designation: 'Head Teacher - Playgroup',
        qualification: 'B.Ed in Early Childhood Education, Montessori Certified',
        createdAt: new Date('2025-02-01')
      },
      {
        _id: 'usr_003_alias',
        name: 'Clara Oswald',
        email: 'clara@kinderhub.com',
        password: teacher123Hash,
        role: 'teacher',
        phone: '+1 (555) 014-9911',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        assignedClassId: 'cls_001',
        designation: 'Head Teacher - Playgroup',
        qualification: 'B.Ed in Early Childhood Education, Montessori Certified',
        createdAt: new Date('2025-02-01')
      },
      {
        _id: 'usr_004',
        name: 'Sophia Bennett',
        email: 'sophia.teacher@kinderhub.edu',
        password: teacherPasswordHash,
        role: 'teacher',
        phone: '+1 (555) 018-7733',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        assignedClassId: 'cls_002',
        designation: 'Lead Educator - Nursery',
        qualification: 'M.Sc Child Psychology & Primary Education',
        createdAt: new Date('2025-02-05')
      },
      {
        _id: 'usr_005',
        name: 'Sarah Johnson',
        email: 'sarah.parent@kinderhub.edu',
        password: parentPasswordHash,
        role: 'parent',
        phone: '+1 (555) 012-3456',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        childrenIds: ['ch_001', 'ch_002'],
        occupation: 'Architect',
        address: '742 Evergreen Terrace, Maple District',
        createdAt: new Date('2025-03-01')
      },
      {
        _id: 'usr_005_alias',
        name: 'Sarah Johnson',
        email: 'sarah@kinderhub.com',
        password: parent123Hash,
        role: 'parent',
        phone: '+1 (555) 012-3456',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        childrenIds: ['ch_001', 'ch_002'],
        occupation: 'Architect',
        address: '742 Evergreen Terrace, Maple District',
        createdAt: new Date('2025-03-01')
      },
      {
        _id: 'usr_006',
        name: 'David Smith',
        email: 'david.parent@kinderhub.edu',
        password: parentPasswordHash,
        role: 'parent',
        phone: '+1 (555) 015-7890',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        childrenIds: ['ch_003'],
        occupation: 'Software Engineer',
        address: '12 Blossom Boulevard, Sunnyvale',
        createdAt: new Date('2025-03-05')
      }
    ];

    // 2. Classes
    this.classes = [
      {
        _id: 'cls_001',
        name: 'Playgroup',
        section: 'Butterflies',
        academicYear: '2026-2027',
        capacity: 15,
        roomNumber: 'Room 101 (Soft Play)',
        classTeacherId: 'usr_003',
        classTeacherName: 'Clara Oswald',
        colorBadge: 'lavender',
        ageGroup: '2 – 3 Years',
        description: 'Sensory discovery, gentle socialization, music, and motor development.',
        enrolledCount: 3
      },
      {
        _id: 'cls_002',
        name: 'Nursery',
        section: 'Little Explorers',
        academicYear: '2026-2027',
        capacity: 18,
        roomNumber: 'Room 102 (Creativity Den)',
        classTeacherId: 'usr_004',
        classTeacherName: 'Sophia Bennett',
        colorBadge: 'sky',
        ageGroup: '3 – 4 Years',
        description: 'Vocabulary enrichment, guided independence, tactile arts, and curiosity.',
        enrolledCount: 3
      },
      {
        _id: 'cls_003',
        name: 'Junior KG',
        section: 'Rainbow Sprouts',
        academicYear: '2026-2027',
        capacity: 20,
        roomNumber: 'Room 201 (Discovery Lab)',
        classTeacherId: 'usr_003',
        classTeacherName: 'Clara Oswald',
        colorBadge: 'mint',
        ageGroup: '4 – 5 Years',
        description: 'Phonics, pre-math concepts, collaborative problem-solving, and storytelling.',
        enrolledCount: 1
      },
      {
        _id: 'cls_004',
        name: 'Senior KG',
        section: 'Star Shooters',
        academicYear: '2026-2027',
        capacity: 22,
        roomNumber: 'Room 202 (Future Stars)',
        classTeacherId: 'usr_004',
        classTeacherName: 'Sophia Bennett',
        colorBadge: 'peach',
        ageGroup: '5 – 6 Years',
        description: 'Reading fluency, foundational STEM, emotional agility, and school readiness.',
        enrolledCount: 1
      }
    ];

    // 3. Children
    this.children = [
      {
        _id: 'ch_001',
        childId: 'KH-2026-001',
        firstName: 'Mia',
        lastName: 'Johnson',
        dob: '2023-04-12',
        gender: 'Female',
        bloodGroup: 'A+',
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        section: 'Butterflies',
        admissionDate: '2025-08-01',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        parentPhone: '+1 (555) 012-3456',
        emergencyContact: {
          name: 'Robert Johnson (Father)',
          phone: '+1 (555) 012-3499',
          relation: 'Father'
        },
        allergies: ['Peanuts', 'Strawberries'],
        medicalNotes: 'Carries EpiPen in medical box. Mild asthma on cold mornings.',
        authorizedPickups: [
          { name: 'Sarah Johnson', relation: 'Mother', phone: '+1 (555) 012-3456' },
          { name: 'Robert Johnson', relation: 'Father', phone: '+1 (555) 012-3499' },
          { name: 'Helen Vance (Grandmother)', relation: 'Grandmother', phone: '+1 (555) 019-3321' }
        ],
        photo: 'https://images.unsplash.com/photo-1595454223600-91fb57d42531?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_002',
        childId: 'KH-2026-002',
        firstName: 'Leo',
        lastName: 'Johnson',
        dob: '2022-09-18',
        gender: 'Male',
        bloodGroup: 'O+',
        classId: 'cls_002',
        className: 'Nursery (Little Explorers)',
        section: 'Little Explorers',
        admissionDate: '2025-08-01',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        parentPhone: '+1 (555) 012-3456',
        emergencyContact: {
          name: 'Sarah Johnson',
          phone: '+1 (555) 012-3456',
          relation: 'Mother'
        },
        allergies: [],
        medicalNotes: 'No known allergies. Up to date with all pediatric immunizations.',
        authorizedPickups: [
          { name: 'Sarah Johnson', relation: 'Mother', phone: '+1 (555) 012-3456' },
          { name: 'Robert Johnson', relation: 'Father', phone: '+1 (555) 012-3499' }
        ],
        photo: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_003',
        childId: 'KH-2026-003',
        firstName: 'Oliver',
        lastName: 'Smith',
        dob: '2023-06-25',
        gender: 'Male',
        bloodGroup: 'B+',
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        section: 'Butterflies',
        admissionDate: '2025-08-15',
        parentId: 'usr_006',
        parentName: 'David Smith',
        parentPhone: '+1 (555) 015-7890',
        emergencyContact: {
          name: 'Emily Smith (Mother)',
          phone: '+1 (555) 015-7892',
          relation: 'Mother'
        },
        allergies: ['Dairy / Lactose intolerant'],
        medicalNotes: 'Provide almond or oat milk during snack sessions.',
        authorizedPickups: [
          { name: 'David Smith', relation: 'Father', phone: '+1 (555) 015-7890' },
          { name: 'Emily Smith', relation: 'Mother', phone: '+1 (555) 015-7892' }
        ],
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_004',
        childId: 'KH-2026-004',
        firstName: 'Emma',
        lastName: 'Williams',
        dob: '2022-11-04',
        gender: 'Female',
        bloodGroup: 'AB+',
        classId: 'cls_002',
        className: 'Nursery (Little Explorers)',
        section: 'Little Explorers',
        admissionDate: '2025-08-20',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        parentPhone: '+1 (555) 012-3456',
        emergencyContact: {
          name: 'Laura Williams',
          phone: '+1 (555) 011-4455',
          relation: 'Mother'
        },
        allergies: [],
        medicalNotes: 'None',
        authorizedPickups: [
          { name: 'Laura Williams', relation: 'Mother', phone: '+1 (555) 011-4455' }
        ],
        photo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_005',
        childId: 'KH-2026-005',
        firstName: 'Lucas',
        lastName: 'Brown',
        dob: '2021-08-14',
        gender: 'Male',
        bloodGroup: 'O-',
        classId: 'cls_003',
        className: 'Junior KG (Rainbow Sprouts)',
        section: 'Rainbow Sprouts',
        admissionDate: '2025-07-10',
        parentId: 'usr_006',
        parentName: 'David Smith',
        parentPhone: '+1 (555) 015-7890',
        emergencyContact: {
          name: 'Arthur Brown',
          phone: '+1 (555) 099-1234',
          relation: 'Father'
        },
        allergies: ['Dust mites'],
        medicalNotes: 'Keeps saline nasal spray for seasonal flare-ups.',
        authorizedPickups: [
          { name: 'Arthur Brown', relation: 'Father', phone: '+1 (555) 099-1234' }
        ],
        photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_006',
        childId: 'KH-2026-006',
        firstName: 'Chloe',
        lastName: 'Davis',
        dob: '2020-12-02',
        gender: 'Female',
        bloodGroup: 'A-',
        classId: 'cls_004',
        className: 'Senior KG (Star Shooters)',
        section: 'Star Shooters',
        admissionDate: '2025-06-15',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        parentPhone: '+1 (555) 012-3456',
        emergencyContact: {
          name: 'Grace Davis',
          phone: '+1 (555) 088-7766',
          relation: 'Mother'
        },
        allergies: [],
        medicalNotes: 'None',
        authorizedPickups: [
          { name: 'Grace Davis', relation: 'Mother', phone: '+1 (555) 088-7766' }
        ],
        photo: 'https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_007',
        childId: 'KH-2026-007',
        firstName: 'Ethan',
        lastName: 'Miller',
        dob: '2023-05-30',
        gender: 'Male',
        bloodGroup: 'O+',
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        section: 'Butterflies',
        admissionDate: '2025-09-01',
        parentId: 'usr_006',
        parentName: 'David Smith',
        parentPhone: '+1 (555) 015-7890',
        emergencyContact: {
          name: 'Rachel Miller',
          phone: '+1 (555) 077-8899',
          relation: 'Mother'
        },
        allergies: [],
        medicalNotes: 'None',
        authorizedPickups: [
          { name: 'Rachel Miller', relation: 'Mother', phone: '+1 (555) 077-8899' }
        ],
        photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      },
      {
        _id: 'ch_008',
        childId: 'KH-2026-008',
        firstName: 'Ava',
        lastName: 'Wilson',
        dob: '2022-07-15',
        gender: 'Female',
        bloodGroup: 'B+',
        classId: 'cls_002',
        className: 'Nursery (Little Explorers)',
        section: 'Little Explorers',
        admissionDate: '2025-08-10',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        parentPhone: '+1 (555) 012-3456',
        emergencyContact: {
          name: 'Danielle Wilson',
          phone: '+1 (555) 066-5544',
          relation: 'Mother'
        },
        allergies: ['Gluten sensitivity'],
        medicalNotes: 'Follow gluten-free snack menu.',
        authorizedPickups: [
          { name: 'Danielle Wilson', relation: 'Mother', phone: '+1 (555) 066-5544' }
        ],
        photo: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=150&auto=format&fit=crop&q=80',
        status: 'Enrolled'
      }
    ];

    // 4. Admissions Workflow Pipeline
    this.admissions = [
      {
        _id: 'adm_001',
        applicationNo: 'ADM-2026-101',
        childFirstName: 'Noah',
        childLastName: 'Taylor',
        dob: '2023-09-10',
        gender: 'Male',
        preferredClassId: 'cls_001',
        preferredClassName: 'Playgroup',
        parentName: 'Jessica Taylor',
        parentEmail: 'jessica.t@example.com',
        parentPhone: '+1 (555) 441-2099',
        address: '55 Pine Needle Way, Oak Ridge',
        medicalNotes: 'Mild eczema',
        status: 'Pending',
        documents: [
          { name: 'Birth_Certificate.pdf', url: '#' },
          { name: 'Vaccination_Record.pdf', url: '#' }
        ],
        adminNotes: 'Parents requested morning half-day slot.',
        createdAt: new Date('2026-10-05')
      },
      {
        _id: 'adm_002',
        applicationNo: 'ADM-2026-102',
        childFirstName: 'Zoe',
        childLastName: 'Garcia',
        dob: '2022-05-14',
        gender: 'Female',
        preferredClassId: 'cls_002',
        preferredClassName: 'Nursery',
        parentName: 'Carlos Garcia',
        parentEmail: 'carlos.garcia@example.com',
        parentPhone: '+1 (555) 332-8811',
        address: '88 Magnolia Court, Riverdale',
        medicalNotes: 'None',
        status: 'Under Review',
        documents: [
          { name: 'Birth_Certificate.pdf', url: '#' },
          { name: 'Proof_of_Address.pdf', url: '#' }
        ],
        adminNotes: 'Parent interview scheduled for Wednesday 10 AM.',
        createdAt: new Date('2026-10-03')
      },
      {
        _id: 'adm_003',
        applicationNo: 'ADM-2026-103',
        childFirstName: 'Theo',
        childLastName: 'Clark',
        dob: '2023-01-20',
        gender: 'Male',
        preferredClassId: 'cls_001',
        preferredClassName: 'Playgroup',
        parentName: 'Victoria Clark',
        parentEmail: 'v.clark@example.com',
        parentPhone: '+1 (555) 223-9988',
        address: '109 Cedar Hollow, West Hills',
        medicalNotes: 'None',
        status: 'Approved',
        documents: [
          { name: 'Theo_BirthCert.pdf', url: '#' },
          { name: 'Immunization_Card.pdf', url: '#' }
        ],
        adminNotes: 'Approved by Principal Marcus. Ready for enrollment fee invoice.',
        createdAt: new Date('2026-09-28')
      },
      {
        _id: 'adm_004',
        applicationNo: 'ADM-2026-104',
        childFirstName: 'Liam',
        childLastName: 'Cooper',
        dob: '2021-02-11',
        gender: 'Male',
        preferredClassId: 'cls_003',
        preferredClassName: 'Junior KG',
        parentName: 'Megan Cooper',
        parentEmail: 'm.cooper@example.com',
        parentPhone: '+1 (555) 776-5544',
        address: '14 Elm Creek, Highland',
        medicalNotes: 'None',
        status: 'Rejected',
        documents: [],
        adminNotes: 'Class capacity full for academic year term 1. Placed on waitlist.',
        createdAt: new Date('2026-09-15')
      }
    ];

    // Today's date string YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // 5. Attendance Records
    this.attendances = [
      {
        _id: 'att_001',
        date: todayStr,
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        markedById: 'usr_003',
        markedByName: 'Clara Oswald',
        records: [
          { childId: 'ch_001', childName: 'Mia Johnson', status: 'Present', remarks: 'Energetic and happy arrival', checkInTime: '08:50 AM' },
          { childId: 'ch_003', childName: 'Oliver Smith', status: 'Present', remarks: 'Arrived with father', checkInTime: '09:05 AM' },
          { childId: 'ch_007', childName: 'Ethan Miller', status: 'Late', remarks: 'Traffic delay on freeway', checkInTime: '09:35 AM' }
        ],
        createdAt: new Date()
      },
      {
        _id: 'att_002',
        date: todayStr,
        classId: 'cls_002',
        className: 'Nursery (Little Explorers)',
        markedById: 'usr_004',
        markedByName: 'Sophia Bennett',
        records: [
          { childId: 'ch_002', childName: 'Leo Johnson', status: 'Present', remarks: 'Brought colorful autumn leaves', checkInTime: '08:55 AM' },
          { childId: 'ch_004', childName: 'Emma Williams', status: 'Present', remarks: 'Participated enthusiastically', checkInTime: '09:00 AM' },
          { childId: 'ch_008', childName: 'Ava Wilson', status: 'Leave', remarks: 'Approved medical checkup leave', checkInTime: '-' }
        ],
        createdAt: new Date()
      },
      {
        _id: 'att_003',
        date: yesterdayStr,
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        markedById: 'usr_003',
        markedByName: 'Clara Oswald',
        records: [
          { childId: 'ch_001', childName: 'Mia Johnson', status: 'Present', remarks: 'Great finger painting engagement', checkInTime: '08:52 AM' },
          { childId: 'ch_003', childName: 'Oliver Smith', status: 'Present', remarks: '', checkInTime: '08:58 AM' },
          { childId: 'ch_007', childName: 'Ethan Miller', status: 'Absent', remarks: 'Fever reported by parent', checkInTime: '-' }
        ],
        createdAt: new Date(Date.now() - 86400000)
      }
    ];

    // 6. Fee Structures
    this.feeStructures = [
      {
        _id: 'fee_001',
        classId: 'cls_001',
        className: 'Playgroup',
        academicYear: '2026-2027',
        title: 'Playgroup Standard Term',
        admissionFee: 200,
        tuitionFee: 950,
        activityFee: 150,
        transportFee: 100,
        mealFee: 120,
        totalAmount: 1520
      },
      {
        _id: 'fee_002',
        classId: 'cls_002',
        className: 'Nursery',
        academicYear: '2026-2027',
        title: 'Nursery Standard Term',
        admissionFee: 250,
        tuitionFee: 1100,
        activityFee: 180,
        transportFee: 120,
        mealFee: 150,
        totalAmount: 1800
      },
      {
        _id: 'fee_003',
        classId: 'cls_003',
        className: 'Junior KG',
        academicYear: '2026-2027',
        title: 'Junior KG Standard Term',
        admissionFee: 250,
        tuitionFee: 1250,
        activityFee: 200,
        transportFee: 150,
        mealFee: 150,
        totalAmount: 2000
      },
      {
        _id: 'fee_004',
        classId: 'cls_004',
        className: 'Senior KG',
        academicYear: '2026-2027',
        title: 'Senior KG Comprehensive',
        admissionFee: 300,
        tuitionFee: 1400,
        activityFee: 220,
        transportFee: 150,
        mealFee: 180,
        totalAmount: 2250
      }
    ];

    // 7. Invoices
    this.invoices = [
      {
        _id: 'inv_001',
        invoiceNo: 'INV-2026-101',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        className: 'Playgroup',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        title: 'Term 1 Tuition & Learning Kit',
        monthYear: 'October 2026',
        dueDate: new Date('2026-10-25'),
        subtotal: 1520,
        discount: 100,
        totalAmount: 1420,
        paidAmount: 1420,
        balanceAmount: 0,
        status: 'Paid',
        createdAt: new Date('2026-10-01')
      },
      {
        _id: 'inv_002',
        invoiceNo: 'INV-2026-102',
        childId: 'ch_002',
        childName: 'Leo Johnson',
        className: 'Nursery',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        title: 'Term 1 Tuition & Activities',
        monthYear: 'October 2026',
        dueDate: new Date('2026-10-25'),
        subtotal: 1800,
        discount: 150,
        totalAmount: 1650,
        paidAmount: 1000,
        balanceAmount: 650,
        status: 'Partial',
        createdAt: new Date('2026-10-01')
      },
      {
        _id: 'inv_003',
        invoiceNo: 'INV-2026-103',
        childId: 'ch_003',
        childName: 'Oliver Smith',
        className: 'Playgroup',
        parentId: 'usr_006',
        parentName: 'David Smith',
        title: 'Term 1 Tuition & Organic Meals',
        monthYear: 'October 2026',
        dueDate: new Date('2026-10-20'),
        subtotal: 1520,
        discount: 0,
        totalAmount: 1520,
        paidAmount: 0,
        balanceAmount: 1520,
        status: 'Unpaid',
        createdAt: new Date('2026-10-01')
      },
      {
        _id: 'inv_004',
        invoiceNo: 'INV-2026-104',
        childId: 'ch_005',
        childName: 'Lucas Brown',
        className: 'Junior KG',
        parentId: 'usr_006',
        parentName: 'David Smith',
        title: 'Term 1 Tuition & Robotics Play',
        monthYear: 'September 2026',
        dueDate: new Date('2026-09-25'),
        subtotal: 2000,
        discount: 0,
        totalAmount: 2000,
        paidAmount: 0,
        balanceAmount: 2000,
        status: 'Overdue',
        createdAt: new Date('2026-09-01')
      }
    ];

    // 8. Payment Receipts
    this.payments = [
      {
        _id: 'pay_001',
        receiptNo: 'REC-2026-801',
        invoiceId: 'inv_001',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        amount: 1420,
        paymentDate: new Date('2026-10-04'),
        paymentMethod: 'UPI',
        transactionRef: 'UPI-TXN-99882211',
        recordedByName: 'Eleanor Vance (Super Admin)',
        notes: 'Full payment received with gratitude.'
      },
      {
        _id: 'pay_002',
        receiptNo: 'REC-2026-802',
        invoiceId: 'inv_002',
        childId: 'ch_002',
        childName: 'Leo Johnson',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        amount: 1000,
        paymentDate: new Date('2026-10-06'),
        paymentMethod: 'Bank Transfer',
        transactionRef: 'WIRE-B0912-US',
        recordedByName: 'Marcus Sterling (Principal)',
        notes: 'First installment. Remaining $650 due by Oct 25.'
      }
    ];

    // 9. Preschool Learning Activities
    this.activities = [
      {
        _id: 'act_001',
        title: 'Autumn Sensory Leaf & Pinecone Collage',
        description: 'Children touched, sorted, and smelled natural autumn textures, making leaf prints with washable non-toxic colors.',
        category: 'Sensory & Play',
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        date: todayStr,
        learningObjectives: ['Tactile exploration of textures', 'Color identification (yellow, amber, red)', 'Hand-eye coordination with natural adhesives'],
        materialsNeeded: 'Fallen dry leaves, pinecones, child-safe glue sticks, craft card paper',
        teacherNotes: 'Mia loved the crunchy sound of maple leaves. Oliver enjoyed organizing pinecones by size.',
        photos: ['https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&auto=format&fit=crop&q=80'],
        createdByName: 'Clara Oswald'
      },
      {
        _id: 'act_002',
        title: 'Story Circle & Phonic Rhymes: "The Friendly Fox"',
        description: 'Puppet theater reading introducing the phonetic "F" sound and friendly conversational sharing.',
        category: 'Phonics & Language',
        classId: 'cls_002',
        className: 'Nursery (Little Explorers)',
        date: todayStr,
        learningObjectives: ['Phonemic awareness of the letter F', 'Listening comprehension & story recall', 'Expressing emotions through puppetry'],
        materialsNeeded: 'Felt fox puppet, storybook, animal flashcards',
        teacherNotes: 'Leo mimicked the fox sound with great laughter! Emma recounted the forest ending accurately.',
        photos: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&auto=format&fit=crop&q=80'],
        createdByName: 'Sophia Bennett'
      },
      {
        _id: 'act_003',
        title: 'Rainbow Obstacle Course & Balance Beam',
        description: 'Indoor movement session focusing on stepping over soft foam logs, crawling through the worm tunnel, and jumping on star mats.',
        category: 'Gross Motor',
        classId: 'cls_001',
        className: 'Playgroup (Butterflies)',
        date: yesterdayStr,
        learningObjectives: ['Core body balance & posture', 'Spatial orientation and safe landings', 'Turn-taking and cheering for peers'],
        materialsNeeded: 'Foam logs, pop-up tunnel, anti-slip stepping stones',
        teacherNotes: 'Ethan completed the tunnel crawl three times! Tremendous enthusiasm from everyone.',
        photos: ['https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300&auto=format&fit=crop&q=80'],
        createdByName: 'Clara Oswald'
      }
    ];

    // 10. 5-Domain Progress Records (Preschool Developmental Milestones)
    this.progressRecords = [
      {
        _id: 'prog_001',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        className: 'Playgroup',
        term: 'Term 1 (Autumn 2026)',
        evaluationDate: new Date('2026-10-08'),
        evaluatorName: 'Clara Oswald',
        domains: {
          language: {
            score: 5,
            observation: 'Exceptional vocabulary for age 3. Uses complex sentences and loves storytelling in circle time.'
          },
          motorSkills: {
            score: 4,
            observation: 'Good grasp on jumbo crayons. Shows steady single-leg balance and loves jumping activities.'
          },
          creativity: {
            score: 5,
            observation: 'Fascinated by water-color blending and imaginative roleplay during kitchen play center.'
          },
          socialSkills: {
            score: 4,
            observation: 'Empathetic and gently offers toys to friends when they feel sad. Welcoming to newcomers.'
          },
          cognitive: {
            score: 5,
            observation: 'Distinguishes 8 primary shapes and colors. Solves 12-piece wooden animal puzzles autonomously.'
          }
        },
        generalNotes: 'Mia is a beacon of happiness in the Butterflies classroom. Outstanding overall developmental trajectory.'
      },
      {
        _id: 'prog_002',
        childId: 'ch_002',
        childName: 'Leo Johnson',
        className: 'Nursery',
        term: 'Term 1 (Autumn 2026)',
        evaluationDate: new Date('2026-10-07'),
        evaluatorName: 'Sophia Bennett',
        domains: {
          language: {
            score: 4,
            observation: 'Asks inquisitive questions ("Why do trees shed leaves?"). Listens attentively during library hour.'
          },
          motorSkills: {
            score: 5,
            observation: 'Remarkable gross motor dexterity, swift running, kicks soccer ball with controlled aim.'
          },
          creativity: {
            score: 4,
            observation: 'Enjoys playdough clay sculpting and assembling intricate Lego tower structures.'
          },
          socialSkills: {
            score: 4,
            observation: 'Great team player during group games. Follows transition instructions with minimal prompting.'
          },
          cognitive: {
            score: 4,
            observation: 'Counts quantities up to 20 effortlessly. Accurately groups objects by category (animals, vehicles).'
          }
        },
        generalNotes: 'Leo demonstrates vibrant curiosity and great cooperation. A pleasure to guide each morning!'
      }
    ];

    // 11. Timetable Schedule
    this.timetables = [
      {
        _id: 'tt_001',
        classId: 'cls_001',
        dayOfWeek: 'Monday',
        periods: [
          { startTime: '09:00 AM', endTime: '09:30 AM', subject: 'Morning Circle & Weather Songs', teacherName: 'Clara Oswald', room: 'Room 101' },
          { startTime: '09:30 AM', endTime: '10:15 AM', subject: 'Sensory Texture Play & Colors', teacherName: 'Clara Oswald', room: 'Activity Room' },
          { startTime: '10:15 AM', endTime: '10:45 AM', subject: 'Healthy Snack & Hygiene Time', teacherName: 'Assistant Nurse', room: 'Dining Nook' },
          { startTime: '10:45 AM', endTime: '11:30 AM', subject: 'Outdoor Playground & Gross Motor', teacherName: 'Clara Oswald', room: 'Soft Turf Yard' },
          { startTime: '11:30 AM', endTime: '12:00 PM', subject: 'Storybook Relaxation & Departure', teacherName: 'Clara Oswald', room: 'Room 101' }
        ]
      },
      {
        _id: 'tt_002',
        classId: 'cls_002',
        dayOfWeek: 'Monday',
        periods: [
          { startTime: '09:00 AM', endTime: '09:40 AM', subject: 'Phonics Rhymes & Alphabet Tree', teacherName: 'Sophia Bennett', room: 'Room 102' },
          { startTime: '09:40 AM', endTime: '10:20 AM', subject: 'Finger Painting & Mixed Media Art', teacherName: 'Sophia Bennett', room: 'Creativity Studio' },
          { startTime: '10:20 AM', endTime: '10:50 AM', subject: 'Fruit Snack & Table Etiquette', teacherName: 'Sophia Bennett', room: 'Dining Nook' },
          { startTime: '10:50 AM', endTime: '11:35 AM', subject: 'Pre-Math Block Counting Games', teacherName: 'Sophia Bennett', room: 'Room 102' },
          { startTime: '11:35 AM', endTime: '12:00 PM', subject: 'Musical Movement & Dismissal', teacherName: 'Sophia Bennett', room: 'Room 102' }
        ]
      }
    ];

    // 12. Events & Calendar
    this.events = [
      {
        _id: 'ev_001',
        title: '🧸 Annual Teddy Bear Picnic & Pajama Day',
        description: 'Children bring their favorite stuffed animal for blanket story circles, hot cocoa, and bedtime lullabies.',
        eventType: 'Celebration',
        startDate: '2026-10-18T09:30:00Z',
        endDate: '2026-10-18T12:30:00Z',
        targetAudience: 'All',
        location: 'Preschool Sunshine Garden',
        colorTag: 'lavender'
      },
      {
        _id: 'ev_002',
        title: '🍂 Autumn Harvest Arts & Pumpkin Patch',
        description: 'Exploring edible squashes, hands-on pumpkin carving (teachers only), and seed counting activities.',
        eventType: 'Field Trip',
        startDate: '2026-10-24T09:00:00Z',
        endDate: '2026-10-24T13:00:00Z',
        targetAudience: 'Parents',
        location: 'Sweet Valley Organic Farm',
        colorTag: 'peach'
      },
      {
        _id: 'ev_003',
        title: '☕ Term 1 Parent-Teacher Coffee & Growth Chat',
        description: 'One-on-one 15-minute consultations celebrating your child’s developmental milestones and social growth.',
        eventType: 'Parent-Teacher Meeting',
        startDate: '2026-10-29T13:00:00Z',
        endDate: '2026-10-29T17:00:00Z',
        targetAudience: 'Parents',
        location: 'Main Auditorium & Classroom Salons',
        colorTag: 'sky'
      },
      {
        _id: 'ev_004',
        title: '🎂 Mia Johnson’s 3rd Birthday Celebration',
        description: 'Mia celebrates turning 3 with healthy fruit muffins and balloon crafts in Butterflies room!',
        eventType: 'Celebration',
        startDate: '2026-10-14T10:00:00Z',
        endDate: '2026-10-14T11:00:00Z',
        targetAudience: 'All',
        location: 'Playgroup Room 101',
        colorTag: 'yellow'
      }
    ];

    // 13. Announcements
    this.announcements = [
      {
        _id: 'ann_001',
        title: '🍁 Welcome to Autumn Term 2026 at KinderHub!',
        content: 'We are thrilled to welcome our precious learners and families. Please ensure spare change-of-clothes bags are labeled with your child’s name and kept in their cubbies.',
        targetAudience: 'All',
        priority: 'Normal',
        authorName: 'Principal Marcus Sterling',
        createdAt: new Date('2026-10-01')
      },
      {
        _id: 'ann_002',
        title: '🍎 Notice: Seasonal Flu & Hand Hygiene Reminder',
        content: 'To keep our toddlers healthy, daily temperature checks continue at the front foyer. Please keep children home if fever exceeds 100.4°F until 24 hours symptom-free.',
        targetAudience: 'Parents',
        priority: 'Important',
        authorName: 'School Health Nurse',
        createdAt: new Date('2026-10-06')
      },
      {
        _id: 'ann_003',
        title: '🎨 Staff In-Service Workshop: Positive Neuro-Affirming Guidance',
        content: 'All teachers and assistants please gather in Activity Lab 2 on Friday at 1:30 PM following student early dismissal.',
        targetAudience: 'Teachers',
        priority: 'Normal',
        authorName: 'Eleanor Vance',
        createdAt: new Date('2026-10-09')
      }
    ];

    // 14. Messages
    this.messages = [
      {
        _id: 'msg_001',
        senderId: 'usr_003',
        senderName: 'Clara Oswald (Teacher)',
        senderRole: 'teacher',
        receiverId: 'usr_005',
        receiverName: 'Sarah Johnson',
        childName: 'Mia Johnson',
        subject: 'Mia’s Wonderful Progress with Finger Painting Today',
        message: 'Dear Sarah, Mia had an absolute blast blending yellow and blue paints to discover green today! She also ate all her organic carrot sticks during snack time.',
        read: false,
        createdAt: new Date('2026-10-10T14:30:00Z')
      },
      {
        _id: 'msg_002',
        senderId: 'usr_005',
        senderName: 'Sarah Johnson (Parent)',
        senderRole: 'parent',
        receiverId: 'usr_003',
        receiverName: 'Clara Oswald',
        childName: 'Mia Johnson',
        subject: 'Thank you for the sweet update!',
        message: 'Thank you so much, Clara! She talked about the green color all the way home in the car. We appreciate the care you give her every single day.',
        read: true,
        createdAt: new Date('2026-10-10T16:10:00Z')
      }
    ];

    // 15. Leave Requests
    this.leaveRequests = [
      {
        _id: 'lv_001',
        childId: 'ch_008',
        childName: 'Ava Wilson',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        startDate: todayStr,
        endDate: todayStr,
        reason: 'Scheduled pediatric dental checkup and immunizations.',
        status: 'Approved',
        adminRemarks: 'Approved. Get well and see you tomorrow Ava!',
        createdAt: new Date(Date.now() - 36000000)
      },
      {
        _id: 'lv_002',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        parentId: 'usr_005',
        parentName: 'Sarah Johnson',
        startDate: '2026-10-22',
        endDate: '2026-10-23',
        reason: 'Family out of town for maternal grandparents golden anniversary.',
        status: 'Pending',
        adminRemarks: '',
        createdAt: new Date('2026-10-11')
      }
    ];

    // 16. KinderGrowth AI: 5-Domain Observations
    this.observations = [
      {
        _id: 'obs_001',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: todayStr,
        domain: 'creativity',
        score: 5,
        milestoneTitle: 'Autumn Leaf & Texture Watercolor Blending',
        notes: 'Mia showed delightful focus selecting yellow and green paints, experimenting with wet-on-wet leaf pressings.',
        activityId: 'act_001',
        activityTitle: 'Autumn Sensory Leaf & Pinecone Collage',
        observedByRole: 'teacher',
        observedById: 'usr_003',
        observedByName: 'Clara Oswald (Teacher)',
        context: 'classroom',
        photo: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&auto=format&fit=crop&q=80',
        isHomeObservation: false,
        createdAt: new Date()
      },
      {
        _id: 'obs_002',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: yesterdayStr,
        domain: 'language',
        score: 5,
        milestoneTitle: 'Expressive Story Retelling & Rhyming',
        notes: 'Retold the story of the lost hedgehog using complete descriptive sentences and mimicked animal sounds with laughter.',
        activityId: 'act_002',
        activityTitle: 'Story Circle & Phonic Rhymes',
        observedByRole: 'teacher',
        observedById: 'usr_003',
        observedByName: 'Clara Oswald (Teacher)',
        context: 'story_circle',
        isHomeObservation: false,
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        _id: 'obs_003',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: '2026-10-09',
        domain: 'socialEmotional',
        score: 4,
        milestoneTitle: 'Empathetic Sharing during Block Play',
        notes: 'Noticed Leo was looking for a blue foam block and gently walked over to offer hers with a smile.',
        activityTitle: 'Collaborative Building Center',
        observedByRole: 'teacher',
        observedById: 'usr_003',
        observedByName: 'Clara Oswald (Teacher)',
        context: 'classroom',
        isHomeObservation: false,
        createdAt: new Date('2026-10-09')
      },
      {
        _id: 'obs_004',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: '2026-10-08',
        domain: 'motorSkills',
        score: 4,
        milestoneTitle: 'Single-Foot Hop & Balance Beam Walking',
        notes: 'Hopped across three star mats with steady balance without stepping off.',
        activityId: 'act_003',
        activityTitle: 'Rainbow Obstacle Course',
        observedByRole: 'teacher',
        observedById: 'usr_003',
        observedByName: 'Clara Oswald (Teacher)',
        context: 'playground',
        isHomeObservation: false,
        createdAt: new Date('2026-10-08')
      },
      {
        _id: 'obs_005',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: '2026-10-06',
        domain: 'cognitive',
        score: 5,
        milestoneTitle: '12-Piece Wooden Animal Puzzle Mastery',
        notes: 'Autonomously oriented and fitted puzzle pieces by observing edge shapes and color clues.',
        activityTitle: 'Discovery Table',
        observedByRole: 'teacher',
        observedById: 'usr_003',
        observedByName: 'Clara Oswald (Teacher)',
        context: 'classroom',
        isHomeObservation: false,
        createdAt: new Date('2026-10-06')
      },
      {
        _id: 'obs_006',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: '2026-10-10',
        domain: 'language',
        score: 5,
        milestoneTitle: 'Bedtime Book Narration (Home Observation)',
        notes: 'Mia read her favorite picture book to her teddy bear before sleep, pointing out the moon and stars accurately!',
        activityTitle: 'Home Evening Reading',
        observedByRole: 'parent',
        observedById: 'usr_005',
        observedByName: 'Sarah Johnson (Mother)',
        context: 'home',
        isHomeObservation: true,
        createdAt: new Date('2026-10-10')
      },
      {
        _id: 'obs_007',
        childId: 'ch_002',
        childName: 'Leo Johnson',
        date: todayStr,
        domain: 'motorSkills',
        score: 5,
        milestoneTitle: 'Tunnel Crawl & Foam Log Climbing',
        notes: 'Showed great gross motor agility and spatial navigation on the gym obstacle path.',
        activityId: 'act_003',
        activityTitle: 'Rainbow Obstacle Course',
        observedByRole: 'teacher',
        observedById: 'usr_004',
        observedByName: 'Sophia Bennett (Teacher)',
        context: 'playground',
        isHomeObservation: false,
        createdAt: new Date()
      }
    ];

    // 17. KinderGrowth AI: Activity Suggestions
    this.aiSuggestions = [
      {
        _id: 'sug_001',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        domain: 'motorSkills',
        suggestedTitle: 'Ergonomic Tweezer & Dried Bean Sorting',
        description: 'Provide large child-safe plastic tweezers to sort dried kidney beans and chickpeas into wooden muffin cups.',
        rationale: 'Scaffolds precision pincer grasp and hand arches to support emerging tripod pencil grip.',
        materials: 'Large plastic tweezers, wooden muffin tray, dried non-toxic beans',
        ageGroup: 'Playgroup (2-3 Yrs)',
        status: 'approved',
        teacherNotes: 'Great sensory motor extension. Will set up at Sensory Table 2 tomorrow.',
        approvedById: 'usr_003',
        approvedByName: 'Clara Oswald',
        approvedAt: new Date(),
        isAiGenerated: true,
        disclaimer: 'AI-generated pedagogical suggestion. Approved by Lead Educator.',
        createdAt: new Date('2026-10-10')
      },
      {
        _id: 'sug_002',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        domain: 'socialEmotional',
        suggestedTitle: 'Empathy Puppet Clinic & Caring Circle',
        description: 'Roleplay tending to a toy puppy with soft bandages and comforting phrases.',
        rationale: 'Builds upon Mia\'s natural kindness observed during block sharing to explore verbal emotional comfort.',
        materials: 'Plush toy animals, fabric bandage strips, toy stethoscope',
        ageGroup: 'Playgroup (2-3 Yrs)',
        status: 'pending_review',
        teacherNotes: '',
        isAiGenerated: true,
        disclaimer: 'AI-generated pedagogical suggestion. Requires Lead Educator approval before assignment.',
        createdAt: new Date('2026-10-11')
      }
    ];

    // 18. KinderGrowth AI: Monthly Summaries
    this.monthlySummaries = [
      {
        _id: 'msum_001',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        monthYear: 'October 2026',
        summaryText: 'Mia has had a radiant month full of sensory exploration, joyful conversational sharing, and steady gross-motor balance advancement. Her confidence in creative self-expression is a beacon of happiness in the classroom.',
        strengths: [
          'High expressive vocabulary and narrative retelling enthusiasm.',
          'Gentle empathy and toy sharing during free play centers.',
          'Vibrant color blending curiosity in arts and crafts.'
        ],
        growthAreas: [
          'Continuing to refine fine pincer coordination through tweezer and threading play.'
        ],
        status: 'published',
        publishedAt: new Date('2026-10-11'),
        publishedById: 'usr_003',
        publishedByName: 'Clara Oswald'
      }
    ];

    // 19. KinderConnect: Daily Routine Timeline Logs
    this.dailyTimelines = [
      {
        _id: 'dtl_001',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        date: todayStr,
        teacherId: 'usr_003',
        teacherName: 'Clara Oswald',
        mood: 'Joyful',
        meals: {
          morningSnack: 'Ate all fresh apple slices and organic carrot sticks',
          lunch: 'Finished whole wheat vegetable roti and warm lentil stew',
          afternoonSnack: 'Warm almond milk and oatmeal biscuit',
          hydration: 'Good (4 water cups filled and finished)'
        },
        nap: {
          durationMinutes: 45,
          quality: 'Restful'
        },
        activities: [
          { time: '09:30 AM', title: 'Morning Song & Greeting Circle', description: 'Sang greeting song with joyful hand claps.', category: 'Music' },
          { time: '11:00 AM', title: 'Autumn Sensory Leaf Press', description: 'Blended yellow and green paints onto paper.', category: 'Creative' },
          { time: '02:00 PM', title: 'Outdoor Obstacle Stepping Stones', description: 'Hopped across colorful star mats with steady balance.', category: 'Gross Motor' }
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&auto=format&fit=crop&q=80', caption: 'Mia exploring colorful autumn leaf prints!', approvedForParents: true }
        ],
        notes: 'Mia was radiant today! She proudly showed her green watercolor leaf to everyone during circle time.',
        parentFriendlyDigest: {
          en: `🌟 Hello! Today was a wonderful day for Mia Johnson. She arrived feeling very joyful and cheerful. During snack and lunch, she ate nicely (finished vegetable roti and apple slices). At naptime, she rested calmly for 45 minutes. In our activities, Mia showed great curiosity blending paints and hopping across star mats. Wishing you a warm evening together! ❤️`,
          mr: `🌟 नमस्कार! आजचा दिवस मियासाठी अतिशय आनंदाचा आणि उत्साहाचा राहिला. वर्गात आल्यापासून ती खूप आनंदी होती. दुपारचे पौष्टिक जेवण तिने आवडीने खाल्ले आणि ४५ मिनिटे शांत विश्रांती घेतली. पानांचे रंगकाम करताना आणि खेळाच्या मैदानावर तिने खूप छान आनंद घेतला. घरी मियाशी आजच्या दिवसाबद्दल प्रेमळ गप्पा मारा! ❤️`,
          hi: `🌟 नमस्ते! आज का दिन मिया के लिए बहुत ही खुशनुमा और सीखने से भरा रहा। वह पूरे दिन बहुत प्रसन्न और ऊर्जावान रही। दोपहर का पौष्टिक भोजन पूरा खाया और 45 मिनट की आरामदायक नींद ली। दोस्तों के साथ रंगों और खेलकूद में बहुत उत्साह दिखाया। घर पर मिया के साथ आज के पलों को साझा करें और स्नेह दें! ❤️`
        },
        homeActivityRecommendations: [
          {
            title: 'Bedtime Shadow Puppets with Mia',
            instruction: 'Use a flashlight against the bedroom wall to make rabbit ears and tell a sweet bedtime story.',
            domain: 'Imagination & Language'
          },
          {
            title: 'Color Spotting in the Kitchen',
            instruction: 'Ask Mia to spot 3 green items (spinach, cucumber, cup) while helping prepare dinner.',
            domain: 'Cognitive Observation'
          }
        ],
        parentFeedback: [
          {
            parentId: 'usr_005',
            parentName: 'Sarah Johnson (Mother)',
            message: 'Thank you Clara! She talked about the green leaf prints all the way home in the car. We love this update! ❤️',
            reaction: '❤️',
            createdAt: new Date()
          }
        ],
        readByParents: [
          { userId: 'usr_005', userName: 'Sarah Johnson', readAt: new Date() }
        ],
        createdAt: new Date()
      }
    ];

    // 20. KinderSafe: Authorized Pickups & Pass Records
    this.pickupPasses = [
      {
        _id: 'pass_001',
        passCode: 'PASS-892101',
        childId: 'ch_001',
        childName: 'Mia Johnson',
        className: 'Playgroup (Butterflies)',
        guardianName: 'Sarah Johnson',
        guardianRelation: 'Mother',
        guardianPhone: '+1 (555) 012-3456',
        guardianPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        otp: '492815',
        qrData: '{"code":"PASS-892101","childId":"ch_001","guardian":"Sarah Johnson"}|sig:7a9f82d1c0b3',
        signature: '7a9f82d1c0b3',
        validFrom: new Date(),
        expiresAt: new Date(Date.now() + 4 * 3600 * 1000), // Valid for 4 hours
        status: 'active',
        isAuthorizedContact: true,
        generatedByName: 'Sarah Johnson (Parent)',
        auditLog: [
          {
            action: 'Pass Generated',
            timestamp: new Date(),
            performedByName: 'Sarah Johnson',
            details: 'Digital pickup pass generated via Parent Portal with 6-digit OTP 492815.'
          }
        ],
        createdAt: new Date()
      },
      {
        _id: 'pass_002',
        passCode: 'PASS-892090',
        childId: 'ch_003',
        childName: 'Oliver Smith',
        className: 'Playgroup (Butterflies)',
        guardianName: 'Emily Smith',
        guardianRelation: 'Mother',
        guardianPhone: '+1 (555) 015-7892',
        guardianPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        otp: '182394',
        qrData: '{"code":"PASS-892090","childId":"ch_003"}|sig:3f98a2c1',
        validFrom: new Date(Date.now() - 7200000),
        expiresAt: new Date(Date.now() + 7200000),
        status: 'verified_completed',
        verifiedAt: new Date(Date.now() - 1800000),
        verifiedById: 'usr_003',
        verifiedByName: 'Clara Oswald',
        handoverNotes: 'Physical photo ID checked. Oliver safely released to mother.',
        auditLog: [
          { action: 'Pass Generated', timestamp: new Date(Date.now() - 7200000), performedByName: 'David Smith', details: 'Pass generated' },
          { action: 'Pickup Completed & Verified', timestamp: new Date(Date.now() - 1800000), performedByName: 'Clara Oswald', details: 'Handover complete' }
        ],
        createdAt: new Date(Date.now() - 7200000)
      }
    ];

    // 21. KinderSafe: Safety Incidents
    this.safetyIncidents = [
      {
        _id: 'inc_001',
        incidentId: 'INC-2026-001',
        childId: 'ch_007',
        childName: 'Ethan Miller',
        className: 'Playgroup (Butterflies)',
        date: yesterdayStr,
        time: '11:15 AM',
        severity: 'Low',
        category: 'Minor Scrape/Fall',
        location: 'Playground soft mulch zone',
        description: 'Ethan tripped over foam stepping log while running and grazed left knee.',
        actionsTaken: 'Wound cleaned with sterile saline wash, soothing dinosaur bandage applied, and rested with cool water.',
        firstAidAdministered: true,
        parentContacted: true,
        parentContactTime: '11:25 AM',
        followUpStatus: 'Resolved',
        followUpNotes: 'Ethan resumed energetic block play 10 minutes later. Guardian thanked staff at dismissal.',
        reportedByName: 'Clara Oswald (Teacher)',
        createdAt: new Date(Date.now() - 86400000)
      }
    ];

    // 22. KinderSafe: Global Safety Audit Logs
    this.safetyAuditLogs = [
      {
        _id: 'sal_001',
        actionType: 'EMERGENCY_DRILL_HEADING',
        details: 'Quarterly Autumn Fire & Safety Drill completed. 100% headcount verified against Live Accountability in 2 mins 45 secs.',
        timestamp: new Date('2026-10-08T10:30:00Z')
      },
      {
        _id: 'sal_002',
        actionType: 'CHILD_PICKUP_CONFIRMED',
        details: 'Oliver Smith safely handed over to verified guardian Emily Smith by Clara Oswald.',
        timestamp: new Date(Date.now() - 1800000)
      }
    ];

    // 23. Child Privacy & Consent Settings
    this.privacySettings = {
      ch_001: { allowPhotos: true, allowObservationSharing: true, retentionConsentGranted: true },
      ch_002: { allowPhotos: true, allowObservationSharing: true, retentionConsentGranted: true },
      ch_003: { allowPhotos: true, allowObservationSharing: true, retentionConsentGranted: true }
    };

    this.isInitialized = true;
    console.log('🌈 KinderHub In-Memory Data Store fully populated with rich preschool demo data!');
  }
}

export const store = new DataStore();
await store.init();
