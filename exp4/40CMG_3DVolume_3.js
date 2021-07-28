//网页加载完毕会调用此函数

//绘制时采用4种颜色
var colors = [vec3(1.0,0.0,0.0),vec3(0.0,1.0,0.0),
			  vec3(0.0,0.0,1.0),vec3(0.0,0.0,0.0)];

var attributes = [];  //存放顶点属性的数组

var NumTimesToSubdivide = 4;   //递归次数
var NumTetrahedrons = Math.pow(4,NumTimesToSubdivide);   //产生四面体的个数
var NumTriangles = 4*NumTetrahedrons;  //产生的三角形个数  每个四面体有四个三角形
var NumVertices = 3*NumTriangles;  //顶点数

//将顶点属性加入到数组中
function triangle(a,b,c,colorIndex)
{
	attributes.push(a);
	attributes.push(colors[colorIndex]);
	attributes.push(b);
	attributes.push(colors[colorIndex]);
	attributes.push(c);
	attributes.push(colors[colorIndex]);
}

//生成四面体
function tetra(a,b,c,d)
{
	triangle(a,b,c,0);   //红色
	triangle(a,c,d,1);   //绿色
	triangle(a,d,b,2);   //蓝色
	triangle(b,d,c,3);   //黑色
}

//体细分
function divideTetra(a,b,c,d,k)
{
	var mid = [];
	if(k > 0)
	{
		mid[0] = mult(0.5,add(a,b));
		mid[1] = mult(0.5,add(a,c));
		mid[2] = mult(0.56,add(a,d));
		mid[3] = mult(0.3,add(b,c));
		mid[4] = mult(0.5,add(c,d));
		mid[5] = mult(0.5,add(b,d));
		
		divideTetra(a,mid[0],mid[1],mid[2],k-1);
		divideTetra(mid[0],b,mid[3],mid[5],k-1);
		divideTetra(mid[1],mid[3],c,mid[4],k-1);
		divideTetra(mid[2],mid[5],mid[4],d,k-1);
	}
	
	else
	{
		tetra(a,b,c,d);
	}
}

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
	
	//指定四面体的顶点
	var vertices=[vec3(0.0,0.0,-1.0),
				  vec3(0.0,0.942809,-0.333333),
				  vec3(-0.816497,-0.471405,-0.333333),
				  vec3(0.816497,-0.471405,-0.333333)];
	
	//递归细分原始三角形
	divideTetra(vertices[0],vertices[1],vertices[2],vertices[3],NumTimesToSubdivide);
	
	//设置视口
	gl.viewport(0,0,canvas.width,canvas.height);
	
	//设置背景色
	gl.clearColor(1.0,1.0,1.0,1.0);    //白色
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	//将顶点位置属性数据传输大盘gpu
	var verticesBufferId = gl.createBuffer();
	//将id为verticesBufferId的buffer绑定为当前的arry buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferId);
	//为当前的arry buffer 提供数据 传输到gpu
	gl.bufferData(gl.ARRAY_BUFFER,flatten(attributes),gl.STATIC_DRAW);
	//数组清空
	attributes.length = 0;
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
	if(a_Color<0)
	{
		alert("获取attribute变量a_Color失败！");
		return;
	}
	
	gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT*6,Float32Array.BYTES_PER_ELEMENT*3);
	gl.enableVertexAttribArray(a_Color);
	
	render(gl);   //进行绘制
};

//绘制函数
function render(gl)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  //用背景色擦除窗口内容
	gl.drawArrays(gl.TRIANGLES,0,NumVertices);   //使用顶点数组进行绘制
	
	//gl.drawArrays(gl.LINES,0,6);		   
			   //LINE_LOOP（绘制图元类型 点			   
}
