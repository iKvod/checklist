'use strict';

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;


var ReportingSchema = new Schema({
    // created: {type: Date, default: Date.now},
    check_in: {type: Date, default: null},
    check_out: {type: Date, default: null},
    lunch_in: {type: Date, default: null}, // writes new date if employee is going have a lunch
    lunch_out: {type: Date, default: null}, // ..coming from lunch
    go_out: {type: Date, default: null}, // .. go out during the work hours
    come_back: {type: Date, default: null},// .. come back to work during current work day
    report: { type: String },
    employee: { // position id of employee
        type: Schema.Types.ObjectId,
        ref:'Employee'
    },
    calendar : {type: Schema.Types.ObjectId, ref:''},
    salary_per_day: {type: Number},
    absent : {type: Boolean, default: true},
    fuckup: {type: Boolean, default: false} // if emplo forgot to checkout then  fuckup true
    //curentDayMinutes
}, {
    timestamps: true
});

ReportingSchema.pre('save', function (next) {
    // var currentDate = new Date();
    //
    // this.updated_at = currentDate;
    //
    // if(!this.created_at)
    //     this.created_at = currentDate;


    next();
});

ReportingSchema.methods.calcTimeCorrectly = function() {

    var fullTimeHours = null;
    var fullTimeMinutes = null;
    var totalTimeInMinutes = null;
    var outWorkMinutes = null;
    var lunchTimeMinutes = null;


    var dayDifference = 0;
    var monthDifference = 0;

    if (this.check_in && this.check_out){
        dayDifference = this.check_out.getDate() - this.check_in.getDate();
        monthDifference = this.check_out.getMonth() - this.check_in.getMonth();
    }
    // var dayDifferenceDinner = this.lunch_out.getDate() - this.lunch_in.getDate();
    // var dayDifferenceOut = this.come_back.getDate() - this.go_out.getDate();

    //console.log(dayDifference);

    if ((dayDifference === 1) || ( (dayDifference != 1) && (monthDifference === 1)) ) {

        if (this.check_in && this.check_out) {

            fullTimeMinutes = (24 - this.check_in.getHours() ) * 60 + this.check_in.getMinutes()
                + this.check_out.getHours() * 60 + this.check_out.getMinutes();
            fullTimeHours = fullTimeMinutes / 60;
            if (this.go_out && this.come_back) {
                outWorkMinutes = (this.come_back.getHours() * 60 + this.come_back.getMinutes())
                    - (( this.go_out.getHours() ) * 60 + this.go_out.getMinutes());
            }

            if (this.lunch_in && this.lunch_out) {
                lunchTimeMinutes = (this.lunch_out.getHours() * 60 + this.lunch_out.getMinutes())
                    - (( this.lunch_in.getHours() ) * 60 + this.lunch_in.getMinutes());
            }

            totalTimeInMinutes = fullTimeMinutes - outWorkMinutes - lunchTimeMinutes;

            return {
                report_id: this._id,
                minutes: fullTimeMinutes, // whole time workDay
                fullTimeHours: fullTimeHours,
                lunchTime: lunchTimeMinutes,
                outWorkDW: outWorkMinutes,
                totalTimeInMinutes: totalTimeInMinutes,
                beginWorkDay: this.check_in,
                stopWorkDay: this.check_out,
                goLunch: this.lunch_in,
                comeFromLunch: this.lunch_out,
                goOut: this.go_out,
                comeToWork: this.come_back,
                salaryPerDay: this.salary_per_day,
                message: "Another day"
            };

        } else {
            return {
                report_id: this._id,
                minutes: fullTimeMinutes, // whole time workDay
                fullTimeHours: fullTimeHours,
                lunchTime: lunchTimeMinutes,
                outWorkDW: outWorkMinutes,
                totalTimeInMinutes: totalTimeInMinutes,
                beginWorkDay: this.check_in,
                stopWorkDay: this.check_out,
                goLunch: this.lunch_in,
                comeFromLunch: this.lunch_out,
                goOut: this.go_out,
                comeToWork: this.come_back,
                salaryPerDay: this.salary_per_day,
                message: "Another day"
            };
        }
    } else {

        if (this.check_in && this.check_out) {

            fullTimeMinutes = (this.check_out.getHours() * 60 + this.check_out.getMinutes())
                - (this.check_in.getHours() * 60 + this.check_in.getMinutes());
            fullTimeHours = fullTimeMinutes / 60;

            if (this.go_out && this.come_back) {
                outWorkMinutes = (this.come_back.getHours() * 60 + this.come_back.getMinutes())
                    - (this.go_out.getHours() * 60 + this.go_out.getMinutes());
            }

            if (this.lunch_in && this.lunch_out) {
                lunchTimeMinutes = (this.lunch_out.getHours() * 60 + this.lunch_out.getMinutes())
                    - (this.lunch_in.getHours() * 60 + this.lunch_in.getMinutes());
            }

            totalTimeInMinutes = fullTimeMinutes - outWorkMinutes - lunchTimeMinutes;
            // console.log("Get interval in hours: "+ fullTimeHours);
            // console.log("Get interval in min: " + fullTimeMinutes);

            return {
                report_id: this._id,
                minutes: fullTimeMinutes, // whole time workDay
                fullTimeHours: fullTimeHours,
                lunchTime: lunchTimeMinutes,
                outWorkDW: outWorkMinutes,
                totalTimeInMinutes: totalTimeInMinutes,
                beginWorkDay: this.check_in,
                stopWorkDay: this.check_out,
                goLunch: this.lunch_in,
                comeFromLunch: this.lunch_out,
                goOut: this.go_out,
                comeToWork: this.come_back,
                salaryPerDay: this.salary_per_day,
                message: "The same day"
            };
        } else {
            console.log("Вы не сделали чекаут!");
            return {
                report_id: this._id,
                minutes: fullTimeMinutes, // whole time workDay
                fullTimeHours: fullTimeHours,
                lunchTime: lunchTimeMinutes,
                outWorkDW: outWorkMinutes,
                totalTimeInMinutes: totalTimeInMinutes,
                beginWorkDay: this.check_in,
                stopWorkDay: this.check_out,
                goLunch: this.lunch_in,
                comeFromLunch: this.lunch_out,
                goOut: this.go_out,
                comeToWork: this.come_back,
                salaryPerDay: this.salary_per_day,
                message: "The same day"
            };
        }
    }
};
/*

ReportingSchema.methods.calcTime = function () {
    var localTime = 6;
    var fullTimeHours = null;
    var fullTimeMinutes = null;
    var totalTimeInMinutes = null;
    var fullTimeMilliseconds = null;
    var outWorkMinutes = null;
    var lunchTimeMinutes = null;

    if(this.check_in && this.check_out){
        // console.log(this.check_in);
        // console.log(this.check_out);
        fullTimeHours =
            this.check_out.getHours() - this.check_in.getHours();
        fullTimeMinutes = (this.check_out.getHours() * 60 + this.check_out.getMinutes())
            - (this.check_in.getHours() * 60 + this.check_in.getMinutes());
        //fullTimeMilliseconds = this.check_out.getMilliseconds() - this.check_in.getMilliseconds();

        if (this.go_out && this.come_back){
            outWorkMinutes = (this.come_back.getHours() * 60 + this.come_back.getMinutes())
                - (this.go_out.getHours() * 60 + this.go_out.getMinutes());
        }

        if(this.lunch_in && this.lunch_out){
            lunchTimeMinutes = (this.lunch_out.getHours() * 60 + this.lunch_out.getMinutes())
                - (this.lunch_in.getHours() * 60 + this.lunch_in.getMinutes());
        }

        totalTimeInMinutes = fullTimeMinutes - outWorkMinutes - lunchTimeMinutes;
        // console.log("Get interval in hours: "+ fullTimeHours);
        // console.log("Get interval in min: " + fullTimeMinutes);

        return {
            minutes : fullTimeMinutes, // whole time begiin
            lunchTime : lunchTimeMinutes,
            outWorkDW : outWorkMinutes,
            totalTimeInMinutes: totalTimeInMinutes,
            check_in: this.check_in,
            check_out: this.check_out,
            report_id: this._id
        };
    } else {
        console.log("Вы не сделали чекаут!");
        return {


            minutes : fullTimeMinutes, // whole time begin
            lunchTime : lunchTimeMinutes,
            outWorkDW : outWorkMinutes,
            totalTimeInMinutes: totalTimeInMinutes,
            report_id: this._id
    };

    }
};
*/


module.exports = mongoose.model('Reporting', ReportingSchema);