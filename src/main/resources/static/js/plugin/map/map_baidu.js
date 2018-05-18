//控件声明
var panzoombar,overviewmap,scaleline;
//地图初始控件、事件绑定
var initControls = [], eventListeners = new Object();

var point = null;//天网全局矢量图层
//画点、线、矩形、面对象
var drawControl = null;
//编辑控件、选择控件
var editFeature = null, selectFeature = null;

/**
 * 初始化地图
 * @returns
 */
function initMap(mName){
	// 初始化地图
	map = MapManager.getMapInstance(mapName);
//	setTimeout(function(){
//		map = MapManager.getMapInstance(mapName)
//	}, 100);
	// 初始化地图控件
	initControl();
	//map.addEventListener("click", showInfo);
	// zoom操作完成后被触发
    map.addEventListener("zoomend",function(type,tag){
    	console.log("当前层数1:"+MapManager.getZoom());
        //机构上图
        MapToobar.moveChanged();
        if(enableEvent){
        	MapToobar.zooChanged();
		}
    });
	map.addEventListener("moveend",function(type,tag){
		console.log("当前层数2:"+MapManager.getZoom());
        MapToobar.zooChanged();
	});
    return map;
}

/**
 * 初始化地图控件
 */
function initControl(){
	//复杂缩放控件类
	if(isPanzoombar) MapManager.getMap().addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
	// 比例尺控件
	if(isScaleline) MapManager.getMap().addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));  
	// 鹰眼控件
	if(isOverviewmap) MapManager.getMap().addControl(new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
	if(isOverviewmap) MapManager.getMap().addControl(new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
//	MapManager.getMap().addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));
	//MapManager.getMap().setMapType(BMAP_HYBRID_MAP);   //设置地图类型

}
/**
 * 地图管理类
 */
var MapManager = {
		/*设置rest图层url*/
		setUrl:function(rurl){
			url = rurl;
		},
		/*分析缓冲使用的url*/
		setAnalyUrl: function(aurl){
			analyUrl = aurl;
		},
		/*万米单元网格使用url*/
		setMiliUrl:function(murl){
			miliUrl=murl;
		},	
		/*万米单元网格使用基层数据集*/
		setMiliBaseName:function(mbname){
			miliBaseName=mbname;
		},	
		/*部件数据集后缀*/
		setPartBaseName:function(pbname){
			partBaseName=pbname;
		},
		/*万米单元网格图层透明度*/
		setLayerOpacity:function(opacity){
			layerOpacity=opacity;
		},
		/*部件获取url*/
		setPartUrl:function(paurl){
			partUrl=paurl;
		},
		/*特级街道颜色*/
		setSpecialStreetColor: function(ssColor){
			sstreetColor = ssColor;
		},
		/*一级街道颜色*/
		setOneStreetColor: function(oneColor){
			oneStreetColor = oneColor;
		},
		/*二级街道颜色*/
		setTwoStreetColor: function(twoColor){
			twoStreetColor = twoColor;
		},
		/*三级街道颜色*/
		setThreeStreetColor: function(threeColor){
			threeStreetColor = threeColor;
		},
		/*特级街道宽度*/
		setSpecialStreetWid: function(ssWid){
			specialStreetWid = ssWid;
		},
		/*一级街道宽度*/
		setOneStreetWid: function(oneColor){
			oneStreetWid = oneColor;
		},
		/*二级街道宽度*/
		setTwoStreetWid: function(twoWid){
			twoStreetWid = twoWid;
		},
		/*三级街道宽度*/
		setThreeStreetWid: function(threeWid){
			threeStreetWid = threeWid;
		},
		/*环卫管理半径大小*/
		setSanitationLineRadius: function(lineRadius){
			sanitationLineRadius = lineRadius;
		},
		/*环卫管理缓冲区指定点数量*/
		setSanitationLineSegment:function(lineSegment){
			sanitationLineSegment = lineSegment;
		},
		/*MQ推送使用的url*/
		setMqUrl: function(mUrl){
			mqUrl = mUrl
		},
		setGatherLevel: function(gLevel){
            gatherLevel = gLevel
		},
		getGatherLevel:function(){
			return gatherLevel;
		},
		/*MQ的用户名*/
		setMqUserName: function(mUserName){
			mqUserName = mUserName
		},
		/*MQ的密码*/
		setMqPassword: function(mPassword){
			mqPassword = mPassword
		},		
		/*是否初始化资源数据*/
		setIsInitResourceDatas: function(initRes){
			isInitResourceDatas = initRes;
		},
		/*是否显示鹰眼控件*/
		setOverviewmap:function(bo){
			isOverviewmap = bo;
		},
		/*是否显示比例控件*/
		setScaleline:function(bo){
			isScaleline = bo;
		},
		/*获取map对象*/
		getMap: function(){
			return map;
		},
		/*地图初始化中心坐标*/
		setMapCenLon:function(lon){
			mapCenLon = lon;
		},
		/*地图初始化中心坐标*/
		setMapCenLat:function(lat){
			mapCenLat = lat;
		},
		/*重保距离配置*/
		setShigeyasuMeter:function(meter){
			shigeyasuMeter = meter;
		},
		/*设置地图初始化时缩放的图层*/
		setMapZoom:function(zoom){
			mapZoom = zoom;
		},
		/*获取地图初始化时缩放的图层*/
		getMapZoom:function(){
			return mapZoom;
		},
		/*获取地图的当前层级*/
		getZoom: function(){
			return MapManager.getMap().getZoom();
		},
		/*获取重保距离*/
		getShigeyasuMeter: function(){
			return shigeyasuMeter;
		},
		/*获取rest图层url*/
		getUrl:function(){
			return url;
		},
		/*获取分析缓冲使用的url*/
		getAnalyUrl: function(){
			return analyUrl;
		},
		/*获取万米单元网格使用的url*/
		getMiliUrl:function(){
			return miliUrl;
		},
		/*获取万米单元网格使用的基层数据集*/
		getMiliBaseName:function(){
			return miliBaseName;
		},
		/*获取部件数据集后缀*/
		getPartBaseName:function(){
			return partBaseName;
		},
		/*获取万米单元网格图层透明度*/
		getLayerOpacity:function(){
			return layerOpacity;
		},
		/*获取部件使用的url*/
		getPartUrl:function(){
			return partUrl;
		},

		/*获取特级街道颜色*/
		getSpecialStreetColor: function(){
			return sstreetColor;
		},
		/*获取一级街道颜色*/
		getOneStreetColor: function(){
			return oneStreetColor;
		},
		/*获取二级街道颜色*/
		getTwoStreetColor: function(){
			return twoStreetColor;
		},
		/*获取三级街道颜色*/
		getThreeStreetColor: function(){
			return threeStreetColor;
		},
		/*特级街道宽度*/
		getSpecialStreetWid: function(){
			return specialStreetWid;
		},
		/*一级街道宽度*/
		getOneStreetWid: function(){
			return oneStreetWid;
		},
		/*二级街道宽度*/
		getTwoStreetWid: function(){
			return twoStreetWid;
		},
		/*三级街道宽度*/
		getThreeStreetWid: function(){
			return threeStreetWid;
		},
		/*环卫管理半径大小*/
		getSanitationLineRadius: function(){
			return sanitationLineRadius;
		},
		/*环卫管理半径大小*/
		getSanitationLineSegment: function(){
			return sanitationLineSegment;
		},		
		
		/*将地图缩放到指定级别*/
		zoomTo: function(zoom){
			if(zoom == undefined){
				return;
			}
			MapManager.getMap().enableScrollWheelZoom(true);
			MapManager.getMap().setZoom(zoom); 
		},
		/*通过坐标设置地图的显示中心*/
		setCenter: function(entity){
			if(!entity.longitude || entity.longitude == "NaN" 
				|| !entity.latitude || entity.latitude == "NaN"
					|| Number(entity.longitude) == 0.0 || Number(entity.longitude) == 0
					|| Number(entity.latitude) == 0.0 || Number(entity.latitude) == 0){//无经纬度，则不做操作
				return;
			}
			var zoom = entity.zoom ? entity.zoom : MapManager.getZoom();
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(entity.longitude), parseFloat(entity.latitude));
			var point = new BMap.Point(srcP[0], srcP[1]);
			
			MapManager.getMap().setZoom(zoom); 
			MapManager.getMap().setCenter(point);
			MapManager.getMap().enableScrollWheelZoom(true);
		},
		/**
		 * 初始化地图
		 * @param name 地图名称
		 * @param initControls 初始加载的控件
		 */
		getMapInstance: function(name){
			// 百度地图API功能
			map = new BMap.Map(name,{enableMapClick:false//是否开启底图可点功能
			});    // 创建Map实例
			//设置地图背景
//			map.setMapStyle({style:'midnight'});
//			map.setMapStyle({style:'grassgreen'});
//			map.setMapStyle({style:'light'});
//			map.setMapStyle({style:'dark'});
			map.centerAndZoom(new BMap.Point(mapCenLon, mapCenLat), mapZoom);  // 初始化地图,设置中心点坐标和地图级别
//			map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));   //添加地图类型控件
			map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
			map.disableDoubleClickZoom();     //禁用双击放大。
			return map;
		},
		/**
		 * 初始化动态 REST 图层
		 */
		getLayerInstance: function (name, url, params, options){
			var layer = new BMap.Layer.TiledDynamicRESTLayer(name, url, params, options);
			return layer;
		},
		/**
		 * 获取地图可视区的四个顶点坐标
		 * @returns {___en0}
		 */
		getBounds: function(){
			var en = [];
			var bs = MapManager.getMap().getBounds();   //获取可视区域
			var bssw = bs.getSouthWest();   //可视区域左下角
			bssw=bd09towgs84(parseFloat(bssw.lng), parseFloat(bssw.lat));
			var bsne = bs.getNorthEast();   //可视区域右上角
			bsne=bd09towgs84(parseFloat(bsne.lng), parseFloat(bsne.lat));
			//en = [{x: bssw[0], y: bssw[1]}, {x:bssw[0],y: bsne[1]}, {x: bsne[0],y: bssw[1]}, {x: bsne[0],y: bsne[1]}];
			en = [{x: bssw[0], y: bssw[1]}, {x:bsne[0],y: bssw[1]}, {x: bsne[0],y: bsne[1]}, {x: bssw[0],y: bsne[1]}];
//			en = [{x: bssw.lng, y: bssw.lat}, {x: bssw.lng,y: bsne.lat}, {x: bsne[.lng],y: bssw.lat}, {x: bsne.lng,y: bsne.lat}];
			return en;
		},
		/**
		 * 获取资源指定id的浮标
		 * @param en.id Marker对象的id参数值
		 * @param en.layerName Marker所显示的图层名称
		 */
		getMarkerById:function(en){
			var allOverlay = MapManager.getMap().getOverlays();
			var len = allOverlay.length;
			var obj=null;
			var isEx = false;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.id == en.id){
					isEx = true;	
					break;
				}
			}
			if(isEx == true)
        		return obj;
		},
		/**
		 * 获取浮标指定type的浮标列表
		 * @param en.type Marker对象的type参数值
		 * @param en.layerName Marker所显示的图层名称
		 */
		getMarkerByType:function(en){
			var allOverlay = MapManager.getMap().getOverlays();
			var len = allOverlay.length;
			var obj=null;
			var isEx = false;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.type == en.type){
					isEx = true;	
					break;
				}
			}
			if(isEx == true)
        		return obj;
		},
		/**
		 * 获取资源指定id & type的浮标
		 * @param en.id Marker对象的id参数值
		 * @param en.type Marker对象的type参数值
		 * @param en.layerName Marker所显示的图层名称
		 */
		getMarkerByIdType:function(en){
			var allOverlay = MapManager.getMap().getOverlays();
			var len = allOverlay.length;
			var obj=null;
			var isEx = false;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.type == en.type
						&&obj.attributes.entity.id == en.id){
					isEx = true;		
					break;
				}
			}
			if(isEx == true)
        		return obj;
		},
		/**
		 * 获取资源指定id的对象
		 * @param en.id 资源对象的id参数值
		 * @param en.layerName 资源所显示的图层名称
		 */
		getOverlayById:function(en){
        	return this.getMarkerById(en);
		},
		/**
		 * 获取资源指定id & type的对象
		 * @param en.id 资源对象的id参数值
		 * @param en.type 资源对象的type参数值
		 * @param en.layerName 资源所显示的图层名称
		 */
		getOverlayByIdType:function(en){
        	return this.getMarkerByIdType(en);
		},
		/**
		 * 地图监听事件
		 * @param action 事件类型："click"点击事件；“dbclick”双击事件
		 * @param func 响应方法
		 */
		addMapEventListener: function(action,func){
			MapManager.getMap().addEventListener(action,func);
		},
		/**
		 * 回调函数，用于监听地图状态变换时（包括地图拖放、放大、缩小等地图状态变
		 * @param en
		 */
		addMapChangeListener: function (en){
			//moveend -- drag，pan或zoom操作完成时被触发
			MapManager.getMap().events.on({"moveend": en.callback});
		},
		/**
		 * 激活绘制控件
		 * @param en.showType 控件类型（绘制点、线、面等）如：BMap.Handler.Point、BMap.Handler.Path等
		 * @param en.layerName 资源所显示的图层名称
		 * @param en.callback 绘制完成后的回调函数
		 */
		drawDragMode: function(en){
			if(drawControl) {
				drawControl = null;			
			}
			var styleOptions = {
		            strokeColor:"red",    //边线颜色。
		            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
		            strokeWeight: 3,       //边线的宽度，以像素为单位。
		            strokeOpacity: 0.3,	   //边线透明度，取值范围0 - 1。
		            fillOpacity: 0.03,      //填充的透明度，取值范围0 - 1。
		            strokeStyle: 'solid' //边线的样式，solid或dashed。
		        }	
			//实例化鼠标绘制工具
	        drawControl = new BMapLib.DrawingManager(MapManager.getMap(), {
	            isOpen: false, //是否开启绘制模式
	            enableDrawingTool: false, //是否显示工具栏
	            drawingToolOptions: {
	                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
	                offset: new BMap.Size(5, 5), //偏离值
	            },
	            circleOptions: styleOptions, //圆的样式
	            polylineOptions: styleOptions, //线的样式
	            polygonOptions: styleOptions, //多边形的样式
	            rectangleOptions: styleOptions //矩形的样式
	        });
			  
			if(en.showType == MapConstant.Point){ //画点入口
	        	drawControl.setDrawingMode(BMAP_DRAWING_MARKER);
				//添加鼠标绘制工具监听事件，用于获取绘制结果
		        drawControl.addEventListener('markercomplete', function(e, marker){
		        	 drawControl.close();
		        	 //20170601 nishaodong 返回wgs84坐标
					 var srcP=bd09towgs84(parseFloat(marker.getPosition().lng), parseFloat(marker.getPosition().lat));
		        	 en.longitude = srcP[0];
					 en.latitude = srcP[1];
//		        	 en.longitude = marker.getPosition().lng;
//					 en.latitude = marker.getPosition().lat;
					 
		        	 en.callback(en);
		        	 MapManager.getMap().removeOverlay(marker);
		        });	
		        drawControl.open();
				
			}else if(en.showType == MapConstant.Path){ //画线入口
				drawControl.setDrawingMode(BMAP_DRAWING_POLYLINE);
				//添加鼠标绘制工具监听事件，用于获取绘制结果
		        drawControl.addEventListener('polylinecomplete', function(polyline){
		        	 drawControl.close();
		        	 
		        	 var pGeos = polyline.getPath();
		        	 var points=[];
					 for(var i = 0;i < pGeos.length; i++){
			        	//20170601 nishaodong 返回wgs84坐标
						var srcP=bd09towgs84(parseFloat(pGeos[i].lng), parseFloat(pGeos[i].lat));
						points.push([srcP[0], srcP[1]]);
						
//						points.push([pGeos[i].lng, pGeos[i].lat]);
					 }
					 
					 en.pointDatas = points;
		        	 en.callback(en);
		        	 
		        	 MapManager.getMap().removeOverlay(polyline);
		        });	
		        drawControl.open();
				
			}else if(en.showType == MapConstant.Polygon){ //画多边形入口
				drawControl.setDrawingMode(BMAP_DRAWING_POLYGON);
				//添加鼠标绘制工具监听事件，用于获取绘制结果
		        drawControl.addEventListener('polygoncomplete', function(polygon){
		        	 drawControl.close();
		        	 var pGeos = polygon.getPath();
		        	 var points=[];
					 for(var i = 0;i < pGeos.length; i++){
			        	//20170601 nishaodong 返回wgs84坐标
						var srcP=bd09towgs84(parseFloat(pGeos[i].lng), parseFloat(pGeos[i].lat));
						points.push([srcP[0], srcP[1]]);					 	
//						points.push([pGeos[i].lng, pGeos[i].lat]);
					 }
					 en.pointDatas = points;
		        	 en.callback(en);
		        	 MapManager.getMap().removeOverlay(polygon);
		        });	
		        drawControl.open();
				
			}else if(en.showType == MapConstant.Box){
				drawControl.setDrawingMode(BMAP_DRAWING_RECTANGLE);
				//添加鼠标绘制工具监听事件，用于获取绘制结果
		        drawControl.addEventListener('rectanglecomplete', function(polygon){
		        	 drawControl.close();
		        	 var pGeos = polygon.getPath();
		        	 var points=[];
					 for(var i = 0;i < pGeos.length; i++){
			        	//20170601 nishaodong 返回wgs84坐标
						var srcP=bd09towgs84(parseFloat(pGeos[i].lng), parseFloat(pGeos[i].lat));
						points.push([srcP[0], srcP[1]]);					 	
					 }
					 en.pointDatas = points;
		        	 en.callback(en);
		        	 MapManager.getMap().removeOverlay(polygon);
		        });	
		        drawControl.open();
			}else if(en.showType == MapConstant.Circle){
				drawControl.setDrawingMode(BMAP_DRAWING_CIRCLE);
				//添加鼠标绘制工具监听事件，用于获取绘制结果
		        drawControl.addEventListener('circlecomplete', function(circle){
		        	drawControl.close();
		        	var srcP=bd09towgs84(parseFloat(circle.getCenter().lng), parseFloat(circle.getCenter().lat));
	 				en.longitude = parseFloat(srcP[0]);
					en.latitude = parseFloat(srcP[1]);				
					en.radius=circle.getRadius();
		        	en.callback(en);
		        	MapManager.getMap().removeOverlay(circle);
		        });	
		        drawControl.open();				
			}/*else if(en.showType == MapConstant.Measure){ //测距入口
				en.longitude = MapManager.getMap().getMouseMapX();
				en.latitude = MapManager.getMap().getMouseMapY();
				en.distance = args+"";
				en.callback(en);
			}*/			
			
		},
		/**
		 * 对于点对象上图(Feature 类型)
		 * @param en 数据实体类
		 */
		createFeature: function(en){
			return MapManager.createMarker(en);
		},
		/**
		 * 创建Marker
		 * @param en.id Marker对象的id参数值
		 * @param en.type 标记的type参数
		 * @param en.longitude 经度
		 * @param en.latitude 纬度
		 * @param en.layerName Marker所显示的图层名称
		 * @param en.height 标记的高度
		 * @param en.width 标记的宽度
		 * @param en.iconUrl 标记的显示图片路径
		 * @param en.action 注册事件所需的事件类型
		 * @param en.callback 注册事件的执行函数
		 * @param en.titleStyle title样式对象:{ fontColor : "red", fontSize : "12px",offset:'top/right/center',fontWeight:'bold'}
		 * @returns {Marker} 上图资源对象
		 */
		createMarker: function(en){
			if(en.longitude == null || en.longitude == undefined || Number(en.longitude) == 0.0 || Number(en.longitude) == 0)
				return null;
			if(en.latitude == null || en.latitude == undefined || Number(en.latitude) == 0.0 || Number(en.latitude) == 0)
				return null;
			var size = null;
			if(!en.height || !en.width) {
				if(en.type == 1 || en.type == 2){//天网、卡口单独处理
					size = new BMap.Size(20,21);
				}else{
					size = new BMap.Size(25,28);
				}
			}else{
				size = new BMap.Size(en.width,en.height);
			}
			//初始化描述屏幕坐标类
			var iconUrl = en.iconUrl ? en.iconUrl : MapHandler.getImgUrl(en.type);
			//初始化图标类
			var pIcon = new BMap.Icon(iconUrl,size);
			pIcon.imageSize = size;
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(en.longitude), parseFloat(en.latitude));
			var point = new BMap.Point(srcP[0], srcP[1]);
			
			var marker = new BMap.Marker(point,{icon:pIcon});  // 创建标注
			//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			
			marker.setTop(en.isTop == undefined ? false : en.isTop);
			en.targetObj = marker;
			//注册事件
			if(en.action && en.callback){
				marker.addEventListener(en.action,function(){en.callback(en,1)});
			}
			//20170601 nishaodong 解决人员上图显示名字的问题，后期需要剥离
