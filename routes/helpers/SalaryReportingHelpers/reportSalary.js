(function () {
  'use strict';
  var calendar = require('../calendar/calendar');

  /*
   * salaryFixedHourCalc - calculates the fixed salary for workdays and saturdays
   * calendar returns JSON object  {
   month: null,
   days: 0,
   workdays: 0,
   saturdays: 0,
   sundays: 0
   };
   * */

  var calcSalaryFixedPerDay = function (date, salaryFixedPerMonth) {
    // unefficient way becose it generate moth callendar every time
    var calReport = calendar.countForCurrentMonth(date.getYear(), date.getMonth());

    // var salaryFixedPerHour = {
    //     saturdaySalaryNormal: null,
    //     weekDaySalaryNormal: null
    // };

    var salaryFixedPerDay = salaryFixedPerMonth / (calReport.workdays + calReport.saturdays);
    // callback(salaryFixedPerDay);
    // console.log(calReport);
    return salaryFixedPerDay;
  };

  //determines the weekday and calculates salary per Hour for current day
  //returns salary per day
  /*
   * $params weekDay from check_in Date  info
   * weekDayType - passed as an object that contains holiday: Boolean, workday: Boolean
   * callback - calcSalaryFixedPerDay
   * bonus - bonus for holidays if exists
   * calcSalaryFixedPerHour - calculated salary for current month;
   * totalTimeInMinutes - how much time employye worked for current day;
   * */
  var salaryPerDay = function (date, weekDayType, salaryFixedPerMonth, totalTimeInMinutes, bonus = null, workhour_fixed) {
    //console.log(emplFixedWorkHour)
    var salaryFixedPerDay = calcSalaryFixedPerDay(date, salaryFixedPerMonth); // callback - fixed salary for per workday
    // console.log(calcSalaryFixedPerDay(date, salaryFixedPerMonth));
    var weekDay = date.getDay(); // this should in function parameter as object key
    var salaryRealPerDay = null;
    var salaryReportPerDay  = {
      salaryRealPerDay: null,
      weekDay: null,
      workHourNormal: null,
      emplFixedWorkHour: null
    };

    // var weekDayWorkHourNormal  = 7.0;
    var weekDayWorkHourNormal  = workhour_fixed;
    var saturdayWorkHourNormal =  6.0;
    //var saturdatWorkHourReal =
    var weekDayWorkHourReal = totalTimeInMinutes / 60.0;
    var weekDayType = {
      holiday: false,
      workday: true
    };

    if( weekDay != 6 && weekDay != 0 && !weekDayType.holiday && weekDayType.workday){

      if(weekDayWorkHourNormal >= weekDayWorkHourReal){
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;

        // console.log("----------------------");
        // console.log("Всего отработал- " + totalTimeInMinutes);
        // console.log(salaryRealPerDay)
        // console.log("----------------------");
      } else {
        // console.log("Переработка");
        // console.log("++++++++++++++++++++++++");
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
        // console.log("++++++++++++++++++++++++");
      }
      //console.log("Workday");
      // console.log(salaryRealPerDay);
      return salaryReportPerDay;
    } else if ( weekDay === 6 && !weekDayType.holiday && weekDayType.workday ) {

      if(saturdayWorkHourNormal >= weekDayWorkHourReal){
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / saturdayWorkHourNormal * weekDayWorkHourReal;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = saturdayWorkHourNormal;
        salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      } else {
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = saturdayWorkHourNormal;
        salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      }
      return salaryReportPerDay;
    } else if( weekDay === 0 && !weekDayType.holiday && weekDayType.workday) { // if sunday and this day is workday
      if(weekDayWorkHourNormal >= weekDayWorkHourReal){
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay  =  salaryFixedPerDay + bonus; //* weekDayWorkHourNormal;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;

        // console.log("Fixed3")

      } else {
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal + bonus;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      }
      // console.log("Воскресенье");
      // console.log(salaryRealPerDay);
      return salaryReportPerDay;
    } else {
      // console.log("Другие дни");
      salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
      salaryReportPerDay.salaryRealPerDay = 0.0;
      salaryReportPerDay.weekDay = weekDay;
      salaryReportPerDay.workHourNormal = 0;
      salaryReportPerDay.emplFixedWorkHour = 0;
      // console.log(salaryRealPerDay);
      return salaryReportPerDay;
    }
    //console.log(salaryRealPerDay);
    // console.log(salaryRealPerDay);
    //  return salaryRealPerDay;
  };

  /*
   *calculates salary for current month;
   * calendarInfo from calendar model mongodb
   * params
   * month - current month
   * date - used to Determine the Year
   *
   * */
  var salaryTotal = function(date, month, salaryPerDay, weekDayType, calcSalaryFixedPerDay, salaryFixedPerMonth,  totalTimeInMinutes, bonus = null){ // calendarInfo used to determine fetch report per month

    var numberOfDays = calendar.countForCurrentMonth(date.getYear(), month);

    var salaryReport = [];
    var totalSalaryPerMonth = 0.0;

    for (var i = 0, len = salaryReport.length; i < len; ++i){
      totalSalaryPerMonth += salaryReport[i];
    }
  };

  module.exports = {
    calcSalaryFixedPerDay: calcSalaryFixedPerDay,
    salaryPerDay: salaryPerDay
  }
})();


