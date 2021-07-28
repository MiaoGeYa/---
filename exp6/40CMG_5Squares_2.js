//网页加载完毕会调用此函数
//全局变量
var MaxNumSquares = 100000;
var MaxNumVertices = MaxNumSquares*6;
var HalfSize = 10.0;
var count = 0;
var canvas;
var gl;    //WEBGL上下文

var drawRect = false;
var MaxHalfSize = 30;

var model = 0;  //0是五角星 1是爱心
var numchoic = 0; //0单个 1连续
var colorNum = 0;  //颜色选择

window.onload = function main()
{
	//获取页面中id为webgl的canvas元素
	canvas = document.getElementById("webgl");
	if(!canvas)
	{
		//获取失败的话显示下面语句
		alert("获取canvas失败！");
		return ;
	}
	
	//获取webgl上下文
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl)
	{
		//获取失败显示下面语句
		alert("获取webgl上下文失败！");
		return;
	}
	
	//画笔大小控制
	var huaBiSizeSlide = document.getElementById("HuaBiSizeSlide");//获取html文件中按钮的id
	if(!huaBiSizeSlide)
	{
		alert("获取按钮元素HuaBiSizeSlide失败！");
	}
	huaBiSizeSlide.onchange = function(){MaxHalfSize = event.srcElement.value;};  
	
	//
	var modelMenu = document.getElementById("ModelMenu");
	if(!modelMenu)
	{
		alert("获取按钮元素modelMenu失败");
	}
	modelMenu.onclick = function()
	{
		switch(event.target.index)
		{
			case 0:   //五角星
				model = 0;
				break;
				
			case 1:  //爱心
				model = 1;
				break;
		}
	}
	
	var numMenu = document.getElementById("NumMenu");
	if(!numMenu)
	{
		alert("获取按钮元素NumMenu失败");
	}
	numMenu.onclick = function()
	{
		switch(event.target.index)
		{
			case 0:   //单个
				numchoic = 0;
				break;
				
			case 1:  //连续
				numchoic = 1;
				break;
		}
	}
	
	//颜色
	var colorchoice = document.getElementById("colorchoice");
	if(!colorchoice)
	{
		alert("获取按钮元素colorchoice失败");
	}
	colorchoice.onclick = function()
	{
		switch(event.target.index)
		{
			case 0:   //随机
				colorNum = 0;
				break;
				
			case 1:  //白色
				colorNum = 1;
				break;
				
			case 2:  //橘粉
				colorNum = 2;
				break;
		}
	}
	
	//设置视口
	gl.viewport(0,0,canvas.width,canvas.height);
	
	//设置背景色
	gl.clearColor(0.0,0.0,0.0,1.0);    //白色
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	var dataBufferId = gl.createBuffer(); 
	//将id为verticesBufferId的buffer绑定为当前的arry buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, dataBufferId);
	//为当前的arry buffer 提供数据 传输到gpu
	gl.bufferData(gl.ARRAY_BUFFER,Float32Array.BYTES_PER_ELEMENT*6*MaxNumVertices,gl.STATIC_DRAW);
	
	//获取变量位置
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0)   //判断位置是否小于零
	{
		alert("获取attribute变量a_Position失败！");
		return;
	}
	
	//提供数据的具体方式
	gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT*6,0);
	//启用顶点属性数组 
	gl.enableVertexAttribArray(a_Position);
	
	//颜色
	var a_Color = gl.getAttribLocation(program,"a_Color");
	if(a_Color < 0)
	{
		alert("获取attribute变量a_Color失败！");
		return;
	}
	
	gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,
						   Float32Array.BYTES_PER_ELEMENT*6,
						   Float32Array.BYTES_PER_ELEMENT*3);
	gl.enableVertexAttribArray(a_Color);
	
	var u_matMVP=gl.getUniformLocation(program,"u_matMVP");
	if(!u_matMVP)
	{
		alert("获取uniform变脸u_matMVP失败!");
	}
	
	var matProj=ortho2D(0,canvas.width,0,canvas.height);
	gl.uniformMatrix4fv(u_matMVP,false,flatten(matProj));
	
	//鼠标监听
	canvas.onclick=function()
	{
		addStart(event.clientX,event.clientY,model);	
		i+=3;;
	}
	
	//鼠标左键按下
	canvas.onmousedown = function()
	{
		if(event.button == 0)
		{ drawRect = true; }
	}
	
	//鼠标左键弹起
	canvas.onmouseup = function()
	{
		if(event.button == 0)
		{ drawRect = false; }
	}
	
	//鼠标移动
	canvas.onmousemove = function()
	{
		if(drawRect)
		{ addStart(event.clientX,event.clientY,model); }
	}
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
};


