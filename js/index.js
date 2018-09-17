var vertexShader = document.getElementById('vertexShader').textContent;
var fragmentShader = document.getElementById('fragmentShader').textContent;
var sphereFragmentShader = document.getElementById('sphereFragmentShader').textContent;

var clock = new THREE.Clock();
var scene = new THREE.Scene();

var wallSize = 2000;

var uniform = {
    time: {
        type: 'f',
        value: 1.0 },

    resolution: {
        type: "v2",
        value: new THREE.Vector2() } };



var objectGroup = new THREE.Group();

var objSize = 20;

var createMesh = function createMesh(radius) {
    var geometry = new THREE.SphereBufferGeometry(radius, 100, 100);

    var material = new THREE.ShaderMaterial({
        uniforms: {
            time: uniform.time,
            resolution: {
                type: "v2",
                value: new THREE.Vector2(radius, radius) } },


        vertexShader: vertexShader,
        fragmentShader: sphereFragmentShader });

    material.side = THREE.DoubleSide;

    return new THREE.Mesh(geometry, material);
};

var createMeshes = function createMeshes(radius, count) {
    for (var i = 0; i < count; i++) {
        var degree = 2 * Math.PI * i / count;
        var mesh = createMesh(objSize);
        var x = radius * Math.cos(degree);
        var y = radius * (Math.random() * 2 - 1);
        var z = radius * Math.sin(degree);

        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
        mesh.rotation.y = Math.random() * 360 * (Math.PI / 180);

        objectGroup.add(mesh);
    }

    return objectGroup;
};

scene.add(createMeshes(wallSize / 6, 48));
scene.add(createMeshes(wallSize / 4, 48));
scene.add(createMeshes(wallSize / 3, 48));

var createWall = function createWall(baseColor) {
    var material = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(wallSize, wallSize, 32, 32),
    new THREE.ShaderMaterial({
        uniforms: {
            time: uniform.time,
            resolution: {
                type: "v2",
                value: new THREE.Vector2(wallSize, wallSize) },

            baseColor: {
                type: "v3",
                value: baseColor } },


        vertexShader: vertexShader,
        fragmentShader: fragmentShader }));


    material.side = THREE.DoubleSide;

    return material;
};

var wallColor = new THREE.Vector3(0.0, 0.5, 0.5);

var floor = createWall(wallColor);
floor.position.y = -wallSize / 2;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

var roof = createWall(wallColor);
roof.position.y = wallSize / 2;
roof.rotation.x = Math.PI / 2;
scene.add(roof);

var wallRear = createWall(wallColor);
wallRear.position.z = -wallSize / 2;
scene.add(wallRear);

var wallRight = createWall(wallColor);
wallRight.position.x = wallSize / 2;
wallRight.rotation.y = -Math.PI / 2;
scene.add(wallRight);

var wallFront = createWall(wallColor);
wallFront.position.z = wallSize / 2;
wallFront.rotation.y = Math.PI;
scene.add(wallFront);

var wallLeft = createWall(wallColor);
wallLeft.position.x = -wallSize / 2;
wallLeft.rotation.y = Math.PI / 2;
scene.add(wallLeft);

// Camera
var fov = 45;
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(fov, aspect, 1, 9000);
var lookAt = new THREE.Vector3(0, 0, 0);
camera.position.set(0, 0, 0);
camera.lookAt(lookAt);

var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

var render = function render(t) {
    var delta = clock.getDelta();
    var time = clock.elapsedTime;

    uniform.time.value = time;

    var len = objectGroup.children.length;
    for (var i = 0; i < len; i++) {
        var object = objectGroup.children[i];
        if (object.type !== "Mesh") {
            continue;
        }
        object.rotation.x += delta * 4;
    }

    lookAt.x = Math.sin(time * 30 * (Math.PI / 180));
    lookAt.y = Math.sin(time * 30 * (Math.PI / 180));
    lookAt.z = Math.cos(time * 20 * (Math.PI / 180));
    camera.lookAt(lookAt);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
};

onResize();
render();

window.addEventListener("resize", onResize);

function onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
}
