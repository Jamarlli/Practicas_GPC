// Practica 4 - Interacción y Animación

// Variables globales
var renderer, scene, camera;
var cameraControls;
var clock = new THREE.Clock(); 

// Variables de la escena y el robot
var robot, brazo, antebrazo, pinza, dedoIz, dedoDe;
var allMaterials = []; 
var keyboardState = {}; 

// Variables de la GUI
var controls;
var gui;

// 1-inicializa
init();
// 2-Crea una escena
loadScene();
// 3-Configura la GUI
setupGui();
// 4-renderiza
render();

// Para el modlo alambre
function createMaterial(params)
{
    let mat = new THREE.MeshBasicMaterial(params);
    allMaterials.push(mat);
    return mat;
}

function init()
{
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0xFFFFFF) );
    document.getElementById('container').appendChild( renderer.domElement );

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 10000 );
    camera.position.set( 300, 300, 300 ); // Posición de cámara actualizada para ver mejor

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 80, 0 ); // Apunta al centro del robot

    window.addEventListener('resize', updateAspectRatio );
    
    // Listener para el teclado
    window.addEventListener('keydown', e => { keyboardState[e.key] = true; });
    window.addEventListener('keyup', e => { keyboardState[e.key] = false; });
}

function loadScene()
{
  // SUELO
    let suelo = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), 
                                createMaterial({ color: 0xFFE59E, side: THREE.DoubleSide }));
    suelo.rotation.x = Math.PI / 2;
    scene.add(suelo); // Descomentado

    // ROBOT (ahora usa la variable global)
    robot = new THREE.Object3D();

    // BASE
    let base = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 15, 32),
                              createMaterial({ color: 0xFF5733, wireframe: false })); // Naranja
    base.position.y = 7.5; // para que esté a ras del suelo
    robot.add(base);

    // BRAZO (ahora usa la variable global)
    brazo = new THREE.Object3D();

    // EJE
    let eje = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 18, 32),
                              createMaterial({ color: 0x3333FF, wireframe: false })); // Azul
    eje.position.y = 7.5
    eje.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
    brazo.add(eje);

    // ESPARRAGO
    let esparrago = new THREE.Mesh(new THREE.BoxGeometry(18, 120, 12),
                            createMaterial({ color: 0x33FF57, wireframe: false })); // Verde
    esparrago.position.y = 60; //la mitad de 120
    brazo.add(esparrago);

    // ROTULA
    let rotula = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 32),
                            createMaterial({ color: 0x33FFFF, wireframe: false })); // Cyan
    rotula.position.y = 120; // arriba del esparrago
    brazo.add(rotula);

    robot.add(brazo);

    // ANTEBRAZO (ahora usa la variable global)
    antebrazo = new THREE.Object3D();
    antebrazo.position.y = 120; // en la rotula

    // DISCO
    let disco = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 32),
                              createMaterial({ color: 0xeb5be8, wireframe: false })); // Rosa
    antebrazo.add(disco);

    // NERVIOS
    for (let i=0; i<4; i++) {
        let nervio = new THREE.Mesh(new THREE.BoxGeometry(4, 80, 4),
                            createMaterial({ color: 0xed750c, wireframe: false })); // Naranja oscuro
        nervio.position.y = 40; // la mitad de 80
        nervio.position.x = 10 * Math.cos(i*Math.PI/2);
        nervio.position.z = 10 * Math.sin(i*Math.PI/2);
        antebrazo.add(nervio);
    }

    // MANO
    let mano = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 40, 32),
                            createMaterial({ color: 0xe8e85b, wireframe: false })); // Amarillo
    mano.position.y = 80; // arriba de los nervios
    mano.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
    antebrazo.add(mano);

    // PINZA (ahora usa la variable global)
    pinza= new THREE.Object3D();
    pinza.position.y = 80; // arriba de los nervios
    pinza.position.x = 20; // al final de la mano
    pinza.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2);

    for (let i=-1; i<=1; i+=2) {
        let dedo = new THREE.Object3D();
        dedo.position.x = i*10;
        
        let falange1 = new THREE.Mesh(new THREE.BoxGeometry(4, 20, 19),
                            createMaterial({ color: 0x8c8c8c, wireframe: false })); // Gris
        dedo.add(falange1);
        
        let geom_falange2 = new THREE.BufferGeometry();
        let vertices = new Float32Array( [
            -2, 10, 0,//1
            -2, -10, 0,//2
            0, 8, 19, //5

            -2, 10, 0,//1
            0, 8, 19,//5
            2, 10, 0,//4

            2, 10, 0,//4
            0, 8, 19,//5
            2,8,19,//8

            2, -10, 0,//3
            2, 10, 0,//4
            2,8,19,//8

            -2, -10, 0,//2
            0, -8, 19,//6
            0, 8, 19,//5

            2, -10, 0,//3
            2,8,19,//8
            2,-8,19,//7

            2, -10, 0,//3
            0, -8, 19,//6
            -2, -10, 0,//2

            2, -10, 0,//3
            2, -8, 19,//7
            0, -8, 19,//6

            0, 8, 19,//5
            0, -8, 19,//6
            2,8,19,//8

            2,8,19,//8
            0, -8, 19,//6
            2,-8,19,//7
        ] );

        let vertices2 = new Float32Array( [
            -2, 10, 0,//1
            -2, -10, 0,//2
            -2, 8, 19, //5

            -2, 10, 0,//1
            -2, 8, 19,//5
            2, 10, 0,//4

            2, 10, 0,//4
            -2, 8, 19,//5
            0,8,19,//8

            2, -10, 0,//3
            2, 10, 0,//4
            0,8,19,//8

            -2, -10, 0,//2
            -2, -8, 19,//6
            -2, 8, 19,//5

            2, -10, 0,//3
            0,8,19,//8
            0,-8,19,//7

            2, -10, 0,//3
            -2, -8, 19,//6
            -2, -10, 0,//2
            
            2, -10, 0,//3
            0, -8, 19,//7
            -2, -8, 19,//6

            -2, 8, 19,//5
            -2, -8, 19,//6
            0, 8, 19,//8

            0,8,19,//8
            -2, -8, 19,//6
            0,-8,19,//7
        ] );

        if (i==1){
            vertices = vertices2;
        }

        geom_falange2.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geom_falange2.computeVertexNormals(); // Añadido para iluminación futura
        
        let falange2 = new THREE.Mesh(geom_falange2,
                            createMaterial({ color: 0xFF00FF, wireframe: false })); // Magenta
        falange2.position.z = 19/2;
        dedo.add(falange2);

        pinza.add(dedo);

        if (i === -1) {
            dedoIz = dedo;
        } else {
            dedoDe = dedo;
        }
    }

    antebrazo.add(pinza);
    
    brazo.add(antebrazo); 
    
    scene.add(robot);
}

