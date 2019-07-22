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
var texture_front = new THREE.TextureLoader().load('https://psv4.userapi.com/c848136/u167511629/docs/d12/ba7c5a630ebb/kenon_star_ft.jpg?extra=NrGNbVqZ5C4WqVbPF5sVjjd8csJjJW6lRPv8xxGXoiWptzbiD5JE2ARL2YSOBs8a4Vlt42FQPCEmqh6qvFLivM1uq2N5RyqTqkniwPB6928uRzFVoSV2Du0uN8nVllAHf2JEWhuwghJf7MDC4M9IvRM');
var texture_back = new THREE.TextureLoader().load('https://psv4.userapi.com/c848136/u167511629/docs/d12/61ba2bfb2c8b/kenon_star_bk.jpg?extra=U5taGdpaZ9CjDYp9oVb41h_wdslYMTnxoiLqPb7A3w-gzWf6F7w8F3TC_ZSa6jN1Gph2VMbUXxM9AZa_gviNRAhDqV-HnvPhqhRUj-lKPYEdexNc4SLi8Suwv5YBQDFmX2jLBAY_2dFBCywS8wFYKU4');
var texture_top = new THREE.TextureLoader().load('https://psv4.userapi.com/c848136/u167511629/docs/d18/304f54f274f2/kenon_star_up.jpg?extra=RfcJJDx3quyBWxMTmkHe8svDEJwRw_4xMIHhZvwKyRmcetn3ifK7sQjpqb0nsl664XJXTYo02V_6d7cJK151dp60A2TWMnKLpVdClUWOk8zrEs3lXvPSM8OLX8-gnllZsFqnwbnVE4R5DDnPsZsbY1I');
var texture_bottom = new THREE.TextureLoader().load('https://psv4.userapi.com/c848136/u167511629/docs/d4/51f57dcd936c/kenon_star_dn.jpg?extra=IuVqfTAc_-m0X4vbBM7tmKB1IV29UH02Q_iqIC9StnK8wrmPANp_IXaEt5ueZ0kxk9E4_VD94WZ6qceC5F1aggQ_xWFsfEmSWyllnPRPWznkNoQ5GYdiYN8qYit5flD0-W8xQC4gWA22jMt3O4ekdX8');
var texture_right = new THREE.TextureLoader().load('https://psv4.userapi.com/c848136/u167511629/docs/d3/07550acd5701/kenon_star_rt.jpg?extra=NI0djVeW0NUIg_Nxw4ry40MYqZfDAvr2-C4vAFkKvVmUxxDe68GueeorEMplz3l7UEfAkHWKpu60JMR3j1HlZ9naXq37qVz77ohOil7v4Ao4w7oAmWa9IhXPmbfbahHZGCh5nNDq5LKIeje7yKQ1Ckg');
var texture_left = new THREE.TextureLoader().load('https://psv4.userapi.com/c848136/u167511629/docs/d7/e9edf72dfc0b/kenon_star_lf.jpg?extra=H429aScrs0tZ4wBXS0oCwacsB-_K1h6ZUHOcPkkCxqcHgvyw5EscHm6EW8KhNai5Y3qoCC9mFaP8VTcMRARZLEPzovYfDFSL80bqfxpCIAqCE7TBmigZ-ufd4GzHeBzxA6YAa96cZc0LgW2oHndHEtA');

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
