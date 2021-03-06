$(function(){
	var d = document;
	var de = d.documentElement;
	
	setWindowSize();
	
	 UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
	 UE.Editor.prototype.getActionUrl = function(action) {
	     if(action=='uploadimage' || action=='uploadscrawl' || action=='uploadimage') {
	         return path + "/ueditor/uploadImgFile.json?requestType=image";
	     }else if (action=='uploadvideo') {
	    	 return path + '/ueditor/uploadImgFile.json?requestType=video';
	     }else if(action=="listimage"){
	    	 return path + '/ueditor/listimage.json';
	     }else if(action=="catchimage"){
	    	 return path + '/ueditor/catchImage.json?method=GET';
	     }else{
	         return this._bkGetActionUrl.call(this, action);
	     }
	 };
	 var ue = UE.getEditor('editor',{
		initialFrameWidth: '100%',
		initialFrameHeight: 800,
		isShow: true
	 }); 
	 
	 //如果编辑的新闻带有轮播图，则打开隐藏选项
	 if($("#isWheel").is(":checked")){
		$(".flg_wheel").css("visibility","visible");
	}else{
		$(".flg_wheel").css("visibility","hidden");
	}
	 
	 //如果新闻内容隐藏域不为空，说明这是编辑页面，将页回写
	 var newContent = $("#newContent").val();
	 if(newContent!=="" || newContent!==undefined){
		ue.addListener("ready", function () { 
			 // editor准备好之后才可以使用 
			 ue.setContent(newContent); 
		});
	 }
	 
	 /**
	  * 验证
	  */
	 $("#validate_form").validate({
	    onfocusout: function(element){
	        $(element).valid();
	    },
	    showErrors : function(errorMap, errorList) {  
	    	var msg = "";  
	    	$.each(errorList, function(i, v){  
	    		msg += (v.message + "\r\n");  
	    	});  
	    	if(msg != "")  
	    		alert(msg);  
	    }
//	    errorPlacement: function(error, element) {  
//		    //error.appendTo(element.parent());  
//	    	alert(JSON.stringify(element));
//		}
	 });
	 
	 $.extend($.validator.messages, {
		 required: "这是必填字段",
		 remote: "请修正此字段",
		 email: "请输入有效的电子邮件地址",
		 url: "请输入有效的网址",
		 date: "请输入有效的日期",
		 dateISO: "请输入有效的日期 (YYYY-MM-DD)",
		 number: "请输入有效的数字",
		 digits: "只能输入数字",
		 creditcard: "请输入有效的信用卡号码",
		 equalTo: "你的输入不相同",
		 extension: "请输入有效的后缀",
		 maxlength: $.validator.format("最多可以输入 {0} 个字符"),
		 minlength: $.validator.format("最少要输入 {0} 个字符"),
		 rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
		 range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
		 max: $.validator.format("请输入不大于 {0} 的数值"),
		 min: $.validator.format("请输入不小于 {0} 的数值")
	});
	 

	 
	$(window).resize(function(){
		setWindowSize();
	});
	
	/**
	 * 动态设置页面各部分的宽度及高
	 */
	function setWindowSize(){
		var clientHeight = de.clientHeight;
		$("#div_container").css("height",clientHeight);
	}
	
	/**
	 * 是否显示轮播标题及图片
	 */
	$("#isWheel").change(function(){
		if($(this).is(":checked")){
			$(".flg_wheel").css("visibility","visible");
		}else{
			$(".flg_wheel").css("visibility","hidden");
		}
	});
	
	/**
	 * 生成编辑图片对话框及imgAreaSelect对象
	 */
	var img_select = null;		//图片选择器对象
	$("#dialog").dialog({
		autoOpen: false,
		width: 1100,
		height: 700,
		show: {
			duration: 300		//显示对话框的动画时间
		},
		hide: {
			duration: 300		//关闭对话框的动画时间
		},
		open: function(event,ui){
			$("#dialog").css("visibility","visible");
			//在dialog打开的时候将图片选择器对象生成
			img_select = $("#my_img").imgAreaSelect({
				instance: true,			//实例化以后才需要
				aspectRatio: '16:9',	//设置区域的比例
				handles: true,			//设置区域的四角显示
				fadeSpeed: 200,			//动画效果时间
				onSelectChange: preview	//选择完成后回调函数
			});
		},
		beforeClose: function(event,ui){
			if(img_select!=null){
				img_select.cancelSelection();		//关闭对话框之前需要先将已经图片选择器的选择框清除
			}
		}
    });
	
	/**
	 * imgAreaSelect选择后的回调函数
	 */
	function preview(img,selection){
		if(!selection.width || !selection.height) return;
		//设置坐标及尺寸
		$("#sel_x1").val(selection.x1);
		$("#sel_width").val(selection.width);
		$("#sel_y1").val(selection.y1);
		$("#sel_height").val(selection.height);
		$("#sel_x2").val(selection.x2);
		$("#sel_y2").val(selection.y2);
		
		//需要进行截取的原图
	    var my_img_width = $("#my_img").width();
	    var my_img_height = $("#my_img").height();
	    
	    //承载缩略图的div大小
	    var preview_width = $("#preview").width();
	    var preview_height = $("#preview").height();
	    
		var scaleX = preview_width / selection.width;
	    var scaleY = preview_height / selection.height;
	    
	    $('#preview img').css({
	        width: Math.round(scaleX*my_img_width),
	        height: Math.round(scaleY*my_img_height),
	        marginLeft: -Math.round(scaleX * selection.x1),
	        marginTop: -Math.round(scaleY * selection.y1)
	    });
	}
	
	/**
	 * 添加列表缩略图
	 */
	var div_img_obj = null;
	$("#list_img1").bind("click",fn_img1);
	$("#list_img2").bind("click",fn_img2);
	$("#list_img3").bind("click",fn_img3);
	
	function fn_img1(){
		div_img_obj = $(this);
		$("#dialog").dialog("open");
	}
	
	function fn_img2(){
		var def_img = path + "/imgs/def_img.png";
		if($("#list_img1 .shrink_img").attr("src")==def_img){
			alert("请先设置第一张图片！");
			return;
		}
		div_img_obj = $(this);
		$("#dialog").dialog("open");
	}
	
	function fn_img3(){
		var def_img = path + "/imgs/def_img.png";
		if($("#list_img1 .shrink_img").attr("src")==def_img){
			alert("请先设置第一张图片！");
			return;
		}else if($("#list_img2 .shrink_img").attr("src")==def_img){
			alert("请先设置第二张图片！");
			return;
		}
		div_img_obj = $(this);
		$("#dialog").dialog("open");
	}
	
	/**
	 * 为所有图片添加删除功能
	 */
	$(".list_shrink_img_div").mouseover(function(){
		var width = $(this).width();
		var left = $(this).position().left;
		var top = $(this).position().top;
		var def_img = path + "/imgs/def_img.png";
		var shrink_img_src = $(this).find(".shrink_img").attr("src");

		if($(this).children(".img_del").length<=0 && def_img!==shrink_img_src){
			var img_del = $('<img class="img_del" style="left: '+(left+width-26)+'px;top: '+(top+2)+
					'px;width: 26px;height: auto;position: absolute;z-index: 1000;" src="'+path+'/imgs/shanchu.png">');
			$(this).append(img_del);	
			img_del.click(function(){
				//alert($(this).parent().attr("id"));
				$(this).parent().unbind("click");	//解除绑定的事件，以解决点击删除的同也会触发打开编辑图片的对话框的问题
				$(this).parent().find(".shrink_img").attr("src",path + "/imgs/def_img.png");
			});
		}
	});
	
	$(".list_shrink_img_div").mouseleave(function(){
		if($(this).children(".img_del").length>0){
			$(this).children(".img_del").remove();	
			//恢复绑定事件
			var shrink_img_div_id = $(this).attr("id");
			if(shrink_img_div_id=="list_img1"){
				$("#list_img1").bind("click",fn_img1);
			}else if(shrink_img_div_id=="list_img2"){
				$("#list_img2").bind("click",fn_img2);
			}else if(shrink_img_div_id=="list_img3"){
				$("#list_img3").bind("click",fn_img3);
			}
		}	
	});
	
	/**
	 * 显示为一张大图
	 */
	$("#check_show_big_img").change(function(){
		if($(this).is(":checked")){
			$("#list_img2 img").attr("src",path + "/imgs/def_img.png");
			$("#list_img3 img").attr("src",path + "/imgs/def_img.png");
			$("#list_img2").unbind();
			$("#list_img3").unbind();
		}else{
			$("#list_img2").bind("click",open_dialog);
			$("#list_img3").bind("click",open_dialog);
		}
	});
	
	/**
	 * 保存
	 */
	$("#save").click(function(){
		var params = {};
		params.newId = $("#newId").val();
		params.newCaption = $("#newCaption").val();
		params.newKeyWord = $("#newKeyWord").val();
		params.newType = $("#newType").val();
		params.newEditor = $("#newEditor").val();
		params.newSource = $("#newSource").val();
		params.newAthors = $("#newAthors").val();
		params.showIndex = $("#showIndex").val();
		params.isDel = $("#isDel").val();
		params.isPublish = $("#isPublish").val();
		params.newSubTitle = $("#newSubTitle").val();
		
		//取得资讯类型
		params.newType = $("#sel_news_type").val();
		if(ue){
			if($.utils.trim(params.newCaption).length<=0){
				alert("标题不能为空！");
				return;
			}else if($.utils.trim(ue.getContent()).length<=0){
				alert("新闻内容不能为空！");
				return;
			}else if($("#newSubTitle").val().length >=1000){
				alert("资讯概要长度不能大于1000！");
				return;
			}
			
			params.newContent = ue.getContent();
		}
		
		if($("#isWheel").is(":checked")){
			params.isWheel = 1;
			params.wheelTitle = $("#wheelTitle").val();
			var wheel_title_src = $("#list_img5").children("img").attr("src");
			if(wheel_title_src!=null && wheel_title_src!="" && wheel_title_src!==path + "/imgs/def_img.png"){
				params.wheelImg = wheel_title_src;	
			}
		}else{
			params.isWheel = 0;
			params.wheelTitle = "";
			params.wheelImg = "";
		}
		
		//是否显示为一张大图  
		if($("#check_show_big_img").is(":checked")){
			params.isShowBigImg = 1;
		}else{
			params.isShowBigImg = 0;
		}
		
		var list_img1_src = $("#list_img1").children("img").attr("src");
		if(list_img1_src!=null && list_img1_src!="" && list_img1_src!==path + "/imgs/def_img.png"){
			params.newListImg1 = list_img1_src;
		}
		var list_img2_src = $("#list_img2").children("img").attr("src");
		if(list_img2_src!=null && list_img2_src!="" && list_img2_src!==path + "/imgs/def_img.png"){
			params.newListImg2 = list_img2_src;
		}
		var list_img3_src = $("#list_img3").children("img").attr("src");
		if(list_img3_src!=null && list_img3_src!="" && list_img3_src!==path + "/imgs/def_img.png"){
			params.newListImg3 = list_img3_src;
		}
		
		var url = path + "/news/saveNews.json";
		$.utils.sendData(url,JSON.stringify(params),function(data){
			if(data.error=='0'){
				alert("新闻保存成功！");
				$('#ifm', window.parent.document).attr("src",path + "/page/news/news_main.jsp");
			}else{
				alert("新闻保存失败！");
			}
		});
	});
	
	/**
	 * 返回列表
	 */
	$("#btn_back_list").click(function(){
		$('#ifm', window.parent.document).attr("src",path + "/page/news/news_main.jsp");
	});
	
	/**
	 * 文件上传组件change事件方法
	 */
	function file_change(file_obj){
		var $file = $(file_obj);
		var fileObj = $file[0];
		var windowURL = window.URL || window.webkitURL;
		var dataURL;
		var $img = $("#my_img");
		var shrink_img = $("#shrink_img");
		 
		if(fileObj && fileObj.files && fileObj.files[0]){
			dataURL = windowURL.createObjectURL(fileObj.files[0]);
			$img.attr('src',dataURL);
			shrink_img.attr('src',dataURL);
		}else{
			dataURL = $file.val();
			var imgObj = document.getElementById("my_img");
			var shrink_imgObj = document.getElementById("shrink_img");
			// 两个坑:
			// 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
			// 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
			imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
		 
			shrink_imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			shrink_imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
		}
	}
	
	/**
	 * 为文件上传组件绑定change事件
	 */
	$("#file_img").change(function(){
		file_change(this);
	});
	
	/**
	 * 保存并上传文件
	 * 	将原稿文件及选中的位置信息一并上传，上传后处理）
	 */
	$("#btn_fileupload").click(function(){
		var $file = $("#file_img");
		var fileObj = $file[0];
		if(fileObj && fileObj.files && fileObj.files[0]){
			ajaxFileUpload();
		}else{
			alert("未选择文件不能上传！");
		}
		
	});
	
    function ajaxFileUpload() {
    	var params = {};
    	params.x1 = $("#sel_x1").val();
    	params.y1 = $("#sel_y1").val();
    	params.x2 = $("#sel_x2").val();
    	params.y2 = $("#sel_y2").val();
    	
    	params.width = $("#sel_width").val();
    	params.height = $("#sel_height").val();
    	
    	params.imgWidth = $("#my_img").width();
    	params.imgHeight = $("#my_img").height();
    	
    	$.ajaxFileUpload({
    		url: path + '/news/uploadFile.json', //用于文件上传的服务器端请求地址
    		secureuri: false, //是否需要安全协议，一般设置为false
    		fileElementId: 'file_img', //文件上传域的ID
    		dataType: 'json', //返回值类型 一般设置为json
    		data: params,
    		success: function(data, status){  
	    		
	    		//在上传成功后，file组件会自动解邦change事件，此时需要重新绑定一次即可
	    		$("#file_img").change(function(){
	    			file_change(this);
	    		});  
	    		
	    		//清除编辑图片及缩略图
	    		$("#my_img").attr("src",path + "/imgs/def_img.png");
	    		$("#shrink_img").attr("src",path + "/imgs/def_img.png");
	    		
	    		//取消选择框
	    		if(img_select){
	    			img_select.cancelSelection();
	    		}
	    		
	    		//将上传的图片返回给列表缩略图
	    		if(status=="success"){
	    			if(data.error>0){
	    				//alert(data.msg);
	    			}else{
	    				if(div_img_obj){
	    					div_img_obj.children("img").attr("src",data.img_src);
	    	    		}
	    				$("#dialog").dialog("close");
	    			}
	    		}else{
	    			alert("无法请求的服务！");
	    		}
    		},
    		error: function (data, status, e){	//服务器响应失败处理函数
    			//alert("tdj:" + e);
    		}
    	});
    }
	
});