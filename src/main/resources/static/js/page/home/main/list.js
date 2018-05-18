$(function(){
	//20170725 nishaodong 解决openlayer初始化不弹框的问题
	$("#mapdiv").height($(".main").height()-20);
    $("#mapdiv").width($(window).width()-$("#cgLeft").width() - 2);
	initMap();
	ListManager.initHtml();
    groupManager.fetchAllGroup();
});

/**
 * 综合指挥分组业务对象
 */
var trailManager = {
	currentDate:null,
	isInitFlag:{}, /** 分组是否加载数据*/
	NoGroupIds:{}, /** 存储未分组的id */
	NoGroupDatas:[], /** 未分组警员信息 */
	curTempDatas:{}, /** 用于组建分组列表，警员信息，模糊查询**/
	ResNavNumObj:{},/** 统计导航列表总数和在线数量 **/
	isGpsAndNum:{},/** 验证是否已经推送gps并且统计过在线数量**/
	isInitGBFlag:false,/* 是否加载天网数据  */
	isInitSHDWFlag:false/* 是否加载社会点位数据  */
};
var tempPicAndVideoUrl;
/**
 * 列表对象
 */
var ListManager = {
	initHtml:function(){
  		if($("#cg-left-tree").val()==undefined){
  			$("#resourcePanel").css("left","15px");
  		}
  		$("#cg-left-tree").css("top","60px");
  		$("#left-treeview").css("height","420px");
       
       var left = $("#resourcePanel").width() + $("#resourcePanel").offset().left - 5;
       $("#cgZoomBtn_list").css("left",left);
       
       //$("#cgLeft").css("position","absolute");
       //$("#cgLeft").css("z-index",10000);
	},
	initPGroupDatas:function(data){
		var pgDatas = data;
		//获取警员数据
		var pdatas = ResourceDatas.OpreatePoliceList;
			//声明未分组信息
			var nogroup = {
				id:"nogroup",
				name:"未分组",
				fullName:"未分组"
			};
			/** 遍历分组信息。 **/
			var j = 0;
			for(;j<pgDatas.length;j++){
				//存储分组列表中警员集合
				//存储分组对象
				var pgArray = [],pgData = pgDatas[j];
				/** 遍历人员信息  **/				
				var i = 0;
				for(;i<pdatas.length;i ++){
					if(pdatas[i].data.groupId){
						//判断分组id是否相同
						if(pdatas[i].data.groupId == pgDatas[j].id){
							pgArray.push(pdatas[i]);
						}
					}else{
						var pId = pdatas[i].data.id; 
						//如果已经存在警员id ，则不添加
						if(!trailManager.NoGroupIds[pId]){
							trailManager.NoGroupIds[pId] = pdatas[i];
							trailManager.NoGroupDatas.push(pdatas[i]);
						}
					}
				}
				var pgobj = {};
				pgobj.pgArray = pgArray;
				pgobj.pgdata = pgData;
				ResourceDatas.PGroupDatas[pgData.id] = pgobj;
		}
		//------------------------------处理未分组人员-----------------------------------
		if(pgDatas.length == 0){
    		/** 遍历人员信息  **/				
			var i = 0;
			for(;i<pdatas.length;i ++){
					var pId = pdatas[i].data.id;//警员id
					//如果已经存在警员id ，则不添加
					if(!trailManager.NoGroupIds[pId]){
						trailManager.NoGroupIds[pId] = pdatas[i];
						trailManager.NoGroupDatas.push(pdatas[i]);
					}
			}
    	}
		
		var nogroupObj = {};
		nogroupObj.pgArray = trailManager.NoGroupDatas;
		nogroupObj.pgdata = nogroup;
		//给数据源赋值
		ResourceDatas.PGroupDatas[nogroup.id] = nogroupObj;
		
		//清空未分组判断
		trailManager.NoGroupIds = {};
		trailManager.NoGroupDatas = [];
	},
	/**
     * 统计分组的总人数和在线人数
     * @param pobj 警员的对象
     * @param gobj 分组的对象
     * @param gpArray 存储警员的数组
     * @param resNavObj 存储导航条数量对象
     */
	buildNum:function(pobj,gobj,resNavObj){
    	//只计算报备的数量
		if(pobj.isOnLine != 0){
			//在线数量
			if(pobj.isOnLine == 2){
				gobj.pgdata.OnlineNum ++;
			}
			gobj.pgdata.CountNum ++;
		}
	},
	/*
	 * 点击视频刷新一次
	 */
	videoLoad: function(){
		$("#titleVideo").removeAttr("onclick");
		var refreshDatas = ResourceDatas.GBGroupDatas;
		var organCodes = $.trim($("#organPath").val());
		if(organCodes != ""){
			organCodes = organCodes.split("/");
		}
		organCodes = organCodes[organCodes.length - 1];
		$.ajax({
	   		url:basePath + "web/GBPlatForm/getOnlineDevices.do",
	   		type:"post",
	   		dataType:"json",
	   		data:{
	   			organCode:organCodes
	   		},
	   		success:function(msg){
	   		//获取了是否在线，刷新标签
	   			var res = msg;
		   		for(var i in refreshDatas){
		   			var data = refreshDatas[i];
		   			var gbDatas = data.GBDatas;
		   			for(var j in gbDatas){
		   				var tem = gbDatas[j];
		   				var id = tem.id;
		   				//下级平台
		   				if($("#isEquative").val() == "true"){
		   					id = tem.detailInfo.naming;
		   					if(id && id.split(":").length > 0){
		   						id = id.split(":")[0];
		   					}
		   				}
		   				for(var t=0;t<res.length;t++){
		   					if(id == res[t]){
								tem["online"]=true;
							}
		   				}
		   			}
		   		}
		   		ListManager.buildGroupHtml(1);
		   		$("#titleVideo").attr("onclick","ListManager.initDatasByType(this,1)"); 
	   		},
	   		error: function(msg){
	   			ListManager.buildGroupHtml(1);
	   			$("#titleVideo").attr("onclick","ListManager.initDatasByType(this,1)"); 
	   		}
	   	});
		
	},
	/*
	 * 视频设备点击刷新同步
	 */
	refresh: function(){
		$("#refreshBtn").attr("disabled",true);
		var refreshDatas = ResourceDatas.GBGroupDatas;
		var organCodes = $.trim($("#organPath").val());
		if(organCodes != ""){
			organCodes = organCodes.split("/");
		}
		organCodes = organCodes[organCodes.length - 1];
		$.ajax({
	   		url:basePath + "web/GBPlatForm/getOnlineDevices.do",
	   		type:"post",
	   		dataType:"json",
	   		data:{
	   			organCode:organCodes
	   		},
	   		success:function(msg){
	   		//获取了是否在线，刷新标签
	   			var res = msg;
		   		for(var i in refreshDatas){
		   			var data = refreshDatas[i];
		   			var gbDatas = data.GBDatas;
		   			for(var j in gbDatas){
		   				var tem = gbDatas[j];
		   				var id = tem.id;
		   				//下级平台
		   				if($("#isEquative").val() == "true"){
		   					id = tem.detailInfo.naming;
		   					if(id && id.split(":").length > 0){
		   						id = id.split(":")[0];
		   					}
		   				}
		   				for(var t=0;t<res.length;t++){
		   					if(id == res[t]){
								tem["online"]=true;
							}
		   				}
		   			}
		   		}
		   		if (msg.length!=0) { 
	   				kendo.message("点位更新成功");
	   				ListManager.buildGroupHtml(1);
				} else {
					kendo.message("点位更新失败");
				}
		   		$("#refreshBtn").attr("disabled",false);
	   		}
	   	});
		
	},
	/**
     * 组建综合指挥html元素
     * @param type  导航条类型
     */
	buildGroupHtml:function(type){
		if(!type){type = 4;}
    	$("#resourceGroupBox").empty();
    	$(".re-group-body").remove();
    	$("#gbTitle").remove();
    	trailManager.isInitFlag = {};
    	if(type == 1 || type == 1.2){
    		var d = "<div id='gbTitle' class='gb-title'><span>视频点位</span><button id='refreshBtn' class='gb-title-button2' onclick='ListManager.refresh()'>刷新</button><button id='syncDevBtn' class='gb-title-button1' onclick='ListManager.syncDevive()'>同步</button></div>";
    		$("#seachClass-div").after(d);
    		$("#resourceGroupBox").height("467");
    	}else{
    		$("#resourceGroupBox").height("507");
    	}
    	var groupList = trailManager.curTempDatas;
    	for(var i in groupList){
    		
    		var data = groupList[i];
    		//if(data && typeof data === "function"){return;}
    		var c = "";
    		c += "<div name='"+data.pgdata.id+"' id='re-group"+data.pgdata.id+"' class='re-group cursor'>";
    		c += "<div class='re-group-header'>";
    		if(type == 1 || type == 1.2){
    			c += "<span title='关闭'></span><span title='"+data.pgdata.name+"' class='g-name'>"+data.pgdata.name+"</span>";
        		var countNum = data.pgdata.deviceCount;
    			c += "<div class='hidden' style='float:right;margin-right:100px;'><i id='g-totalNum"+data.pgdata.id+"'>"+countNum+"</i></div>";
    		}else{
    			c += "<span title='关闭' ></span><span title='"+data.pgdata.name+"' class='g-name'>"+data.pgdata.name+"</span>";
    			var onlineNum = (data.pgdata.OnlineNum == undefined ? 0 : data.pgdata.OnlineNum);
        		var countNum = (data.pgdata.CountNum == undefined ? 0 : data.pgdata.CountNum);
    			c += "<div class='hidden' style='float:right;margin-right:100px;'><i id='g-onLineNum"+data.pgdata.id+"'>"+onlineNum+"</i>/<i id='g-totalNum"+data.pgdata.id+"'>"+countNum+"</i></div>";
    		}
    		c += "</div>";
    		c += "<div id='re-group-body"+data.pgdata.id+"' class='re-group-body hidden'></div>";
    		c += "</div>";
    		$("#resourceGroupBox").append(c);
    	}
    	/**
    	 * groud-header(分组每列) 绑定click事件
    	 *
    	 **/
    	
		$(".re-group-header").click(function(){
			var firstSpan = $(this).find("span:first");
			var groupId = $(this).parent().attr('name');
			if(firstSpan.attr('title') == "展开"){
				$(this).parent().animate({height:"auto"},1000);
				firstSpan.attr('title','关闭');
				$("#re-group-body"+groupId).addClass("hidden");
			}else{
				$(this).parent().animate({height:"auto"},1000);
				firstSpan.attr('title','展开');
				if(type == 1 || type == 1.2){
					//组装分组警员信息
					ListManager.buildGBHtml(groupId);
				}else{
					//组装分组警员信息
					ListManager.buildGPoliceHtml(groupId);
				}
			}
		});
		//默认展开第一个
		$(".re-group-header:first").click();
	},
	/**
     * 组建天网html
     * @param id 
     */
	buildGBHtml:function(id){
		$("#re-group-body"+id).removeClass("hidden");
    	if(trailManager.isInitFlag[id] == true){
    		return;
    	}
    	trailManager.isInitFlag[id] = true;
    	$("#re-group-body"+id).empty();
    	var gblist = trailManager.curTempDatas[id].GBDatas;
    	for(var i in gblist){
    		var c = "",img,flag,online;
    		online = gblist[i].online;
    		//如果没有online属性，给它赋值属性
    		if(online==null){
    			gblist[i]["online"]=false;
    			online=false;
    		}
    		try{
    			flag = gblist[i].detailInfo.detailInfo.isShare;//是否重点
    		}catch(e){}
			c += "<div id='"+gblist[i].id+"' class='p-box' onclick='ListManager.playVedio("+JSON.stringify(gblist[i].detailInfo)+")'>";
			if(flag){
				if(tempType == 1){
					img = MapHandler.getImgUrl(1.12);
					
				}else{
					img = MapHandler.getImgUrl(1.22);
				}
			}else{
				if(tempType == 1){
					//视频设备是否在线图片
					if(online){
					 	 img = MapHandler.getImgUrl(1.13);
					}else{
						//不在线
						 img = img=basePath+"images/res/tw_zd_b.png";
					}
					//img = MapHandler.getImgUrl(1.13);
				}else{
					img = MapHandler.getImgUrl(1.2);
				}
			}
			c += "<image src='"+img+"' id='duty-img-"+gblist[i].id+"' class='p-img' style='height:20px;width:20px;margin-left:15px;'/>";
			var nameLocals = gblist[i].detailInfo.nameLocal.trim();
			if(gblist[i].detailInfo.nameLocal &&  !nameLocals==""){
				c += "<div class='p-name gb-name' title='"+nameLocals+"'>"+nameLocals+"</div><br>";
			}else{
				
				c += "<div class='p-name gb-name' title='"+gblist[i].name+"'>"+gblist[i].name+"</div><br>";
			}
			c += "</div>";
			$("#re-group-body" + id).append(c);
    	}
	},
	/**
     * 组建分组警员信息
     * @param id 	分组id
     */
	buildGPoliceHtml:function(id){
		$("#re-group-body"+id).removeClass("hidden");
    	if(trailManager.isInitFlag[id] == true){
    		return;
    	}
    	trailManager.isInitFlag[id] = true;
    	$("#re-group-body"+id).empty();
    	//添加在线和不在线box
    	var txt = "<div class='duty-online'></div><div class='duty-offline'></div><div class='no-duty'></div>";
    	$("#re-group-body"+id).append(txt);
    	
    	var groupList = trailManager.curTempDatas;
   		//警员数据集合
   		var pdatas = groupList[id].pgArray,i = 0;
   		for( ; i < pdatas.length; i++){
   			var pdata = pdatas[i];
   			//组装责任网格
   			var areaStr = "";
   			if(pdata.areaInfo && pdata.areaInfo.length > 0){
   				areaStr = pdata.areaInfo[0].name;
   			}else{
   				areaStr = "---------------";
   			}
    		var c = "",img;
    			c += "<div name='"+pdata.data.id+"' id='"+pdata.data.gpsId+"' class='p-box cursor'>";
    			c += "<image id='duty-img-"+pdata.data.id+"' class='p-img' style='margin-left:15px;'/>";
    			c += "<span title='"+pdata.data.name+"' class='g-name' style='margin-left:5px;vertical-align:text-top;'>"+pdata.data.name+"</span><br>";
   				c += "<div class='p-detail'>";
   				c += "<div title='"+areaStr+"' class='p-area hidden' style='margin-left:38px;'>"+areaStr+"</div>";
   				c += "<div title='"+pdata.data.typeName+"' class='g-name' style='width:70px;margin-left:52px;'>"+pdata.data.typeName+"</div>";
   				c += "<div>"+(typeof pdata.data.mobile == 'undefined' ? ' ' : pdata.data.mobile)+"</div>";
   				c += "</div>";
   				c += "</div>";
    		//在线
    		if(pdata.isOnLine == 2){
    			img = MapHandler.getImgUrl(4.11);
   				$("#re-group-body" + id +" .duty-online").append(c);
   				$(".duty-online #duty-img-"+pdata.data.id).attr("src",img);
   				var obj = pdata;
   				ChartManager.doChartForOnline(obj,4);
    		}
    		//不在线
    		else if(pdata.isOnLine == 1){
    			img = MapHandler.getImgUrl(4.12);
   				$("#re-group-body" + id + " .duty-offline").append(c);
   				$(".duty-offline #duty-img-"+pdata.data.id).attr("src",img);
    		}
    		//未报备
    		else{
    			img = MapHandler.getImgUrl(4.13);
   				$("#re-group-body" + id + " .no-duty").append(c);
   				$(".no-duty #duty-img-"+pdata.data.id).attr("src",img);
    		}
   		}
   		/* 鼠标移动每行变色 */
		$(".p-box").bind("mouseover", function() {
			$(this).css("background-color", "#08597D");
		});
		$(".p-box").bind("mouseout", function() {
			$(this).css("background-color", "#094165");
		});
		//动态添加时间控件
		$(".p-box").click(function(){
			//name 代表警员id
			var name = $(this).attr('name');
			//定位高亮图标
			ListManager.showTrail(name,4);
			//判断第一次点击人员列表
			if(trailManager.currentDate == null){
				ListManager.buildTrailControls(this);
			}
			//判断两次点击不同的人员
			else if(name != $(trailManager.currentDate).attr('name')){
				var lastName = $(trailManager.currentDate).attr('name');
				//移除上次生成的控件
				$("#trail"+lastName).remove();
				ListManager.buildTrailControls(this);
			}
		});
	},
	/**
     * 组建时间控件
     * @param obj 当前人员信息
     **/
	buildTrailControls:function(obj){
		//showTrail(id,type)
    	var pId = $(obj).attr('name');
    	var gpsId = $(obj).attr('id');
    	var pName =  $(obj).find("span:first").html();
    	//生成控件 
		var c = "";
			c += "<div id='trail"+pId+"'><input style='width:50%;' id='date"+pId+"' class='ty-dct-date'/>";
			c += "<span onclick=\"ListManager.queryGpsPoint('"+gpsId+"','"+pId+"',"+4+",'"+pName+"');\" class='k-primary k-button' style='margin-left:10px;'>轨迹</span></div>";
		$(obj).append(c);
		
		$("#date"+pId).kendoDatePicker({
	      	change: ListManager.onDpDay,
	      	value: new Date(),
		  	max:new Date()
		});
		trailManager.currentDate = obj;
	},
	onDpDay:function(){
	   var dates = this.value();
	   convertDate(dates);
	},
	onDpDayOnMap:function(){
		var dates = this.value();
		convertDateOnMap(dates);
	},
   /**
   	* 资源列表搜索(简拼)功能
   	* @param
    */
	searchVal:function(){
		if(tempType == 1 || tempType == 1.2){
			ListManager.seaByGB(tempType);
  		}else if(tempType == 5.2){
  			ListManager.seaByDevice(tempType);
  		}else{
  			ListManager.seaByPolice(tempType);
  		}
       var searchInfo = {
           gridSearch:$('#searchVal').val()
	   }
	   if(searchInfo.gridSearch){
         $.cookie("searchInfo",JSON.stringify(searchInfo));
	   }
	},
	/**
	 * 一键报警设备搜索
	 */
	seaByDevice:function(){
		var groupDeviceInfo=groupManager.allData;
		//groupManager.fetchGroup();
		var val=$.trim($("#searchVal").val());
		/*,tempDevice = [],len = ResourceDatas.AlarmDeivces.length;
		for(var i = 0; i < len; i++ ){
			var device = ResourceDatas.AlarmDeivces[i];
			if(device.name && device.name.indexOf(val) > -1 ){
				//验证人员类型是否勾选
				tempDevice.push(device);
			}
		}*/
		
		
		var segObj = {};
		for(var i in groupDeviceInfo){
			//循环获取每一分组
    		var gdata = groupDeviceInfo[i];
    		//循环获取当前组下设备
    		var gbdata = gdata.alarmDevcie;
    		
    		var gbObj = {},isExits = false;
   			for(var j in gbdata){
   				var name = gbdata[j].name.toLowerCase();
   				var  number=gbdata[j].number+"";
   				
 				if(name !='' && ( name.indexOf(val.toLowerCase()) > -1|| number.indexOf(val.toLowerCase())>-1)){
 					gbObj[gbdata[j].id] = gbdata[j];
 					isExits = true;
 				}
   			}
   			if(isExits == true){
   				//获取当前组id
   				var gId = gdata.group.id;
   				//查询结果临时保存对象
   				var en = {};
   				//查询到设备
   				en.GBDatas = gbObj;
   				//查询到的设备所属分组
   				en.pgdata = gdata.group;
   				//返回临时对象
   				segObj[gId] = en;
   			}
    	}
		this.buildSearchDeviceList(segObj);

		//getAlarmDevice(tempDevice);
	},
	buildSearchDeviceList:function(data){
		var strH="";
		if(data){
			$("#alarmDevice").html("")
			$.each(data,function(i,e){
				strH += "<span  title='"+data[i].pgdata.name+"' class='d-name cursor d-name"+i+"'  onclick = \"groupManager.reqDeviceSource('"+i+"')\">"+data[i].pgdata.name+"</span><hr>";
				$.each(e.GBDatas,function(q,w){
					if(e.GBDatas[q]){
					var cla=".d-name"+i;
					var img = basePath+"images/res/lb_sp.png";
	    			   strH += "<div data='show' class='ty-list-device cursor'>";
	    			   strH += "<span class='cursor' onclick = \"ChartManager.gotoCenterByDevice('"+q+"')\"</span>";
	    			   strH += "<td title="+e.GBDatas[q].name+">";
	    			   strH += "<span class='ty-span-img'><image src='"+img+"'/></span>";
	    			   strH += "<span class='list-number p-name' style='width:150px;font-size:13px;' title='"+e.GBDatas[q].name+"'>"+e.GBDatas[q].name+"</span><br>";
	    			   strH += "<span class='list-number ty-span-img' style='font-size:13px;' title='"+e.GBDatas[q].number+"'>"+e.GBDatas[q].number+"</span>";
	    			   strH += "<span class='list-address' style='font-size:13px;' title='"+e.GBDatas[q].address+"'>"+(e.GBDatas[q].address ? e.GBDatas[q].address : "")+"</span>";
	    			   strH += "</div>"; 
					}
				})
				

			})
			$("#alarmDevice").append(strH);
		}
		
	}
	,
	/**
     * 组建人员搜索结果
     * @param type 
     */
	seaByPolice:function(type){
		var val=$.trim($("#searchVal").val());
    	//存储模糊查询分组结果
  		var segObj = {};
  		//遍历分组信息
  		for(var i in ResourceDatas.PGroupDatas){
  			var sedata = ResourceDatas.PGroupDatas[i];
  			var j = 0,len = sedata.pgArray.length,sepArray = [];//sepArray 存储模糊查询警员结果
  			for(j; j < len; j++){
  				var pdata = sedata.pgArray[j];
  				var name = pdata.data.name;
  				var namePY = pdata.pinyin || "";//简拼
  				var typeId = pdata.data.typeId;//类型id
  				if(name.indexOf(val) > -1 || namePY.indexOf(val.toLowerCase()) > -1){
  					//验证人员类型是否勾选
  					sepArray.push(pdata);
  				}
  			}
  			//警员集合结果 》 0 ,放入分组集合
  			if(sepArray.length > 0){
  				var en = {
					pgArray:sepArray,
					pgdata:sedata.pgdata
  				};
  				var gId = sedata.pgdata.id;
  				segObj[gId] = en;
  			}
  		}
  		//遍历html元素
  		trailManager.curTempDatas = segObj;
  		ListManager.buildGroupHtml(tempType);
	},
	/**
     * 组建天网搜索集合
     * @param type
     */
	seaByGB:function(type){
		var val=$.trim($("#searchVal").val()),templist;
    	if(type == 1){
    		templist = ResourceDatas.GBGroupDatas;
   	 	}else{
   	 		templist = ResourceDatas.SHDWGroupDatas;
   	 	}
    	var segObj = {};
    	for(var i in templist){
    		var gdata = templist[i];
    		var gbdata = gdata.GBDatas;
    		var gbObj = {},isExits = false;
   			for(var j in gbdata){
   				var name = gbdata[j].name.toLowerCase();
 				if(name.indexOf(val.toLowerCase()) > -1){
 					gbObj[gbdata[j].id] = gbdata[j];
 					isExits = true;
 				}
   			}
   			if(isExits == true){
   				var gId = gdata.pgdata.id;
   				var en = {};
   				en.GBDatas = gbObj;
   				en.pgdata = gdata.pgdata;
   				segObj[gId] = en;
   			}
    	}
    	trailManager.curTempDatas = segObj;
    	ListManager.buildGroupHtml(tempType);
	},
	/**
     * 获取gps点集合，然后上图。
     * @param gpsId
     */
	queryGpsPoint:function(gpsId,id,type,name){
		//add by:nisd 间隔2秒才能下一次点击，否则导致卡死问题
	   $("#trail"+id).children("span:last-child").hide();
	   setTimeout(function(){
	   	$("#trail"+id).children("span:last-child").show();
	   },2000);	
	   
	   MapManager.closeInfoWindow();
	   if(gpsId =='undefined'){
		   kendo.message("没有绑定gps！不能查询轨迹！");
		   return;
	   }
	   //表示地图上面人员车辆的历史轨迹
	   if(id =='undefined'){
		   convertDate(new Date());
	   }
	   if(!query_Gps_trail || !query_Gps_trail.startDate){
		   convertDate(new Date());
	   }
	   queryGpsByAjax(gpsId,name,type);
	},
	/**
     * 获取gps点集合，然后上图。
     * @param gpsId
     */
	queryGpsPointOnMap:function(gpsId,id,type,name){
		
	   MapManager.closeInfoWindow();
	   if(gpsId =='undefined'){
		   kendo.message("没有绑定gps！不能查询轨迹！");
		   return;
	   }
	   //表示地图上面人员车辆的历史轨迹
	   if(id =='undefined'){
		   convertDateOnMap(new Date());
	   }
	   if(!query_Gps_trail_OnMap || !query_Gps_trail_OnMap.startDate){
		   convertDateOnMap(new Date());
	   }
	   queryGpsByAjaxOnMap(gpsId,name,type);
	   
	   query_Gps_trail_OnMap={};
	},
	/**
	* 控制历史轨迹显示与隐藏
    */
	showTrail:function(id,type,trailNum){
	   query_Gps_trail={};
	   var obj;
	   d:for(var i in trailManager.curTempDatas){
		   var gdata = trailManager.curTempDatas[i];
		   var len = gdata.pgArray.length;
		   for(var j = 0; j<len; j++){
			   if(gdata.pgArray[j].data.id == id){//警员id相同
				   obj = gdata.pgArray[j].data;
			   	   break d;
			   }
		   };
	   }
		var en=new MapEntity();
		en.id=id;
		en.type = type;
		type==4 ? en.name=obj.name :en.name=obj.number;
		en.detailInfo=obj;
		//获取经纬度
		if(ResourceDatas.gpsResDatas && ResourceDatas.gpsResDatas[type][obj.gpsId]){
			var ent=ResourceDatas.gpsResDatas[type][obj.gpsId];
			en.latitude=ent.latitude;
			en.longitude=ent.longitude;
		}
		if(!en.latitude || !en.longitude) return;
		//警员警车对象上图
		ChartManager.showHighLightChart(en);
	},
	/**
	 * 视频列表点击播放
	 * @param entity
	 */
	playVedio:function(entity){
	   //播放视频
		ListManager.playVideoForMap(entity);
		//解除naming与事件id关系
		AlarmDeviceManager.EventResource[entity.naming] = null;
	   //定位和高亮图标
	   if(tempType == 1.2){//社会点位
	   		ChartManager.showHightCamera(entity,otherCameraList,tempType);
	   		return;
	   }else if(tempType == 1){//天网
	   		ChartManager.showHightCamera(entity,cameraList,tempType);
	   		return;
	   }
	},
   /**
    * 多窗口视频播放
    * @param id代表naming
    * @param name
    */
	playVideoForMap:function(en){
		//获取图片和视频路径
	   	$.ajax({
	   		url:basePath + "web/GBPlatForm/getPicUrl.do",
	   		type:"post",
	   		dataType:"json",
	   		success:function(msg){
	   			if(msg.code == 200){
	   				tempPicAndVideoUrl=msg.data;
	   				//播放视频
	   				//playingVideo(en);
                    newPlayingVideo(en);
	   			}
	   		}
	   	});
	},
   /**
    * 人员类型过滤触发事件
    */
	policeTitleChecked:function(obj){
		trailManager.isGpsAndNum = {};//清空控制上下线状态对象
   		policeTypes.length=0;
   		$("#policeType input[type=checkbox]").each(function(){
   			var flag = $(this).parent().css("display")==='none';
    		if(this.checked && flag == false){
    			policeTypes.push($(this).val());
    		}
    		$(this).attr('disabled', 'disabled');
		});
   		//---------------------------------1、操作地图资源、上下线---------------------------------
   		var cutypeId = $(obj).val();
   		var mapArray = [];
   		//组装上、下图集合 mapArray
   		var mapdatas = ResourceDatas.gpsResDatas[4];
   		for(var k in mapdatas){
   			if(mapdatas[k].detailInfo.typeId == cutypeId){
   				mapArray.push(mapdatas[k]);
   			}
   		}
   		var flag = $(obj).is(":checked");
   		if(flag){//勾选上图
   			for(var i =0;i<mapArray.length;i++){
   				ChartManager.doChartForOnline(mapArray[i],4);
   			}
   		}else{//取消上图
   			for(var i =0;i<mapArray.length;i++){
   				var en = new MapEntity();
   				en.layerName = layerName.policeLayer;
   				en.id = mapArray[i].detailInfo.id;
   				en.type = 4;
   				MapManager.clearOverlayByIdType(en);
   			}
   		}
   		$("#policeType input[type=checkbox]").each(function(){
			$(this).removeAttr('disabled');
		});
   		if(tempType == 1 || tempType == 1.2){
   			return;
   		}
   		//----------------------------2、验证人员勾选类型，并改变在线数量----------------------------
   		ListManager.buildAndChcekDatas(ResourceDatas.PGroupDatas);
	    var onlineNum = 0;
	    var countNum = 0;
  	 	for(var i in trailManager.curTempDatas){
  	 		var cugdata = trailManager.curTempDatas[i];
  	 		onlineNum += cugdata.pgdata.OnlineNum;
  	 		countNum += cugdata.pgdata.CountNum;
  	 	}
  	 	//总数量 重新赋值
  	 	if(tempType == 4){//执法人员
  	 		trailManager.ResNavNumObj.ZFOnlineNum = onlineNum;
  	 		trailManager.ResNavNumObj.ZFCountNum = countNum;
  	 		$("#zfOnlineId").html(onlineNum);
  			$("#zfDutyId").html(countNum);
 		}else if(tempType == 4.1){//网格人员
 			trailManager.ResNavNumObj.WGOnlineNum = onlineNum;
 			trailManager.ResNavNumObj.WGCountNum = countNum;
  	 		$("#wgOnlineId").html(onlineNum);
  			$("#wgDutyId").html(countNum);
 		}
  		//----------------------------3、刷新综合指挥列表----------------------------
  	 	ListManager.buildGroupHtml(tempType);
  		$("#policeType input[type=checkbox]").each(function(){
			$(this).removeAttr('disabled');
		});
	},
   /**
    * 组装已勾选的checkbox类型数据源
    * @param data 数据源
    * @param isTotal 是否统计总数
    */
	buildAndChcekDatas:function(data,isTotal){
		//存储模糊查询分组结果
 		var segObj = {};
	    var resNavObj ={};
 		//遍历分组信息
 		for(var i in data){
 			var sedata = data[i];
 			//重置每个分组的数量
 			sedata.pgdata = sedata.pgdata || {};
 			sedata.pgdata.OnlineNum = 0;
 			sedata.pgdata.CountNum = 0;
 			sedata.pgArray = sedata.pgArray || [];
 			var j = 0,len = sedata.pgArray.length,sepArray = [];//sepArray 存储模糊查询警员结果
 			for(; j < len; j++){
 				var pdata = sedata.pgArray[j];
 				var typeId = pdata.data.typeId;//类型id
 				sepArray.push(pdata);
 				//统计每个组的人数
				ListManager.buildNum(pdata,sedata,resNavObj);
 			}
 			if(sepArray.length > 0){
 				var gId = sedata.pgdata.id,en = {};
 				en.pgArray = sepArray;
 				en.pgdata = sedata.pgdata;
 				segObj[gId] = en;
 			}
 		}
 		//总数
 		if(isTotal){
 			ListManager.buildNavNumHtml(4,resNavObj);
 		}
 		//遍历html元素
 		trailManager.curTempDatas = segObj;
	},
   /**
    *
    * @param resNavObj 存储当前类型数量
    * @param type 导航资源类型
    */
	buildNavNumHtml:function(type,resNavObj){
		resNavObj.type = type;
		trailManager.ResNavNumObj.ZFOnlineNum = resNavObj.ZFOnlineNum;
		trailManager.ResNavNumObj.ZFCountNum = resNavObj.ZFCountNum;
		trailManager.ResNavNumObj.WGOnlineNum = resNavObj.WGOnlineNum;
		trailManager.ResNavNumObj.WGCountNum = resNavObj.WGCountNum;
		$("#zfOnlineId").html(resNavObj.ZFOnlineNum);
		$("#zfDutyId").html(resNavObj.ZFCountNum);
		$("#wgOnlineId").html(resNavObj.WGOnlineNum);
		$("#wgDutyId").html(resNavObj.WGCountNum);
	},
   /**
  	* 切换人员车辆天网导航标签
  	* @param obj
  	* @param type
    */
	initDatasByType:function(obj,type){
		/*if($("#organId").val() == 1){
  			//加载数据
  			return;
  	   }*/
		
	   tempType=type;
  	   $("#searchVal").val("");
	   $("#list-type span").removeClass("list-span-current");
	   $(obj).addClass("list-span-current");
	   //切换标签清除所有高亮图标
	   ChartManager.clearHighLightMarker();
	   
	   if(type == 4 || type == 4.1){
		   ListManager.buildNavCheck(type);
	   	//获取数据源
	   	ListManager.buildAndChcekDatas(ResourceDatas.PGroupDatas);
	   	//刷新列表
	   	ListManager.buildGroupHtml();
	   }
	   //天网和社会点位
	   else if(type == 1){
			trailManager.curTempDatas = ResourceDatas.GBGroupDatas;
			//同步视频状态
			ListManager.videoLoad();
			//ListManager.buildGroupHtml(tempType);
	   }else if(type == 5.2){
		    $("#resourceGroupBox").empty();
		    $("#gbTitle").remove();
			$("#resourceGroupBox").append("<div id='alarmDevice' class='deviceBox'></div>");
			$("#resourceGroupBox").append("<div id='cameraPageDiv'></div>");
			$("#resourceGroupBox").height("507");
			
			getAlarmDevice(ResourceDatas.AlarmDeivces);
	   }
	},
  /**
    * 组建导航条复选框样式
    * @param type 导航类型
    */
	buildNavCheck:function(type){
		if(type == 4){
		   $("#cgb").css("display","");
		   $("#hwb").css("display","");
		   $("#szb").css("display","");
		   $("#hxtb").css("display","none");
		   $("#wgb").css("display","none");
	   }else{
		   $("#cgb").css("display","none");
		   $("#hwb").css("display","none");
		   $("#szb").css("display","none");
		   $("#hxtb").css("display","");
		   $("#wgb").css("display","");
	   }
	},
	/**
	 * 同步
	 */
	syncDevive:function(){
		kendo.confirm("确定要同步吗？",{ok:{text:"&nbsp&nbsp确定&nbsp&nbsp",callback:function(e){
		//如果已经上图，删除上图
		var resSatus = null;
		if(!ResourceDatas.datas[1]){
			return;
		}
		var resSatus = ResourceDatas.datas[1]["status"];
		if(resSatus){
			$("#cameraPic").click();
		}
		//不可操作
		$("#syncDevBtn").attr("disabled",true);
		$.ajax({
			url : basePath + "/web/GBPlatForm/flushOrganBindUser.do",
			type : "post", 
			dataType : "json",
			data: {
				organId:$("#organId").val(),
				organPath:$("#organPath").val()
			},
			success : function(req) {
				$("#syncDevBtn").attr("disabled",false);
				if(req.code==200){
					//重新加载数据
					$("#cameraPic").removeAttr("onclick");
					MapToobar.resourceRequest($("#organId").val(),1, null,ToobarConfig.initResourceDatasCallback);
					//更新视频列表
					$("#titleVideo").click();
				}else{ 
					kendo.message(req.description); 
					}
				}
			});
		 	e.close(); 
		 	e.destroy();
			}}
		});
	}
}

