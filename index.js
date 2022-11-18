const express = require('express');
const app = express();
const nodemon = require('nodemon');
app.use(express.json());

//MongoDB Package
const mongoose = require('mongoose');

const PORT = 1200;
let today = new Date().toLocaleDateString()

const dbUrl = "mongodb+srv://admin:<3LACq6Y_Mqq!CK.>@cloud.met3ruq.mongodb.net/test";

//Connect to MongoDB
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

//MongoDB Connection
const db = mongoose.connection;

//Handle DB Error, display connection
db.on('error', () => (
    console.error.bind(console, 'connection error: ')
));
db.once('open', () => {
    console.log('MongoDB Connected');
});

//Schema/Model Declaration
require('./Models/Students');
require('./Models/Courses');

const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

app.get('/', (req,res) => {
    return res.status(200).json("{message: OK}")
});

app.get('/getAllCourses', async (req,res) => {
    try {
        let programs = await Course.find({}).lean();
        return res.status(200).json(programs);
    }
    catch {
        return res.status(500).json("{message: Failed to access course data}");
    }
});

app.get('/getAllStudents', async (req,res) => {
    try {
        let learners = await Student.find({}).lean();
        return res.status(200).json(learners);
    }
    catch {
        return res.status(500).json("{message: Failed to access student data}");
    }
});

app.get('/findStudent', async (req,res) => {
    try {
        let learners = await Student.find({fname: req.body.fname}).lean();
        return res.status(200).json(learners);
    }
    catch {
        return res.status(500).json("{message: Unable to find}");
    }
});

app.get('/findCourse', async (req,res) => {
    try {
        let programs = await Course.find({courseID: req.body.courseID}).lean();
        return res.status(200).json(programs);
    }
    catch {
        return res.status(500).json("{message: Unable to find}");
    }
});

app.post('/addCourse', async (req,res) => {
    try {
        let program = {
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName,
            dateEntered: new Date()
        }

        await Course(program).save().then(c => {
            return res.status(201).json("Course Added!");
        })
    }
    catch {
        return res.status(500).json("{message: Failed to add course - bad data}");
    }
});

app.post('/addStudent', async (req,res) => {
    try {
        let learner = {
            fname: req.body.fname,
            lname: req.body.lname,
            studentID: req.body.studentID,
            dateEntered: new Date()
        }

        await Student(learner).save().then(c => {
            return res.status(201).json("Student Added!");
        })
    }
    catch {
        return res.status(500).json("{message: Failed to add student - bad data}");
    }
});

app.post('/editStudentById', async (req,res) => {
    try {
        let learner = await Crypto.findOne({_id: req.body.id});
        if (learner){
            await Student.updateOne({_id: req.body.id},{
                fname: req.body.fname
            }, {upsert: true});
            return res.status(200).json("{message: Student First Name updated!}");
        }else {
            return res.status(200).json("{message: No student found}")
        }
    }
    catch {
        return res.status(500).json("{message: Failed to edit student by ID}");
    }
});

app.post('/editStudentByFname', async (req,res) => {
    try {
        let learner = await Crypto.findOne({_id: req.body.id});
        if (learner){
            await Student.updateOne({_id: req.body.id},{
                fname: req.body.fname,
                lname: req.body.lname
            }, {upsert: true});
            return res.status(200).json("{message: Student First Name updated!}");
        }else {
            return res.status(200).json("{message: No student found}")
        }
    }
    catch {
        return res.status(500).json("{message: Failed to edit student by ID}");
    }
});

app.post('/editCourseByCourseName', async (req,res) => {
    try {
        let program = await Crypto.findOne({_id: req.body.id});
        if (program){
            await Course.updateOne({_id: req.body.id},{
                courseInstructor: req.body.courseInstructor
            }, {upsert: true});
            return res.status(200).json("{message: Course Instructor Name Updated!}");
        }else {
            return res.status(200).json("{message: No course found}")
        }
    }
    catch {
        return res.status(500).json("{message: Failed to edit student by ID}");
    }
});
app.post('/deleteCourseById', async (req,res) => {
    try {
        let program = await Crypto.findOne({_id: req.body.id});
        if (program){
            await Course.deleteOne({_id: req.body.id});
        }else {
            return res.status(200).json("{message: No Course Deleted- query null}");
        }
    }
    catch {
        return res.status(500).json("{message: Failed to delete course}");
    }
});

app.post('/removeStudentFromClasses', async (req,res) =>{
    try{
        let learner = await Student.findOne({studentID: req.body.studentid});
        if(learner){
            await Student.deleteOne({studentID: req.body.studentid})
            return res.status(200).json("{message: student deleted}");
        }
        else{
            return res.status(200).json("{message: no student found}");
        }
    }
    catch{
        return res.status(500).json("{message: Failed to delete student by studentID - bad data}");
    }
});
app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});
