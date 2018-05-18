function moveToCurOrgan() {
	MapManager.setCenter({
		longitude: '87.70056995895571',
		latitude: '43.85509742460911'
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
		url: "http://127.0.0.1:8080/pcenter/messeagePublish/saveNumber.do",
		dataType: "json",
		async: false,
		data: {
			"number": 0
		}
	})
}

function changeClass(val, toUrl) {
	$.ajax({
		type: 'POST',
		url: '/pcenter/admin/changeSwitch.do',
		dataType: 'json',
		data: {
			'classStr': val
		},
		async: false, //默认为true 异步 
		success: function(obj) {
			location.href = toUrl;
		}
	});

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
	window.location.href = "/pcenter/cg_duty/gotodutyDetail.action?dutyTime=" + ymd + "&week=" + week;
}

var alarmUrl = document.URL;
var alarmMap = new Map();
var alarmLen = alarmUrl.indexOf("initGridPatrol.action");
var playTimeout;
$(function() {
	console.log('全部警情', AlarmDeviceManager.alarmEventList);
	if($("#globalSeatNumber").val() == null ||
		$("#globalSeatNumber").val() == undefined ||
		$("#globalSeatNumber").val() == '') {
		requestAlarmList();
		setInterval("requestAlarmList()", 1000 * 30); //1000为1秒钟,设置为1分钟。  
	}

});

function requestAlarmList() {
	var type;
	if($("#jwldPanel").is(":hidden")) {
		type = 1; //如果元素为隐藏
	} else {
		type = 2; //如果元素为显现
	}
	$("#reslAlarmList").load("/pcenter/map/queryAlarmNew.do?type=" + type + "&random=" + Math.random(), function(s) {
		s = s + "";
		if(s.indexOf("登录") > -1 && s.indexOf("LOGIN") > -1) { //session失效，自动跳转到登录界面  20171026
			window.location.reload();
		}
	});
}

function mediaPlayVoice() {
	var media = $('#chatAudio')[0];
	media.play();

	//	playTimeout = setTimeout(function(){
	//		media.pause();
	//	},1000*10);
}

function mediaPlayStop() {
	clearTimeout(playTimeout);
}
//右下角弹出层箭头点击事件
function popupArrow(obj) {
	var hs = $(obj).hasClass("xj-pl-arrow-up");
	var emp = $("#popupLayout .xj-pl-empty").length;
	if(emp > 0) {
		//return;//没有数据点击失效
	}
	if(hs) {
		$(obj).removeClass("xj-pl-arrow-up");
		$("#popupLayout").animate({
			"bottom": "0"
		}, 'slow');
	} else {
		$(obj).addClass("xj-pl-arrow-up");
		$("#popupLayout").animate({
			"bottom": "-121px"
		}, 'slow');
	}
}

function popupShowArrow() {
	$("#popupId").removeClass("xj-pl-arrow-up");
	$("#popupLayout").animate({
		"bottom": "0"
	}, 'slow');
}

function popupHideArrow() {
	$("#popupId").addClass("xj-pl-arrow-up");
	$("#popupLayout").animate({
		"bottom": "-121px"
	}, 1000);
}

function updateAlarmStatus(alarmEventId) {
	//如果元素为隐藏
	$("#" + alarmEventId).removeClass("xj-pl-red");
	if($("#" + alarmEventId + "data").length > 0) {
		//如果元素为显现
		$("#" + alarmEventId + "data").removeClass("xj-pl-red");
	}
}

function linkAlarmDetail(eventId) {
	if(alarmLen <= 0) {
		window.location.href = '/pcenter/map/initGridPatrol.action?eventId=' + eventId;
	} else {
		$.ajax({
			url: "/pcenter/map/queryAlarmEventById.do",
			type: "post",
			data: {
				eventId: eventId,
				random: Math.random()
			},
			dataType: "json",
			success: function(rsp) {
				if(rsp.code != 300) {
					var obj = rsp.data;
					obj.eventId = eventId;
					obj.type = 110;
					//机构上图
					var userOrgPath = $.trim($("#useOrganPath").val());
					var str = userOrgPath.split("/");
					var orgCode = str[str.length - 1];
					//回写状态
					if(obj.relationOrgans && obj.relationOrgans.length > 0) {
						for(var i = 0; i < obj.relationOrgans.length; i++) {
							var data = obj.relationOrgans[i];
							if(data.organCode == orgCode) {
								obj.id = data.id;
								break;
							}
						}
					}
					AlarmDeviceManager.alarmGpsReport(obj, 1);
					popupShowArrow();
					updateAlarmStatus(eventId);
				} else {
					kendo.message(rsp.description);
				}
			}
		});
	}
}

function setPopupLayoutStyle() {
	$("#popupLayout").css("width", 200);
}

var zNodes;
var json_data;
var currentText; //当前选中的文本
var treeview;
var expandeds = "";
var selectNode = "";
var barElement; //当前对象
var parentId;
var k = 0;
$(function() {
	if($("#searchOrganName").val() == "") {
		loadOrganTreeList();
	} else {
		queryOrgan();
	}
});

$("#searchOrganName").keydown(function(event) {
	if(event.keyCode == 13) {
		queryOrgan();
	}
});

