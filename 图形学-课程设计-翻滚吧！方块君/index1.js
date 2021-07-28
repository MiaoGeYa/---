// 全局变量   //整体x是12 y是10
var gl;				// WebGL上下文
var program; 		// shader program
var mvStack = [];  // 模视投影矩阵栈，用数组实现，初始为空
var matCamera = mat4();	 // 照相机变换，初始为恒等矩阵
matCamera = mult(translate(0.0, 0.0, -1.0), matCamera);
var matReverse = mat4(); // 照相机变换的逆变换，初始为恒等矩阵

var yRot = 0.0;        // 用于动画的旋转角
var deltaAngle = 30.0; // 每秒旋转角度
var programObj;
// 用于保存W、S、A、D四个方向键的按键状态的数组
var keyDown = [false, false, false, false];

var g = 9.8;				// 重力加速度
var initSpeed = 4; 			// 初始速度 
var jumping = false;	    // 是否处于跳跃过程中
var jumpY = 0;          	// 当前跳跃的高度
var jumpTime = 0;			// 从跳跃开始经历的时间
/*纹理变量 */
var textureLoaded=0;  //已加载纹理图
var numTextures=5;  //纹理图总数
var skyTexObj;  //天空使用纹理对象

var CamMove=true;  //判断相机是否允许移动
var GameOver=false;  //判断游戏是否结束
var GameWin=false;
var count = 0;
/*玩家方块移动变量 */
var angleY = 0.0;		// 绕y轴旋转的角度
var angleX = 0.0;		// 绕x轴旋转的角度
var angleStep = 10.0;	// 角度变化步长(3度)
var CubeX=0.0;
var CubeY=0.0;
var moveLen=0.03;//方块移动的距离
var Cscale = 0.5;  //玩家方块扩大倍数

var time = 91;   //倒计时
var score=0;  //分数
var life=3;  //生命值

var numsmallcube = 10;  //吃掉的方块数
var numTorus = 40;  // 场景中甜甜圈的数目
var numFoodCube = 20;   // 场景中黄色小方块的数目
var numMovecubeR = 20;   // 场景中移动方块的数目  右到左
var movecubeRx = 0.8;   //移动的障碍物cube的x坐标
var numMovecubeL = 20;   // 场景中移动方块的数目  左到右
var movecubeLx = -0.8;   //移动的障碍物cube的x坐标

var gw = 0.8,gh = 90.0;  //地面大小

var game = false;
//光源参数
var Light=function(){
	this.pos=vec4(-1.0,1.0,1.0,0.0);//荒原位置/方向（默认为斜上方方向的光源)
	this.ambient=vec3(0.2,0.2,0.2);//环境光
	this.diffuse=vec3(1.0,1.0,1.0);//漫反射光
	this.specular=vec3(1.0,1.0,1.0);//镜面反射光
	this.on=true;
}
var lightSun=new Light();
var lights=[];
var lamp=new Light();  //添加灯光使场景更亮

var Material=function(){
	this.ambient=vec3(0.0,0.0,0.0);
	this.diffuse=vec3(0.8,0.8,0.8);
	this.specular=vec3(0.0,0.0,0.0);
	this.emission=vec3(0.0,0.0,0.0);
	this.shininess=10;
	this.alpha=1.0;
}

var playcubemtl = new Material();  //玩家方块材质
playcubemtl.ambient = vec3(0.01, 0.01, 0.01);
playcubemtl.diffuse = vec3(0.01, 0.01, 0.01);
playcubemtl.specular = vec3(0.01, 0.01, 0.01);
playcubemtl.emission = vec3(1.0, 0.98,0.9);	
playcubemtl.alpha = 0.9;

var mtlsmallbox = new Material();  //随机出现的黄色小方块材质
mtlsmallbox.ambient = vec3(0.01, 0.01, 0.01);
mtlsmallbox.diffuse = vec3(0.2, 0.2, 0.2);
mtlsmallbox.specular = vec3(0.01, 0.01, 0.01);
mtlsmallbox.emission = vec3(1.0, 0.98,0.9);	
mtlsmallbox.shininess = 1;

//爱心
//mtlsmallbox.ambient = vec3(0.1, 0.1, 0.1); 	// 环境反射系数
//mtlsmallbox.diffuse = vec3(0.2, 0.2, 0.2);	// 漫反射系数
//mtlsmallbox.specular = vec3(0.2, 0.2, 0.2);	// 镜面反射系数
//mtlsmallbox.emission = vec3(1.0, 0.89,0.7);	// 发射光
//mtlsmallbox.shininess = 100;

var mtlbigbox = new Material();  //随机出现的障碍物材质
mtlbigbox.ambient = vec3(0.1, 0.1, 0.1); 	// 环境反射系数
mtlbigbox.diffuse = vec3(0.2, 0.2, 0.2);	// 漫反射系数
mtlbigbox.specular = vec3(0.2, 0.2, 0.2);	// 镜面反射系数
mtlbigbox.emission = vec3(1.0, 0.93,0.85);	// 发射光
mtlbigbox.shininess = 200;

var mtlmovebox = new Material();  //随机出现会移动的方块材质
mtlmovebox.ambient = vec3(0.1, 0.1, 0.1); 	// 环境反射系数
mtlmovebox.diffuse = vec3(0.2, 0.2, 0.2);	// 漫反射系数
mtlmovebox.specular = vec3(0.2, 0.2, 0.2);	// 镜面反射系数
mtlmovebox.emission = vec3(0.72, 0.82,0.93);	// 发射光
mtlmovebox.shininess = 150;

//纹理对象
var Texture=function(pathNum,forMat,mipmapping){
	this.path=pathNum;
	this.format=forMat;
	this.mipmapping=mipmapping;
	this.texture=null;
	this.complete=false;
}