var getAlarmDevice = function(datas){
	initResPage(datas,1,15);
}

/********************资源分页功能*******************/
var ResourcePageManager = new Object();
var ResourceChartManager = new Object();
/**
 * 初始化分页功能数据
 **/
function initResPage(datas,curPage, pageNum){
	  /* ResourcePageManager.pageDiv = "共<span id='pageCount'> </span>页&nbsp;每页<span id='pageNum'> </span>条&nbsp;第<span id='curPage'> </span>页&nbsp;<img onclick='firstPage()' src='"+basePath+"supermap/theme/images/pagingBtns/home.png'>";
	   ResourcePageManager.pageDiv +="<img onclick='prePage()' src='"+basePath+"supermap/theme/images/pagingBtns/up.png'>";
	   ResourcePageManager.pageDiv +="<img onclick='nextPage()' style='margin:5px;' src='"+basePath+"supermap/theme/images/pagingBtns/down.png'>";
	   ResourcePageManager.pageDiv +="<img onclick='finalPage()' src='"+basePath+"supermap/theme/images/pagingBtns/last.png'>";
	   ResourcePageManager.pageDiv +="<input id='goPageNum' class='k-textbox' type='text' style='width: 42px;height:20px;border:1px solid gray;'> <span style='margin-left: 4px; cursor: pointer;' onclick='goPage();'>转到<span>";

	   $("#alarmDevice").empty();
	   $("#pageCount").parent().html("");
	   $("#cameraPageDiv").html(ResourcePageManager.pageDiv);
	   var pageCount = Math.ceil(datas.length/pageNum);
	   $("#pageCount").html(pageCount);
	   $("#curPage").html(curPage);
	   $("#pageNum").html(pageNum);
	   ResourcePageManager.pageCount = pageCount;
	   ResourcePageManager.curPage = curPage;
	   ResourcePageManager.pageNum = pageNum;*/
	   ResourceChartManager.resDatas=datas;
	   ResourceChartManager.resType=1;

	   buildData();
}
/**
 * 首页
 **/