//			if(en.name&&en.type==4){
//				var label = new BMap.Label(en.name,{offset:new BMap.Size(-10,-15)});
//				label.setStyle({border:0});
//				marker.setLabel(label);
//			}
			if(en.isTitle){
				var titleStyle=en.titleStyle||{};
				if(!titleStyle.offset)titleStyle.offset='right';
		        var ox=0,oy=0;
		        if(titleStyle.offset=='top'){
		        	ox=en.name.length<5?0:-25;
		        	oy=-14;
		        }else if(titleStyle.offset=='right'){
		        	ox=25;
		        	oy=3;
		        }else{
                    ox=15;
                    oy=25;
		        }
				
				var label = new BMap.Label(en.name,{offset:new BMap.Size(ox,oy)});
				label.setStyle({border:0,backgroundColor:'transparent',color:titleStyle.fontColor?titleStyle.fontColor:"#33f",
				fontSize:titleStyle.fontSize?titleStyle.fontSize:'13px',
				fontWeight:titleStyle.fontWeight?titleStyle.fontWeight+'':'normal'});
				marker.setLabel(label);
			}
			MapManager.getMap().addOverlay(marker);              // 将标注添加到地图中
			//在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
			marker.attributes = {entity: en};
			return marker;
		},
		/**
		 * 创建title信息对象
		 * @param en.id title对象的id参数值
		 * @param en.name title对象的名称
		 * @param en.type title的type参数
		 * @param en.longitude 经度
		 * @param en.latitude 纬度
		 * @param en.style css显示样式,比如： setStyle({ color : "red", fontSize : "12px" }) 注意：如果css的属性名中包含连字符，需要将连字符去掉并将其后的字母进行大写处理，例如：背景色属性要写成：backgroundColor
		 * @param en.isWork 是否显示（生效） 默认显示(true)
		 * @param en.layerName title所显示的图层名称
		 */
		createTitle: function(en){
	        if (en.longitude == null || en.longitude == undefined || Number(en.longitude) == 0.0 || Number(en.longitude) == 0){
	            return null;
	        }
	        if (en.latitude == null || en.latitude == undefined || Number(en.latitude) == 0.0 || Number(en.latitude) == 0){
	            return null;
	        }			
			//20170601 nishaodong 将收到的84坐标转为百度坐标
//			var point = new BMap.Point(en.longitude, en.latitude);
			var srcP=wgs84tobd09(parseFloat(en.longitude), parseFloat(en.latitude));
			var point = new BMap.Point(srcP[0], srcP[1]);			
			var label = new BMap.Label(en.name,{
				offset:new BMap.Size(0,0),
				position:point}
			);

			//label.setStyle({border:0,backgroundColor:'transparent',color : en.color,fontSize :en.fontSize+'px',fontWeight:'bold'});
			if(en.style != undefined && en.style != null){
				label.setStyle({border:0,backgroundColor:'transparent',color : en.style.fontColor?en.style.fontColor:"black",fontSize : en.style.fontSize?en.style.fontSize+'px':'13px',fontWeight:'bold'});
			}else{
				label.setStyle({border:0,backgroundColor:'transparent',color : "black",fontSize : "13px",fontWeight:'bold'});
			}
//			if(en.isWork == null || en.isWork == undefined || en.isWork == true){//是否有效（上图），默认为 上图
				MapManager.getMap().addOverlay(label);
//			}
			//在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
			label.attributes = {entity: en};
			return label;
		},
		/**
		 * 创建点对象
		 * @param en.id point对象的id参数值
		 * @param en.type point的type参数
		 * @param en.longitude 经度
		 * @param en.latitude 纬度
		 * @param en.style 点对象的显示样式
		 * @param en.isWork 是否显示（生效） 默认显示(true)
		 * @param en.layerName point所显示的图层名称
		 */
		createPoint: function(en){
			if(en.longitude == null || en.longitude == undefined || Number(en.longitude) == 0.0 || Number(en.longitude) == 0)
				return null;
			if(en.latitude == null || en.latitude == undefined || Number(en.latitude) == 0.0 || Number(en.latitude) == 0)
				return null;
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(en.longitude), parseFloat(en.latitude));
			var point = new BMap.Point(srcP[0], srcP[1]);				
				