//光源属性初始化
function initLights()
{
	lights.push(lightSun);
    //场景光源
	lamp.pos=vec4(0.0,280.0-85.0,0.0,1.0);
	lamp.ambient=vec3(1.0,1.0,1.0);
	lamp.diffuse=vec3(0.5,0.5,0.5);
	lamp.specular=vec3(1.0,1.0,1.0);
	lights.push(lamp);
	
	//传值
	gl.uniform3fv(program.u_SpotDirection,
		flatten(vec3(0.0,0.0,-1.0)));
	gl.uniform1f(program.u_SpotCutOff,8);
	gl.uniform1f(program.u_SpotExponent,3);
	passLightsOn();

}

function passLightsOn()
{
	var lightsOn=[]
	lightsOn[0]=1;
	gl.uniform1iv(program.u_LightOn,lightsOn);
}
//创建纹理对象、加载纹理图
function loadTexture(path,format,mipmapping)
{
	var texObj=new Texture(path,format,mipmapping);
	
	var image=new Image();
	if(!image){
		console.log("创建image对象失败！");
		return false;
	}
	
	image.onload=function(){
		console.log("纹理图"+path+"加载完毕");
		
		initTexture(texObj,image);
		
		textureLoaded++;
		
		if(textureLoaded==numTextures)
			requestAnimFrame(render);
	};
	image.src=path;
	console.log("开始加载纹理图："+path);
	
	return texObj;
}
//初始化纹理对象
function initTexture(texObj,image)
{
	texObj.texture=gl.createTexture();
	if(!texObj.texture){
		console.log("创建纹理对象失败！");
		return false;
	}
	
	gl.bindTexture(gl.TEXTURE_2D,texObj.texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
	
	gl.texImage2D(gl.TEXTURE_2D,0,texObj.format,
	    texObj.format,gl.UNSIGNED_BYTE,image);
	
	if(texObj.mipmapping){
		gl.generateMipmap(gl.TEXTURE_2D);
		
		gl.texParameteri(gl.TEXTURE_2D,
		     gl.TEXTURE_MIN_FILTER,
			 gl.LINEAR_MIPMAP_LINEAR);
	}
	else
		gl.texParameteri(gl.TEXTURE_2D,
		    gl.TEXTURE_WRAP_S,  gl.REPEAT);
	
	texObj.complete=true;
}
// 定义Obj对象
// 构造函数
var Obj = function(){
	this.numVertices = 0; 		// 顶点个数
	this.vertices = new Array(0); // 用于保存顶点数据的数组
	this.normals=new Array(0);
	this.texcoords=new Array(0);
	this.vertexBuffer = null;	// 存放顶点数据的buffer对象
	this.normalBuffer=null;
	this.texBuffer=null;
	this.color = vec3(1.0, 1.0, 1.0); // 对象颜色，默认为白色
	this.material=new Material();
	this.texObj=null;
}

// 初始化缓冲区对象(VBO)
Obj.prototype.initBuffers = function(){
	/*创建并初始化顶点坐标缓冲区对象(Buffer Object)*/
	// 创建缓冲区对象，存于成员变量vertexBuffer中
	this.vertexBuffer = gl.createBuffer(); 
	// 将vertexBuffer绑定为当前Array Buffer对象
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	// 为Buffer对象在GPU端申请空间，并提供数据
	gl.bufferData(gl.ARRAY_BUFFER,	// Buffer类型
		flatten(this.vertices),		// 数据来源
		gl.STATIC_DRAW	// 表明是一次提供数据，多遍绘制
		);
	// 顶点数据已传至GPU端，可释放内存
	this.vertices.length = 0; 
	
	this.normalBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,
	flatten(this.normals),
	gl.STATIC_DRAW
	);
	this.normals.length=0;
	
	if(this.texcoords.length!=0){
	this.texBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	// 为Buffer对象在GPU端申请空间，并提供数据
	gl.bufferData(gl.ARRAY_BUFFER,	// Buffer类型
		flatten(this.texcoords),		// 数据来源
		gl.STATIC_DRAW	// 表明是一次提供数据，多遍绘制
		);
	// 顶点数据已传至GPU端，可释放内存
	this.texcoords.length = 0; }
}

