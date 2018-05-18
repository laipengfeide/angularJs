
/**
 * 日期比较
 * @param interval
 * @param objDate
 * @returns
 */
Date.prototype.dateDiff = function(interval,objDate){
	var dtEnd = new Date(objDate);
	if(isNaN(dtEnd)) return undefined;
	switch (interval) {
	case "s":return parseInt((dtEnd - this) / 1000);
	case "n":return parseInt((dtEnd - this) / 60000);
	case "h":return parseInt((dtEnd - this) / 3600000);
	case "d":return parseInt((dtEnd - this) / 86400000);
	case "w":return parseInt((dtEnd - this) / (86400000 * 7));
	case "m":return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-this.getFullYear())*12) - (this.getMonth()+1);
	case "y":return dtEnd.getFullYear() - this.getFullYear();
	};
};
/**
 * 返回日期是否相差天数，忽略时，分，秒
 */
Date.prototype.dateDiffOfDay=function(endDate){
	var dtBegin=new Date(this.getFullYear(),this.getMonth(),this.getDate());
	var dtEnd=new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate());
	return dtBegin.dateDiff('d',dtEnd);
};

Date.prototype.add=function(interval,number){
	 switch(interval.toLowerCase()){  
     case "y": return new Date(this.setFullYear(this.getFullYear()+number));  
     case "m": return new Date(this.setMonth(this.getMonth()+number));  
     case "d": return new Date(this.setDate(this.getDate()+number));  
     case "w": return new Date(this.setDate(this.getDate()+7*number));  
     case "h": return new Date(this.setHours(this.getHours()+number));  
     case "n": return new Date(this.setMinutes(this.getMinutes()+number));  
     case "s": return new Date(this.setSeconds(this.getSeconds()+number));  
     case "l": return new Date(this.setMilliseconds(this.getMilliseconds()+number));  
	 } 
};


Date.prototype.toSimpleString = function () {
	var y=this.getFullYear();
	var m=this.getMonth()+1;
	var d=this.getDate();
	var hh=this.getHours();
	var mm=this.getMinutes();
    return y+ "-" +m+ "-" +d+" " +hh+":"+mm ;
};

Date.prototype.toYMD = function () { 
	var y=this.getFullYear();
	var m=this.getMonth()+1;
	var d=this.getDate();
	
    return ""+y+(m>10?m:"0"+m) +(d>10?d:"0"+d);
};

function dateAdd(interval,number,date){  
    switch(interval.toLowerCase()){  
        case "y": return new Date(date.setFullYear(date.getFullYear()+number));  
        case "m": return new Date(date.setMonth(date.getMonth()+number));  
        case "d": return new Date(date.setDate(date.getDate()+number));  
        case "w": return new Date(date.setDate(date.getDate()+7*number));  
        case "h": return new Date(date.setHours(date.getHours()+number));  
        case "n": return new Date(date.setMinutes(date.getMinutes()+number));  
        case "s": return new Date(date.setSeconds(date.getSeconds()+number));  
        case "l": return new Date(date.setMilliseconds(date.getMilliseconds()+number));  
    }  
};
