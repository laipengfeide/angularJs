$(function(){
    setToday();
	$("#cgRight").css("height","100%");
	//historyManager.selectedType();
	
	historyManager.initData(1);
	historyManager.buildGridNo();

});

	$(document).keydown(function(event) {  
        if (event.keyCode == 13) {  
        	historyManager.search();
        }  
    });

$(document).ready(function(){
    var tempEventId = $("#keyEventId").val();

    if(tempEventId && tempEventId !=''){
        goToFeedback(tempEventId);
    }
});

var flag =1;
/**
 * 资源列表对象
 */
var historyManager = {
    pageNo:1,
		
	initMapFlag: false,
	
	
	/**
	 * 存储当前列的地图对象。切换时需要将已存在的对象还原图标
	 */
	OnSelectEnty:new Object(),
	/**
	 * 加载地图
	 */
	initMap:function(){
		initMap();
		
	},
	/**
	 * 加载资源
	 */
	initData:function(pageNo,flag){
        var l = 1;
        if(flag==2){
            l = flag;
        }
        historyManager.pageNo=pageNo;
		var resName = $.trim($("#resName").val());
		if(!IllegalChar.illegalChar(resName)){
			kendo.message("名称不能包含特殊字符");
			return;
		}
		var organCode = $("#orgCode").val();
		//var alarmDevice = $.trim($("#alarmType").val());
        var kvfId = $.trim($("#kvfIdType").val());//-1全部，1已反馈，0未反馈
		var alarmOrgan = $.trim($("#alarmOrgan").val());//1,本级奇偶股1，全部
        if(alarmOrgan==2 && resName=="" && l==2){
        	kendo.message("请输入车牌号");
			return;
        }
        if(l==1){
            alarmOrgan=1;
        }
        var dateType ;
        var day=document.getElementsByName("dateType");
        for(var i=0;i<day.length;i++){
            if(day[i].checked){
                dateType =day[i].value;
            }
        }
        var startTime = $('#startDay').val();
        var endTime = $("#endDay").val();
		$.ajax({
			url:basePath + "historyAlarmEvent/getHistoryAlarm.do",
			type:"post",
			data:{
				dateType:dateType,
				organCode:organCode,
				startTime:startTime,
				endTime:endTime,
				alarmDevice:7,
				alarmOrgan:alarmOrgan,
				name:resName,
				pageNo:pageNo,
				pageSize:10,
				totalRows: "",
                kvfId:kvfId,
				r:Math.random()
		
			},
			dataType:"json",
			success:function(msg){
				if(msg.code == 200){
					if(!historyManager.initMapFlag){
						historyManager.initMap();
						historyManager.initMapFlag = !historyManager.initMapFlag;
					}
					//清除地图图标
					var en = new MapEntity();
					en.type = 110;
					en.layerName = layerName.markerLayer;
					MapManager.clearMarkerByType(en);
					MapManager.closeInfoWindow();
				  //  console.log(msg.data);
					//清空选中对象
					historyManager.OnSelectEnty = {};
					//组装grid
					historyManager.buildGrid(msg.data);
					//已标注的资源上图
					//historyManager.dochart(msg.data);
					var pg = pagination(pageNo,msg.totalRows,'historyManager.initData',10);
					
			        $("#page").html(pg);
				}else{
					kendo.message(msg.description);
				}
			}
		});
	},
	/**
	 * 组建grid
	 * @param dataSource
	 */
	buildGrid:function(dataSource){
		var arr = new Array();
		var jsonContent ={};
		for(var i=0;i<dataSource.length;i++){
			var data = dataSource[i];
			if(data.jsonContent && data.jsonContent != ""){
                var jsonObj =  JSON.parse(data.jsonContent).data;
                data.alarmNumber = jsonObj.uuid&&jsonObj.uuid!='"null"'? jsonObj.uuid:"";//任务编号
                data.plate = jsonObj.plate &&jsonObj.plate!='"null"'? jsonObj.plate:"";//车牌
                data.carowner_name = jsonObj.reserved3 &&jsonObj.reserved3!='"null"' ? jsonObj.reserved3:"";//布控人姓名
                data.dataSource = jsonObj.dataSource &&jsonObj.dataSource!='"null"'? jsonObj.dataSource:"";//布控人员类型
                data.people_id = jsonObj.id &&jsonObj.id!='"null"'? jsonObj.id:"";//布控人身份证
                data.plate_color = jsonObj.plate_color &&jsonObj.plate_color!='"null"'? plateColor[jsonObj.plate_color]:"";//车牌颜色
                data.vehicle_color = jsonObj.vehicle_color &&jsonObj.vehicle_color!='"null"'? vehicleColor[jsonObj.vehicle_color]:"";//车辆颜色
                data.vehicle_category = jsonObj.vehicle_category &&jsonObj.vehicle_category!='"null"'? vehicleCategory[jsonObj.vehicle_category]:"";//车辆类型
                data.location = jsonObj.location &&jsonObj.location!='"null"'? jsonObj.location:"";//地点名称
                data.action = jsonObj.action &&jsonObj.action!='"null"'? jsonObj.action:"";//处理措施
                data.passtime = jsonObj.passtime &&jsonObj.passtime!='"null"'? jsonObj.passtime:"";//经过时间

			}

			arr.push(data);
		}
		var hg = $(".main").height() - $(".main .cg-search").height() - 43;
		$("#resGrid").kendoGrid(
			{  /*selectable : "multiple",*/
				sortable: true,
                resizable: true,
                height:hg,
				dataSource : {
					data : arr
				},columns : [ {
					title : 'Id',
					field : 'id',
					hidden : true
				},{
					title : '',
					width:"3%",
					template: "<span class='row-number'></span>"
            	}/*,{
					title : '任务编号',
					//width:"5%",
					template: "<span title='#:alarmNumber#'style='word-wrap: break-word;white-space: normal;' >#:alarmNumber#</span>"
					hidden : true
				}*/,{
					title : '车牌',
					width:"100px",
					template:"<div title='#:alarmNumber#' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:plate#<div>"
				},{
					title : '布控人姓名',
					//width:"10%",
					template:"<div title='#:carowner_name#' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:carowner_name#<div>"
				},{
					title : '布控人员类型',
					//width:"15%",
                template:"<div title='#:dataSource#' style='word-wrap: break-word;white-space: normal;'>#:dataSource#<div>"
                },{
					title : '布控人身份证',
					width:"150px",
					template:"<div title='#:people_id#' style='width: 150px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:people_id#<div>"
				},{
					title : '车牌颜色',
					width:"70px",
					
					template:"<div title='#:plate_color#' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:plate_color#<div>"
				}, {
                    title : '车辆颜色',
                    width:"70px",

                    template:"<div title='#:vehicle_color#' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:vehicle_color#<div>"
                }, {
                    title : '车辆类型',
                    width:"70px",

                    template:"<div title='#:vehicle_category#' style='text-overflow: ellipsis;white-space: nowrap;'>#:vehicle_category#<div>"
                },{
                    title : '地点名称',
                    //width:"20%",

                    template:"<div title='#:location#' style='word-wrap: break-word;white-space: normal;'>#:location#<div>"
                },{
                    title : '处理措施',
                    //width:"20%",

                    template:"<div title='#:action#' style='word-wrap: break-word;white-space: normal;'>#:action#<div>"
                },{
                    title : '报警时间',
                    //width:"20%",
                	width:"150px",
                    template:"<div title='#:reportTime#' style='width: 150px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:reportTime#<div>"
                }, {
                    title : '定位地址',
                    //width:"15%",
                    template:"#if(lat != null ){#<a title='#:lat#,#:lon#'  onclick='dbHistoryAlarmEvevt(#:id #,#:lon #,#:lat #)' style='overflow: hidden;text-overflow: ellipsis;white-space: normal;cursor:pointer;'>#:lat#,#:lon#</a>#}#"
                },{
                    title : '操作',
                    width:"120px",
                    template:"#if(deviceTypeName == 7 && (kvfId==null || kvfId==0) ){#<div style='word-wrap: break-word;white-space: normal;cursor:pointer;'><a id='fb#:id #' onclick='goToFeedback(#:id #)'>反馈</a> | <a onclick='gotoAlarmDetails(#:id #)'>详情</a></div>#}else if(deviceTypeName == 7 && (kvfId != null&&kvfId==1)){#"
					+"<div style='word-wrap: break-word;white-space: normal;cursor:pointer;'><a onclick='goToHasFeedback(#:id #)'>已反馈</a> | <a onclick='gotoAlarmDetails(#:id #)'>详情</a></div>#}#"

                }],
				 dataBound: function () {  
		                var rows = this.items();  
		                $(rows).each(function () {  
		                    var index = $(this).index() + 1;  
		                    var rowLabel = $(this).find(".row-number");  
		                    $(rowLabel).html(index);  
		                });  
		            },
				selectable : "row",
				
				change : function(e) {
					var caseGrid = $("#resGrid").data("kendoGrid");
					var row = caseGrid.dataItem(caseGrid.select());
					
				}
		});
	 /*	var myGrid = $("#resGrid").data("kendoGrid");
        myGrid.element.on("dblclick","tbody>tr","dblclick",function(){
            var id = $(this).find("td").first().text();
            historyManager.alsf("i.al-icon");
            dbHistoryAlarmEvevt(id);
        });*/
	 
	},
	
	buildGridNo:function(){
		
		var hg = $("#content").height() - $("#content .cg-search").height() - 43;
        $("#resGrid").kendoGrid(
            {
				/*selectable: "multiple",*/
                sortable: true,
                resizable: true,
                height: hg,
                dataSource: {}, columns: [{
                title: 'Id',

                hidden: true
				}, {
					title : '',
					width:"3%",
					template: "<span class='row-number'></span>"
				}/*,{
					title: '任务编号',
					//width:"5%",
                	hidden : true
				}*/, {
					title: '车牌',
					width:"100px",
				}, {
					title: '布控人姓名',
					//width:"10%",
				}, {
					title: '布控人员类型',
					//width:"15%",
				}, {
					title: '布控人身份证',
					width:"150px",
				}, {
					title: '车牌颜色',
					width:"70px",

				}, {
					title: '车辆颜色',
					width:"70px",

				}, {
					title: '车辆类型',
					width:"100px",

				}, {
					title: '地点名称',
					//width:"20%",

				}, {
					title: '处理措施',
					//width:"20%",

            	}, {
               	 title: '报警时间',
				 width:"150px"
            	},
                {
                    title: '定位地址',
                    //width:"15%",
                },
                {
                    title: '操作',
                   	width:"120px",
                }]

            });
	
	 
	},
	dochart:function(dataSource){
		$(dataSource).each(function(){
			if( this.lon != null && this.lat != null ){
				var entity = new MapEntity();
				entity.id = this.id;
				entity.eventId = this.id;
				entity.type = 110;
				entity.longitude = this.lon;
				entity.latitude = this.lat;
				entity.layerName = layerName.markerLayer;
				entity.iconUrl = basePath+"images/images/location.png"
			    entity.deviceType=this.deviceTypeName;
				entity.showType='Marker';
				entity.readStatus=1;
				var jsonContent = "";
				if(this.jsonContent && this.jsonContent != ""){
					if(typeof this.jsonContent == "string"){
						try{
							jsonContent = JSON.parse(this.jsonContent);
						}catch(e){}
					}else{
						jsonContent = this.jsonContent;
					}
				}
				entity.jsonContent=jsonContent; //赋值
				entity.detailInfo = {
				        name: this.content,
				        number:this.number,
				        content:this.content,
				        policeStation:this.expandColumn2?this.expandColumn2:this.policeStation,
				        address:this.expandColumn3,
				        alarmTime:this.alarmTime
				    };
				//添加点击事件
				entity.action = "click";
    			entity.callback = MapToobar.openInfoWindow;
    			
    			
    			
				MapManager.clearOverlayByIdType(entity);
				//标注上图
				entity.isWork=false;//使用批量上图模式
				MapManager.createMarker(entity);
			}
		});
		//serPointLayer 图层批量上图
	 if(resourceFeatureDatas.serPointFeatures.length > 0){
			MapHandler.createAllFeature(resourceFeatureDatas.serPointFeatures,layerName.serPointLayer);
			resourceFeatureDatas.serPointFeatures.length=0;
		}
	 
	},
    search: function(){
		flag=2;
    	historyManager.initData(1,flag);
    },


	/**
	 * 控制div缩放或者扩展
	 * @param obj
	 */
	alsf:function(obj) {
		if ($(obj).hasClass("al-icon")) {
			$(obj).removeClass("al-icon").addClass("al-icon-s");
			$("#alPanel").animate({
				"width" : 0
			}, 'slow');
			$("#resGrid_all").hide();
			$("#alBtn").animate({
				"left" : 11
			}, 'slow');
		} else {
			$(obj).removeClass("al-icon-s").addClass("al-icon");
			$("#resGrid_all").show();
			$("#alPanel").animate({
				"width" : "99%"
			}, 'slow');
			$("#alBtn").animate({
				"left" : "99%"
			}, 'slow');
			var en = new MapEntity();
			en.type = 110;
			en.layerName = layerName.markerLayer;
			MapManager.clearMarkerByType(en);
			MapManager.closeInfoWindow();
		}
	},
};




