var alarmAndNoReceiveCount={};
	$(document).ready(function() {  
		//收缩地图面板
		$("#panelClose").on("click",function(){
			if($(this).hasClass("panel-arrow-close")){
				//收缩左侧菜单
				$(".content .sidebar .page-fluid").first().fadeOut('fast');
				$(".content .main").css({"width":"calc(100% - 10px)"});
				$(this).removeClass("panel-arrow-close").addClass("panel-arrow-open");
				var nowUrl = window.location.pathname;
				if(nowUrl.indexOf("map/initGridPatrol.action")>-1){
					//警务联动页面报警列表显示
					$("#jwldPanel").show();
					$("#jwldPanel").load("${pageContext.request.contextPath}/map/queryAlarmNew.do?type=2&random="+Math.random(),function(s){
						s = s+"";
						if(s.indexOf("登录") > -1 && s.indexOf("LOGIN") > -1){ //session失效，自动跳转到登录界面  20171026
							window.location.reload();
						}
					});
				}else{
					$("#jwldPanel").hide();
				}
			}else{
				//还原
				$(".content .sidebar .page-fluid").first().fadeIn('slow');
				$(this).removeClass("panel-arrow-open").addClass("panel-arrow-close");
				$(".content .main").css({"width":"calc(100% - 320px)"});
				$("#jwldPanel").hide();
                $("#reslAlarmList").load("${pageContext.request.contextPath}/map/queryAlarmNew.do?type=1&random="+Math.random(),function(s){
                    s = s+"";
                    if(s.indexOf("登录") > -1 && s.indexOf("LOGIN") > -1){ //session失效，自动跳转到登录界面  20171026
                        window.location.reload();
                    }
                });
			}
			//openlayer 外层div宽度变化后需要重新更新
			if(MapVesion == "openLayers"){
				setTimeout(function(){
					map.updateSize();
				}, 1000);
			}
			
		}).on("mouseenter",function(){
			$("#panelClose .temp").remove();
		});
		if($("#xj-selected").val()!="xj-ldgl"){
			$("#panelClose .temp").remove();
		}
		if($("#panelClose .temp").length==1){
			setTimeout(function(){
				$("#panelClose .temp").remove();
			}, 5000);
		}
        getTodayAlarmCountAndNoReceiveCount();
	});
	function getTodayAlarmCountAndNoReceiveCount() {
        $.ajax({
            url:basePath+"map/getTodayAlarmCountAndNoReceiveCount.do",
            type: "post",
            dataType: "json",
            success: function(res){
                if(res.code == 200){
                   //赋值
                   var data = res.data;
                   var countNumber = data.noReceiveCount;
                   var todayAlarmCount = data.todayAlarmCount;
                   //放全局变量
                   alarmAndNoReceiveCount.countNumber=countNumber;
                   alarmAndNoReceiveCount.todayAlarmCount=todayAlarmCount;
                   $("#todayAlarmCount").html("今日("+todayAlarmCount+")");
                   $("span.xj-hint-box").text("未处理警情("+countNumber+")");
                   if(alarmAndNoReceiveCount.countNumber>99){
                       $("#count-number").text("99+");
                   }else {
                       if($("#count-number").countTo){
                           $("#count-number").countTo({"to":countNumber});
                       }else{
                           $("#count-number").text(countNumber);
                       }
                   }
                }else{
                    // kendo.message(res.description);
                }
            }
        });

    }
//坐席弹屏时，取消初始化警情上图20170915
if($("#globalSeatNumber").val()!=null && $("#globalSeatNumber").val() !=''){
	$("#alarmSwitch").val(false);
}
 $('#searchVal').bind('keydown', function(event) {
        if (event.keyCode == "13") {
            //回车执行查询
       		ListManager.searchVal();
        }
 });