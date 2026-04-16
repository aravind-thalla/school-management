const bcrypt = require('bcrypt');
const Parent = require('../models/parentSchema.js');
const Subject = require('../models/subjectSchema.js');

const parentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingParent = await Parent.findOne({ email: req.body.email });

        if (existingParent) {
            return res.send({ message: 'Email already exists' });
        }

        const parent = new Parent({
            ...req.body,
            school: req.body.adminID,
            password: hashedPass
        });

        let result = await parent.save();
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const parentLogIn = async (req, res) => {
    try {
        let parent = await Parent.findOne({ email: req.body.email });
        if (parent) {
            const validated = await bcrypt.compare(req.body.password, parent.password);
            if (validated) {
                parent = await parent.populate("school", "schoolName");
                parent = await parent.populate("sclassName", "sclassName");
                parent.password = undefined;
                parent.examResult = undefined;
                parent.attendance = undefined;
                res.send(parent);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Parent not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getParents = async (req, res) => {
    try {
        let parents = await Parent.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (parents.length > 0) {
            let modifiedParents = parents.map((parent) => {
                return { ...parent._doc, password: undefined };
            });
            res.send(modifiedParents);
        } else {
            res.send({ message: "No parents found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getParentDetail = async (req, res) => {
    try {
        let parent = await Parent.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (parent) {
            parent.password = undefined;
            res.send(parent);
        } else {
            res.send({ message: "No parent found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteParent = async (req, res) => {
    try {
        const result = await Parent.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteParents = async (req, res) => {
    try {
        const result = await Parent.deleteMany({ school: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No parents found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteParentsByClass = async (req, res) => {
    try {
        const result = await Parent.deleteMany({ sclassName: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No parents found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateParent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        let result = await Parent.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) {
            return res.send({ message: 'Parent not found' });
        }

        const existingResult = parent.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            parent.examResult.push({ subName, marksObtained });
        }

        const result = await parent.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const parentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) {
            return res.send({ message: 'Parent not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = parent.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            const attendedSessions = parent.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            parent.attendance.push({ date, status, subName });
        }

        const result = await parent.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllParentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;
    try {
        const result = await Parent.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllParentsAttendance = async (req, res) => {
    const schoolId = req.params.id;
    try {
        const result = await Parent.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeParentAttendanceBySubject = async (req, res) => {
    const parentId = req.params.id;
    const subName = req.body.subId;
    try {
        const result = await Parent.updateOne(
            { _id: parentId },
            { $pull: { attendance: { subName: subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeParentAttendance = async (req, res) => {
    const parentId = req.params.id;
    try {
        const result = await Parent.updateOne(
            { _id: parentId },
            { $set: { attendance: [] } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
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
};