// 绘制几何对象
// 参数为模视矩阵
Obj.prototype.draw = function(matMV,material,tmpTexObj){
	
	// 设置为a_Position提供数据的方式
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	// 为顶点属性数组提供数据(数据存放在vertexBuffer对象中)
	gl.vertexAttribPointer( 
		program.a_Position,	// 属性变量索引
		3,					// 每个顶点属性的分量个数
		gl.FLOAT,			// 数组数据类型
		false,				// 是否进行归一化处理
		0,   // 在数组中相邻属性成员起始位置间的间隔(以字节为单位)
		0    // 第一个属性值在buffer中的偏移量
		);
	// 为a_Position启用顶点数组
	gl.enableVertexAttribArray(program.a_Position);	
	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);
	gl.vertexAttribPointer(
	program.a_Normal,
	3,
	gl.FLOAT,
	false,
	0,
	0
	);
	gl.enableVertexAttribArray(program.a_Normal);
	
	if(this.texBuffer!=null){
	gl.bindBuffer(gl.ARRAY_BUFFER,this.texBuffer);
	gl.vertexAttribPointer(
	program.a_Texcoord,
	2,
	gl.FLOAT,
	false,
	0,
	0
	);
	gl.enableVertexAttribArray(program.a_Texcoord);
	}
	var mtl;
	if(arguments.length>1&&arguments[1]!=null)
		mtl=material;
	else
		mtl=this.material;
	//设置材质属性
	var ambientProducts=[];
	var diffuseProducts=[];
	var specularProducts=[];
	for(var i=0;i<lights.length;i++){
		ambientProducts.push(mult(lights[i].ambient,
		mtl.ambient));
		diffuseProducts.push(mult(lights[i].diffuse,
		mtl.diffuse));
		specularProducts.push(mult(lights[i].specular,
		mtl.specular));
	}
	
	gl.uniform3fv(program.u_AmbientProduct,
	     flatten(ambientProducts));
	gl.uniform3fv(program.u_DiffuseProduct,
	     flatten(diffuseProducts));
	gl.uniform3fv(program.u_SpecularProduct,
	     flatten(specularProducts));
		 
	gl.uniform3fv(program.u_Emission,
	     flatten(mtl.emission));
	gl.uniform1f(program.u_Shininess,mtl.shininess);
	gl.uniform1f(program.u_Alpha,mtl.alpha);
	
	var texObj;
	if(arguments.length>2&&arguments[2]!=null)
		texObj=tmpTexObj;
	else
   texObj=this.texObj;
	if(texObj!=null&&texObj.complete)
		gl.bindTexture(gl.TEXTURE_2D,texObj.texture);
	
	// 开始绘制
	gl.uniformMatrix4fv(program.u_ModelView, false, 
		flatten(matMV)); // 传MV矩阵
	gl.uniformMatrix3fv(program.u_NormalMat, false, 
		flatten(normalMatrix(matMV))); // 传MV矩阵
	gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
}
function quad(obj,points,a, b, c, d)
{
	// 计算四边形的两个不平行的边向量
	var u = subtract(points[b], points[a]);
	var v = subtract(points[c], points[b]);
		
	// 通过叉乘计算法向
	var normal = normalize(cross(u, v));

	obj.normals.push(normal); 
	obj.texcoords.push(vec2(0.0,0.0));
	obj.vertices.push(points[a]); 
	obj.normals.push(normal); 
	obj.texcoords.push(vec2(1.0,0.0));
	obj.vertices.push(points[b]); 
	obj.normals.push(normal); 
	obj.texcoords.push(vec2(1.0,1.0));
	obj.vertices.push(points[c]); 
	obj.normals.push(normal); 
	obj.texcoords.push(vec2(0.0,0.0));
	obj.vertices.push(points[a]); 
	obj.normals.push(normal); 
	obj.texcoords.push(vec2(1.0,1.0));
	obj.vertices.push(points[c]); 
	obj.normals.push(normal); 
	obj.texcoords.push(vec2(0.0,1.0));
	obj.vertices.push(points[d]); 
}

//生成立方体的数据
// 返回立方体Obj对象
function buildCube(){
	var obj=new Obj();
	obj.numVertices=36;// 绘制立方体使用顶点数(6个面*2个三角形*3个顶点)
	var points = [			// 立方体的8个顶点
		vec3(-0.1, -0.1,  0.1), // 左下前
		vec3(-0.1,  0.1,  0.1), // 左上前
		vec3( 0.1,  0.1,  0.1), // 右上前
		vec3( 0.1, -0.1,  0.1), // 右下前
		vec3(-0.1, -0.1, -0.1), // 左下后
		vec3(-0.1,  0.1, -0.1), // 左上后
		vec3( 0.1,  0.1, -0.1), // 右上后
		vec3( 0.1, -0.1, -0.1)  // 右下后
	];
	quad(obj,points,1, 0, 3, 2);	// 前
	quad(obj,points,2, 3, 7, 6);	// 右
	quad(obj,points,3, 0, 4, 7);	// 下
	quad(obj,points,6, 5, 1, 2);	// 上
	quad(obj,points,4, 5, 6, 7);	// 后
	quad(obj,points,5, 4, 0, 1);	// 左
	
	return obj;
}

