$(function(){
	initMap();
	//获取辖区状态 
	/*popedomManager.initAreaResource();
	//加载右上角工具栏菜单
	ToobarConfig.initConfig();*/
	MainManager.initHtml();
	/*$("#cameraPic").removeAttr("onclick");
	MapToobar.initResourceDatas(true, $("#organId").val(),MainManager.initResourceDatasCallback);*/
    $("#mapdiv").height($(".main").height()-20);
    $("#mapdiv").width($(window).width()-$(".cg-left").width() - 15);
});
var MainManager = {
	initHtml:function(){
		$("#left-search-div").css("display","none");
  		if($("#cg-left-tree").val()==undefined){
  			$("#resourcePanel").css("left","144px");
  		}
  		$("#cg-left-tree").css("top","60px");
  		$("#left-treeview").css("height","420px");
       $(function(){
           $("#searchBtn").kendoButton({spriteCssClass: "k-icon k-i-search"});
       });
       var left = $("#resourcePanel").width() + $("#resourcePanel").offset().left - 5;
       $("#cgZoomBtn_list").css("left",left);
	}
	/**
     * 加载资源数据的回调函数
     * @param type 资源类型的type标识
     */
	/*initResourceDatasCallback:function(type){
		for(var i in resourceConfig.config){
            if(resourceConfig.config[i] instanceof Function){continue;}
            if(resourceConfig.config[i].id == type && resourceConfig.config[i].isShowOnMap == "true"
                && resourceConfig.config[i].isShowOnToobar == "true"){
                var obj = $("#"+resourceConfig.config[i].shortName + "Pic");
                if(type == 1){
                    $(obj).attr("onclick","ToobarConfig.chartToobar(this,1)");
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
                setTimeout(function(){ToobarConfig.chartToobar(obj,type);},300);
            }
        }
	},*/
   /**
   	* 接收gps推送过来的下线状态
   	* @param ob ===> gpsOffLine 下线唯一标识
    */
	/*pushGpsOffline:function(ob){
		var pId;
		//1、清除地图图标
		var resdatas=ResourceDatas.gpsResDatas;
		for(var j in resdatas){
			if(!resdatas[j] && resdatas[j] instanceof Function){return;};
			var enty=resdatas[j][ob.data];
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
			refreshOffLineNum(ob.data);
		}
	},*/
};

/**
 * chart(上图) 业务对象
 */
