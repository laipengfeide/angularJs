var DbinMananger = {
	loadfirstDBin:function(){
		$.ajax({
    		url:basePath + "admin/getLiveDeviceByorgan.do",
    		type:"post",
    		dataType:"json",
    		data:{
    			organId:$("#organId").val()
    		},
    		success:function(msg){
    			if(msg.code == 200 && msg.data != null && msg.data.length > 0){
    				$.each(msg.data,function(){
    					var pId = this.deviceId;
    					var naming = this.naming;
    					DbinMananger.buildDBinOnline(pId,naming);
    				});
    			}
    		}
    	});
	},
   /**
    * 单兵上线逻辑处理
    * @param pId 警员id
    * @param naming 单兵播放naming
    */
	buildDBinOnline:function(pId,naming){
		if(pId == "" || naming == "" || ResourceDatas.DBinDatas[pId]){
	    	return;
	    }
	  	var resData =  ResourceDatas.datas[4].data;//获取地图数据人员的数据
	  	//1、封装单兵图传对象
	  	if(!resData[pId]){return;}
	  	//默认关闭图片
	  	var imgUrl = MapHandler.getBarImgByType(resData[pId].type,resData[pId].detailInfo.typeId,false,false);
	  	//2、组将单兵上图对象
	  	 var en = DbinMananger.buildVideoOnlineObj(pId,naming,resData[pId]);
	  	 if(!en){return;}
	  	 en.dbflag = true;
  		 ResourceDatas.DBinDatas[pId] = en;
  		 playingVideo(en);
  		 //2.5、清除当前人员地图的警员图标
  		 /*MapToobar.clearVectorMarkersByIdType(en);
  		 
  		 if( $("#dbinBox").hasClass("hidden")){
  			$("#dbinBox").removeClass("hidden");
  			$("#dbinBox").addClass("show");
  		 }
  		 var c = "";
		 var imgs = $("#dbinBox").find("img");
		 if(imgs.length == 0){
			 imgUrl = MapHandler.getBarImgByType(en.type,en.detailInfo.typeId,false,true);
			 en.iconUrl = imgUrl;
			 c +="<img id='"+pId+"' title='"+en.name+"' onclick='changeDBStatus(this)' src='"+imgUrl+"'/>";
			 playingVideo(en);
		 }else{
			 c +="<img id='"+pId+"' title='"+en.name+"' onclick='changeDBStatus(this)' src='"+imgUrl+"'/>";
		 }
		 c+="<div class='DBName' title= '"+en.name+"'>"+en.name+"</div>";
		 var txt = "<div class='DBinBody' id='DBinBody"+pId+"'>"+c+"</div>";
  		 $("#dbinBox").append(txt);
  		 MapManager.createPointOnly(en);*/
	},
	/**
	 * 单兵下线
	 * @param pId
	 */
	buildDBinOffline:function(pId){
	    var en = ResourceDatas.DBinDatas[pId];
	    if(!en || en == null ){return;}
	    //删除单兵对象中数据
	    ResourceDatas.DBinDatas[pId] = null;
	    return;
	    //清除地图单兵图标。
	    MapToobar.clearVectorMarkersByIdType(en);
	    en.detailInfo.naming = "";//注销naming
 		en.iconUrl = MapHandler.getBarImgByType(4,en.detailInfo.typeId,false);//单兵图片，默认false图标
 		
		//还原警员图标
 		MapManager.createPointOnly(en);
	    //清除列表的图标
	    $("#dbinBox #"+pId).remove();
	    $("#dbinBox #DBinBody"+pId).remove();
	    //删除后控制dbinBox 显示样式
		var imgs = $("#dbinBox").find("img");
	    if(imgs.length == 0){
	    	$("#dbinBox").removeClass("show");
	    	$("#dbinBox").addClass("hidden");
	    }
	},
  /**
    * 组建单兵上图对象
    * @param pId 警员Id
    * @param naming 单兵播放naming
    * @param data  警员地图对象
    */
	buildVideoOnlineObj:function(pId,naming,data){
		 var en ={};
 		 en.id = pId;
 		 en.type = 4;
 		 en.layerName = layerName.policeLayer;
 		 //获取在线经纬度
 		 var enty = MapManager.getOverlayByIdType(en);
 		 //如果该警员没有在线。直接打回
 		 if(!enty){ return;}
 		 if(enty.attributes && enty.attributes.entity){
 			var nen = enty.attributes.entity
 	 		 //获取在线警员的经纬度
 	 		 en.longitude=nen.longitude;
 	 		 en.latitude=nen.latitude;
 		 }
 		 en.name = data.detailInfo.name;
 		 en.detailInfo = data.detailInfo;
 		 en.detailInfo.naming = data.detailInfo.naming = naming;
 		 en.isTitle = true;
 		 en.action="click";
 		 en.callback=function(event){
			MapToobar.openInfoWindow(event);
		 }
 		 en.dbflag = true;
 		 en.iconUrl = MapHandler.getBarImgByType(en.type,en.detailInfo.typeId,false,false);
 		 return en;
	},
	/**
	 * 改变单兵人员状态图标
	 * @param e 图标对象
	 */
	changeDBStatus:function(e){
		var pId = e.id;
		var en = ResourceDatas.DBinDatas[pId];
		if(!en || en == null){
			return;
		}
		var imgUrlClick = MapHandler.getBarImgByType(4,en.detailInfo.typeId,false,true);
		var imgUrl = MapHandler.getBarImgByType(4,en.detailInfo.typeId,false,false);
		
		//改变地图图标
		if(e.src.indexOf(imgUrlClick) > -1){
			e.src = imgUrl;
			MapToobar.clearVectorMarkersByIdType(en);
			en.iconUrl = imgUrl;
			MapManager.createPointOnly(en);
		}else{ 
			e.src = imgUrlClick;
			MapToobar.clearVectorMarkersByIdType(en);
			en.iconUrl = imgUrlClick;
			MapManager.createPointOnly(en);
			//播放视频
			playingVideo(en);
		}
	},
   /**
    * 地图上面点击直通
    * @param en  直通对象
    */
	clickDBVideo:function(en){
	   var imgUrlClick = MapHandler.getBarImgByType(4,en.detailInfo.typeId,false,true);
	   var imgUrl = MapHandler.getBarImgByType(4,en.detailInfo.typeId,false,false);
	   //更改地图未播放单兵的对象
	   if(en.iconUrl.indexOf(imgUrl) > -1){
		   en.iconUrl = imgUrlClick;
		   en.action="click";
	 	   en.callback=function(event){
				MapToobar.openInfoWindow(event);
		   }
		   //删除单兵未播对象
		   MapToobar.clearVectorMarkersByIdType(en);
		   //更换图标重新上图
		   MapManager.createPointOnly(en);
		   //更改列表图标
		   $("#dbinBox #"+en.id).attr("src",en.iconUrl);
	   }
	   en.dbflag = true;
	   //播放单兵
	   playingVideo(en);
	}
};