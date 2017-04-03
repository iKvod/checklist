'use strict';
//var Employees = require('../models/departments');

var Empls = require('../models/employee');


function generateId(dept, callback){

  if(dept){
    var subs = ''
    if(dept.length > 2){
      subs = (dept.substr(0,1) + 'd').toLowerCase();

    } else {
      subs = dept.toLowerCase();
    }
    Empls.find().count(function (err, count) {
      //console.log(count)
      if(err){
        callback(err, null);
        return;
      }
      if(count){
        count++;
        var id = (new Date()).getFullYear().toString().substr(2) + subs
          + ((count < 10) ? ('0' + count) : (count));
        callback(null, id);
        // console.log(id);
      } else {
        count = 1;
        var id = (new Date()).getFullYear().toString().substr(2) + subs
          + ((count < 10) ? ('0' + count) : (count));
        callback(null, id);
        //console.log(count);
      }
    });

  } else {
    callback({message: "Пожалуйста выберите департамент или создайте департамент", status: 404}, null);
  }




  // Employees.findOne({})
  //   .select('departments counter')
  //   .exec(function (err, empl) {
  //     if(err){
  //       callback(err, null);
  //       return;
  //     }
  //     if(empl){
  //       emplObj.cnt = empl.getCounter();
  //       emplObj.dept = empl.departments;
  //       var id = (new Date()).getFullYear().toString().substr(2) + emplObj.dept[0]
  //         + ((emplObj.cnt++ < 10) ? ('0' + emplObj.cnt++) : (emplObj.cnt++));
  //       callback(null, id);
  //     } else {
  //       callback({message: "Создайте департамент", status: 404}, null);
  //     }
  //
  //   })
}

module.exports = {
  generateId: generateId
};