function firstPage(){
	  /* $("#curPage").html(1);
	   ResourcePageManager.curPage = 1;*/
	   buildData();
}
/**
 * 上一页
 **/
function prePage(){
	   var curPage = $("#curPage").html();
	   if($("#curPage").html() > 1)
		  curPage --;
	   else
		  curPage = 1;
	   $("#curPage").html(curPage);
	   ResourcePageManager.curPage = curPage;
	   buildData();
}
/**
 * 下一页
 **/
function nextPage(){
	   var curPage = $("#curPage").html();
	   if(Number($("#curPage").html()) < Number($("#pageCount").html()))
		  curPage ++;
	   else
		  curPage = $("#pageCount").html();
	   $("#curPage").html(curPage);
	   ResourcePageManager.curPage = curPage;
	   buildData();
}
/**
 * 最后一页
 **/
function finalPage(){
	   $("#curPage").html($("#pageCount").html());
	   ResourcePageManager.curPage = $("#pageCount").html();
	   buildData();
}
/**
 * 跳转
 **/
function goPage(){
	   var goPageNum = $("#goPageNum").val();
	   if(isNaN(goPageNum)){
		   $("#goPageNum").val("");
		   return;
	   }
	   if(goPageNum > ResourcePageManager.pageCount){
		   goPageNum = ResourcePageManager.pageCount;
	   }else if(goPageNum < 1){
		   goPageNum = 1;
	   }
	   $("#curPage").html(goPageNum);
	   ResourcePageManager.curPage = goPageNum;
	   $("#goPageNum").val(goPageNum);
	   buildData();
}

