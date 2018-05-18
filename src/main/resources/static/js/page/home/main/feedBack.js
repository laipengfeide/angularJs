$(function(){
    $('#isSuspicious').change(function(){
        var p=$(this).children('option:selected').val();//这就是selected的值
        console.log(p)
        if(p==1){
            $(".ryxx-detail").hide();
        }else if(p==2){
            $(".ryxx-detail").show();
        }
    })

});

/**
 * 跳转反馈页面
 */
function goToFeedback(id) {

    $("#MVR_FBTime").text("反馈时间: "+new Date().Format("yyyy-MM-dd hh:mm:ss"));
    $("#eventIdInp").val("");
    $("#eventIdInp").val(id);
    $("#feedBackForm")[0].reset();
    $("#bnfkyyy").val("");
    $(".peerTrs").remove();
    $("#uploadImgDiv").removeClass("hidden");
    $("#upImgDiv").html("");
    $("#SaveImgSrcValue").val("");
    i=0;
    $("#yuanyinForm").hide();
    $("#otherYuanyinForm").hide();
    $("#wtcl-gx").hide();
    $("#wtcl-bk").hide();
    $("#wjp-file").hide();
    var alarmOrgan = $.trim($("#alarmOrgan").val());
    $.ajax({
        url: basePath + "feedback/feedbackDetail.do",
        type: "post",
        dataType: "json",
        data: {
            "eventId": id,
            "alarmOrgan":alarmOrgan,
            random: Math.random()
        },
        success: function (req) {

            var data = req.data;
            if (req.code == 200) {
                if (data.id) {
                    //弹窗
                    $("#hasFeedbackDiv").kendoWindow({
                        width: "1000px",
                        height: "700px",
                        title: "车辆核查反馈详情",
                        iframe: false,
                        modal: true,
                        position: {top: "10%"},
                        closeCallback: onClose,
                        okCallback: onClose
                    });
                    $("#hasFeedbackDiv").data("kendoWindow").center().open();
                    $("#peopleListDiv  tr:not(:first)").html("");
                    //组装数据
                    assemblyData(req.data);
                } else {
                    $("#feedBackDiv").kendoWindow({
                        width: "1000px",
                        height: "700px",
                        title: "反馈",
                        iframe: false,
                        modal: true,
                        position: {top: "10%"},
                        closeCallback: onClose,
                        okCallback: onClose,
                        close: function () {
                            $("#feedbackDialogTemp").val("");
                            // if (historyManager) {
                            //     historyManager.initData(historyManager.pageNo);
                            // }

                        }

                    });

                    $("#alarmOrganHidden").val(data.alarmOrgan);
                    $("#feedBackDiv").data("kendoWindow").center().open();
                    $("#eventIdInp").val("");
                    $("#eventIdInp").val(id);
                    $("#feedBackForm")[0].reset();
                    $("#bnfkyyy").val("");
                    $("#feedBackForm")[0].reset();
                    bulidVehicleInformation(data);
                }
                //
                // if (req.code == 200) {
                //     var data=req.data;
                //
                //     $("#feedBackDiv").kendoWindow({
                //         width: "1000px",
                //         height: "700px",
                //         title: "反馈",
                //         iframe: false,
                //         resizable: false,
                //         modal: true,
                //         position: {top: "10%"},
                //         closeCallback: onClose,
                //         okCallback: onClose,
                //         close: function () {
                //             historyManager.initData(1);
                //         }
                //
                //     });
                //
                //     $("#alarmOrganHidden").val(data.alarmOrgan);
                //     $("#feedBackDiv").data("kendoWindow").center().open();
                //     $("#eventIdInp").val("");
                //     $("#eventIdInp").val(id);
                //     $("#feedBackForm")[0].reset();
                //     //$("#peopleTable  tr:not(:first)").html("");
                //     //$("#peopleTable tr:not(:first)").empty();
                //     $("#bnfkyyy").val("");
                //     $("#feedBackForm")[0].reset();
                //     bulidVehicleInformation(data);
                // }
            }
        }
    });


}

    //添加反馈信息
    function queren(formid) {
        var id = $("#eventIdInp").val();
        //验证
        if(verificationQueren()){
            return;
        }
        // 同行人数组
        var peersArray = [];
        peersArray.push(getFormData('matchVehiclePeerForm'));
        var obj = getFormJson(formid);
        obj.jsonString = getTableInfo('peopleTable');
        obj.forbiddenobjImgUrl=$("#SaveImgSrcValue").val().split("|")[2];
        $.ajax({
            url: basePath + "feedback/feedbackAdd.do",
            type: "post",
            dataType: "json",
            data: obj,
            success: function (req) {
                if(req.code==200){
                    //关闭窗口刷新
                    feedBackDivWinClose();
                    $("#fb"+id).html("已反馈");
                    $("#fb"+id).attr("onclick", "goToHasFeedback("+id+")");
                    //AlarmDeviceManager.handleAlarm($("#falarmRelationId").val(),$("#falarmType").val(),$("#eventIdInp").val());

                }else{
                    kendo.message(req.description);
                }
            }
        })
    }

    function onClose() {
        console.log("关闭")
    }

    function feedBackDivWinClose() {
        $("#feedBackDiv").data("kendoWindow").close();
    }

    function errorFeedBackDivWinClose() {
        $("#errorFeedBackDiv").data("kendoWindow").close();
    }

    function fellowPeopleDivWinClose() {
        $("#fellowPeopleDiv").data("kendoWindow").close();
    }

    function goToErrorFeedBackDiv() {
        $("#feedBackForm")[0].reset();
        //清空反馈错误页面
        $("#bnfkyyy").val("");
        //$("#fabnfkqtyy").val("");
        //$("#fabnfkqtyy").hide();
        $("#errorFeedBackDiv").kendoWindow({
            width: "600px",
            height: "300px",
            title: "错误数据反馈",
            iframe: false,
            modal: true,
            position: {top: "10%"},
            closeCallback: onClose,
            okCallback: onClose
        });
        $("#errorFeedBackDiv").data("kendoWindow").center().open();
    }

    function showBnfkqtyy() {
    	$('#bnfkqtyyDiv').show();
    }
    function hideBnfkqtyy() {
    	$('#bnfkqtyyDiv').hide();
    }
    function inlineRadioOptions1() {
        var val = $('input:radio[name="problemCarType"]:checked').val();
        if (val == 1) {
            $("#wtcl-bk").hide();
            $("#wtcl-gx").show();
        } else if (val == 2) {
            $("#wtcl-gx").hide();
            $("#wtcl-bk").show();
        }

    }

    function hasOrNoContraband() {
        var e = $('input:radio[name="isForbiddenobj"]:checked').val();
        console.log(e);
        if (e == 1) {
            $("#wjp-file").hide();

        } else if (e == 2) {

            $("#wjp-file").show();
            $("#uploadImgDiv").css("margin-top","0px");
        }
    }

    function openFellowPeopleDiv() {
        //清空参数
        $("#matchVehiclePeerForm")[0].reset();
        $(".ryxx-detail").hide();
        if (!$("#fellowPeopleDiv").data("kendoWindow")) {
            $("#fellowPeopleDiv").kendoWindow({
                width: "600px",
                height: "500px",
                title: "添加同行人信息",
                iframe: false,
                modal: true,
                position: {top: "10%"},
                closeCallback: onClose,
                okCallback: onClose
            });
        }
        $("#fellowPeopleDiv").data("kendoWindow").center().open();
    }

    /*添加到table表单*/
    function addToTale() {

        var trList = $("#peopleTable").find("tbody").find("tr");
        if(trList.length >= 11){
            kendo.message("最多只能添加 10 人！");
            return;
        }
        //手机号
        var phone = $("#phone").val();
        // 是否可疑
        var isSuspicious = $("#isSuspicious").val();
        var susdescription = '';
        var susother ='';
        if (isSuspicious == 2) {
            susdescription = $('input:radio[name="susdescription"]:checked').val();
            //其他可疑描述
            susother = $("#susother").val();
        }else{
            susother = "";
        }
        // 同行人姓名
        var name = $("#peopleName").val();
        //身份证号
        var idcard = $("#idcard").val();
        //是否一致
        var isConsistency = $('input:radio[name="isConsistency"]:checked').val();
        // 户籍地址
        var homeAddress = $("#homeAddress").val();

        var c = "";
        c += "<tr  class='peerTrs'>";
        c += "<td>" + phone + "</td>";
        c += "<td>" + name + "</td>";
        c += "<td>" + idcard + "</td>";
        if (isConsistency == 2) {
            c += "<td>不一致</td>";
        } else {

            c += "<td>一致</td>";
        }
        c += "<td>" + homeAddress + "</td>";

        if (isSuspicious == 2) {
            c += "<td>可疑</td>";
            c += "<td>"+switchToString(susdescription)+"</td>";
            c += "<td>" + susother + "</td>";
        } else {
            c += "<td>不可疑</td>";
            c += "<td></td>";
            c += "<td></td>";
        }

        c += "<td><span onclick='deleteTr(this)'>删除</span></td>";
        c += "</tr>";
        $("#peopleTable tbody").append(c);
        //关闭
        fellowPeopleDivWinClose();
    }

    function deleteTr(e) {
        //删除tr
        $(e).parent().parent().remove();
    }