//绘制函数
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	if(numchoic == 0)
	{
		gl.drawArrays(gl.TRIANGLES,0,count*3);  
	}
	else
	{
		gl.drawArrays(gl.LINE_STRIP,0,count*3);
	}
	//gl.drawArrays(gl.LINE_LOOP,0,count*3);  //使用顶点数组进行绘制
			   //LINE_LOOP（绘制图元类型 点		
				//TRIANGLES
}

function addStart(x,y,model)
{
	if(count>=MaxNumSquares)
	{
		alert("绘制的图形数目已达到上限！");
		return;
	}
	var rect=canvas.getBoundingClientRect();
	
	x = x-rect.left;
	y = canvas.height-(y-rect.top);
	
	var HalfSize=MaxHalfSize*Math.random();
	
	var R=HalfSize;
	var r=HalfSize/2;
	var vertices=[];  //六个顶点坐标
	
	var randColor = [ vec3(Math.random(), Math.random(),Math.random()), //随机颜色
					  vec3(1.0,1.0,1.0),   //白色
					  vec3(1.0,0.85,0.72)];  //橘粉
	var data=[];

	
	//画五角星
	if(model == 0)
	{
		for (var i = 0; i < 5; i++) 
		{         
			vertices.push(vec3(Math.cos((18+i*72)/180*Math.PI)*R+x,              
			-Math.sin((18+i*72)/180*Math.PI)*R+y,0));
			
			vertices.push(vec3(Math.cos((54+i*72)/180*Math.PI)*r+x,
			-Math.sin((54+i*72)/180*Math.PI)*r+y,0));   
		 }

		for(var j=0;j<10;j++)
		{
			if(j<9)
			{
				data.push(vec3(x,y,0));
				data.push(randColor[colorNum]);
				data.push(vertices[j]);
				data.push(randColor[colorNum]);
				data.push(vertices[j+1]);
				data.push(randColor[colorNum]);
			}
		
			if(j==9)
			{
				data.push(vec3(x,y,0));
				data.push(randColor[colorNum]);
				data.push(vertices[j]);
				data.push(randColor[colorNum]);
				data.push(vertices[0]);
				data.push(randColor[colorNum]);
			}
		}
			
		vertices.length=0;
		gl.bufferSubData(gl.ARRAY_BUFFER,
		count*3*2*3*Float32Array.BYTES_PER_ELEMENT,
		flatten(data));
		data.length=0;
		count+=10;
	}
	
	else
	{
		for(var i = 0; i <= 300; i += 1)
		{
			var m = i;
			var n = R * (((Math.sin(i) * Math.sqrt(Math.abs(Math.cos(i)))) / (Math.sin(i) + 1.4)) - 2 * Math.sin(i) + 2);
			vertices.push(vec3(n * Math.cos(m) + x,n * Math.sin(m) +y,0));
		}
		
		for(var j=0;j<301;j++)
		{
			if(j<300)
			{
				data.push(vec3(x,y,0));
				data.push(randColor[colorNum]);
				data.push(vertices[j]);
				data.push(randColor[colorNum]);
				data.push(vertices[j+1]);
				data.push(randColor[colorNum]);
			}
		
			if(j==300)
			{
				data.push(vec3(x,y,0));
				data.push(randColor[colorNum]);
				data.push(vertices[j]);
				data.push(randColor[colorNum]);
				data.push(vertices[0]);
				data.push(randColor[colorNum]);
			}
		}
		
		vertices.length=0;

		gl.bufferSubData(gl.ARRAY_BUFFER,
		count*3*2*3*Float32Array.BYTES_PER_ELEMENT,
		flatten(data));
		data.length=0;

		count=count+301;
	}
	//六个顶点颜色
	
	requestAnimFrame(render);
}