var groupManager={
		groupinfo:[],
		groupDeviceInfo:[],
		otherDeviceInfo:[],
		allData:[],
		fetchAllGroup:function(){
			$.ajax({
				url : basePath + "alarmdeviceGroupWeb/queryAlarmListByName.do",
				type : "get",
				data : {
					"organCode":$("#orgCode").val()
				},
				dataType : "json",
				async:false, 
				success:function(req){
					if(req.code == 200){
						groupManager.allData=req.data;
						
					}
				}
			});
		},
		fetchGroup:function(){
			$.ajax({
				url : basePath + "alarmdeviceGroupWeb/getAlarmDeviceGroupListByOrganCode.do",
				type : "post",
				data : {
					"organCode":$("#orgCode").val()
				},
				dataType : "json",
				async:false, 
			}).done(function(req){
				if(req.code == 200){
					groupManager.groupinfo=req.data;
				}
			});
		},reqDeviceSource:function(groupId){
			var deviceHtl=$(".d-name"+groupId).next(".ty-list-device").first().attr("data");
			if(deviceHtl =='hide' || deviceHtl ==undefined){
				$(".d-name"+groupId).next(".ty-list-device").first().attr("data","show")
				var orgCode = $("#orgCode").val();
				if(groupId<0){
					groupManager.getNoGroupDevice()
				}else{
					$.ajax({
						url : basePath + "alarmdeviceGroupWeb/queryAGListByOganCode.do?organCode="+orgCode+"&groupId="+groupId,
						type : "post", 
						dataType : "json",
						success : function(req) {
							 if(req.code == 200){
								 groupManager.groupDeviceInfo=req.data;
								 groupManager.bindDeviceData(groupId,req.data)
							 }
						}
					});
				}
			}else{
				
				groupManager.toggle(groupId);
			}
			
			
		},getNoGroupDevice:function(){
	    	var orgCode = $("#orgCode").val();
	    	$.ajax({
				url : basePath + "alarmdeviceGroupWeb/queryAlarmListByOganCode.do?organCode="+orgCode,
				type : "post", 
				dataType : "json"
			})
			.done(function(req){
				var str="";
				 if(req.code == 200){
					 groupManager.otherDeviceInfo = req.data;
					 groupManager.bindDeviceData(-1,req.data)
				 }
			});
	    },bindDeviceData:function(groupId,data){
	    	var strH=""
	    	var cla=".d-name"+groupId;
	    		 $.each(data,function (i,e){
	    			   var img = MapHandler.getImgUrl(e.type == 1 ? 5.21 : 5.22);
	    			   strH += "<div data='show' class='ty-list-device cursor'>";
	    			   strH += "<span class='cursor' onclick = \"ChartManager.gotoCenterByDevice('"+e.id+"')\"</span>";
	    			   strH += "<td title="+e.name+">";
	    			   strH += "<span class='ty-span-img'><image src='"+img+"'/></span>";
	    			   strH += "<span class='list-number p-name' style='width:150px;font-size:13px;' title='"+e.name+"'>"+e.name+"</span><br>";
	    			   strH += "<span class='list-number ty-span-img' style='font-size:13px;' title='"+e.number+"'>"+e.number+"</span>";
	    			   strH += "<span class='list-address' style='font-size:13px;' title='"+e.address+"'>"+(e.address ? e.address : "")+"</span>";
	    			   strH += "</div>"; 
	    		   })
	       $(".ty-list-device").remove();
	        if(groupId<0){
	     		 $(".d-name-1").after(strH);
	    	}else{
	    		$(cla).after(strH);
	    	}
	    	
	    },toggle:function(groupId){
	    	if(groupId<0){
	     		 if($(".d-name-1").next().attr("data")=="show"){
	     			$(".d-name-1").next().attr("data","hide")
	     			$(".d-name-1").nextAll(".ty-list-device").hide();
	     		 }else{
	     			$(".d-name-1").next().attr("data","show")
	     			$(".d-name-1").nextAll(".ty-list-device").show();
	     		 }
	    	}else{
	    		var cla=".d-name"+groupId;
	    		if($(cla).next().attr("data")=="hide"){
	    			$(cla).next().attr("data","show");
	    			$(cla).nextAll(".ty-list-device").show();
	    		}else{
	    			$(cla).next().attr("data","hide");
	    			$(cla).nextAll(".ty-list-device").hide();
	    		}
	    		
	    	}
	    }
}

