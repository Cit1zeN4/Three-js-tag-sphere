var camera;
var controls;
var scene;
var torus;
var light;
var renderer;
var w = window.innerWidth;
var h = window.innerHeight;

init();
animate();

function init() {
    //camera
    camera = new THREE.PerspectiveCamera(45, w / h, 1, 5000);
    camera.position.set(0, 200, -500);

    //controls
    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    //Scene
    scene = new THREE.Scene();

    // Helpers
    axes = new THREE.AxisHelper(50);
    helper = new THREE.GridHelper(1000, 10);
    helper.setColors(0x0000ff, 0x808080);
    scene.add(axes);
    scene.add(helper);

    // Torus Geometry
    torus = new THREE.Mesh(new THREE.TorusGeometry(120, 60, 40, 40),
    new THREE.MeshNormalMaterial());
    torus.position.set(0, 0, 0);
    scene.add(torus);

    //Hemisphere Light
    light = new THREE.HemisphereLight(0xffbf67, 0x15c6ff);
    scene.add(light);

    //WebGL Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    //renderer.setClearColor(0xffffff, 1)
    renderer.setSize(w, h);
    $('.webgl').append(renderer.domElement);

    var posX = camera.position.x - 100;
    var posY = camera.position.y - 100;
    var posZ = camera.position.z - 100;


    $('.click').click(function () {
        var from = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var to = {
            x: posX,
            y: posY,
            z: posZ
        };
        var tween = new TWEEN.Tween(from)
            .to(to, 600)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .onComplete(function () {
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .start();
    });
}


function animate() {
    TzWEEN.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}