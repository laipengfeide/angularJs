$(function() {
	setTimeout(function() {
		var eventId = $("#eventId").val();
		if (eventId) {
			// console.log("事件id：",eventId);
			AlarmDeviceManager.queryAlarmEventById(eventId);
		}
	}, 1000);
	$("#alarmVideo").hide();
	
});
var curAlarmEn = null;
var iTime = null;
var organTypeCode = $("#organTypeId").val();
var organCode = $("#orgCode").val();

var format = function(time, format) {
	var t = new Date(time);
	var tf = function(i) {
		return (i < 10 ? '0' : '') + i
	};
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
		switch (a) {
		case 'yyyy':
			return tf(t.getFullYear());
			break;
		case 'MM':
			return tf(t.getMonth() + 1);
			break;
		case 'mm':
			return tf(t.getMinutes());
			break;
		case 'dd':
			return tf(t.getDate());
			break;
		case 'HH':
			return tf(t.getHours());
			break;
		case 'ss':
			return tf(t.getSeconds());
			break;
		}
	})
}
// 图片轮播上一张，下一张，未写
function moveLeft() {

	// 总共点击多少次 点击一次95*n
	var n = Number($("#nextOne").val());
	var r = n + 1;
	var t = $("#width-left li").size();
	if (r > t) {
		r = t;
	} else {
		r = r;
	}
	$("#nextOne").val(r);
	var p = -r * 95 + "px";
	$(".cg-riph-main>ul").each(function(index) {
		$(this).css("left", p);
	});
}
function moveRight() {
	// 总共点击多少次 点击一次95*n
	var e = Number($("#nextOne").val());
	var f = e - 1;
	if (f > 0) {
		f = f
	} else {
		f = 0
	}
	$("#nextOne").val(f);
	var p = -f * 95 + "px";
	$(".cg-riph-main>ul").each(function(index) {
		$(this).css("left", p);
	});
}

function closeNotification() {
	// 产品经理确认 取消显示左下角信息提示框 （20170914）
	return;

	// console.log("点击关闭");
	$(".myAlert").parent().parent().hide();
	// $(".myAlert").parent().hide();
}

function closeRadar() {
	$(".radar").parent().parent().hide();
}