//			var point = new BMap.Point(en.longitude, en.latitude);
			if(en.isWork == null || en.isWork == undefined || en.isWork == true){//是否有效（上图），默认为 上图
				var marker = new BMap.Marker(point);
				MapManager.getMap().addOverlay(marker);
			}
			//在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
			point.attributes = {entity: en};
			return point;
		},
		/**
		 * 设置样式
		 */
		getStyle:function(en,style){
			if(en.iconUrl) style.externalGraphic = en.iconUrl;
			if(en.type == 200){//便民服务点特殊处理
				en.width = 36;
				en.height = 36;
			}else if(en.type == 5.2){//添加的代码
				en.width = 17;
				en.height = 20;
			
			}
			style.graphicWidth = (en.width == undefined ? 23 : en.width);
            style.graphicHeight = (en.height == undefined ? 23 : en.height);
            if(en.isTitle){
                style.label=en.name;
                style.labelXOffset=0;
                style.labelYOffset=16;
                style.labelAlign="cb";
                style.fontColor="#33f";
                style.fontFamily="微软雅黑";
                style.labelSelect = "true";
                style.fillOpacity = 0;
                style.fontWeight = "bold";
                style.fontSize="1.0em";
            }
            return style;
		},
		/**
		 * 针对天网单个上图
		 * @param en 单个对象
		 */
		 createPointOnly:function(en){
		 	this.createMarker(en);
		 },		
		
		/**
		 * 创建线对象
		 * @param en.id 线对象的id参数值
		 * @param en.type 线对象的type参数
		 * @param en.pointDatas 组成线对象的点坐标数据 格式：[[104.01,30.01],[ 104.02,30.02]…]
		 * @param en.style 线对象的显示样式 
		 * @param en.isWork 是否显示（生效）默认显示(true)
		 * @param en.layerName 线所显示的图层名称
		 */
		createPolyline: function(en){
			var pointDatas= en.pointDatas;
			if(!pointDatas || pointDatas.length == 0) return;
			var pPoints = [];
			//根据点坐标数据，生成对应的点对象
			for(var i = 0; i < pointDatas.length; i++){
				var pd = pointDatas[i];
				if(!pd || !pd instanceof Array) return;
//				pPoints.push(new BMap.Point(pd[0], pd[1]));
				//20170601 nishaodong 将收到的84坐标转为百度坐标
				var srcP=wgs84tobd09(parseFloat(pd[0]), parseFloat(pd[1]));
				var point = new BMap.Point(srcP[0], srcP[1]);
				pPoints.push(point);

			}
			
			
			var style = en.style;
			if(style != null && style != undefined){
				style={
					strokeColor: (style.strokeColor && style.strokeColor != "") ? style.strokeColor : "#66CCFF",
					strokeOpacity: (style.strokeOpacity && style.strokeOpacity != "") ? style.strokeOpacity : 0.6,
					strokeWeight: (style.strokeWeight && style.strokeWeight != "") ? style.strokeWeight : 3,
				}; 
			}else{
				style={strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5
				};
			}
			//生成线对象
			var polyline = new BMap.Polyline(pPoints,style); //创建线对象
			if(en.isWork == null || en.isWork == undefined || en.isWork == true){//是否有效（上图），默认为 上图
				MapManager.getMap().addOverlay(polyline); //添加到地图中
			}
			//在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
			polyline.attributes = {entity: en};
            return polyline;
		},
		/**
		 * 创建多边形面
		 * @param en.id 面对象的id参数值
		 * @param en.type 面对象的type参数
		 * @param en.pointDatas 组成面对象的点坐标数据 格式：[[104.01,30.01],[ 104.02,30.02]…]
		 * @param en.style 面对象的显示样式 格式：
		 * strokeColor	String	边线颜色
		 *	fillColor	String	填充颜色。当参数为空时，折线覆盖物将没有填充效果
		 *	strokeWeight	Number	边线的宽度，以像素为单位
		 *	strokeOpacity	Number	边线透明度，取值范围0 - 1
		 *	fillOpacity	Number	填充的透明度，取值范围0 - 1
		 *	strokeStyle	String	边线的样式，solid或dashed
		 *	enableMassClear	Boolean	是否在调用map.clearOverlays清除此覆盖物，默认为true
		 *	enableEditing	Boolean	是否启用线编辑，默认为false
		 *	enableClicking	Boolean	是否响应点击事件，默认为true
		 * @param en.isWork 是否显示（生效）默认显示(true)
		 * @param en.layerName 面所显示的图层名称
		 * @param en.action 注册事件所需的事件类型
		 * @param en.callback 注册事件的执行函数
		 */
		createPolygon: function(en){
			var pointDatas= en.pointDatas;
			if(!pointDatas || pointDatas.length == 0) return;
			var pPoints = [], ps = [];
			//根据点坐标数据，生成对应的点对象
			for(var i = 0; i < pointDatas.length; i++){
				var pd = pointDatas[i];
				if(!pd || !pd instanceof Array) return;
				//20170601 nishaodong 将收到的84坐标转为百度坐标
				var srcP=wgs84tobd09(parseFloat(pd[0]), parseFloat(pd[1]));
				var point = new BMap.Point(srcP[0], srcP[1]);
				pPoints.push(point);				
//				pPoints.push(new BMap.Point(pd[0], pd[1]));
				ps.push({x: pd[0], y: pd[1]});
			}
			var style = en.style;
			
			if(style != null && style != undefined){
				style={
					strokeColor: (style.strokeColor && style.strokeColor != "") ? style.strokeColor : "#808080",
					strokeOpacity: (style.strokeOpacity && style.strokeOpacity != "") ? style.strokeOpacity : 0.8,
					strokeWeight: (style.strokeWeight && style.strokeWeight != "") ? style.strokeWeight : 3,
					fillColor: (style.fillColor && style.fillColor != "") ? style.fillColor : "#C0C0C0",
					fillOpacity: (style.fillOpacity && style.fillOpacity != "") ? style.fillOpacity : 0.4
				}; 
			}else{
				style={strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5
				};
			}
			
			//生成多边形对象
            var pPolygon = new BMap.Polygon(pPoints,style);  //创建多边形
//          if(en.isWork == null || en.isWork == undefined || en.isWork == true){//是否有效（上图），默认为 上图
            	MapManager.getMap().addOverlay(pPolygon); //添加到地图中
    			//添加事件
    			if(en.action && en.callback){
    				if(en.callback instanceof Function){
    					pPolygon.addEventListener(en.action,en.callback);
    				}
    			}
//          }
            
            //在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
            pPolygon.attributes = {entity: en};
            pPolygon.points = ps;
            return pPolygon;
		},
		/**
		 * 改变多边形面
		 * @param en.id 面对象的id参数值
		 * @param en.type 面对象的type参数
		 * @param en.pointDatas 组成面对象的点坐标数据 格式：[[104.01,30.01],[ 104.02,30.02]]
		 * @param en.style 面对象的显示样式 格式：{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}
		 * @param en.isWork 是否显示（生效）默认显示(true)
		 * @param en.layerName 面所显示的图层名称
		 * @param en.action 注册事件所需的事件类型
		 * @param en.callback 注册事件的执行函数
		 */
		changePolygon: function(en){
			MapManager.clearOverlayByIdType(en);
            var newObj = this.createPolygon(en);
            MapManager.setObjEdit(newObj);
            return newObj;
		},		
		/**
		 * 创建矩形对象
		 * @param en.id 面对象的id参数值
		 * @param en.type 面对象的type参数
		 * @param en.pointDatas 组成面对象的点坐标数据 格式：[[104.01,30.01],[ 104.02,30.02]]
		 * @param en.style 面对象的显示样式 格式：{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}
		 * @param en.isWork 是否显示（生效）默认显示(true)
		 * @param en.layerName 面所显示的图层名称
		 * @param en.action 注册事件所需的事件类型
		 * @param en.callback 注册事件的执行函数
		 */
		createRectangle: function(en){
			var pointDatas= en.pointDatas;
			if(!pointDatas || pointDatas.length == 0) return;
//			var pStart = new BMap.Point(pointDatas[0][0],pointDatas[0][1]);
//			var pEnd = new BMap.Point(pointDatas[1][0],pointDatas[1][1]);
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(pointDatas[0][0]), parseFloat(pointDatas[0][1]));
			var pStart = new BMap.Point(srcP[0],srcP[1]);			
			srcP=wgs84tobd09(parseFloat(pointDatas[1][0]), parseFloat(pointDatas[1][1]));
			var pEnd = new BMap.Point(srcP[0],srcP[1]);
			
			var style = en.style;
			if(style != null && style != undefined){
				style={
					strokeColor: (style.strokeColor && style.strokeColor != "") ? style.strokeColor : "#66CCFF",
					strokeOpacity: (style.strokeOpacity && style.strokeOpacity != "") ? style.strokeOpacity : 0.6,
					strokeWeight: (style.strokeWeight && style.strokeWeight != "") ? style.strokeWeight : 3,
				}; 
			}else{
				style={strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5
				};
			}	
			//生成矩形
			var pPoints=[new BMap.Point(pStart.lng,pStart.lat),new BMap.Point(pEnd.lng,pStart.lat),
            new BMap.Point(pEnd.lng,pEnd.lat),new BMap.Point(pStart.lng,pEnd.lat)];
            var pPolygon = new BMap.Polygon(pPoints,style);  //创建多边形
            if(en.isWork == null || en.isWork == undefined || en.isWork == true){//是否有效（上图），默认为 上图
            	MapManager.getMap().addOverlay(pPolygon); //添加到地图中
    			//添加事件
    			if(en.action && en.callback){
    				if(en.callback instanceof Function){
    					pPolygon.addEventListener(en.action,en.callback);
    				}
    			}
            }
            //在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
            pPolygon.attributes = {entity: en};
            pPolygon.points = pPoints;
            return pPolygon;
		},
		/**
		 * 创建圆形对象
		 * @param en.id 圆对象的id参数值
		 * @param en.type 圆对象的type参数
		 * @param en.longitude 圆中心点的经度
		 * @param en.latitude 圆中心点的纬度
		 * @param en.radius 圆的半径,单位 米
		 * @param en.style 圆对象的显示样式（可为空） 格式：{fillColor: "transparent",fillOpacity: 0,strokeColor: "#66CCFF",strokeOpacity: 0.6,strokeWidth:2}
		 * @param en.isWork 是否显示（生效）默认显示(true)
		 * @param en.layerName 圆所显示的图层名称 (为空，则会使用 名为vectorLayer的图层)
		 * @param en.action 注册事件所需的事件类型
		 * @param en.callback 注册事件的执行函数
		 */
		createCircle: function(en){
			if(en.longitude == null || en.longitude == undefined || Number(en.longitude) == 0.0 || Number(en.longitude) == 0)
				return null;
			if(en.latitude == null || en.latitude == undefined || Number(en.latitude) == 0.0 || Number(en.latitude) == 0)
				return null;
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(en.longitude), parseFloat(en.latitude));
			var point = new BMap.Point(srcP[0], srcP[1]);
            var style = en.style;
            if(style != null && style != undefined){
                style={
                    fillColor: (style.fillColor && style.fillColor != "") ? style.fillColor : "#99CC99",
                    fillOpacity: (style.fillColor && style.fillColor != "") ? ((style.fillOpacity && style.fillOpacity != "") ? style.fillOpacity : 0) : 0,
                    strokeColor: (style.strokeColor && style.strokeColor != "") ? style.strokeColor : "#66CCFF",
                    strokeOpacity: (style.strokeOpacity && style.strokeOpacity != "") ? style.strokeOpacity : 0.6,
                    strokeWeight: (style.strokeWidth && style.strokeWidth != "") ? style.strokeWeight : 1,
                };
            }else{
                style={
                    fillColor: "transparent",
                    fillOpacity: 0,
                    strokeColor: "#66CCFF",
                    strokeOpacity: 0.6,
                    strokeWeight:2
                };
            }
			//创建圆对象
			var circle = new BMap.Circle(point,en.radius,style);
			
			if(en.isWork == null || en.isWork == undefined || en.isWork == true){//是否有效（上图），默认为 上图
				MapManager.getMap().addOverlay(circle);            //增加圆
    			//添加事件
    			/*if(en.action && en.callback){
    				if(en.callback instanceof Function){
    					MapManager.addListener(circle, en.action, function(){en.callback(en)});
    				}
    			}*/
            }
			circle.attributes = {entity: en};
            return circle;
		},
		/**
		 * 生成信息框
		 * @param en.showType 消息框类型 (超图使用，FramedCloud：具有指向和边框的浮动弹窗（默认选择）；Popup：简易消息框)
		 * @param en.type 消息框对象的type参数值 
		 * @param en.content 消息框所显示的内容 支持Html格式的内容
		 * @param en.longitude 经度
		 * @param en.latitude  纬度
		 * @param en.height 消息框的高度
		 * @param en.width 消息框的宽度
		 * @param en.isClose 是否显示关闭按钮 默认显示(true)
		 * @param en.closeCallback 关闭后的回调函数
		 */
		openInfoWindow: function(en){
			if(en.content == null || en.content == "") return;
			var size = null;
//			var point = new BMap.Point(en.longitude,en.latitude);
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(en.longitude), parseFloat(en.latitude));
			var point = new BMap.Point(srcP[0], srcP[1]);	
			
			var opts = {
				width : en.width,     // 信息窗口宽度
				height: en.height     // 信息窗口高度
			}
			//生成消息框对象
		    var popWin = new BMap.InfoWindow(en.content, opts);  // 创建信息窗口对象 
		    
		    if(popWin == null) return;
		    MapManager.getMap().openInfoWindow(popWin,point); //开启信息窗口;
		    //在该对象保存一些基本信息，方便后面业务使用(如根据特定的id或者type查找、删除)
		    popWin.attributes = {entity: en};
			return popWin;
		},
		openInfoWindow1: function(en){
			MapManager.closeInfoWindow();
			// 添加自定义覆盖物   
			var popWin = new SquareOverlay(en);    
			popWin.id='baiduz_popup';
			MapManager.getMap().addOverlay(popWin);
			popWin.attributes = {entity: en};
			return popWin;
		},
		/**
		 * 关闭信息框
		 * @param en.id 消息框对象的id参数值
		 * @param en.type 消息框对象的type参数值
		 */
		closeInfoWindow1: function(){
			var allOverlay = MapManager.getMap().getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.id == 'baiduz_popup'){
					MapManager.getMap().removeOverlay(obj);
					break;
				}
			}
		},		
		/**
		 * 关闭信息框
		 * @param en.id 消息框对象的id参数值
		 * @param en.type 消息框对象的type参数值
		 */
		closeInfoWindow: function(){
			MapManager.getMap().closeInfoWindow();
		},
		/**
		 * 根据id关闭信息框
		 * @param en.id 消息框对象的id参数值
		 */
		closeInfoWindowById: function(en){
			MapManager.closeInfoWindow();
		},
		/**
		 * 根据id & type关闭信息框
		 * @param en.id 消息框对象的id参数值
		 * @param en.type 消息框对象的type参数值
		 */
		closeInfoWindowByIdType: function(en){
			MapManager.closeInfoWindow();
		},
		/**
		 * 根据type关闭信息框
		 * @param en.type 消息框对象的type参数值
		 */
		closeInfoWindowByType: function(en){
			MapManager.closeInfoWindow();
		},
		/**
		 * 清理浮标 Marker对象
		 * @param en.layerName Marker所显示的图层名称
		 */
		clearMarkers:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.__proto__.wQ=='Marker'){
					MapManager.getMap().removeOverlay(obj);
				}
			}
		},
		/**
		 * 清理浮标指定id的浮标
		 * @param en.layerName Marker所显示的图层名称
		 * @param en.id 浮标marker的id值
		 */
		clearMarkerById:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.id == en.id){
					MapManager.getMap().removeOverlay(obj);
					
				}
			}
			return obj;
		},
		/**
		 * 清理浮标指定type的浮标
		 * @param en.layerName Marker所显示的图层名称
		 * @param en.type 浮标marker的type值
		 */
		clearMarkerByType:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.type == en.type){
					MapManager.getMap().removeOverlay(obj);
					
				}
			}
			return obj;
		},
		/**
		 * 清理浮标指定id & type的浮标
		 * @param en.layerName Marker所显示的图层名称
		 * @param en.id 浮标marker的id值
		 * @param en.type 浮标marker的type值
		 */
		clearMarkerByIdType:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			var isEx = false;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.type == en.type&&obj.attributes.entity.id == en.id){
					MapManager.getMap().removeOverlay(obj);
					isEx = true;
					break;
				}
			}
			if(isEx == false){
				return null;
			}
			return obj;
		},
		/**
		 * 清除所有的地图上图对象(线、面、Marker等)
		 * @param en 公共实体对象
		 */
		clearOverlays:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(!en || !en.layerName || (obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.layerName == en.layerName)){
					MapManager.getMap().removeOverlay(obj);
				}
			}
		},
		/**
		 * 清理多边形的对象图标(绘制控制 绘制出的对象)
		 * @param en.layerName 矢量对象所显示的图层名称
		 */
		clearOverlay:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				//20170601 nishaodong 增加按照图层删除
				if(en&&en.layerName){
					if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.layerName == en.layerName){
    					MapManager.getMap().removeOverlay(obj);
        			}
				}else{
					MapManager.getMap().removeOverlay(obj);
				}
			}
        	return obj;
		},
		/**
		 * 清理多边形指定id的图标
		 * @param en.id 矢量对象的id参数值
		 * @param en.layerName 矢量对象所显示的图层名称
		 */
		clearOverlayById:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.id == en.id){
    				MapManager.getMap().removeOverlay(obj);
        		}
			}
        	return obj;
		},
		/**
		 * 清理多边形指定Type的浮标
		 * @param en.type 矢量对象的type参数值
		 * @param en.layerName 矢量对象所显示的图层名称
		 */
		clearOverlayByType:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.type == en.type){
    				MapManager.getMap().removeOverlay(obj);
        		}
			}
        	return obj;
		},
		/**
		 * 清理多边形指定id的浮标
		 * @param en.id 矢量对象的id参数值
		 * @param en.type 矢量对象的type参数值
		 * @param en.layerName 矢量对象所显示的图层名称
		 */
		clearOverlayByIdType:function(en){
			var allOverlay = map.getOverlays();
			var len = allOverlay.length;
			var obj=null;
			var isEx = false;
			for (var i = len-1; i > -1; i--){
				obj=allOverlay[i];
				if(obj&&obj.attributes&&obj.attributes.entity&&obj.attributes.entity.type == en.type&&obj.attributes.entity.id == en.id){
    				MapManager.getMap().removeOverlay(obj);
    				isEx = true;
    				break;
        		}
			}
			if(isEx == false){
				return null;
			}
        	return obj;
		},
		/**
		 * 数据单个上图
		 * @param en.id 上图对象的id参数值
		 * @param en.type 上图对象的type参数
		 * @param en.showType 点位上图的类型 如：”Marker”、”Feature”等
		 * @param en.longitude 经度
		 * @param en.latitude 纬度
		 * @param en.layerName 上图对象所显示的图层名称
		 * @param en.height 上图对象的高度
		 * @param en.width 上图对象的宽度
		 * @param en.iconUrl 上图对象的显示图片路径
		 * @param en.action 注册事件所需的事件类型 如：”click”等类型
		 * @param en.callback 注册事件的执行函数
		 * @returns {Marker} 上图资源对象
		 */
		doResourceChart: function(entity){
			return MapManager.createMarker(entity);
		},
		/**
		 * 根据id 查找单个上图资源对象
		 * @param entity.id 上图对象的id参数值
		 * @param entity.type 上图对象的type参数
		 * @param entity.showType 点位上图的类型 如：”Marker”、”Feature”等
		 * @param entity.layerName 上图对象所显示的图层名称
		 * @returns point 上图资源对象
		 */
		getResourceChartById: function(entity){
			return MapManager.getMarkerById(entity);
		},
		/**
		 * 根据类型 查找单个上图
		 * @param entity.id 上图对象的id参数值
		 * @param entity.type 上图对象的type参数
		 * @param entity.showType 点位上图的类型 如：”Marker”、”Feature”等
		 * @param entity.layerName 上图对象所显示的图层名称
		 * @returns point 上图资源对象
		 */
		getResourceChartByIdType: function(entity){
			return MapManager.getMarkerByIdType(entity);
		},
		/**
		 * 根据id 删除上图资源
		 * @param entity.id 上图对象的id参数值
		 * @param entity.showType 点位上图的类型 如：”Marker”、”Feature”等
		 * @param entity.layerName 上图对象所显示的图层名称
		 */
		clearResourceChartById: function(entity){
			return MapManager.clearMarkerById(entity);
		},
		/**
		 * 根据类型 & id 删除单个上图
		 * @param entity.id 上图对象的id参数值
		 * @param entity.type 上图对象的type参数
		 * @param entity.showType 点位上图的类型 如：”Marker”、”Feature”等
		 * @param entity.layerName 上图对象所显示的图层名称
		 */
		clearResourceChartByIdType: function(entity){
			return MapManager.clearMarkerByIdType(entity);
		},
		/**
		 * 根据类型 删除上图资源
		 * @param entity.type 上图对象的type参数
		 * @param entity.showType 点位上图的类型 如：”Marker”、”Feature”等
		 * @param entity.layerName 上图对象所显示的图层名称
		 */
		clearResourceChartByType: function(entity){
			return MapManager.clearMarkerByType(entity);
		},
		/**
		 * 针对上图资源设置监听事件
		 * @param obj 上图资源对象
		 * @param action 事件类型："click"点击事件；“dbclick”双击事件
		 * @param func 响应方法
		 */
		addListener: function(obj, action, func){
			obj.addEventListener(action,func);
		},
		/**
		 * 设置上图资源是否可编辑
		 * @param obj 上图资源对象
		 * @param flag 是否编辑 true: 表示可编辑(默认); false: 表示不可编辑
		 */
		setObjEdit: function(obj, flag){
			if(!obj||obj.__proto__.wQ=='Label') return;
			if(flag == null || flag == undefined) flag = true;
			
			if(flag == true&&obj.__proto__.wQ=='Polygon'){//可编辑 入口
				
				//if(obj.callback != null && obj.callback != undefined){
					//20170601 nishaodong 增加回调解决百度地图修改多变形完成后无法保存数据的问题
					obj.addEventListener("lineupdate",function(e){
						var points = e.currentTarget.getPath();
						var ps = [], pds = [];
						var srcP= null;
						for(var i = 0; i < points.length; i++){
							//20170601 nishaodong 将收到的84坐标转为百度坐标
							srcP=bd09towgs84(parseFloat(points[i].lng), parseFloat(points[i].lat));
							ps.push({x: srcP[0], y: srcP[1]});
							pds.push([srcP[0], srcP[1]]);
						}
						obj.points = ps;
						if(obj.attributes && obj.attributes.entity){
							obj.attributes.entity.pointDatas = pds;
						}
					});
				//}
				obj.enableEditing();
			}else{
				obj.disableEditing();
			}
		},
		/**
		 * 判定 点 是否在 多边形 内部
		 * @param point 目标点对象
		 * @param geometry 目标面对象
		 * @returns 返回 true or false
		 */
		intersects: function(point, polygon){
			//检查类型
	        if(!(point instanceof BMap.Point) ||
	            !(polygon instanceof BMap.Polygon)){
	
	            return false;
	        }
	        return polygon.getBounds().containsPoint(point);
		},
		
		/**
		 * 计算两个坐标点的距离
		 * @param p1 目标点1，格式为：{lon:104.06178883137,lat:30.660948024697}
		 * @param p2 目标点2，格式为：{lon:104.06499768087,lat:30.660917318003}
		 * @param unit 单位 默认为km； 传入"m",表示返回值得单位为米
		 * @returns {Number}
		 */
		measuringDistance: function(p1, p2, unit){
			var distance = 0;
			try{
				distance = BMap.Util.distVincenty(new BMap.LonLat(p1.lon ,p1.lat),
						new BMap.LonLat(p2.lon ,p2.lat));
			}catch(e){}
			if(unit && unit == "m"){
				distance = distance * 1000;
			}
			return distance;
		},
		
		/*************************业务接口**begin***********************/
		
		/**
		 * 鹰眼样式初始化
		 */
		initEye: function(){
			var tbar = "<div id='eyeTooDiv' style='float:left;width:auto;height:auto;position:relative;margin-bottom: 50px;'>";
	   		var temDiv = "<div style='width: 28px; height:15px;'>&nbsp;</div>";
	   		var eagleEyeIn = "<div style='width: 28px; height:30px;'><img style='width: 25px; height:27px;' id='eagleEyeImg' onclick='eyeHide(this)' src='"+basePath+"images/map/images/eagleEye/eagleEyeIn.png'></div>";
	   		var mType_w = "<div style='width: 28px; height:30px;'><img style='width: 25px; height:27px;'src='"+basePath+"images/map/images/eagleEye/mType_w.png'></div>";
	   		var statistical = "<div style='width: 28px; height:30px;'><img style='width: 25px; height:27px;'onclick='showBbWin(this);' src='"+basePath+"images/map/images/eagleEye/statistical.png'></div>";
	   		var mLayer = "<div style='width: 28px; height:30px;'><img style='width: 25px; height:27px;'id='mapLayerConrolImg' onclick='mapLayerConrol(this)'  src='"+basePath+"images/map/images/eagleEye/mLayer.png'></div>";
	   		var tool = "<div style='width: 28px; height:30px;'><img style='width: 25px; height:27px;'onclick='eyeToobarControl(this)' src='"+basePath+"images/map/images/eagleEye/tool.png'></div>";
	   		tbar = tbar +temDiv + eagleEyeIn + statistical + mLayer + tool;
	   		tbar += "</div>"; 
	   		$(".smControlOverviewMap").prepend(tbar);
	   		
	   		setTimeout(function(){
	   			$("#BMap_Control_minimizeDiv").remove();
	   			MapManager.eyeShowOrHide(null);
	   		}, 500);
		},
		/**
		 * 显示 or 隐藏鹰眼
		 * @param obj 标签目标对象
		 */
		eyeShowOrHide: function(obj){
			$(".smControlOverviewMapElement").toggle();
			var im = MapHandler.getBarImg("eagleEyeIn", $(".smControlOverviewMapElement").css("display") != "none" ? false : true);
			if(im && im != ""){
				var $imgObj = null;
				if(obj) $imgObj = $(obj);
				else $imgObj = $("#eagleEyeImg");
				$imgObj.attr("src", im);
			}
			
			if($(".smControlOverviewMapElement").css("display") == "none"){
				$(".smControlOverviewMapElement").css("width","45px");
				$("#eyeToobarDiv").css("right","45px");
				$("#eyeTooDiv").css("margin-right","12px");
			}else{
				$(".smControlOverviewMapElement").css("width","160px");
				$("#eyeToobarDiv").css("right","203px");
				$("#eyeTooDiv").css("margin-right","0");
			}
			//$(".smControlOverviewMap").attr("style",overviewStyle);
		},
		
		/**
		 * 鹰眼功能中的绘制控件
		 * @param lName 执行绘制要素的图层
		 * @param barType 搜索类型，1，标点；2，加点；3，测距；4，测面
		 * @param handler 要素绘制事件处理器，指定当前绘制的要素类型和操作方法 取值：BMap.Handler.Point、BMap.Handler.Path、BMap.Handler.Polygon
		 * @returns
		 */
		initEyeFeature: function(lName,barType,handler){
			var type = "eyeObj";
			MapManager.clearOverlayByType({layerName: layerName.editVectorLayer,type: type});
			MapManager.clearOverlayByType({layerName: layerName.vectorLayer,type: type});
			MapManager.clearMarkerByType({type: type});
			
			var en = new MapEntity();
			if(barType == 1 || barType == 3 || barType == 4){
				en.type = type;
				en.showType = handler;
				en.callback = MapHandler.drawEyeCompleted;
				MapManager.drawDragMode(en);
			}/*else if(barType == 4){
				en.showType = handler;
				MapManager.getMap().measureArea(function(d) {
					var den = new MapEntity();
					den.distance = d;
					den.longitude = MapManager.getMap().getMouseMapX();
					den.latitude = MapManager.getMap().getMouseMapY();
					MapManager.drawEyeCompleted(den);
					});
			}*/
			
			eyeObj.attrs = {
					eyeLayer: lName,
					eyeBarType: barType, /*搜索类型，1，标点；2，加点；3，测距；4，测面*/
					eyeHandler: handler /*要素绘制事件处理器，指定当前绘制的要素类型和操作方法*/
			};
			return null;
		},
		/**
		 *  点搜索本地资源
		 * @param en.longitude 点对象的经度
		 * @param en.latitude 点对象的纬度
		 * @param en.radius  搜索半径
		 * @param en.callback 完成后的回调函数
		 * @returns
		 */
		initPointSearch: function(en){
			/*保存绘制所用到的属性*/
			var cen = new MapEntity();
			en.isWork = false;
			//分析所使用的点对象
			cen.searchSourceGeo = MapManager.createPoint(en);
			cen.type = "searchObj";
			cen.radius = (en.radius ? en.radius : 2000)/finalDistance,/*缓冲区半径大小*/
			cen.lineSegment = 50,/*缓冲区指定点的数量*/
			//搜索完成后的回调函数
			cen.callback = function(den){				
				var pointDatas = den.pointDatas;
				if(!pointDatas){
					return;
				}
				den.isWork = false;
				//生成多边形
				den.searchResultGeo = MapManager.createPolygon(den);
				var returnDatas = new Object();
				var targetData = en.targetData ? en.targetData : ResourceDatas.datas;
				for(var i in targetData){
					//丁杰，这里应该根据en参数中传递的类型参数进行搜索
					if(en.dataTypes!=null&&en.dataTypes!=undefined)
					{
						if(en.dataTypes[i]==null||en.dataTypes[i]==undefined) continue;
					}
					if(targetData[i] instanceof Function) continue;
					var datas = targetData[i]["data"];
					var existsPoints = [];
				 	if(!datas){
				 		continue;
				 	}
				 	var type = null;
				 	for(var i in datas){
				 		if(datas[i] instanceof Function) continue;
				 		var entity = datas[i];
				 		if((entity.type == 4 || entity.type == 5) && entity.isOnLine == false){ //已经下线
				 			continue;
				 		}
				 		type = entity.type;
				 		var nEn = new MapEntity(entity);
				 		nEn.isWork = false;
				 		//生成比较的点对象
				 		var point = MapManager.createPoint(nEn);
				 		//判断是否在多边形内
				 		if(MapManager.intersects(point, den.searchResultGeo)){
							entity.action = "click";
							entity.callback = MapToobar.openInfoWindow;
							if(entity.type == 4 || entity.type == 5){
			    				var titleName = entity.des ? entity.name+"("+entity.des+")" : entity.name;
			    				 entity.isTitle = true;
			    				 entity.titleStyle = {
			    						 name: titleName
			    				 }
			    				 entity.targetObj = null;
			    			}
				 			existsPoints.push(entity);
				 		}
				 	}
				 	//组装搜索结果
				 	returnDatas[type] = existsPoints;
				}
				 //执行回调函数
				en.callback(returnDatas);
			};
			//執行缓冲查询
			MapManager.bufferAnalystProcess(cen);
		},
		/**
		 * 地图资源查询 (地图查询方式)
		 * @param en.type 上图对象的type参数值
		 * @param en.showType 上图的类型 如：6,模糊查询等
		 * @param en.params 搜索参数 格式如：{type: type, imgUrl: ""}
		 * @param en.callback 搜索成功后的回调函数 该回调函数存在一个datas参数，存放的是搜索结果的点位坐标信息，数组类型
		 */
		queryMapBaseResource: function(en){
			
			if(!en.showType || en.showType == 6){ //type == 6,则表示模糊查询（也是默认选项）
				MapHandler.queryBySQL(en);
			}
		},
		
		
		/**
		 * (搜索功能)绘制图形完成的回调方法
		 * @param en.type 上图的type参数
		 * @param en.showType 要素绘制事件处理器，指定当前绘制的要素类型和操作方法 取值：BMap.Handler.Point、BMap.Handler.Path、BMap.Handler.Polygon
		 * @param en.pointDatas 点坐标数据，数组类型
		 * @param en.longitude 经度
		 * @param en.latitude 纬度
		 */
		drawSearchCompleted: function(en){
			if(!en) return;
			
			var obj = null;
			if(en.pointDatas && en.pointDatas.length > 1){
				if(en.showType == MapConstant.Path){ //线搜索入口
					obj = MapManager.createPolyline(en);
				}else{ //矩形、多边形搜索入口
					en.searchResultGeo = obj = MapManager.createPolygon(en);
				}
			}else{ //点入口
				obj = MapManager.createPoint(en);
			}
			if(en.showType == MapConstant.Point 
					|| en.showType == MapConstant.Path){ //点、线入口
				en.searchSourceGeo = obj.geometry;
				en.searchResultGeo = null;
				en.callback = MapHandler.bufferAnalystCompleted
				MapManager.bufferAnalystProcess(en);
			}else if (en.showType == MapConstant.Polygon 
					|| en.showType == MapConstant.Box){ //矩形、多边形入口
				//注销绘制控件
				if(drawControl){
					drawControl.deactivate();
					drawControl = null;
				}
				//范围的边界点集合
				var areaPoints = [];
				for(var i = 0; i < en.pointDatas.length; i++){
					var p = en.pointDatas[i];
					var pointJSON = {
							"x": p[0],
							"y": p[1]
					};
					areaPoints.push(pointJSON);
				}
				en.areaPoints = areaPoints;
				MapToobar.queryByGeo(searchEntity);
			}
			try{//初始化搜索小功能的图标 searchToobar.jsp
				initSearchToobar();
			}catch(e){}
		 } ,
		 /**
		 * 地图缓冲区分析
		 * @param en.type 资源类型
		 * @param en.radius 缓冲距离 以数值作为缓冲区分析的距离值。单位：米
		 * @param en.lineSegment 线段个数 圆头缓冲圆弧处线段的个数
		 * @param en.searchSourceGeo 目标对象 要做缓冲区分析的几何对象。必设字段
		 * @param en.callback 成功的回调函数 该回调函数存在一个MapEntity对象的en参数，其中en.pointDatas保存有缓存区的边界点位数据，数组类型
		 * @param en.failCallback 失败的回调函数
		 */
		bufferAnalystProcess: function(en){
			if(!en.radius) en.radius = 120;
			//初始化缓冲区分析服务类、缓冲区分析的缓冲距离类、缓冲区分析通用设置类、几何对象缓冲区分析参数类
		    var bufferServiceByGeometry = new BMap.REST.BufferAnalystService(MapManager.getAnalyUrl()),
		            bufferDistance = new BMap.REST.BufferDistance({
		                value: en.radius
		            }),
		            bufferSetting = new BMap.REST.BufferSetting({
		                endType: BMap.REST.BufferEndType.ROUND,
		                leftDistance: bufferDistance,
		                rightDistance: bufferDistance,
		                semicircleLineSegment: en.lineSegment ? en.lineSegment : 50
		            }),
		            geoBufferAnalystParam = new BMap.REST.GeometryBufferAnalystParameters({
		                sourceGeometry: en.searchSourceGeo,
		                bufferSetting: bufferSetting
		            });
		    //注册事件（分析完成和分析失败事件）
		    bufferServiceByGeometry.events.on(
		            {
		                "processCompleted": function(BufferAnalystEventArgs){//对缓冲完成的结果，进行解析
		                	var feature = new BMap.Feature.Vector();
		        		    var brGeometry = BufferAnalystEventArgs.result.resultGeometry;
		        		    feature.geometry = brGeometry;
		        		    feature.attributes.entity = {
		        		    		type: en.type
		        		    }
		        		    //封装各个point的数据
		        		    if(brGeometry.components && brGeometry.components[0] 
		        		    	&& brGeometry.components[0].components
		        		    	&& brGeometry.components[0].components[0]
		        		    	&& brGeometry.components[0].components[0].components){
		        		    	
		        		    	var pGeos = brGeometry.components[0].components[0].components, points = [];
		        		    	for(var i = 0;pGeos && i < pGeos.length; i++){
									if(!pGeos[i]) continue;
									points.push([pGeos[i].x, pGeos[i].y]);
								}
		        		    	en.pointDatas = points;
		        		    }
		        		    
		        		    var sen = new MapEntity(en);
		        		    en.searchResultGeo = sen.searchResultGeo = feature
		        		    sen.detailInfo = en;
		                	if(en.callback instanceof Function) en.callback(sen);
		                }, "processFailed": en.failCallback ? en.failCallback : function(a){}
		            });
		    //开始执行缓冲分析查询
		    bufferServiceByGeometry.processAsync(geoBufferAnalystParam);
		 },
		/**
		 * 初始化 资源数据
		 * @param isInitDatas 是否初始化参数
		 * @param orgId 组织机构id
		 * @param callback 回调函数
		 * @param filter 过滤函数，返回false即可过滤掉某一条数据
		 */
		initResourceDatas: function(isInitDatas, orgId, callback,filter){
			
		},
		/**
		 * 资源上图
		 * @param type 1：天网、2： 卡口、 3：卡点、4：警员:5：警车、6：巡区:、7：社区、8：辖区等等
		 * @param resDatas 格式为：[type,datas,status]
		 * @param layer
		 */
		initResourceChart: function(type, resDatas){
			MapToobar.initResourceChart(type, resDatas);
		},
		
		/**
		 * 计算上图的资源个数
		 * @param en.type 资源类型
		 * @param en.layerName 图层名称
		 * @returns {Number}
		 */
		countResChart: function(en){
			var rCount = 0;
			var rLayer = null,overlays = [];
			//if(en.type != 1.1){
				//获取图层对象
				rLayer = MapHandler.getMarkerLayerByName(en.layerName);
				//得到该图层的所有Marker对象
				overlays = rLayer.markers;
				
			/*}else{
				//获取图层对象
				rLayer = MapHandler.getVectorLayerByName(en.layerName);
				//得到该图层所有矢量要素对象
				overlays = rLayer.features;
			}*/
			if(!overlays || overlays.length == 0) return rCount;
			var len = overlays.length;
			var obj = null;
			//遍历查找
        	for(var i = len-1; i > -1; i--){
        		obj = overlays[i];
    			if(obj && obj.attributes.entity && en.type == obj.attributes.entity.type){
    				rCount++;
        		}
        	}
			return rCount;
		},
		/**
		 * 删除轨迹回放的相关数据
		 */
		clearTrailPlayInfo: function(){
			for(var i in ResourceDatas.trailPlayBackDatas){
				if(ResourceDatas.trailPlayBackDatas[i] instanceof Function || i == "count") continue;
				var tInfo = ResourceDatas.trailPlayBackDatas[i];
				if(tInfo && tInfo.split(",") && tInfo.split(",").length == 3){
					var den = {id: tInfo.split(",")[0], type: tInfo.split(",")[0]+"line"};
					try{
						MapManager.clearOverlayByIdType(den);
					}catch(e){}
				}
			}
			ResourceDatas.trailPlayBackDatas = new Object();
		},
		/**
		 * 20170601 nishaodong 修改卫星地图切换方法，兼容超图
		 * 取消卫星地图
		 * @param en.code 每个机构获取万米单元网格的编码
		 * @param en.url 获取万米单元网格瓦片的url地址
		 * @param en.type  1代表万米单元网格  2代表部件线、面上图
		 * @param en.opacity  透明度
		 * 通过Name和url获取万米单元图层
		 * 
		 */
		setSatelliteMap:function(en){
//			BMAP_NORMAL_MAP	此地图类型展示普通街道视图
//			BMAP_PERSPECTIVE_MAP	此地图类型展示透视图像视图
//			BMAP_SATELLITE_MAP	此地图类型展示卫星视图
//			BMAP_HYBRID_MAP	此地图类型展示卫星和路网的混合视图
			MapManager.getMap().setMapType(BMAP_HYBRID_MAP);   //设置地图类型
		},	
		/**
		 * 20170601 nishaodong 修改卫星地图切换方法，兼容超图
		 * 取消卫星地图
		 */		
		cancelSatelliteMap:function(){
			MapManager.getMap().setMapType(BMAP_NORMAL_MAP);   //设置地图类型
		},		
		/**
		 * 20170601 nishaodong 从业务中迁移进来，解决超图独有方法的问题
	     * 执行图层redraw方法
	     * @param en
	     */
	    vectorRedraw: function(en){
	    	
	    },		
		/*************************业务接口**end***********************/
		
}
/**
 * 地图辅助工具
 */
