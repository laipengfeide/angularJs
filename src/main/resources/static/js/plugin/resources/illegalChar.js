var IllegalChar = function(){
	/**
	 * 特殊字符判断
	 * @param str 
	 * @param param
	 */
	this.illegalChar = function(str,param){
		var reg = "[`~!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]";
		if(param){
			reg = reg.replace(param,'');
		}
		var pattern=new RegExp(reg,'im');
		if(pattern.test(str)){ 
			return false; 
		} 
		return true; 
	}
	return this;
}();