var ChartManager = {
   /**
   	* 初始化加载列表时。在线人员上图
   	* @param en 当前在线警员、警车对象
   	* @param type 默认上图的类型
    */
	doChartForOnline:function(en,type){
		if(!en.longitude || en.longitude == "" || !en.latitude || en.latitude == ""){
			return;
		}
   		if(type == 5 || !ResourceDatas.policeControl){
   			return ;
   		}
   		ResourceDatas.datas[type]["status"]=true;
   		if(en.longitude == "" || en.latitude == "") return ;
   		var id ;
   		if(!en.data){
   			id = en.detailInfo.id;
   			en.data = en.detailInfo;
   		}else{
   			id = en.data.id;
   			en.data.areaInfos=en.areaInfo;
   		}
   		var isexites=new MapEntity();
   		isexites.id=id;
   		isexites.type=type;
   		isexites.layerName=layerName.policeLayer;
   		isexites.showType = "vectorLayer";
   		var point=MapManager.getResourceChartById(isexites);
   		//如果存在则不用上图
   		if(point && point.attributes){
   			return;
   		}
   		var enty = new MapEntity();
   		enty.id=id;
   		enty.type=type;
   		enty.height=22;
   		enty.widht=22;
		enty.isTitle = true;//显示label标识
   		enty.detailInfo=en.data;
   		enty.longitude=en.longitude;
   		enty.latitude=en.latitude;
   		enty.layerName = layerName.policeLayer;
   		enty.action="click";
   		enty.callback=function(event){
			MapToobar.openInfoWindow(enty);
		}
   		if(type == 4){
   			enty.name=en.data.name;
   			enty.iconUrl=MapHandler.getBarImgByType(4,en.data.typeId,false);
   		}
   		else{
   			enty.iconUrl=MapHandler.getBarImgByType(5,en.data.purposeId,false);
   			enty.name=en.data.number;
   		}
		MapManager.createPointOnly(enty);
		//给地图数据源赋值
		var pmdatas = ResourceDatas.datas[4].data;
		pmdatas[enty.id].longitude = en.longitude;
		pmdatas[enty.id].latitude = en.latitude;
	},
	/**
	 * 点击设备id 居中、高亮
	 * @param deviceId 设备id
	 */
	gotoCenterByDevice:function(deviceId){
		var device = ResourceDatas.datas[tempType].data[deviceId];
		ChartManager.showHighLightChart(device);
	},
	/**
   	 * 切换资源列表高亮上图
   	 * @param en 单击每列时传入对象
     */
	showHighLightChart:function(en){
		MapManager.setCenter(en);
		if(en.type == 4){
			en.layerName = layerName.policeLayer;
			if(!ResourceDatas.policeControl)
				return;
			//如果有单兵对象,不改变图标。只定位
			var dbFlag = ResourceDatas.DBinDatas[en.id];
			if(dbFlag && dbFlag != null){
				return;
			}
		}else if(en.type == 5){
			en.layerName = layerName.policeCarLayer;
		}else if(en.type == 5.2){
			if(!ResourceDatas.alarmDeviceControl){
				return;
			}
			en.layerName = layerName.partMarkerLayer;
		}
		//清除图标
		MapToobar.clearVectorMarkerProByIdType(en);

		if(ResourceDatas.GPSSelected["hight"]){
			var enty = ResourceDatas.GPSSelected["hight"];
			MapToobar.clearVectorMarkerProByIdType(enty);
			//处理是否还原高亮图标
			if(enty.type == 4 && ResourceDatas.policeControl){
		   		ChartManager.restoreVector(enty);
	    	}else if(enty.type == 5 && ResourceDatas.policeCarControl){
	    		ChartManager.restoreVector(enty);
	    	}else if(enty.type == 5.2 && ResourceDatas.alarmDeviceControl){
	    		ChartManager.restoreVector(enty);
	    	}
		}
		//处理图标
		if(en.type == 4){
		   en.iconUrl=MapHandler.getBarImgByType(en.type,en.detailInfo.typeId,true);
	    }else if(en.type == 5){
		   en.iconUrl=MapHandler.getBarImgByType(en.type,en.detailInfo.purposeId,true);
	    }else if(en.type == 5.2){
	       en.iconUrl=MapHandler.getImgUrl(5.24);
	    }
	    //en.isTitle = true;
		en.action="click";
		en.callback=function(event){
			MapToobar.openInfoWindow(en);
		};
		MapManager.createPointOnly(en);
		//高亮对象重新赋值
		//高亮的唯一标识
		ResourceDatas.GPSSelected["hight"] = en;
	},
	/**
   	* 清除单个对象marker
    */
	clearMarkByObj:function(obj){
		var enty=obj;
	    MapToobar.clearVectorMarkerProByIdType(enty);
	},
  /**
   * 切换标签清除高亮图标---恢复原型图标
   * @param obj  高亮对象
   */
	restoreVector:function(obj){
	   var enty = obj;
	   enty.isTitle = true;
	   if(enty.type == 4){
		   enty.iconUrl=MapHandler.getBarImgByType(4,enty.detailInfo.typeId,false);
		   enty.layerName = layerName.policeLayer;
	   }else if(enty.type == 5){
	   		enty.iconUrl=MapHandler.getBarImgByType(5,enty.detailInfo.purposeId,false);
		    enty.layerName = layerName.policeCarLayer;
	   }else if(enty.type == 5.2){
		   enty.iconUrl=MapHandler.getImgUrl(5.23);
		   enty.layerName = layerName.partMarkerLayer;
		   enty.isTitle = false;
	   }
		enty.action="click";
		enty.callback=function(event){
			MapToobar.openInfoWindow(enty);
		};
		
		MapManager.createPointOnly(enty);
	},
	/**
   	 * 切换标签时，清除所有高亮图标
     */
	clearHighLightMarker:function(){
		//gps高亮
	   if(ResourceDatas.GPSSelected["hight"]){
	   		var en = ResourceDatas.GPSSelected["hight"];
	   	    ChartManager.clearMarkByObj(en);
	   	    if(en.type == 4 && ResourceDatas.policeControl){
	   	    	 ChartManager.restoreVector(en);
	   	    }else if(en.type == 5 && ResourceDatas.policeCarControl){
	   	    	ChartManager.restoreVector(en);
	   	    }else if(en.type == 5.2 && ResourceDatas.alarmDeviceControl){
	   	    	ChartManager.restoreVector(en);
	   	    }
	   	    ResourceDatas.GPSSelected["hight"] = null;
	   }
	   //天网有高亮图标
	   if(ResourceDatas.GBHight["hight"]){
			var enty=ResourceDatas.GBHight["hight"];
			//删除Marker对象再上图
			ResourceDatas.GBSelected[enty.id]=null;
			ResourceDatas.GBHight["hight"] = null;
			MapManager.clearOverlayByIdType(enty);

			enty.action="click";
			enty.callback=MapToobar.openInfoWindow;
			if(enty.type == 1.1 && !resourceChartStatus.cameraControl){
				return;
			}
			if(enty.type == 1.2){
				enty.layerName = layerName.vectorSHDWLayer;
			}else if(enty.type == 1 || enty.type == 1.1){
				enty.layerName = layerName.vectorGBLayer;
			}
			enty.iconUrl = MapHandler.getImgUrl(enty.type);
			MapManager.createPointOnly(enty);
		}
	},
	/**
	 * 控制天网高亮
	 * @param entity
	 * @param currentList
	 * @param type
	 */
	showHightCamera:function(entity,currentList,type){
	   if(type == 1){type = 1.1;}
	   for(var j in currentList){
		   if(currentList[j].id==entity.id){
			   var en=new MapEntity();
			   en.id=currentList[j].id;
			   en.type=type;
			   en.name=currentList[j].name;
			   if(type == 1.1 || type == 1){
			   		en.layerName = layerName.vectorGBLayer;
			   		en.iconUrl=MapHandler.getImgUrl(1.11);
			   }else if(type == 1.2){
			   		en.layerName = layerName.vectorSHDWLayer;
			   		en.iconUrl=MapHandler.getImgUrl(1.21);
			   }
			   en.latitude=currentList[j].latitude;
			   en.longitude=currentList[j].longitude;
			   en.detailInfo=currentList[j];
			   MapManager.setCenter(en);
			   if(!en.latitude || !en.longitude || en.latitude =="0.0" || en.longitude=="0.0"){
				   return;
			   }
			   //删除marker要素
			   MapManager.clearOverlayByIdType(en);

				if(ResourceDatas.GBHight["hight"]){
					var enty=ResourceDatas.GBHight["hight"];
					if(enty.latitude ==  en.latitude 
						&& enty.longitude ==  en.longitude){
						 MapManager.setCenter(enty);
					}
					var img,flag = false;
					flag = enty.detailInfo.detailInfo.detailInfo.isShare;
					if(flag == true){
						if(type == 1.1){
							img = MapHandler.getImgUrl(1.12);
						}else{
							img = MapHandler.getImgUrl(1.22);
						}
					}else{
						if(type == 1.1){
							img = MapHandler.getImgUrl(1);
						}else{
							img = MapHandler.getImgUrl(1.2);
						}
					}
					enty.iconUrl = img;
					MapManager.clearOverlayByIdType(enty);
					//删除警员marker高亮要素
					ResourceDatas.GBSelected[enty.id]=null;//聚合需要
					ResourceDatas.GBHight["hight"] = null;
					
					if(type == 1.1 && ResourceDatas.gbControl){//当右上角控制为显示时再去重新还原上图
						//MapManager.doResourceChart(enty); //聚合时使用
						MapManager.createPointOnly(enty);
					}
				}
				//添加 被选中天网的 全局变量
	   			ResourceDatas.GBSelected[en.id]=en.detailInfo.id;
	   			ResourceDatas.GBHight["hight"] = en;
	   			en.action="click";
				en.callback=MapToobar.openInfoWindow;
	   			//MapManager.doResourceChart(en); // 聚合时使用
	   			MapManager.createPointOnly(en);
		   }
	   }
	}
};