/**
 * 绑定数据
 **/
function buildData(){
	  /* var resDatas = ResourceChartManager.resDatas;
	   var resType = ResourceChartManager.resType;*/
/*	cHtml += "<div class='ty-list-device'>";
	cHtml += "<span class='cursor' onclick = \"ChartManager.gotoCenterByDevice('"+entity.id+"')\"</span>";
	cHtml += "<td title="+entity.name+">";
	cHtml += "<span class='ty-span-img'><image src='"+img+"'/></span>";
	cHtml += "<span class='list-number p-name' style='width:150px;'>"+entity.name+"</span><br>";
	cHtml += "<span class='list-number ty-span-img'>"+entity.number+"</span>";
	cHtml += "<span class='list-address'>"+(entity.address ? entity.address : "")+"</span>";
	cHtml += "</div>";*/
	
	
	
	   groupManager.fetchGroup();
	   //groupManager.reqDeviceSource();
	  // groupManager.getNoGroupDevice();
	   var ngroup=[];
	   var cHtml = "";
	   for(var i = 0; i < groupManager.groupinfo.length; i++){  
	   var entity = groupManager.groupinfo[i];
			if(entity && entity.name){
				//var img = MapHandler.getImgUrl(entity.type == 1 ? 5.21 : 5.22);
	    		if(entity.groupName != "" || entity.groupName.length>0){
	    			cHtml += "<span  title='"+entity.name+"' class='d-name cursor d-name"+entity.id+"'  onclick = \"groupManager.reqDeviceSource('"+entity.id+"')\">"+entity.name+"</span><hr>";
	    		}
			}
	   }
	   cHtml += "<span  title='未分组' class='d-name cursor d-name-1'  onclick = \"groupManager.reqDeviceSource(-1)\">未分组</span><hr>";
	  
	
	   if(cHtml != ""){
		   $("#alarmDevice").append(cHtml);
	   }
	 	//回车事件绑定
	    $('#goPageNum').bind('keydown', function(event) {
	        if (event.keyCode == "13") {
	            //回车执行查询
	       		goPage();
	        }
	    });
	    /* 鼠标移动每行变色 */
		$(".ty-list-device").bind("mouseover", function() {
			$(this).css("background-color", "#F2F2F2");
		});
		$(".ty-list-device").bind("mouseout", function() {
			$(this).css("background-color", "white");
		}); 
		
		

		$("#alarmDevice span").first().click();
}
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
   			//enty.iconUrl=MapHandler.getBarImgByType(4,en.data.typeId,false);
   			if(en.data.iconUrl && en.data.iconUrl != "0.0"){
   				enty.iconUrl = basePath + "uploadFile" + en.data.iconUrl;
   			}else{
   				enty.iconUrl = MapHandler.getImgUrl(4.01);
   			}
   		}
   		else{
   			enty.iconUrl=MapHandler.getBarImgByType(5,en.data.purposeId,false);
   			enty.name=en.data.number;
   		}