AlarmDeviceManager = {
	deviceInfo : [],
	alarmEventList : [],
	isShow : false,

	deleteAlarmPopupDiv : function() {
		if ($("#alarmPopupDiv")) {
			$("#alarmPopupDiv").remove();
		}
	},
	openAlarmPopupDiv : function(data) {
		AlarmDeviceManager.deleteAlarmPopupDiv();
		// 如果有弹屏，处理掉
		if (curAlarmEn) {
			var id = curAlarmEn.id;
			var type = curAlarmEn.type;
			var eventId = curAlarmEn.eventId;
			AlarmDeviceManager.handleAlarm(id, type, eventId);
		}
		// 弹窗
		AlarmDeviceManager.createAlarmPopupDiv(data);

	},
	createAlarmPopupDiv : function(data) {
		// 获取窗口宽度
		if (window.innerWidth)
			winWidth = window.innerWidth;
		else if ((document.body) && (document.body.clientWidth))
			winWidth = document.body.clientWidth;
		// 获取窗口高度
		if (window.innerHeight)
			winHeight = window.innerHeight;
		else if ((document.body) && (document.body.clientHeight))
			winHeight = document.body.clientHeight;
		var leftDiv = (winWidth - 240) / 2;
		var topDiv = (winHeight - 140) / 2;

		var phone = data.phone ? data.phone : "";
		var stringBum = data.seatNumber ? data.seatNumber : "";
		var seatNumber = null;
		if (stringBum.indexOf("-") > 0) {
			var index = stringBum.indexOf("-");
			seatNumber = stringBum.substring(index + 1, stringBum.length);
		} else {
			seatNumber = stringBum;
		}
		var positionTime = data.positionTime ? data.positionTime : "";

		var c = "";
		c += "<div id='alarmPopupDiv' style='width: 240px;height: 140px;left: "
				+ leftDiv
				+ "px;top: "
				+ topDiv
				+ "px;z-index: 9999;position: absolute;opacity:0.6;color: rgb(251, 248, 248);background-color: #FF0000;'>"
		c += "<div style='margin-left: 10px;margin-top: 10px;font-size: 18px;'>报警电话："
				+ phone + "</div>"
		c += "<div style='margin-left: 10px;margin-top: 10px;font-size: 18px;'>坐席号码："
				+ seatNumber + "</div>"
		c += "<div style='margin-left: 10px;margin-top: 10px;'>报警时间："
				+ positionTime + "</div>"
		c += "<div style='margin-left: 10px;margin-top: 10px;height: auto'><p id='progressDiv'style='white-space:nowrap; '>定位中......</p></div>"
		c += "</div>"
		$("#alarmPopup").append(c);
		progressDiv();
		// 取消定时执行
		if (iTime) {
			clearTimeout(iTime);
		}
		// 隔一分钟执行
		iTime = setTimeout(function() {
			AlarmDeviceManager.deleteAlarmPopupDiv()
		}, 60000);
	},
	/**
	 * 处理实时跳转过来报警业务
	 * 
	 * @param eventId
	 */
	queryAlarmEventById : function(eventId) {
		// 回写状态
		$.ajax({
			url : basePath + "map/queryAlarmEventById.do",
			type : "post",
			dataType : "json",
			data : {
				eventId : eventId
			},
			success : function(msg) {
				var obj = msg.data;
				obj.eventId = eventId;
				// console.log("实时查询状态:",msg);
				// 机构上图
				var userOrgPath = $.trim($("#useOrganPath").val());
				var str = userOrgPath.split("/");
				var orgCode = str[str.length - 1];
				// 回写状态
				if (obj.relationOrgans && obj.relationOrgans.length > 0) {
					for (var i = 0; i < obj.relationOrgans.length; i++) {
						var data = obj.relationOrgans[i];
						if (data.organCode == orgCode) {
							obj.id = data.id;
							break;
						}
					}
				}
				AlarmDeviceManager.alarmGpsReport(msg.data, 1);
			}
		});
	},
	EventResource : {},
	/**
	 * 一键报警业务处理 播放视频;声音提示;警务站图标变化
	 * 
	 * @param obj
	 * @param type
	 *            1实时报警;2历史报警
	 */
	alarmGpsReport : function(obj, type) {
		// 增加关闭弹窗
		AlarmDeviceManager.deleteAlarmPopupDiv();
		if (!obj.layerName) {
			obj.layerName = layerName.markerLayer;
		}
		if (!obj.type) {
			obj.type = 110;
		}
		var alaTime = format(obj.alarmTime, "yyyy-MM-dd HH:mm:ss");
		// closeDiv(1,1)参数无意义
		try {
			video_stop_all();
		} catch (e) {
		}
		if (type == 1) {
			// 地图视频播放
			var oArray =[];
			var sArray = [];
			if (obj.gbDevices && obj.gbDevices.length > 0) {
                //sewiseManager.streamVideo('streamBox',obj.gbDevices);
				$.each(obj.gbDevices, function() {
					// this.naming = 'YGNC000416NPKGF';
					//|| (this.naming && this.naming.length < 31
                     if(this.camType && this.camType == 2){
                    	sArray.push(this);
                     }else{
                    	oArray.push(this);
					 }
				});

				if(sArray !=null && sArray.length > 0){
					try{
                        sewiseManager.streamVideo('streamBox',sArray);
					}catch(e){
						console.log(e);
					}

				}
                if(oArray !=null && oArray.length > 0){
                    $.each(obj.gbDevices, function() {
                        ListManager.playVideoForMap({
                            name : this.name,
                            naming : this.naming,
                            naming1 : this.naming1
                        });
                        // 绑定naming与事件id关系
                        AlarmDeviceManager.EventResource[this.naming] = obj.id;
					})
                }
			}

			// 声音提示
			var media = $('#chatAudio')[0];
			media.play();
		}
		// 产品经理确认 取消显示左下角信息提示框 （20170914）
		/*
		 * var popupNotification = $("#popUpMesseage").kendoNotification({
		 * autoHideAfter:0, hideOnClick: false, position: { pinned: true, top:
		 * null, left: 0, bottom: 0, right: null }, width: 258, height:180,
		 * stacking: "down", templates: [{ // define a template for the custom
		 * "timeAlert" notification type type: "messageNotification", template: "<div
		 * class='myAlert' id='alarmMessageInfo'><span
		 * class='device-lowerLeft-title' title='#=messeageTitle
		 * #'>#=messeageTitle #</span>" + "<span class='cg-i-close
		 * cg-pop-close' style='float:right;margin-right:5px;margin:-4px 0 0 0'
		 * onclick='closeNotification()'>×</span><br><hr>"+
		 * "&nbsp;&nbsp;&nbsp;&nbsp;时间: #=alarmTime # <br><hr> " + "<i
		 * class='xj-lbd-icon xj-gps-red'><img
		 * src='#=basePath#Skin/cg/images/alarm/lb_bd.png'></i>" + "地址:
		 * #=address # <br><hr> " + "<i class='xj-lbd-icon xj-gps-red'><img
		 * src='#=basePath#Skin/cg/images/alarm/contacts.png'></i>" + "联系人:
		 * #=contacts# <br><hr> " + "<i class='xj-lbd-icon xj-gps-red'><img
		 * src='#=basePath#Skin/cg/images/alarm/lb_sp.png'></i>" +
		 * "设备编号:#=contactNumber# <br><hr>" + "<div>" + //暂时未添加功能 '<div
		 * id="imagesPanel" class="xj-left-tab" style="width:450px;height:
		 * 90px;position:relative;">'+ '<div class="xj-left-panel"
		 * style="width:450px;">'+ '<div class="fl xj-left-box">'+ '<div
		 * class="cg-ri-photo" style="height:60px;">'+ '<div
		 * class="cg-riph-left" onclick="moveLeft()" style="height:60px;">'+ '<i
		 * style="margin-top:25px;"></i>'+ '</div>'+ '<input type="hidden"
		 * value="0" id="nextOne"/>'+ '<div class="cg-riph-main" id="cgPhoto"
		 * style="height:60px;width: 405px;">'+ '<ul style="height:60px;" id="width-left">'+ '<li style="width:95px;height:60px;"><img
		 * style="width:80px;height:60px;" class="cursor"
		 * src="#=basePath#Skin/cg/images/temp/p1.jpg"
		 * onclick="alarmImgShow(this)"></li>'+ '<li style="width:95px;height:60px;"><img
		 * style="width:80px;height:60px;" class="cursor"
		 * src="#=basePath#Skin/cg/images/temp/p1.jpg"
		 * onclick="alarmImgShow(this)"></li>'+ '</ul>'+ '</div>'+ '<div
		 * class="cg-riph-right" onclick="moveRight()" style="height:60px;">'+ '<i
		 * style="margin-top:25px;"></i>'+ '</div>'+ '</div>'+ '</div>'+ '</div>'+ '<input
		 * id="fileSize" type="hidden" style="width:100px;height:50px;">'+ '<div
		 * id="alarmImgShow" class="xj-left-panel-show hidden">'+ '<img
		 * class="cursor" src="#=basePath#/Skin/cg/images/temp/p1.jpg"
		 * onclick="alarmImgClose(this)">'+ '</div>'+ '</div>'+ "</div>" + "</div>" }]
		 * }).data("kendoNotification");
		 */
		var radar = $("#popIntercomList").data("kendoNotification");
		if (!radar) {
			radar = $("#popIntercomList")
					.kendoNotification(
							{
								autoHideAfter : 0,
								hideOnClick : false,
								position : {
									pinned : true,
									top : 120,
									left : 20,
									bottom : null,
									right : null
								},
								width : 373,
								height : 331,
								stacking : "down",
								templates : [ {
									// define a template for the custom
									// "timeAlert" notification type
									type : "messageNotification",
									template : "<div class='radar'>"
											+ "<span class='cg-i-close cg-pop-close' style='float:right;margin-right:5px;margin:-4px 0 0 0' onclick='closeRadar()'>×</span>"
											+ "<img style='width: 373px;height: 320px' src='#=basePath#/images/images/radar.gif'></div>"
								} ]
							}).data("kendoNotification");
		}
		// 机构上图
		var userOrgPath = $.trim($("#useOrganPath").val());
		var str = userOrgPath.split("/");
		var orgCode = str[str.length - 1];

		// 回写状态
		if (obj.relationOrgans && obj.relationOrgans.length > 0) {
			for (var i = 0; i < obj.relationOrgans.length; i++) {
				var data = obj.relationOrgans[i];
				if (data.organCode == orgCode) {
					obj.eventId = data.eventId;
					break;
				}
			}
		}
		// 取消查询数据库的操作，信息都从mq推送过来 20170917
		/*
		 * var log = AlarmDeviceManager.hasVideoPlay(obj.eventId); if(log &&
		 * log.data){ obj.jsonContent = log.data.jsonContent; obj.gbDevices =
		 * log.data.gbDevices if(!obj.relationOrgans)
		 * obj.relationOrgans=log.data.relationOrgans; }
		 */
		AlarmDeviceManager.chartAlarmHigh(obj);
		/**鉴于市平台警务站type是33 区平台是32 */
		if (organTypeCode==33 || organTypeCode==32) {
		 if (obj.deviceType==6  && FG_alarm_video==true) {
		 		try {
					AlarmDeviceManager.getGpsByCode(organCode);		
					} catch (e) {}
			}
		}
		// 如果有视频就显示播放视频图标，没有就隐藏
		// var objId = obj.eventId?obj.eventId:obj.id;
		/*
		 * popupNotification.show({ messeageTitle:obj.content,
		 * alarmTime:alaTime, address:obj.address,//报警地址 contacts:"",//联系人
		 * contactNumber:obj.number, }, "messageNotification");
		 */
		if (obj.deviceType == 4) {
			closeRadar();
			radar.show({}, "messageNotification");
			$('.radar').parent().parent().css("top", '120px').css('left',
					'20px');
		} else {
			closeRadar();
		}
	},immediatelyFeedback :function(eventId,type,id){
        AlarmDeviceManager.handleAlarm(id,type,eventId);
        window.open(basePath+"historyAlarmEvent/gotoKeyVehicles.action?eventId="+eventId+"&falarmType="+type+"&falarmRelationId="+id);
	},
	// 点击处理警情修改状态
	handleAlarm : function(id, type, eventId) {
		var content = $('#remarks').val();
		if (content && content.length > 200) {
			kendo.message("备注不能超过200个字符");
			return;
		}
		var tempList = AlarmDeviceManager.alarmEventList;
		for (var i = 0; i < tempList.length; i++) {
			if (tempList[i].id == id) {
				AlarmDeviceManager.alarmEventList.splice(i, 1);
			}
		}
		if (AlarmDeviceManager.alarmEventList.length == 0) {
			$('#chatAudio')[0].pause();
		}
		closeRadar();
		AlarmDeviceManager.removeInterCom(eventId);

		if (content && content.length <= 200) {
			$.ajax({
				url : basePath + "/alarmEvent/operation/add.do",
				type : "post",
				dataType : "json",
				data : {
					content : content,
					eventId : eventId,
					handleType : 0
				},
				success : function(msg) {
				}
			});
		}
		// 清楚界面上图警情图标，及警情弹窗，并恢复高亮机构 （20170918业务未动，只是移动代码位置）
		var en = {
			id : id,
			type : type,
			layerName : layerName.markerLayer
		}
		// 移除图标
		MapManager.clearMarkerByIdType(en);
		// 清除缓存的curAlarmEn
		if (curAlarmEn) {
			curAlarmEn = null;
		}

		MapManager.closeInfoWindow();
		// 恢复高亮机构
		var highEnty = AlarmDeviceManager.AlarmHighEntity["hight"];
		if (highEnty && highEnty != null) {
			AlarmDeviceManager.orgChartLast(highEnty);
		}

		// 修改状态
		$.ajax({
			url : basePath + "/map/updateReceiveState.do",
			type : "post",
			dataType : "json",
			data : {
				relationOrganId : id
			},
			success : function(msg) {
				if (msg.code == 200) {
					// 恢复高亮视频点位
					// var gbHighEnty = ResourceDatas.GBHight["hight"];
					// if(gbHighEnty && gbHighEnty != null){
					// AlarmDeviceManager.gbIterator(gbHighEnty,false);
					// }

					if (typeof updateHistoryStatus === "function") {
						updateHistoryStatus(eventId);
					}
					// 关闭报警左下角消息框
					closeNotification();
					popupShowArrow();
					updateAlarmStatus(id);
					//左下角警情数量处理
                    alarmAndNoReceiveCount.countNumber=alarmAndNoReceiveCount.countNumber-1;
                    $("span.xj-hint-box").text("未处理警情("+alarmAndNoReceiveCount.countNumber+")");
                    if(alarmAndNoReceiveCount.countNumber>99){
                        $("#count-number").text("99+");
                        if($("#maxCountNumber").length>0){
                            $("#maxCountNumber").text("99+");
                        }
					}else{
                        $("#count-number").countTo({"to":alarmAndNoReceiveCount.countNumber});

                        if($("#maxCountNumber").length>0){
                            $("#maxCountNumber").countTo({"to":alarmAndNoReceiveCount.countNumber});
                        }
					}
					// 恢复到默认层级
					MapManager.zoomTo(MapManager.getMapZoom());
				}
			}
		});

	},
	handleAllAlarm : function(id, type, eventId) {
		var orgCode = $("#orgCode").val();
		kendo
				.confirm(
						"是否确认全部警情？",
						{
							ok : {
								text : "&nbsp&nbsp确定&nbsp&nbsp",
								callback : function(e) {
									$
											.ajax({
												url : basePath
														+ "/map/updateReceiveAllState.do",
												type : "get",
												dataType : "json",
												data : {
													organCode : orgCode
												},
												success : function(msg) {
													if (msg.code == 200) {
														var tempList = AlarmDeviceManager.alarmEventList;
														for (var i = 0; i < tempList.length; i++) {

															AlarmDeviceManager.alarmEventList
																	.splice(i);

														}
														if (AlarmDeviceManager.alarmEventList.length == 0) {
															$('#chatAudio')[0]
																	.pause();
														}
														var list = msg.data;
														for (var i = 0; i < list.length; i++) {
															var alarmList = list[i];

															closeRadar();
															try {
																AlarmDeviceManager
																		.removeInterCom(alarmList.eventId);
															} catch (e) {

															}

															if (typeof updateHistoryStatus === "function") {
																updateHistoryStatus(alarmList.eventId);
															}
															// 关闭报警左下角消息框
															closeNotification();
															popupShowArrow();
															updateAlarmStatus(alarmList.id);
														}
														var en = {
															type : 110,
															layerName : layerName.markerLayer
														}

														try {
															MapManager
																	.clearMarkerByType(en)
															MapManager
																	.closeInfoWindow();
														} catch (e) {

														}

														// 恢复高亮机构
														var highEnty = AlarmDeviceManager.AlarmHighEntity["hight"];
														if (highEnty
																&& highEnty != null) {
															AlarmDeviceManager
																	.orgChartLast(highEnty);
														}
														// 恢复高亮视频点位
														// var gbHighEnty =
														// ResourceDatas.GBHight["hight"];
														// if(gbHighEnty &&
														// gbHighEnty != null){
														// AlarmDeviceManager.gbIterator(gbHighEnty,false);
														// }

														kendo
																.message(msg.description);
													}
												}
											});

									e.close();
									e.destroy();

								}
							}
						});

	},
	closeDetailInfo : function() {
		$('.alarmEventTitle').parent().parent().parent().remove();
	},
	closeVideoInfo : function(obj) {
	//	this.parent().$('.videoAlarm').remove();
		$(obj).parent().hide();
	},
	saveOnlyRemarks : function(eventId) {

		var content = $("#onlyRemarks").val();
		if (content == "") {
			kendo.message("备注内容不能为空");
			return;
		}
		if (content.length > 200) {
			kendo.message("备注内容不能超过200个字符");
			return;
		}

		$.ajax({
			url : basePath + "/alarmEvent/operation/add.do",
			type : "post",
			dataType : "json",
			data : {
				content : content,
				eventId : eventId,
				handleType : 1
			},
			success : function(msg) {
				AlarmDeviceManager.detailInfo(eventId);

			}
		});
	},
	saveRemarks : function(id, type, eventId) {
		if (AlarmDeviceManager.alarmEventList.length == 0) {
			$('#chatAudio')[0].pause();
		}
		closeRadar();
		var content = $('#remarks').val();
		if (content == null || content == '') {
			closeNotification();
			MapManager.closeInfoWindow();
			var en = {
				id : id,
				type : type,
				layerName : layerName.markerLayer
			}
			// 移除图标
			if (id != eventId) {
				MapManager.clearMarkerByIdType(en);
			}
			// 恢复高亮机构
			var highEnty = AlarmDeviceManager.AlarmHighEntity["hight"];
			if (highEnty && highEnty != null) {
				AlarmDeviceManager.orgChartLast(highEnty);
			}
			// 恢复高亮视频点位
			// var gbHighEnty = ResourceDatas.GBHight["hight"];
			// if(gbHighEnty && gbHighEnty != null){
			// AlarmDeviceManager.gbIterator(gbHighEnty,false);
			// }
			// 恢复到默认层级
			MapManager.zoomTo(MapManager.getMapZoom());
			return;
		}
		if (content.length > 200) {
			kendo.message("备注内容不能超过200个字符");
			return;
		}

		$.ajax({
			url : basePath + "/alarmEvent/operation/add.do",
			type : "post",
			dataType : "json",
			data : {
				content : content,
				eventId : eventId,
				handleType : 1
			},
			success : function(msg) {
				var en = {
					id : id,
					type : type,
					layerName : layerName.markerLayer
				}
				// 移除图标
				if (id != eventId) {
					MapManager.clearMarkerByIdType(en);
				}
				MapManager.closeInfoWindow();
				if (typeof updateHistoryStatus === "function") {
					updateHistoryStatus(eventId);
				}
				// 关闭报警左下角消息框
				closeNotification();
				popupShowArrow();
				updateAlarmStatus(id);

				// 恢复到默认层级
				MapManager.zoomTo(MapManager.getMapZoom());
			}
		});
	},
	detailInfo : function(eventId) {
		$
				.ajax({
					url : basePath + "alarmEvent/operation/page/list.do",
					type : "post",
					dataType : "json",
					data : {
						pageStart : 0,
						pageSize : 100,
						eventId : eventId
					},
					success : function(msg) {
						$('.alarmEventTitle').parent().parent().remove();
						var eventId = msg.code;

						var html = "<div class='detail-container' style='height: 250px;overflow-y:overlay'>";
						if (msg.description.length > 10) {
							html += "<div class='alarmEventTitle field-left'><span title='"
									+ msg.description
									+ "'>"
									+ msg.description.substr(0, 10)
									+ "...</span><span class='cg-i-close cg-pop-close' style='float:right;margin-right:0;margin-top:0' onclick='AlarmDeviceManager.closeDetailInfo()'>×</span></div>";
						} else {
							html += "<div class='alarmEventTitle field-left'><span title='"
									+ msg.description
									+ "'>"
									+ msg.description
									+ "</span><span class='cg-i-close cg-pop-close' style='float:right;margin-right:25px;' onclick='AlarmDeviceManager.closeDetailInfo()'>×</span></div>";
						}
						html += "<div style='height: 220px;overflow-y:overlay'><div>&nbsp;&nbsp;<span><textarea id='onlyRemarks'></textarea></span><span><button class='alarm-button2' style='margin-right:45px;margin-top:18px;' onclick='AlarmDeviceManager.saveOnlyRemarks("
								+ eventId + ")'>保存</button></span></div>"
						if (msg.data.length) {
							$
									.each(
											msg.data,
											function(index, v) {
												html += "<div class='detail-item'>";
												html += "<span class='item-field-time field-left' style='width: 220px;margin-left: 10px'>处理时间:"
														+ v.operateTime
														+ "</span>";
												html += "<span class='item-field' style='width: 100px'>处理人:"
														+ v.loginName
														+ "</span>";
												if (v.content.length > 20) {
													html += "<span class='item-field field-content' title='"
															+ v.content
															+ "' style='width: 330px;margin-left: 10px'>内容:"
															+ v.content.substr(
																	0, 20)
															+ "...</span>";
												} else {
													html += "<span class='item-field field-content' title='"
															+ v.content
															+ "' style='width: 330px;margin-left: 10px'>内容:"
															+ v.content
															+ "</span>";
												}
												html += "</div>";
											});
						}
						// html+="<div
						// class='detail-bottom'><span>总记录数:</span>"+msg.totalRows;
						html += "</div></div></div>";
						var detailInfo = $("#detailInfo").kendoNotification({
							autoHideAfter : 0,
							hideOnClick : false,
							position : {
								pinned : true,
								top : 70,
								left : 350,
								bottom : null,
								right : null
							},
							width : 340,
							height : 250,
							stacking : "down",
							templates : [ {
								// define a template for the custom "timeAlert"
								// notification type
								type : "messageNotification",
								template : "#=html #"
							} ]
						}).data("kendoNotification");
						detailInfo.show({
							html : html
						}, "messageNotification");
					}
				});
	},

	hasVideoPlay : function(eventId) {
		var result = {};
		$
				.ajax({
					url : basePath + "/map/queryAlarmEventById.do",
					type : "post",
					data : {
						eventId : eventId,
						random : Math.random()
					},
					dataType : "json",
					async : false,
					success : function(rsp) {
						result = rsp;
						if (rsp.code != 300) {
							if (rsp.data.gbDevices == ""
									|| rsp.data.gbDevices == null) {
								// $("#videoPlaybackBtn").hide();
							} else {
								var obj = rsp.data;
								if (obj.gbDevices && obj.gbDevices.length > 0) {
									$
											.each(
													obj.gbDevices,
													function() {
														ListManager
																.playVideoForMap({
																	name : this.name,
																	naming : this.naming,
																	naming1 : this.naming1
																});
														// 绑定naming与事件id关系
														AlarmDeviceManager.EventResource[this.naming] = obj.id;
													});
								}
							}
						}
					}
				});
		return result;
	},
	// 播放视频
	videoPlayback : function(eventId) {
		// alert(eventId)
		$.ajax({
					url : basePath + "/map/queryAlarmEventById.do",
					type : "post",
					data : {
						eventId : eventId,
						random : Math.random()
					},
					dataType : "json",
					success : function(rsp) {
						if (rsp.code != 300) {
                            var oArray =[];
                            var sArray = [];
							// 播放视频
							var obj = rsp.data;
							if (obj.gbDevices && obj.gbDevices.length > 0) {
                                $.each(obj.gbDevices, function() {
                                    if(this.camType && this.camType == 2){
                                        sArray.push(this);
                                    }else{
                                        oArray.push(this);
                                    }
                                });

                                if(sArray !=null && sArray.length > 0){
                                    try{
                                        sewiseManager.streamVideo('streamBox',sArray);
                                    }catch(e){
                                        console.log(e);
                                    }

                                }
                                if(oArray !=null && oArray.length > 0){
                                    $.each(obj.gbDevices, function() {
                                        ListManager.playVideoForMap({
                                            name : this.name,
                                            naming : this.naming,
                                            naming1 : this.naming1
                                        });
                                        // 绑定naming与事件id关系
                                        AlarmDeviceManager.EventResource[this.naming] = obj.id;
                                    })
                                }


								// $.each(obj.gbDevices,function() {
								// 	ListManager.playVideoForMap({
								// 		name : this.name,
								// 		naming : this.naming,
								// 		naming1 : this.naming1
								// 	});
								// 	// 绑定naming与事件id关系
								// 	AlarmDeviceManager.EventResource[this.naming] = obj.id;
								// });
							}
						} else {
							kendo.message(rsp.description);
						}
					}
				});
	},
	// 修改成点击处理按钮修改状态
	changeEventStatus : function(eventId) {
		// 回写状态
		$.ajax({
			url : basePath + "/map/updateReceiveState.do",
			type : "post",
			dataType : "json",
			data : {
				relationOrganId : eventId
			},
			success : function(msg) {
				setTimeout(function() {
					$("#alarmlistId").load(
							basePath + "map/queryAlarmNew.do?random="
									+ Math.random(), function() {
								updateAlarmStatus(eventId);
							});
				}, 1000);
				// 更新实时列表
				if (typeof updateHistoryStatus === "function") {
					updateHistoryStatus(eventId);
				}
			}
		});
	},
	/**
	 * 报警设备上图
	 * 
	 * @param obj
	 */
	chartAlarmMarker : function(obj) {
		if (!obj)
			return;
		var alaTime = format(obj.alarmTime, "yyyy-MM-dd HH:mm:ss")
		var en = {
			id : obj.id,
			longitude : obj.lon ? obj.lon : obj.longitude,
			latitude : obj.lat ? obj.lat : obj.latitude,
			type : 110,
			eventId : obj.eventId,
			deviceType : obj.deviceType,
			readStatus : obj.readStatus,
			policeStation : obj.expandColumn2 ? obj.expandColumn2
					: obj.policeStation,
			iconUrl : MapHandler.getImgUrl(100),
			layerName : layerName.markerLayer,
			zoom : mapMaxZoomToLevel,
			alarmTime : alaTime,
			content : obj.content,
			address : obj.address,// 报警地址
			number : obj.number,
			organCode : obj.organCode,
			gbDevices : obj.gbDevices
		};
		en.detailInfo = {
			name : obj.content,
			number : obj.number,
			policeStation : obj.expandColumn2 ? obj.expandColumn2
					: obj.policeStation,
			content : obj.content,
			address : obj.address,
			alarmTime : alaTime
		};
		// 添加点击事件
		en.action = "click";
		en.callback = AlarmDeviceManager.alarmGpsReport;

		// 恢复到默认层级
		MapManager.zoomTo(MapManager.getMapZoom());
		MapManager.setCenter(en);
		// 把当前的大图标警情换成小图标
		// 移除当前的对象，把之前的警情创建小图标
		var newObj = null;
		var newEn = null;
		newObj = MapManager.clearMarkerByIdType(en);
		if (curAlarmEn) {
			newObj = MapManager.clearMarkerByIdType(curAlarmEn);
			if (newObj && curAlarmEn.id != en.id) {
				newEn = newObj.attributes.entity;
				// alert(newEn.id)
				newEn.width = 25;
				newEn.height = 28;
				MapManager.createMarker(newEn);
			}
		}

		en.width = 45;
		en.height = 50;
		en.isTop = true;
		// 封装弹出信息实体
		var enT = new MapEntity(en);
		enT.width = null;
		enT.height = null;
		enT.type = 110;
		enT.eventId = obj.eventId;
		enT.deviceType = obj.deviceType;
		enT.readStatus = obj.readStatus;
		enT.gbDevices = obj.gbDevices;
		enT.imageUrl = obj.imgUrls;
		var jsonContent = "";
		if (obj.jsonContent && obj.jsonContent != "") {
			if (typeof obj.jsonContent == "string") {
				try {
					jsonContent = JSON.parse(obj.jsonContent);
				} catch (e) {
				}
			} else {
				jsonContent = obj.jsonContent;
			}
		}
		en.jsonContent = enT.jsonContent = jsonContent; // 赋值
		enT.detailInfo = {
			name : enT.content,
			number : obj.number,
			content : obj.content,
			policeStation : obj.expandColumn2 ? obj.expandColumn2
					: obj.policeStation,
			address : obj.address,
			alarmTime : alaTime
		};
		MapManager.createMarker(en);
		enT.showType = 'Marker';// 指定弹窗类型
		// 弹出信息框
		MapToobar.openInfoWindow(enT);

		curAlarmEn = en;
	},
	/**
	 * 警务站上图
	 * 
	 * @param obj
	 * @param isHigh
	 */
	chartOrgEntity : function(obj, isHigh, isChart) {
		obj.code = obj.organCode;
		var en = {
			latitude : obj.y,
			longitude : obj.x,
			id : obj.code,
			type : 5.1,
			name : obj.name,
			layerName : layerName.vectorSJLayer,
			detailInfo : obj,
			action : "click",
			callback : MapToobar.openInfoWindow
		};
		if (isHigh) {
			en.iconUrl = MapHandler.getImgUrl(5.11);
			if (obj.iconUrlHigh && obj.iconUrlHigh != "0.0") {
				en.iconUrl = basePath + "uploadFile" + obj.iconUrlHigh;
			}
		} else {
			en.iconUrl = MapHandler.getImgUrl(5.1);
			if (obj.iconUrl && obj.iconUrl != "0.0") {
				en.iconUrl = basePath + "uploadFile" + obj.iconUrl;
			}
		}
		MapManager.clearResourceChartByIdType(en);
		if (isChart) {
			MapManager.doResourceChart(en);
		}
	},
	/**
	 * 
	 * @param obj
	 * @param isHigh
	 *            是否高亮
	 */
	chartGBEntity : function(obj, isHigh) {
		var id = obj.naming.substring(0, obj.naming.indexOf(':'));
		var en = {
			latitude : obj.y,
			longitude : obj.x,
			id : id,
			type : 1,
			name : obj.name,
			layerName : layerName.vectorGBLayer,
			detailInfo : obj,
			isShare : obj.share,
			action : "click",
			callback : MapToobar.openInfoWindow
		};
		var feature = MapManager.clearResourceChartByIdType(en);
		if (!feature)
			return;
		en = feature.attributes.entity;
		if (isHigh) {
			en.iconUrl = MapHandler.getImgUrl(1.11);
			// 天网点位利用聚合上图,只需要指定选中的设备即可
			// ResourceDatas.GBSelected[en.id] = en.id;
		} else {
			en.iconUrl = MapHandler.getImgUrl(1.1);
			if (en.isShare) {// 是否重点标志
				en.iconUrl = MapHandler.getImgUrl(1.12);
			}
			// delete ResourceDatas.GBSelected[en.id];
		}
		MapManager.doResourceChart(en);

	},
	AlarmHighEntity : {},
	getGpsByCode : function(organCode) {
		$.ajax({
					url : basePath + "/web/organx/getGpsByCode.do",
					type : "post",
					dataType : "json",
					data : {
						organCode : organCode,
						gpsType : 6,
						r : Math.random()
					},
					success : function(msg) {

						var info = msg.data;
						var fg = "FGlaw_enforcement"+organCode;
						var data = info[fg];
						var url = info.url;
						if (data && data.length > 0) {
							if (data[0].standardId != null
									&& data[0].standardId != "") {
								AlarmDeviceManager.showVideo(data,url);
							}
						}

					}
				});
	},

	showVideo : function(data,url) {

		if (data && data.length > 0) {
			var html = "";
			var number = "";
			
			for (var i = 0; i < data.length; i++) {
			
				var gpsInfo = data[i];
				if (i > 3) {
					break;
				}
				//number = (parseInt((Math.random()*9)+1)+"")+((parseInt(Math.random()*900000000+1000000000)+"").substring(1,10));
				number =parseInt(Math.random()*9+1)*100000000;
				html += "<div class='videoAlarm'><iframe frameborder='0' marginwidth='0' marginheight='0' class='alarmV' scrolling='no' id='"
						+ i
						+ "' src='"+url+"?msId="
						+ gpsInfo.gpsDeviceNumber
						+ "&roomId="
						+ number
						+ "&ccId=" +gpsInfo.standardId + "'></iframe><span class='vedio-i-close cg-pop-close' id='closeX' style='float:right;margin-right:25px;' onclick='AlarmDeviceManager.closeVideoInfo(this)'>×</span></div>";
					
			     

			}
			var width="";
			if (data.length>=4) {
				width= 4*200;
				
			}else{
				width= data.length*200;
				
			} 
			var lfet = -(width/2);
		    $("#alarmVideo").css({"margin-left":lfet+"px"});
		    
			$("#alarmVideo").show();
			$("#alarmVideo").html(html);
			setTimeout("$('.vedio-i-close').css({'display':'block'})",3000);
			
		}
	},
	

	/**
	 * 报警设备,警务站/天网 高亮上图
	 * 
	 * @param enty
	 * @param callback
	 *            改变状态函数
	 */
	chartAlarmHigh : function(enty, callback) {
		// 视频高亮上图
		// var gbHighEnty = ResourceDatas.GBHight["hight"];
		// if(gbHighEnty && gbHighEnty != null){
		// AlarmDeviceManager.gbIterator(gbHighEnty,false);
		// }
		// AlarmDeviceManager.gbIterator(enty,true);
		// ResourceDatas.GBHight["hight"] = enty;

		// marker上图
		AlarmDeviceManager.chartAlarmMarker(enty);

		// 机构上图
		var userOrgPath = $.trim($("#useOrganPath").val());
		var str = userOrgPath.split("/");
		var orgCode = str[str.length - 1];
		// 自己的测试
		var isSelfLogin = false;
		if (orgCode == enty.organCode) { // 代表当前警务站登录
			isSelfLogin = true;
		}
		var highEnty = AlarmDeviceManager.AlarmHighEntity["hight"];
		if (highEnty && highEnty != null) {
			AlarmDeviceManager.orgChartLast(highEnty);
		}
		AlarmDeviceManager.orgIterator(enty, true, isSelfLogin);
		AlarmDeviceManager.AlarmHighEntity["hight"] = enty;

		// 回写状态
		if (enty.relationOrgans && enty.relationOrgans.length > 0) {
			for (var i = 0; i < enty.relationOrgans.length; i++) {
				var data = enty.relationOrgans[i];
				if (data.organCode == orgCode && callback
						&& typeof callback === "function") {
					callback(data.id);
				}
			}
		}
	},
	/**
	 * 对讲设备上图
	 * 
	 * @param deviceList
	 * 
	 */
	intercomReport : function(deviceList) {
		$.each(deviceList, function(index, v) {
			var en = {
				longitude : v.lng,
				id : v.code,
				type : 10001,
				latitude : v.lat,
				isWork : true,
				layerName : layerName.partMarkerLayer
			};
			en.iconUrl = en.iconUrl ? en.iconUrl : MapHandler
					.getImgUrl(en.type);
			MapManager.createFeature(en);
		})
	},
	/**
	 * 去掉上图对讲设备
	 * 
	 * @param eventId
	 *            报警事件id
	 */
	removeInterCom : function(eventId) {
		$("interComDiv" + eventId).hide();
		var en = {
			layerName : "partMarkerLayer",
			id : eventId
		};
		MapManager.clearOverlayById(en);
		$.each(AlarmDeviceManager.deviceInfo, function(index, item) {
			if (item.alarmEvent.id == eventId) {
				$.each(item.deviceList, function(index2, v) {
					MapManager.clearOverlayById({
						layerName : "partMarkerLayer",
						id : v.code
					});
				})
			}
		})
	},
	/**
	 * 取消警务站上图
	 * 
	 * @param obj
	 */
	orgChartLast : function(obj) {
		var userOrgPath = $.trim($("#useOrganPath").val());
		var str = userOrgPath.split("/");
		var orgCode = str[str.length - 1];
		var isSelfLogin = false;
		if (obj.organCode == orgCode) {// 当前警务站
			isSelfLogin = true;
		}
		if (obj.relationOrgans && obj.relationOrgans.length > 0) {
			for (var i = 0; i < obj.relationOrgans.length; i++) {
				var data = obj.relationOrgans[i];
				// obj.organCode 发生报警的警务站
				// orgCode 用户登录警务站
				if (!isSelfLogin) {
					if (data.self) {
						// 判断是否存在当前机构资源中
						var resData = ResourceDatas.datas[5.1].data[data.organCode];
						if (resData) {
							AlarmDeviceManager
									.chartOrgEntity(data, false, true);
						} else {
							AlarmDeviceManager.chartOrgEntity(data, false,
									false);
						}
					}
				} else {
					// 判断是否存在当前机构资源中
					var resData = ResourceDatas.datas[5.1].data[data.organCode];
					if (resData) {
						AlarmDeviceManager.chartOrgEntity(data, false, true);
					} else {
						AlarmDeviceManager.chartOrgEntity(data, false, false);
					}
				}
			}
		}
	},
	/**
	 * 
	 * @param obj
	 * @param isHigh
	 *            是否高亮
	 * @param isSelfLogin
	 *            是否本警务站
	 */
	orgIterator : function(obj, isHigh, isSelfLogin) {
		var userOrgPath = $.trim($("#useOrganPath").val());
		var str = userOrgPath.split("/");
		var orgCode = str[str.length - 1];
		var isSelfLogin = false;
		if (obj.organCode == orgCode) {// 当前警务站
			isSelfLogin = true;
		}
		if (obj.relationOrgans && obj.relationOrgans.length > 0) {
			for (var i = 0; i < obj.relationOrgans.length; i++) {
				var data = obj.relationOrgans[i];
				// obj.organCode 发生报警的警务站
				// orgCode 用户登录警务站
				if (!isSelfLogin) {
					if (data.self) {
						AlarmDeviceManager.chartOrgEntity(data, true, true);
					}
				} else {
					AlarmDeviceManager.chartOrgEntity(data, true, true);
				}
			}
		}
		MapHandler.createAllFeature(resourceFeatureDatas.SJFeatures,layerName.vectorSJLayer);
	},

	/**
	 * 
	 * @param obj
	 * @param isHigh
	 */
	gbIterator : function(obj, isHigh) {
		if (obj.gbDevices && obj.gbDevices.length > 0) {
			for (var i = 0; i < obj.gbDevices.length; i++) {
				var data = obj.gbDevices[i];
				AlarmDeviceManager.chartGBEntity(data, isHigh);
			}
		}
	}
}