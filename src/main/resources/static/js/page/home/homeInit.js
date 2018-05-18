var alarmAndNoReceiveCount = {};
$(document).ready(function() {
	//收缩地图面板
	$("#panelClose").on("click", function() {
		if($(this).hasClass("panel-arrow-close")) {
			//收缩左侧菜单
			$(".content .sidebar").first().fadeOut('fast');
			$(".content .main").css({
				"width": "calc(100% - 10px)"
			});
			$(this).removeClass("panel-arrow-close").addClass("panel-arrow-open");
			var nowUrl = window.location.pathname;
			if(nowUrl.indexOf("map/initGridPatrol.action") > -1) {
				//警务联动页面报警列表显示
				$("#jwldPanel").show();
				$("#jwldPanel").load("/pcenter/map/queryAlarmNew.do?type=2&random=" + Math.random(), function(s) {
					s = s + "";
					if(s.indexOf("登录") > -1 && s.indexOf("LOGIN") > -1) { //session失效，自动跳转到登录界面  20171026
						window.location.reload();
					}
				});
			} else {
				$("#jwldPanel").hide();
			}
		} else {
			//还原
			$(".content .sidebar").first().fadeIn('slow');
			$(this).removeClass("panel-arrow-open").addClass("panel-arrow-close");
			$(".content .main").css({
				"width": "calc(100% - 320px)"
			});
			$("#jwldPanel").hide();
			$("#reslAlarmList").load("/pcenter/map/queryAlarmNew.do?type=1&random=" + Math.random(), function(s) {
				s = s + "";
				if(s.indexOf("登录") > -1 && s.indexOf("LOGIN") > -1) { //session失效，自动跳转到登录界面  20171026
					window.location.reload();
				}
			});
		}
		//openlayer 外层div宽度变化后需要重新更新
		if(MapVesion == "openLayers") {
			setTimeout(function() {
				map.updateSize();
			}, 1000);
		}

	}).on("mouseenter", function() {
		$("#panelClose .temp").remove();
	});
	if($("#xj-selected").val() != "xj-ldgl") {
		$("#panelClose .temp").remove();
	}
	if($("#panelClose .temp").length == 1) {
		setTimeout(function() {
			$("#panelClose .temp").remove();
		}, 5000);
	}
	getTodayAlarmCountAndNoReceiveCount();
});

function getTodayAlarmCountAndNoReceiveCount() {
	$.ajax({
		url: basePath + "map/getTodayAlarmCountAndNoReceiveCount.do",
		type: "post",
		dataType: "json",
		success: function(res) {
			if(res.code == 200) {
				//赋值
				var data = res.data;
				var countNumber = data.noReceiveCount;
				var todayAlarmCount = data.todayAlarmCount;
				//放全局变量
				alarmAndNoReceiveCount.countNumber = countNumber;
				alarmAndNoReceiveCount.todayAlarmCount = todayAlarmCount;
				$("#todayAlarmCount").html("今日(" + todayAlarmCount + ")");
				$("span.xj-hint-box").text("未处理警情(" + countNumber + ")");
				if(alarmAndNoReceiveCount.countNumber > 99) {
					$("#count-number").text("99+");
				} else {
					if($("#count-number").countTo) {
						$("#count-number").countTo({
							"to": countNumber
						});
					} else {
						$("#count-number").text(countNumber);
					}
				}
			} else {
				// kendo.message(res.description);
			}
		}
	});

}

$(function() {
	initEventAndHtml();
	showleftTree(0);
	showResourcePanel(0);
	var searchInfo = JSON.parse($.cookie("searchInfo"));
	if(searchInfo && searchInfo.gridSearch) {
		$('#searchVal').val(searchInfo.gridSearch)
	}

});

function alarmImgClose(obj) {
	$(obj).parent().addClass("hidden");
}

function buildEscapeeFile(id, url) {
	var picUrl = url;
	$("#alarmImgShow img").attr("src", picUrl);
	$("#alarmImgShow").removeClass("hidden");
	$("#alarmImgShow").css("left", "450px");
	$("#alarmImgShow img").css("width", "240px");
	$("#alarmImgShow img").css("height", "180px");
	$('#imagesPanel .xj-left-panel').hide();
	$('#imagesPanel').removeClass('xj-left-tab');
}

function displayEscapeeImg() {
	$("#imagesPanel").show();
	$("#cgPhoto ul").html("");
	buildEscapeeFile("cgPhoto", $("#carAlarm").prop("src"));
}
/**
 * 点击显示大图片
 */
function alarmImgShowOnly(obj) {
	$("#imagesPanel").show();
	$("#cgPhoto ul").html("");
	var url = basePath + "uploadFile" + obj
	buildEscapeeFile("cgPhoto", url);
}
/**
 * 初始化事件和html样式
 */
var initEventAndHtml = function() {
	//setH();

	//搜索
	var inputStr = "";
	$("#searchVal").keyup(function() {
		var searchStr = $.trim($("#searchVal").val());
		if(inputStr != searchStr) {
			inputStr = searchStr;
			ListManager.searchVal();
		}
	}).click(function() {
		showleftTree(1);
		showResourcePanel(1);
	});
	ResourceDatas.OpretePoliceFlag = true;
}
//#cg-left-tree显示隐藏
function showleftTree(flag) {
	if(flag == 1) {
		$("#cg-left-tree").slideDown('fast');
	} else {
		$("#cg-left-tree").slideUp('fast');
	}
	$("#treeview").css("height", 480);
	$(document).on("mouseup", clickOtherPanel);
}
//#resourcePanel显示隐藏
function showResourcePanel(flag) {
	if(flag == 1) {
		$("#resourcePanel").slideDown('fast');
	} else {
		$("#resourcePanel").slideUp('fast');
	}
	$(document).on("mouseup", clickOtherPanel);
}
//点击其他区域隐藏指定元素
function clickOtherPanel(e) {
	if($(e.target).parents('#mapStart,#cg-left-tree,#resourcePanel,.k-calendar-container,#imagesPanel,#chartDiv,#videomain,.k-window').length == 0) {
		$("#cg-left-tree").slideUp('fast');
		$("#resourcePanel").slideUp('fast');
	}
}
/**
 * 获取分组信息列表
 * 初始化数据源
 */
var resPoliceGroupRequest = function() {
	$.ajax({
		url: basePath + "cg_duty/getPoliceGroupList.do",
		type: "post",
		data: {
			organId: $("#organId").val()
		},
		dataType: "json"
	}).done(function(msg) {
		/**
		 * 根据分组列表组建数据源
		 * @data 分组列表
		 **/
		ListManager.initPGroupDatas(msg.data);
		tempType = 4;
		trailManager.curTempDatas = ResourceDatas.PGroupDatas;
	}).done(function() {
		ListManager.buildAndChcekDatas(ResourceDatas.PGroupDatas, true);
		//组建导航条checkbox
		//ListManager.buildNavCheck(tempType);
		//组建分组列表信息
		setTimeout(function() {
			ListManager.buildGroupHtml(tempType);
		}, 700);
	});
}
/**
 * 获取天网分组信息列表
 * 初始化天网数据源
 */
var resGBGroupRequest = function(type, callback) {
	var orgCode = $.trim($("#organPath").val());
	if(orgCode != "") {
		var orgs = orgCode.split("/");
		orgCode = orgs[orgs.length - 1];
	}
	var sourceType;
	if(type == 1.2) {
		sourceType = 2;
	} else {
		sourceType = 1;
	}
	$.ajax({
		url: basePath + "deviceGroupWeb/getDeviceGroupListByOrganCode.do",
		type: "post",
		data: {
			organCode: orgCode,
			sourceType: sourceType
		},
		dataType: "json"
	}).done(function(msg) {
		if(msg.code == 200) {
			initGBGroupDatas(msg.data, type);
		}
	});
}
/** 
 * 初始化天网列表数据
 */
