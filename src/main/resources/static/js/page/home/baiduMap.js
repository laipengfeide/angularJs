var funList = [1, 100, 1000, 1600, 5000, 6000, 100001, 100003, 100004, 100005, 100010, 200001, 200007, 200009, 200023, 200024, 200025, 200, 200002, 200005, 400001, 300, 200004, 400, 200013, 200019, 100006, 200017, 400002, 1000002, 100007, 200010, 100008, 100011, 100009, 200016, 200011, 200030];
			var systemConfigData = {
				"mqIP": "25.30.9.144",
				"mqPort": "15674",
				"mqUserName": "guest",
				"mqPassword": "guest",
				"mqSubscribe": "/exchange/BaseDataExchange/routeData.alarm",
				"mqExchange": "BaseDataExchange",
				"mqRouteKey": "routeData.alarm",
				"mqAppRouteKey": "routeData.app.alarm/",
				"mqServerPort": "5672",
				"constraintMes": "长时间未操作，请重新登录！",
				"gpsMqIP": "10.30.1.24",
				"gpsMqPort": "15674",
				"gpsMqUserName": "guest",
				"gpsMqPassword": "guest",
				"gpsMqSubscribe": "/exchange/GpsTopicExchange/",
				"appVersion": "1.0.0",
				"appDownurl": "source/weijing.apk",
				"leaderVersion": "1.6.1",
				"leaderDownurl": "source/weijing_leader.apk",
				"alarm_backup_switch": "1",
				"gpsDistributeUrl": "http://25.30.9.85:8082/api-manager/API/gps/",
				"gpsTrajectoryUrl": "http://202.100.190.144:8081/",
				"expires_alarm-seat-data": "20",
				"push_level": "4",
				"4Glaw_enforcement": "https://www.satchat.cn/dxds/video/singleVideo2",
				"mqIntranetIp": "25.30.9.3",
				"gpsMqIntranetIp": "25.30.9.35",
				"rtmp_video": "rtmp://25.30.10.14:1935/rtmp/",
				"verifyAlarmDevice": "http://220.171.100.11:8090/data_exchange/API/other/",
				"gpsIntranetTrajUrl": "http://220.171.100.12:8081/",
				"gpsIntranetTraj0Url": "http://220.171.100.12:8081/",
				"feedback_user_to_gz": "http://1202.70.237.222:58002/bc-web-datasaving/datasave/feedback",
				"feedback_to_gz": "http://202.100.171.79:3001/yjbjzdcl_net/report/reportInfoFromTianYi.do",
				"feedback_user_key": "5b8af47892d636624dde271aa5e19938",
				"jw_sys_version": "xjsj_v1.6.1"
			};
	
			var alarmUrl = document.URL;
	
			var uri = alarmUrl.split('/');
			var Curi = uri[uri.length - 1].split('?')[0];
	
			//---------------初始化地图的参数------start----------
			MapManager.setUrl("http://25.30.9.253:8090/iserver/services/yftianditu/rest/maps/juheditu");
			MapManager.setAnalyUrl("http://25.30.9.253:8090/iserver/services/spatialAnalysis-CdMap/restjsr/spatialanalyst");
			MapManager.setMiliUrl("http://25.30.9.253:8090/iserver/services/map-CdMap2/rest/maps/");
			MapManager.setMiliBaseName("??????@GXCGWG");
			MapManager.setPartBaseName("@GXCGData");
			MapManager.setLayerOpacity("0.4");
			MapManager.setPartUrl("http://25.30.9.158:253/iserver/services/map-CdMap2/rest/maps/");
			MapManager.setGatherLevel("1:1-8,860:9-10,861:11-14,862:15-17");
			MapManager.setMqUrl("http://25.30.9.149:15674/stomp");
			MapManager.setMqUserName("guest");
			MapManager.setMqPassword("guest");
	
			MapManager.setSpecialStreetColor("red");
			MapManager.setOneStreetColor("yellow");
			MapManager.setTwoStreetColor("blue");
			MapManager.setThreeStreetColor("green");
			MapManager.setSpecialStreetWid("15");
			MapManager.setOneStreetWid("10");
			MapManager.setTwoStreetWid("5");
			MapManager.setThreeStreetWid("1");
			MapManager.setSanitationLineRadius("1000");
			MapManager.setSanitationLineSegment("30");
	
			var mapMaxZoomToLevel = 13;
			var mapGatherMinZoom = 5;
			var mapGatherMaxZoom = 12;
			var mapGatherZoomToLevel =
				2 ||
				1;
			var gbChartShowTitleLevel =
				12 ||
				12;
			//报备页签
			var leaderType = '37';
			var dutyType = '38';
			var membersType = '39';
			var imageServerContext = 'uploadFile/';
			var mqInseideOutside = 'false'
	
			//---------------初始化地图的参数------end----------
			/**
			 * 是否具有该功能权限
			 * @param f_id 功能id号
			 * @returns {Boolean} true 表示 具有；false 表示 不具有
			 */
			function isExistFunction(f_id) {
				if(f_id != null && f_id != undefined) f_id += "";
				f_id = $.trim(f_id); //去掉收尾空格
				if(!funList || !f_id) return false;
				var flag = false,
					fun_id;
				for(var i = 0; i < funList.length; i++) {
					fun_id = funList[i] + "";
					if(fun_id.indexOf(f_id) > -1) {
						flag = true; //具有该权限
						break;
					}
				}
				return flag;
			}