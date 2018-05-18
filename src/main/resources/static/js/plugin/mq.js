$(function(){
	/**初始化业务MQ*/
	MqManager.initBaseAlarmMq();
});
/**
 * mq 业务对象
 */

var MqManager = {
	/**初始化状态*/
	isInitBaseAlarmMq: false,
	isInitGpsMq: false,
	/**初始化业务MQ*/
	initBaseAlarmMq: function(){
		if(MqManager.isInitBaseAlarmMq){
			return;
		}
		if($("#globalSeatNumber").val()!=null && $("#globalSeatNumber").val() !=''){
	        MqManager.initMq(MqManager.buildSubscribe($("#globalSeatNumber").val(),"base"),MqManager.mqCompleteCallBack);
	    }else{
	        MqManager.initMq(MqManager.buildSubscribe($("#useOrganPath").val(),"base"),MqManager.mqCompleteCallBack);
	    }
		//userOrgPath 基础业务路由
		//userId
		MqManager.initMq(MqManager.buildSubscribe($("#policeUserId").val(),"base"),MqManager.mqCompleteCallBack);
		//设置已初始化状态
		MqManager.isInitBaseAlarmMq = true;
	},
	/**初始化GPS相关业务MQ*/
	initGpsMq: function(){
		if(MqManager.isInitGpsMq){
			return;
		}
		//organPath  gps路由
		MqManager.initMq(MqManager.buildSubscribe($("#organPath").val(),"gps"),MqManager.mqGpsCompleteCallBack);
		//设置已初始化状态
		MqManager.isInitGpsMq = true;
	},
	/**
	 * 请求mq
	 * @param sub 
	 * @param callback
	 */
	initMq:function(subscribe,callback){
		if(callback && typeof callback === "function" && 
				MapHandler.requestMqResource && typeof MapHandler.requestMqResource === "function"){
			var url = "";
			var userName = "";
			var passWord = "";
			var mqIP = "";
			var gpsMqIP = "";
			if(subscribe.indexOf("GpsTopicExchange")>0){
				if (mqInseideOutside=='true') {
					gpsMqIP = systemConfigData.gpsMqIntranetIp;
				}else{
				gpsMqIP = systemConfigData.gpsMqIP;
			    }
				var gpsMqPort = systemConfigData.gpsMqPort;
				url = "http://"+gpsMqIP+":"+gpsMqPort+"/stomp";
				userName = systemConfigData.gpsMqUserName;
				passWord = systemConfigData.gpsMqPassword;
			}else{
				if (mqInseideOutside=='true') {
				 mqIP = systemConfigData.mqIntranetIp;
				}else {
				  mqIP = systemConfigData.mqIP;
			    } 
				var mqPort = systemConfigData.mqPort;
				url = "http://"+mqIP+":"+mqPort+"/stomp";
				userName = systemConfigData.mqUserName;
				passWord = systemConfigData.mqPassword;
			}
			
			MapHandler.requestMqResource(subscribe,callback,url,userName,passWord);
		}
	},
	/**
	 * 
	 * @param path
	 * @param type
	 */
	buildSubscribe:function(path,type){
		var subscribe = "";
		path = path.replace(new RegExp("/","gm"), ".");
		//subscribe = "/exchange/BaseDataExchange/routeData.alarm"+path;
			subscribe = systemConfigData.mqSubscribe+path;
		if(type == "gps"){
			if(path.length > 0){
				path = path.substr(1); //去掉第一个 点号
			}
			subscribe = systemConfigData.gpsMqSubscribe+path+".#";
			//subscribe = "/exchange/GpsTopicExchange/routeData.GPS"+path+".#";
		}
		return subscribe;
	},
	/**
	 * gps 上下线业务处理
	 * @param datas
	 */
	mqGpsCompleteCallBack:function(datas){
		if(!datas) return;
		var data = datas.split("|");
		if(data.length == 1){//down
		   if(typeof ToobarConfig.pushGpsOffline == "function"){
			   ToobarConfig.pushGpsOffline(datas);
		   }
		}else{//up 
			 if(typeof MapToobar.bulidPoliceAndCar == "function"){
				 MapToobar.bulidPoliceAndCar(datas);
			 }
		}
	},
	closeNoticeDiv:function(demo){
		$(demo).parent().parent().parent().hide();
	},
	/**
    * mq消息订阅回调函数
    * @param datas
    */
   mqCompleteCallBack:function(datas){
    if(!datas || datas == null) return;
	   var ob;
	   try{
	   	  ob = JSON.parse(datas);
	   }catch(e){
	   		return;
	   }

        if("singleLogin"==ob.type){
            var userSessionId = $("#userSessionId").val();
            var userId = $("#userId").val();
            if(userSessionId != ob.data.userSessionId){
                $.ajax({
                    url:basePath+"admin/singleLogout.do",
                    type:"get"
                });
                kendo.message(ob.data.message,{button: {text:"&nbsp&nbsp确定&nbsp&nbsp",callback:function(e){
                    //window.location.href=basePath+"admin/logout.do";
                    e.close();
                }}});
            }
            return;
        }

	   if(window.location.href.indexOf("/map/initAlarm.action")==-1&&
		   window.location.href.indexOf("/map/initGridPatrol.action")==-1){
           //左下角警情数量处理
		   if("xj_alarm" == ob.type){
		   		if(alarmAndNoReceiveCount){
                    alarmAndNoReceiveCount.countNumber = alarmAndNoReceiveCount.countNumber + 1;
                    alarmAndNoReceiveCount.todayAlarmCount = alarmAndNoReceiveCount.todayAlarmCount + 1;
                    $("#todayAlarmCount").html("今日(" + alarmAndNoReceiveCount.todayAlarmCount + ")");
                    $("span.xj-hint-box").text("未处理警情("+alarmAndNoReceiveCount.countNumber+")");
                    if(alarmAndNoReceiveCount.countNumber>99){
                        $("#count-number").text("99+");
                        if ($("#maxTodayAlarmCount").length > 0) {
                            $("#maxTodayAlarmCount").html("今日(" + alarmAndNoReceiveCount.todayAlarmCount + ")");
                            $("#maxCountNumber").text("99+");
                        }
                    }else{
                        if($("#count-number").countTo){
                            $("#count-number").countTo({"to":alarmAndNoReceiveCount.countNumber});
                        }else{
                            $("#count-number").text(alarmAndNoReceiveCount.countNumber);
                        }
                        if ($("#maxTodayAlarmCount").length > 0) {
                            $("#maxTodayAlarmCount").html("今日(" + alarmAndNoReceiveCount.todayAlarmCount + ")");
                            if($("#maxCountNumber").countTo){
                                $("#maxCountNumber").countTo({"to":alarmAndNoReceiveCount.countNumber});
                            }else{
                                $("#maxCountNumber").text(alarmAndNoReceiveCount.countNumber);
                            }
                        }
                    }
				}
		   }
		   return;
	   }
	   if("videoOnline" == ob.type){//单兵上线
		   if(typeof DbinMananger.buildDBinOnline == "function"){
			   DbinMananger.buildDBinOnline(ob.data.deviceId,ob.data.naming);
		   }
	   }else if("videoOffline" == ob.type){//单兵下线
		   if(typeof DbinMananger.buildDBinOffline == "function"){
			   DbinMananger.buildDBinOffline(ob.data.deviceId);
		   }
	   }else if("xj_alarm_seat" == ob.type){//弹窗

           if(typeof AlarmDeviceManager.openAlarmPopupDiv == "function") {
               AlarmDeviceManager.openAlarmPopupDiv(ob.data);
           }
       }else if("xj_alarm" == ob.type){//一键报警
		   if(typeof AlarmDeviceManager.alarmGpsReport == "function"){
			    var obj = ob.data;
				//var eId = obj.id;
				//机构上图
				var userOrgPath = $.trim($("#useOrganPath").val());
		        var str =  userOrgPath.split("/");
		       	var orgCode = str[str.length -1];
				//回写状态
			    var tmp = {};
				if(obj.relationOrgans && obj.relationOrgans.length > 0){
					for(var i = 0;i<obj.relationOrgans.length;i++){
						var data = obj.relationOrgans[i];
						if(data.organCode == orgCode){
							obj.id = data.id;
                            tmp.deviceNumber = obj.number;
                            tmp.deviceType = obj.deviceType;
                            tmp.eventId =  data.eventId;
                            tmp.expandColumn1 = data.expandColumn1;
                            tmp.expandColumn2 = data.expandColumn2;
                            tmp.id = data.id;
                            tmp.x =  data.x;
                            tmp.y = data.y;
                            AlarmDeviceManager.alarmEventList.push(tmp);
							break;
						}
					}
				}
				//坐席弹屏时，只保留最新一条警情显示
				if($("#globalSeatNumber").val()!=null 
						&& $("#globalSeatNumber").val() !=''){
					var prevAlarm = AlarmDeviceManager.prevAlarm;
					if(prevAlarm){
						try{
							AlarmDeviceManager.handleAlarm(prevAlarm.id, prevAlarm.type, prevAlarm.eventId);
						}catch(e){console.log("处理上一条警情发生异常："+e)}
					}
				}
				//左下角警情数量处理
			   if(alarmAndNoReceiveCount){
                   alarmAndNoReceiveCount.countNumber = alarmAndNoReceiveCount.countNumber + 1;
                   alarmAndNoReceiveCount.todayAlarmCount = alarmAndNoReceiveCount.todayAlarmCount + 1;
                   $("#todayAlarmCount").html("今日(" + alarmAndNoReceiveCount.todayAlarmCount + ")");
                   $("span.xj-hint-box").text("未处理警情("+alarmAndNoReceiveCount.countNumber+")");
                   if(alarmAndNoReceiveCount.countNumber>99){
                       $("#count-number").text("99+");
                       if ($("#maxTodayAlarmCount").length > 0) {
                           $("#maxTodayAlarmCount").html("今日(" + alarmAndNoReceiveCount.todayAlarmCount + ")");
                           $("#maxCountNumber").text("99+");
                       }
                   }else{
                       if($("#count-number").countTo){
                           $("#count-number").countTo({"to":alarmAndNoReceiveCount.countNumber});
                       }else{
                           $("#count-number").text(alarmAndNoReceiveCount.countNumber);
                       }
                       if ($("#maxTodayAlarmCount").length > 0) {
                           $("#maxTodayAlarmCount").html("今日(" + alarmAndNoReceiveCount.todayAlarmCount + ")");
                           if($("#maxCountNumber").countTo){
                               $("#maxCountNumber").countTo({"to":alarmAndNoReceiveCount.countNumber});
                           }else{
                               $("#maxCountNumber").text(alarmAndNoReceiveCount.countNumber);
                           }
                       }
                   }
			   }
				AlarmDeviceManager.alarmGpsReport(ob.data,1);
				//记录最新一条警情信息
				if(obj){
					AlarmDeviceManager.prevAlarm = {
							id: obj.id,
							type: obj.type,
							eventId: obj.eventId
					}
				}
		   }
	   }else if ("alarm_event_dj"==ob.type) {//对讲设备上图
           if (typeof AlarmDeviceManager.intercomReport == "function") {
               if (ob.code == 1) {
                   AlarmDeviceManager.deviceInfo.push(ob.data);
                   var en = {
                       longitude: ob.data.alarmEvent.lon,
                       id: ob.data.alarmEvent.id,
                       latitude: ob.data.alarmEvent.lat,
                       isWork: true,
                       radius: ob.data.radius,
                       layerName: layerName.partMarkerLayer
                   }
                   var tmpCircle = MapManager.getOverlayById(en);
                   if(!tmpCircle){
                       MapManager.createCircle(en);
				   }
                   AlarmDeviceManager.intercomReport(ob.data.deviceList);
                   // var popIntercomList = $("#popIntercomList").kendoNotification({
                   //     autoHideAfter: 0,
                   //     hideOnClick: false,
                   //     position: {
                   //         pinned: true,
                   //         top: 60,
                   //         left: 440,
                   //         bottom: null,
                   //         right: null
                   //     },
                   //     width: 200,
                   //     height: 28,
                   //     stacking: "down",
                   //     templates: [{
                   //         type: "messageNotification",
                   //         template: " <div id='interComDiv#= id #' class='interComDiv' style='margin-top: 5px'><span style='margin-left: 20px'>共有<b>#= total #</b>台对讲设备参与对讲" +
                   //         "</span><span class='cg-i-close cg-pop-close' style='float:right;margin-right:10px;margin-bottom: 5px' " +
                   //         "onclick='MqManager.closeNoticeDiv(this)'>×</span></div>"
                   //     }]
                   // }).data("kendoNotification");
                   // popIntercomList.show({
                   //     total:ob.data.deviceList.length,
					//    id:ob.data.alarmEvent.id
                   // }, "messageNotification");
               } else {
                   console.log(ob.data);
               }
           }
       } else if("receivedMesseage"==ob.type) {
	   		// var basePath = $("#basePath").val();
           // var a = parseInt($(".xj-number").text());
           // var b =a+1;
           // $(".xj-number").text(b);
           // $.ajax({
            //    type: "post",
            //    url: basePath+"messeagePublish/saveNumber.do",
            //    dataType: "json",
            //    ansyc:false,
            //    data: {
            //    		"number":b
            //    }
		   // })
           var popupNotification = $("#popUpMesseage").kendoNotification({
               autoHideAfter:0,
               hideOnClick: false,
               position: {
                   pinned: true,
                   top: null,
                   left: 0,
                   bottom: 0,
                   right: null
               },
               width: 480,
			   height:200,
			   padding:10,
               stacking: "down",
               templates: [{
                   // define a template for the custom "timeAlert" notification type
                   type: "messageNotification",
                   template: "<div id='noticeDiv' class='noticeDiv'><b>信息通知</b> #= publishTime # <span class='cg-i-close cg-pop-close' style='float:right;margin-right:5px;margin:0 0 0 0' onclick='MqManager.closeNoticeDiv(this)'>×</span><br><hr><b>发布机构:</b> #=organName # <br> <b>信息标题:</b> #=messeageTitle# <br> <b>信息内容:</b>#=messeageContent#</div>"
                   // template content can also be defined separately
                   //template: $("#myAlertTemplate").html()s
               }]
		   }).data("kendoNotification");

           var messeageContent = ob.data.messeageContent;
           var length =messeageContent.length;
           if(length>75){
           	messeageContent=messeageContent.substring(0,143);
           	messeageContent=messeageContent+"....";
		   }
           var radar = $("#popIntercomList").kendoNotification({
               autoHideAfter:0,
               hideOnClick: false,
               position: {
                   pinned: true,
                   top: 120,
                   left: 20,
                   bottom: null,
                   right: null
               },
               width: 373,
               height:331,
               stacking: "down",
               templates: [{
                   // define a template for the custom "timeAlert" notification type
                   type: "messageNotification",
                   template:
                   "<div class='radar'>" +
                   "<span class='cg-i-close cg-pop-close' style='float:right;margin-right:5px;margin:-4px 0 0 0' onclick='closeRadar()'>×</span>"+
                   "<img style='width: 373px;height: 320px' src='#=basePath#/images/images/radar.gif'></div>"
               }]
           }).data("kendoNotification");
           popupNotification.show({
			   publishTime:ob.data.publishTime,
               organName:ob.data.organName,
			   messeageTitle:ob.data.messeageTitle,
			   messeageContent:messeageContent

		   }, "messageNotification");
           if(ob.deviceType ==4){
               closeRadar();
               radar.show({}, "messageNotification");
               $('.radar').parent().parent().css("top",'120px').css('left','20px');
           }else {
               closeRadar();
           }
       }

   }
}