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
                field: "rowNumber",
                title: "序号",
                template: "<span class='row-number'></span>",
                width:'65px'
            },{
				title : 'Id',
				field : 'id',
				hidden : true
			},{
				title : '登录名',
				field : 'useLogin'
			},{
                title : '真实名称',
                field : 'userName'
            },{
                title : 'SESSIONID',
                field : 'sessionId'
            },{
                title : '是否在线',
                field : 'onLine',
                template:"#if(onLine == 1){#<span style='color:black'>在线</span>#}else{#<span style='color:black'>离线</span>#}#"
            },{
                title : '平台',
                field : 'roleType',
                template:"#if(roleType == 2){#<span style='color:black'>APP</span>#}else{#<span style='color:black'>WEB</span>#}#"
            },{
                title : '访问IP',
                field : 'ipAddress'
            },{
                title : '所属机构',
                field : 'belongStation'
            },{
                title : '登录时间',
                field : 'createTime'
            },{
                title : '更新时间',
                field : 'updateTime'
            }],dataBound: function () {
                var rows = this.items();
                $(rows).each(function () {
                    var index = $(this).index() + 1;
                    var rowLabel = $(this).find(".row-number");
                    $(rowLabel).html(index);
                });
            }
		});

	},
	/**
	 * 加载数据源
	 */
	initSource:function(pageNo,orgId){
        var	uselogin = $("#uselogin").val();
        var username=$("#username").val();
        var ipaddress=$("#ipaddress").val();
        var hg = $("#navigationLeft").height();
        var state = $("#userCountBeFrom").val();
		$.ajax({
			url:basePath + "userCount/getServiceSetList.do",
			type:"post",
			dataType:"json",
            async: false,
			data: {
                orgId:orgId || $("#organId").val(),
                pageNo:pageNo,
				pageSize:15,
                uselogin:uselogin,
                username:username,
                ipaddress:ipaddress,
                state:state,
				r:Math.random()
			},
			success:function(msg) {
				var str="";
				if(msg.code == 200) {
                    userCountManager.buildGrid(msg.data,hg);
                    $("#userCountBeFrom").val(msg.state);
                    $("#userNum").html(msg.totalUsers);
                    $("#onLineUserNum").html(str+"WEB（"+msg.webOnLine+"）、"+"APP（"+msg.appOnLine+"）");
                    var pg = pagination(pageNo, msg.totalRows, 'userCountManager.initSource', 15);
                    $("#page").html(pg);
				}
			}
			
		});

	},search: function(){
        userCountManager.initSource(1,$.trim($("#currentOrganId").val()));
    }

};
