$(function(){
    userCountManager.initSource(1);
});
var userCountManager = {
	/**
	 * 加载数据源
	 */
	buildGrid:function (dataSource,hg){
	
		$("#resGrid").kendoGrid({ 
			selectable : "multiple",
			sortable: true,
            resizable: true,
            height:$(".tableCont").height() - 40,
            selectable : "row",
			dataSource : {
				data : dataSource
			},columns : [ {
				title : 'Id',
				field : 'id',
				hidden : true
			},{
				title : '序号',
				width:60,
				template: "<span class='row-number'></span>"  
			},{
				title : '操作时间',
				field : 'operationDate',
				template:"<div title='#:operationDate#' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:operationDate#<div>"
			},{
                title : '操作账号',
                field : 'operationName'
            },{
                title : '所属机构',
                field : 'organName'
            },{
                title : '操作模块',
                field : 'operationModule'
            },{
                title : '操作描述',
                field : 'operationDesc'
            },{
                title : '操作参数',
                field : 'params',
            	template:"<div title='#:params#' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>#:params#<div>"
            },{
                title : '访问IP',
                field : 'ipAddress'
            }],
            dataBound: function () {  
                var rows = this.items();  
                $(rows).each(function () {  
                    var index = $(this).index() + 1;  
                    var rowLabel = $(this).find(".row-number");  
                    $(rowLabel).html(index);  
                });  
            },
			
		});

	},
	/**
	 * 加载数据源
	 */
	initSource:function(pageNo){
        var	name = $.trim($("#name").val());
        var startTime = $("#startDay").val();
        var endTime = $("#endDay").val();
        var hg = $("#navigationLeft").height();
		$.ajax({
			url:basePath + "operationLog/getOperationLogList.do",
			type:"post",
			dataType:"json",
            async: false,
			data: {
                pageNo:pageNo,
				pageSize:20,
				startTime:startTime,
				endTime:endTime,
                name:name,
                totalRows: "",
				r:Math.random()
			},
			success:function(msg) {
				
				if(msg.code == 200) {
                    userCountManager.buildGrid(msg.data,hg);
                    $("#userNum").html(msg.totalRows);
                    var pg = pagination(pageNo, msg.totalRows, 'userCountManager.initSource', 20);
                    $("#page").html(pg);
				}
			}
			
		});

	},search: function(){
		
        userCountManager.initSource(1);
    }

};
