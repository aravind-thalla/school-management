const router = require('express').Router();

const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller.js');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');

const {
    parentRegister,
    parentLogIn,
    getParents,
    getParentDetail,
    deleteParents,
    deleteParent,
    updateParent,
    parentAttendance,
    deleteParentsByClass,
    updateExamResult,
    clearAllParentsAttendanceBySubject,
    clearAllParentsAttendance,
    removeParentAttendanceBySubject,
    removeParentAttendance,
} = require('../controllers/parent-controller.js');

const {
    subjectCreate,
    classSubjects,
    deleteSubjectsByClass,
    getSubjectDetail,
    deleteSubject,
    freeSubjectList,
    allSubjects,
    deleteSubjects,
} = require('../controllers/subject-controller.js');

const {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    deleteTeachers,
    deleteTeachersByClass,
    deleteTeacher,
    updateTeacherSubject,
    teacherAttendance,
} = require('../controllers/teacher-controller.js');

const {
    homeworkCreate,
    homeworkList,
    homeworkListBySchool,
    deleteHomework,
    deleteHomeworks,
    updateHomework,
} = require('../controllers/homework-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);
router.get("/Admin/:id", getAdminDetail);

// Parent (replaces Student role)
router.post('/ParentReg', parentRegister);
router.post('/ParentLogin', parentLogIn);

router.get("/Parents/:id", getParents);
router.get("/Parent/:id", getParentDetail);

router.delete("/Parents/:id", deleteParents);
router.delete("/ParentsClass/:id", deleteParentsByClass);
router.delete("/Parent/:id", deleteParent);

router.put("/Parent/:id", updateParent);
router.put('/UpdateExamResult/:id', updateExamResult);
router.put('/ParentAttendance/:id', parentAttendance);

router.put('/RemoveAllParentsSubAtten/:id', clearAllParentsAttendanceBySubject);
router.put('/RemoveAllParentsAtten/:id', clearAllParentsAttendance);
router.put('/RemoveParentSubAtten/:id', removeParentAttendanceBySubject);
router.put('/RemoveParentAtten/:id', removeParentAttendance);

// Teacher
router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);

router.get("/Teachers/:id", getTeachers);
router.get("/Teacher/:id", getTeacherDetail);

router.delete("/Teachers/:id", deleteTeachers);
router.delete("/TeachersClass/:id", deleteTeachersByClass);
router.delete("/Teacher/:id", deleteTeacher);

router.put("/TeacherSubject", updateTeacherSubject);
router.post('/TeacherAttendance/:id', teacherAttendance);

// Notice
router.post('/NoticeCreate', noticeCreate);
router.get('/NoticeList/:id', noticeList);
router.delete("/Notices/:id", deleteNotices);
router.delete("/Notice/:id", deleteNotice);
router.put("/Notice/:id", updateNotice);

// Complain
router.post('/ComplainCreate', complainCreate);
router.get('/ComplainList/:id', complainList);

// Sclass
router.post('/SclassCreate', sclassCreate);
router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail);
router.get("/Sclass/Students/:id", getSclassStudents);
router.delete("/Sclasses/:id", deleteSclasses);
router.delete("/Sclass/:id", deleteSclass);

// Subject
router.post('/SubjectCreate', subjectCreate);
router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail);
router.delete("/Subject/:id", deleteSubject);
router.delete("/Subjects/:id", deleteSubjects);
router.delete("/SubjectsClass/:id", deleteSubjectsByClass);

// Homework
router.post('/HomeworkCreate', homeworkCreate);
router.get('/HomeworkList/:id', homeworkList);
router.get('/HomeworkListSchool/:id', homeworkListBySchool);
router.put('/Homework/:id', updateHomework);
router.delete('/Homework/:id', deleteHomework);
router.delete('/Homeworks/:id', deleteHomeworks);

module.exports = router;
