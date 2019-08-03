var testing_vector = 44;

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

var geometry = new THREE.SphereGeometry(9, 25, 25);
var material = new THREE.MeshBasicMaterial({
     color: 0x4d4d4d,
     wireframe: true,
     wireframeLinewidth: 40,
     wireframeLinecap: 'round',
     wireframeLinejoin: 'round',
     shading: THREE.SmoothShading,
     vertexColors: THREE.NoColors, //used if colors on geomtry
     reflectivity: 1,
     refractionRatio: 0.98,
     combine: THREE.MultiplyOperation,
     fog: true,
     aoMap: null,
     aoMapIntensity: 1,
     envMap: null,
     map: null,
     specularMap: null,
     alphaMap: null,
     skinning: true,
     morphTargets: false
   });
var sphere = new THREE.Mesh(geometry, wireframe);
var wireframe = new THREE.WireframeGeometry(geometry);

var line = new THREE.LineSegments(wireframe, material);
scene.add(line);

var materialArray = [];
var texture_front = new THREE.TextureLoader().load('https://i.ibb.co/gvyMv95/loopable-stars-black-empty-space-4k-vjj549yxl-F0000.jpg');
var texture_back = new THREE.TextureLoader().load('https://i.ibb.co/gvyMv95/loopable-stars-black-empty-space-4k-vjj549yxl-F0000.jpg');
var texture_top = new THREE.TextureLoader().load('https://i.ibb.co/gvyMv95/loopable-stars-black-empty-space-4k-vjj549yxl-F0000.jpg');
var texture_bottom = new THREE.TextureLoader().load('https://i.ibb.co/gvyMv95/loopable-stars-black-empty-space-4k-vjj549yxl-F0000.jpg');
var texture_right = new THREE.TextureLoader().load('https://i.ibb.co/gvyMv95/loopable-stars-black-empty-space-4k-vjj549yxl-F0000.jpg');
var texture_left = new THREE.TextureLoader().load('https://i.ibb.co/gvyMv95/loopable-stars-black-empty-space-4k-vjj549yxl-F0000.jpg');

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

var labels = [
    {label: "text1", vector: null},
    {label: "text2", vector: null},
    {label: "text3", vector: null},
    {label: "text4", vector: null}
];

var label = document.getElementById("label");
camera.position.z = 30;

function animate() {
    TWEEN.update();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function createLabels(parent){
    for(var i = 0; i < labels.length; i++){
        var domParent = $(parent);
        domParent.append('<div class="label" id=' + i + '>' + labels[i].label + '</div>');
    }
}

function addLabelOnSphere(){
    var verts = sphere.geometry.vertices;
    var param = verts.length / labels.length;
    for(var i = 0; i < labels.length; i++){
        labels[i].vector = verts[Math.round(i * param)];
    }
}

function getScreenPosition(position) {
    var vector = new THREE.Vector3(position.x, position.y, position.z);

    vector.project(camera);

    vector.x = Math.round((vector.x + 1) * w / 2);
    vector.y = Math.round((- vector.y + 1) * h / 2);

    return vector;
}

function updateLabel() {
    for(var i = 0; i < labels.length; i++){
        var pos = getScreenPosition(labels[i].vector);
        var label = $('.label, [id = ' + i + ']');
        label[i].style.left = pos.x + 'px';
        label[i].style.top = pos.y + 'px';
    }
};

function centreCameraOnLabel(factor, id) {
    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    var to = {
        x: labels[id].vector.x * factor,
        y: labels[id].vector.y * factor,
        z: labels[id].vector.z * factor
    };

    var tween = new TWEEN.Tween(from)
        .to(to, 800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(){
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(sphere.position);
        })
        .onComplete(function(){
            camera.lookAt(sphere.position);
        });

    var zoomInFrom = {
        x: to.x,
        y: to.y,
        z: to.z
    };
    
    var zoomInTo = {
        x: zoomInFrom.x / factor,
        y: zoomInFrom.y / factor,
        z: zoomInFrom.z / factor,
    };
    
    var tweenZoomIn = new TWEEN.Tween(zoomInFrom)
        .to(zoomInTo, 750)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(){
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(sphere.position);
        })
        .onComplete(function(){
            camera.lookAt(sphere.position);
        });

    tween.chain(tweenZoomIn);
    tweenZoomIn.delay(20);
    tween.start();
};

$(document).ready(function () {
    $('.label').click(function () {
        centreCameraOnLabel(3, this.id);
    });
});

createLabels('body');
addLabelOnSphere();

animate();