// 在y=0平面绘制中心在原点的格状方形地面
// fExtent：决定地面区域大小(方形地面边长的一半)
// fStep：决定线之间的间隔
// 返回地面Obj对象
function buildGround(fExtent, fEztent,fStep){	
	var obj = new Obj(); // 新建一个Obj对象
	var iterations=2*fExtent/fStep;
	var fTexcoordStep=40/iterations;
	for(var x = -fExtent,s=0; x < fExtent; x += fStep,s +=fTexcoordStep){
		for(var z = fEztent,t=0; z > -fEztent; z -= fStep,t+=fTexcoordStep){
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(x, 0, z);
			var ptLowerRight = vec3(x + fStep, 0, z);
			var ptUpperLeft = vec3(x, 0, z - fStep);
			var ptUpperRight = vec3(x + fStep, 0, z - fStep);
			
			// 分成2个三角形
			obj.vertices.push(ptUpperLeft);    
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);
			
			obj.normals.push(vec3(0,1,0));
			obj.normals.push(vec3(0,1,0));
			obj.normals.push(vec3(0,1,0));
			obj.normals.push(vec3(0,1,0));
			obj.normals.push(vec3(0,1,0));
			obj.normals.push(vec3(0,1,0));

			obj.texcoords.push(vec2(s,t+fTexcoordStep));
			obj.texcoords.push(vec2(s,t));
			obj.texcoords.push(vec2(s+fTexcoordStep,t));
			obj.texcoords.push(vec2(s,t+fTexcoordStep));
			obj.texcoords.push(vec2(s+fTexcoordStep,t));
			obj.texcoords.push(vec2(s+fTexcoordStep,t+fTexcoordStep));
			obj.numVertices += 6;
		}
	}
	obj.material.ambient=vec3(0.1,0.1,0.1);
	obj.material.diffuse=vec3(0.8,0.8,0.8);
	obj.material.specular=vec3(0.3,0.3,0.3);
	obj.material.emission=vec3(0.0,0.0,0.0);
	obj.material.shininess=10;
	return obj;
}
// 用于生成一个中心在原点的球的顶点数据(南北极在z轴方向)
// 返回球Obj对象，参数为球的半径及经线和纬线数
function buildSphere(radius, columns, rows){
	var obj = new Obj(); // 新建一个Obj对象
	var vertices = []; // 存放不同顶点的数组

	for (var r = 0; r <= rows; r++){
		var v = r / rows;  // v在[0,1]区间
		var theta1 = v * Math.PI; // theta1在[0,PI]区间

		var temp = vec3(0, 0, 1);
		var n = vec3(temp); // 实现Float32Array深拷贝
		var cosTheta1 = Math.cos(theta1);
		var sinTheta1 = Math.sin(theta1);
		n[0] = temp[0] * cosTheta1 + temp[2] * sinTheta1;
		n[2] = -temp[0] * sinTheta1 + temp[2] * cosTheta1;
		
		for (var c = 0; c <= columns; c++){
			var u = c / columns; // u在[0,1]区间
			var theta2 = u * Math.PI * 2; // theta2在[0,2PI]区间
			var pos = vec3(n);
			temp = vec3(n);
			var cosTheta2 = Math.cos(theta2);
			var sinTheta2 = Math.sin(theta2);
			
			pos[0] = temp[0] * cosTheta2 - temp[1] * sinTheta2;
			pos[1] = temp[0] * sinTheta2 + temp[1] * cosTheta2;
			
			var posFull = mult(pos, radius);
			
			vertices.push(posFull);
		}
	}

	/*生成最终顶点数组数据(使用三角形进行绘制)*/
	var colLength = columns + 1;
	for (var r = 0; r < rows; r++){
		var offset = r * colLength;

		for (var c = 0; c < columns; c++){
			var ul = offset  +  c;						// 左上
			var ur = offset  +  c + 1;					// 右上
			var br = offset  +  (c + 1 + colLength);	// 右下
			var bl = offset  +  (c + 0 + colLength);	// 左下

			// 由两条经线和纬线围成的矩形
			// 分2个三角形来画
			obj.vertices.push(vertices[ul]); 
			obj.vertices.push(vertices[bl]);
			obj.vertices.push(vertices[br]);
			obj.vertices.push(vertices[ul]);
			obj.vertices.push(vertices[br]);
			obj.vertices.push(vertices[ur]);


			obj.normals.push(vertices[ul]); 
			obj.normals.push(vertices[bl]);
			obj.normals.push(vertices[br]);
			obj.normals.push(vertices[ul]);
			obj.normals.push(vertices[br]);
			obj.normals.push(vertices[ur]);

			//纹理坐标
			obj.texcoords.push(vec2(c/columns,r/rows));
			obj.texcoords.push(vec2(c/columns,(r+1)/rows));
			obj.texcoords.push(vec2((c+1)/columns,(r+1)/rows));
			obj.texcoords.push(vec2(c/columns,r/rows));
			obj.texcoords.push(vec2((c+1)/columns,(r+1)/rows));
			obj.texcoords.push(vec2((c+1)/columns,r/rows));
		}
	}

	vertices.length = 0; // 已用不到，释放 
	obj.numVertices = rows * columns * 6; // 顶点数
	obj.material.ambient=vec3(0,0,0.23);
	obj.material.diffuse=vec3(0.8,0.8,0.8);
	obj.material.specular=vec3(0.3,0.3,0.3);
	obj.material.emission=vec3(0.0,0.0,0.0);
	obj.material.shininess=27.897400;
	return obj;
}
//圆环
function buildTorus(majorRadius, minorRadius, numMajor, numMinor){
	var obj = new Obj(); // 新建一个Obj对象
	
	obj.numVertices = numMajor * numMinor * 6; // 顶点数

	var majorStep = 2.0 * Math.PI / numMajor;
	var minorStep = 2.0 * Math.PI / numMinor;
	var sScale = 4, tScale = 2; // 两方方向上纹理坐标的缩放系数
	
	for(var i = 0; i < numMajor; ++i)
	{
		var a0 = i * majorStep;
		var a1 = a0 + majorStep;
		var x0 = Math.cos(a0);
		var y0 = Math.sin(a0);
		var x1 = Math.cos(a1);
		var y1 = Math.sin(a1);

		// 三角形条带左右顶点 两个圆环中心
		var center0 = mult(majorRadius, vec3(x0, y0, 0));
		var center1 = mult(majorRadius, vec3(x1, y1, 0));
		
		for(var j = 0; j < numMinor; ++j)
		{
			var b0 = j * minorStep;
			var b1 = b0 + minorStep;
			var c0 = Math.cos(b0);
			var r0 = minorRadius * c0 + majorRadius;
			var z0 = minorRadius * Math.sin(b0);
			var c1 = Math.cos(b1);
			var r1 = minorRadius * c1 + majorRadius;
			var z1 = minorRadius * Math.sin(b1);

			var left0 = vec3(x0*r0, y0*r0, z0);
			var right0 = vec3(x1*r0, y1*r0, z0);
			var left1 = vec3(x0*r1, y0*r1, z1);
			var right1 = vec3(x1*r1, y1*r1, z1);
			obj.vertices.push(left0);  
			obj.vertices.push(right0); 
			obj.vertices.push(left1); 
			obj.vertices.push(left1); 
			obj.vertices.push(right0);
			obj.vertices.push(right1);
			
			// 法向从圆环中心指向顶点
			obj.normals.push(subtract(left0, center0));
			obj.normals.push(subtract(right0, center1));
			obj.normals.push(subtract(left1, center0));
			obj.normals.push(subtract(left1, center0));
			obj.normals.push(subtract(right0, center1));
			obj.normals.push(subtract(right1, center1));
			
			// 纹理坐标
			obj.texcoords.push(vec2(i / numMajor * sScale, 
				j / numMinor * tScale));
			obj.texcoords.push(vec2((i+1) / numMajor * sScale, 
				j / numMinor * tScale));
			obj.texcoords.push(vec2(i / numMajor * sScale, 
				(j+1) / numMinor * tScale));
			obj.texcoords.push(vec2(i / numMajor * sScale, 
				(j+1) / numMinor * tScale));
			obj.texcoords.push(vec2((i+1) / numMajor * sScale, 
				j / numMinor * tScale));
			obj.texcoords.push(vec2((i+1) / numMajor * sScale, 
				(j+1) / numMinor * tScale));
			
		}
	}
	obj.material.ambient = vec3(0.1, 0.1, 0.1);
	obj.material.diffuse = vec3(0.2, 0.2, 0.2);
	obj.material.specular = vec3(0.2, 0.2, 0.2);
	obj.material.emission = vec3(1.0, 0.98,0.9);	
	obj.material.shininess = 10;
	return obj;
}
// 获取shader中变量位置
function getLocation(){
	/*获取shader中attribute变量的位置(索引)*/
  
	program.a_Position = gl.getAttribLocation(program, "a_Position");
	if(program.a_Position < 0)
		console.log("获取attribute变量a_Position索引失败!");
    program.a_Normal = gl.getAttribLocation(program, "a_Normal");
	if(program.a_Normal < 0)
		console.log("获取attribute变量a_Normal索引失败!");
	program.a_Texcoord = gl.getAttribLocation(program, "a_Texcoord");
	if(program.a_Texcoord < 0)
		console.log("获取attribute变量a_Texcoord索引失败!");
	
	// 获取vProgram中各uniform变量索引
	// 注意getUniformLocation失败则返回null
	program.u_ModelView = gl.getUniformLocation(program, "u_ModelView");
	if(!program.u_ModelView) 
		console.log("获取uniform变量u_ModelView索引失败!");
	
	program.u_Projection = gl.getUniformLocation(program, "u_Projection");
	if(!program.u_Projection)
		console.log("获取uniform变量u_Projection索引失败!");
	program.u_NormalMat = gl.getUniformLocation(program, "u_NormalMat");
	if(!program.u_NormalMat) 
		console.log("获取uniform变量u_NormalMat索引失败!");
	program.u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
	if(!program.u_LightPosition)
		console.log("获取uniform变量u_LightPosition索引失败!");
	program.u_AmbientProduct = gl.getUniformLocation(program, "u_AmbientProduct");
	if(!program.u_AmbientProduct)
		console.log("获取uniform变量u_AmbientProduct索引失败!");
	program.u_DiffuseProduct = gl.getUniformLocation(program, "u_DiffuseProduct");
	if(!program.u_DiffuseProduct)
		console.log("获取uniform变量u_DiffuseProduct索引失败!");
	program.u_SpecularProduct = gl.getUniformLocation(program, "u_SpecularProduct");
	if(!program.u_SpecularProduct) 
		console.log("获取uniform变量u_SpecularProduct索引失败!");
	program.u_Shininess = gl.getUniformLocation(program, "u_Shininess");
	if(!program.u_Shininess)
		console.log("获取uniform变量u_Shininess索引失败!");
	program.u_Emission = gl.getUniformLocation(program, "u_Emission");
	if(!program.u_Emission) 
		console.log("获取uniform变量u_Emission索引失败!");
	program.u_Sampler = gl.getUniformLocation(program, "u_Sampler");
	if(!program.u_Sampler) 
		console.log("获取uniform变量u_Sampler索引失败!");
	program.u_SpotDirection = gl.getUniformLocation(program, "u_SpotDirection");
	if(!program.u_SpotDirection) 
		console.log("获取uniform变量u_SpotDirection索引失败!");
	program.u_SpotCutOff = gl.getUniformLocation(program, "u_SpotCutOff");
	if(!program.u_SpotCutOff) 
		console.log("获取uniform变量u_SpotCutOff索引失败!");
	program.u_SpotExponent = gl.getUniformLocation(program, "u_SpotExponent");
	if(!program.u_SpotExponent) 
		console.log("获取uniform变量u_SpotExponent索引失败!");
	program.u_LightOn = gl.getUniformLocation(program, "u_LightOn");
	if(!program.u_LightOn) 
	console.log("获取uniform变量u_LightOn索引失败!");	
	program.u_Alpha = gl.getUniformLocation(program, "u_Alpha");
	if(!program.u_Alpha) 
	console.log("获取uniform变量u_Alpha索引失败!");	
	program.u_bOnlyTexture = gl.getUniformLocation(program, "u_bOnlyTexture");
	if(!program.u_bOnlyTexture) 
	console.log("获取uniform变量u_bOnlyTexture索引失败!");	
	
}

