var scene = new THREE.Scene();
var w = window.innerWidth, h = window.innerHeight;
var camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2;
controls.noPan = true;
controls.addEventListener("change", updateLabel);

var geometry = new THREE.SphereGeometry(9, 12, 12);
var material = new THREE.MeshBasicMaterial({ color: 0x3d3d3d });
var depthMaterial = new THREE.MeshDepthMaterial();
var sphere = new THREE.Mesh(geometry, wireframe);
var wireframe = new THREE.WireframeGeometry(geometry);

var line = new THREE.LineSegments(wireframe, material);
scene.add(line);

var materialArray = [];
var texture_front = new THREE.TextureLoader().load('https://i.ibb.co/VVVpHn5/Just-Snow-20190722-235955.jpg');
var texture_back = new THREE.TextureLoader().load('https://i.ibb.co/VVVpHn5/Just-Snow-20190722-235955.jpg');
var texture_top = new THREE.TextureLoader().load('https://i.ibb.co/VVVpHn5/Just-Snow-20190722-235955.jpg');
var texture_bottom = new THREE.TextureLoader().load('https://i.ibb.co/VVVpHn5/Just-Snow-20190722-235955.jpg');
var texture_right = new THREE.TextureLoader().load('https://i.ibb.co/VVVpHn5/Just-Snow-20190722-235955.jpg');
var texture_left = new THREE.TextureLoader().load('https://i.ibb.co/VVVpHn5/Just-Snow-20190722-235955.jpg');

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_front }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_back }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_top }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bottom }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_right }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_left }));

for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

var skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
var skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

var label = document.getElementById("label");

camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function getScreenPosition(position) {
    var vector = new THREE.Vector3(position.x, position.y, position.z);

    vector.project(camera);

    vector.x = Math.round((vector.x + 1) * w / 2);
    vector.y = Math.round((- vector.y + 1) * h / 2);

    return vector;
}

function updateLabel() {
    var verts = sphere.geometry.vertices;
    var pos = getScreenPosition(verts[70]);

    label.style.left = pos.x + "px";
    label.style.top = pos.y + "px";
}

animate();
