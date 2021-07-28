// 全局变量
var gl;						// WebGL上下文

var mvpStack = [];  // 模视投影矩阵栈，用数组实现，初始为空
var matProj;	    // 投影矩阵

var a_Position;  	// shader中attribute变量a_Position的索引
var u_MVPMatrix;	// Shader中uniform变量"u_MVPMatrix"的索引

var sizeGround = 20.0;    //地面边长
var numVerticesGround;   //地面顶点个数
var bufferGround;

var numSpheres = 50;   //地面中球的个数
var posSphere = [];    //存放球的位置数组
var numVerticesSphere;   //一个球的顶点个数
var bufferSphere;

var yRot = 0.0;    //动画旋转的角度
var deltaAngle = 60.0;   //每秒旋转的角度

var numVerticesTorus;   //圆环顶点数
var bufferTorus;

var mvpStack = [];
var matProj;
var matCamera = mat4();
var matReverse = mat4();

//保存w,s,d,a,四个键的状态
var keyDown = [false,false,false,false];

// 页面加载完成后会调用此函数，函数名可任意(不一定为main)
window.onload = function main()
{
	// 获取页面中id为webgl的canvas元素
    var canvas = document.getElementById("webgl");
	if(!canvas){ // 获取失败？
		alert("获取canvas元素失败！"); 
		return;
	}
	
	// 利用辅助程序文件中的功能获取WebGL上下文
	// 成功则后面可通过gl来调用WebGL的函数
    gl = WebGLUtils.setupWebGL(canvas);    
    if (!gl){ // 失败则弹出信息
		alert("获取WebGL上下文失败！"); 
		return;
	}        

	/*设置WebGL相关属性*/
    gl.clearColor(0.0, 0.0, 0.5, 1.0); // 设置背景色为蓝色
	gl.enable(gl.DEPTH_TEST);	// 开启深度检测
	// 设置视口，占满整个canvas
	gl.viewport(0, 0, canvas.width, canvas.height);
	// 设置投影矩阵：透视投影，根据视口宽高比指定视域体
	matProj = perspective(35.0, 		// 垂直方向视角
		canvas.width / canvas.height, 	// 视域体宽高比
		1.0, 							// 相机到近裁剪面距离
		50.0);							// 相机到远裁剪面距离
	
	/*加载shader程序并为shader中attribute变量提供数据*/
	// 加载id分别为"vertex-shader"和"fragment-shader"的shader程序，
	// 并进行编译和链接，返回shader程序对象program
    var program = initShaders(gl, "vertex-shader", 
		"fragment-shader");
    gl.useProgram(program);	// 启用该shader程序对象 
	
	// 获取名称为"a_Position"的shader attribute变量的位置
    a_Position = gl.getAttribLocation(program, "a_Position");
	if(a_Position < 0){ // getAttribLocation获取失败则返回-1
		alert("获取attribute变量a_Position失败！"); 
		return;
	}	
	gl.enableVertexAttribArray(a_Position);	// 为a_Position启用顶点数组

	// 获取名称为"u_MVPMatrix"的shader uniform变量位置
	u_MVPMatrix = gl.getUniformLocation(program, "u_MVPMatrix");
	if(!u_MVPMatrix){
		alert("获取uniform变量u_MVPMatrix失败！")
		return;
	}
	
	// 获取名称为"u_Color"的shader uniform变量位置
	var u_Color = gl.getUniformLocation(program, "u_Color");
	if(!u_Color){
		alert("获取uniform变量u_Color失败！")
		return;
	}
	gl.uniform3f(u_Color, 1.0, 1.0, 1.0); // 传白色
	
	//初始化地面缓冲区
	initGround();
	//初始化球体
	initSphere();
	//初始化圆环
	initTorus();
	// 进行绘制
    render();
};

//按键响应
window.onkeydown = function()
{
	switch(event.keyCode)
	{
		case 38:   //up
			matReverse = mult(matReverse,translate(0.0,0.0,-0.1));
			matCamera = mult(translate(0.0,0.0,0.1),matCamera);
			break;
			
		case 40:  //down
			matCamera = mult(translate(0.0,0.0,-0.1),matCamera);
			break;
			
		case 37:  //left
			matCamera = mult(rotateY(-2),matCamera);
			break;
			
		case 39:  //right
			matCamera = mult(rotateY(2),matCamera);
			break;
		//wsad
		case 87:  //up
			keyDown[0] = true;
			break;
			
		case 83:  //down
			keyDown[1] = true;
			break;
			
		case 65:  //left
			keyDown[2] = true;
			break;
			
		case 68:  //right
			keyDown[3] = true;
			break;
	}
	event.preventDefault();
}