var ground = buildGround(gw,gh, 0.1); // 生成地面对象
var sphere = buildSphere(0.5, 15, 15); // 生成球对象

var MainCube=buildCube();  //生成玩家方块君
var Foodcube=buildCube();  //生成黄色小方块对象 
var MovecubeR = buildCube();  //会移动的障碍物cube  右边到左边
var MovecubeL = buildCube();  //会移动的障碍物cube  左边到右边
var torus = buildTorus(0.15, 0.08, 25, 25); // 生成圆环对象 甜甜圈

var posTorus = [];   // 用于保存圆环位置的数组，对每个圆环位置保存其x、z坐标
var posFoodcube = [];   // 用于保存小方块位置的数组，对每个小方块位置保存其x、z坐标
var posMovecubeR = [];   // 用于保存移动方块位置的数组，对每个移动方块位置保存其x、z坐标
var posMovecubeL = [];

// 初始化场景中的几何对象
function initObjs(){
	// 初始化地面顶点数据缓冲区对象(VBO)
	ground.initBuffers(); 
	ground.texObj=loadTexture("Res\\grass.jpg",gl.RGB,true);
	MainCube.initBuffers();
	MainCube.texObj=loadTexture("Res\\MainCube.jpg",gl.RGB,true);
	var sizeGround = 0.8;   //产生物体的范围
	
	//甜甜圈
	var j = -1;
	for(var iTorus = 0; iTorus < numTorus; iTorus++)
	{
		// 在 -sizeGround 和 sizeGround 间随机选择一位置
		var x = Math.random() * sizeGround * 2 - sizeGround;
		for(var i=0; i<4;i++)
		{
			var z = j;
			posTorus.push(vec2(x, z));
			j-= 0.4;
		}
		j -= 4;
	}
	torus.initBuffers();
	torus.texObj = loadTexture("Res\\torus3.jpg",gl.RGB,true);
	
	//黄色小方块
	var j2 = -5;
	for(var iFCube = 0; iFCube < numFoodCube; iFCube++)
	{
		var x2 = Math.random() * sizeGround * 2 - sizeGround;
		var z2 = j2;
		posFoodcube.push(vec2(x2, z2));
		j2 -= 4;
	}
	Foodcube.initBuffers();
	Foodcube.texObj=loadTexture("Res\\smallcube.jpg",gl.RGB,true);

	//会移动的cube  右边移动左边
	var j3 = -6;
	for(var iMCube = 0; iMCube < numMovecubeR; iMCube++)
	{
		var z3 = j3;
		posMovecubeR.push(vec2(movecubeRx, z3));
		j3 -= 14;
	}
	MovecubeR.initBuffers();
	MovecubeR.texObj=loadTexture("Res\\shitou1.jpg",gl.RGB,true);
	
	//会移动的cube  左边移动右边
	var j4 = -13;
	for(var iMCube = 0; iMCube < numMovecubeL; iMCube++)
	{
		var z4 = j4;
		posMovecubeL.push(vec2(movecubeLx, z4));
		j4 -= 14;
	}
	MovecubeL.initBuffers();
	MovecubeL.texObj=loadTexture("Res\\shitou1.jpg",gl.RGB,true);
	
	//障碍物
	/*numx = Math.random() * 2 * 2 - 2;
	numz = Math.random() * 18 * 2 - 18;
	ZCube.initBuffers();
	ZCube.texObj=loadTexture("Res\\box.jpg",gl.RGB,true);
	*/
	
	//天空球
	sphere.initBuffers();
	skyTexObj=loadTexture("Res\\box.jpg",gl.RGB,true);
}


