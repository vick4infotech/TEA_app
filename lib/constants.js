export const APP_NAME = 'TEA-APP';
export const CHURCH_NAME = 'The Edifying Assembly';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  SUPER_TRAINING_COORDINATOR: 'Super Training Coordinator',
  BRANCH_ADMIN: 'Branch Admin',
  BRANCH_TRAINING_COORDINATOR: 'Branch Training Coordinator',
  BRANCH_EVANGELISM_COORDINATOR: 'Branch Evangelism Coordinator'
};

export const RESOURCE_CONFIG = {
  branches: { model:'branch', title:'Branches', create:'Add Branch', roles:['SUPER_ADMIN'], fields:['name','code','address','phone','email','status'] },
  users: { model:'user', title:'Users and Roles', create:'Add User', roles:['SUPER_ADMIN','BRANCH_ADMIN'], fields:['name','email','role','branchId','active'] },
  families: { model:'family', title:'Families', create:'Add Family', roles:['SUPER_ADMIN','BRANCH_ADMIN'], fields:['name','branchId','familyHead','address','phone','email','notes'] },
  members: { model:'member', title:'Members', create:'Add Member', roles:['SUPER_ADMIN','BRANCH_ADMIN'], fields:['fullName','gender','dateOfBirth','phone','email','familyId','branchId','membershipStatus','maritalStatus','dateJoined','occupation','active'] },
  'training-types': { model:'trainingType', title:'Training Types', create:'Add Training Type', roles:['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR'], fields:['name','shortCode','description','isEntryLevel','canBePromotedFrom','canPromoteTo','status'] },
  'training-levels': { model:'trainingLevel', title:'Training Levels', create:'Add Training Level', roles:['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR'], fields:['trainingTypeId','name','levelCode','levelOrder','requiredPassedExams','passMark','certificateRequired','nextEligible','status'] },
  'training-sets': { model:'trainingSet', title:'Training Sets', create:'Add Training Set', roles:['SUPER_ADMIN','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR'], fields:['trainingTypeId','trainingLevelId','branchId','name','sessionYear','startDate','expectedEndDate','curriculumNotes','sermonLinks','status'] },
  students: { model:'studentTrainingRecord', title:'Student Registration', create:'Register Student', roles:['SUPER_ADMIN','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR'], fields:['memberId','branchId','trainingTypeId','trainingLevelId','trainingSetId'] },
  scores: { model:'score', title:'Score Entry', create:'Enter Score', roles:['SUPER_ADMIN','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR'], fields:['studentRecordId','examNumber','finalScore','dateOfExam'] },
  curriculum: { model:'curriculum', title:'Curriculum', create:'Add Curriculum', roles:['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR'], fields:['trainingTypeId','trainingLevelId','title','description','fileUrl','relatedSermonUrl','examNumber','expectedExamDate','status'] },
  sermons: { model:'sermonLink', title:'Sermon Links', create:'Add Sermon', roles:['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR'], fields:['title','minister','sermonUrl','trainingTypeId','trainingLevelId','trainingSetId','topicOrExamNumber','sermonDate','status'] },
  attendance: { model:'attendance', title:'Attendance', create:'Add Attendance', roles:['SUPER_ADMIN','BRANCH_ADMIN'], fields:['branchId','title','attendanceDate','totalPersons','firstTimers','children','men','women','notes'] },
  outreach: { model:'outreachReport', title:'Evangelism Reports', create:'Add Outreach Report', roles:['SUPER_ADMIN','BRANCH_ADMIN','BRANCH_EVANGELISM_COORDINATOR'], fields:['branchId','title','reportType','startDate','endDate','numberReached','firstTimers','numberSaved','supernaturalsRecorded','jointPrayers','location','testimonies','notes'] },
  certificates: { model:'certificate', title:'Certificates and Completion Letters', create:'Generate Certificate', roles:['SUPER_ADMIN','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR'], fields:['studentRecordId'] }
};

export const SPECIAL_PAGE_ROLES = {
  dashboard: Object.keys(ROLES),
  analytics: Object.keys(ROLES),
  reports: ['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR','BRANCH_EVANGELISM_COORDINATOR'],
  promotion: ['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR','BRANCH_ADMIN','BRANCH_TRAINING_COORDINATOR'],
  settings: ['SUPER_ADMIN'],
  'result-checker': Object.keys(ROLES)
};

export const NAV_GROUPS = [
  {
    title: 'Dashboard',
    items: [
      { slug: 'dashboard', label: 'Dashboard', href: '/dashboard' }
    ]
  },
  {
    title: 'Branch Management',
    items: [
      { slug: 'branches', label: 'Branches' },
      { slug: 'users', label: 'Branch Users' },
      { slug: 'analytics', label: 'Branch Analytics' }
    ]
  },
  {
    title: 'Member Management',
    items: [
      { slug: 'families', label: 'Families' },
      { slug: 'members', label: 'Members' },
      { slug: 'members', label: 'Bulk Upload Members' },
      { slug: 'reports', label: 'Birthday Reports' }
    ]
  },
  {
    title: 'Training Management',
    items: [
      { slug: 'training-types', label: 'Training Types' },
      { slug: 'training-levels', label: 'Training Levels' },
      { slug: 'training-sets', label: 'Training Sets' },
      { slug: 'students', label: 'Students' },
      { slug: 'students', label: 'Bulk Upload Students' },
      { slug: 'scores', label: 'Score Entry' },
      { slug: 'promotion', label: 'Promotions' },
      { slug: 'certificates', label: 'Certificates' },
      { slug: 'curriculum', label: 'Curriculum' },
      { slug: 'sermons', label: 'Sermon Links' },
      { slug: 'result-checker', label: 'Result Checker', href: '/result-checker' }
    ]
  },
  {
    title: 'Attendance Management',
    items: [
      { slug: 'attendance', label: 'Attendance Records' },
      { slug: 'attendance', label: 'Add Attendance' }
    ]
  },
  {
    title: 'Evangelism Management',
    items: [
      { slug: 'outreach', label: 'Outreach Reports' },
      { slug: 'outreach', label: 'Add Outreach Report' },
      { slug: 'analytics', label: 'Evangelism Analytics' }
    ]
  },
  {
    title: 'Report Management',
    items: [
      { slug: 'reports', label: 'Reports' },
      { slug: 'reports', label: 'Export Center' }
    ]
  },
  {
    title: 'Admin Utilities',
    items: [
      { slug: 'users', label: 'Users and Roles' },
      { slug: 'settings', label: 'Settings' }
    ]
  }
];

export const NAV = NAV_GROUPS.flatMap(group => group.items.map(item => [item.slug, item.label]));