//按键弹起响应
window.onkeyup = function()
{
	switch(event.keyCode)
	{
		//wsad
		case 87:  //up
			keyDown[0] = false;
			break;
			
		case 83:  //down
			keyDown[1] = false;
			break;
			
		case 65:  //left
			keyDown[2] = false;
			break;
			
		case 68:  //right
			keyDown[3] = false;
			break;
	}
}

// 绘制函数
function render() 
{
	animation();
	
	updateCamera();
	
	// 清颜色缓存和深度缓存
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	//地面
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferGround);
	gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
	
	var matMVP = mult(matProj,matCamera);
	
	mvpStack.push(matMVP);
	matMVP = mult(matMVP,translate(0.0,-0.4,0.0));   //将地面移到y = -0.4的平面
	gl.uniformMatrix4fv(u_MVPMatrix,false,flatten(matMVP));
	gl.drawArrays(gl.LINES,0,numVerticesGround);
	matMVP = mvpStack.pop();
	
	//球体
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferSphere);
	gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
		
	for(var i=0; i<numSpheres; i++)
	{
		mvpStack.push(matMVP);
		matMVP = mult(matMVP,translate(posSphere[i][0],-0.2,posSphere[i][1]));
		matMVP = mult(matMVP,rotateX(90));
		
		gl.uniformMatrix4fv(u_MVPMatrix,false,flatten(matMVP));
		gl.drawArrays(gl.LINES,0,numVerticesSphere);
		matMVP = mvpStack.pop();
	}
	
	matMVP = mult(matMVP,translate(0.0,0.0,-2.5));
	mvpStack.push(matMVP);
	matMVP = mult(matMVP,rotateY(-yRot*2.0));
	matMVP = mult(matMVP,translate(1.0,0.0,0.0));
	matMVP = mult(matMVP,rotateX(90));
	gl.uniformMatrix4fv(u_MVPMatrix,false,flatten(matMVP));
	gl.drawArrays(gl.LINES,0,numVerticesSphere);
	matMVP = mvpStack.pop();
	
	//圆环
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferTorus);
	gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
	matMVP = mult(matMVP,rotateY(yRot));
	gl.uniformMatrix4fv(u_MVPMatrix,false,flatten(matMVP));
	gl.drawArrays(gl.LINES,0,numVerticesTorus);
	
	requestAnimFrame(render);
}

//创建地面
function buildGround(fExtent,fStep)
{
	var ptGround = [];
	numVerticesGround = 0;
	
	for(var iLine = -fExtent;iLine <= fExtent;iLine += fStep)
	{
		ptGround.push(vec3(iLine,0,fExtent));
		ptGround.push(vec3(iLine,0,-fExtent));
		
		ptGround.push(vec3(fExtent,0,iLine));
		ptGround.push(vec3(-fExtent,0,iLine));
		
		numVerticesGround += 4;
	}
	return ptGround;
}

//初始化地面缓冲区
function initGround()
{
	var ptGround = buildGround(sizeGround,1.0);
	
	bufferGround = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferGround);
	
	gl.bufferData(gl.ARRAY_BUFFER,flatten(ptGround),gl.STATIC_DRAW);
	
	ptGround.length = 0;
	
	//gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
}

//初始球
function initSphere()
{
	for(var iSphere = 0;iSphere < numSpheres;iSphere++)
	{
		var x = Math.random()*sizeGround*2 - sizeGround;
		var z = Math.random()*sizeGround*2 - sizeGround;
		
		posSphere.push(vec2(x,z));
	}
	
	var ptSphere = buildSphere(0.2,15,15);
	
	bufferSphere = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferSphere);
	
	gl.bufferData(gl.ARRAY_BUFFER,flatten(ptSphere),gl.STATIC_DRAW);
	
	ptSphere.length = 0;
	
	//gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
}