// 页面加载完成后会调用此函数，函数名可任意(不一定为main)
window.onload = function main(){
	// 获取页面中id为webgl的canvas元素
    var canvas = document.getElementById("webgl");
	if(!canvas){ // 获取失败？
		alert("获取canvas元素失败！"); 
		return;
	}
	
	// 利用辅助程序文件中的功能获取WebGL上下文
	// 成功则后面可通过gl来调用WebGL的函数
    gl = WebGLUtils.setupWebGL(canvas,{alpha:false});    
    if (!gl){ // 失败则弹出信息
		alert("获取WebGL上下文失败！"); 
		return;
	}        
    var rect=canvas.getBoundingClientRect();
	canvas.width=innerWidth-20;
	canvas.height=innerHeight-49;
	window.onresize=function(){
		var rect=canvas.getBoundingClientRect();
		canvas.width=innerWidth;
		canvas.height=innerHeight;
	gl.viewport(0,0, canvas.width, canvas.height); 
	} 
   
	/*设置WebGL相关属性*/
    gl.clearColor(0.0, 0.0, 0.5, 1.0); // 设置背景色为蓝色
	gl.enable(gl.DEPTH_TEST);	// 开启深度检测
	gl.enable(gl.CULL_FACE);	// 开启面剔除
	// 设置视口，占满整个canvas
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	/*加载shader程序并为shader中attribute变量提供数据*/
	// 加载id分别为"vertex-shader"和"fragment-shader"的shader程序，
	// 并进行编译和链接，返回shader程序对象program
    program = initShaders(gl, "vertex-shader", 
		"fragment-shader");
    gl.useProgram(program);	// 启用该shader程序对象 
	
	// 获取shader中变量位置
	getLocation();	
	var matProj;
	
	// 设置投影矩阵：透视投影，根据视口宽高比指定视域体
	matProj = perspective(35.0, 		// 垂直方向视角
		canvas.width / canvas.height, 	// 视域体宽高比
		0.1, 							// 相机到近裁剪面距离
		100.0);							// 相机到远裁剪面距离
	//传投影矩阵
	gl.uniformMatrix4fv(program.u_Projection,false,flatten(matProj));
	gl.uniform1i(program.u_Sampler,0);

	// 初始化场景中的几何对象
	initLights();
	initObjs();
	
};

// 按键响应
window.onkeydown = function(){
	switch(event.keyCode){
		
		/*case 87:	// W
		if(CamMove)
			{keyDown[0] = true;}
			break;*/
		case 83:	// S
			game = true;
			break; 
		case 65:	// A
		if(CamMove)
			{keyDown[2] = true;}
			break;
		case 68:	// D
		if(CamMove)
			{keyDown[3] = true;}
			break;
		case 32: 	// space
			if(!jumping){
				jumping = true;
				jumpTime = 0;
			}
			break;
	}
	// 禁止默认处理(例如上下方向键对滚动条的控制)
	event.preventDefault(); 
	//console.log("%f, %f, %f", matReverse[3], matReverse[7], matReverse[11]);
}

// 按键弹起响应
window.onkeyup = function(){
	switch(event.keyCode){
		/*case 87:	// W
			keyDown[0] = false;
			break;
		case 83:	// S
			keyDown[1] = false;
			break;*/
		case 65:	// A
			keyDown[2] = false;
			break;
		case 68:	// D
			keyDown[3] = false;
			break;
		case 32: 	// space
		if(!jumping){
			jumping = true;
			jumpTime = 0;
		}
		break;
	}
}

// 记录上一次调用函数的时刻
var last = Date.now();

// 根据时间更新旋转角度
function animation(){
	
	// 计算距离上次调用经过多长的时间
	var now = Date.now();
	var elapsed = (now - last) / 1000.0; // 秒
	//console.log(elapsed);
	//隔一段时间重置障碍物的位置
	if(elapsed == 0.013){
		count ++;
		if(count == 50)
			count=0;
	}
	
	if(count == 20){
		numx= Math.random() * 5 * 2 - 5;
		numz= Math.random() * 5 * 2 - 5;
	}
	
	last = now;
	
	// 更新动画状态
	yRot += deltaAngle * elapsed;
	// 防止溢出
	yRot %= 360;
	
	// 跳跃处理
	jumpTime += elapsed;
	if(jumping){
		jumpY = initSpeed * jumpTime - 0.5 * g * jumpTime * jumpTime;
		if(jumpY <= 0){
			jumpY = 0;
			jumping = false;
		}
	}
	
	if(game==true)
	{
		//倒计时
		time -= elapsed;
	}
	
}

