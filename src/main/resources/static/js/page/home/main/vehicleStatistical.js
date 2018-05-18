$(function(){
    setToday();
	$("#cgRight").css("height","100%");
	//historyManager.selectedType();
	
	vehicleStatiscal.initData(1);

	
});

	$(document).keydown(function(event) {  
        if (event.keyCode == 13) {  
        	vehicleStatiscal.search();
        }  
    });

	var plateColor = {
			"2":"蓝色",
            "0":"白色",
			"1":"黄色",
			"3":"黑色",
			"4":"其他颜色"
		};
		var vehicleColor = {
            "0":"未知",
			"1":"白",
			"2":"银",
			"3":"灰",
			"4":"黑",
			"5":"红",
			"6":"深蓝",
			"7":"蓝",
			"8":"黄",
			"9":"绿",
			"10":"棕",
			"11":"粉",
			"12":"紫",
			"13":"深灰",
			"14":"青",
			"15":"橙"
		};
        vehicleCategory ={
            
			"1":"大型客车",
			"2":"货车",
			"3":"轿车",
			"0":"未知",
			"4":"面包车",
			"5":"小货车",
			"6":"行人",
			"7":"二轮车",
			"8":"三轮车",
			"9":"SUV/MPV",
			"10":"中型客车"
		}
        var plateType = {
            "0":"未知",
			"1":"92式民用车",
			"2":"警车",
			"3":"上下军车",
			"4":"92式武警车",
			"5":"左右军车",
			"7":"02式个性化车",
			"8":"黄色双行尾牌",
			"9":"04式新军车",
			"10":"使馆车",
			"11":"一行结构的新武警车",
			"12":"两行结构体的新武警车",
			"13":"黄色1225农用车",
			"14":"绿色1325农用车",
			"15":"黄色1325结构农用车",
			"16":"摩托车",
			"100":"教练车",
			"101":"临时行驶车",
			"102":"挂车",
			"103":"领馆汽车",
			"104":"港澳入出车",
			"105":"临时入境车"
		};

/**
 * 资源列表对象
 */
var vehicleStatiscal = {
		


	/**
	 * 存储当前列的地图对象。切换时需要将已存在的对象还原图标
	 */
	OnSelectEnty:new Object(),
	
	/**
	 * 加载资源
	 */
	initData:function(pageNo){
		
		var organCode = $("#orgCode").val();
		var startTime = $("#startDay").val();
        var endTime = $("#endDay").val();
        var dateType ;
        var day=document.getElementsByName("dateType");
        for(var i=0;i<day.length;i++){
            if(day[i].checked){
                dateType =day[i].value;
            }
        }
		$.ajax({
			url:basePath + "feedback/feedbackCount.do",
			type:"post",
			data:{
				dateType:dateType,
				organCode:organCode,
				searchBeginTime:startTime,
				searchEndTime:endTime,
				pageNo:pageNo,
				pageSize:10,
				totalRows: "",
				r:Math.random()
		
			},
			dataType:"json",
			success:function(msg){
				if(msg.code == 200){
				  //  console.log(msg.data);
					//清空选中对象
					vehicleStatiscal.OnSelectEnty = {};
					//组装grid
					 vehicleStatiscal.getTotal(pageNo);
				
					vehicleStatiscal.buildGrid(msg.data);
					
					//已标注的资源上图
					//historyManager.dochart(msg.data);
					//var pg = pagination(pageNo,cars,'vehicleStatiscal.initData',10);
					
			       
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
		var jsonContentData={}
		for(var i=0;i<dataSource.length;i++){
			var data = dataSource[i]	
			if(data.jsonContent && data.jsonContent != ""){	
						try{
							jsonContent = JSON.parse(data.jsonContent);
							jsonContentData = jsonContent.data;
							if (jsonContentData.plate_color==0) {
								jsonContentData.plate_color="白色"
							}else{
								jsonContentData.plate_color=jsonContentData.plate_color  ? plateColor[jsonContentData.plate_color]:"";
							}
							if (jsonContentData.vehicle_color==0) {
								jsonContentData.vehicle_color="未知"
							}else{
								jsonContentData.vehicle_color=jsonContentData.vehicle_color ? vehicleColor[jsonContentData.vehicle_color]:"";
							}
							if (jsonContentData.vehicle_category==0) {
								jsonContentData.vehicle_category="未知"
							}else{
								jsonContentData.vehicle_category=jsonContentData.vehicle_category ? vehicleCategory[jsonContentData.vehicle_category]:"";
							}
							if (jsonContentData.reserved3=="null" || jsonContentData.reserved3=='"null"') {
								jsonContentData.reserved3="";
							}
							if (jsonContentData.id=="null" || jsonContentData.id=='"null"') {
								jsonContentData.id="";
							}
							jsonContentData.alarmTimes=data.alarmTimes;
							jsonContentData.feedbackTimes= data.feedbackTimes;

							
						}catch(e){}
				}
				arr.push(jsonContentData)
			}	
			
		var hg = $(".main").height() - $(".main .cg-search").height() - 43;
		$("#resGrid").kendoGrid(
			{  selectable : "multiple",
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
					title : '序号',
					width:"5%",
					template: "<span class='row-number'></span>"  
				},{
					title : '车牌',
					width:"10%",
					template:"<div title='#:plate#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:plate#<div>"
				},{
					title : '车牌颜色',
					width:"8%",
					template:"<div title='#:plate_color#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:plate_color#<div>"
				},{
					title : '车辆颜色',
					width:"8%",
					template:"<div title='#:vehicle_color#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:vehicle_color#<div>"
				},{
					title : '车辆类型',
					width:"10%",
					template:"<div title='#:vehicle_category#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:vehicle_category#<div>"
				},{
					title : '布控人员姓名',
					width:"15%",
					template:"<div title='#:reserved3#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:reserved3#<div>"
				},{
                    title : '布控人员类型',
                    width:"20%",
                    template:"<div title='#:dataSource#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:dataSource#<div>"
                },{
                    title : '布控人员证件号',
                    width:"15%",
                    template:"<div title='#:id#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:id#<div>"
                },{
                    title : '报警次数',
                    width:"7%",
                    template:"<div title='#:alarmTimes#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:alarmTimes#<div>"
                },{
                    title : '反馈次数',
                    width:"7%",
                    template:"<div title='#:feedbackTimes#' style='width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:feedbackTimes#<div>"
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
	
	getTotal:function(pageNo){
		var organCode = $("#orgCode").val();
		var startTime = $("#startDay").val();
        var endTime = $("#endDay").val();
        var dateType ;
        var day=document.getElementsByName("dateType");
        for(var i=0;i<day.length;i++){
            if(day[i].checked){
                dateType =day[i].value;
            }
        }
		$.ajax({
			url:basePath + "feedback/feedbackCountAll.do",
			type:"post",
			data:{
				dateType:dateType,
				organCode:organCode,
				searchBeginTime:startTime,
				searchEndTime:endTime,
				r:Math.random()
		
			},
			async: false,
			dataType:"json",
			success:function(msg){
				if(msg.code == 200){
					var data = msg.data;
				
					$("#carNumbers").html(data.cars);
					$("#alarmNumbers").html(data.alarmTimes);
					$("#feedBackNumber").html(data.feedbackTimes);
					var pg = pagination(pageNo,data.cars,'vehicleStatiscal.initData',10);
					 $("#page").html(pg);
					//return data.cars;
				}else{
					kendo.message(msg.description);
				}
			}
		});
	},
	
    search: function(){
    	vehicleStatiscal.initData(1);
    },

};




