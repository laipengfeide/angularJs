var replayingTraceLayer;

function TraceInfoData(id, name, points, startTime, endTime, imageStyle, lineStyle, startStyle, endStyle) {
    this.id = id;
    this.name = name;  
    this.points = points;
    this.startTime = startTime;
    this.endTime = endTime;
    this.titleVector = null;
    this.imageStyle = imageStyle;
    this.lineStyle = lineStyle;
    this.startStyle = startStyle;
    this.endStyle = endStyle;
}

function ReplayingTraceLayer() {
    this.layerName;
    this.animatorVector;
    this.titleVectorLayer;
    this.amimatorLineVector;
    this.allTraceVectorLayer;   
    this.traceInfoDatas;
    this.drawTraceTimeBack;
    this.drawTraceFinishBack;
    this.titleStyle;
    this.startTime ;
    this.endTime;
    this.timeSpan;
}

/* 
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒 
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00 
* 返回精度为：秒，分，小时，天 
*/
function getTraceDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式  
    startTime = startTime.replace(/-/g, "/");
    endTime = endTime.replace(/-/g, "/");
    //将计算间隔类性字符转换为小写  
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间  
    var eTime = new Date(endTime); //结束时间  
    //作为除数的数字  
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)); //17jquery.com  
}

function formatTraceDateString(theDate, formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, theDate.getFullYear());
    str = str.replace(/yy|YY/, (theDate.getYear() % 100) > 9 ? (theDate.getYear() % 100).toString() : '0' + (theDate.getYear() % 100));

    var month = theDate.getMonth() + 1;
    str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
    str = str.replace(/M/g, month);

    str = str.replace(/w|W/g, Week[theDate.getDay()]);

    str = str.replace(/dd|DD/, theDate.getDate() > 9 ? theDate.getDate().toString() : '0' + theDate.getDate());
    str = str.replace(/d|D/g, theDate.getDate());

    str = str.replace(/hh|HH/, theDate.getHours() > 9 ? theDate.getHours().toString() : '0' + theDate.getHours());
    str = str.replace(/h|H/g, theDate.getHours());
    str = str.replace(/mm/, theDate.getMinutes() > 9 ? theDate.getMinutes().toString() : '0' + theDate.getMinutes());
    str = str.replace(/m/g, theDate.getMinutes());

    str = str.replace(/ss|SS/, theDate.getSeconds() > 9 ? theDate.getSeconds().toString() : '0' + theDate.getSeconds());
    str = str.replace(/s|S/g, theDate.getSeconds());

    return str;
}