/**
 * 日期处理
 */
var query_Gps_trail={};
var convertDate = function (dates){
   var years = dates.getFullYear();
	var months = dates.getMonth() + 1;
	var days = dates.getDate();

	if(months<10){
		months = "0"+months;
	}
	if(days<10){
		days = "0"+days;
	}
	query_Gps_trail.startDate=years + "-" + months + "-" + days+" "+"00:00:00";
	query_Gps_trail.endDate=years + "-" + months + "-" + days+" "+"23:59:59";
	query_Gps_trail.gpsId="";
}
/**
 * 将字符串转变成日期
 * @param strDate yyy/MM/dd
 * @returns
 */
function getDate(strDate) {
	   var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
    function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
		date.setMonth(date.getMonth()-1);
    return date;
}

//点击机构触发事件
var loadData = function(){
	//1、控制上图工具条
	clearToobar();
	setTimeout(function(){
		//2、刷新数据列表
		MapToobar.initResourceDatas(true, $("#organId").val(),MainManager.initResourceDatasCallback);
		//window.location.href=basePath+"map/initGridPatrol.action?organId="+$("#organId").val()+"&organPath="+$("#organPath").val();
		//获取辖区状态 
		popedomManager.initAreaResource();
	},500);
}
/**
 * 清除工具条数据源
 */
