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
                // console.log(new Date(2017, month - 1, j));
                // console.log(j);
                repMin.push({
                  message: 'Воскресенье или Отсутствовал(а)',
                  // counter: cnt,
                  // day: ['Пн.','Вт.', 'Ср.', 'Чт.', 'Пт.','Сб.','Вс.'][j],
                  reportDay: new Date(2017, month-1, j+1),
                  date: j
                });
              }
            }
          } else {
            repMin.push({
              message: 'Воскресенье или Отсутствовал(а)',
              // counter: cnt,
              // day: ['Пн.','Вт.', 'Ср.', 'Чт.', 'Пт.','Сб.','Вс.'][j],
              reportDay: new Date(2017, month-1, j+1),
              date: j
            });
          }
        }
        userReport.reportminutes = repMin;
        usersReports.push(userReport);
        repMin = [];
        userReport = {};
    }

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