function TracePositonData(pId, pX, pY, pTime) {
    this.equipmentID = pId;
    this.happenTime = pTime;
    this.pX=pX;
    this.pY=pY;
}
/* 
* 初始化图层
*/
function initReplayingTraceLayer(map, layerName, titleStyle, timeSpan) {
    if (replayingTraceLayer) clearTraceInfoData();
    
}
/* 
* 初始化数据
*/
function initTraceInfoData(map, layerName, traceInfoDatas, startTime, endTime, titleStyle)
{
    if (!traceInfoDatas) return;  
    var timeSpan = getTraceDateDiff(startTime, endTime, "second");
    initReplayingTraceLayer(map, layerName, titleStyle, timeSpan);
    
    var trace = traceInfoDatas[0];
    
	if(replayingTraceLayer == null || replayingTraceLayer == undefined){
		var points=trace.points;
		var pPoints = [];
		//根据点坐标数据，生成对应的点对象
		for(var i = 0; i < points.length; i++) {
			var pd = points[i];
			//20170601 nishaodong 将收到的84坐标转为百度坐标
			var srcP=wgs84tobd09(parseFloat(pd.pX), parseFloat(pd.pY));
			var bPoint = new BMap.Point(srcP[0], srcP[1]);			
//			var bPoint = new BMap.Point(pd.pX, pd.pY);
			bPoint.happenTime = pd.happenTime;
			pPoints.push(bPoint);
		}		
		replayingTraceLayer = new BMapLib.LuShu(MapManager.getMap(), pPoints, {
			defaultContent: trace.name, //"信息窗体内容"
			autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
			icon: new BMap.Icon(trace.imageStyle.externalGraphic, new BMap.Size(52, 36), {
				anchor: new BMap.Size(0, 35)
			}),
			speed: 100,
			enableRotation: false, //是否设置marker随着道路的走向进行旋转
			landmarkPois: [],
			lineStyle:trace.lineStyle
		});
	}
	
    replayingTraceLayer.startTime=startTime;
    replayingTraceLayer.endTime=endTime;
    replayingTraceLayer.timeSpan=timeSpan;
    replayingTraceLayer.traceInfoDatas = traceInfoDatas;
    var vectors = [];
    var lineFeatures = [];
    var startTraceFeatures = [];
    var endTraceFeatures = [];
    for (var tIdx = 0, tLen = traceInfoDatas.length; tIdx < tLen; tIdx++) {
        var line = [];  //线对象
        var equipmentID = traceInfoDatas[tIdx].id;
        var tp;
        for (var pIdx = 0, pLen = traceInfoDatas[tIdx].points.length; pIdx < pLen; pIdx++) {
            tp = traceInfoDatas[tIdx].points[pIdx];
            if (pIdx == 0)
            {
                //添加起点图片
                var en={id:"_startMarker"+equipmentID,type:"marker",longitude:tp.pX,latitude:tp.pY,layerName:"marker",width:trace.startStyle.graphicWidth,height:trace.startStyle.graphicHeight,
					 iconUrl:trace.startStyle.externalGraphic};
//				MapManager.clearMarkerById(en);
				replayingTraceLayer._startMarker=MapManager.createMarker(en);
				
				var label = new BMap.Label(trace.name+" "+tp.happenTime,
					{offset:new BMap.Size(0,-20)
					}
				);
				label.setStyle({borderColor:'#ACA1AC'});
				replayingTraceLayer._startMarker.setLabel(label);
				
				MapManager.setCenter({longitude:tp.pX, latitude:tp.pY});
				MapManager.zoomTo(25);
            }
            var span = getTraceDateDiff(startTime, tp.happenTime, "second");
            
            //线轨迹增加点对象
            if (pIdx == pLen - 1) {
            	//添加起点图片
                var en={id:"_endMarker"+equipmentID,type:"marker",longitude:tp.pX,latitude:tp.pY,layerName:"marker",width:trace.endStyle.graphicWidth,height:trace.endStyle.graphicHeight,
					 iconUrl:trace.endStyle.externalGraphic};
//				MapManager.clearMarkerById(en);
				replayingTraceLayer._endMarker=MapManager.createMarker(en);
				
				var label = new BMap.Label(trace.name+" "+tp.happenTime,
					{offset:new BMap.Size(0,-20)
					}
				);
				label.setStyle({borderColor:'#ACA1AC'});
				replayingTraceLayer._endMarker.setLabel(label);
            }
            line.push([tp.pX, tp.pY]);
            
        }
        //添加完整线
//      if(!replayingTraceLayer._polyine){
//      	var en={id:equipmentID,type:"polyline_"+equipmentID,style:{strokeColor:"red", strokeWeight:3, strokeOpacity:0.5},pointDatas:line,layerName:"polyline"};
//			replayingTraceLayer._polyine=MapManager.createPolyline(en);
//      }

    }
    return replayingTraceLayer;
}
function clearTraceInfoData() {
	if(replayingTraceLayer){
		replayingTraceLayer.clear();
    	replayingTraceLayer.stop();
    	replayingTraceLayer=undefined;
	}
    
}

//开始播放动画
/**
 * @param {TracePositonData} trace
 */
function startTraceAnimator(trace) {
	if (replayingTraceLayer) {
       $("#tishi").text("X"+replayingTraceLayer._opts.speed);
       replayingTraceLayer.start();
    }
	        
}
//暂停播放动画
function pauseTraceAnimator() {
    if (replayingTraceLayer) {
        replayingTraceLayer.pause();
    }
}