//同行人员数据
    var peerArray = [];

    function queren1() {
        var peer = {};
        peer = getFormData('matchVehiclePeerForm');
        console.log(JSON.stringify(peer));
    }

    function getFormJson(frm) {  //frm：form表单的id
        var o = {};
        var a = $("#" + frm).serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

//获取表单数据
    function getFormData(formId) {
        var inputArr = $('#' + formId + ' input'); //input 数组
        var data = {};
        var selectArr = $('#' + formId + ' select'); //select 数组
        var textareaArray = $('#' + formId + ' textarea'); //textarea 数组
        getObjectData(data, inputArr);
        getObjectData(data, selectArr);
        getObjectData(data, textareaArray);
        return data;
    }

//数组数据转为对象数据
    function getObjectData(_obj, _arr) {
        $.each(_arr, function (k, v) {
            var propertyName = $(v).attr('name'), propertyValue = $(v).val();
            _obj[propertyName] = propertyValue;
        });
        return _obj;
    }

    /*组装车辆信息*/
    function bulidVehicleInformation(data) {
        var vehicleColor = data.vehicleColor?data.vehicleColor:"";
        var vehicleType = data.vehicleType?data.vehicleType:"";
        var plateNumber = data.plateNumber?data.plateNumber:"";
        var plateColor = data.plateColor?data.plateColor:"";
        var plateType = data.plateType?data.plateType:"";
        $("#vehicleColorFB").html("");
        $("#vehicleTypeFB").html("");
        $("#plateNumberFB").html("");
        $("#plateColorFB").html("");
        $("#plateTypeFB").html("");

        $("#vehicleColorFB").html(vehicleColor);
        $("#vehicleTypeFB").html(vehicleType);
        $("#plateNumberFB").html(plateNumber);
        $("#plateColorFB").html(plateColor);
        $("#plateTypeFB").html(plateType);
        $("#feedbackUnit").val(data.organName);
    }

    function handErrorFeedBack() {
        var id = $("#eventIdInp").val();
        //var bnfkyy=$('input:radio[name="bnfkyy"]:checked').val();
        var bnfkyy=$('#bnfkyyy').val();
        //var bnfkqtyy = $("#bnfkyyy").val();
        $.ajax({
            url: basePath + "feedback/feedbackAdd.do",
            type: "post",
            dataType: "json",
            data: {
                "eventId": id,
                "bnfkyy": bnfkyy,
                "alarmOrganHidden":$("#alarmOrganHidden").val(),
                random: Math.random()
            },
            success: function (req) {
                if (req.code == 200) {
                    //关闭窗口并刷新页面
                    errorFeedBackDivWinClose();
                    feedBackDivWinClose();
                    $("#fb"+id).html("已反馈");
                    $("#fb"+id).attr("onclick", "goToHasFeedback("+id+")");
                    //AlarmDeviceManager.handleAlarm($("#falarmRelationId").val(),$("#falarmType").val(),$("#eventIdInp").val());
                }else{
                    kendo.message(req.description);
                }
            }
        })
    }
function verificationQueren() {
	 var reg = /(^\d{16}$)|(^\d{15}(\d|X|x)$)|(^\d{17}$)|(^\d{16}(\d|X|x)$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
	    var pattern = /\D/ig;
	    var jh = $("#jh").val();
	    if(jh==""){
	        kendo.message("反馈人员警号不能为空");
	        return true;
	    }
	    var driverIdcard= $("#driverIdcard").val();
	    if(driverIdcard==""){
	        kendo.message("驾驶员身份证不能为空");
	        return true;
	    }
	    var feedbackName= $("#feedbackName").val();
	    if(feedbackName==""){
	        kendo.message("反馈人员名称不能为空");
	        return true;
	    }
	    var driverPhone= $.trim($("#driverPhone").val());
	    if(driverPhone==""){
	        kendo.message("驾驶员手机号码不能为空");
	        return true;
	    }
	    if(driverPhone.length != 11){ 
	        kendo.message("驾驶员手机号码格式错误，只能是11位的数字！");
	        return true;  
	    }
	    if(pattern.test(driverPhone)){
	        kendo.message("驾驶员手机号码格式错误，只能为数字！");
	        return true;  
	    }
	    var phone= $.trim($("#phone").val());
	    if(phone.length != 11 && phone !=""){ 
	        kendo.message("同行人手机号码格式错误，只能是11位的数字！");
	        return true;  
	    }
	    if(pattern.test(phone) && phone !=""){
	        kendo.message("同行人手机号码格式错误，只能为数字！");
	        return true;  
	    }
	    var driverName= $("#driverName").val();
	    if(driverName==""){
	        kendo.message("驾驶员姓名不能为空");
	        return true;
	    }
	    var driverIdcard= $.trim($("#driverIdcard").val());
	    if(driverIdcard==""){
	        kendo.message("驾驶员身份证不能为空");
	        return true;
	    }
	    if(reg.test(driverIdcard) === false){
	         kendo.message("驾驶员身份证不合法");
	        return true;
	    } 
	    var feedbackIdcard= $.trim($("#feedbackIdcard").val());
	    if(reg.test(feedbackIdcard) === false && feedbackIdcard !=""){
	         kendo.message("反馈人身份证不合法");
	        return true;
	    } 
	    /*var idcard= $.trim($("#idcard").val());
	    if(reg.test(feedbackIdcard) === false && idcard != ""){
	         kendo.message("同行人身份证不合法");
	        return true;
	    } */

    var isNC = $('input:radio[name="isNecessaryCheck"]:checked').val();
    if(isNC==2){
        var noNCR = $('input:radio[name="noNecessaryCheckReason"]:checked').val();
        if(noNCR==""){
            kendo.message("不再次核查的原因不能为空");
            return true;
        }
        if(noNCR==6){
            var otherNoNCR = $('input:radio[name="otherNoNecessaryCheckReason"]:checked').val();
            if(otherNoNCR==""){
                kendo.message("不再次核查的其它原因不能为空");
                return true;
            }
        }


    }
}

// 遍历同行人员table 数据
function  getTableInfo(tableId) {
    var tarray = [];


    var trList = $("#"+tableId).find("tbody").find("tr");
    for (var i=1;i<trList.length;i++) {
        var obj ={};
        var tdArr = trList.eq(i).find("td");
        var phone = tdArr.eq(0).text();   // 电话
        var name = tdArr.eq(1).text();       // 同行人姓名
        var idcard = tdArr.eq(2).text();   //身份证号

        var isConsistency = tdArr.eq(3).text()=='一致'?1:2;   //人证是否一致

        var homeAddress = tdArr.eq(4).text();   //户籍地址

        var isSuspicious = tdArr.eq(5).text()=='可疑'?2:1;   //手机是否可疑

        var des = tdArr.eq(6).text();   //原因

        var susdescription=switchToNumber(des);

        var susother = tdArr.eq(7).text();   //其它描述

        obj.phone = phone;
        obj.name = name;
        obj.idcard = idcard;
        obj.isConsistency = isConsistency;
        obj.isSuspicious = isSuspicious;
        obj.susdescription = susdescription;
        obj.susother = susother;
        obj.homeAddress=homeAddress;
        tarray.push(obj);

    }
    return JSON.stringify(tarray);


}

function switchToNumber(susdescription){
    var resutStr ;
    switch(susdescription) {
        case "使用VPN软件":
            resutStr = 1;
            break;
        case "使用小众软件":
            resutStr = 2;
            break;
        case "可疑URL":
            resutStr = 3;
            break;
        case "其他":
            resutStr = 4;
            break;
        default:
            resutStr='';
    }
    return resutStr;

}
function switchToString(susdescription){
    var resutStr ;
    switch(susdescription) {
        case '1':
            resutStr = "使用VPN软件";
            break;
        case '2':
            resutStr = "使用小众软件";
            break;
        case '3':
            resutStr = "可疑URL";
            break;
        case '4':
            resutStr = "其他";
            break;
        default:
            resutStr='';
    }
    return resutStr;

}




// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
