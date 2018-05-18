define(["angular", "ui-router"], function(angular) {
	//实例化angularJS
	var decorator = angular.module("decorator", ['ui.router']);

	//人员管理页面控制器
	decorator.controller('peopleListCtrl', ['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
	    $scope.headTitle="人员列表";
	    $scope.smallTitle = $stateParams.text;
	}])
	
	//路由配置
	decorator.config(function ($stateProvider,$urlRouterProvider) {
		$urlRouterProvider.otherwise('/main');//页面默认路由
        $stateProvider     
        	.state("main", {//首页右侧内容
		            url: '/main',  
		            templateUrl : 'views/home/content.html'
		    })
        	.state("peoplelist", {
		            url: '/peoplelist',  
		            templateUrl : 'views/people/peoplelist.html',
		            params:{"text":''},
		            controllerAs:'pl',
            		controller:'peopleListCtrl'
		    });
	   });
	return decorator;
});