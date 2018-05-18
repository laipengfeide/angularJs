//20170601 nishaodong 从超图中剥离出来的业务方法 start
//地图版本 SuperMap,baidu,PGIS_1.6,openLayers
var MapVesion = "baidu";

//上图显示标注标题的层级
var showMarkerLabel=17;
// 地图、动态 REST 图层
var map, layer,miliLayer,miliLineLayer,miliBounds,partMiLayer;
//地图名称、动态 REST 图层名称、动态 REST 图层url、分析缓冲使用的url
var mapName = "map", baseLayerName = "layer",url = "http://api.map.baidu.com/api?v=2.0&s=1&ak=Mdvm15iZXlzZuc4UgAdywcdBRT7Z2IWM", analyUrl = "";
//地图显示中心的经纬度、初始图层
var mapCenLon = 87.69651,mapCenLat = 43.91873,mapZoom = 9;
var enableEvent  = true;
var currentNode = "";
// 控件初始参数
var isPanzoombar = false, //复杂缩放控件类   
isOverviewmap = false,//鹰眼控件  
isScaleline = false,//比例尺控件   
isLayerSwitcher = false, //图层控制控件 
isNavigation = true,//鼠标事件（拖拽，双击、鼠标滚轮缩放）的地图浏览控件  
isMousePosition = false;//鼠标点地理坐标控件
//是否初始化资源数据
var isInitResourceDatas = false;
//mq链接错误次数 (count--累计次数；alarmNum--强制刷新的阈值； count > alarmNum时就强制刷新界面 20170922)
var mq_connection_error = {
	count: 0,
	alarmNum: 55
};


//全局变量，默认的图层名称
var layerName = {
	markerLayer: "markerLayer",
	policeLayer : "policeLayer",
	policeCarLayer : "policeCarLayer",
	vectorLayer: "vectorLayer",
	editVectorLayer: "editVectorLayer",
	heatLayer: "heatLayer",
	vectorGBLayer:"vectorGBLayer",
	vectorSHDWLayer:"vectorSHDWLayer",
	partMarkerLayer:"partMarkerLayer",//部件
	vectorSJLayer:"vectorSJLayer", // 此处用作 警务站图层
	serPointLayer:"serPointLayer",//便民服务点
	alarmLayer:"alarmLayer",//警情
	gatherLayer:"gatherLayer"//聚合图层
};

/**
 * 实体类 （卡口、卡点、天网、警员、警车 等等）
 * @param entity 实体属性参数
 * @returns
 */