//停止播放动画
function stopTraceAnimator() {
    if (replayingTraceLayer) {
        replayingTraceLayer.stop();
        //回调实现页面获得当前时间
        if( replayingTraceLayer.drawTraceFinishBack) replayingTraceLayer.drawTraceFinishBack();
    }
}

function onTraceFinished()
{
    stopTraceAnimator();
  //回调实现页面获得当前时间
    if( replayingTraceLayer.drawTraceFinishBack) replayingTraceLayer.drawTraceFinishBack();
    replayingTraceLayer.animatorVector.setVisibility(false);
    replayingTraceLayer.titleVectorLayer.setVisibility(false);
    //重新添加起点和终点坐标
    replayingTraceLayer.allTraceVectorLayer.removeAllFeatures();
    replayingTraceLayer.allTraceVectorLayer.addFeatures(replayingTraceLayer.allTraceVectorLayer.startTraceFeatures);
    replayingTraceLayer.allTraceVectorLayer.addFeatures(replayingTraceLayer.allTraceVectorLayer.endTraceFeatures);
}
//减速播放
function decreaseTraceSpeed() {
    if (replayingTraceLayer) {
    	var speed = replayingTraceLayer._opts.speed;
    	if(speed<=100)
		{
    		return 100;
		}
    	else
    	{
	        speed = speed - 200;
	        replayingTraceLayer._setOptions({speed: speed});
		}
        return speed;
    }
}

//加速播放
function increaseTraceSpeed() {
    if (replayingTraceLayer) {
    	var speed = replayingTraceLayer._opts.speed;
    	if(speed>=10000)
		{
    		return 10000;
		}
    	else
    	{
	        speed = speed + 200;
	        replayingTraceLayer._setOptions({speed: speed});
		}
        return speed;
    }
}
/**
 * 从给定位置开始播放
 * @param {Object} playTime
 */
function skipTracePlayTime(playTime)
{
	
    if (replayingTraceLayer) {
    	playTime = Math.ceil(playTime);
        var skipTime = replayingTraceLayer.startTime.replace(/-/g, "/");
        
        skipTime = formatTraceDateString(new Date(Date.parse(skipTime) + (1000 * playTime)), "yyyy-MM-dd hh:mm:ss");
		for (var tIdx = 0, tLen = replayingTraceLayer.traceInfoDatas.length; tIdx < tLen; tIdx++) {
            if (replayingTraceLayer.traceInfoDatas[tIdx].points.length == 0) continue;
            var preTP = replayingTraceLayer.traceInfoDatas[tIdx].points[0];
            var skipTP;
            var prePos;
            if (skipTime <= preTP.happenTime) skipTP = preTP; //第一个就满足
            else {
                for (var pIdx = 1, pLen = replayingTraceLayer.traceInfoDatas[tIdx].points.length; pIdx < pLen; pIdx++) {
                    var tp = replayingTraceLayer.traceInfoDatas[tIdx].points[pIdx];
                    if (skipTime > preTP.happenTime && skipTime <= tp.happenTime) {  //跳转的时间与各个点进行比较，取比跳转时间大的最小一个位置
                        skipTP = tp;
                        prePos = pIdx;
                        break;
                    }
                }
            }
            
            //没有找到，取最后一个
            if (!skipTP) {
            	skipTP = replayingTraceLayer.traceInfoDatas[tIdx].points[replayingTraceLayer.traceInfoDatas[tIdx].points.length - 1];
            	prePos = replayingTraceLayer.traceInfoDatas[tIdx].points.length;
            }
            
            var showTitle = replayingTraceLayer.traceInfoDatas[tIdx].name + "[" + skipTP.happenTime + "]";
            
            //从给定位置开始播放
            replayingTraceLayer.pause();
            replayingTraceLayer.i=prePos;
            replayingTraceLayer.start();
        }
        //回调实现页面获得当前时间
        if (replayingTraceLayer.drawTraceTimeBack) replayingTraceLayer.drawTraceTimeBack(skipTime);
    }
}
