function ToUserDetail(userId){
			var organId = $("#organId").val();
			window.location.href="<%=path %>/admin/gotoUserEdit.action?userId="+userId+"&organId="+organId;
		}
		function addUser(){
			var organId = $("#organId").val();
			window.location.href="<%=path %>/admin/gotoUserAdd.action?organId="+organId;
		}		
		function queryUser(){
			var organId = $("#organId").val();
			var userName = $("#userName").val();
			var searchType = $("#searchType").val();
			$("#table1 tbody").remove();
       		$.ajax({
       			url:"<%=path %>/admin/getUserList.do",
       			type:"post",
       			dataType:"json",
       			data:{
       				organId:organId,
       				userName:userName,
       				searchType:searchType
       			},
       			success:function(msg){
       				if(msg.code==200){
       					if(msg.data != null){
       						$(msg.data).each(function(){
       							$("#table1").append("<tbody><tr>"
       							+"<td></td><td>"
       							+"<div class='auto w100b'>"
       						    +"<a href='javascript:void(0)' onclick='ToUserDetail("+this.userId+")' class='table-change fl'></a>"
       		                    +"<a href='javascript:void(0)' onclick='deleteUser("+this.userId+")' class='table-delete fr'></a>"
       		                    +"</div>"+"</td><td>"+this.loginName+"</td><td>"+this.userName+"</td><td>"+this.createTime
       		                    +"</td><td>"+this.updateTime+"</td><td>"+this.stateView+"</td></tr></tbody>");
               				});
       					}
       				}
       			}
       		});
			
		}
		function deleteUser(userId){
			var organId = $("#organId").val();
			$.ajax({
				url:"<%=basePath %>admin/userDelete.do",
				type:"get",
				dataType:"json",
				data:{
					userId:userId
				},
				success:function(msg){
					 if(msg.code==200){
						alert(msg.description);
						window.location.href="<%=basePath %>admin/gotoUserList.action?organId="+organId;
					}else{
						alert(msg.description);
					}
				}
			});
		}