function MapEntity(entity){
	if(entity){
		// 类型, 1：天网、2： 卡口、 3：卡点、4：警员:5：警车、6：巡区:、7：社区、8：辖区
		this.type = entity.type; 
		//显示类型
		this.showType = entity.showType;
		//标识id
		this.id = entity.id; 
		//名称
		this.name = entity.name; 
		//内容描述
		this.content = entity.content;
		//图片路径
		this.iconUrl = entity.iconUrl; 
		//图片宽
		this.width = entity.width;
		//图片高
		this.height = entity.height;
		//纬度
		this.latitude = entity.latitude;		
		//经度
		this.longitude = entity.longitude;
		//半径
		this.radius = entity.radius;
		//层级
		this.zoom = entity.zoom;
		//距离
		this.distance = entity.distance;
		//创建时间
		this.createDate = entity.createDate;  
		//图层名称
		this.layerName = entity.layerName;
		//样式
		this.style = entity.style;
		//是否显示标题
		this.isTitle = entity.isTitle;
		//title样式
		this.titleStyle = entity.titleStyle;
		//点坐标数据(数组，格式:[[113,19],[107,-2],[92,13],[90,21],[82,12]])
		this.pointDatas = entity.pointDatas;
		//备注说明
		this.des = entity.des;	
		//是否有效，是否工作
		this.isWork = entity.isWork;
		//是否被选择
		this.isSelect = entity.isSelect;
		//是否在线
		this.isOnLine = entity.isOnLine
		// 其他属性信息(对象)
		this.detailInfo = entity.detailInfo; 
		//操作的目标对象
		this.targetObj = entity.targetObj;
		//事件类型："click"点击事件；"dbclick"双击事件
		this.action = entity.action;
		//回调函数
		this.callback = entity.callback;
		//失败的回调函数
		this.failCallback = entity.failCallback;
		// 参数集合（一般为数组）
		this.params = entity.params;
	}

	this.setType = function(type){
		this.type = type;
	};
	this.setId = function(id){
		this.id = id;
	};
	this.setName = function(name){
		this.name = name;
	};
	this.setContent = function(content){
		this.content = content;
	};
	this.setIconUrl = function(iconUrl){
		this.iconUrl = iconUrl;
	};
	this.setWidth = function(width){
		this.width = width;
	};
	this.setHeight = function(height){
		this.height = height;
	};
	this.setLatitude = function(lat){
		this.latitude = lat;
	};
	this.setLongitude = function(lon){
		this.longitude = lon;
	};
	this.setStyle = function(sty){
		this.style = sty;
	};
	this.setPointDatas = function(pointDatas){
		this.pointDatas = pointDatas;
	};
	this.setDes = function(des){
		this.des = des;
	};
	this.setCreateDate = function(createDate){
		this.createDate = createDate;
	};
	this.setDetailInfo = function(dInfo){
		this.detailInfo = dInfo;
	};
}
//创建EventUtil对象
var EventUtil={
    addHandler:function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }
       else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
       }
    },
    getEvent:function(event){
        return event?event:window.event;
    },
    //取消事件的默认行为
    preventDefault:function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue= false;
        }
    },
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    }
};
function bIsContain(pQuerys,pQuery){
	var bIs=false;
	for(var i=0;i<pQuerys.length;i++){
		var pTmp=pQuerys[i];
		if(pTmp.queryType==pQuery.queryType && pTmp.coords==pQuery.coords && pTmp.radius==pQuery.radius ){
			bIs=true;
			break;
		}
	}
	return bIs;
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
//20170601 nishaodong 从超图中剥离出来的业务方法 end

(function() {
	var basePath = 'http://127.0.0.1:8088/pcenter';
	//引入坐标转换工具
	document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"/JS/map/common/point_convertor.js\"></script>");
	//引入地图插件js等文件
	if(MapVesion=='SuperMap'){
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/supermap8/libs/SuperMap.Include.js\"></script>");
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/map_SuperMap.js\"></script>");
		<!--加载轨迹运动工具-->
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/trail/replayingTrace_SuperMap.js\"></script>");
	}else if(MapVesion=='baidu'){
		/*document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\"http://api.map.baidu.com/api?v=2.0&s=1&ak=63c4ca91e854d14a9cbdd8f7cf663071\"></script>");*/
		// 使用离线 百度js插件（优化网络慢加载地图，白屏问题）20170928
		//document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+url+"\"></script>");
		document.writeln("<link type=\"text/css\" href=\""+basePath+"JS/map/baidu/baidu.css\"  rel=\"stylesheet\"/>");
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"/JS/map/baidu/apiv2.0.min.js\"></script>");
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"/JS/map/baidu/CurveLine.min.js\"></script>");
		<!--加载鼠标绘制工具-->
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"/JS/map/baidu/DrawingManager_min.js\"></script>");
		document.writeln("<link rel=\"stylesheet\" href=\""+basePath+"/JS/map/baidu/DrawingManager_min.css\" />");
		<!--加载轨迹运动工具-->
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"/JS/map/baidu/LuShu.js\"></script>");
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/trail/replayingTrace_baidu.js\"></script>");
		
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/map_baidu.js\"></script>");
	}else if(MapVesion=='gaode'){
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\"http://webapi.amap.com/maps?v=1.3&key=ce0c8becdf42c5bac16b9dec9e6355d7\"></script>");
		
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\"http://webapi.amap.com/ui/1.0/main.js\"></script>");
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\"map_gaode.js\"></script>");
	}else if(MapVesion=='PGIS_1.6'){
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/map_pgs.js\"></script>");
	}else if(MapVesion=='openLayers'){
		document.writeln("<link type=\"text/css\" href=\""+basePath+"JS/map/openLayers/custom.css\"  rel=\"stylesheet\"/>");
        document.writeln("<link type=\"text/css\" href=\""+basePath+"JS/map/openLayers/ol.css\"  rel=\"stylesheet\"/>");
        document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/openLayers/ol-debug.js\"></script>");
        document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/map_openLayers.js\"></script>");
		<!--加载轨迹运动工具-->
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"/JS/map/openLayers/LuShu_3857.js\"></script>");
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/trail/replayingTrace_openLayers.js\"></script>");   
		
		document.writeln("<script type=\"text/javascript\" charset=\"utf-8\" src=\""+basePath+"JS/map/openLayers/baselayer.js\"></script>");

	}
	
	
})();