//		MapManager.createPointOnly(enty);
		MapManager.doResourceChart(en);
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
		en.isTitle = true;
		if(en.type == 4){
			en.layerName = layerName.policeLayer;
			if(!ResourceDatas.policeControl)
				return;
			//如果有单兵对象,不改变图标。只定位
			var dbFlag = ResourceDatas.DBinDatas[en.id];
			if(dbFlag && dbFlag != null){
				return;
			}
			//如果有指定的id图标,不改变图标,只定位
			var dbMaker = MapManager.getResourceChartByIdType(en);
			if(dbMaker && dbMaker != null&&MapVesion=='SuperMap'){
				return;
			}
		}else if(en.type == 5){
			en.layerName = layerName.policeCarLayer;
		}else if(en.type == 5.2){
			if(!ResourceDatas.alarmDeviceControl){
				return;
			}
			 en.isTitle = false;
			en.layerName = layerName.partMarkerLayer;
		}
		//清除图标
//		MapToobar.clearVectorMarkerProByIdType(en);
		en.shwoType='Feature';
		MapManager.clearResourceChartByIdType(en);

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
//		    en.iconUrl=MapHandler.getBarImgByType(en.type,en.detailInfo.typeId,true);
			if(en.detailInfo.iconUrlHigh && en.detailInfo.iconUrlHigh != "0.0"){
				en.iconUrl = basePath + "uploadFile" + en.detailInfo.iconUrlHigh;
   			}else{
   				en.iconUrl = MapHandler.getImgUrl(4.02);
   			}
	    }else if(en.type == 5){
		   en.iconUrl=MapHandler.getBarImgByType(en.type,en.detailInfo.purposeId,true);
	    }else if(en.type == 5.2){
	       en.iconUrl=MapHandler.getImgUrl(5.24);
	    }
		en.action="click";
		en.callback=function(event){
			MapToobar.openInfoWindow(en);
		};
