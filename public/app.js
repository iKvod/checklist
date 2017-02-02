angular.module('checklist', [
    'ngMaterial',
    'ngAnimate',
    'ui.router',
    'ngResource',
    'ngFileUpload',
    'ngAria',
    'webcam'
])
  .config(['$stateProvider', '$urlRouterProvider','$locationProvider',
     function($stateProvider, $urlRouterProvider, $locationProvider) {

         $stateProvider
        //   .state('app', {
        //         url:'/',
        //         views: {
        //             'toolbar': {
        //                 templateUrl : 'views/pages/toolbar.html',
        //                 controller  : 'MainCtrl',
        //                 controllerAd: 'vm'
        //             },
        //             'content': {
        //                 templateUrl : 'views/pages/content.html',
        //                 controller  : 'MainCtrl',
        //                 controllerAd: 'vm'
        //             }
        //         }

        // })      
        .state('checklist', {
            url: '/checklist',
            templateUrl: 'views/pages/checklist.html',
            controller: 'ChecklistCtrl',
            controllerAs: 'vm',
            resolve: {
                user : function(ChecklistService){
                    var userData = ChecklistService.query();
                    return userData.$promise;
                }
            }
        })
        //unnessary state
         .state("checkin", { //state for showing all the faqs
             url:'/checkin',
             templateUrl:"views/pages/checkin_id_form.html",
             controller: "CheckinCtrl",
             controllerAs: "vm"
         })
         .state("checkin.code", { //state for creating new FAQﬁ
            url:'^/code/{employee_id}',
            templateUrl:"views/pages/checkin_code_form.html",
            controller:"CheckinCtrl",
            controllerAs:"vm"
            // resolve: {
            //     data: function(CheckinService){
            //         return CheckinService.getUserData();
            //     }
            // }
         })
        //unnessary state
         .state("checkout",{//state for uploadin image and description
            url:'/checkout',
            templateUrl:"views/pages/checkin_id_form.html",
            controller:"CheckoutCtrl",
            controllerAs:"vm"
         })
         .state('checkout.code',{
            url:'^/code/{employee_id}',
            templateUrl:'views/pages/checkin_code_form.html',
            controeller:'CheckoutCtrl',
            controllerAs:'vm',
            params: {
                employee_id: null
            }
         })
         .state("image",{//state for uploadin image and description
            url:'/camera',
            templateUrl:"views/pages/checkin_image_form.html",
            controller:"WebcamCtrl",
            controllerAs:"vm"
         })  
         .state('checkout.image',{
            url:'/camera',
            templateUrl:'views/pages/checkin_image_form.html',
            controeller:'CheckoutCtrl',
            controllerAs:'vm'
         })
         .state('checkout.report',{
            url:'/camera',
            templateUrl:'views/pages/report_form.html',
            controeller:'CheckoutCtrl',
            controllerAs:'vm'
         })
         .state('error',{
            url:'/error',
            templateUrl:'',
            controler:"",
            controllerAs:''
         })
         .state('success',{
            url:'/success',
            templateUrl:'',
            controler:"",
            controllerAs:''
         })
         .state('admin',{
            url:'/admin',
            templateUrl:'views/pages/admin_form.html',
            controller:'AdminCtrl',
            controllerAs:'vm'
         });

        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode(true);
}])
    .run(function($state){
        $state.go('checklist');
    });


