function moveToCurOrgan() {
	MapManager.setCenter({
		longitude: '${sessionScope.organX}',
		latitude: '${sessionScope.organY}'
	});
}

$(document).ready(function() {
	//三级菜单显示隐藏
	$("#xjMenu li").on("mouseenter", function() {
		var two = $(this).find(".sublist");
		if(two.length == 1) {
			two.toggle("fast");
		}
		//$(this).find("a").first().addClass("a-hover");
	}).on("mouseleave", function() {
		var two = $(this).find(".sublist");
		if(two.length == 1) {
			two.hide();
		}
		//$(this).find("a").first().removeClass("a-hover");
	});
	//菜单选中样式
	var menuSel = $("#xj-selected").val();
	if(menuSel != "" && menuSel != undefined) {
		$(".sidebar .nav>ul>li").each(function() {
			var liCls = $(this).attr("name");
			if(menuSel == liCls) {
				$(this).addClass("li-hover");
			}
		});
	}
});

function resetNumber() {
	$.ajax({
		type: "post",
		url: "<%=basePath%>messeagePublish/saveNumber.do",
		dataType: "json",
		async: false,
		data: {
			"number": 0
		}
	})
}

function changeClass(val, toUrl) {
	location.href = toUrl;
	/*$.ajax({
		type: 'POST',
		url: '<%=path%>/admin/changeSwitch.do',
		dataType: 'json',
		data: {
			'classStr': val
		},
		async: false, //默认为true 异步 
		success: function(obj) {
			location.href = toUrl;
		}
	});*/

}
/**
 * 今日报备跳转
 */
function goToPage() {

	var now = new Date();
	var myYear = now.getFullYear();
	var myMonth = now.getMonth() + 1;
	if(myMonth < 10) myMonth = "0" + myMonth;
	var myDay = now.getDate();
	if(myDay < 10) myDay = "0" + myDay;
	var ymd = "" + myYear + "-" + myMonth + "-" + myDay;
	var week = now.getDay();
	window.location.href = "<%=path %>/cg_duty/gotodutyDetail.action?dutyTime=" + ymd + "&week=" + week;
}

var alarmUrl = document.URL;
var alarmMap = new Map();
var alarmLen = alarmUrl.indexOf("initGridPatrol.action");
var playTimeout;
$(function(){ 
	console.log('全部警情',AlarmDeviceManager.alarmEventList);
	if($("#globalSeatNumber").val() == null 
			|| $("#globalSeatNumber").val() == undefined
			|| $("#globalSeatNumber").val() == ''){
		requestAlarmList();
		setInterval("requestAlarmList()",1000*30);//1000为1秒钟,设置为1分钟。  
	}

});

function requestAlarmList(){
    var type;
    if($("#jwldPanel").is(":hidden")){
        type = 1;   //如果元素为隐藏
    }else{
        type =2;    //如果元素为显现
    }
	$("#reslAlarmList").load("${pageContext.request.contextPath}/map/queryAlarmNew.do?type="+type+"&random="+Math.random(),function(s){
		s = s+"";
		if(s.indexOf("登录") > -1 && s.indexOf("LOGIN") > -1){ //session失效，自动跳转到登录界面  20171026
			window.location.reload();
		}
	});
}
function mediaPlayVoice(){
	var media = $('#chatAudio')[0];
	media.play();
	
//	playTimeout = setTimeout(function(){
//		media.pause();
//	},1000*10);
}
function mediaPlayStop(){
	clearTimeout(playTimeout);
}
//右下角弹出层箭头点击事件
function popupArrow(obj){
	var hs = $(obj).hasClass("xj-pl-arrow-up");
	var emp = $("#popupLayout .xj-pl-empty").length;
	if(emp>0){
		//return;//没有数据点击失效
	}
	if(hs){
		$(obj).removeClass("xj-pl-arrow-up");
		$("#popupLayout").animate({"bottom":"0"},'slow');
	}else{
		$(obj).addClass("xj-pl-arrow-up");
		$("#popupLayout").animate({"bottom":"-121px"},'slow');
	}
}
function popupShowArrow(){
	$("#popupId").removeClass("xj-pl-arrow-up");
	$("#popupLayout").animate({"bottom":"0"},'slow');
}
function popupHideArrow(){
	$("#popupId").addClass("xj-pl-arrow-up");
	$("#popupLayout").animate({"bottom":"-121px"},1000);
}
function updateAlarmStatus(alarmEventId) {
    //如果元素为隐藏
    $("#" + alarmEventId).removeClass("xj-pl-red");
    if($("#" + alarmEventId + "data").length>0){
        //如果元素为显现
        $("#" + alarmEventId + "data").removeClass("xj-pl-red");
    }
}
function linkAlarmDetail(eventId){
	if(alarmLen<=0){
		window.location.href='${pageContext.request.contextPath}/map/initGridPatrol.action?eventId='+eventId;
	}else{
	 	$.ajax({
			url:"${pageContext.request.contextPath}/map/queryAlarmEventById.do",
			type : "post",
			data : {
				eventId : eventId,
				random : Math.random()
			},
			dataType : "json",
			success : function(rsp) {
				if(rsp.code != 300){
					var obj = rsp.data;
					obj.eventId = eventId;
					obj.type = 110;
					//机构上图
					var userOrgPath = $.trim($("#useOrganPath").val());
			        var str =  userOrgPath.split("/");
			       	var orgCode = str[str.length -1];
					//回写状态
					if(obj.relationOrgans && obj.relationOrgans.length > 0){
						for(var i = 0;i<obj.relationOrgans.length;i++){
							var data = obj.relationOrgans[i];
							if(data.organCode == orgCode){
								obj.id = data.id;
								break;
							}
						}
					}
					AlarmDeviceManager.alarmGpsReport(obj,1);
					popupShowArrow();
					updateAlarmStatus(eventId);
				}else{
					kendo.message(rsp.description);
				}
			}
		});
	}
}
function setPopupLayoutStyle(){
	$("#popupLayout").css("width",200);
}