var clearToobar = function(){
	if(ResourceDatas.policeControl){
		ToobarConfig.chartToobar($("#policePic"),4);
	}
	if(ResourceDatas.orgResourceControl){
		ToobarConfig.chartToobar($("#orgSourcePic"),5.1);
	}
	if(ResourceDatas.alarmDeviceControl){
		ToobarConfig.chartToobar($("#devicePic"),5.2);
	}
	if(ResourceDatas.gbControl){
		ToobarConfig.chartToobar($("#cameraPic"),1);
	}
	
	//清理缓存对象
	ResourceDatas.PGroupDatas = [];
	trailManager.curTempDatas = [];
}

/* 描述：js实现的map方法
 * put(key,value) 添加元素
 * get(key) 获取元素
 * remove(key) 移出元素
 * removeAll 移出所有元素
 * @returns {Map}
 */
function Map() {
	var struct = function(key, value) {
		this.key = key;
		this.value = value;
	};
	// 添加map键值对
	var put = function(key, value) {
		for ( var i = 0; i < this.arr.length; i++) {
			if (this.arr[i].key === key) {
				this.arr[i].value = value;
				return;
			}
		}
		;
		this.arr[this.arr.length] = new struct(key, value);
	};
	// 根据key获取value
	var get = function(key) {
		for ( var i = 0; i < this.arr.length; i++) {
			if (this.arr[i].key === key) {
				return this.arr[i].value;
			}
		}
		return null;
	};
	// 根据key删除
	var remove = function(key) {
		var v;
		for ( var i = 0; i < this.arr.length; i++) {
			v = this.arr.pop();
			if (v.key === key) {
				continue;
			}
			this.arr.unshift(v);
		}
	};
	//移出所有
	var removeAll = function() {
		this.arr.length = 0;
	};

	// 获取map键值对个数
	var size = function() {
		return this.arr.length;
	};
	// 判断map是否为空
	var isEmpty = function() {
		return this.arr.length <= 0;
	};
	this.arr = new Array();
	this.get = get;
	this.put = put;
	this.remove = remove;
	this.removeAll = removeAll;
	this.size = size;
	this.isEmpty = isEmpty;
}