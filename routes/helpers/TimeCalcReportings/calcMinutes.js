'use strict';

function calculateMinutes (users, month, callback) {
    var usersReports = [];
    var userReport = {
        employee_id : null,
        username: null,
        salaryfixed: null,
        reportminutes: [],
        work_time: null
    };

    var  repMin = [];
    for(var i = 0, len = users.length; i < len; i++){
        var name = users[i].getName();
        userReport.employee_id = users[i].employee_id;
        userReport.username = name;
        userReport.salaryfixed = users[i].salary_fixed;
        userReport.work_time = users[i].work_time;

        var lastReportDay = null;
        var cnt = 0; // cnt < repLen
        var repLen = users[i].report.length;
        for(var j = 1, len1 = new Date(2017, month, 0).getDate(); j <= len1; j++) {
          var obj = {};
          var curDayReport;

          if(users[i].report[cnt]){
              curDayReport  = users[i].report[cnt].createdAt.getDate();
            if(lastReportDay === curDayReport){
              lastReportDay = curDayReport;
              cnt++;
              j--;
              // continue;
            } else {
              if( j === curDayReport ){
                obj.check_in = new Date(users[i].report[cnt].check_in);
                obj.check_out = new Date(users[i].report[cnt].check_out);
                obj.report = users[i].report[cnt].calcTimeCorrectly();
                repMin.push(obj);
                lastReportDay = curDayReport;
                cnt++;
              } else {
                repMin.push({
                  message:'Отсутствовал или воскресенье',
                  counter: cnt,
                  day: j
                });
              }
            }
          } else {
            repMin.push({
              message:'За эти дни нет отчетов',
              counter: cnt,
              day: j
            });
          }
        }
        userReport.reportminutes = repMin;
        usersReports.push(userReport);
        repMin = [];
        userReport = {};
    }


  // for(var i = 0, len = users.length; i < len; i++){
  //     var name = users[i].getName();
  //     userReport.employee_id = users[i].employee_id;
  //     userReport.username = name;
  //     userReport.salaryfixed = users[i].salary_fixed;
  //     userReport.work_time = users[i].work_time;
  //
  //     for(var j = 0, len1 = users[i].report.length; j < len1; j++) {
  //         console.dir(users[i].report[j].createdAt.getDate())
  //         var obj = {};
  //         obj.check_in = new Date(users[i].report[j].check_in);
  //         obj.check_out = new Date(users[i].report[j].check_out);
  //         obj.report = users[i].report[j].calcTimeCorrectly();
  //         repMin.push(obj);
  //     }
  //     userReport.reportminutes = repMin;
  //     usersReports.push(userReport);
  //     repMin = [];
  //     userReport = {};
  // }
  callback(usersReports);

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
    calculateMinutes: calculateMinutes
};