function setupGui()
{
    controls = {
        giroBase: 0,
        giroBrazo: 0,
        giroAntebrazoY: 0,
        giroAntebrazoZ: 0,
        giroPinza: 0,
        separacionPinza: 10,
        alambres: false,
        anima: function() { startAnimation(); }
    };

    // Crea la GUI
    gui = new lil.GUI();
    gui.title("Control Robot");

    // controles
    gui.add(controls, 'giroBase', -180, 180).name('Giro Base'); // [cite: 13]
    gui.add(controls, 'giroBrazo', -45, 45).name('Giro Brazo'); // [cite: 14]
    gui.add(controls, 'giroAntebrazoY', -180, 180).name('Giro Antebrazo Y'); // [cite: 15]
    gui.add(controls, 'giroAntebrazoZ', -90, 90).name('Giro Antebrazo Z'); // [cite: 15]
    gui.add(controls, 'giroPinza', -40, 220).name('Giro Pinza'); // [cite: 16]
    gui.add(controls, 'separacionPinza', 0, 15).name('Separacion Pinza'); // [cite: 17]
    
    // Checkbox alambres
    gui.add(controls, 'alambres').name('Alambres').onChange(value => {
        allMaterials.forEach(mat => {
            mat.wireframe = value;
        });
    });

    // Botón animar
    gui.add(controls, 'anima').name('Animar');
}

function startAnimation()
{
    // Reinicia los sliders por si acaso
    gui.controllers.forEach(c => c.setValue(c.initialValue));

    let tweenA = new TWEEN.Tween(controls)
        .to({
            giroBase: 90,
            giroBrazo: 30,
            giroAntebrazoY: -45,
            giroAntebrazoZ: 20,
            giroPinza: 45,
            separacionPinza: 15
        }, 3000) // 3 segundos
        .easing(TWEEN.Easing.Quadratic.InOut);

    let tweenB = new TWEEN.Tween(controls)
        .to({
            giroBase: -90,
            giroBrazo: -30,
            giroAntebrazoY: 45,
            giroAntebrazoZ: -20,
            giroPinza: 0,
            separacionPinza: 5
        }, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    let tweenC = new TWEEN.Tween(controls)
        .to({
            giroBase: 0,
            giroBrazo: 0,
            giroAntebrazoY: 0,
            giroAntebrazoZ: 0,
            giroPinza: 0,
            separacionPinza: 10
        }, 1500) // 1.5 segundos
        .easing(TWEEN.Easing.Quadratic.Out);

    tweenA.chain(tweenB);
    tweenB.chain(tweenC);

    tweenA.start();
}


function updateAspectRatio()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function update(delta)
{
    cameraControls.update();

    TWEEN.update();
    
    let speed = 100; 
    if (keyboardState['ArrowUp']) {
        robot.position.z -= speed * delta;
        robot.rotation.y = Math.PI; 
    }
    if (keyboardState['ArrowDown']) {
        robot.position.z += speed * delta;
        robot.rotation.y = 0; 
    }
    if (keyboardState['ArrowLeft']) {
        robot.position.x -= speed * delta;
        robot.rotation.y = -Math.PI / 2;
    }
    if (keyboardState['ArrowRight']) {
        robot.position.x += speed * delta;
        robot.rotation.y = Math.PI / 2; 
    }


    robot.rotation.y = THREE.MathUtils.degToRad(controls.giroBase);
    brazo.rotation.z = THREE.MathUtils.degToRad(controls.giroBrazo);
    antebrazo.rotation.y = THREE.MathUtils.degToRad(controls.giroAntebrazoY);
    antebrazo.rotation.z = THREE.MathUtils.degToRad(controls.giroAntebrazoZ);
    pinza.rotation.z = THREE.MathUtils.degToRad(controls.giroPinza);
    
    dedoIz.position.x = -controls.separacionPinza;
    dedoDe.position.x = controls.separacionPinza;

    if (gui) {
        if (typeof gui.controllersRecursive === 'function') {
            gui.controllersRecursive().forEach(c => { if (typeof c.updateDisplay === 'function') c.updateDisplay(); });
        } else if (Array.isArray(gui.controllers)) {
            gui.controllers.forEach(c => { if (typeof c.updateDisplay === 'function') c.updateDisplay(); });
        }
    }
}


function render()
{
    requestAnimationFrame( render );
    
    let delta = clock.getDelta();
    update(delta);
    
    renderer.render( scene, camera );
}