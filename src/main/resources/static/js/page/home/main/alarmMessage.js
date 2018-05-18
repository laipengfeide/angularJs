	
	var plateColor = {
            "0":"白色",
			"1":"黄色",
			"2":"蓝色",
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
            "0":"未知",
			"1":"大型客车",
			"2":"货车",
			"3":"轿车",
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
        function gotoAlarmDetails(id){
    		$.ajax({
                    url: basePath +"map/queryAlarmEventById.do",
                    type: "post",
                    dataType: "json",
                    data: {
                        "eventId": id,
                        random : Math.random()
                    },
                      success: function (req) {
                    	if(req.code==200){
                    		var data = req.data.jsonContent.data;
                    		var codes = req.data.pushOrganCodes;
                    		var time = req.data.reportTime;
                    		var lon = req.data.lon;
                            var lat = req.data.lat;
                            buildAlarmDetails(data,codes,time,lon,lat);
                      	$("#alarmDetails").kendoWindow(
    				{
    	    			width:"800px",
    					height:"550px",
    					title: "报警信息详情",
    					iframe : false,
    					modal:true,
    					position:{top:"10%"},
    					close:function(){
    				
    					}
    				});
    				var a = $("#alarmDetails").data("kendoWindow");
    				a.center();
    				a.open();

                      }else{
                          kendo.message("查询失败!");
                      }
                      }
    		});
    	}
        
    	function buildAlarmDetails(data,codes,time,lon,lat){
    		$("#alarmNumber").html(data.uuid ? data.uuid:"");
    		$("#name").html(data.carowner_name ? data.carowner_name:"");
    		$("#people_id").html(data.id ? data.id:"");
    		$("#dataSource").html(data.dataSource ? data.dataSource:"");
    		$("#plate").html(data.plate ? data.plate:"");
    		$("#tag").html(data.tag ? data.tag:"");
    		$("#plateColor").html(data.plate_color ? plateColor[data.plate_color]:"");
    		$("#vehicleColor").html(data.vehicle_color ? vehicleColor[data.vehicle_color]:"");
    		$("#vehicleCategory").html(data.vehicle_category ? vehicleCategory[data.vehicle_category]:"");
    		$("#plateType").html(data.plate_type ? plateType[data.plate_type]:"");
    		$("#location").html(data.location ? data.location:"");
    		$("#action").html(data.action ? data.action:"");
    		$("#passTime").html(time ? time:"");
    		$("#longitude").html(lon ? lon:"");
    		$("#latitude").html(data.latitude ? data.latitude:"");
    		$("#policetype").html(data.policetype ? data.policetype:"");
    		$("#deviceCode").html(data.deviceCode ? data.deviceCode:"");
    		$("#areaCode").html(data.areaCode ? data.areaCode:"");
    		$("#policeid").html(data.policeid ? data.policeid:"");
    		$("#codes").html(codes ? codes:"");
    		//$("#carPhoto").html(data.car_photo ? data.car_photo:"");
         // var cao	=	data.car_photo ? data.car_photo:"";
    		if(data.car_photo==null || data.car_photo==""){
    			$("#carPhoto").css("display","none");
    		}else{
    			$("#carPhoto").css("display","block");
    			$("#carPhoto").prop("src",basePath+imageServerContext+data.car_photo);
    		}
    		

    	}