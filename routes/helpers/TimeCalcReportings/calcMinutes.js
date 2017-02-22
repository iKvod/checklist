'use strict';

function calculateMinutes (users, res, callback) {
    var usersReports = [];
    var userReport = {
        employee_id : null,
        username: null,
        salaryfixed: null,
        reportminutes: []
    };

    var  repMin = [];

    for(var i = 0, len = users.length; i < len; i++){
        var name = users[i].lastname + " " + users[i].firstname;
        userReport.employee_id = users[i].employee_id;
        userReport.username = name;
        userReport.salaryfixed = users[i].salary_fixed;

        for(var j = 0, len1 = users[i].report.length; j < len1; j++){
            var obj = {};
            obj.check_in = new Date(users[i].report[j].check_in);
            obj.check_out = new Date(users[i].report[j].check_out);
            obj.report = users[i].report[j].calcTimeCorrectly();
            repMin.push(obj);
            //console.dir(obj);
        }
        userReport.reportminutes = repMin;
        usersReports.push(userReport);
        repMin = [];
        userReport = {};
    }
    callback(usersReports, res);
}

function sendReportMinutes(userReport, res) {
    res.send(userReport);
}

//if Users populater from Reports
// function calculateMinutes (report, callback, usersReports, res) {
//     var reportMinutes = [];
//     var name = '';
//
//     for(var i = 0; i < report.length; i++){
//         if(i === 0){
//             name = report[i].employee.lastname + " " +report[i].employee.firstname;
//             usersReports.name = name;
//         }
//         reportMinutes.push(report[i].calcTime());
//     }
//     callback(reportMinutes, usersReports, res);
// };
//
// function sendReportMinutes(reportMinutes, usersReports, res) {
//     usersReports.reportminutes = reportMinutes;
//     res.send(usersReports);
// }


module.exports = {
    calculateMinutes: calculateMinutes,
    sendReportMinutes: sendReportMinutes
};