function dbHistoryAlarmEvevt(relationOrganId,lon,lat){

		if (lon ==0.0 && lat==0.0) {return}
		if (lon ==0 && lat==0) {return}
	    historyManager.alsf("i.al-icon");
		 $.ajax({
				url:basePath +"map/queryAlarmEventById.do",
				type : "post",
				data : {
					eventId : relationOrganId,
					random : Math.random()
				},
				dataType : "json",
				success : function(rsp) {
					if(rsp.code != 300){

						var obj = rsp.data;
					obj.eventId = obj.id;
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
						obj.longitude=obj.lon;
						obj.latitude =obj.lat;
						alarmGpsReport(obj,2);
					
					}else{
						kendo.message(rsp.description);
					}
				}
			});
	//}
}


 function alarmGpsReport(obj,type){
	if(!obj.layerName){
		obj.layerName = layerName.markerLayer;
	}
	if(!obj.type){
		obj.type = 110;
	}
	var alaTime = format(obj.alarmTime,"yyyy-MM-dd HH:mm:ss");
	//closeDiv(1,1)参数无意义
	/*try{
        video_stop_all();
	}catch(e){}*/
/*	if(type == 1){
		//地图视频播放
		if(obj.gbDevices && obj.gbDevices.length > 0){
			$.each(obj.gbDevices,function(){
				ListManager.playVideoForMap({
					name:this.name,
					naming:this.naming,
					naming1:this.naming1
				});
				//绑定naming与事件id关系
				AlarmDeviceManager.EventResource[this.naming] = obj.id;
			});
		}*/

		/*//声音提示
		var media = $('#chatAudio')[0];
		media.play();*/
//	}
	/*var popupNotification = $("#popUpMesseage").kendoNotification({
        autoHideAfter:0,
        hideOnClick: false,
        position: {
            pinned: true,
            top: null,
            left: 0,
            bottom: 0,
            right: null
        },
        width: 258,
		   height:180,
        stacking: "down",
        templates: [{
            // define a template for the custom "timeAlert" notification type
            type: "messageNotification",
            template:
            "<div class='myAlert' id='alarmMessageInfo'><span class='device-lowerLeft-title'  title='#=messeageTitle #'>#=messeageTitle #</span>" +
            "<span class='cg-i-close cg-pop-close' style='float:right;margin-right:5px;margin:-4px 0 0 0' onclick='closeNotification()'>×</span><br><hr>"+
        	"&nbsp;&nbsp;&nbsp;&nbsp;时间: #=alarmTime # <br><hr> " +
            	"<i class='xj-lbd-icon xj-gps-red'><img src='#=basePath#Skin/cg/images/alarm/lb_bd.png'></i>" +
            	"地址: #=address # <br><hr> " +
            	"<i class='xj-lbd-icon xj-gps-red'><img src='#=basePath#Skin/cg/images/alarm/contacts.png'></i>" +
            	"联系人: #=contacts# <br><hr> " +
            	"<i class='xj-lbd-icon xj-gps-red'><img src='#=basePath#Skin/cg/images/alarm/lb_sp.png'></i>" +
            	"设备编号:#=contactNumber# <br><hr>" +
            	"<div>" +
            		//暂时未添加功能
                	'<div id="imagesPanel" class="xj-left-tab" style="width:450px;height: 90px;position:relative;">'+
						'<div class="xj-left-panel" style="width:450px;">'+
				        	'<div class="fl xj-left-box">'+
				        		'<div class="cg-ri-photo" style="height:60px;">'+
									'<div class="cg-riph-left" onclick="moveLeft()" style="height:60px;">'+
										'<i style="margin-top:25px;"></i>'+
									'</div>'+
									'<input type="hidden" value="0" id="nextOne"/>'+
									'<div class="cg-riph-main" id="cgPhoto" style="height:60px;width: 405px;">'+
										'<ul style="height:60px;" id="width-left">'+
											'<li style="width:95px;height:60px;"><img style="width:80px;height:60px;" class="cursor" src="#=basePath#Skin/cg/images/temp/p1.jpg" onclick="alarmImgShow(this)"></li>'+
											'<li style="width:95px;height:60px;"><img style="width:80px;height:60px;" class="cursor" src="#=basePath#Skin/cg/images/temp/p1.jpg" onclick="alarmImgShow(this)"></li>'+
										'</ul>'+
									'</div>'+
									'<div class="cg-riph-right" onclick="moveRight()" style="height:60px;">'+
										'<i style="margin-top:25px;"></i>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<input id="fileSize" type="hidden" style="width:100px;height:50px;">'+
						'<div id="alarmImgShow" class="xj-left-panel-show hidden">'+
							'<img class="cursor" src="#=basePath#/Skin/cg/images/temp/p1.jpg" onclick="alarmImgClose(this)">'+
						'</div>'+
					'</div>'+
            	"</div>" +
            "</div>"
        }]
	   }).data("kendoNotification");*/
   /* var radar = $("#popIntercomList").kendoNotification({
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
    }).data("kendoNotification");*/
	
	//机构上图
	var userOrgPath = $.trim($("#useOrganPath").val());
    var str =  userOrgPath.split("/");
   	var orgCode = str[str.length -1];
	//回写状态
	if(obj.relationOrgans && obj.relationOrgans.length > 0){
		for(var i = 0;i<obj.relationOrgans.length;i++){
			var data = obj.relationOrgans[i];
			if(data.organCode == orgCode){
				obj.eventId = data.eventId;
				break;
			}
		}
	}
	var log = hasVideoPlay(obj.eventId);
	if(log && log.data){
		obj.jsonContent = log.data.jsonContent;
		obj.gbDevices  = log.data.gbDevices
		if(!obj.relationOrgans) obj.relationOrgans=log.data.relationOrgans;
	}
	chartAlarmHigh(obj);
	//如果有视频就显示播放视频图标，没有就隐藏
	//var objId = obj.eventId?obj.eventId:obj.id;
/*	popupNotification.show({
     	   messeageTitle:obj.content,
     	   alarmTime:alaTime,
     	   address:obj.address,//报警地址
     	   contacts:"",//联系人
     	   contactNumber:obj.number,

		   }, "messageNotification");*/
	if(obj.deviceType ==4){
    	radar.show({}, "messageNotification");
    }else {
        closeRadar();
	}
 }
 
