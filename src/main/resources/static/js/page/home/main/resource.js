/***************************资源类型对应type说明:***************************************************/
/**
 * 关键性资源:   天网 :1,  车辆 :5,  人员:4,  部件:6,	责任网格:7,	万米单元网格:100,	社会点位:1.2
 *
 *			       便民服务点:200,	 	服务单位:201
 *
 * 地图资源: 	      天网:1.1,
 *
 * 临时资源: 	      部件-威县演示:6.5,
 *
 * layer图层:   车辆/人员:vectorMarkerLayer,
 */

/***************************toobar对象属性说明:***************************************************/
/**
 * obj = {
 *		id:"",//id 
 * 	  	name:"",//名称
 * 		isShowOnToobar:"",//是否显示在工具栏
 * 		isShowOnMap:"",//是否默认上图
 * 		shortName:""//英文简称
 * }
 */
config =
{
	"toobar":
	[{
        id:5.1,
        isShowOnToobar:"true",
        name:"机构",
        shortName:"orgSource",
        isShowOnMap:"true"
    },{
        id:1,
        isShowOnToobar:"true",
        name:"视频",
        shortName:"camera",
        isShowOnMap:"true"
    },{
        id:4,
        isShowOnToobar:"true",
        name:"人员",
        shortName:"police",
        isShowOnMap:"false"
    },{
        id:5,
        isShowOnToobar:"true",
        name:"车辆",
        shortName:"vehicle",
        isShowOnMap:"false"
    }, {
        id:10001,
        isShowOnToobar:"true",
        name:"治安资源",
        shortName:"resource",
        isShowOnMap:"false"
    }, {
        id:10002,
        isShowOnToobar:"true",
        name:"报警设备",
        shortName:"alarmDevice",
        isShowOnMap:"false"
    }, {
        id:10003,
        isShowOnToobar:"true",
        name:"网格防区",
        shortName:"defenceGrid",
        isShowOnMap:"false"
    },{
        id:100,
        isShowOnToobar:"true",
        name:"卫星地图",
        shortName:"miliLayer",
        isShowOnMap:"false"
    }]
};