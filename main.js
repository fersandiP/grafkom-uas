"use strict";
const m4 = twgl.m4;
const vec3 = twgl.vec3;

var gl, programInfo, bufferInfo;

var uniforms = {
    u_lightDirection: [0.0, 0.5, -0.5],
    u_lightPosition: [0.5, 0.5, -5],
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
    obj2: {}
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

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    uniforms.u_projectionMatrix = projection;


    OBJ.downloadMeshes({
        obj1: 'assets/fireplace.obj',
        obj2: 'assets/suzanne.obj'
    }, loadObject);

}

function main() {
    render();
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

    main();
}

function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateParameter();

    setCamera();
    drawObject(ground);
    drawObject(robot);
    requestAnimationFrame(render);
}

function updateParameter() {
    parameter.robot.bodyRotationY += 1;
}

function drawObject(object) {
    let hierarchy = object.hierarchy;

    drawObjectHelper(object, hierarchy);
}

function drawObjectHelper(object, hierarchy) {
    for (let component of hierarchy) {
        defineModelViewMatrix(object[component.name], component.hasChild);
        if (component.hasChild) {
            drawObjectHelper(object, component.childs);

            matrixStack.restore();
        }
    }
}

function defineModelViewMatrix(object, saveMatrix = false) {
    let tempMatrix = matrixStack.getCurrentMatrix();

    let translate = object.translation;
    let rotation = object.rotationY;

    if (object.function != null) {
        if ((object.function & ROTATION) != 0) rotation = rotation();
        if ((object.function & TRANSLATE) != 0) translate = translate();
    }

    tempMatrix = m4.multiply(tempMatrix, m4.translation(translate));
    tempMatrix = m4.multiply(tempMatrix, m4.rotationY(radians(rotation)));
    tempMatrix = m4.multiply(tempMatrix, m4.scaling(object.scale));

    if (saveMatrix) {
        matrixStack.save(tempMatrix);
    }

    draw(tempMatrix, object.bufferInfo);
}

function draw(matrix, bufferInfo = null, objName = 'cube',) {
    if (bufferInfo == null) {
        bufferInfo = twgl.createBufferInfoFromArrays(gl, obj[objName]);
    }
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

window.onkeydown = function (event) {
    switch (event.keyCode) {
        case 65:
            cameraPosition[0] += settings.speed;
            break;
        case 68:
            cameraPosition[0] -= settings.speed;
            break;
        case 87:
            cameraPosition[2] += settings.speed;
            break;
        case 83:
            cameraPosition[2] -= settings.speed;
            break;
    }
}

function radians(degrees) {
    return degrees * Math.PI / 180.0;
}