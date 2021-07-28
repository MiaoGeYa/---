//网页加载完毕会调用此函数
//全局变量
var MaxNumSquares = 1000;
var MaxNumVertices = MaxNumSquares*6;
var HalfSize = 5.0;
var count = 0;
var canvas;
var gl;    //WEBGL上下文

var drawRect = false;
var MaxHalfSize = 15;

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
	
	//设置视口
	gl.viewport(0,0,canvas.width,canvas.height);
	
	//设置背景色
	gl.clearColor(0.9,0.9,0.9,1.0);    //白色
	
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
		addSquare(event.clientX,event.clientY);		
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
		{ addSquare(event.clientX,event.clientY); }
	}
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
};

//绘制函数
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,count*6);  //使用顶点数组进行绘制
			   //LINE_LOOP（绘制图元类型 点			   
}

function addSquare(x,y)
{
	if(count>=MaxNumSquares)
	{
		alert("正方形数目已达到上限！");
		return;
	}
	var rect=canvas.getBoundingClientRect();
	
	x = x-rect.left;
	y = canvas.height-(y-rect.top);
	
	//六个顶点坐标
	var vertices=[ vec3(x-HalfSize,y+HalfSize,0),//0
				   vec3(x-HalfSize,y-HalfSize,0),//1
				   vec3(x+HalfSize,y-HalfSize,0),//2
				   vec3(x-HalfSize,y+HalfSize,0),//0
				   vec3(x+HalfSize,y-HalfSize,0),//2
				   vec3(x+HalfSize,y+HalfSize,0)];
	
	//六个顶点颜色
	var colors = [ vec3(Math.random(), Math.random(),Math.random()),
				   vec3(Math.random(), Math.random(),Math.random()),
				   vec3(Math.random(), Math.random(),Math.random()),
				   vec3(Math.random(), Math.random(),Math.random()),
				   vec3(Math.random(), Math.random(),Math.random()),
				   vec3(Math.random(), Math.random(),Math.random()) ];
				   
	//var randColor = vec3(Math.random(), Math.random(),Math.random());
	var data = [];
	for(var i=0; i<6; i++)
	{
		HalfSize = MaxHalfSize*Math.random();
		data.push(vertices[i]);
		data.push(colors[i]);
	}
	
	vertices.length=0;
	
	gl.bufferSubData(gl.ARRAY_BUFFER,
	count*6*2*3*Float32Array.BYTES_PER_ELEMENT,
	flatten(data));
	data.length=0;
	count++;
	
	requestAnimFrame(render);
}


