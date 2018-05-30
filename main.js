"use strict";
const m4 = twgl.m4;
const vec3 = twgl.vec3;

var gl, programInfo, bufferInfo;

var uniforms = {
    u_lightDirection: [0.0, 0.0, -5],
    u_lightPosition: [-3, 2, -2],
    u_shininess: 10,
};

var cameraPosition = [0, 0, -10];

var matrixStack = new MatrixStack();

var obj = {
    cube: {
        position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
        normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
        indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
        texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1]
    },
    obj1: {},
    obj2: {},
    sphere: {},
    ground: {
        position: [-100, 0, -100, 100, 0, -100, 100, 0.01, 100, -100, 0.01, 100],
        normal: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        indices: [0, 1, 2, 2, 3, 0]
    }
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

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    OBJ.downloadMeshes({
        obj1: 'assets/fireplace.obj',
        obj2: 'assets/suzanne.obj',
        sphere: 'assets/sphere.obj',
    }, loadObject);

}

function main() {
    requestAnimationFrame(render);
}

function loadObject(meshes) {
    obj.obj1.indices = meshes.obj1.indices;
    obj.obj1.position = meshes.obj1.vertices;
    obj.obj1.normal = meshes.obj1.vertexNormals;
    // obj.obj1.texcoord  = meshes.obj1.textures;

    obj.obj2.indices = meshes.obj2.indices;
    obj.obj2.position = meshes.obj2.vertices;
    obj.obj2.normal = meshes.obj2.vertexNormals;
    // obj.obj2.texcoord  = meshes.obj2.textures;

    obj.sphere.indices = meshes.sphere.indices;
    obj.sphere.position = meshes.sphere.vertices;
    obj.sphere.normal = meshes.sphere.vertexNormals;

    main();
}

function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setProjection();
    setCamera();
    ground();
    cubeKecil(time);
    sphere(time);
    requestAnimationFrame(render);
}

function ground() {
    let tempMatrix = matrixStack.getCurrentMatrix();
    tempMatrix = m4.translate(tempMatrix, [0, -2.5, 0])
    tempMatrix = m4.scale(tempMatrix, [2, 0, 100])
    draw(tempMatrix);
}


function sphere(time) {
    let tempMatrix = matrixStack.getCurrentMatrix();
    tempMatrix = m4.scale(tempMatrix, [0.4, 0.4, 0.4])
    tempMatrix = m4.rotateX(tempMatrix, time)
    tempMatrix = m4.translate(tempMatrix, [0, 5, 0])
    draw(tempMatrix, 'sphere');
}

function cubeKecil(time) {
    let tempMatrix = matrixStack.getCurrentMatrix();
    tempMatrix = m4.scale(tempMatrix, [0.5, 0.5, 0.5]);
    tempMatrix = m4.translate(tempMatrix, [0, 0, 0]);
    tempMatrix = m4.rotateY(tempMatrix, time);
    draw(tempMatrix);
}

function draw(matrix, objName = 'cube') {
    bufferInfo = twgl.createBufferInfoFromArrays(gl, obj[objName]);
    uniforms.u_modelMatrix = matrix;
    uniforms.u_worldInverseMatrix = m4.transpose(m4.inverse(matrix));

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
}

function setCamera() {
    const eye = cameraPosition;
    const target = [cameraPosition[0], 0, cameraPosition[2] + 10];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);

    uniforms.u_viewMatrix = view;
    uniforms.u_cameraPosition = cameraPosition;

}

function setProjection() {
    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    uniforms.u_projectionMatrix = projection;
}

window.onkeydown = function (event) {
    switch (event.keyCode) {
        case 65://Key A
            cameraPosition[0] += settings.speed;
            break;
        case 68://Key D
            cameraPosition[0] -= settings.speed;
            break;
        case 87://Key W
            cameraPosition[2] += settings.speed;
            break;
        case 83://Key S
            cameraPosition[2] -= settings.speed;
            break;
        case 37://Left Arrow
            uniforms.u_lightDirection[0] += settings.speed;
            break;
        case 38://Up Arrow
            uniforms.u_lightDirection[1] += settings.speed;
            break;
        case 39://Right Arrow
            uniforms.u_lightDirection[0] -= settings.speed;
            break;
        case 40://Down Arrow
            uniforms.u_lightDirection[1] -= settings.speed;
            break;
    }
}

function radians(degrees) {
    return degrees * Math.PI / 180.0;
}