"use strict";
const m4 = twgl.m4;
const vec3 = twgl.vec3;

var gl, programInfo, bufferInfo;

const DEFAULT_COLOR = [0.2, 0.8, 0.2];

var textures;
var uniforms = {
    u_lightDirection: [0.0, 0.5, -0.5],
    u_lightPosition: [0.5, 0.5, -5],
    u_shininess: 20,
    u_color: DEFAULT_COLOR,
    u_isTexture: 0,
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
    textures = twgl.createTextures(gl, {
        wall: {
            src:'textures/wall.gif'
        }
    });
    programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);



    OBJ.downloadMeshes({
        obj1: 'assets/WalkingGirl.obj',
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
    obj.obj1.texcoord  = meshes.obj1.vertices.slice(0,meshes.obj1.vertices.length/3*2)

    obj.obj2.indices = meshes.obj2.indices;
    obj.obj2.position = meshes.obj2.vertices;
    obj.obj2.normal = meshes.obj2.vertexNormals;
    obj.obj2.texcoord  = meshes.obj2.vertices.slice(0,meshes.obj2.vertices.length/3*2)

    main();
}

function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateParameter();
    setProjection();
    setCamera();
    drawObject(suzanne);
    drawObject(world);
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
    let rotationY = (object.rotationY == null) ? 0 : object.rotationY;
    let rotationX = (object.rotationX == null) ? 0 : object.rotationX;
    let rotationZ = (object.rotationZ == null) ? 0 : object.rotationZ;

    if (object.function != null) {
        if ((object.function & ROTATION_X) != 0) rotationX = rotationX();
        if ((object.function & ROTATION_Y) != 0) rotationY = rotationY();
        if ((object.function & ROTATION_Z) != 0) rotationZ = rotationZ();

        if ((object.function & TRANSLATE) != 0) translate = translate();
    }

    tempMatrix = m4.multiply(tempMatrix, m4.translation(translate));
    tempMatrix = m4.multiply(tempMatrix, m4.rotationX(radians(rotationX)))
    tempMatrix = m4.multiply(tempMatrix, m4.rotationY(radians(rotationY)));
    tempMatrix = m4.multiply(tempMatrix, m4.rotationZ(radians(rotationZ)));
    tempMatrix = m4.multiply(tempMatrix, m4.scaling(object.scale));
    if (object.color != null) {
        uniforms.u_color = object.color;
    } else {
        uniforms.u_color = DEFAULT_COLOR;
    }


    if (saveMatrix) {
        matrixStack.save(tempMatrix);
    }

    draw(tempMatrix, object.objName);
}

function draw(matrix, objName = 'cube', ) {
    bufferInfo = chooseShape(objName);
    uniforms.u_modelMatrix = matrix;
    uniforms.u_worldInverseMatrix = m4.transpose(m4.inverse(matrix));

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
}

function chooseShape(objName) {
    switch (objName) {
        case 'WalkingGirl':
            return twgl.createBufferInfoFromArrays(gl, obj['obj1']);
        case 'suzanne':
            return twgl.createBufferInfoFromArrays(gl, obj['obj2']);
        case 'cylinder':
            return twgl.primitives.createCylinderBufferInfo(gl, 1, 2, 10, 10);
        case 'sphere':
            return twgl.primitives.createSphereBufferInfo(gl, 1, 20, 20);
        default:
            return twgl.createBufferInfoFromArrays(gl, obj['cube']);
    }
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