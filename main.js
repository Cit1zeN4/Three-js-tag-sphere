var sphereControlState = 0;

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
    { label: "text1", vector: null },
    { label: "text2", vector: null },
    { label: "text3", vector: null },
    { label: "text4", vector: null },
    { label: "text5", vector: null },
    { label: "text6", vector: null },
    { label: "text7", vector: null },
    { label: "text8", vector: null },
    { label: "text9", vector: null },
    { label: "text10", vector: null },
    { label: "text11", vector: null },
    { label: "text12", vector: null },
    { label: "text13", vector: null }
];

var label = document.getElementById("label");
camera.position.z = 30;

function LabelBehindSphere(opacity, fontSize) {
    if (opacity < 0 && fontSize < 0) {
        opacity = 0;
        fontSize = 0;
    }
    if (opacity > 1 && fontSize > 1) {
        opacity = 1;
        fontSize = 1;
    }

    var cameraFrom = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

    for (var i = 0; i < labels.length; i++) {
        var label = $('.label, [id = ' + i + ']');
        var distanceToSpher = cameraFrom.distanceTo(sphere.position).toFixed(2);
        var distanceToLabel = cameraFrom.distanceTo(labels[i].vector).toFixed(2);

        if (distanceToSpher - distanceToLabel < 0) {
            var factor = (1 / (distanceToSpher - distanceToLabel)).toFixed(2) * -1;
            var fontSizeFactor = factor + fontSize;
            factor += opacity;
            if (factor > 0 && factor <= 1) {
                label[i].style.opacity = factor;
            }
            if (fontSizeFactor > 0 && fontSizeFactor <= 1) {
                label[i].style.transform = 'scale(' + fontSizeFactor + ')';
                console.log(fontSizeFactor);
            }
        }
        else {
            label[i].style.opacity = 1;
            label[i].style.transform = 'scale(1)';
        }
    }
}

function animate() {
    TWEEN.update();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function createLabels(parent) {
    for (var i = 0; i < labels.length; i++) {
        var domParent = $(parent);
        domParent.append('<div class="label" id=' + i + '>' + labels[i].label + '</div>');
    }
}
//This @param create something figure that consist of our object
//for example 2 - this is spirals
//you can change this factor in range from 0.1 to 19.0
//and it's for minus
//for plus you can add value in range from 0.1 to from 0.6 
//and get various figure
function addLabelOnSphere(location_factor) {
    var verts = sphere.geometry.vertices;
    var param = (verts.length / labels.length) + location_factor;

    for (var i = 0; i < labels.length; i++) {
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
    for (var i = 0; i < labels.length; i++) {
        var pos = getScreenPosition(labels[i].vector);
        var label = $('.label, [id = ' + i + ']');
        label[i].style.left = pos.x + 'px';
        label[i].style.top = pos.y + 'px';
    }
    LabelBehindSphere(0.28, 0.5);
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
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(sphere.position);
        })
        .onComplete(function () {
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
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(sphere.position);
        })
        .onComplete(function () {
            camera.lookAt(sphere.position);
        });

    var zoomOutTo = {
        x: zoomInTo.x * factor,
        y: zoomInTo.y * factor,
        z: zoomInTo.z * factor
    };

    var tweenZoomOut = new TWEEN.Tween(zoomInTo)
        .to(zoomOutTo, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(sphere.position);
        })
        .onComplete(function () {
            camera.lookAt(sphere.position);
        });
        
    tween.chain(tweenZoomIn);
    tweenZoomIn.chain(tweenZoomOut);
    tweenZoomIn.delay(20);
    tweenZoomOut.delay(500);
    tween.start();
};

$(document).ready(function () {
    updateLabel();
    $('.label').click(function () {
        switch (sphereControlState) {
            case 0:
                centreCameraOnLabel(3, this.id);
                sphereControlState = 1;
                break;
            case 1:
                centreCameraOnLabel(3, this.id);
                sphereControlState = 2;
                break;
            case 2:
                centreCameraOnLabel(3, this.id);
                sphereControlState = 3;
                break;
            default:
                alert('default value');
                break;
        }
    });
});

createLabels('body');
addLabelOnSphere(0.4);

animate();
