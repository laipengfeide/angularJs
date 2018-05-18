function goToHasFeedback(id) {
    $("#uploadImgDiv").removeClass("hidden");
    $("#upImgDiv").html("");
    //清空页面
    clearData();
    $.ajax({
        url: basePath +"feedback/feedbackDetail.do",
        type: "post",
        dataType: "json",
        data: {
            "eventId": id,
            random : Math.random()
        },
        success: function (req) {
            if(req.code==200){
                //var data = req.data;


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
            }
        }
    });

}
function assemblyData(data) {
    var sfcw = data.sfcw;
    //反馈时间
    $("#MVR_AddTime").html("反馈时间："+(data.createTime?data.createTime:""));
    $("#MVR_VehicleColor").html(data.vehicleColor?data.vehicleColor:"");
    $("#MVR_VehicleType").html(data.vehicleType?data.vehicleType:"");
    $("#MVR_PlateNumber").html(data.plateNumber?data.plateNumber:"");
    $("#MVR_PlateColor").html(data.plateColor?data.plateColor:"");
    $("#MVR_PlateType").html(data.plateType?data.plateType:"");
    if(sfcw=="true"){

        $("#bnfkyy").html(data.bnfkyy);
    }else{
        $("#MVR_Number").html(data.feedbackPolliceNumber?data.feedbackPolliceNumber:"");
        $("#MVR_Username").html(data.feedbackName?data.feedbackName:"");
        $("#MVR_UserIdCard").html(data.feedbackIdcard?data.feedbackIdcard:"");
        $("#MVR_UserOrgName").html(data.feedbackUnit?data.feedbackUnit:"");
        $("#MVR_DriverPhone").html(data.driverPhone?data.driverPhone:"");
        $("#MVR_DriverName").html(data.driverName?data.driverName:"");
        $("#MVR_DriverId").html(data.driverIdcard?data.driverIdcard:"");
        var problemCarType=data.problemCarType?data.problemCarType:"";
        if(problemCarType==1){
            $("#MVR_ProblemCarType").html("二手车");
            var driverConsistency=data.driverConsistency?data.driverConsistency:"";
            if(driverConsistency==1){
                $("#MVR_MonitPeopleRelation").html("一致");
            }else if(driverConsistency==2){
                $("#MVR_MonitPeopleRelation").html("不一致，借亲属、朋友车辆");
            }else if(driverConsistency==3){
                $("#MVR_MonitPeopleRelation").html("不一致，公务车辆");
            }else if(driverConsistency==4){
                $("#MVR_MonitPeopleRelation").html("不一致，车辆未过户");
            }else if(driverConsistency==5){
                $("#MVR_MonitPeopleRelation").html("不一致，其他");
            }
        }else if(problemCarType==2){
            $("#MVR_ProblemCarType").html("布控对象车辆");
            var monitPeopleRelation=data.monitPeopleRelation?data.monitPeopleRelation:"";
            if(monitPeopleRelation==1){
                $("#MVR_MonitPeopleRelation").html("本人");
            }else if(monitPeopleRelation==2){
                $("#MVR_MonitPeopleRelation").html("亲属或社会关系");
            }else if(monitPeopleRelation==3){
                $("#MVR_MonitPeopleRelation").html("无关");
            }
        }
        if (data.carNature==1) {
            $("#carNatureHasFB").html("私家车");
        }else if(data.carNature==2){
            $("#carNatureHasFB").html("运营车");
        }else{
            $("#carNatureHasFB").html("党政军企事业车辆");
        }
        $("#isBelongUnitHasFB").html(data.isBelongUnit?data.isBelongUnit:"");
        if((data.isNecessaryCheck?data.isNecessaryCheck:"")==1){
            $("#isNecessaryCheckHasFB").html("是");
        }else {
            $("#isNecessaryCheckHasFB").html("否");
            var noNEChRe=data.noNecessaryCheckReason?data.noNecessaryCheckReason:"";
            $("#noNecessaryCheckReasonHasFB").html(switchToNumberNoNeCheckReason(noNEChRe));
            if(noNEChRe==6){
                $("#otherNoNecessaryCheckReasonFB").html(data.otherNoNecessaryCheckReason?data.otherNoNecessaryCheckReason:"");
            }
        }
        //是否有违禁物品
        var isForbiddenobj =data.isForbiddenobj?data.isForbiddenobj:"";
        if(isForbiddenobj==1){
            $("#MVR_IsForbiddenObj").html("无");
        }else if(isForbiddenobj==2){
            $("#MVR_IsForbiddenObj").html("是");
            //图片
            var forbiddenobjImgUrl=data.forbiddenobjImgUrl?data.forbiddenobjImgUrl:"";
            if(forbiddenobjImgUrl!=""){
                var c = "";
                c+="<img onclick='alarmImgShowBigOnly(this)'src='"+basePath+imageServerContext.split('/')[0]+"/"+forbiddenobjImgUrl+"' id='contrabandPhoto' style='margin-left:325px; width:130px; height:110px' >";
                $("#imgList").html(c);
            }
        }
        //peopleListDiv添加
        var peers =data.peers?data.peers:""
        if(peers!=""){
            addPeopleListDiv(peers);
        }

    }


}
function clearData() {
    $("#MVR_AddTime").html("");
    $("#MVR_VehicleColor").html("");
    $("#MVR_VehicleType").html("");
    $("#MVR_PlateNumber").html("");
    $("#MVR_PlateColor").html("");
    $("#MVR_PlateType").html("");


    $("#MVR_Number").html("");
    $("#MVR_Username").html("");
    $("#MVR_UserIdCard").html("");
    $("#MVR_UserOrgName").html("");
    $("#MVR_DriverPhone").html("");
    $("#MVR_DriverName").html("");
    $("#MVR_DriverId").html("");

    $("#MVR_ProblemCarType").html("");
    $("#MVR_MonitPeopleRelation").html("");

    $("#carNatureHasFB").html("");
    $("#isBelongUnitHasFB").html("");
    $("#isNecessaryCheckHasFB").html("");
    $("#noNecessaryCheckReasonHasFB").html("");
    $("#otherNoNecessaryCheckReasonFB").html("");

    //是否有违禁物
    $("#MVR_IsForbiddenObj").html("");
    //图片
    $("#imgList").html("");

    $("#bnfkyy").html("");


    //peopleListDiv清空
    $("#peopleListDiv  tr:not(:first)").html("");



}
function addPeopleListDiv(peer) {
    $("#peopleListDiv tbody").html("<tr><th>手机号码</th><th>姓名</th><th>身份证号</th><th>认证是否一致</th> <th>户籍地址</th><th>手机是否可疑</th><th>可疑原因</th><th>其他描述</th></tr>");
    for (var i = 0; i < peer.length; i++) {
        var people = peer[i];
        var c = "";
        c += "<tr>";
        c += "<td>" + (people.phone?people.phone:"") + "</td>";
        c += "<td>" + (people.name?people.name:"") + "</td>";
        c += "<td>" + (people.idcard?people.idcard:"") + "</td>";
        if ((people.isConsistency?people.isConsistency:"") == 2) {
            c += "<td>不一致</td>";
        } else {

            c += "<td>一致</td>";
        }
        c += "<td>" + (people.homeAddress?people.homeAddress:"") + "</td>";

        if ((people.isSuspicious?people.isSuspicious:"")== 1) {
            c += "<td>不可疑</td>";
            c += "<td></td>";
            c += "<td></td>";
        } else {
            c += "<td>可疑</td>";
            c += "<td>" + (people.susdescription?people.susdescription:"") + "</td>";
            c += "<td>" + (people.susother?people.susother:"") + "</td>";
        }
        c += "</tr>";
        $("#peopleListDiv tbody").append(c);

    }

}

function switchToNumberNoNeCheckReason(data){
    var resutStr ;
    switch(data) {
        case '1':
            resutStr = "借用亲属车辆";
            break;
        case '2':
            resutStr = "借用社会关系车辆";
            break;
        case '3':
            resutStr = "正在办理过户车辆";
            break;
        case '4':
            resutStr = "租赁公司车辆";
            break;
        case '5':
            resutStr = "企事业单位车辆";
            break;
        case '6':
            resutStr = "其它";
            break;
        default:
            resutStr='';
    }
    return resutStr;

}
function switchToNumberBNFKYY(data){
    var resutStr ;
    switch(data) {
        case '1':
            resutStr = "车牌抓拍错误";
            break;
        case '2':
            resutStr = "未找到车辆";
            break;
        case '3':
            resutStr = "预警地点不详";
            break;
        case '4':
            resutStr = "其他";
            break;
        default:
            resutStr='';
    }
    return resutStr;

}