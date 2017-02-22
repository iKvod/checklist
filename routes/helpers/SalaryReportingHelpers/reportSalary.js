(function () {
    'use strict';
    var calendar = require('../calendar/calendar');


    /*
    * salaryFixedHourCalc - calculates the fixed salary for workdays ans saturdays
    * calendar returns JSON object  {
     month: null,
     days: 0,
     workdays: 0,
     saturdays: 0,
     sundays: 0
     };
    * */
    var calcSalaryFixedPerDay = function (date, salaryFixedPerMonth) {
        // unefficient way
        var calReport = calendar.countForCurrentMonth(date.getYear(), date.getMonth());
        // var salaryFixedPerHour = {
        //     saturdaySalaryNormal: null,
        //     weekDaySalaryNormal: null
        // };

        var salaryFixedPerDay = salaryFixedPerMonth / (calReport.workdays + calReport.saturdays);

       //console.log(salaryFixedPerDay)
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
    var salaryPerDay = function (date, weekDayType, salaryFixedPerMonth, calcSalaryFixedPerDay, totalTimeInMinutes, bonus = null) {

        var salaryFixedPerDay = calcSalaryFixedPerDay(date, salaryFixedPerMonth); // callback - fixed salary for per workday
       // console.log(salaryFixedPerDay);
        var weekDay = date.getDay(); // this should in function parameter as object key
        var salaryRealPerDay = null;

        var weekDayWorkHourNormal  = 7.0;
        var saturdayWorkHourNormal =  5.0;
        //var saturdatWorkHourReal =
        var weekDayWorkHourReal = totalTimeInMinutes / 60.0;
        var weekDayType = {
            holiday: false,
            workday: true
        };

        if( weekDay != 6 && weekDay != 0 && !weekDayType.holiday && weekDayType.workday){

            if(weekDayWorkHourNormal >= weekDayWorkHourReal){
                //salaryRealPerDay =  salaryFixedPerDay; //* weekDayWorkHourNormal;
                salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal;
                // console.log("----------------------");
                // console.log("Всего отработал- " + totalTimeInMinutes);
                // console.log(salaryRealPerDay)
                // console.log("----------------------");
            } else {
                // console.log("Переработка");
                // console.log("++++++++++++++++++++++++");
                salaryRealPerDay = salaryFixedPerDay;
                // console.log("++++++++++++++++++++++++");
            }
            //console.log("Workday");
           // console.log(salaryRealPerDay);
           return salaryRealPerDay;
        } else if ( weekDay === 6 && !weekDayType.holiday && weekDayType.workday ) {

            if(saturdayWorkHourNormal >= weekDayWorkHourReal){
                salaryRealPerDay = salaryFixedPerDay / saturdayWorkHourNormal * weekDayWorkHourReal;
            } else {
                salaryRealPerDay = salaryFixedPerDay;
            }
            return salaryRealPerDay;
        } else if( weekDay === 0 && !weekDayType.holiday && weekDayType.workday) { // if sunday and this day is workday
            if(weekDayWorkHourNormal >= weekDayWorkHourReal){
                salaryRealPerDay =  salaryFixedPerDay + bonus; //* weekDayWorkHourNormal;
                // console.log("Fixed3")

            } else {
                salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal + bonus;
            }
            // console.log("Воскресенье");
            // console.log(salaryRealPerDay);
           return salaryRealPerDay;
        } else {
            // console.log("Другие дни");
            salaryRealPerDay = 0.0;
            // console.log(salaryRealPerDay);
            return salaryRealPerDay;
        }
        //console.log(salaryRealPerDay);
       // console.log(salaryRealPerDay);
        //return salaryRealPerDay;
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