var MapHandler = {
		/**
		 * 通过地图sql查询获取万米单元网格数据
		 * @param url
		 * @param name
		 * @param code
		 * @param queryCompleted
		 * @param queryFailed
		 */
		queryBySqlAndName:function(url,name,code,queryCompleted, queryFailed){
			var queryParam, queryBySQLParams, queryBySQLService;
			queryParam = new SuperMap.REST.FilterParameter({
				name: name,
				attributeFilter:"BGCODE like '%"+code+"%'"
			});
			queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
				queryParams: [queryParam]
			});
			queryBySQLService = new SuperMap.REST.QueryBySQLService(url, {
			eventListeners: {"processCompleted": queryCompleted, "processFailed": queryFailed}});
			queryBySQLService.processAsync(queryBySQLParams);
		},
		/**
		 *  通过几何对象(点、线、面)进行范围查询 (地图查询方式)
		 * @param url 查询图层的url
		 * @param params 查询过滤参数 (数组类型,支持多种资源查询)
		 * @param geometry 几何类型
		 * @param queryMode 查询类型
		 * @param queryCompleted 成功的回调方法
		 * @param queryFailed 失败的回调方法
		 */
		queryByGeometry:function(url,name, geometry, queryMode, queryCompleted, queryFailed){
			if(!queryMode) queryMode = SuperMap.REST.SpatialQueryMode.INTERSECT;
		    var queryParams = [], queryByGeometryParameters, queryService;
		   /* for(var i = 0;params && i < params.length; i++){
		    	var param = params[i];
		    	if(!param) continue;
		    	queryParams.push(new SuperMap.REST.FilterParameter({name: param.name})); 
		    }*/
		    queryParam = new SuperMap.REST.FilterParameter({name:name});
		    queryParams.push(queryParam);
		    queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
		        queryParams: queryParams,
		        geometry: geometry,
		        spatialQueryMode: queryMode
		    });
		    queryService = new SuperMap.REST.QueryByGeometryService(url, {
		        eventListeners: {
		            "processCompleted": queryCompleted,
		            "processFailed": queryFailed
		        }
		    });
		    queryService.processAsync(queryByGeometryParameters);
		},
		/**
		 * 通过SQL进行范围查询 (地图查询方式)
		 * @param params 参数，
		 * 格式：[{name: "Countries@World.1", attributeFilter: "Pop_1994>1000000000 and SmArea>900"},{name: "Countries@World.2", attributeFilter: "Pop_1994>1000000000 and SmArea>900"}] (数组类型,支持多种资源查询)
		 * @param en 参数对象
		 */
		queryBySQL: function(en){
			var queryParams = [], queryBySQLParams, queryBySQLService;
			var params = en.params;
			//部件查询
			var parttype=params["type"];
			if(!BaseMapResParams[parttype]){//不存在
				var a={
						type:parttype,limit: 100,field:"GBCODE",
						fields: {
							id: "SmID",
							name: "GBCODE"
						}
					};
				BaseMapResParams[parttype]=a;
			}
			
			if(!params){
				if(en.failCallback instanceof Function) en.failCallback(en);
				return;
			}
			//搜索的图层地址
			var mUrl = "";
			//查询的目标字段
			var _dispField = null;
			//组装查询过滤条件参数类
			if(params instanceof Array ){ //查询多表入口 
				for(var i = 0;i < params.length; i++){
			    	var param = params[i];
			    	if(!param) continue;
			    	mUrl = param["url"] ? param["url"] : MapManager.getUrl();
			    	_dispField = BaseMapResParams[param["type"]]["field"];
			    	queryParams.push(new SuperMap.REST.FilterParameter({
			    		name: param["type"],
						attributeFilter: _dispField +" like '%"+param["searchValue"]+"%'"
					})); 
			    }
			}else{
				var param = params;
				mUrl = param["url"] ? param["url"] : MapManager.getUrl();
				_dispField = BaseMapResParams[param["type"]]["field"];
				var searchValue = param["searchValue"] ? param["searchValue"] : "";
		    	queryParams.push(new SuperMap.REST.FilterParameter({
					name: param["type"],
					attributeFilter: _dispField +" like '%"+searchValue+"%'"
				})); 
			}
			//初始化SQL 查询参数类
			queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
				queryParams: queryParams
			});
			if(mUrl == "") return;
			//初始化SQL 查询服务类
			queryBySQLService = new SuperMap.REST.QueryBySQLService(mUrl, {
			eventListeners: {"processCompleted": function(args){
				MapHandler.buildMapResInfo(en, args);
			}, "processFailed": function(args){
				console.log("部件上图失败:",args.error.errorMsg);
				if(en.failCallback instanceof Function) en.failCallback(en);
			}}});
			//执行SQL查询操作
			queryBySQLService.processAsync(queryBySQLParams);
		},
		/**
		 * 封装地图查询结果的数据信息
		 * @param args
		 */
		buildMapResInfo: function(en, args){
			var params = en.params;
			var i, j, result = args.result;
		    if (!result || !result.recordsets) {
		        return;
		    }
		    var resultObj = new Object();
		    for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
	            if (!recordsets[i].features) {
	                continue;
	            }
	            //资源来源
	            var datasetName = recordsets[i].datasetName;
	            datasetName = datasetName.replace("#", ".");//将‘#’转为‘.’	
	            for (j=0; j<recordsets[i].features.length; j++) {
	                var feature = recordsets[i].features[j];
	                var geoObj = feature.geometry;
	                var entity = new MapEntity();
	                entity.id = feature.data[BaseMapResParams[params["type"]]["fields"].id];
                	entity.type = datasetName;
                	entity.name = feature.data[BaseMapResParams[params["type"]]["fields"].name];
	                if(geoObj.CLASS_NAME == SuperMap.Geometry.Point.prototype.CLASS_NAME){ //点数据
	                	entity.longitude = geoObj.x;
	   				 	entity.latitude = geoObj.y;
	                }else if(geoObj.CLASS_NAME == SuperMap.Geometry.LineString.prototype.CLASS_NAME){//线数据
	                	var points = geoObj.components;
	                	if(!points){
	                		continue;
	                	}
	                	var pointDatas = [];
	                	for(var p in points){
                			if(points[p] instanceof Function) continue;
                			pointDatas.push([points[p].x, points[p].y]);
                			if(!entity.longitude) {
                				entity.longitude = points[p].x;
                				entity.latitude = points[p].y;
                			}
                		}
	                	entity.pointDatas = pointDatas;
	                }
	                entity.des = "地图基础资源数据";
   				 	entity.detailInfo = feature.data;
   				 	entity.content = MapHandler.buildBaseMapResContent(entity);
	                if(entity.name && entity.name != "") resultObj[datasetName+ entity.name] = entity;
	            }
	        }
		    if(en.callback instanceof Function) en.callback(resultObj);
		},
		/**
		 * 设置图层要素的各种事件
		 * @param en
		 */
		setSelectFeatureActive: function(en){
			if(selectFeature){
				selectFeature.deactivate();
			}
			if(en.isWork && en.isWork == false) return;
			if(!en.layerName) en.layerName = layerName.editVectorLayer;
			var sFcallbacks = {
				    over: function(c){
				    	if(en.over instanceof Function) en.over();
				    },
				    out: function(c){
				    	if(en.out instanceof Function) en.out(en);
				    },
				    click: function(c){
				    	if(c.attributes.entity && c.attributes.entity.click instanceof Function) c.attributes.entity.click(c.attributes.entity);
				    },
				    clickout: function(lastFeature){
				    	//if(en.clickout instanceof Function) en.clickout(en);
				    },
				    rightclick:function(c){
				    	if(en.rightclick instanceof Function) en.rightclick(en);
				    },
				    dblclick: function(c){
				    	if(en.dblclick instanceof Function) en.dblclick(en);
				    }
				};
			selectFeature = new SuperMap.Control.SelectFeature(MapHandler.getVectorLayerByName(en.layerName), {
				onSelect: function(currentFeature){
			    	if(en.onSelect instanceof Function) en.onSelect(en);
			    },
			    callbacks: sFcallbacks,
			    hover: false
			});
			MapManager.getMap().addControl(selectFeature);
			//控件生效
			selectFeature.activate();
		},
		/**
		 * 获取要素样式
		 * @param entity 数据对象
		 * @param isLable 是否需要label 
		 * @param lableAlign label显示位置，只支持两种：1、图片上面（lableAlign == "top"）；2、图片右边
		 * */
		getFeatureStyle: function(entity, isLable, lableAlign){
			var style = {
				    externalGraphic: entity.iconUrl,
			        graphicWidth:32,
			        graphicHeight:32
				};
			if(isLable == true){
				style.fontColor = "#039E5D";
				style.fontWeight = "bold";
				style.label = entity.name;
				// 案情数量
				if(entity.num && entity.num > 0){
					style.label += "("+ entity.num + ")";
				}
				if(lableAlign == "top"){
					style.labelYOffset = 30;
				}else{
					style.labelXOffset = 16;
				}
				style.labelAlign = "lm";
			}
			
			return style;
		},
		/**
		 * 注销各种控件
		 * @param en
		 */
		clearFeatures: function(en){
			if(editFeature){
				editFeature.deactivate();
				editFeature.destroy();
				editFeature = null;
			}
		},
		/**
		 *  绘制控件专题
		 * @param layer 执行绘制要素的图层
		 * @param handler 要素绘制事件处理器，指定当前绘制的要素类型和操作方法
		 * @param options 设置该类及其父类开放的属性
		 * @param isActivate 是否立即生效
		 * @param drawCompleted 绘制完成后的回调方法
		 * @returns
		 */
		initDrawFeature: function(layer,handler, options, isActivate, drawCompleted){
			var drawFeature = MapHandler.createDrawFeature(layer, isActivate, handler, options);
			drawFeature.events.on({"featureadded": drawCompleted} );
			return drawFeature;
		},
		/**
		 * 创建矢量图层
		 * @param name 图层名称
		 * @param options 此类与父类提供的属性
		 * @param map 地图对象
		 * @returns {SuperMap.Layer.Vector}
		 */
		createVectorLayer: function(name, options, map){
			if(!name) name = layerName.vectorLayer;
			var vector = new SuperMap.Layer.Vector(name, options);
			if(map) map.addLayer(vector);
			return vector;
		},
		/**
		 * 创建标记图层
		 * @param name 图层名称
		 * @param options 此类与父类提供的属性
		 * @param map 地图对象
		 * @returns {SuperMap.Layer.Markers}
		 */
		createMarkerLayer: function(name, options, map){
			if(!name) name = "markers";
			var marker = new SuperMap.Layer.Markers(name, options);
			if(map) map.addLayer(marker);
			return marker;
		},
		/**
		 * 控制标签渲染的策略
		 * @param style {Object} 标签的样式。此对象的可设属性可分为两类，第一类是标签文本样式，第二类是标签背景框样式。
		 * @param styleGroups 样式组
		 * @returns {___strategy0}
		 */
		createStrategyGeoText: function(style, styleGroups){
			var strategy = new SuperMap.Strategy.GeoText();
			if(style) strategy.style = style;
			if(styleGroups) {
				strategy.groupField = "styleGroupId";
				strategy.styleGroups = styleGroups;
			}
			return strategy;
		},
		/**
		 * 创建绘制要素
		 * @param layer 执行绘制要素的图层
		 * @param isActivate 控件是否立即生效
		 * @param handler 要素绘制事件处理器，指定当前绘制的要素类型和操作方法
		 * @param options 设置该类及其父类开放的属性
		 * @returns {SuperMap.Control.DrawFeature}
		 */
		createDrawFeature: function(layer, isActivate,handler, options){
			if(!layer || !handler) return null;
			var drawFeature = new SuperMap.Control.DrawFeature(layer,handler, options);
			MapManager.getMap().addControl(drawFeature);
			if(isActivate) drawFeature.activate();
			return drawFeature;
		},
		/**
		 * 创建矢量要素编辑控件
		 * @param map 地图对象
		 * @param layerName 执行绘制要素的图层
		 * @param isActivate 控件是否立即生效
		 * @param editCompleted 编辑完成的回调函数
		 * @returns {SuperMap.Control.ModifyFeature}
		 */
		createModifyFeature: function(layerName, isActivate, editCompleted){
			var layer = MapHandler.getVectorLayerByName(layerName);
			var modifyFeature = new SuperMap.Control.ModifyFeature(layer);
			MapManager.getMap().addControl(modifyFeature);
			if(isActivate) modifyFeature.activate();
			// 当图层上的要素编辑完成时，触发该事件
			if(layer) layer.events.on({"afterfeaturemodified": editCompleted});
			return modifyFeature;
		},
		/**
		 * 给地图添加图层
		 */
		addLayer: function(map, layers){
			if(map && layers){
				if(layers.length > 1)
					map.addLayers(layers);
				else
					map.addLayer(layers);
			}
		},
		/**
		 * 创建要素
		 * @param geometry 对应的几何对象
		 * @style style {Object}要素样式
		 * @param layer 要素显示的图层
		 * @returns {SuperMap.Feature.Vector}
		 */
		createFeature: function(geometry, style, layer){
			var feature = new SuperMap.Feature.Vector(geometry);
			if(style) feature.style = style;
			if(layer) layer.addFeatures(feature);
			return feature;
		},
		/**
		 * 创建要素
		 * @param geometry 对应的几何对象
		 * @style style {Object}要素样式
		 * @param layer 要素显示的图层
		 * @returns {SuperMap.Feature.Vector}
		 */
		createAllFeature: function(features,layer){
//			var vLayer = MapHandler.getVectorLayerByName(layer);
//			if(vLayer) vLayer.addFeatures(features);
		},
		/**
		 * 创建文本标签类
		 * @param x {float}横坐标。
		 * @param y {float}纵坐标。
		 * @param text 显示文本
		 * @returns {SuperMap.Geometry.GeoText}
		 */
		createGeoText: function(x, y, text){
			var geoText = new SuperMap.Geometry.GeoText(x, y, text);
			return geoText;
		},
		/**
		 * 通过要素的属性对，获取对象数组
		 * @param layer 图层
		 * @param attrName 属性名称
		 * @param attrVal 属性值
		 * @returns
		 */
		getFeaturesByAttribute: function(en){
			var vLayer = null;
			if(en.layerName){
				vLayer = MapHandler.getVectorLayerByName(en.layerName);
				return vLayer.getFeaturesByAttribute(en.attrName, en.attrVal);
			}
		},
		/**
		 * 获取点的图层对象
		 * 根据名称获取marker的图层对象
		 */
		getMarkerLayerByName: function(name){
			if(!name || name == "") name = layerName.markerLayer;
			var mLayers;
			if(MapManager.getMap()!=null){
				mLayers = MapManager.getMap().getLayersByName(name);
			}
			var mLayer = (mLayers && mLayers.length > 0 ? mLayers[0] : null);
			 if(!mLayer){
				 mLayer = MapHandler.createMarkerLayer(name);
			   	 MapHandler.addLayer(MapManager.getMap(),mLayer);
			 }
			 return mLayer
		},
		/**
		 * 获取面的图层对象
		 * 根据名称获取Vector的图层对象
		 * @param type 师徒类型
		 */
		getVectorLayerByName: function(name, type){
			
			 return {};
		},
		
		/**
		 * 求几何对象的缓冲区
		 * @param ezscGeo 基准对象
		 * @param distance 缓冲半径
		 * @returns
		 */
		bufferGeo: function(ezscGeo, distance){
			var geo = EzGeoPSTool.buffer(ezscGeo, distance);
			return geo;
		},
		/**
		 * 量算距离、面积
		 * @param en
		 */
		measureFunction: function(en){
			var url = MapManager.getUrl();
			if(!en.queryMode) en.queryMode = SuperMap.REST.MeasureMode.DISTANCE;
			var measureParam,myMeasuerService;
			measureParam = new SuperMap.REST.MeasureParameters(en.eyeGeo), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
			myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
			myMeasuerService.events.on({ "processCompleted": function(args){
				var sourceGeo = en.eyeGeo;
				if(eyeObj.attrs.eyeBarType == 3){
					sourceGeo = sourceGeo.components[sourceGeo.components.length-1];
					var distance = args.result.distance/1000;
					en.distance = distance.toFixed(2)+"公里";
				}else if(eyeObj.attrs.eyeBarType == 4){
					sourceGeo = sourceGeo.components[0].components[sourceGeo.components[0].components.length-2];
					var area = args.result.area/1000;
					en.distance = area.toFixed(2)+"平方公里";
				}
    			en.longitude = sourceGeo.x;
				en.latitude = sourceGeo.y;
				
				en.callback(en);
			} });
			//对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
			myMeasuerService.measureMode = en.queryMode;
		   	myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
		},
		/**
		 * 测算完成回调函数
		 */
		measureEyeCompleted: function(en){
			en.name = en.distance;
			var titleStyle = new Object();
			titleStyle.pos = 0;
			titleStyle.color = "red";
			titleStyle.bgColor = "";
			titleStyle.borderColor = "";
			en.titleStyle = titleStyle;
			MapManager.createTitle(en);
		},
		/**
		 * 鹰眼小工具 完成的回调方法
		 * @param eventArgs
		 */
		drawEyeCompleted: function(en){
			en.type = "eyeObj";
			if(en.showType == MapConstant.Point){
				en.height = 33;
				en.width = 27;
				MapManager.createMarker(en);
			}else{
				if(!en.eyeGeo) return;
				var queryMode = null;
				if(eyeObj.attrs.eyeBarType == 3){
					queryMode = SuperMap.REST.MeasureMode.DISTANCE;
				}else if(eyeObj.attrs.eyeBarType == 4){
					queryMode = SuperMap.REST.MeasureMode.AREA;
				}
				if(queryMode){
					en.queryMode = queryMode;
					en.callback = MapHandler.measureEyeCompleted;
					MapHandler.measureFunction(en);
				}
			}
			initEyeToobar();
		},
		/**
		 * 地图基础资源的查询完成回调函数
		 */
		mapResQueryCompleted: function(datas){
		    if (!datas) {
		        return;
		    }
		    for (var i in datas) {
	            if(!datas[i] || (datas[i] instanceof Function)){
	            	continue;
	            }
	            var en = datas[i];
	            en.isWork = false;
	            var point = MapManager.createPoint(en);
	            var geo = MapManager.getMap().getExtent().toGeometry();
	            if(MapManager.intersects(point, geo)){
	            	en.isWork = true;
	            	en.height = 20;
		            en.width = 20;
		            en.layerName = layerName.markerLayer;
		            en.action = "click";
		            en.callback = MapManager.openInfoWindow;
		            MapManager.doResourceChart(en);
	            }
	        }
		},
		 /**
		 * 点周边分析成功回调函数
		 * @param BufferAnalystEventArgs
		 */
		bufferAnalystCompleted: function (en) {
			//清除之前的痕迹
			if(!en.layerName) en.layerName = layerName.editVectorLayer;
			MapManager.clearOverlayByType(en);
			
		    /*搜索缓冲区要素*/
		    MapHandler.getVectorLayerByName(en.layerName).addFeatures(en.searchResultGeo);
		    
		    //范围的边界点集合
			var areaPoints = [];
			for(var i = 0; i < en.pointDatas.length; i++){
				var p = en.pointDatas[i];
				var pointJSON = {
						"x": p[0],
						"y": p[1]
				};
				areaPoints.push(pointJSON);
			}
			searchEntity.areaPoints = en.areaPoints = areaPoints;
		    
		    var sen = new MapEntity();
		    sen.layerName = en.layerName;
		    sen.click = function(args){
		    	MapHandler.openAnalystDistanceWin();
		    };
		    if(en.searchResultGeo.attributes.entity){
		    	en.searchResultGeo.attributes.entity.click = sen.click;
		    }else{
		    	en.searchResultGeo.attributes.entity = sen;
		    }
		    MapHandler.setSelectFeatureActive(sen);
		    // 直接执行搜索操作
		    if(en.detailInfo.isNowSearch == true){
		    	MapToobar.queryByGeo(en);
		    	return;
		    }
		    
		    MapHandler.openAnalystDistanceWin();
		},
		/**
		 * 打开缓存区半径调试工具框
		 */
		openAnalystDistanceWin: function(){
			var sliderEn = new MapEntity();
			var la = searchEntity.searchResultGeo.geometry.bounds;
	    	sliderEn.longitude = (la.right + la.left)/2 + (la.right - la.left)/4;
	    	sliderEn.latitude = (la.top + la.bottom)/2;
	    	//记录的缓冲半径数
	    	var ra = parseInt(searchEntity.radius * finalDistance);
	    	var content = "<div style='height: 70px;'><div style=‘position: absolute; left: 1px; top;10px;’>";
	    	content += "<span>半径</span>";
	    	content += "<input id='slider' style='width: 200px;' />";
	    	content += "<span id='distance'>";
	    	content += ra;
	    	content += "</span>米</div>";
	    	content += "<div style='position: absolute;left: 105px;top; 10px;'><input type='button' value='搜索' onclick='MapHandler.searchAnalystRes();' style='width: 50px;background: red'></div>";
	    	content += "</div>";
	    	sliderEn.content = content;
	    	MapManager.openInfoWindow(sliderEn);
	    	
	    	$("#slider").kendoSlider({
	 			min:10,
	 			max:5000,
	 			change:function(e){ 
	 				$("#distance").html(e.value == "" ? 0 : parseInt(e.value));
	 				searchEntity.radius = e.value / finalDistance;
	 				MapManager.bufferAnalystProcess(searchEntity);
	 			}
	 		});
	    	var slider = $("#slider").data("kendoSlider");
	    	slider.value(ra);
		},
		/**
		 * 搜索缓存区资源
		 */
		searchAnalystRes: function(){
			for(var i in searchEntity.existsDatas){
	        	var entitys = searchEntity.existsDatas[i][1];
	        	for(var j = 0;entitys && j < entitys.length; j++){
	        		if(entitys[j] && entitys[j].id){
	        			MapToobar.checkIsChart(entitys[j].type, entitys[j], false);
	        			MapManager.clearResourceChartByIdType(entitys[j]);
	        		}
	        	}
	        }
			MapToobar.queryByGeo(searchEntity);
		},
		/**
		 * 控制元素的显示与隐藏
		 * @param idstr
		 * @param flag 当值为true时，表示显示该内容；为false，表示隐藏该内容
		 */
		controlDisplay:function(idstr, flag){
			if(flag == true) {
				$("#"+idstr).css("display", "block");
			}else if(flag == false){
				$("#"+idstr).css("display", "none");
			}else{
				$("#"+idstr).toggle();
			}
		},
		
		copyProperties: function(en){
			var temp = new MapEntity(en);
			return temp;
		},
		/**
		 * 请求MQ的资源数据
		 * @param url mq服务地址
		 * @param userName 登录名称
		 * @param password 登录密码
		 * @param subscribe 标识
		 * @param callBack 回调函数
		 */
		requestMqResource: function(subscribe,callBack,url,userName,password){
			/**************初始值处理**start*************/
			if(!url) url = mqUrl;
			if(!userName) userName = mqUserName;
			if(!password) password = mqPassword;
			if(!subscribe) subscribe = "/exchange/GpsTopicExchange/routeData.GPS.510000000000.#";
			/**************初始值处理**end*************/
			
			if(!url || url == "") return;
			
			var ws = new SockJS(url);
			var client = Stomp.over(ws);
			// SockJS does not support heart-beat: disable heart-beats
			client.heartbeat.incoming = 0;
			client.heartbeat.outgoing = 0;

			client.debug = function(e) {
				$('#second div').append($("<code>").text(e));
			};

			// default receive callback to get message from temporary queues
			client.onreceive = function(m) {
			}
			var on_connect = function(x) {
				console.log("MQ【",url,"】连接成功");
				id = client.subscribe(subscribe, function(m) {
					// 异步实现获取资源数据
					setTimeout(function(){
						//try{
							callBack(m.body);
						//}catch(e){}
					},200);
					console.log("路由【",subscribe,"】连接成功");
				});
			};
			var on_error = function(er) {
				client.disconnect(function(){
					mq_connection_error.count ++;
	        		console.log('mq连接错误('+url+')，连接已释放，正在重连...');
	        	});
				//错误链接次数超过设定值时，强制刷新界面20170922
				if(mq_connection_error.count > mq_connection_error.alarmNum){
					window.location.reload();
				}
				//断网报错时，重新建立连接
				try{
					setTimeout(function(){
						MapHandler.requestMqResource(subscribe,callBack,url,userName,password);
					},10000);
				}catch(e){}
			};
			try{
				client.connect(userName, password, on_connect, on_error, '/');
			}catch(e){
				console.log('MQ推送error...');
			}
		},
	
		/**
		 * 组装地图基础资源的详情信息
		 * @param en
		 * @returns {String}
		 */
		buildBaseMapResContent: function(en){
			var c = "";
			if(en && en.detailInfo){
				var p = en.detailInfo;
				c += "<table width=\"100%\" id=\"resTable\">";
				if(en.type == "加油站_1@chengdu.1"){ //加油站
					c += "<tr><td width='45px'align='right'>名称：</td> <td>"+p["MInfo"]+"</td></tr>";
					/*c += "<tr><td align='right'>地址：</td> <td>"+p.getFieldValue("DZ")+"</td></tr>";
					c += "<tr><td align='right'>联系人：</td> <td>"+p.getFieldValue("LXR")+"</td></tr>";
					c += "<tr><td align='right'>联系电话：</td> <td>"+p.getFieldValue("LXDH")+"</td></tr>";
					c += "<tr><td align='right'>业务代码：</td> <td>"+p.getFieldValue("YWDM")+"</td></tr>";
					c += "<tr><td align='right'>管辖单位名称：</td> <td>"+p.getFieldValue("GXDWMC")+"</td></tr>";
					c += "<tr><td align='right'>管辖单位代码：</td> <td>"+p.getFieldValue("GXDWDM")+"</td></tr>";*/
				}else if(en.type == "XF_XFS_PT"){ //消防栓
					//c += "<tr><td width='135px'align='right'>名称：</td> <td>"+p.getFieldValue("MC")+"</td></tr>";
					c += "<tr><td width='85px'align='right'>地址：</td> <td>"+p.getFieldValue("DZ")+"</td></tr>";
					c += "<tr><td align='right'>所属辖区：</td> <td>"+p.getFieldValue("SSXQ")+"</td></tr>";
					c += "<tr><td align='right'>所属派出所名称：</td> <td>"+p.getFieldValue("SSPCSMC")+"</td></tr>";
					c += "<tr><td align='right'>消火栓形式：</td> <td>"+p.getFieldValue("XHSXS")+"</td></tr>";
					c += "<tr><td align='right'>压力：</td> <td>"+p.getFieldValue("YL")+"</td></tr>";
					c += "<tr><td align='right'>管网形式：</td> <td>"+p.getFieldValue("GWXS")+"</td></tr>";
					c += "<tr><td align='right'>所属公安分局：</td> <td>"+p.getFieldValue("SSGAFJ")+"</td></tr>";
					c += "<tr><td align='right'>所属消防单位：</td> <td>"+p.getFieldValue("SSXFDW")+"</td></tr>";
					c += "<tr><td align='right'>备注：</td> <td>"+p.getFieldValue("BZ")+"</td></tr>";
				}else{
					
				}
				c += "</table>";
			}
			return c;
		},
		/**
		 * 地图其他资源上图图标
		 * @param type 类型
		 */
		getImgUrl: function(type,flag){
		    //请到toobar.js中修改该函数
		},
		/**
		*  工具栏图标地址管理
		* @param type 类型 唯一标识
		* @param imgIsSelected 图片是否被选中
		* @param index 图片的位置
		*/
		getBarImg: function(type, imgIsSelected,index){
			if(!basePath) basePath = "";
			var returnImage = "";
			var barImages = [
             /* 天网*/
			["1",""+basePath+"images/res/toobar-1.png",""+basePath+"images/res/toobar-1click.png",""+basePath+"images/res/map06.png",""+basePath+"images/res/map06anxia.png"],
			/* 社会点位*/
			["1.2",""+basePath+"images/res/toobar-1.2.png",""+basePath+"images/res/toobar-1.2click.png",""+basePath+"supermap/theme/images/MapIcos/CardDotNomal.png"],
			/* 人员*/
			["4",""+basePath+"images/res/toobar-4.png",""+basePath+"images/res/toobar-4click.png",""+basePath+"images/res/map03.png",""+basePath+"images/res/03click.png"],
			/* 车辆*/
			["5",""+basePath+"images/res/toobar-5.png",""+basePath+"images/res/toobar-5click.png",""+basePath+"images/res/map01.png",""+basePath+"images/res/map01anxia.png"],
			/* 部件*/
			["6",""+basePath+"images/res/toobar-6.png",""+basePath+"images/res/toobar-6click.png",""+basePath+"images/res/map05.png",""+basePath+"images/res/map05anxia.png"],
			/* 部件-威县显示*/
			["6.5",""+basePath+"images/res/toobar-6.5.png",""+basePath+"images/res/toobar-6.5click.png",""+basePath+"images/res/map05.png",""+basePath+"images/res/map05anxia.png"],
			/* 服务单位*/
			["5.2",""+basePath+"images/res/toobar-5.2.png",""+basePath+"images/res/toobar-5.2click.png",""+basePath+"images/res/map05.png",""+basePath+"images/res/map05anxia.png"],
			/* 便民服务点*/
			["5.1",""+basePath+"images/res/toobar-5.1.png",""+basePath+"images/res/toobar-5.1click.png",""+basePath+"images/res/map05.png",""+basePath+"images/res/map05anxia.png"],
			/* 设置*/
			["100",""+basePath+"images/res/toobar-100.png",""+basePath+"images/res/toobar-100click.png"],
			["7",""+basePath+"images/res/toobar-7.png",""+basePath+"images/res/toobar-7click.png"],
			];
			for(var i = 0; i < barImages.length; i++){
				var barImage = barImages[i];
				if(barImage[0] == type){
					if(index > -1){
						try{
							if(type ==4){
								returnImage = barImage[3];
							}else{
								returnImage = barImage[index];
							}
						}catch(e){}
					}
					if(!returnImage || returnImage == ""){
						/* 针对警员，显示默认图标 */
						if(imgIsSelected == true){
							returnImage = barImage[2];
							break;
						}else{
							returnImage = barImage[1];
							break;
						}
					}else{
						break;
					}
				}
			}
			return returnImage;
		},
		/**
		* 根据资源类型获取图标。目前仅支持警员、警车
		* @param type 类型 唯一标识
		* @param typeId 类型id
		* @param imgIsSelected 图片的状态。。是否被选中
		* @param dbinFlag 单兵状态图标
		*/
		getBarImgByType: function(type, typeId,imgIsSelected,dbinFlag){
			if(!basePath) basePath = "";
			var returnImage = "";
			var barImages = [];
			barImages[4] = [
			                 /*城市管理*/
							["1",""+basePath+"images/res/city.png",""+basePath+"images/res/cityHigh.png",""+basePath+"images/res/cityDBin.png",""+basePath+"images/res/cityDBinOpen.png"],
							/* 社会治安*/
							["2",""+basePath+"images/res/zz.png",""+basePath+"images/res/zzHigh.png",""+basePath+"images/res/zzDBin.png",""+basePath+"images/res/zzDBinOpen.png"],
							/* 环境卫生*/
							["3",""+basePath+"images/res/sanitation.png",""+basePath+"images/res/sanitationHigh.png",""+basePath+"images/res/sanitationDBin.png",""+basePath+"images/res/sanitationDBinOpen.png"],
							/* 指挥操作*/
							["4",""+basePath+"images/res/03.png",""+basePath+"images/res/03click.png"],
							/* 监督管理*/
							["5",""+basePath+"images/res/03.png",""+basePath+"images/res/03click.png"],
							/* 红袖套*/
							["6",""+basePath+"images/res/hongxiutao.png",""+basePath+"images/res/hongxiutaoHigh.png",""+basePath+"images/res/hongxiutaoDBin.png",""+basePath+"images/res/hongxiutaoDBinOpen.png"],
							/* 网格人员 */
							["7",""+basePath+"images/res/wg.png",""+basePath+"images/res/wgHigh.png"]
							];
			barImages[5] = [
				            /*环卫车辆*/
							["1",""+basePath+"images/res/hwVehicle.png",""+basePath+"images/res/hwVehicleHigh.png"],
							/* 垃圾车辆*/
							["2",""+basePath+"images/res/trashVehicle.png",""+basePath+"images/res/trashVehicleHigh.png"],
							/* 执法车辆*/
							["3",""+basePath+"images/res/zfVehicle.png",""+basePath+"images/res/zfVehicleHigh.png"]
							];
				var tempImages = barImages[type];
				
				for(var i = 0; i < tempImages.length; i++){
					var barImage = tempImages[i];
					if(barImage[0] == typeId){//警员类型匹配
						/********************* 检验单兵状态 ****************/
						if(dbinFlag == true){
							returnImage = barImage[4];
							break;
						}else if(dbinFlag == false){
							returnImage = barImage[3];
							break;
						}
						/********************* 检验图标选中状态 ****************/
						if(imgIsSelected == true){
							returnImage = barImage[2];
							break;
						}else{
							returnImage = barImage[1];
							break;
						}
					}
				}
				return returnImage;
			}	
}
var MapConstant = {
		/*漫游状态*/
		Pan: "pan",
		/*测量距离状态*/
		Measure: "measure",
		/*点*/
		Point: 'Point',
		/*线*/
		Path: 'Path',
		/*面（多边形）*/
		Polygon: 'Polygon',
		/*圆*/
		Circle: "drawCircle",
		/*面（规则多边形）*/
		RegularPolygon: "RegularPolygon",
		/*矩形*/
		Box: 'Box'
};
function drawLayers(pLayers,bIsShow){
	var bIsDraw=false;
	var pDrawArea=[];
	for(var iLayer=0;iLayer<pLayers.length;iLayer++){
		var pLayer=pLayers[iLayer];
		//alert(pLayers.length+":"+pLayer.layerName)
		if(! pLayer.bShow && (typeof bIsShow=="undefined" || bIsShow==false)) continue;
		//绘制区域
		if(!bIsDraw && pLayer.bShow) {
			if(pLayer.queryObj.queryType<=5 && !bIsContain(pDrawArea,pLayer.queryObj)){
				drawQueryArea(pLayer.queryObj);
				pDrawArea.push(pLayer.queryObj);
			}
		//bIsDraw=true;
		}
		var pFeats=pLayer.features;
		//alert("===>"+pLayer.layerName);
		//alert("记录数:"+pFeats.length);
		for(var iIndex=0;iIndex<pFeats.length;iIndex++){
			var pFeat=pFeats[iIndex];
			var strType=pFeat.type;
			var strTitle=Trim(pFeat.dispname);
			var pPoint=pFeat.point;
			var strLine=pFeat.linestr;
			var pOverLay=null;
			var strPoints=strLine;
			if(strType=="point"){
				var pIcon=new Icon();
				pIcon.image=pLayer.imgURL;
				pIcon.height=pLayer.imgHeight;
				pIcon.width=pLayer.imgWidth;
				pIcon.leftOffset=pLayer.leftOffset;
				pIcon.topOffset=pLayer.topOffset;
				var pTitle=null;
				if(pLayer.bIsLabel)
				pTitle=new Title(strTitle,12,7);
				pOverLay = new Marker(pPoint,pIcon,pTitle);
				strPoints=pPoint.x+","+pPoint.y;
			}else{
				var pPath=strLine.split(";");
				if(pPath.length >1){
					pOverLay=new MultiFeat(strLine,"#ff0000", 3,0.5,"blue");
				}else if(strType=="polyline"){
					pOverLay=new Polyline(strLine,"#ff0000", 3);
					pOverLay.center=pFeat.getCenterPoint();
				}else if(strType=="polygon"){
					pOverLay=new Polygon(strLine,"#ff00FF", 3,0.5,"blue");
					pOverLay.center=pPoint;
				}
			}
			
			MapManager.getMap().addOverlay(pOverLay);
			//主要用于增加信息的
			/*var strAdded=null;
			if(_FeatureInfoAdded !=null)
				strAdded=_FeatureInfoAdded(strTitle,strPoints);
			var strHtml=pFeat.toHTML(strAdded);
			addOverLay(pOverLay,strHtml);
			pOverLay.name=strTitle;*/
		}
	}
}

