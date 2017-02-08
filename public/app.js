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
            templateUrl: 'views/pages/checklist_id_form.html',
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
            templateUrl:"views/pages/checkin_code_form.html",
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
            templateUrl:"views/pages/checkin_image_form.html",
            controller:"CheckinCtrl",
            controllerAs:"vm"
            ,params: {
                employee_id: null
            }
         })
        .state('checkin.success', {
            url:'/success',
            templateUrl:'views/pages/success_checkin_page.html',
            controler:"CheckinCtrl",
            controllerAs:'vm'
         })
         .state("checkout", {
            url:'/out/code/{employee_id}',
            templateUrl:'views/pages/checkout_code_form.html',
            controller:'CheckoutCtrl',
            controllerAs:'vm'
            ,params: {
                employee_id: null
            }
         })
         .state('checkout.image',{
            url:'/camera',
            templateUrl:'views/pages/checkout_image_form.html',
            controeller:'CheckoutCtrl',
            controllerAs:'vm'
         })
         .state('checkout.success', {
            url:'/success',
            templateUrl:'views/pages/success_checkin_page.html',
            controler:"CheckoutCtrl",
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
            templateUrl:'views/pages/success_checkin_page.html',
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


