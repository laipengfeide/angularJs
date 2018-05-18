requirejs.config({
	baseUrl: 'js',
	map: {
		'*': {
			'css': 'libs/css.min',
			'less':'libs/less',
		}
	},
	//定义映射名（特别有版本号的都需要定义）
	paths: {
		'jquery':"libs/jquery-3.3.1.min",
		"angular":"libs/angular.min",
		"bootstrap": "libs/bootstrap.min",
		"gVerify":"common/gVerify",
		"base64":"common/base64",
		"bootstrapCss": "../css/bootstrap.min",
		"base": "../css/base",
		"login": "../css/login",
	},
	//依赖关系
	shim: {
		'bootstrap': ['jquery'],
		'angular':{deps:[],exports:'angular'},
		'gVerify':{
			deps:[],exports:'GVerify'
		},
		'base64':{
			deps:[],exports:'Base'
		}
	}
});
require(['css!bootstrapCss','less!base','less!login',], function() {});
//需要加载的JS名称
requirejs(['jquery','angular','gVerify','base64','bootstrap'],
	function($,angular,GVerify,Base) {
	angular.module("main",[]).controller("loginController",function($scope){
	        $scope.sysName = "hello world!";
	        
	        //登录及特效
			$scope.submitBtn = function(f){
				var res = verifyCode.validate(document.getElementById("code_input").value);
				if(res){
			    var e = $("#equative").get(0).checked;
			    var u = $("#username").val();
			    if (u.length > 0) {
			        var myReg1 = /^[^@\/\'\\\"#$%&\^\*]+$/;
			        if (!myReg1.test(u)) {
			        	verifyCode.refresh();
			            kendo.message("登录名不能包含非法字符！");
			            return;
			        }
			    }
			    var p = $("#password").val();
			
			    if(u != "" && p != ""){
			        if(f == 1){
			            $('#subBtn').attr('disabled',"true");
						$('#subBtn').html(".服务器连接中...");
						
						var s = requestOauthToken(u,p);
						if(s){
							window.location.href="home.html";
						}else{
							alert(s);
							$('#myModal').modal('show').find(".modal-body").text("用户名或密码错误！");
							return;
						}
			            //u,p加密
			            
			        }else{
			            $("#subBtn").removeAttr("disabled");
			            $('#subBtn').html("登录");
			            $("#pgbox").remove();
			        }
			    }else{
			    	verifyCode.refresh();
			        $("#subBtn").removeAttr("disabled");
			        $('#subBtn').html("登录");
			        kendo.message("用户名或密码不能为空！");
			        return;
			    }
				}else{
					 $("#subBtn").removeAttr("disabled");
			         $('#subBtn').html("登录");
					 kendo.message("验证码错误");
					 return;
				 }
			}
	        
	        $("#code_input").keydown(function(event) {
		        if (event.keyCode == 13) {
		        	$scope.submitBtn(1);
		        }
		    });
	        
	        $("#password").keydown(function(event) {
		        if (event.keyCode == 13) {
		            if($("#subBtn").prop("disabled")==false){
		                $("#subBtn").attr("disabled",true);
		                $scope.submitBtn(1);
		            }
		        }
		    });
	        
	        function requestOauthToken(username, password) {
	        	var success = false;

	        	$.ajax({
	        		url : '/uaa/oauth/token',
	        		datatype : 'json',
	        		type : 'post',
	        		headers : {
	        			'Authorization' : 'Basic YnJvd3Nlcjo='
	        		},
	        		async : false,
	        		data : {
	        			scope : 'ui',
	        			username : username,
	        			password : password,
	        			grant_type : 'password'
	        		},
	        		success : function(data) {
	        			localStorage.setItem('token', data.access_token);
	        			success = true;
	        		},
	        		error : function() {
	        			removeOauthTokenFromStorage();
	        		}
	        	});

	        	return success;
	        }
		    
	    });
		
  //logo文字超过处理
    var lhs = $(".loginForm>h1>span").width();
    if(lhs>400){
    	$(".loginForm>h1>span").css({"animation":"lgmoveleft 8s linear infinite"});
    }
    
    var rootPath = '/pcenter';
	var wjInternetUrl='http://25.30.9.169:8080/wj_cg/';
	var equative = 'false';
	var verifyCode;
	$(function(){
		//生成验证码
		verifyCode = new GVerify("verifycode");
		
	    document.getElementById("code_input").onblur = function(){
	        var res = verifyCode.validate(document.getElementById("code_input").value);
	        if(res){
	            $("#identifying").addClass("hidden");
	        }else{
	            $("#identifying").removeClass("hidden");
	        }
	    }
		if(equative=='false'){
			   $("#equative").removeAttr("checked");
			   $(".checkbox-wrap").hide();
		   }
		var p1 = document.getElementById("username").getAttribute("placeholder");
		$("#username").val(p1).focus(function(){
			if($(this).val()==p1){
				$(this).val("");
			}
		}).blur(function(){
			var v = $(this).val();
			if(v == ""){
				$(this).val(p1);
			}
		});
	
		
	});	
    
	function changePwd(){
	    var pv = $("#password").val();
	    if(pv!="" && pv != "请输入密码"){
	        $("#password2").hide();
	        $("#password").show();
	    }
	}
	var isCancel = true;
	/** 返回上一页*/
	function gotoLastPage(){
	    isCancel=true;
	    $("#feedback").css("display","none");
	    $("#subBtn").css("display","");
	}
	
	var pendingRequests = {};
	jQuery.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
	    var key = options.url;
	    console.log(key);
	    if (!pendingRequests[key]) {
	        pendingRequests[key] = jqXHR;
	    }else{
	        //jqXHR.abort();    //放弃后触发的提交
	        pendingRequests[key].abort();   // 放弃先触发的提交
	    }
	
	    var complete = options.complete;
	    options.complete = function(jqXHR, textStatus) {
	        pendingRequests[key] = null;
	        if (jQuery.isFunction(complete)) {
	            complete.apply(this, arguments);
	        }
	    };
	});
	    
	});