//定义自定义覆盖物的构造函数   start
function SquareOverlay(en){    
 this._opts = en;    
}    
// 继承API的BMap.Overlay    
SquareOverlay.prototype = new BMap.Overlay();
// 实现初始化方法  
SquareOverlay.prototype.initialize = function(map){    
    if (this._opts.width == null || this._opts.width == undefined || Number(this._opts.width) == 0.0 || Number(this._opts.width) == 0){
    	this.width=300;
    }
    if (this._opts.height == null || this._opts.height == undefined || Number(this._opts.height) == 0.0 || Number(this._opts.height) == 0){
    	this.height=300;
    }	
	// 保存map对象实例   
	this._map = map;  
	var popup=document.getElementById("popup");
	if(popup){
    	document.getElementById("popup-content").innerHTML=this._opts.content;
    }else{
    	// 创建div元素，作为自定义覆盖物的容器   
	    popup = document.createElement("div");
	 	popup.style.position = "absolute";        
	    
	    popup.id = "popup";
	    popup.setAttribute("class","ol-popup");
	    popup.setAttribute("style","min-width:350px");
	    
	    
	    var popup_a=document.createElement("a");
	    popup_a.id="popup-closer";
	    popup_a.setAttribute("class","ol-popup-closer");
	    popup_a.onclick=MapManager.closeInfoWindow;
	    var popup_content=document.createElement("div");
	    popup_content.id = "popup-content";
	    popup.appendChild(popup_a);
	    popup.appendChild(popup_content);
//	    this._opts.content="<div id='map_clickinfo_essential_info' class='map_clickinfo_info'><table style='width:400px;height:200px;' id=\"resTable\"><tr><td><div class='ys-box' style='height:60px;'><p id='ys-Name' style='color:rgb(75, 207, 208);margin-top:10px;margin-left:4px;'>GX074便民警务站</p><span class='ys-span current' onclick='ysPoup(this,1)'>今日值班</span><span style='margin-left:0px;' class='ys-span' onclick='ysPoup(this,2)'>简介</span></div><div  id='duty-ys-box' style='height:130px;padding-left:10px;'><p style='margin-top:10px;'><span><strong >值班领导: </strong></span><span id='leaderNames' style='font-weight:bold;color:red;width:347px;display: inline-block'></span><br></p><div><p><strong>队员: </strong> </p></div></div><div class='hidden' id='summary-ys-box' style='overflow:auto;width:100%;height:130px;padding-left:10px;'><p id='summary'>GX074便民警务站</p></div></td></tr></table></div></div><div class='cl'></div>";
	    popup_content.innerHTML=this._opts.content;
		 
		// 将div添加到覆盖物容器中   
		 map.getPanes().markerPane.appendChild(popup);      
		// 保存div实例   
		 this._div = popup;
    }
    // 可以根据参数设置元素外观   
//	popup.style.width = this._opts.width + "px";    
//	popup.style.height = this._opts.height + "px";    
//	popup.style.background = this._opts.color; 
	// 需要将div元素作为方法的返回值，当调用该覆盖物的show、   
	// hide方法，或者对覆盖物进行移除时，API都将操作此元素。   
	return popup;    
}
// 实现绘制方法   
SquareOverlay.prototype.draw = function(){    
	var srcP=wgs84tobd09(parseFloat(this._opts.longitude), parseFloat(this._opts.latitude));
	var point = new BMap.Point(srcP[0], srcP[1]);
	// 根据地理坐标转换为像素坐标，并设置给容器    
 	var position = this._map.pointToOverlayPixel(point);    
 	this._div.style.left = position.x -50/*- this._opts.width / 2 - 36*/ + "px";    
 	this._div.style.top = position.y - ($("#popup").height() +50) + "px";    
}
// 实现显示方法    
SquareOverlay.prototype.show = function(){    
 if (this._div){    
   this._div.style.display = "";    
 }    
}      
// 实现隐藏方法  
SquareOverlay.prototype.hide = function(){    
 if (this._div){    
   this._div.style.display = "none";    
 }    
}
// 定义自定义覆盖物的构造函数   end