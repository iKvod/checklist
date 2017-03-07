angular.module('checklist', [
    'ngMaterial',
    'ngAnimate',
    'ui.router',
    'ngResource',
    'ngFileUpload',
    'ngAria',
    'webcam',
    'ngSanitize',
    'mgcrea.ngStrap'
])
  .config(['$stateProvider', '$urlRouterProvider','$locationProvider',
     function($stateProvider, $urlRouterProvider, $locationProvider) {

         $stateProvider
        //   .state('app', {
        //         url:'/',
        //         components: {
        //             'toolbar': {
        //                 templateUrl : 'components/checklist/toolbar.html',
        //                 controller  : 'MainCtrl',
        //                 controllerAd: 'vm'
        //             },
        //             'content': {
        //                 templateUrl : 'components/checklist/content.html',
        //                 controller  : 'MainCtrl',
        //                 controllerAd: 'vm'
        //             }
        //         }

        // })
         .state('main', {
            url:'/',
           templateUrl: 'components/main/main.html',
           controller: 'MainCtrl',
           controllerAs: 'vm'
         })
        .state('checklist', {
            url: '/checklist',
            templateUrl: 'components/checklist/checklist_id_form.html',
            controller: 'ChecklistCtrl',
            controllerAs: 'vm'/*,
            resolve: {
                user : function(ChecklistService){
                    var userData = ChecklistService.query();
                    return userData.$promise;
                }
            }*/
        })
         .state("checkin", { //state for creating new FAQﬁ
            url:'/in/code/{employee_id}',
            templateUrl:"components/checklist/checkin_code_form.html",
            controller:"CheckinCtrl",
            controllerAs:"vm"
            // resolve: {
            //     data: function(CheckinService){
            //         return CheckinService.getUserData();
            //     }
            // }
            ,params: {
                employee_id: null
            }
         })
         .state("checkin.image",{//state for uploadin image and description
            url:'/camera',
            templateUrl:"components/checklist/checkin_image_form.html",
            controller:"CheckinCtrl",
            controllerAs:"vm"
            ,params: {
                employee_id: null
            }
         })
        .state('checkin.success', {
            url:'/success',
            templateUrl:'components/checklist/success_checkin_page.html',
            controller:"CheckinCtrl",
            controllerAs:'vm'
         })
         .state("checkout", {
            url:'/out/code/{employee_id}',
            templateUrl:'components/checklist/checkout_code_form.html',
            controller:'CheckoutCtrl',
            controllerAs:'vm'
            ,params: {
                employee_id: null
            }
         })
         .state('checkout.image',{
            url:'/camera',
            templateUrl:'components/checklist/checkout_image_form.html',
            controeller:'CheckoutCtrl',
            controllerAs:'vm'
         })
         .state('checkout.success', {
            url:'/success',
            templateUrl:'components/checklist/success_checkin_page.html',
            controller:"CheckoutCtrl",
            controllerAs:'vm'
         })
         .state('error',{
            url:'/error',
            templateUrl:'',
            controller:"",
            controllerAs:''
         })
         .state('success',{
            url:'/success',
            templateUrl:'components/checklist/success_checkin_page.html',
            controller:"",
            controllerAs:''
         })
         .state('admin',{
            url:'/admin',
            templateUrl:'components/admin_panel/admin.main/admin_panel.html',
            controller:'AdminCtrl',
            controllerAs:'vm'
         })
         .state('admin.reports', {
           url: '/reports',
           templateUrl: 'components/salary_reports.html',
           controller: 'ReportCtrl',
           controllerAs: 'vm'
          })
         .state('admin.employees', {
           url:'/employees',
           templateUrl:'components/admin_panel/salaryReport/salaryReport.html',
           controller: 'EmployeesCtrl',
           controllerAs: 'vm'
         })
         .state('admin.settings', {
           url: '/settings',
           templateUrl: 'components/settings.html',
           controller: 'SettingsCtrl',
           controllerAs: 'vm'

         })
         .state('fun', {
           url:'/fun',
           templateUrl: 'components/fun/fun.html',
           controller: 'FunCtrl',
           controllerAs: 'vm'
         });

        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode(true);
}])
    .run(function($state){
        $state.go('checklist');
    });
