//网页加载完毕会调用此函数
//全局变量
var gl;    //WEBGL上下文
var angle = 0.0;   //旋转角度
var delta = 30.0;    //每秒增加的角度
var size = 25;   
var u_Angle;

var last = Date.now();
var resize = size

var verticesNum = 20;  //数组的长度
var k = 1;   //缩放绘制次数
var j = 0;
var r = 1.5;  //缩放的大小
var pos = 2; 

//指定顶点
var vertices=[];
	

window.onload = function main()
{
	//获取页面中id为webgl的canvas元素
	var canvas = document.getElementById("webgl");
	if(!canvas)
	{
		获取失败的话显示下面语句
		alert("获取canvas失败！");
		//return ;
	}
	
	//根据浏览器大小调整canv的大小，并调整视口大小，保证绘制不会变形
	window.onresize = function()
	{
		var rect = canvas.getBoundingClientRect();
		canvas.width = innerWidth - 2*rect.left;
		canvas.height = innerHeight -80;
		if(canvas.width > canvas.height)
		{
			gl.viewport((canvas.width - canvas.height)/2,
					     0,canvas.height,canvas.height);
		}
		else
		{
			gl.viewport(0,(canvas.height - canvas.width)/2,
						canvas.width,canvas.width);
		}
	}
	
	//获取webgl上下文
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl)
	{
		//获取失败显示下面语句
		alert("获取webgl上下文失败！");
		return;
	}

	//加速按钮响应
	var incButton = document.getElementById("IncSpeed");//获取html文件中按钮的id
	if(!incButton)
	{
		alert("获取按钮元素IncSpeed失败！");
	}
	incButton.onclick = function(){delta *= 2;};    //点击响应
	//incButton.addEventListener("click",function(){delta *= 2;});  第二种方法
	
	//减速按钮响应
	var outcButton = document.getElementById("OutcSpeed");//获取html文件中按钮的id
	if(!outcButton)
	{
		alert("获取按钮元素OutcSpeed失败！");
	}
	outcButton.onclick = function(){delta /= 2;};    //点击响应
	
	//反向旋转按钮响应
	var unAngleButton = document.getElementById("unAngle");//获取html文件中按钮的id
	if(!unAngleButton)
	{
		alert("获取按钮元素unAngle失败！");
	}
	unAngleButton.onclick = function(){delta *= -1;};  
	
	//缩放绘制按钮响应
	var resizeRenderButton = document.getElementById("ResizesRender");//获取html文件中按钮的id
	if(!resizeRenderButton)
	{
		alert("获取按钮元素ResizesRender失败！");
	}
	resizeRenderButton.onclick = function(){k = k+5;};  
	
	//恢复原始图形按钮响应
	var sizeRenderButton = document.getElementById("sizesRender");//获取html文件中按钮的id
	if(!sizeRenderButton)
	{
		alert("获取按钮元素sizesRender失败！");
	}
	sizeRenderButton.onclick = function(){k = 1; pos = 2;};  
	
	//增加顶点个数按钮响应
	var pointNumButton = document.getElementById("PointNum");//获取html文件中按钮的id
	if(!pointNumButton)
	{
		alert("获取按钮元素PointNum失败！");
	}
	pointNumButton.onclick = function(){pos += 1;};
	
	//减少顶点个数按钮响应
	var unpointNumButton = document.getElementById("UnPointNum");//获取html文件中按钮的id
	if(!unpointNumButton)
	{
		alert("获取按钮元素UnPointNum失败！");
	}
	unpointNumButton.onclick = function(){if(pos>2){pos -=1;}else{pos=2;}};
	
	//处理菜单 正方形颜色
	var colorMenu = document.getElementById("ColorMenu");
	if(!colorMenu)
	{
		alert("获取按钮元素ColorMenu失败");
	}
	colorMenu.onclick = function()
	{
		switch(event.target.index)
		{
			case 0:
				gl.uniform3f(u_Color,1.0,1.0,1.0);
				break;
				
			case 1:
				gl.uniform3f(u_Color,0.69,0.13,0.13);
				break;
				
			case 2:
				gl.uniform3f(u_Color,0.73,0.56,0.56);
				break;
				
			case 3:
				gl.uniform3f(u_Color,0.69,0.76,0.87);
				break;
		}
	}
	
	for(var i =0; i<verticesNum;i++)
	{
		
		vertices[j] = vec2(-resize*r,-resize*r);
		vertices[j+1] = vec2(resize*r,-resize*r);
		vertices[j+2] = vec2(resize*r,resize*r);
		vertices[j+3] = vec2(-resize*r,resize*r);
		j += 4;
		r *= 0.8;
	}
	
	
	//设置视口
	gl.viewport(0,0,canvas.width,canvas.height);
	
	//设置背景色
	gl.clearColor(1.0,0.89,0.70,1.0);    //白色
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	//将顶点位置属性数据传输大盘gpu
	var verticesBufferId = gl.createBuffer();
	//将id为verticesBufferId的buffer绑定为当前的arry buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferId);
	//为当前的arry buffer 提供数据 传输到gpu
	gl.bufferData(gl.ARRAY_BUFFER,flatten(vertices),gl.STATIC_DRAW);
	
	//获取变量位置
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0)   //判断位置是否小于零
	{
		alert("获取attribute变量a_Position失败！");
		return;
	}
	
	//提供数据的具体方式
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	//启用顶点属性数组 
	gl.enableVertexAttribArray(a_Position);
	
	//获取u_Angle变量索引
	u_Angle = gl.getUniformLocation(program,"u_Angle");
	if(!u_Angle)
	{
		alert("获取uniform变量u_Angle失败！");
		return;
	}
	
	//获取u_matProj变量索引
	var u_matProj = gl.getUniformLocation(program,"u_matProj");
	if(!u_matProj)
	{
		alert("获取uniform变量u_matProj失败！");
		return;
	}
	
	//颜色
	var u_Color = gl.getUniformLocation(program,"u_Color");
	if(!u_Color)
	{
		alert("获取uniform变量u_Color失败！");
		return;
	}
	
	gl.uniform3f(u_Color,0.69,0.76,0.87);  //白色
	
	//设置视域体
	var matProj = ortho2D(-size*2,size*2,-size*2,size*2);
	gl.uniformMatrix4fv(u_matProj,false,flatten(matProj));

	render();   //进行绘制
};

//绘制函数
function render()
{
	var now = Date.now();
	var elapsed = now-last;
	last = now;
	
	angle += delta*elapsed/1000.0;
	angle %= 360;
	
	gl.uniform1f(u_Angle,angle);
	
	gl.clear(gl.COLOR_BUFFER_BIT);  //用背景色擦除窗口内容
	//gl.drawArrays(gl.LINE_LOOP,0,4);   //使用顶点数组进行绘制
	
	var j = 0;
	
	for(var i=0;i<k;i++)
	{
		
		gl.drawArrays(gl.LINE_LOOP,j,pos);
		j = j+2 ;
		//requestAnimFrame(render);
	}
	
	requestAnimFrame(render);
	   
			   //LINE_LOOP（绘制图元类型 点			   
}
