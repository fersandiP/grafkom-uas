"use strict";

var canvas, gl, program;

var modelViewMatrixLoc, normalLoc;
var modelViewMatrix = [];

var position = []
var color = []
var normals = []

var vertices = [
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0)
];


function quad(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    position.push(vertices[a]);
    normals.push(normal);
    position.push(vertices[b]);
    normals.push(normal);
    position.push(vertices[c]);
    normals.push(normal);
    position.push(vertices[a]);
    normals.push(normal);
    position.push(vertices[c]);
    normals.push(normal);
    position.push(vertices[d]);
    normals.push(normal);
}

function setBall(gl, r, x, y){
  var center = vec2(x, y);

  position.push(center);
  for (var i = 0; i <= 100; i++){
    position.push(vec4(
        r*Math.cos(2*Math.PI*i/100.0) + x,
        r*Math.sin(2*Math.PI*i/100.0) + y,
        1,
        1
    ));

    }
}

function setCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    setCube();

    //Insert position to vertex shader
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(position), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //Insert normal to vNormal
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    //Get Normal Matrix Location
    normalLoc = gl.getUniformLocation(program, "normalMatrix");

    //Get Model View Matrix Location
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");


    //Projection Matrix SetUp
    var projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    var projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix")
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    render();

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    resetModelViewMatrix()

    requestAnimationFrame(render);
}


function resetModelViewMatrix(){
  modelViewMatrix = [rotate(theta.body, 0, 1, 0)];
}

function currentMatrix(){
  return modelViewMatrix[modelViewMatrix.length-1];
}

//Change modelViewMatrix state
function popMatrix(){
  return modelViewMatrix.pop();
}

function draw(matrix) {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(matrix));
    var normalMatrix = inverse(matrix);
    gl.uniformMatrix4fv(normalLoc, false, flatten(normalMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}