function hasVideoPlay(eventId){
    	var result = {};
		$.ajax({
			url : basePath+"/map/queryAlarmEventById.do",
			type : "post",
			data : {
				eventId : eventId,
				random : Math.random()
			},
			dataType : "json",
			async:false,
			success : function(rsp) {
				result = rsp;	
			}
		});
		return result;
	}
function chartAlarmHigh(enty,callback){

		//marker上图
		chartAlarmMarker(enty);
		
	
	}

function chartAlarmMarker(obj){
	if(!obj) return;
	if(obj.longitude != null && obj.latitude != null ){
	var alaTime = format(obj.alarmTime,"yyyy-MM-dd HH:mm:ss")
	var en = {
		id:obj.eventId,
		longitude:obj.lon?obj.lon:obj.longitude,
		latitude:obj.lat?obj.lat:obj.latitude,
		type:110,
		eventId: obj.eventId,
		deviceType: obj.deviceType,
		readStatus: 1,
		policeStation: obj.expandColumn2?obj.expandColumn2:obj.policeStation,
		iconUrl:basePath+"images/images/location.png",
		layerName:layerName.markerLayer,
		zoom:mapMaxZoomToLevel,
		alarmTime: alaTime,
		content:obj.content,
		address:obj.address,//报警地址
     	number:obj.number,
     	organCode:obj.organCode,
     	gbDevices:obj.gbDevices
	};
	en.detailInfo = {
		name: obj.content,
		number:obj.number,
		policeStation:obj.expandColumn2?obj.expandColumn2:obj.policeStation,
		content:obj.content,
		address:obj.address,
		alarmTime:alaTime
		};
	//添加点击事件
	en.action = "click";
	en.callback = alarmGpsReport;

	MapManager.setCenter(en);
	//恢复到默认层级
	//MapManager.zoomTo(MapManager.getMapZoom());
	MapManager.zoomTo(en.zoom )
	//把当前的大图标警情换成小图标
	//移除当前的对象，把之前的警情创建小图标
	var newObj = null;
	var newEn = null;
	newObj = MapManager.clearMarkerByIdType(en);
	if(curAlarmEn){
		newObj = MapManager.clearMarkerByIdType(curAlarmEn);
		if(newObj && curAlarmEn.id!=en.id){
			newEn = newObj.attributes.entity;
			//alert(newEn.id)
			newEn.width=25;
			newEn.height=28;
			MapManager.createMarker(newEn);
		}
	}

	
	en.isTop = true;
	//封装弹出信息实体
	var enT = new MapEntity(en);
	enT.width = null;
	enT.height = null;
	enT.type = 110;
	enT.eventId = obj.eventId;
	enT.deviceType=obj.deviceType;
	enT.readStatus = 1;
	enT.gbDevices = obj.gbDevices;
	enT.iconUrl = basePath+"images/images/location.png"
    enT.imageUrl = obj.imgUrls;
	var jsonContent = "";
	if(obj.jsonContent && obj.jsonContent != ""){
		if(typeof obj.jsonContent == "string"){
			try{
				jsonContent = JSON.parse(obj.jsonContent);
			}catch(e){}
		}else{
			jsonContent = obj.jsonContent;
		}
	}
	en.jsonContent = enT.jsonContent=jsonContent; //赋值
   enT.detailInfo = {
        name: enT.content,
        number:obj.number,
        content:obj.content,
        policeStation:obj.expandColumn2?obj.expandColumn2:obj.policeStation,
        address:obj.address,
        alarmTime:alaTime
    };
	MapManager.createMarker(en);
	
	enT.showType='Marker';//指定弹窗类型
	//弹出信息框
	MapToobar.openInfoWindow(enT);
	

	curAlarmEn = en;
	}
}

function closeRadar() {
    $(".radar").parent().parent().hide();
}
