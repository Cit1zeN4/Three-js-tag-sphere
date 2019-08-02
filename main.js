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

var label = document.getElementById("label");
camera.position.z = 30;

function animate() {
    TWEEN.update();
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

//binding object with vector
//134 vectors
function updateLabel() {
    var verts = sphere.geometry.vertices;

    //This is stay here on not a specific time
    var pos = getScreenPosition(verts[testing_vector]);

    label.style.left = pos.x + "px";
    label.style.top = pos.y + "px";

    /*for(var i = 0;i < verts.length;i++){
      var pos = getScreenPosition(verts[i]);
      if(ObjectOnSphere[i]!==null){
        ObjectOnSphere[i].style.left = pos.x + "px";
        ObjectOnSphere[i].style.top = pos.y + "px";
      }
    }
    */
}

function centreCameraOnLabel(factor) {
    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    var to = {
        x: sphere.geometry.vertices[testing_vector].x * factor,
        y: sphere.geometry.vertices[testing_vector].y * factor,
        z: sphere.geometry.vertices[testing_vector].z * factor
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
    $('#label').click(function () {
        centreCameraOnLabel(3);
    });
});

animate();
