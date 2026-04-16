const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const Admin = require("./models/adminSchema");
const Sclass = require("./models/sclassSchema");
const Subject = require("./models/subjectSchema");
const Teacher = require("./models/teacherSchema");
const Student = require("./models/studentSchema");
const Notice = require("./models/noticeSchema");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1/smsproject";

const hash = (plain) => bcrypt.hash(plain, 10);

async function seed() {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
        Admin.deleteMany({}),
        Sclass.deleteMany({}),
        Subject.deleteMany({}),
        Teacher.deleteMany({}),
        Student.deleteMany({}),
        Notice.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // ─── Admin ───────────────────────────────────────────────
    const admin = await Admin.create({
        name: "Rohith Uppunuthula",
        email: "admin@school.com",
        password: "admin@123",
        role: "Admin",
        schoolName: "Rohith Public School",
    });
    console.log("Admin created → admin@school.com / admin@123");

    const schoolId = admin._id;

    // ─── Classes ─────────────────────────────────────────────
    const classNames = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    const classes = await Sclass.insertMany(
        classNames.map((name) => ({ sclassName: name, school: schoolId }))
    );
    console.log("Classes created:", classNames.join(", "));

    // ─── Subjects ────────────────────────────────────────────
    const subjectData = [
        { subName: "Mathematics",        subCode: "MATH101", sessions: "40" },
        { subName: "Science",            subCode: "SCI102",  sessions: "38" },
        { subName: "English",            subCode: "ENG103",  sessions: "36" },
        { subName: "Social Studies",     subCode: "SST104",  sessions: "34" },
        { subName: "Hindi",              subCode: "HIN105",  sessions: "36" },
        { subName: "Computer Science",   subCode: "CS106",   sessions: "30" },
        { subName: "Physics",            subCode: "PHY107",  sessions: "38" },
        { subName: "Chemistry",          subCode: "CHE108",  sessions: "38" },
        { subName: "Biology",            subCode: "BIO109",  sessions: "36" },
        { subName: "Physical Education", subCode: "PE110",   sessions: "20" },
    ];

    // 2 subjects per class
    const subjects = [];
    for (let i = 0; i < classes.length; i++) {
        const s1 = await Subject.create({ ...subjectData[i * 2],     sclassName: classes[i]._id, school: schoolId });
        const s2 = await Subject.create({ ...subjectData[i * 2 + 1], sclassName: classes[i]._id, school: schoolId });
        subjects.push(s1, s2);
    }
    console.log("Subjects created:", subjects.length);

    // ─── Teachers ────────────────────────────────────────────
    const teacherNames = [
        "Priya Sharma",    "Arjun Mehta",    "Sunita Rao",     "Kiran Desai",
        "Anjali Nair",     "Vikram Joshi",   "Pooja Verma",    "Rahul Gupta",
        "Meena Pillai",    "Suresh Kumar",   "Deepa Reddy",    "Amit Saxena",
        "Kavitha Menon",   "Rajesh Patil",   "Lavanya Iyer",   "Naveen Bhat",
        "Swathi Krishnan", "Manoj Tiwari",   "Rekha Bhatt",    "Dinesh Choudhary",
        "Smitha George",   "Prakash Yadav",
    ];

    const teachers = [];
    for (let i = 0; i < teacherNames.length; i++) {
        const classIdx  = i % classes.length;
        const subjectIdx = i % subjects.length;
        const email = `teacher${i + 1}@school.com`;
        const t = await Teacher.create({
            name:        teacherNames[i],
            email,
            password:    await hash("teacher@123"),
            role:        "Teacher",
            school:      schoolId,
            teachSubject: subjects[subjectIdx]._id,
            teachSclass:  classes[classIdx]._id,
        });
        // link subject → teacher
        await Subject.findByIdAndUpdate(subjects[subjectIdx]._id, { teacher: t._id });
        teachers.push(t);
    }
    console.log("Teachers created → teacher1@school.com … teacher22@school.com / teacher@123");

    // ─── Students ────────────────────────────────────────────
    const studentNames = [
        "Aarav Singh",       "Diya Patel",        "Rohan Sharma",      "Ananya Nair",
        "Kabir Mehta",       "Ishaan Reddy",       "Siya Gupta",        "Vihaan Kumar",
        "Anika Joshi",       "Reyansh Desai",      "Saanvi Rao",        "Arnav Pillai",
        "Myra Menon",        "Aditya Verma",       "Pari Iyer",         "Shaurya Bhat",
        "Avni Krishnan",     "Vivaan Tiwari",      "Riya Saxena",       "Aryan Patil",
        "Kiara Bhatt",       "Dhruv Choudhary",    "Navya George",      "Atharv Yadav",
    ];

    const students = [];
    for (let i = 0; i < studentNames.length; i++) {
        const classIdx = i % classes.length;
        const s = await Student.create({
            name:      studentNames[i],
            rollNum:   i + 1,
            password:  await hash("student@123"),
            role:      "Student",
            school:    schoolId,
            sclassName: classes[classIdx]._id,
        });
        students.push(s);
    }
    console.log("Students created (rollNum 1–24, password: student@123)");

    // ─── Notices ─────────────────────────────────────────────
    const notices = [
        { title: "Annual Sports Day",          details: "Annual sports day will be held on 15th April. All students must participate.",   date: new Date("2026-04-15") },
        { title: "Parent-Teacher Meeting",     details: "PTM scheduled for 5th April from 10 AM to 1 PM. Attendance mandatory.",          date: new Date("2026-04-05") },
        { title: "Holiday Notice",             details: "School will remain closed on 14th April for Dr. Ambedkar Jayanti.",               date: new Date("2026-04-14") },
        { title: "Exam Schedule Released",     details: "Final exam timetable has been uploaded. Check the portal for details.",           date: new Date("2026-03-30") },
        { title: "Science Exhibition",         details: "Inter-school science exhibition on 20th April. Register by 10th April.",          date: new Date("2026-04-20") },
    ];
    await Notice.insertMany(notices.map((n) => ({ ...n, school: schoolId })));
    console.log("Notices created:", notices.length);

    console.log("\n===== SEED COMPLETE =====");
    console.log("Admin    → admin@school.com       / admin@123");
    console.log("Teachers → teacher1@school.com … teacher22@school.com / teacher@123");
    console.log("Students → rollNum 1–24, name required at login / student@123");
    console.log("=========================\n");

    await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
