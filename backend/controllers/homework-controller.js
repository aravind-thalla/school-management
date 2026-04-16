const Homework = require('../models/homeworkSchema.js');

const homeworkCreate = async (req, res) => {
    try {
        const homework = new Homework(req.body);
        const result = await homework.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const homeworkList = async (req, res) => {
    try {
        const homeworks = await Homework.find({ sclassName: req.params.id })
            .populate("subName", "subName")
            .populate("assignedBy", "name")
            .sort({ dueDate: 1 });

        if (homeworks.length > 0) {
            res.send(homeworks);
        } else {
            res.send({ message: "No homework found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const homeworkListBySchool = async (req, res) => {
    try {
        const homeworks = await Homework.find({ school: req.params.id })
            .populate("subName", "subName")
            .populate("sclassName", "sclassName")
            .populate("assignedBy", "name")
            .sort({ dueDate: 1 });

        if (homeworks.length > 0) {
            res.send(homeworks);
        } else {
            res.send({ message: "No homework found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteHomework = async (req, res) => {
    try {
        const result = await Homework.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteHomeworks = async (req, res) => {
    try {
        const result = await Homework.deleteMany({ sclassName: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No homework found to delete" });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateHomework = async (req, res) => {
    try {
        const result = await Homework.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    homeworkCreate,
    homeworkList,
    homeworkListBySchool,
    deleteHomework,
    deleteHomeworks,
    updateHomework,
};