var initGBGroupDatas = function(data, type) {
	var group = data;
	if(!ResourceDatas.datas[type]) {
		return;
	}
	var gbdata = ResourceDatas.datas[type].data;
	var nogroupIds = {},
		nogorupDatas = {},
		GBTotalCount = 0;
	//声明未分组信息
	var nogroup = {
		id: "nogroup",
		name: "未分组",
		deviceCount: 0
	};
	for(var i = 0; i < group.length; i++) {
		var gbObj = {};
		for(var j in gbdata) {
			if(gbdata[j].deviceGroupId) {
				if(gbdata[j].deviceGroupId == group[i].id) {
					gbObj[gbdata[j].id] = gbdata[j];
					GBTotalCount++;
				}
			} else {
				var naming = gbdata[j].detailInfo.naming; //警员id
				//如果已经存在警员id ，则不添加
				if(!nogroupIds[naming]) {
					nogroupIds[naming] = gbdata[j];
					nogorupDatas[gbdata[j].id] = gbdata[j];
					nogroup.deviceCount++;
					GBTotalCount++;
				}
			}
		}
		var groupObj = {};
		groupObj.GBDatas = gbObj;
		groupObj.pgdata = group[i];
		if(type == 1) {
			ResourceDatas.GBGroupDatas[group[i].id] = groupObj;
		} else {
			ResourceDatas.SHDWGroupDatas[group[i].id] = groupObj;
		}
	}
	//------------------------------处理未分组人员-----------------------------------
	if(group.length == 0) {
		for(var j in gbdata) {
			var naming = gbdata[j].detailInfo.naming; //警员id
			//如果已经存在警员id ，则不添加
			if(!nogroupIds[naming]) {
				nogroupIds[naming] = gbdata[j];
				nogorupDatas[gbdata[j].id] = gbdata[j];
				nogroup.deviceCount++;
				GBTotalCount++;
			}
		}
	}
	var nogroupObj = {};
	nogroupObj.GBDatas = nogorupDatas;
	nogroupObj.pgdata = nogroup;
	//给数据源赋值
	if(type == 1) {
		ResourceDatas.GBGroupDatas[nogroup.id] = nogroupObj;
		$("#GBOnlineId").html(GBTotalCount);
	} else {
		ResourceDatas.SHDWGroupDatas[nogroup.id] = nogroupObj;
		$("#SHOnlineId").html(GBTotalCount);
	}
	nogroupIds = {};
	nogorupDatas = {};
}
/**
 * 警员上线
 * 刷新数量和列表
 * @param gpsId
 */
var refreshOnLineNum = function(gpsId) {
	//2、由于gpsId多次推送，相同的推送一次后就不再变更列表
	if(trailManager.isGpsAndNum[gpsId] == true) {
		return;
	}
	trailManager.isGpsAndNum[gpsId] = true;
	//3、 gps推送 改变状态
	EachDatasByGps(gpsId, 2);
}
/**
 * 警员下线
 * 刷新数量和列表
 * @param gpsId
 */
var refreshOffLineNum = function(gpsId) {
	if(trailManager.isGpsAndNum[gpsId] == false) {
		return;
	}
	trailManager.isGpsAndNum[gpsId] = false;
	//gps推送 改变状态
	EachDatasByGps(gpsId, 1);
}
/**
 * gps推送 改变状态
 * @param gpsId 
 * @param lineFlag 当前执行操作的状态 1下线操作;2上线操作
 */
var EachDatasByGps = function(gpsId, lineFlag) {
	//conMark 用于判断警员在线状态   1为下线标识,2为上线标识
	//valNum  用于改变警员状态与conMark相反。
	var conMark, valNum;
	if(lineFlag == 1) {
		conMark = 2;
		valNum = 1;
	} else {
		conMark = 1;
		valNum = 2;
	}
	//遍历数据源
	d: for(var j in ResourceDatas.PGroupDatas) {
		var curGroupObj = ResourceDatas.PGroupDatas[j];
		var len = curGroupObj.pgArray.length;
		for(var i = 0; i < len; i++) {
			var typeId = "";
			if(curGroupObj.pgArray[i].data.gpsId == gpsId && curGroupObj.pgArray[i].isOnLine == conMark) {
				curGroupObj.pgArray[i].isOnLine = valNum;
				//3、改变总数量
				changeGpsNum(typeId, curGroupObj, gpsId, valNum);
				break d; //跳出分组验证。
			}
		}
	}
}
/**
 * 改变gps在线下线数量
 * @param typeId 当前人员的类型id
 * @param curGroupObj  当前分组对象
 * @param gpsId  
 * @param gpsType 上下线类型。1不在线;2在线 
 */
var changeGpsNum = function(typeId, curGroupObj, gpsId, gpsType) {
	var curgId = curGroupObj.pgdata.id; //当前分组id

	//5、变更图标
	if(gpsType == 2) { //在线
		var curOffline = $(".duty-offline #" + gpsId);
		var img = MapHandler.getImgUrl(4.11);
		curOffline.find("img").attr('src', img);
		$("#re-group-body" + curgId + " .duty-online").append(curOffline);
	} else {
		var curOffline = $(".duty-online #" + gpsId);
		var img = MapHandler.getImgUrl(4.12);
		curOffline.find("img").attr('src', img);
		$("#re-group-body" + curgId + " .duty-offline").append(curOffline);
	}
}

var dyLayer, lsGps = [],
	imageStyle = //显示的图标样式1
	{
		externalGraphic: "../Skin/Default/css/images/blueCar.png",
		graphicWidth: 30,
		graphicHeight: 30,
		pointRadius: 10,
		stroke: false
	},
	startImageStyle = //显示的图标样式1
	{
		externalGraphic: "../Skin/Default/css/images/start_trans.png",
		graphicWidth: 21,
		graphicHeight: 21,
		pointRadius: 10,
		stroke: false
	},
	endImageStyle = //显示的图标样式1
	{
		externalGraphic: "../Skin/Default/css/images/end_trans.png",
		graphicWidth: 21,
		graphicHeight: 21,
		pointRadius: 10,
		stroke: false
	},
	titleStyle = { //文本标签样式
		fontColor: "#FF7F00",
		fontWeight: "bolder",
		fontSize: "14px",
		fill: true,
		fillColor: "#FFFFFF",
		fillOpacity: 1,
		stroke: true,
		strokeColor: "#8B7B8B",
		labelYOffset: 25,
		strokeLinecap: "square"
	},
	lineStyle = {
		fillColor: "#cc0000",
		pointRadius: 3,
		strokeColor: "#cc0000",
		strokeWidth: 2
	};
var basePath = 'http://127.0.0.1:8080/pcenter/';
/**
		 js 处理日期
	*/
function convertDateForTrail(dates) {
	var years = dates.getFullYear();
	var months = dates.getMonth() + 1;
	var days = dates.getDate();

	if(months < 10) {
		months = "0" + months;
	}
	if(days < 10) {
		days = "0" + days;
	}
	query_Gps_trail.startDate = years + "-" + months + "-" + days + " " + "00:00:00";
	query_Gps_trail.endDate = years + "-" + months + "-" + days + " " + "23:59:59";
	query_Gps_trail.gpsId = "";
}
/**
	通过ajax向gps服务获取gps信息
	@param gpsId 
	@param 类别名称
*/
function queryGpsByAjax(gpsId, name, type) {
	if(!query_Gps_trail || !query_Gps_trail.startDate) {
		convertDateForTrail(new Date());
	}
	$.ajax({
		url: basePath + "alarm/getGpsPiontsByGpsId.do",
		type: "post",
		dataType: "json",
		data: {
			gpsId: gpsId,
			startDate: query_Gps_trail.startDate,
			endDate: query_Gps_trail.endDate,
			random: Math.random()
		},
		success: function(req) {
			if(req.code == 200) {
				if(req.data != null) {
					if(req.data.length == 0) {
						kendo.message("当天没有轨迹！");
						return;
					}
					queryGps(gpsId, name, req.data, type);
				}
			} else {
				kendo.message("没有轨迹");
			}
		}
	});
}
/**
		 js 处理日期
	*/
function convertDateForTrailOnMap(dates) {
	var years = dates.getFullYear();
	var months = dates.getMonth() + 1;
	var days = dates.getDate();

	if(months < 10) {
		months = "0" + months;
	}
	if(days < 10) {
		days = "0" + days;
	}
	query_Gps_trail_OnMap.startDate = years + "-" + months + "-" + days + " " + "00:00:00";
	query_Gps_trail_OnMap.endDate = years + "-" + months + "-" + days + " " + "23:59:59";
	query_Gps_trail_OnMap.gpsId = "";
}
/**
	通过ajax向gps服务获取gps信息
	@param gpsId 
	@param 类别名称
*/
function queryGpsByAjaxOnMap(gpsId, name, type) {
	if(!query_Gps_trail_OnMap || !query_Gps_trail_OnMap.startDate) {
		convertDateForTrailOnMap(new Date());
	}
	$.ajax({
		url: basePath + "alarm/getGpsPiontsByGpsId.do",
		type: "post",
		dataType: "json",
		data: {
			gpsId: gpsId,
			startDate: query_Gps_trail_OnMap.startDate,
			endDate: query_Gps_trail_OnMap.endDate,
			random: Math.random()
		},
		success: function(req) {
			if(req.code == 200) {
				if(req.data != null) {
					if(req.data.length == 0) {
						kendo.message("当天没有轨迹！");
						return;
					}
					queryGps(gpsId, name, req.data, type);
				}
			} else {
				kendo.message("没有轨迹");
			}
		}
	});
}

