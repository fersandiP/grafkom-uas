"use strict";
const m4 = twgl.m4;
var gl, programInfo, bufferInfo;
var uniforms = {
    u_lightDirection : [0.0, 0.5, -0.5],
    u_lightPosition: [0.3, 0.5, -2]
}

var cameraPosition = [0, 0, -10]

var arrays = {
    position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
    normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
    indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
}

var settings = {
    speed: 0.5
}

window.onload = function () {
    twgl.setDefaults({
        attribPrefix: "a_",
        crossOrigin: ""
    })

    gl = document.getElementById("gl-canvas").getContext("webgl");
    programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    requestAnimationFrame(render);
}

function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    const eye = cameraPosition;
    const target = [cameraPosition[0], 0, cameraPosition[2]+10];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera)
    
    const model = m4.rotationY(time);


    uniforms.u_projectionMatrix = projection;
    uniforms.u_modelMatrix = model;
    uniforms.u_viewMatrix = view;
    uniforms.u_normalMatrix = camera;
    uniforms.u_worldInverseMatrix = m4.transpose(m4.inverse(model));


    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}

window.onkeydown = function(event) {
    switch(event.keyCode) {
        case 65:
            cameraPosition[0]+=settings.speed;
            break;
        case 68:
            cameraPosition[0]-=settings.speed;
            break;
        case 87:
            cameraPosition[2]+=settings.speed;
            break;
        case 83:
            cameraPosition[2]-=settings.speed;
            break;
    }
}