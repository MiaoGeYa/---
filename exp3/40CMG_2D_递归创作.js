//网页加载完毕会调用此函数

var NumTimesToSubdivide = 3;   //递归次数
var NumTriangles = Math.pow(6,NumTimesToSubdivide);  //产生的三角形个数
var NumVertices = 6*NumTriangles;  //顶点数
var points = [];   //存放顶点的数组

window.onload = function main()
{
	//获取页面中id为webgl的canvas元素
	var canvas = document.getElementById("webgl");
	if(!canvas)
	{
		//获取失败的话显示下面语句
		alert("获取canvas失败！");
		return ;
	}
	
	//获取webgl上下文
	var gl = WebGLUtils.setupWebGL(canvas);
	if(!gl)
	{
		//获取失败显示下面语句
		alert("获取webgl上下文失败！");
		return;
	}
	
	//指定三角形的三个顶点
	var vertices=[vec2(-0.5,1.0),vec2(0.5,1.0),vec2(1.0,0.0),vec2(0.5,-1.0),vec2(-0.5,-1.0),vec2(-1.0,0.0),
				  vec2(0.0,1.0),vec2(1.0,0.0),vec2(0.0,-1.0),vec2(-1.0,0.0)];
	
	//递归细分原始三角形
	divideTringle(vertices[0],vertices[1],vertices[2],vertices[3],vertices[4],vertices[5],NumTimesToSubdivide);
	
	//设置视口
	gl.viewport(0,0,canvas.width,canvas.height);
	
	//设置背景色
	gl.clearColor(0.8,0.36,0.36,1.0);    //白色
	//gl.clearColor(0.0,0.0,0.0,1.0);    //白色
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	//将顶点位置属性数据传输大盘gpu
	var verticesBufferId = gl.createBuffer();
	//将id为verticesBufferId的buffer绑定为当前的arry buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferId);
	//为当前的arry buffer 提供数据 传输到gpu
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);
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
	
	render(gl);   //进行绘制
};

//绘制函数
function render(gl)
{
	gl.clear(gl.COLOR_BUFFER_BIT);  //用背景色擦除窗口内容
	gl.drawArrays(gl.LINE_LOOP,0,NumVertices);   //使用顶点数组进行绘制
	
	//gl.drawArrays(gl.LINES,0,6);		   
			   //LINE_LOOP（绘制图元类型 点）
			   
}

//将三角形的顶点坐标加入数组中
function tringle(a,b,c,d,e,f)
{
	points.push(a);
	points.push(b);
	points.push(c);
	points.push(d);
	points.push(e);
	points.push(f);
}

//递归细分三角形
function divideTringle(a,b,c,d,e,f,k)
{
	if(k > 0)
	{
		var ab = mult(0.2,add(a,b));
		var bc = mult(0.5,add(b,c));
		var cd = mult(0.5,add(c,d));
		var de = mult(0.2,add(d,e));
		var ef = mult(0.5,add(e,f));
		var af = mult(0.5,add(a,f));
		
		divideTringle(a,cd,ef,bc,af,d,k-1);
		divideTringle(b,ef,cd,af,bc,e,k-1);
		divideTringle(c,ab,af,ef,de,f,k-1);
		divideTringle(d,af,bc,ef,cd,a,k-1);
		divideTringle(e,bc,af,cd,ef,b,k-1);
		divideTringle(f,de,cd,bc,ab,c,k-1);
	}
	
	else
	{
		tringle(a,b,c,d,e,f);
	}
}