/**查看gps轨迹***/
function queryGps(gpsId, name, obj, type) {
	var pointsList = [];

	if(type == 4)
		imageStyle.externalGraphic = basePath + "images/res/policeMove.png";
	else
		//imageStyle.externalGraphic=basePath+"images/res/vehicleMove.png";
		imageStyle.externalGraphic = basePath + "images/res/vehicle04.png";
	//所有轨迹的开始时间和结束时间
	var allStartTime, allEndTime;
	//单个车获得开始和结束时间，以及包含的点集
	var startTime = obj[0].addressTime;
	var endTime = obj[0].addressTime;
	$(obj).each(function() {
		var gtime = this.addressTime;
		if(gtime < startTime) startTime = gtime;
		if(gtime > endTime) endTime = gtime;
		var en = new TracePositonData(gpsId, this.gpsX, this.gpsY, gtime);
		pointsList.push(en);
	});
	//var trace = new TraceInfoData(gpsId, "测试车辆", pointList, startTime, endTime, imageStyle, lineStyle, startImageStyle, endImageStyle);
	var trace = new TraceInfoData(gpsId, name, pointsList, startTime, endTime, imageStyle, lineStyle, startImageStyle, endImageStyle);
	//获得最大范围的开始时间和结束时间
	if(!allStartTime || startTime < allStartTime) allStartTime = startTime;
	if(!allEndTime || endTime > allEndTime) allEndTime = endTime;
	//恢复到起始播放状态                           
	$("#spanStartTime").text(allStartTime);
	$("#spanEndTime").text(allEndTime);
	restorePlayState();
	$("#playBox").show();
	dragTrail(); //为播放控件加上拖动事件
	allSpan = getTraceDateDiff(allStartTime, allEndTime, "second");
	var traceLayer = initTraceInfoData(map, "replayTrace", [trace], allStartTime, allEndTime, titleStyle);
	traceLayer.drawTraceTimeBack = function(e) {
		$("#playNow").text(e);
		var curSpan = getTraceDateDiff(allStartTime, e, "second");
		$("#playLump").css("left", w * (curSpan / allSpan));
	}
	traceLayer.drawTraceFinishBack = function() {
		$("#palyBtn").removeClass("ui-play-pause-trail");
		$("#playNow").text(allEndTime);
		$("#playLump").css("left", w);
	}
	//自动播放
	goplay();
}

//存放时间跨度和时间轴的宽度
var allSpan, w;
$(function() {
	w = $("#playBox").width() - 10;
	//轨迹播放关闭功能
	$(".trail-close").click(function() {
		clearTraceInfoData();
		$("#playBox").hide();

	});
});
//播放
function goplay() {
	var f = $("#palyBtn").hasClass("ui-play-pause-trail");
	if(f) {
		pauseTraceAnimator();
		$("#palyBtn").removeClass("ui-play-pause-trail");

	} else {
		startTraceAnimator();
		$("#palyBtn").addClass("ui-play-pause-trail");
	}
}

//停止
function gostop() {
	stopTraceAnimator();
	restorePlayState();
}

function restorePlayState() {
	$("#playLump").css("left", 0);
	$("#palyBtn").removeClass("ui-play-pause-trail");
	$("#tishi").text("X1");
	$("#playNow").text($("#spanStartTime").text());
}

//快退
function goback() {
	var speed = decreaseTraceSpeed();
	$("#tishi").text("X" + speed);
}
//快进
function gospeed() {
	var speed = increaseTraceSpeed();
	$("#tishi").text("X" + speed);
}

//拖动
function dragTrail() {
	var oDrag = $("#playLump").get(0);
	var posX = 0;
	oDrag.onmousedown = function(event) {
		var isPause = false;
		if($("#palyBtn").hasClass("ui-play-pause")) {
			isPause = true;
			pauseTraceAnimator();
		}
		oDrag.style.cursor = "default";
		var event = event || window.event;
		var disX = event.clientX - oDrag.offsetLeft;
		document.onmousemove = function(event) {
			var event = event || window.event;
			var maxW = w;
			posX = event.clientX - disX;
			if(posX < 0) {
				posX = 0;
			} else if(posX > maxW) {
				posX = maxW;
			}
			oDrag.style.left = posX + 'px';
		}
		//鼠标松开，窗口将不再移动
		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;
			//轨迹跳转到指定时间
			skipTracePlayTime((posX / w) * allSpan);
			if(isPause) startTraceAnimator();
		}
	}
}

//MQ推送案件的统计
var alarmCount = 0;
$(document).ready(function() {
	var notificationElement = $("#notificationDiv");

	notificationElement.kendoNotification({
		autoHideAfter: 9000,
		templates: [{
			type: "tipAlert",
			template: "<div class='cg-myAlert'><div class='cg-no-top'><div class='cg-n-close' id='closeNotif'></div></div><a href='javascript: void(0);' onclick='window.location.href=\"/pcenter/admin/gotoIndex.action\"'>你有 <span class='cg-myAlert-color' id='alarmCount'>#= myMessage #</span> 条待处理任务</a></div>"
		}],
		hide: onNotiHide
	});

	//获取MQ推送的案件数据
	var userOrgPath = $.trim($("#organPath").val());
	if(userOrgPath != "") {
		userOrgPath = userOrgPath.replace(new RegExp("/", "gm"), ".");
	}
	//var alarmSubscribe = "/exchange/BaseDataExchange/routeData.alarm"+userOrgPath+".#";
	// 	   var alarmSubscribe = "/exchange/BaseDataExchange/routeData.alarm"+userOrgPath;
	// 	   MapHandler.requestMqResource(alarmSubscribe,alarmReceive);
	$('<audio id="chatAudio" loop="loop"><source src="/pcenter/resources/notify.mp3" type="audio/mp3" autoplay></audio>').appendTo("body");

});

/**
 * 隐藏案件通知框回调函数
 */
function onNotiHide() {
	alarmCount = 0;
}

/**
 * 接收MQ推送过来的案件数据
 */
function alarmReceive(data) {
	if(!data || data == "") return;

	var datas = data.split("|");
	var handleType = datas[0]; //操作类型 add & del
	var code = datas[1]; //案件编号
	var createUserId = datas[2]; //案件创建人id
	console.info('接收MQ推送过来的案件数据');
	if(handleType == "add") {
		if($.trim($("#userId").val()) == $.trim(createUserId)) {
			return;
		}
		//显示通知
		showNotification();
		$('#chatAudio')[0].play();

		try {
			//获取统计数量
			loadCaseCount();
		} catch(e) {}
		try {
			//获取案件详情
			findAlarmInfo(code);
		} catch(e) {}
	} else if(handleType == "del") {
		try {
			//清楚案件
			removeAlarm(code);
		} catch(e) {}
	}
}

/**
 * 获取案件详情
 */
function findAlarmInfo(code) {
	if(!code) return;
	$.ajax({
		url: basePath + "alarm/getAlarmInfo.do",
		type: "post",
		dataType: "json",
		data: {
			"jjdbh": code
		},
		success: function(res) {
			if(res.code == 200) {
				var alarmState = res.data ? res.data.ajzt : "";
				var alarmStates = "";
				try {
					//获取目前所选中的状态
					alarmStates = getAlarmState();
				} catch(e) {}

				try {
					if(alarmState != "" && alarmStates.indexOf(alarmState + "") > -1) {
						//根据数据封装每行的HTML
						buildTrHtml(res.data, "mqAdd");
						//为列表绑定 点击 事件
						buildListener();
					}
				} catch(e) {}
			} else {
				// kendo.message(res.description);
			}

		}
	});
}
/**
 * 显示通知
 */
function showNotification() {
	alarmCount++;

	var d = $("#alarmCount").css("display");
	if(d) {
		$("#alarmCount").html(alarmCount);
	} else {
		$("#notificationDiv").data("kendoNotification").show({
			myMessage: alarmCount
		}, "tipAlert");
	}
}
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

var date = new Date().Format("yyyy-MM-dd"); //Format("输入你想要的时间格式:yyyy-MM-dd,yyyyMMdd")