//创建球体
function buildSphere(radius,columns,rows)
{
	var vertices = [];
	
	for(var r=0; r<=rows; r++)
	{
		var v = r/rows;
		var thetal = v*Math.PI;
		
		var temp = vec3(0,0,1);
		var n = vec3(temp);
		
		var cosThetal = Math.cos(thetal);
		var sinThetal = Math.sin(thetal);
		
		n[0] = temp[0] * cosThetal + temp[2] * sinThetal;
		n[2] = -temp[0] * sinThetal + temp[2] * cosThetal;
		
		for(var c=0; c<=columns; c++)
		{
			var u = c/columns;
			var theta2 = u * Math.PI * 2;
			var pos = vec3(n);
			temp = vec3(n);
			
			var cosTheta2 = Math.cos(theta2);
			var sinTheta2 = Math.sin(theta2);
			
			pos[0] = temp[0] * cosTheta2 - temp[1] * sinTheta2;
			pos[1] = temp[0] * sinTheta2 + temp[1] * cosTheta2;
			
			var posFull = mult(pos,radius);
			
			vertices.push(posFull);
		}
	}
	
	var spherePoint = [];
	var colLength = columns + 1;
	
	for(var r=0; r<rows; r++)
	{
		var offset = r * colLength;
		
		for(var c=0; c<columns; c++)
		{
			var ul = offset + c;
			var ur = offset + c + 1;
			var br = offset + (c+1+colLength);
			var bl = offset + (c+0+colLength);
			
			spherePoint.push(vertices[ul]);
			spherePoint.push(vertices[ur]);
			spherePoint.push(vertices[ul]);
			spherePoint.push(vertices[bl]);
			spherePoint.push(vertices[ul]);
			spherePoint.push(vertices[br]);
		}
	}
	
	vertices.length = 0;
	numVerticesSphere = rows * columns * 6;
	
	return spherePoint;
}

//初始化圆环
function initTorus()
{
	var ptTorus = buildTorus(0.4,0.2,40,20);
	
	bufferTorus = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferTorus);
	
	gl.bufferData(gl.ARRAY_BUFFER,flatten(ptTorus),gl.STATIC_DRAW);
	
	ptTorus.length = 0;
}

//创建圆环
function buildTorus(majorRadius,minorRadius,numMajor,numMinor)
{
	var ptTorus = [];
	numVerticesTorus = numMajor * numMinor * 6;
	
	var majorStep = 2.0 * Math.PI/numMajor;
	var minjorStep = 2.0 * Math.PI/numMinor;
	
	for(var i=0; i<numMajor; i++)
	{
		var a0 = i * majorStep;
		var a1 = a0 + majorStep;
		
		var x0 = Math.cos(a0);
		var y0 = Math.sin(a0);
		
		var x1 = Math.cos(a1);
		var y1 = Math.sin(a1);
		
		for(var j=0; j<numMinor; j++)
		{
			var b0 = j * minjorStep;
			var b1 = b0 + minjorStep;
		
			var c0 = Math.cos(b0);
			var r0 = minorRadius * c0 + majorRadius;
			var z0 = minorRadius * Math.sin(b0);
		
			var c1 = Math.cos(b1);
			var r1 = minorRadius * c1 + majorRadius;
			var z1 = minorRadius * Math.sin(b1);
			
			var left0 = vec3(x0*r0,y0*r0,z0);
			var right0 = vec3(x1*r0,y1*r0,z0);
			
			var left1 = vec3(x0*r1,y0*r1,z1);
			var right1 = vec3(x1*r1,y1*r1,z1);
			
			ptTorus.push(left0);
			ptTorus.push(right0);
			ptTorus.push(left0);
			ptTorus.push(left1);
			ptTorus.push(left1);
			ptTorus.push(right0);
		}
	}
	
	return ptTorus;
}

var last = Date.now();

function animation()
{
	var now = Date.now();
	var elapsed = now-last;
	last = now;
	
	yRot += deltaAngle * elapsed/1000.0;
	yRot %= 360;
}

//更新相机变换
function updateCamera()
{
	if(keyDown[0])  //前进
		matCamera = mult(translate(0.0,0.0,0.1),matCamera);
		
	if(keyDown[1])  //后退
		matCamera = mult(translate(0.0,0.0,-0.1),matCamera);
		
	if(keyDown[2])  //左
		matCamera = mult(rotateY(-2),matCamera);
		
	if(keyDown[3])  //右
		matCamera = mult(rotateY(2),matCamera);
}
