// 更新照相机变换
function updateCamera(){
	// 照相机左转
	if(keyDown[2]){
		CubeX-=moveLen;
		angleY += angleStep;

			if (angleY > 180.0) {
				angleY -= 360.0;
			}

		matReverse = mult(matReverse, translate(moveLen, 0.0, 0.0));
		matCamera = mult(translate(moveLen,0.0,0.0), matCamera);
	}
	
	// 照相机右转
	if(keyDown[3]){
		CubeX+=moveLen;
		//console.log(CubeX);	
		angleY -= angleStep;

			if (angleY > 180.0) {
				angleY += 360.0;
			}

		matReverse = mult(matReverse, translate(-moveLen, 0.0, 0.0));
		matCamera = mult(translate(-moveLen,0.0,0.0), matCamera);
	}
}

// 绘制函数
function render() {
	animation(); // 更新动画参数
	
	updateCamera(); // 更新相机变换
	
	// 清颜色缓存和深度缓存
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
    // 模视投影矩阵初始化为投影矩阵*照相机变换矩阵
	var matMV =mult(translate(0,-jumpY,0),matCamera);	

	/*为光源位置数组传值 */
	var lightPositions=[];
	lightPositions.push(mult(matMV,lightSun.pos));
	lightPositions.push(lamp.pos);
	gl.useProgram(program);
	
	//传观察坐标系下光源位置/方向
	gl.uniform4fv(program.u_LightPosition,flatten(lightPositions));
	/*绘制天空球 */
	gl.disable(gl.CULL_FACE);
	mvStack.push(matMV);
	matMV=mult(matMV,scale(150.0,150.0,150.0));
	matMV=mult(matMV,rotateX(90));
	gl.uniform1i(program.u_bOnlyTexture,1);
	sphere.draw(matMV,null,skyTexObj);
	gl.uniform1i(program.u_bOnlyTexture,0);
	matMV=mvStack.pop();
	gl.enable(gl.CULL_FACE);
	/*绘制地面*/
	mvStack.push(matMV);
	// 将地面移到y=-0.4平面上
	matMV = mult(matMV, translate(0.0, -0.1, -gh));
	ground.draw(matMV);
	matMV = mvStack.pop();

	//游戏进行中
	if(!GameOver && !GameWin && game==true)
	{
		
		alldraw(matMV);
		
		//设置随机出现障碍物
		/*mvStack.push(matMV);
		matMV=mult(matMV,translate(numx,0.5,numz));
		matMV=mult(matMV,scale(7.0,7.0,7.0));
		ZCube.draw(matMV,mtlbigbox);
		matMV = mvStack.pop();
		
		//绘制移动的方块  右到左
		mvStack.push(matMV);
		matMV=mult(matMV,translate(MovecubeRx,0,z1));
		matMV=mult(matMV,scale(2.0,2.0,2.0));
		MovecubeR.draw(matMV,mtlmovebox);
		matMV = mvStack.pop(); */

		//获取生命、分数,时间
		document.getElementById("mark").innerHTML = "小方块剩余：" + numsmallcube;
		document.getElementById("mark2").innerHTML = "Live：" + life + "\n Score: " + score;  //生命 分数
		document.getElementById("mark3").innerHTML = Math.floor(time);   //时间取整数
		
		//碰撞检测
		Collision_test();
		//会移动的方块
		CubeMove();
	}
	/*玩家绘制方块 */
	mvStack.push(matMV);
	matMV=mult(matMV,translate(CubeX,0.0,CubeY));
	matMV=mult(matMV,scale(Cscale,Cscale,Cscale));
	matMV=mult(matMV,mult(rotateZ(angleY),rotateX(angleX)));
	MainCube.draw(matMV,playcubemtl);
	matMV=mvStack.pop();
	
	requestAnimFrame(render); // 请求重绘
}

//移动控制
function CubeMove()
{
	//让玩家cube动起来
	if(CubeY >= -gh)
	{
		CubeY-=moveLen;
		angleX -= angleStep;
		
		matReverse = mult(matReverse, translate(0.0, 0.0, -moveLen));
		matCamera = mult(translate(0.0, 0.0, moveLen), matCamera);
	}
	
	//控制移动的障碍物cube
	if(movecubeRx <= gw)  //右边到左边
	{
		movecubeRx -= 0.01;
		if(Math.abs(movecubeRx+0.8)<=0.05)   //碰到墙壁后回到原始位置
			movecubeRx = 0.8;
	}
	
	//控制移动的障碍物cube
	if(movecubeLx <= gw)  //右边到左边
	{
		movecubeLx += 0.01;
		if(Math.abs(movecubeLx-0.8)<=0.05)   //碰到墙壁后回到原始位置
			movecubeLx = -0.8;
	}
	
}

