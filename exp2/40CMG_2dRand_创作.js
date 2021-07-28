//网页加载完毕会调用此函数

var NumPoints = 100000;
var points = [];

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
				  
	var vertices=[vec2(0.0,-0.7),
				  vec2(0.82,0.2),vec2(-0.82,0.2),
				  vec2(-0.5,0.75),vec2(0.5,0.75)];
				  
	//在三角形内部随机生成一个初始点
	var a = Math.random();   //[0-1]随机一个数
	var b = (1-a)*Math.random();    //[0~1-a]随机一个数
	
	var p = add(mult(a,vertices[1]),  //p是三角形三个顶点坐标的加权值，和为1，
			add(mult(b,vertices[2]),
			mult(1-a,vertices[3]),mult(1-a-b,vertices[4])));
	
	//在控制台输出p的坐标
	console.log("初始点p：(%f,%f)",p[0],p[1]);
	var colors = [];   //保存随机颜色的数组
	
	//循环计算numpoings=5000 个顶点的坐标
	for(var i = 0;i < NumPoints/4;i++)
	{
		var j = Math.floor(Math.random()*3);  //随机选择三角形一个顶点
		var p = mult(0.55,add(p,vertices[j]));  //计算顶点与p点的中点
		points.push(p);   //将心得顶点加到数组中
		colors.push(vec3(1,0.98,0.98)); //随机生成颜色
	}
	
	for(var i = NumPoints/4;i < NumPoints;i++)
	{
		var j = Math.floor(Math.random()*5);  //随机选择三角形一个顶点
		var p = mult(0.44,add(p,vertices[j]));  //计算顶点与p点的中点
		points.push(p);   //将心得顶点加到数组中
		colors.push(vec3(1.0,0.8,0.72)); //随机生成颜色
	}
	
	
	//设置视口
	gl.viewport(0,0,canvas.width,canvas.height);
	
	//设置背景色
	gl.clearColor(0.0,0.0,0.0,1.0);    //白色
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	var verticesBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferId);
	
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0)
	{
		alert("获取attribute变量a_Position失败！");
		return;
	}
	
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_Position);
	
	//
	var colorsBufferId = gl.createBuffer();  //创建buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, colorsBufferId);
	
	gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);
	
	var a_Color = gl.getAttribLocation(program,"a_Color");
	if(a_Color < 0)
	{
		alert("获取attribute变量a_Color失败！");
		return;
	}
	
	console.log("a_Color = %d",a_Color);
	
	gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_Color);
	
	render(gl);   //进行绘制
};

//绘制函数
function render(gl)
{
	gl.clear(gl.COLOR_BUFFER_BIT);  //用背景色擦除窗口内容
	gl.drawArrays(gl.POINTS,0,points.length);   //使用顶点数组进行绘制
			   //（绘制图元类型 点）
	   
}