//		MapManager.createPointOnly(en);
		MapManager.doResourceChart(en);
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
//		   enty.iconUrl=MapHandler.getBarImgByType(4,enty.detailInfo.typeId,false);
		   if(enty.detailInfo.iconUrl && enty.detailInfo.iconUrl != "0.0"){
			   enty.iconUrl = basePath + "uploadFile" + enty.detailInfo.iconUrl;
  			}else{
  				enty.iconUrl = MapHandler.getImgUrl(4.01);
  			}
		   enty.layerName = layerName.policeLayer;
	   }else if(enty.type == 5){
	   		enty.iconUrl=MapHandler.getBarImgByType(5,enty.detailInfo.purposeId,false);
		    enty.layerName = layerName.policeCarLayer;
	   }else if(enty.type == 5.2){
		   if(enty.detailInfo.hasVideo==true){
			   enty.iconUrl=MapHandler.getImgUrl(5.23);
		   }else{
			   enty.iconUrl=MapHandler.getImgUrl(5.26);
		   }
		   //enty.iconUrl=MapHandler.getImgUrl(5.23);
		   enty.layerName = layerName.partMarkerLayer;
		   enty.isTitle = false;
	   }
		enty.action="click";
		enty.callback=function(event){
			MapToobar.openInfoWindow(enty);
		};
		
		MapManager.doResourceChart(enty);
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
			MapManager.doResourceChart(enty);
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
			   en.showType="Feature";
			   //删除feature要素
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
					enty.showType="Feature";
					MapManager.clearOverlayByIdType(enty);
					//删除警员feature高亮要素
					ResourceDatas.GBSelected[enty.id]=null;//聚合需要
					ResourceDatas.GBHight["hight"] = null;
					
					if(type == 1.1 && ResourceDatas.gbControl){//当右上角控制为显示时再去重新还原上图
						MapManager.doResourceChart(enty); //聚合时使用
//						MapManager.createPointOnly(enty);
					}
				}
				//添加 被选中天网的 全局变量
	   			ResourceDatas.GBSelected[en.id]=en.detailInfo.id;
	   			ResourceDatas.GBHight["hight"] = en;
	   			en.action="click";
				en.callback=MapToobar.openInfoWindow;
	   			MapManager.doResourceChart(en); // 聚合时使用