var popedomManager = {
	/**
	 * 加载辖区社区上图
	 */
	initAreaResource: function() {
		popedomManager.setMapCenter();
	},

	setMapCenter: function() {
		$.ajax({
			url: "http://127.0.0.1:8080/pcenter/web/organx/getOrganById.do",
			type: "post",
			dataType: "json",
			success: function(msg) {
				if(msg.code == 200) {
					if(msg.data != null) {
						var cenEn = new MapEntity();
						if(msg.data.centerX && msg.data.centerX != "0.0") {
							cenEn.latitude = msg.data.centerY;
							cenEn.longitude = msg.data.centerX;
						} else {
							cenEn.latitude = mapCenLat;
							cenEn.longitude = mapCenLon;
						}
						if(msg.data.zoom) {
							cenEn.zoom = msg.data.zoom;
						} else {
							cenEn.zoom = mapZoom;
						}
						currentNode = MapToobar.getCurrentNode(cenEn.zoom);
						setTimeout(function() {
							MapManager.setCenter(cenEn);
						}, 1000);
					}
				}
			}
		});
	},

	/**
				获取辖区状态
			*/
	getPopedomList: function(type) {
		var data;
		if(type == 6) {
			data = {
				organIds: $("#organId").val(),
				areaType: 1
			}
		} else if(type == 8) {
			data = {
				organIds: $("#organId").val(),
				areaType: 3
			}
		}
		$.ajax({
			url: "http://127.0.0.1:8080/pcenter/area/queryAreaList.do",
			type: "post",
			dataType: "json",
			data: data,
			success: function(msg) {
				if(msg.code == 200) {
					if(msg.data != null) {
						for(var i = 0; i < msg.data.length; i++) {
							var datasource = msg.data[i];
							if(datasource.displayProperty) {
								var cenEn = new MapEntity();
								cenEn.latitude = datasource.displayProperty.y;
								cenEn.longitude = datasource.displayProperty.x;
								cenEn.zoom = datasource.cuZoom;
								MapManager.setCenter(cenEn);
								if((type == 8 && datasource.isShow == "1") || type == 6) {
									//辖区上图
									popedomManager.loadPolygon(datasource, type);
								}
							}
						}
					}
				}
			}
		});
	},
	/**
	 * 点击辖区、社区上图
	 * @param obj
	 * @param ver
	 */
	loadPolygon: function(obj, type) {
		var mapProperty = obj.mapProperty;
		if(!mapProperty || mapProperty.length == 0) return;
		var displayProperty = obj.displayProperty;
		// 组装圈层各个顶点
		//面数据
		var points = [];
		for(var i = 0, len = mapProperty.length; i < len; i++) {
			points.push([mapProperty[i].x, mapProperty[i].y]);
		}
		var en = new MapEntity();
		en.id = obj.id;
		en.type = type;
		en.layerName = "vectorLayer";
		en.name = obj.areaName;
		en.pointDatas = points;

		// 组装圈层样式
		var mystyle = new Object();
		var enTitle = new MapEntity();
		if(displayProperty) {
			enTitle.longitude = displayProperty.x;
			enTitle.latitude = displayProperty.y;
			if(displayProperty.borderColor != "") {
				mystyle.color = mystyle.strokeColor = displayProperty.borderColor;
			}
			if(displayProperty.borderOpacity != null) {
				mystyle.strokeOpacity = displayProperty.borderOpacity;
			}
			if(displayProperty.fillColor != "") {
				mystyle.fillcolor = mystyle.fillColor = displayProperty.fillColor;
			}
			if(displayProperty.fillOpacity != null) {
				mystyle.opacity = mystyle.fillOpacity = displayProperty.fillOpacity;
			}
		}

		mystyle.strokeWidth = 3;
		mystyle.pointRadius = 6;

		en.style = mystyle;
		// 生成圈层
		MapManager.clearOverlayByIdType(en);
		polygon_final = MapManager.createPolygon(en);
		//生成圈层名称
		enTitle.id = obj.id;
		enTitle.type = "title" + type;
		enTitle.layerName = "vectorLayer";
		enTitle.name = obj.areaName;
		MapManager.clearOverlayByIdType(enTitle);
		MapManager.createTitle(enTitle);
	}
}

