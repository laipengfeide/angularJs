requirejs.config({
	baseUrl: 'js',
	map: {
		'*': {
			'css': 'libs/css.min',
			'less': 'libs/less',
		}
	},
	//定义映射名（特别有版本号的都需要定义）
	paths: {
		'jquery': "libs/jquery-3.3.1.min",
		"angular": "libs/angular",
		"ui-router": "libs/angular-ui-router.min",
		"angularAMD": "libs/angularAMD.min",
		"bootstrap": "libs/bootstrap.min",
		"bootstrapTree": "libs/bootstrap-treeview.min",
		"bootstrapTable": "libs/bootstrap-table.min",

		"sysConfig": "plugin/resources/sys_config",
		"pager": "plugin/resources/pager",
		"common": "plugin/resources/common",
		"base64": "plugin/resources/base64",
		"cookie": "plugin/resources/jquery.cookie",
		"map": "plugin/map/map",
		"pointConvertor": "plugin/map/point_convertor",
		"apiv2": "plugin/baidu/apiv2.0.min",
		"CurveLine": "plugin/baidu/CurveLine.min",
		"DrawingManager": "plugin/baidu/DrawingManager_min",
		"LuShu": "plugin/baidu/LuShu",
		"replayingTrace_baidu": "plugin/map/replayingTrace_baidu",
		"map_baidu": "plugin/map/map_baidu",
		"toobar": "plugin/map/toobar",
		"mq": "plugin/mq",
		"sockjs": "plugin/rabbit/sockjs-0.3.4",
		"stomp": "plugin/rabbit/stomp",
		"illegalChar": "plugin/resources/illegalChar",
		"count": "plugin/resources/count",
		"baiduMap": "page/home/baiduMap",
		"homeInit": "page/home/homeInit",
		"left": "page/home/left",

		"bootstrapCss": "../css/bootstrap.min",
		"bootstrapTreeCss": "../css/bootstrap-treeview.min",
		"bootstrapTableCss": "../css/bootstrap-table.min",
		"global": "../css/home/global",
		"frame": "../css/home/frame",
		"management": "../css/home/management",
		"baidu": "plugin/baidu/baidu",
		"DrawingManager": "plugin/baidu/DrawingManager_min",
		"baiduMapCss": "../css/home/baiduMap",
		"homeCss": "../css/home/home",
		"base": "../css/base",
	},
	//依赖关系
	shim: {
		'bootstrap': ['jquery'],
		'cookie': ['jquery'],
		'mq':['jquery'],
		'count':['jquery'],
		'angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'ui-route': {
			deps: ['angular'],
			exports: 'ui-route'
		},
		'angularAMD': ['angular'],
		'DrawingManager': ['apiv2'],
		'LuShu': ['apiv2'],
		'map_baidu': ['apiv2'],
		'baiduMap': ['map_baidu'],
		'toobar': ['baiduMap'],
	}
});
require([
	'css!bootstrapCss', 'css!global', 'css!frame', 'css!management', 'css!baidu', 'css!DrawingManager', 'css!baiduMapCss', 'css!homeCss', 'css!bootstrapTreeCss','css!bootstrapTableCss',
	'less!base',
], function() {
	//样式加载完了
});
//需要加载的JS名称
requirejs(['jquery', 'decorator', 'sysConfig', 'pager', 'common', 'base64', 'cookie', 'map', 'pointConvertor', 'apiv2', 'CurveLine', 'DrawingManager',
		'LuShu', 'replayingTrace_baidu', 'map_baidu', 'toobar', 'sockjs', 'stomp', 'illegalChar', 'mq', 'count', 'baiduMap', 'homeInit', 'left','bootstrap', 'bootstrapTree','bootstrapTable',
	],
	function($, decorator,treeview) {
		decorator.controller("homeController", function($scope,$state) {
			$scope.User = {
				userName: "乌鲁木齐市"
			};
			$scope.systemTitle = "一件报警3.0";
			$scope.isRootNode = 1;
			//展示不同带参数的页面跳转
			$scope.gotoCar = function(){
				$state.go("peoplelist",{"text":'这是点了车辆管理'});
			}
		});
		
		//首页-子组件
		decorator.component("pageTree", {
			templateUrl: "include/home_child/tree.html",
			controller: function($scope) {
				$scope.sessionScope = {
					searchOrganName: "",
					organId: "1001"
				};
				//xj-map-left
				$scope.treeSidebar = "sidebar";
				var thisUrl = window.location.href;
				var urlParam = thisUrl.substring(thisUrl.indexOf("#!/")+3,thisUrl.length);
				if(urlParam == "main"){
					$scope.treeSidebar = "sidebar xj-map-left";
				}
			}
		})
		.component("pageCharttoobar", {
			templateUrl: "include/home_child/chartToobar.html",
			controller: function($scope) {
	
			}
		})
		.component("pageVideo", {
			templateUrl: "include/home_child/video.html",
			controller: function($scope) {
	
			}
		}).component("pageCommon", {
			templateUrl: "include/home_child/common.html",
			controller: function($scope) {
	
			}
		}).component("pageTaril", {
			templateUrl: "include/home_child/taril.html",
			controller: function($scope) {
				
			}
		});
		
		//树形结构组件
		decorator.component("pageTreeview", {
			template: "<div id='treebox'></div>",
			controller: function() {
				//json数组
				var treeData = [{
					text: "乌鲁木齐市",
					nodes: [
						{text: "达坂城区",},
						{text: "甘泉堡公安分局"},
						{text: "钢城公安局"},
						{text: "高新区",
					        nodes: [
					        	{text:"高新西区"},
					        	{text:"高新南区"}
					        ]
						},
						{text: "机场公安局"},
						{text: "开发区"},
						{text: "米东区"},
						{text: "沙依巴克区"},
						{text: "十二师公安局"},
						{text: "水磨沟区"},
						{text: "天山区"},
						{text: "乌鲁木齐县"},
						{text: "油城公安分局"}
					]
				}];

				$('#treebox').treeview({
					color: "#FFF",
					nodeIcon: 'glyphicon glyphicon-globe',
					borderColor:"transparent",
					selectedBackColor:"#06B7DE",
					backColor:"transparent",
					onhoverColor:"#08597D",
					data: treeData
				});
			}
		});
		
		//人员管理-子组件
		decorator.component("peopleListinfo", {
			templateUrl: "include/people_child/listInfo.html",
			controller: function($scope) {
				
			}
		});
		
	}
);