//	   			MapManager.createPointOnly(en);
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
 * 地图上弹窗日期处理
 */
var query_Gps_trail_OnMap={};
var convertDateOnMap = function (dates){
   var years = dates.getFullYear();
	var months = dates.getMonth() + 1;
	var days = dates.getDate();

	if(months<10){
		months = "0"+months;
	}
	if(days<10){
		days = "0"+days;
	}
	query_Gps_trail_OnMap.startDate=years + "-" + months + "-" + days+" "+"00:00:00";
	query_Gps_trail_OnMap.endDate=years + "-" + months + "-" + days+" "+"23:59:59";
	query_Gps_trail_OnMap.gpsId="";
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
		MapToobar.initResourceDatas(true, $("#organId").val(),ToobarConfig.initResourceDatasCallbackChart);
		//获取辖区状态 
		popedomManager.initAreaResource();
	},500);
}
/**
 * 清除工具条数据源
 */
var clearToobar = function(){

    MapToobar.clearVectorLayer(layerName.vectorLayer);
    MapToobar.clearVectorLayer(layerName.serPointLayer);
    MapToobar.clearVectorLayer(layerName.partMarkerLayer);
    MapToobar.clearVectorLayer(layerName.gatherLayer);

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
	ResourceDatas.PGroupDatas = {};
	trailManager.curTempDatas = {};
	//清除天网缓存
	ResourceDatas.GBGroupDatas = {};
	ResourceDatas.SHDWGroupDatas = {};
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