// (function () {
//     'use strict';
//     var calendar = require('../calendar/calendar');
//
//     /*
//     * salaryFixedHourCalc - calculates the fixed salary for workdays and saturdays
//     * calendar returns JSON object  {
//      month: null,
//      days: 0,
//      workdays: 0,
//      saturdays: 0,
//      sundays: 0
//      };
//     * */
//
//     var calcSalaryFixedPerDay = function (date, salaryFixedPerMonth) {
//         // unefficient way becose it generate moth callendar every time
//         var calReport = calendar.countForCurrentMonth(date.getYear(), date.getMonth());
//
//         // var salaryFixedPerHour = {
//         //     saturdaySalaryNormal: null,
//         //     weekDaySalaryNormal: null
//         // };
//
//         var salaryFixedPerDay = salaryFixedPerMonth / (calReport.workdays + calReport.saturdays);
//
//         return salaryFixedPerDay;
//     };
//
//     //determines the weekday and calculates salary per Hour for current day
//     //returns salary per day
//     /*
//     * $params weekDay from check_in Date  info
//     * weekDayType - passed as an object that contains holiday: Boolean, workday: Boolean
//     * callback - calcSalaryFixedPerDay
//     * bonus - bonus for holidays if exists
//     * calcSalaryFixedPerHour - calculated salary for current month;
//     * totalTimeInMinutes - how much time employye worked for current day;
//     * */
//     var salaryPerDay = function (
//         date,
//         weekDayType,
//         salaryFixedPerMonth,
//         calcSalaryFixedPerDay,
//         totalTimeInMinutes,
//         bonus = null,
//         workhour_fixed
//       ) {
//         //console.log(emplFixedWorkHour)
//         var salaryFixedPerDay = calcSalaryFixedPerDay(date, salaryFixedPerMonth); // callback - fixed salary for per workday
//        // console.log(calcSalaryFixedPerDay(date, salaryFixedPerMonth));
//         var weekDay = date.getDay(); // this should in function parameter as object key
//         var salaryRealPerDay = null;
//         var salaryReportPerDay  = {
//           salaryRealPerDay: null,
//           weekDay: null,
//           workHourNormal: null,
//           emplFixedWorkHour: null
//         };
//
//         // var weekDayWorkHourNormal  = 7.0;
//       var weekDayWorkHourNormal  = workhour_fixed;
//         var saturdayWorkHourNormal =  6.0;
//         //var saturdatWorkHourReal =
//         var weekDayWorkHourReal = totalTimeInMinutes / 60.0;
//         var weekDayType = {
//             holiday: false,
//             workday: true
//         };
//
//         if( weekDay != 6 && weekDay != 0 && !weekDayType.holiday && weekDayType.workday){
//
//             if(weekDayWorkHourNormal >= weekDayWorkHourReal){
//               salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//               salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal;
//               salaryReportPerDay.weekDay = weekDay;
//               salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
//               salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
//               return salaryReportPerDay;
//
//               // console.log("----------------------");
//                 // console.log("Всего отработал- " + totalTimeInMinutes);
//                 // console.log(salaryRealPerDay)
//                 // console.log("----------------------");
//             } else {
//                 // console.log("Переработка");
//                 // console.log("++++++++++++++++++++++++");
//               salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//               salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay;
//               salaryReportPerDay.weekDay = weekDay;
//               salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
//               salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
//               return salaryReportPerDay;
//               // console.log("++++++++++++++++++++++++");
//             }
//             //console.log("Workday");
//            // console.log(salaryRealPerDay);
//            return salaryReportPerDay;
//         } else if ( weekDay === 6 && !weekDayType.holiday && weekDayType.workday ) {
//
//             if(saturdayWorkHourNormal >= weekDayWorkHourReal){
//               salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//               salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / saturdayWorkHourNormal * weekDayWorkHourReal;
//               salaryReportPerDay.weekDay = weekDay;
//               salaryReportPerDay.workHourNormal = saturdayWorkHourNormal;
//               salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
//               return salaryReportPerDay;
//             } else {
//               salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//               salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay;
//               salaryReportPerDay.weekDay = weekDay;
//               salaryReportPerDay.workHourNormal = saturdayWorkHourNormal;
//               salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
//               return salaryReportPerDay;
//             }
//             return salaryReportPerDay;
//         } else if( weekDay === 0 && !weekDayType.holiday && weekDayType.workday) { // if sunday and this day is workday
//             if(weekDayWorkHourNormal >= weekDayWorkHourReal){
//               salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//               salaryReportPerDay.salaryRealPerDay  =  salaryFixedPerDay + bonus; //* weekDayWorkHourNormal;
//               salaryReportPerDay.weekDay = weekDay;
//               salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
//               salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
//               return salaryReportPerDay;
//
//               // console.log("Fixed3")
//
//             } else {
//               salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//               salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal + bonus;
//               salaryReportPerDay.weekDay = weekDay;
//               salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
//               salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
//               return salaryReportPerDay;
//             }
//             // console.log("Воскресенье");
//             // console.log(salaryRealPerDay);
//            return salaryReportPerDay;
//         } else {
//             // console.log("Другие дни");
//           salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
//           salaryReportPerDay.salaryRealPerDay = 0.0;
//           salaryReportPerDay.weekDay = weekDay;
//           salaryReportPerDay.workHourNormal = 0;
//           salaryReportPerDay.emplFixedWorkHour = 0;
//             // console.log(salaryRealPerDay);
//             return salaryReportPerDay;
//         }
//         //console.log(salaryRealPerDay);
//        // console.log(salaryRealPerDay);
//        //  return salaryRealPerDay;
//     };
//
//     /*
//     *calculates salary for current month;
//     * calendarInfo from calendar model mongodb
//     * params
//     * month - current month
//     * date - used to Determine the Year
//     *
//     * */
//     var salaryTotal = function(date, month, salaryPerDay, weekDayType, calcSalaryFixedPerDay, salaryFixedPerMonth,  totalTimeInMinutes, bonus = null){ // calendarInfo used to determine fetch report per month
//
//         var numberOfDays = calendar.countForCurrentMonth(date.getYear(), month);
//
//         var salaryReport = [];
//         var totalSalaryPerMonth = 0.0;
//
//         for (var i = 0, len = salaryReport.length; i < len; ++i){
//             totalSalaryPerMonth += salaryReport[i];
//         }
//     };
//
//     module.exports = {
//         calcSalaryFixedPerDay: calcSalaryFixedPerDay,
//         salaryPerDay: salaryPerDay
//     }
// })();