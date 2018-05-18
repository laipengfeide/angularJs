$(function(){
    ToobarConfig.buildHistoryRes();
	//获取辖区状态
	popedomManager.initAreaResource();
	//加载右上角工具栏菜单
	ToobarConfig.initConfig();
	$("#cameraPic").removeAttr("onclick");
	MapToobar.initResourceDatas(true, $("#organId").val(),ToobarConfig.initResourceDatasCallback);
	//如果是警务站账号登录，在地图上默认显示一键报警设备的坐标
	ToobarConfig.deviceAbove();

	//ToobarConfig.satelliteMap();

});
var basePath='http://127.0.0.1:8088/pcenter/';
/**
 *  工具栏对象
 */
var ToobarConfig = {
	pesonalResource:[],

	/**
     * 加载资源数据的回调函数
     * @param type 资源类型的type标识
     */
	initResourceDatasCallback:function(type){
	    var temRes = ToobarConfig.pesonalResource;
        if(temRes && temRes.length>0){
            for(var c  in resourceConfig.config){
                resourceConfig.config[c].type = '-1';
                resourceConfig.config[c].subType = '-1';
                for(var t  in temRes){
                    if(resourceConfig.config[c].id == temRes[t].type){
                        resourceConfig.config[c].type = temRes[t].type;
                        resourceConfig.config[c].subType = temRes[t].subType;
                    }
                }
            }
        }
		for(var i in resourceConfig.config){
            if(resourceConfig.config[i] instanceof Function){continue;}
            if(resourceConfig.config[i].id == type
                    && resourceConfig.config[i].isShowOnToobar == "true"){
            	var obj = $("#"+resourceConfig.config[i].shortName + "Pic");
            	if(resourceConfig.config[i].type != '-1'){
                    if(type == 1){
                        //组建天网分组
                        if(typeof resGBGroupRequest == "function"){
                            resGBGroupRequest(1,ListManager.buildGroupHtml);
                        }
                    }else if(type == 4){
                        //组建人员分组信息
                        if(typeof resPoliceGroupRequest == "function"){
                            resPoliceGroupRequest();
                        }
                        $("#list-type span").removeClass("list-span-current");
                        $("#titlePolice").addClass("list-span-current");
                    }
                    //如果是卫星地图
                     if(type=="100"){
                         //setTimeout(function(){ToobarConfig.chartToobar(obj,type,1);},300);
                     }else{
                    	 if(type == "5.1"){
                    		 if(ResourceDatas.datas[type]){
                	            ResourceDatas.datas[type]["status"] = resourceConfig.config[i].subType == 1 ? true : false;
                    		 }
                    		 setTimeout("MapToobar.initResourceChart("+type+")", 200);
                         }else{
                        	 setTimeout(function(){ToobarConfig.chartToobar(obj,type);},300);
                         }
                     }
                }else{
                    if(type == 1){
                        // $(obj).attr("onclick","ToobarConfig.chartToobar(this,1)");
                        //组建天网分组
                        if(typeof resGBGroupRequest == "function"){
                            resGBGroupRequest(1,ListManager.buildGroupHtml);
                        }
                    }
                    if(type == 4){
                        //组建人员分组信息
                        if(typeof resPoliceGroupRequest == "function"){
                            resPoliceGroupRequest();
                        }
                        $("#list-type span").removeClass("list-span-current");
                        $("#titlePolice").addClass("list-span-current");
                    }
                    //坐席弹屏时，取消初始化警情上图20170915
                    if(type == "5.1"){
                        if($("#globalSeatNumber").val()!=null && $("#globalSeatNumber").val() !=''){
                            return;
                        }
                    }
                    if(resourceConfig.config[i].isShowOnMap == "true"){
                        //如果是卫星地图
                         if(type=="100"){
                            // setTimeout(function(){ToobarConfig.chartToobar(obj,type,1);},300);
                         }else{
                             setTimeout(function(){ToobarConfig.chartToobar(obj,type);},300);
                         }

                    }
                }
            }
        }
		if(type == 110){
			setTimeout("MapToobar.initResourceChart("+type+")", 200);
		}
	},

	/**
     * 加载资源数据的回调函数
     * @param type 资源类型的type标识
     */
	initResourceDatasCallbackChart:function(type){
		for(var i in resourceConfig.config){
            if(resourceConfig.config[i] instanceof Function){continue;}
            if(resourceConfig.config[i].id == type
                && resourceConfig.config[i].isShowOnToobar == "true"){
                var obj = $("#"+resourceConfig.config[i].shortName + "Pic");
                if(type == 1){
                    // $(obj).attr("onclick","ToobarConfig.chartToobar(this,1)");
                    //组建天网分组
                    if(typeof resGBGroupRequest == "function"){
                    	 resGBGroupRequest(1,ListManager.buildGroupHtml);
                    }
                }
                if(type == 4){
                	//组建人员分组信息
                	if(typeof resPoliceGroupRequest == "function"){
                		resPoliceGroupRequest();
                	}
                	$("#list-type span").removeClass("list-span-current");
                	$("#titlePolice").addClass("list-span-current");
                }
                if(resourceConfig.config[i].isShowOnMap == "true"){
                	setTimeout(function(){ToobarConfig.chartToobar(obj,type);},300);
                }
            }
        }
		if(type == 110){
			setTimeout("MapToobar.initResourceChart("+type+")", 200);
		}
		// else if(type == 7 || type == 200 ||type == 5.2){
		// 	 $(".ty-more-right-now").each(function(){
		// 		 setTimeout("MapToobar.initMyResourceChart('"+$(this).attr("value")+"', true)", 200);
		// 	 });
		// }
	},
	refreshChartData:function(orgId, type){
		if(type == undefined || type == ""){
			return;
		}
		MapToobar.resourceRequest(orgId,type, null, function(ty){
			try{
				$(".ty-more-right-now").each(function(){
					  if($(this).attr("value").indexOf(ty+".") != -1){
						  setTimeout("MapToobar.initMyResourceChart("+$(this).attr("value")+", true)", 200);
					  }
				 });
			}catch(e){}
		});
	},
	/**
   	* 接收gps推送过来的下线状态
   	* @param ob ===> gpsOffLine 下线唯一标识
    */
	pushGpsOffline:function(gpsId){
		var pId;
		//1、清除地图图标
		var resdatas=ResourceDatas.gpsResDatas;
		for(var j in resdatas){
			if(!resdatas[j] && resdatas[j] instanceof Function){return;};
			var enty=resdatas[j][gpsId];
			if(enty){
				pId = enty.id;
				if(enty.type == 4){
					enty.layerName = layerName.policeLayer;
				}else if(enty.type == 5){
					enty.layerName = layerName.policeCarLayer;
				}
				MapToobar.clearVectorMarkersByIdType(enty);
				break;
			}
		}
		//2、改变地图数据longitude,latitude 为 ""
		if(pId){
			var pmdata = ResourceDatas.datas[4].data;
			pmdata[pId].longitude = "";
			pmdata[pId].latitude = "";
		}
		//3、改变数量和列表
		if(typeof(refreshOffLineNum) == "function"){
			refreshOffLineNum(gpsId);
		}
	},
	showChooseItem:function(type){
		var width=$(".operation").width();
		var organPath = $('#organPath').val();
		var orgId = $('#organId').val();
        $(".ty-more-right").hide();
		if($("#moreHtml"+type).length==0){
            var ht = "<div class='ty-more-right' id='moreHtml"+type+"'></div>";
            $("#chartDiv").append(ht);
            $.ajax({
                url:basePath + "web/Area/listTotalType.do?type="+type+"&organPath="+organPath,
                type:"get",
                dataType:"json",
                success:function(msg){
                    if(msg.code == 200){
                        var moreStr = '';
                        var len = msg.data.length, ob;
                        for(var i = 0; i < len; i++){
                            ob = msg.data[i];
                            if(!ob){
                                continue;
                            }
                            if(ob.type == 0){// 治安资源
                                ob.type = "200."+ob.id;
                                ob.tempId = "200_"+ob.id;
                            }else if(ob.type == 1){//责任网格
                                ob.type = "7."+ob.id;
                                ob.tempId = "7_"+ob.id;
                            }else if(ob.type ==2){//报警设备
                                ob.type = '5.2'+ob.id;
                                ob.tempId = "5_2_"+ob.id;
                                //过滤110报警设备,重点车辆设备
                                if(ob.id >5){
                                    continue;
                                }
                            }
                            moreStr += "<span id='catagory_"+ob.tempId+"' value='"+ob.type+"' class='type_"+type+"'>"+ob.name+"("+ob.total+")"+"</span>";
                        }
                        $("#moreHtml"+type).html(moreStr);
                        $("#moreHtml"+type).css("width",width-7);
                        var historySource ,shistorySubtype;
                        for(var j in ToobarConfig.pesonalResource){
                            if(type == ToobarConfig.pesonalResource[j].type ){
                                historySource=ToobarConfig.pesonalResource[j];
                                shistorySubtype = ToobarConfig.pesonalResource[j].subType;
                            }
                        }
                        if(type == '10002'){
                            var widT = $(".operation").width();
                            $("#moreHtml"+type).css("width",widT-7);
                            $("#moreHtml"+type+" span").each(function(i,v){
                                var atemp =$(this).attr('value');
                                $(this).on("click",function(){
                                    var hs = $(this).hasClass("ty-more-right-now");
                                    if(!hs){
                                        $(this).addClass("ty-more-right-now");
                                    }else{
                                        $(this).removeClass("ty-more-right-now");
                                    }

                                    setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",200);

                                    if(!hs){
                                        ToobarConfig.updateResourcesHistoryRecord(type,atemp);
                                    }else{
                                        ToobarConfig.deleteResourcesHistoryRecord(type,atemp);
                                    }

                                });

                                if(historySource && shistorySubtype.indexOf(atemp)  != -1){

                                    var hs = $(this).hasClass("ty-more-right-now");
                                    if(!hs){
                                        $(this).addClass("ty-more-right-now");
                                    }else{
                                        $(this).removeClass("ty-more-right-now");
                                    }

                                    setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",200);

                                   // $(this).click();
                                }

                            })
                        }else{
                            $("#moreHtml"+type+" span").each(function(){
                                //alert($(this).attr('value'));
                                $(this).on("click",function(){
                                    var hs = $(this).hasClass("ty-more-right-now");
                                    if(!hs){
                                        $(this).addClass("ty-more-right-now");
                                    }else{
                                        $(this).removeClass("ty-more-right-now");
                                    }
                                    if($(this).attr("value").indexOf("200.") != -1||$(this).attr("value").indexOf("7.") != -1){
                                        setTimeout("MapToobar.initMyResourceChart('"+$(this).attr("value")+"', "+$(this).hasClass("ty-more-right-now")+")", 200);
                                    }else{
                                        setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",200);
                                    }
                                });
                            })
                        }

                    }
                }
            });
		}else{
            $.ajax({
                url:basePath + "web/Area/listTotalType.do?type="+type+"&organPath="+organPath,
                type:"get",
                dataType:"json",
                success:function(msg){
                    if(msg.code == 200){
                        var moreStr = '';
                        var len = msg.data.length, ob;
                        for(var i = 0; i < len; i++){
                            ob = msg.data[i];
                            if(!ob){
                                continue;
                            }
                            if(ob.type == 0){
                                ob.type = "200."+ob.id;
                                ob.tempId = "200_"+ob.id;
                            }else if(ob.type == 1){
                                ob.type = "7."+ob.id;
                                ob.tempId = "7_"+ob.id;
                            }else if(ob.type ==2){
                                ob.type = '5.2'+ob.id;
                                ob.tempId = "5_2_"+ob.id;
                                //过滤110报警设备
                                if(ob.id == 6){
                                    continue;
                                }
                            }
                            if($("#catagory_"+ob.tempId).length!=0){
                                $("#catagory_"+ob.tempId).html(""+ob.name+"("+ob.total+")");
                            }
                        }
                        // $("#moreHtml"+type).html(moreStr);
                        // $("#moreHtml"+type).css("width",width-30);
                        //

                    }
                }
            });
            $('#moreHtml'+type).show();
		}

	},
	/**
	 * 初始化配置信息
	 */
	initConfig:function(){
		//------------------------------初始化右上角工具栏配置--------------------------
        var toobarObj = config.toobar;
        for(var j in toobarObj){
        	if(toobarObj[j] instanceof Function){continue;}
        	var en = toobarObj[j];
            resourceConfig.config[en.id] = en;
            resourceConfig[en.id] = en.shortName;
        }

   		if(resourceConfig.config){
   			var conf = resourceConfig.config;
            $.ajax({
                url:basePath + "web/toolbar/list.do",
                type:"post",
                dataType:"json",
                success:function(msg){
                    if(msg.code==200 && msg.data){
                        ToobarConfig.pesonalResource=msg.data;
                        var temConf = msg.data;
                        if(temConf && temConf.length>0){
                            for(var c  in conf){
                                conf[c].type = '-1';
                                conf[c].subType = '-1';
                                for(var t  in temConf){
                                    if(conf[c].id == temConf[t].type){
                                        conf[c].type = temConf[t].type;
                                        conf[c].subType = temConf[t].subType;
                                    }
                                }
                            }
                        }
                        ToobarConfig.buildToolBars(conf,temConf);
                    }else{
                        ToobarConfig.buildToolBars(conf);
					}
                }
            });
   			//增加移上去显示更多内容
			$("#chartDiv").on("mouseleave",function(){
                $(".ty-more-right").hide();
			})
   		}
	},buildToolBars:function(conf,temConf){



        for(var i  in conf){
            if(i==4 && !$("#alarmSwitch").val()){
                continue;
            }
            if(i==5 && !$("#alarmSwitch").val()){
                continue;
            }
            if(i==5.1 && $("#mechanismInp").val()){
                continue;
            }
            if(i==1 && $("#videoInp").val()){
                continue;
            }
            if(conf[i].isShowOnToobar == "true"){
                    var c = "";
                    //坐席弹屏时，取消初始化警情上图20170915
                    if (i == "5.1") {
                        if ($("#globalSeatNumber").val() != null && $("#globalSeatNumber").val() != '') {
                            conf[i].isShowOnMap = 'false';
                        }
                    }
                if(conf[i].type && conf[i].type != '-1'){
                        if (conf[i].id == 100) {
                            var sateBtn = $("#satelliteBtn").val();
                            conf[i].isShowOnMap = sateBtn;
                        }

                        //10001 : 治安资源  、10002: 报警设备、10003 : 网格防区
                        if (conf[i].id == 10001 || conf[i].id == 10002 || conf[i].id == 10003){
                            c += "<span onmouseenter=\"ToobarConfig.showChooseItem('" + conf[i].id + "')\">";
                            c += "<img class='ty-chart-img' chartType='" + conf[i].id + "' title='" + conf[i].name + "' id= '" + conf[i].shortName + "Pic'";
                            c += "src='" + basePath + "images/res/toobar-" + conf[i].id + ".png' ";

                        } else {
                            var click = conf[i].isShowOnMap == 'true'?'click':'';
                            if(conf[i].type != '-1'){
                                click = conf[i].type != '-1'&& conf[i].subType!='0'?'click':'';
							}
                            c += "<span id='" + conf[i].id + "configSpan' onclick=\"ToobarConfig.chartToobar(this,'" + conf[i].id + "')\">";
                            c += "<img class='ty-chart-img' chartType='" + conf[i].id + "' title='" + conf[i].name + "' id= '" + conf[i].shortName + "Pic'";
                            c += "src='" + basePath + "images/res/toobar-" + conf[i].id + click+".png' ";
                        }
                        c += "/>&nbsp;&nbsp;" + conf[i].name;
                        if (conf[i].type == '100' && conf[i].id == 100 && MapVesion == 'openLayers' && conf[i].subType != '0') {
                            c += "<div id='satelliteMapSwitching' class='xj-ditu-menu-hide'>";
                            c += "<ul>";
                            c += "<li id='baiduLi'><span onclick='MapManager.setSatelliteMap(null,1);ToobarConfig.updateResourcesHistoryRecord(100,1)'>百度地图</span></li>";
                            c += "<li id='tatLi'><span onclick='MapManager.setSatelliteMap(null,2);ToobarConfig.updateResourcesHistoryRecord(100,2);'>天地图</span></li>";
                            c += "</ul>";
                            c += "</div>";
                        }
                        c += "</span>";

                        $("#chartDiv").append(c);
                    if (  conf[i].type == '100' && conf[i].id == 100 && conf[i].subType != '-1'&& conf[i].subType != '0') {
                        if(MapVesion == 'openLayers' ){
                            MapManager.setSatelliteMap(null,conf[i].subType);
                        }else{
                            MapManager.setSatelliteMap({code:0,url:MapManager.getMiliUrl(),type:1,opacity: (MapManager.getLayerOpacity() *1)})
                        }
                    }
				}else{
                    if (conf[i].id == 100) {
                        var sateBtn = $("#satelliteBtn").val();
                        conf[i].isShowOnMap = sateBtn;
                    }

                    //10001 : 治安资源  、10002: 报警设备、10003 : 网格防区
                    if (conf[i].id == 10001 || conf[i].id == 10002 || conf[i].id == 10003) {
                        c += "<span onmouseenter=\"ToobarConfig.showChooseItem('" + conf[i].id + "')\">";
                        c += "<img class='ty-chart-img' chartType='" + conf[i].id + "' title='" + conf[i].name + "' id= '" + conf[i].shortName + "Pic'";
                        c += "src='" + basePath + "images/res/toobar-" + conf[i].id + ".png' ";
                    } else if (conf[i].isShowOnMap == 'true' ) {
                        c += "<span id='" + conf[i].id + "configSpan' onclick=\"ToobarConfig.chartToobar(this,'" + conf[i].id + "')\">";
                        c += "<img class='ty-chart-img' chartType='" + conf[i].id + "' title='" + conf[i].name + "' id= '" + conf[i].shortName + "Pic'";
                        c += "src='" + basePath + "images/res/toobar-" + conf[i].id + "click.png' ";

                    } else {
                        c += "<span id='" + conf[i].id + "configSpan' onclick=\"ToobarConfig.chartToobar(this,'" + conf[i].id + "')\">";
                        c += "<img class='ty-chart-img' chartType='" + conf[i].id + "' title='" + conf[i].name + "' id= '" + conf[i].shortName + "Pic'";
                        c += "src='" + basePath + "images/res/toobar-" + conf[i].id + ".png' ";
                    }
                    c += "/>&nbsp;&nbsp;" + conf[i].name;
                    if ($("#satelliteBtn").val() == "true" && conf[i].id == 100 && MapVesion == 'openLayers') {
                        c += "<div id='satelliteMapSwitching' class='xj-ditu-menu-hide'>";
                        c += "<ul>";
                        c += "<li id='baiduLi'><span onclick='MapManager.setSatelliteMap(null,1);ToobarConfig.updateResourcesHistoryRecord(100,1);'>百度地图</span></li>";
                        c += "<li id='tatLi'><span onclick='MapManager.setSatelliteMap(null,2);ToobarConfig.updateResourcesHistoryRecord(100,2);'>天地图</span></li>";
                        c += "</ul>";
                        c += "</div>";
                    }
                    c += "</span>";

                    $("#chartDiv").append(c);
				}
            }
        }
        for(var x  in conf){
            if(conf[x].type == '10002' && conf[x].subType != '-1' && conf[x].subType != '0'){
                ToobarConfig.showChooseItem(conf[x].type);
            }
        }

	},
	/**
	 * 资源上图工具栏业务控制
	 * e是判断是否修改卫星地图的session值
	 */
	chartToobar:function(obj,type,e){
		if(type == 4 || type == 5){
			/**初始化GPS业务MQ--20171020*/
			MqManager.initGpsMq();
		}

	   var dataTypes = [[1,"toobar-1.png"],[4,"toobar-4.png"],
		                    [5,"toobar-5.png"],[6,"toobar-6.png"],
		                    [7,"toobar-7.png"],[100,"toobar-100.png"],
		                    [6.5,"toobar-6.5.png"],[1.2,"toobar-1.2.png"],
		                    [5.2,"toobar-5.2.png"],[5.1,"toobar-5.1.png"],
		   					[10001,"toobar-10001.png"],[10002,"toobar-10002.png"],[10003,"toobar-10003.png"]];
	   var srcStr = "";
	   var flag = false;
	   for(var i in dataTypes){
		   var dataType = dataTypes[i];
		   //原图片地址
		   srcStr = $(obj).find("img").attr("src");
		   if(type == dataType[0]){
			   var satelliteBtn = $("#satelliteBtn").val();
			   if(srcStr && srcStr.indexOf(dataType[1]) > -1){
				   flag = true;
				   if((type != 10001 || type != 10002 || type != 10003) && e==null){
                       if($("#satelliteMapSwitching").length==0){
                           //创建div
                           if(MapVesion == "openLayers"){
                               ToobarConfig.bulidSMSDiv();
                           }
                       }
				   }
			   }
			   if(!flag){
                   if((type==100) && e==null){
                       if($("#satelliteMapSwitching").length!=0) {
						   //删除div
						   $("#satelliteMapSwitching").remove();
					   }
				   }
			   }
			   srcStr = MapHandler.getBarImg(type, flag);
			   break;
		   }
	   }
	   $(obj).find("img").attr("src", srcStr);
		// if(type ==1||type ==4||type ==5||type ==5.1){
        var curStatus = MapToobar.chartTbStatusByType(type);
        if(curStatus){
            if(type == 100){
                ToobarConfig.updateResourcesHistoryRecord(type,1);
            }
            if( type == 5.1){
                ToobarConfig.updateResourcesHistoryRecord(type,1);
            }
        }else{
            if(type == 100){
                ToobarConfig.updateResourcesHistoryRecord(type,0);
            }
            if( type == 5.1){
                ToobarConfig.updateResourcesHistoryRecord(type,0);
            }
        }
        if(ResourceDatas.datas[type]){
            ResourceDatas.datas[type]["status"] = curStatus;
        }
		// }
	   // if(type == 1){
		//    ResourceDatas.gbControl= curStatus;
	   // }
	   setTimeout("MapToobar.initResourceChart("+type+")", 200);
	},
	deviceAbove:function(){
		var code = 863;
		var organId = $("#organId").val();
		if(organId){
			$.ajax({

				url:basePath + "web/organx/getOrganTypeCodeByOrganId.do",
				type:"post",
				dataType:"json",

				success:function(msg){
					if(msg.data==code){
						$("#devicePic").click();
					}
				}
			});
		}else{
			return;
		}
	},
	satelliteMap:function(){
		var sateBtn = $("#satelliteBtn").val();
		var sTrue = "true";
		if(sateBtn==sTrue){
			setTimeout(function(){$("#miliLayerPic").parent().click();},300);
		}else{
			return;
		}
	},
    bulidSMSDiv:function(){
		var c = "";
		c +="<div id='satelliteMapSwitching' class='xj-ditu-menu-hide'>";
        c +="<ul>";
        c +="<li id='baiduLi'><span onclick='MapManager.setSatelliteMap(null,1);ToobarConfig.updateResourcesHistoryRecord(100,2);'>百度地图</span></li>";
        c +="<li id='tatLi'><span onclick='MapManager.setSatelliteMap(null,2);ToobarConfig.updateResourcesHistoryRecord(100,2);'>天地图</span></li>";
        c +="</ul>";
        c +="</div>";
        $("#100configSpan").append(c);
    },buildHistoryRes:function(userId){
        $.ajax({

            url:basePath + "web/toolbar/list.do",
            type:"post",
            dataType:"json",
            success:function(msg){
                if(msg.code==200){
                    ToobarConfig.pesonalResource=msg.data;
                }
            }
        });
	},updateResourcesHistoryRecord:function(type,subType){
        $.ajax({
            url:basePath + "web/toolbar/updateResourcesHistoryRecord.do",
            type:"post",
            dataType:"json",
            data:{'type':type,'subType':subType},
            success:function(data){
                //alert(type +"="+subType);
            }
        });
	},deleteResourcesHistoryRecord:function(type,subType){
        $.ajax({
            url:basePath + "web/toolbar/delete.do",
            type:"post",
            dataType:"json",
            data:{'type':type,'subType':subType},
            success:function(data){
                //alert(type +"="+subType);
            }
        });
    }
}