//碰撞检测
function Collision_test()
{
	//玩家方块和小方块的碰撞
	for(var i = 0;i < numFoodCube ; i++)
	{
		if(Math.abs(CubeX-posFoodcube[i][0])<=0.1 && Math.abs(CubeY-posFoodcube[i][1])<=0.1)
		{
			document.getElementById('Smallboxmusic').play(); //播放拾取到的声音
			posFoodcube[i][0] = mult(posFoodcube[i][0],translate(0,1.0,0));
			posFoodcube[i][1] = mult(posFoodcube[i][0],translate(0,-0.0,0));
			score+=2;
			Cscale+=0.05;
			numsmallcube -= 1;
			
			if(Cscale>=1.0)     //原本是0.5大小
		{
			GameWin=true;
			document.getElementById("mark").innerHTML = "小方块剩余：" + 0;
			document.getElementById('Gamewinmusic').play(); //播放游戏胜利的声音
			//停止游戏移动
			CamMove=false;
		    keyDown[0]=false;
			keyDown[1]=false;
			keyDown[2]=false;
			keyDown[3]=false;
			//显示新结束面板
			document.getElementById("score").innerHTML = "( •̀ ω •́ )吃掉所有小方块！Score：" + score+"分 " ;
			document.getElementById("p").style.display="block";
			document.getElementById('bgmusic').pause(); //暂停背景音乐
		}
		}
	}
	
	//玩家方块和甜甜圈的碰撞
	for(var i = 0;i < numTorus ; i++)
	{
		if(Math.abs(CubeX-posTorus[i][0])<=0.1 && Math.abs(CubeY-posTorus[i][1])<=0.1)
		{
			document.getElementById('Smallboxmusic').play(); //播放拾取到的声音
			posTorus[i][0] = mult(posTorus[i][0],translate(0,1.0,0));
			posTorus[i][1] = mult(posTorus[i][0],translate(0,-0.0,0));
			score = score + 1;
		}
	}
	
	//玩家方块和会移动的cube的碰撞  右边
	for(var i = 0;i < numMovecubeR ; i++)
	{
		if(Math.abs(CubeX-posMovecubeR[i][0])<=0.5 && Math.abs(CubeY-posMovecubeR[i][1])<=0.5)
		{
			document.getElementById('Collisionmusic').play(); //播放碰撞到的声音
			posMovecubeR[i][0] = mult(posMovecubeR[i][0],translate(0,1.0,0));
			posMovecubeR[i][1] = mult(posMovecubeR[i][0],translate(0,-0.0,0));
			
			GameOver = true;
			break;
		}
	}
	
	//玩家方块和会移动的cube的碰撞  右边
	for(var i = 0;i < numMovecubeL ; i++)
	{
		if(Math.abs(CubeX+posMovecubeL[i][0])<=0.5 && Math.abs(CubeY-posMovecubeL[i][1])<=0.5)
		{
			document.getElementById('Collisionmusic').play(); //播放碰撞到的声音
			posMovecubeL[i][0] = mult(posMovecubeL[i][0],translate(0,1.0,0));
			posMovecubeL[i][1] = mult(posMovecubeL[i][0],translate(0,-0.0,0));
			
			//游戏结束
			GameOver = true;
			break;
		}
	}
	
	/*
	//玩家方块和障碍物的碰撞
	if((Math.abs(CubeX-numx)<=1.2 && Math.abs(CubeY-numz)<=0.2))
	{
		//停止前进
		numx = Math.random() * 2 * 2 - 2;
		numz = Math.random() * 10 * 2 - 10;
		life-=1;
		checklive();
		document.getElementById('Collisionmusic').play(); //播放碰撞到的声音
	}
	*/
	//玩家方块是否出界
	if(CubeX > 0.85 || CubeX < -0.85)
		GameOver = true;
		
	//检查时间是否到了
	if(Math.floor(time) == 0)
		GameOver = true;
	
	//游戏结束界面
	if(GameOver)
	{	
		document.getElementById("score").innerHTML = "( T ω T ) GameOver ！ Score：" + score+"分 ";
		document.getElementById("p").style.display="block";
		document.getElementById('Gameovermusic').play(); //播放游戏失败的声音
	}
}

//检查生命值
function checklive()
{
	//console.log("碰到障碍物，"+"生命值："+life);
	if(life == 0)
	{
		document.getElementById("mark2").innerHTML = "Live：" + life + "\n Score: " + score;  //生命 分数
		document.getElementById("mark").innerHTML = "小方块剩余：" + numsmallcube;
		//游戏结束	
		GameOver=true;
		CamMove=false;
		keyDown[0]=false;
		keyDown[1]=false;
		keyDown[2]=false;
		keyDown[3]=false;
	}
}

//绘制游戏开始的所有物体
function alldraw(matMV)
{
	//绘制每个自转的圆环*/ //甜甜圈 
	for(var i = 0; i < numTorus; i++)
	{
		mvStack.push(matMV);
		matMV = mult(matMV, translate(posTorus[i][0], 0.0, posTorus[i][1]));
		matMV = mult(matMV, scale(0.4,0.4,0.4));
		matMV = mult(matMV, rotateY(yRot * 4));
		torus.draw(matMV);
		matMV = mvStack.pop();
	}
	
	//绘制每个自转的小方块*/ 
	for(var i = 0; i < numFoodCube; i++)
	{
		mvStack.push(matMV);
		matMV = mult(matMV, translate(posFoodcube[i][0], 0.0, posFoodcube[i][1]));
		matMV = mult(matMV, rotateZ(yRot*2));
		matMV=mult(matMV,scale(0.5,0.5,0.5));
		Foodcube.draw(matMV,mtlsmallbox);
		matMV = mvStack.pop();
	}
	
	//绘制移动方块*/   //右边到左边
	for(var i = 0; i < numMovecubeR; i++)
	{
		mvStack.push(matMV);
		matMV = mult(matMV, translate(movecubeRx, 0.0, posMovecubeR[i][1]));
		matMV=mult(matMV,scale(2.3,1.5,2.0));
		MovecubeR.draw(matMV,mtlmovebox);
		matMV = mvStack.pop(); 
	}
	
	//绘制移动方块*/   //左边到右边
	for(var i = 0; i < numMovecubeL; i++)
	{
		mvStack.push(matMV);
		matMV = mult(matMV, translate(movecubeLx, 0.0, posMovecubeL[i][1]));
		matMV=mult(matMV,scale(2.3,1.5,2.0));
		MovecubeL.draw(matMV,mtlmovebox);
		matMV = mvStack.pop(); 
	}
}