/* Task Description */
/* 
 * Create a module for a Telerik Academy course
 * The course has a title and presentations
 * Each presentation also has a title
 * There is a homework for each presentation
 * There is a set of students listed for the course
 * Each student has firstname, lastname and an ID
 * IDs must be unique integer numbers which are at least 1
 * Each student can submit a homework for each presentation in the course
 * Create method init
 * Accepts a string - course title
 * Accepts an array of strings - presentation titles
 * Throws if there is an invalid title
 * Titles do not start or end with spaces
 * Titles do not have consecutive spaces
 * Titles have at least one character
 * Throws if there are no presentations
 * Create method addStudent which lists a student for the course
 * Accepts a string in the format 'Firstname Lastname'
 * Throws if any of the names are not valid
 * Names start with an upper case letter
 * All other symbols in the name (if any) are lowercase letters
 * Generates a unique student ID and returns it
 * Create method getAllStudents that returns an array of students in the format:
 * {firstname: 'string', lastname: 'string', id: StudentID}
 * Create method submitHomework
 * Accepts studentID and homeworkID
 * homeworkID 1 is for the first presentation
 * homeworkID 2 is for the second one
 * ...
 * Throws if any of the IDs are invalid
 * Create method pushExamResults
 * Accepts an array of items in the format {StudentID: ..., Score: ...}
 * StudentIDs which are not listed get 0 points
 * Throw if there is an invalid StudentID
 * Throw if same StudentID is given more than once ( he tried to cheat (: )
 * Throw if Score is not a number
 * Create method getTopStudents which returns an array of the top 10 performing students
 * Array must be sorted from best to worst
 * If there are less than 10, return them all
 * The final score that is used to calculate the top performing students is done as follows:
 * 75% of the exam result
 * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
 */

function solve() {
    //the private variables
    var title,
        presentations,
        students = [],
        homeworks = [],
        examResults = [];

    //the validation functions
    function validateTitle(title, name) {
        if (typeof title !== "string") {
            throw new Error(name + " should be a string!");
        }
        if (title.length < 1) {
            throw new Error(name + " should has at least one character!");
        }
        if (/\s\s+/.test(title)) {
            throw new Error(name + " should not contain consecutive spaces!");
        }
        if (/^\s/.test(title)) {
            throw new Error(name + " should not begin with space!");
        }
        if (/\s$/.test(title)) {
            throw new Error(name + " should not end with space!");
        }

    }

    function validatePresentations(presentations) {
        if (!Array.isArray(presentations)) {
            throw new Error("The presentations should be an array!");
        }
        if (presentations.length < 1) {
            throw new Error("There should be at least one presentation!");
        }
        presentations.forEach(function (title) {
            validateTitle(title, "presentation title");
        })
    }
    function startsWithCapitalLetter (value){
        var firstChar = value.charAt(0);
        if(!(firstChar === firstChar.toUpperCase())){
            throw new Error("The name should start with capital letter!");
        }
    }
    function validateStudent(student) {
        var names;
        if(typeof student !== "string"){
            throw new Error("The student name should be string!");
        }
        names = student.split(" ");
        if(names.length !== 2){
            throw new Error("Student should have exactly two names!");
        }
        startsWithCapitalLetter(names[0]);
        startsWithCapitalLetter(names[1]);
    }
    function validateId(id){
        if(id % 1 !== 0 || id < 1){
            throw new Error("All indexes should be nonegative whole numbers!");
        }
    }
    function validateHomework(studentId, homeworkId){
        validateId(studentId);
        validateId(homeworkId);
        if(studentId > students.length){
            throw new Error("Invalid student id");
        }
        if(homeworkId > presentations.length){
            throw new Error("Invalid homework id");
        }
    }
    function validateResult(result){
        if(typeof result !== "object"){
            throw new Error("Each result should be an object!");
        }
        if(Object.keys(result).length !== 2){
            throw new Error("Invalid result format!");
        }
        if(!result.hasOwnProperty("StudentID")){
            throw new Error("StudentID missing!");
        }
        if(!result.hasOwnProperty("score")){
            throw new Error("score missing!");
        }

    }
    function validateExamResults(results){
        if(!Array.isArray(results)){
            throw new Error("The results should be array!");
        }
        results.forEach(function(result){
            validateResult(result);
            if(results.some(function(curResult){
                    return curResult !== result && curResult.StudentID === result.StudentID;
                })){
                throw new Error("Duplicated student ids!");
            }
        });
    }
    // end of the validation functions
    function sortResults(results){
        function eval(res1, res2){
            return res1.grade < res2.grade;
        }
        return results.sort(eval);
    }
    function getStudentGrades(student, id){
        var newStudent = JSON.parse(JSON.stringify(student)),
        examScore,
        homeworkScore,
        submittedHW = [];
        id +=1;
        function uniq(a) {
            return a.sort().filter(function(item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })
        }
        examResults.some(function(result){
            if(result.StudentID === id){
                examScore = result.score;
                return true;
            }
        });
        if(!examScore){
            examScore = 0;
        }
        newStudent.examScore= examScore;

        homeworks.every(function(hw){
            if(hw.StudentID === id){
                submittedHW.push(hw.HomeworkID);
                return true;
            }
        });
        submittedHW = uniq(submittedHW);
        homeworkScore = submittedHW.length / presentations.length;
        newStudent.homeworkScore = homeworkScore;
        newStudent.grade = (75 / 100) * examScore + (25 / 100) * homeworkScore;
        return newStudent;
    }

    function setStudentGrades(){
        students = students.map(getStudentGrades);
    }

    var Course = {
        init: function (newTitle, newPresentations) {
            students = [];
            homeworks = [];
            examResults = [];
            validateTitle(newTitle, "course title");
            title = newTitle;
            validatePresentations(newPresentations);
            presentations = newPresentations.slice();
            return this;
        },
        addStudent: function (name) {
            var names;
            validateStudent(name);
            names = name.split(" ");
            students.push({
                "firstname": names[0],
                "lastname": names[1]
            });
            return students.length;
        },
        getAllStudents: function () {
            return students.map(function(student, index){
                var newStudent = JSON.parse(JSON.stringify(student));
                newStudent.id = index+1;
                return newStudent;
            });
        },
        submitHomework: function (studentID, homeworkID) {
            validateHomework(studentID, homeworkID);
            homeworks.push({
                "StudentID" : studentID,
                "HomeworkID" : homeworkID
            });
        },
        pushExamResults: function (results) {
            validateExamResults(results);
            examResults = examResults.concat(results);
        },
        getTopStudents: function () {
            setStudentGrades();
           return sortResults(students).slice(0,10);
        }
    };

    return Course;
}
//var JavascriptOOP = solve();
//JavascriptOOP.init("JavaScript OOP", ["Introduction", "Closures"]);
//JavascriptOOP.addStudent("Petur Petrov");
//JavascriptOOP.addStudent("Ivan Ivanov");
//JavascriptOOP.addStudent("Georgi Georgiev");
//
//JavascriptOOP.submitHomework(1, 1);
//JavascriptOOP.pushExamResults([{StudentID: 1, score: 10.5},{StudentID: 3, score:5.5}]);
//console.log(JavascriptOOP.getTopStudents());
module.exports = solve;