function loadOrganTreeList() {
	var data = new kendo.data.HierarchicalDataSource({
		transport: {
			read: {
				url: basePath + "web/organx/lazyOrganList.do",
				type: "post",
				data: {
					searchName: $("#searchOrganName").val(),
					sessionId: $("#token").val(),
					random: Math.random()
				},
				dataType: "json"
			}
		},
		schema: {
			model: {
				hasChildren: "hasChild",
			}
		}
	});

	$("#treeview").remove();
	$("#box").append("<div id='treeview' class='insSearchCont mt4'></div>");
	$("#treeview").kendoTreeView({
		select: onSelect, //点击触发事件
		dataSource: data
	});
}

function test() {
	try {
		var expandedNodes = [],
			treeView = $("#treeview").data("kendoTreeView");
		getExpanded(treeView.dataSource.view(), expandedNodes);
		expandeds = expandedNodes.join(",");
	} catch(e) {}
}

function getExpanded(nodes, expandedNodes) {
	for(var i = 0; i < nodes.length; i++) {
		if(k == 0) {
			parentId = nodes[0].id;
			k = 1;
		}
		if(nodes[i].expanded) {
			expandedNodes.push(nodes[i].id);
		}
		if(nodes[i].hasChildren) {
			getExpanded(nodes[i].children.view(), expandedNodes);
		}
	}
} //查询通过name模糊查询
function queryOrgan() {
	if($("#searchOrganName").val() == "") {
		loadOrganTreeList();
		test();
	} else {
		$.ajax({
			url: basePath + "web/organx/searchOrganListByName.do",
			type: "post",
			data: {
				searchName: $("#searchOrganName").val(),
				expandeds: expandeds,
				sessionId: $("#token").val(),
				random: Math.random()
			},
			dataType: "json",
			success: function(rsp) {
				//json_data =JSON.stringify(rsp.data);
				json_data = rsp.data;
				searchOrgAction();
			}
		});
	}
}

function searchOrgAction() {
	var name = $.trim($('#searchOrganName').val());
	var a = findOrgs(name);
	$("#treeview").remove();
	$("#box").append("<div id='treeview' class='insSearchCont mt4'></div>");

	treeview = $("#treeview").kendoTreeView({
		select: onSelect,
		dataSource: a
	}).data("kendoTreeView");
}

function findOrgs(name) {
	var a = [];
	if(json_data != null) {
		$(json_data).each(function(index, value) {
			var o = findOrgTree(value, name);
			if(o != null) {
				a.push(o);
			}
		});
	}
	return a;
}

function findOrgTree(org, name) {
	var ls = [];
	if(org.items != null) {
		$(org.items).each(function(index, value) {
			var o = findOrgTree(value, name);
			if(o != null) {
				ls.push(o);
			}
		});
	}
	org.items = ls;
	if(name == "" || org.name.indexOf(name) >= 0 || ls.length > 0) {
		org.expanded = true;
		if($("#selectName").val() != "" &&
			$("#selectName").val() == org.name) {
			org.selected = true;
		}
		return org;
	} else if(name == "" || org.shortName.indexOf(name) >= 0 || ls.length > 0) {
		org.expanded = true;
		if($("#selectName").val() != "" &&
			$("#selectName").val() == org.shortName) {
			org.selected = true;
		}
		return org;
	} else {
		return null;
	}
}

//单击触发事件
function onSelect(e) {
	//选择节点事件
	var treeview = $('#treeview').data('kendoTreeView');
	//获取选中节点的数据
	var data = treeview.dataItem(e.node);
	//移出样式
	//$(barElement).removeClass("k-state-selected");
	$("#organId").val(data.id);
	$("#organPath").val(data.path);
	$("#orgCode").val(data.code);
	$(".ty-more-right >span").removeClass("ty-more-right-now");
	test();
	$("#expandeds").val(expandeds);
	$("#selectName").val(data.name);
	loadData(1);
	//如果有tab页面且id为 receivedMessage
	if($("#receivedMessage").length > 0) {
		var currentOrganId = $.trim($("#currentOrganId").val());
		if($("#organId").val() == currentOrganId) {
			loadReceivedData(1);
		} else {
			$("#receivedMessage").empty();
			$("#page2").empty();
		}
	}
}
// function that gathers IDs of checked nodes
function checkedNodeIds(nodes, checkedNodes) {
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].checked) {
			checkedNodes.push(nodes[i].id);
		}

		if(nodes[i].hasChildren) {
			checkedNodeIds(nodes[i].children.view(), checkedNodes);
		}
	}
}
// show checked node IDs on datasource change
function onCheck() {
	var checkedNodes = [],
		treeView = $("#treeview").data("kendoTreeView"),
		message;

	checkedNodeIds(treeView.dataSource.view(), checkedNodes);

	if(checkedNodes.length > 0) {
		message = "IDs of checked nodes: " + checkedNodes.join(",");
	} else {
		message = "No nodes checked.";
	}
	//alert(message);
}
var cf = true;

function arrowZoom() {
	//箭头点击收放效果
	if(cf) {
		$("#navigationLeft")
			.hide(
				'fast',
				function() {
					if($("#arrowXg1").length == 0) {
						$("#main-nav").append('<div class="temp"><div class="show" id="arrowXg1"></div></div>');
					}
					$("#arrowXg1").css({
						"position": "absolute",
						"top": 11,
						"left": 0
					}).bind("click", function() {
						$("#arrowXg1").parent().remove();
						$("#content").animate({
							"margin-left": "240px"
						}, 'slow', function() {
							$("#navigationLeft").show('fast');
						});
						cf = true;
					});
					$("#content").animate({
						"margin-left": "0"
					}, 'slow');
				});
		cf = false;
	}
}