window.onresize = function() {
								var height = $('#videodiv').height() - $('#titlevideo').height() - $('.titlevideo').height();
								$('#videodiv').css("width", height / 9 * 16);
							}
							var videoMap = new Map();
							var ocxIdsList = [1, 2, 3, 4];
							var ocxMap = new Map();
							var onlyCap = true;
							var videoNum = 0,
								videoEn = null,
								playXml, name;
							var dbVideoNum = 0;
							var videoArr = new Array(4);
							var hasStopAll = false;
							var repeat = false;
							var currentScreen = 0;
							var isBuild = false;
							var addListener = false;
							var isFourScreen = false;
							var mynaming = "";
							var isHasOcx; //是否安装控件
							var focus = 0;
							var playingNum = 0; //当前播放点位
							var savePath = '';
							var MegaWebPlayer = document.getElementById("MegaWebPlayer");
							var currentFocus = 1;
	
							var isEquative = false;
							/*
							 * 拍照成功回调
							 * @param index 截图的控件号
							 * @param filepath
							 */
							function capCallBack(index, filepath) {
								alert("截图成功");
								//        var MegaWebPlayer = document.getElementById("MegaWebPlayer");
								if(videoManager.browVersion == 1) {
									var temp = filepath.lastIndexOf("\\");
									var addr = filepath.substring(0, temp + 1);
									var fileName = filepath.substring(temp * 1 + 1, filepath.length);
									var param = "<HttpUpload URL=\"http://127.0.0.1:8080/pcenter/alarm/uploadeByOCX.do\">" +
										"<Files Path=\"" + addr + "\"><File Name=\"" + fileName + "\" ContentType=\"image/pjpeg\" />" +
										"</Files><Params></Params></HttpUpload>";
									MegaWebPlayer.HttpUpload(param);
								} else {
									var naming = videoArr[(videoNum - 1) % 4].naming;
									var eventId = AlarmDeviceManager.EventResource[naming];
									console.log("事件id：", eventId);
									//没有事件id 不上传
									if(!eventId) {
										return;
									}
	
									var url = basePath + "alarm/uploadeByOCX.do";
									var file = filepath;
									var type = "image/bmp";
									var extra = "organId:" + $("#organId").val(); //此处传递机构Id,为了天网截图添加水印
									console.log("url:", url, "file:", file, "type:", type, "extra:", extra);
									var repons = MegaWebPlayer.HttpUploadEx(url, file, type, extra);
									console.log("repons:", repons);
									if(repons == "") {
										alert("上传图片失败。");
										return;
									}
									capUpload(index, repons, eventId);
								}
							}
							/*
							 * 图片上传成功回调
							 * @param screen 当前屏幕
							 * @param response 图片路径
							 */
							function capUpload(screen, response, eventId) {
								//        var naming = videoMap.get("ptz" + screen);
								//        console.log("naming:", naming);
								//        var eventId = AlarmDeviceManager.EventResource[naming];
								var response = JSON.parse(response);
								console.log("转换对象：", response.description, "eventId:", eventId);
								//回写状态
								$.ajax({
									url: basePath + "map/addEventResource.do",
									type: "post",
									dataType: "json",
									data: {
										eventId: eventId ? eventId : "",
										resourceUrls: response.description ? response.description : ""
									},
									success: function(msg) {
	
									}
								});
							}
							/**
							 * 视频播放对象管理
							 */
							var videoManager = {
								/**
								 * 初始化屏幕的初始位置
								 */
								screenObj: {
									"1": {
										left: "600px",
										top: "100px"
									},
									"2": {
										left: "1030px",
										top: "100px"
									},
									"3": {
										left: "600px",
										top: "530px"
									},
									"4": {
										left: "1030px",
										top: "530px"
									}
								},
								/** 当前播放屏幕 */
								curPlayScreen: 0,
								/** 当前屏幕对应地图对象 */
								screenMapEnty: new Object(),
								/** 浏览器版本  1 ie版本;2  谷歌版本*/
								browVersion: null,
								/** 是否云台缩放操作 **/
								isZoom: null
							};
	
							function chooseNaming(en) {
								if(en.detailInfo && en.detailInfo.naming) {
									en.naming = en.detailInfo.naming;
									en.naming1 = en.detailInfo.naming1;
								}
								mynaming = en.naming;
								if($("#isEquative").val() == "true" && en.naming1 && en.naming1 != "") {
									mynaming = en.naming1;
								}
								if(mynaming != "" && mynaming != undefined) {
									en.naming = mynaming;
								}
							}
	
							function newPlayingVideo(en) {
								//MapManager.closeInfoWindow();
								//验证是否ie和是否安装控件
								if(validateOcxAndIE()) {
									videoManager.browVersion = 1;
								} else {
									videoManager.browVersion = 2;
								}
								var nameLocals;
								if(en.nameLocal || en.nameLocal == "") {
									nameLocals = en.nameLocal.trim();
								} else if(en.detailInfo && en.detailInfo.nameLocal) {
									nameLocals = en.detailInfo.nameLocal.trim();
								} else {
									nameLocals = "";
								}
								var cameraName;
								if(!nameLocals == "") {
									cameraName = nameLocals;
								} else {
									cameraName = en.name;
								}
								var naming;
								chooseNaming(en);
								naming = en.naming;
								if(!naming) {
									naming = "";
								}
								if(validateExist(naming)) {
									return;
								}
								//&&naming.length < 31
								if(en.detailInfo && en.detailInfo.camType && en.detailInfo.camType == 2) {
									var sArray = [];
									sArray.push({
										naming: naming,
										name: cameraName
									});
									try {
										sewiseManager.streamVideo('streamBox', sArray);
									} catch(e) {
										console.log(e);
									}
								} else {
	
									if(en.dbflag == undefined) {
										//播放天网视频
										buildGBVideoXML(videoNum, cameraName, en, naming);
									} else {
										//播放单兵视频
										buildDBVideoXML(dbVideoNum, cameraName, en, naming);
										//屏幕和地图对象 建立关系
										videoManager.screenMapEnty[dbVideoNum] = en;
									}
									initButton();
								}
							}
							/**
							 * 播放天网视频和单兵视频的入口
							 */
							function playingVideo(en) {
								//MapManager.closeInfoWindow();
								//验证是否ie和是否安装控件
								if(validateOcxAndIE()) {
									videoManager.browVersion = 1;
								} else {
									videoManager.browVersion = 2;
								}
								var nameLocals;
								if(en.nameLocal || en.nameLocal == "") {
									nameLocals = en.nameLocal.trim();
								} else if(en.detailInfo && en.detailInfo.nameLocal) {
									nameLocals = en.detailInfo.nameLocal.trim();
								} else {
									nameLocals = "";
								}
								var cameraName;
								if(!nameLocals == "") {
									cameraName = nameLocals;
								} else {
									cameraName = en.name;
								}
								var naming;
								chooseNaming(en);
								naming = en.naming;
								if(!naming) {
									naming = "";
								}
								if(validateExist(naming)) {
									return;
								}
								if(en.dbflag == undefined) {
									//播放天网视频
									buildGBVideoXML(videoNum, cameraName, en, naming);
								} else {
									//播放单兵视频
									buildDBVideoXML(dbVideoNum, cameraName, en, naming);
									//屏幕和地图对象 建立关系
									videoManager.screenMapEnty[dbVideoNum] = en;
								}
								initButton();
							}
	
							function validateExist(naming) {
								for(var i = 0; i < videoArr.length; i++) {
									if(videoArr[i] && videoArr[i].naming == naming) {
										return true;
									}
								}
								return false;
							}
							/**
							 * 组装天网播放xml和业务操作
							 * @param videoNum 当前播放天网Num号
							 * @param en 当前播放天网的对象
							 * @paran naming 当前播放的naming
							 */
							function buildDBVideoXML(dbVideoNum, cameraName, en, naming) {
								var ocxHtml = "";
								if(videoManager.browVersion == 1) { //ie
									ocxHtml += "<object classid='CLSID:A3195F4E-37EF-4808-B550-ADECD031E884'";
									ocxHtml += "id='DBMegaWebPlayer" + dbVideoNum + "' width=400 height=370";
									ocxHtml += "data='DATA:application/x-oleobject;BASE64,SjeBlYjBgEm21SrkMY9pShAHAABhJAAAxB0AAA=='></object>";
								} else { //google
									ocxHtml += "<embed id='DBMegaWebPlayer" + dbVideoNum + "' width=400 height=300  type='application/x-scty-realtime'>";
								}
								var c = "";
								c += "<div id='videodiv" + dbVideoNum + "' class='videodiv'>";
								c += "<div id='titlevideo" + dbVideoNum + "' style='background:rgb(9,65,101);border:1px solid rgb(69,213,249);height:25px;width:400px;'>";
								c += "<span title='" + cameraName + "' class='videoNameClass' >" + cameraName + " 单兵</span>";
								c += "<span style='float:right;margin-right:5px;' onclick=\"closeDbDiv('videodiv" + dbVideoNum + "','" + naming + "','" + dbVideoNum + "')\" class='cg-i-close'>×</span>";
								c += "</div>";
								c += ocxHtml;
								c += "</div>";
								$("#videomain").append(c);
								var screen = videoManager.screenObj[dbVideoNum + 1];
								$("#videodiv" + dbVideoNum).css("left", screen.left);
								$("#videodiv" + dbVideoNum).css("top", screen.top);
								var paramArr = naming.split(":");
								var deviceId = paramArr[0],
									accessIp = paramArr[2];
								var returnXml = playDBXml(naming, cameraName, deviceId);
								DBMegaWebPlayer = document.getElementById("DBMegaWebPlayer" + dbVideoNum);
								try {
									DBMegaWebPlayer.Play(accessIp, "6001", returnXml);
								} catch(e) {}
								videoMap.put(naming, true); //判断同一视频不能再播放
								dragVideo(dbVideoNum); //拖动
							}
							/**
							 * 组建播放单兵xml
							 */
							function playDBXml(naming, devName, dstId) {
								var playXml = "<Message privilege=1 uuid=30001>";
								playXml += "<Naming>" + naming + "</Naming>";
								playXml += "<Version>2</Version>";
								playXml += "<DevName>" + devName + "</DevName>";
								playXml += "<StreamType>MainStream</StreamType>";
								playXml += "<DstID>" + dstId + "</DstID><SrcID />";
								playXml += "<Type>RealTimeVideo</Type>";
								playXml += "</Message>";
								return playXml;
							}
							/**
							 * 验证是否是ie或者是否安装控件
							 */
							function validateOcxAndIE() {
								if(!isIE()) {
									return false;
								}
								$("#videomain").css("display", "");
								if(oxcPlayer.State == undefined) { //未安装播放器插件
									buildUnOcxXML();
									drag();
									return false;
								}
								if(!isHasOcx) {
									$("#videomain").empty();
								}
								isHasOcx = true;
								return true;
							}
							/**
							 * 组装天网播放xml和业务操作
							 * @param videoNum 当前播放天网Num号
							 * @param en 当前播放天网的对象
							 * @paran naming 当前播放的naming
							 */
							function buildGBVideoXML(videoNum, cameraName, en, naming) {
								//组建ocx html
								var flag = videoNum % 4;
								if(flag == 0 && videoNum < 4 && !isBuild) {
									//           MegaWebPlayer = document.getElementById("MegaWebPlayer");
									if(!MegaWebPlayer) {
										buildOcxHtml(videoNum, cameraName, en, naming, videoManager.browVersion);
										console.info("create ocx plugin");
										MegaWebPlayer = document.getElementById("MegaWebPlayer");
										isBuild = true;
										isFourScreen = false;
									}
								} else {
									$('#videomain #videodiv').show();
								}
								var video = {
									naming: naming,
									cameraName: cameraName
								}
								if(videoArr[flag]) {
									videoArr[flag]['naming'] = naming;
									videoArr[flag]['cameraName'] = cameraName;
								} else {
									videoArr[flag] = video;
								}
								//------------------实时播放视频------------------------
								playXml = realPlayVideo(flag, naming, cameraName);
								//        videoMap.put("playXml" + videoNum, playXml);//提供暂停再播放playxml
								//        videoMap.put("MegaWebPlayer" + videoNum, cameraName);//此处为了录像时获取当前视频名称
								//        videoMap.put("ptz" + videoNum, naming);//此处为了云台控制获取当前视频naming
								dragVideo(videoNum); //拖动
							};
							/**
							 * 组装ie 控件xml
							 * @param videoNum 当前播放天网Num号
							 * @param en 当前播放天网的对象
							 * @paran naming 当前播放的naming
							 * @param browType 浏览器类型
							 */
							var buildOcxHtml = function(videoNum, cameraName, en, naming, browType) {
								$("#videomain").css("display", "block");
								var ocxHtml = "",
									c = "";
								if(browType == 1) { //ie
									ocxHtml += "<object classid='clsid:9581374A-C188-4980-B6D5-2AE4318F694A'";
									ocxHtml += "id='MegaWebPlayer' width='100%' height='100%' ";
									ocxHtml += "data='DATA:application/x-oleobject;BASE64,SjeBlYjBgEm21SrkMY9pShAHAABhJAAAxB0AAA=='></object>";
								} else { //google
									ocxHtml += "<embed id='MegaWebPlayer' width='100%' height='100%' ";
									ocxHtml += "type='application/x-hxht-realtime'>";
								}
								c += "<div id='videodiv' class='videodiv'>";
								c += "<div id='titlevideo' style='background:rgb(9,65,101);border:1px solid rgb(69,213,249);height:25px;width:100%;'>";
								c += "<span title='" + cameraName + "' class='videoNameClass' id='videoHead' >" + cameraName + "</span>";
								c += "<span style='float:right;margin-right:5px;' onclick=\"closeDiv('videodiv','" + naming + "','" + videoNum + "')\" class='cg-i-close'>×</span>";
								c += "</div>";
								c += ocxHtml;
								c += "<div class='ty-sp-box'>";
								c += "<i onclick='video_stop()' title='停止' id='ocx-stop' class='ocx-icon ocx-stop'></i>";
								c += "<i onclick='video_stop_all(true)' title='全部停止' id='ocx-stop-all' class='ocx-icon ocx-stop-all'></i>";
								c += "<i onclick='video_cap()' title='截屏上传' id='ocx-capture' class='ocx-icon ocx-capture'></i>";
								c += "<i onclick='video_start_record()' title='录制' id='ocx-record' class='ocx-icon ocx-record'></i>";
								c += "<i onclick='video_stop_record()' title='停止录制' id='ocx-record-click' class='ocx-icon ocx-recording'></i>";
								c += "<i onclick='video_set_sound(false)' title='声音' id='ocx-sound' class='ocx-icon ocx-sound'></i>";
								c += "<i onclick='video_set_sound(true)' title='声音' id='ocx-open-sound' class='ocx-icon ocx-sounding'></i>";
								c += "<i input input id='slider' class='balSlider' title='滑动'></i>";
								c += "<i title='云台控制' id='ocx-pzx-control' class='ocx-icon ocx-pzx-control'>" +
									"<span class='ocx-button-left' onclick='video_left()'></span>" +
									"<span class='ocx-button-top' onclick='video_up()'></span>" +
									"<span class='ocx-button-right' onclick='video_right()'></span>" +
									"<span class='ocx-button-bottom' onclick='video_down()'></span></i>";
								c += "<i onclick='video_zoomOut()' title='放大' id='ocx-zoom-in' class='ocx-icon ocx-zoom-in'></i>";
								c += "<i onclick='video_zoomIn()' title='缩小' id='ocx-zoom-out' class='ocx-icon ocx-zoom-out'></i>";
								c += "<i onclick='setVideoScreen(4)' title='四分屏' id='ocx-four-screen' class='ocx-icon ocx-four-screen'></i>";
								c += "<i onclick='setVideoScreen(1)' title='一分屏' id='ocx-single-screen' class='ocx-icon ocx-single-screen'></i>";
								c += "<i onclick='video_full()' title='全  屏' id='ocx-full-screen' class='ocx-icon ocx-full-screen'></i>";
								c += "</div>";
								$("#videomain").append(c);
							};
							/**
							 * 实时播放视频
							 * @param videoNum  当前播放天网Num号
							 * @param naming  播放naming
							 * @param cameraName  播放名称
							 */
							var realPlayVideo = function(curVideoNum, naming, cameraName) {
	
								var gbIP = naming.split(":")[2],
									playRealXml = "";
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								if(videoManager.browVersion == 1) { //ie
									playRealXml += "<SourceAddr><IP>" + gbIP + "</IP><Port>" + "6001" + "</Port><CameraID>";
									playRealXml += naming + "</CameraID><SessionID>0000000000200000000000001694555</SessionID></SourceAddr>";
									MegaWebPlayer.SourceAddr = playRealXml;
								} else { //google
									playRealXml += "<?xml version='1.0' encoding='GBK'?>";
									playRealXml += "<Source type='access'><Camera naming='" + naming + "'/>";
									playRealXml += "<Version value='1' /><Account sessionId ='0000000000200000000000001694555'/>";
									playRealXml += "<Access ip='" + gbIP + "' port='6001' /></Source>";
									try {
										if(!addListener) {
											MegaWebPlayer.addEventListener("OnScreenFocusChanged", function(param) {
												currentScreen = param;
												if(videoArr[param] && videoArr[param].cameraName) {
													setTitleAttr(videoArr[param].cameraName);
												}
	
												if(MegaWebPlayer.GetSound()) {
													$('#ocx-sound').hide();
													$('#ocx-open-sound').show();
												} else {
													$('#ocx-sound').show();
													$('#ocx-open-sound').hide();
												}
											}, true);
											addListener = true;
										}
										if(videoNum == 0 && !hasStopAll && !isFourScreen) {
											MegaWebPlayer.SetScreenCount(1);
										} else {
											MegaWebPlayer.SetScreenCount(4);
											isFourScreen = true;
										}
										videoNum++;
										curVideoNum = curVideoNum + 1;
										MegaWebPlayer.SetScreenFocus(curVideoNum);
										if(videoManager.browVersion == 1) {
											MegaWebPlayer.Action = "Stop";
										} else {
											MegaWebPlayer.Stop(true);
										}
										MegaWebPlayer.Init(playRealXml);
										MegaWebPlayer.Connect();
									} catch(e) {}
								}
								return playRealXml;
	
							}
	
							function setTitleAttr(cameraName) {
								$('#videoHead').prop('title', cameraName);
								$('#videoHead').text(cameraName);
							}
	
							function mouseOnStop() {
								$('#ocx-stop').removeClass('ocx-stop');
								$('#ocx-stop').addClass('ocx-stopping');
							}
	
							function mouseOutStop() {
								$('#ocx-stop').removeClass('ocx-stopping');
								$('#ocx-stop').addClass('ocx-stop');
							}
	
							function mouseOnStopAll() {
								$('#ocx-stop-all').removeClass('ocx-stop-all');
								$('#ocx-stop-all').addClass('ocx-stopping-all');
							}
	
							function mouseOutStopAll() {
								$('#ocx-stop-all').removeClass('ocx-stopping-all');
								$('#ocx-stop-all').addClass('ocx-stop-all');
							}
	
							function mouseOnCapture() {
								$('#ocx-capture').removeClass('ocx-capture');
								$('#ocx-capture').addClass('ocx-capture-upload');
							}
	
							function mouseOutCapture() {
								$('#ocx-capture').removeClass('ocx-capture-upload');
								$('#ocx-capture').addClass('ocx-capture');
							}
	
							function mouseOnRecord() {
								$('#ocx-record').removeClass('ocx-record');
								$('#ocx-record').addClass('ocx-recording');
							}
	
							function mouseOutRecord() {
								$('#ocx-record').removeClass('ocx-recording');
								$('#ocx-record').addClass('ocx-record');
							}
	
							function mouseOnFourScreen() {
								$('#ocx-four-screen').removeClass('ocx-four-screen');
								$('#ocx-four-screen').addClass('ocx-four-screening');
							}
	
							function mouseOutFourScreen() {
								$('#ocx-four-screen').removeClass('ocx-four-screening');
								$('#ocx-four-screen').addClass('ocx-four-screen');
							}
	
							function mouseOnSingleScreen() {
								$('#ocx-single-screen').removeClass('ocx-single-screen');
								$('#ocx-single-screen').addClass('ocx-single-screening');
							}
	
							function mouseOutSingleScreen() {
								$('#ocx-single-screen').removeClass('ocx-single-screening');
								$('#ocx-single-screen').addClass('ocx-single-screen');
							}
	
							function mouseOnFullScreen() {
								$('#ocx-full-screen').removeClass('ocx-full-screen');
								$('#ocx-full-screen').addClass('ocx-full-screening');
							}
	
							function mouseOutFullScreen() {
								$('#ocx-full-screen').removeClass('ocx-full-screening');
								$('#ocx-full-screen').addClass('ocx-full-screen');
							}
	
							function sliderOnChange(e) {
								MegaWebPlayer.SetVolume(e.value);
							}
	
							function initButton() {
								$('#ocx-record-click').hide();
								$('#ocx-open-sound').hide();
								$("#slider").kendoSlider({
									change: sliderOnChange,
									showButtons: false,
									min: 0,
									max: 65535,
									smallStep: 1,
									largeStep: 13107,
									value: 32767
								});
								var slider = $("#slider").getKendoSlider();
								if(slider != null && slider != undefined) {
									slider.wrapper.css("width", "70px");
									slider.resize();
								}
	
								if(videoNum == 1 && !hasStopAll) {
									$('#ocx-stop-all').hide();
									$('#ocx-four-screen').show();
									$('#ocx-single-screen').hide();
								} else {
									$('#ocx-stop-all').show();
									$('#ocx-four-screen').hide();
									$('#ocx-single-screen').show();
								}
	
								$(".k-slider-track").attr("style", "left: 5px;width: 70px;");
							}
	
							function video_full() {
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								MegaWebPlayer.FullScreen(true);
							}
	
							/**
							 * 组建未安装ocx xml
							 */
							function buildUnOcxXML() {
								$("#videomain").empty();
								var c = "";
								c += "<div class='videodiv1'>";
								c += "<div id='titlevideo' style='background:rgb(9,65,101);border:1px solid rgb(69,213,249);height:25px;line-height:25px;'>";
								c += "<span style='font-size:15px;margin-left:10px;font-family:Arial, \"微软雅黑\", \"宋体\";'>提示:</span>";
								c += "<span onclick=\"closeDiv1()\" class='cg-i-close'>×</span></div>";
								c += "<table style='background-color:#EBEFF3;height:260px;'><tbody><tr><td>";
								c += "<p style='width:290px;'><lable style='height:50px;font-size:15px;margin-left:10px;margin-top:30px;font-family:Arial, \"微软雅黑\", \"宋体\";'>尚未安装播放器插件，请安装后刷新页面</lable></p>";
								c += "<p style='width:290px;'><button type='button' style='font-size:20px;margin-left:20px;margin-top:10px' class='k-primary k-button' onclick='exportOcx()' >点击安装播放器插件</button></p>";
								c += "</td></tr></tbody></table></div>";
								$("#videomain").append(c);
							}
	
							function setVideoScreen(screen) {
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								if(screen == 1) {
									MegaWebPlayer.GetScreenFocus();
									MegaWebPlayer.SetScreenCount(1);
									MegaWebPlayer.SetScreenFocus(currentFocus);
									$('#ocx-four-screen').show();
									$('#ocx-single-screen').hide();
								} else {
									MegaWebPlayer.SetScreenFocus(currentFocus);
									MegaWebPlayer.SetScreenCount(screen);
									MegaWebPlayer.SetSound(false);
									$('#ocx-four-screen').hide();
									$('#ocx-single-screen').show();
								}
	
							}
	
							//截图
							function video_cap(type) {
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								var myDate = new Date();
								var mytime = myDate.getFullYear() + "" + myDate.getMonth() + "" + myDate.getDate() + "" + myDate.getHours() + "" + myDate.getMinutes() + "" + myDate.getSeconds(); //获取日期与时间
								var path = "";
								if(videoManager.browVersion == 1) {
									path += tempPicAndVideoUrl.replace('/', '\\\\') + "\\";
									//            path += videoMap.get("MegaWebPlayer" + videoNum);
									path += videoArr[(videoNum - 1) % 4].cameraName;
									path += "\\";
									path += mytime + ".jpg";
									MegaWebPlayer.Action = "CaptureImage:" + path;
								} else {
									path += tempPicAndVideoUrl.replace('/', '\\') + "\\";
									//            path += videoMap.get("MegaWebPlayer" + videoNum);
									path += videoArr[(videoNum - 1) % 4].cameraName;
									path += "\\";
									path += mytime + ".bmp";
									console.info(path);
									var status = MegaWebPlayer.Snapshot(path);
									capCallBack(videoNum, path);
								}
								onlyCap = true;
							}
							//播放
							function video_play(videoNum) {
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer" + videoNum);
								var xml = videoMap.get("playXml" + videoNum);
								if(videoManager.browVersion == 1) {
									MegaWebPlayer.SourceAddr = xml;
								} else {
									MegaWebPlayer.Init(xml);
									MegaWebPlayer.Connect();
								}
							}
							//音量关
							function video_set_sound(flag) {
								if(!flag) {
									$('#ocx-sound').hide();
									$('#ocx-open-sound').show();
									MegaWebPlayer.SetSound(true);
									MegaWebPlayer.GetSound();
								} else {
									$('#ocx-open-sound').hide();
									$('#ocx-sound').show();
									MegaWebPlayer.SetSound(false);
									MegaWebPlayer.GetSound()
								}
	
							}
	
							function video_stop() {
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								var focus = MegaWebPlayer.GetScreenFocus();
								videoArr[focus - 1] = null;
								videoNum = focus - 1;
								$('#videoHead').text('');
								$('#videoHead').prop('title', '');
								addListener = false;
								if(videoManager.browVersion == 1) {
									MegaWebPlayer.Action = "Stop";
								} else {
									try {
										MegaWebPlayer.Stop(true);
									} catch(e) {}
								}
								//        MegaWebPlayer.removeEventListener();
							}
	
							function video_stop_all(flag) {
								videoNum = 0;
								$('#videodiv').html();
								if(flag && flag == true) {
									hasStopAll = true;
								} else {
									hasStopAll = false;
								}
								isFourScreen = false;
								videoArr = [];
								$('#videoHead').text('');
								$('#videoHead').prop('title', '');
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								if(videoManager.browVersion == 1) {
									MegaWebPlayer.Action = "Stop";
								} else {
									try {
										MegaWebPlayer.StopAll();
									} catch(e) {}
								}
								//        MegaWebPlayer.removeEventListener();
								addListener = false;
							}
							//开始录像
							var isRecording = 0;
	
							function video_start_record() {
								$('#ocx-record').hide();
								$('#ocx-record-click').show();
								var myDate = new Date();
								var mytime = myDate.getFullYear() + "" + myDate.getMonth() + "" + myDate.getDate() + "" + myDate.getHours() + "" + myDate.getMinutes() + "" + myDate.getSeconds(); //获取日期与时间
								var path = "";
								if(videoManager.browVersion == 1) {
									path += tempPicAndVideoUrl.replace('/', '\\\\') + "\\";
									//            path += videoMap.get("MegaWebPlayer" + videoNum);
									path += videoArr[(videoNum - 1) % 4].cameraName;
									path += "\\";
									path += mytime + ".mp4";
								} else {
									path += tempPicAndVideoUrl.replace('/', '\\') + "\\";
									//            path += videoMap.get("MegaWebPlayer" + videoNum);
									path += videoArr[(videoNum - 1) % 4].cameraName;
									path += "\\";
									path += mytime + ".mp4";
								}
								savePath = path;
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								if(!videoArr[(videoNum - 1) % 4]["recording"]) {
									videoArr[(videoNum - 1) % 4]["recording"] = true;
									if(videoManager.browVersion == 1) {
										MegaWebPlayer.Action = "StartRecoder:" + path;
									} else {
										MegaWebPlayer.StartRecorder(path);
									}
								}
							}
							//结束录像
							function video_stop_record() {
								$('#ocx-record-click').hide();
								$('#ocx-record').show();
								//        MegaWebPlayer = document.getElementById("MegaWebPlayer");
								videoArr[(videoNum - 1) % 4]["recording"] = false;
								if(videoManager.browVersion == 1) {
									MegaWebPlayer.Action = "StopRecoder";
								} else {
									MegaWebPlayer.StopRecorder();
								}
								kendo.message(savePath);
							}
							/**
							 * 组建云台控制xml
							 * @param direction 云台方向
							 * @param cmd 指令值
							 * @param naming 播放Naming
							 */
							var buildPTZXml = function(index, direction, cmd) {
								var naming = videoArr[index - 1].naming,
									param = "";
								param += "<Parameter CmdType='PTZControl'>";
								param += "<SessionID>0000000000200000000000002410239</SessionID>";
								param += "<Account UsrNaming='" + naming + "'/>";
								param += "<Naming Name='252'>" + naming + "</Naming>";
								param += "<Operate>" + cmd + "</Operate>";
								if(cmd == 8302) { //缩小，放大
									param += "<Switch>" + direction + "</Switch>";
									videoManager.isZoom = true;
								}
								if(cmd == 8200) { //云台方向
									param += "<Action Direct='" + direction + "' Speed='84'/>";
									videoManager.isZoom = false;
								}
								param += "</Parameter>";
								return param;
							};
							var opeObj = null;
							//缩小
							function video_zoomIn() {
								opeObj = document.getElementById("MegaWebPlayer");
								var index = opeObj.GetScreenFocus();
								if(videoManager.browVersion == 1) {
									opeObj.Action = "Ptz:far";
								} else {
									opeObj.PtzControl(buildPTZXml(index, 0, 8302));
								}
								video_ptz_stop();
							}
	
							//放大
							function video_zoomOut() {
								opeObj = document.getElementById("MegaWebPlayer");
								var index = opeObj.GetScreenFocus();
								if(videoManager.browVersion == 1) {
									opeObj.Action = "Ptz:near";
								} else {
									opeObj.PtzControl(buildPTZXml(index, 1, 8302));
								}
								video_ptz_stop();
							}
	
							//左移
							function video_left() {
								opeObj = document.getElementById("MegaWebPlayer");
								var index = opeObj.GetScreenFocus();
								if(videoManager.browVersion == 1) {
									opeObj.Action = "Ptz:left";
								} else {
									opeObj.PtzControl(buildPTZXml(index, "L", 8200));
								}
								video_ptz_stop();
							}
	
							//右移
							function video_right() {
								opeObj = document.getElementById("MegaWebPlayer");
								var index = opeObj.GetScreenFocus();
								if(videoManager.browVersion == 1) {
									opeObj.Action = "Ptz:right";
								} else {
									opeObj.PtzControl(buildPTZXml(index, "R", 8200));
								}
								video_ptz_stop();
							}
	
							//上移
							function video_up() {
								opeObj = document.getElementById("MegaWebPlayer");
								var index = opeObj.GetScreenFocus();
								if(videoManager.browVersion == 1) {
									opeObj.Action = "Ptz:up";
								} else {
									opeObj.PtzControl(buildPTZXml(index, "U", 8200));
								}
								video_ptz_stop();
							}
	
							//下移
							function video_down() {
								opeObj = document.getElementById("MegaWebPlayer");
								var index = opeObj.GetScreenFocus();
								if(videoManager.browVersion == 1) {
									opeObj.Action = "Ptz:down";
								} else {
									opeObj.PtzControl(buildPTZXml(index, "D", 8200));
								}
								video_ptz_stop();
							}
	
							//停止移动
							function video_ptz_stop() {
								if(opeObj) {
									if(videoManager.browVersion == 1) {
										opeObj.Action = "Ptz:stop";
									} else {
										if(videoManager.isZoom) { //是否缩放操作
											opeObj.PtzControl(buildPTZXml(videoNum, 0, 8308));
										} else {
											opeObj.PtzControl(buildPTZXml(videoNum, "", 8202));
										}
									}
								}
								opeObj = null;
							}
	
							/**
							 关闭所有
							 */
							function closeVideoAll() {
								$('#videomain #videodiv').remove();
								videoMap.removeAll();
								videoArr = [];
								videoNum = 0;
								hasStopAll = false;
								isBuild = false;
								videoEn = null;
							}
	
							function closeDbDiv(divId, naming, num) {
								ocxMap.put(divId, null); //清空ocx屏幕集合中对象的value,以便获取当前播放屏幕号
								videoMap.put(naming, false); //清空naming值
								playingNum--; //当前播放点位数量 -1
								$(divId).remove();
								DBMegaWebPlayer = document.getElementById("DBMegaWebPlayer" + num);
								try {
									DBMegaWebPlayer.StopVideo();
								} catch(e) {}
								videoManager.screenMapEnty[num] = null;
								$("#videomain #" + divId).remove();
								return;
								/** 获取到地图对象 */
								var enty = videoManager.screenMapEnty[num];
								if(enty && enty != null) {
									//单兵下线则跳出
									var en = ResourceDatas.DBinDatas[enty.id]
									if(!en || en == null) {
										return;
									}
									var imgUrl = MapHandler.getBarImgByType(4, enty.detailInfo.typeId, false, false);
									enty.iconUrl = imgUrl;
									//删除单兵未播对象
									MapToobar.clearVectorMarkersByIdType(enty);
									//更换图标重新上图
									MapManager.createPointOnly(enty);
									//更改列表图标
									$("#dbinBox #" + enty.id).attr("src", imgUrl);
								}
							}
							/**
							 *隐藏过滤窗口
							 *@param divId 当前视频窗口videodiv+num
							 *@param  num 当前屏幕id
							 */
							function closeDiv(naming, num) {
								//       ocxMap.put(divId,null);//清空ocx屏幕集合中对象的value,以便获取当前播放屏幕号
								//       videoMap.put(naming,false); //清空naming值
								//       playingNum--; //当前播放点位数量 -1
								$('#videomain #videodiv').hide();
								videoArr = [];
								videoNum = 0; //当前播放点位数量 -1
								hasStopAll = false;
								isFourScreen = false;
								addListener = false;
								//停止单兵或者天网视频
								video_stop_all(false);
							}
							//判断IE
							function isIE() { //ie?
								if(!!window.ActiveXObject || "ActiveXObject" in window)
									return true;
								else
									return false;
							}
							//下载ocx
							function exportOcx() {
	
								window.location.href = "http://127.0.0.1:8080/pcenter/web/GBPlatForm/GetWebocx.do";
							}
	
							/**
							 * 窗体拖动
							 */
							function dragVideo(videoNum) {
								var oDrag = $("#videodiv").get(0);
								var oTitle = $("#titlevideo").get(0);
								var posX = posY = 0;
								if(!oTitle) {
									return;
								}
								oTitle.onmousedown = function(event) {
									oTitle.style.cursor = "pointer";
									var event = event || window.event;
									var disX = event.clientX - oDrag.offsetLeft;
									var disY = event.clientY - oDrag.offsetTop;
									//鼠标移动，窗口随之移动
									document.onmousemove = function(event) {
										var event = event || window.event;
										var maxW = document.documentElement.clientWidth - oDrag.offsetWidth;
										var maxH = document.documentElement.clientHeight;
										posX = event.clientX - disX;
										posY = event.clientY - disY;
										if(posX < 0) {
											posX = 0;
										} else if(posX > maxW) {
											posX = maxW;
										}
										if(posY < 0) {
											posY = 0;
										} else if(posY > maxH) {
											posY = maxH;
										}
										oDrag.style.left = posX + 'px';
										oDrag.style.top = posY + 'px';
									}
									//鼠标松开，窗口将不再移动
									document.onmouseup = function() {
										document.onmousemove = null;
										document.onmouseup = null;
									}
								}
							}
							//验证播放控件div关闭
							function closeDiv1() {
								$("#videomain").css("display", "none");
								videoNum = 0;
								videoArr = [];
								isBuild = false;
								hasStopAll = false;
								isFourScreen = false;
							}
	
							//拖动
							function drag() {
								var oDrag = $(".videodiv1").get(0);
								var posX = posY = 0;
								oDrag.onmousedown = function(event) {
									oDrag.style.cursor = "default";
									var event = event || window.event;
									var disX = event.clientX - oDrag.offsetLeft;
									var disY = event.clientY - oDrag.offsetTop;
									//鼠标移动，窗口随之移动
									document.onmousemove = function(event) {
										var event = event || window.event;
										var maxW = document.documentElement.clientWidth - oDrag.offsetWidth;
										var maxH = document.documentElement.clientHeight;
										posX = event.clientX - disX;
										posY = event.clientY - disY;
										if(posX < 0) {
											posX = 0;
										} else if(posX > maxW) {
											posX = maxW;
										}
										if(posY < 0) {
											posY = 0;
										} else if(posY > maxH) {
											posY = maxH;
										}
										oDrag.style.left = posX + 'px';
										oDrag.style.top = posY + 'px';
									}
									//鼠标松开，窗口将不再移动
									document.onmouseup = function() {
										document.onmousemove = null;
										document.onmouseup = null;
									}
								}
							}
	
							(function() {
								$("body").keydown(function(e) {
									var e = window.event || e;
									MegaWebPlayer = document.getElementById("MegaWebPlayer");
									var through = false;
									if(through) {
										if(e.keyCode == 27 || e.keyCode == 96) //esc
										{
											videoMap.put("full" + videoNum, false);
										}
										if(e.keyCode == 38) //上
										{
											if(videoManager.browVersion == 1) {
												opeObj.Action = "Ptz:up";
											} else {
												console.log("上：操作google" + videoNum);
												opeObj.PtzControl(buildPTZXml(videoNum, "U", 8200));
											}
										} else if(e.keyCode == 40) //下
										{
											if(videoManager.browVersion == 1) {
												opeObj.Action = "Ptz:down";
											} else {
												opeObj.PtzControl(buildPTZXml(videoNum, "D", 8200));
											}
										} else if(e.keyCode == 37) //左
										{
											if(videoManager.browVersion == 1) {
												opeObj.Action = "Ptz:left";
											} else {
												opeObj.PtzControl(buildPTZXml(videoNum, "L", 8200));
											}
										} else if(e.keyCode == 39) //右
										{
											if(videoManager.browVersion == 1) {
												opeObj.Action = "Ptz:right";
											} else {
												opeObj.PtzControl(buildPTZXml(videoNum, "R", 8200));
											}
										} else if(e.keyCode == 49 && e.ctrlKey) //ctrl+1
										{
											opeObj.playerFullScreen = "0";
											create_case(videoNum, videoEn);
										} else if(e.keyCode == 187 && e.ctrlKey) //ctrl +
										{
											opeObj.Action = "Ptz:near";
										} else if(e.keyCode == 189 && e.ctrlKey) //ctrl -
										{
											opeObj.Action = "Ptz:far";
										}
									}
								});
								$("body").keyup(function(e) {
									if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 187 || e.keyCode == 189) {
										video_ptz_stop();
									}
								});
							})();