// Practica 2 - Modelado jerárquico de un robot

// Variables globales que van siempre
var renderer, scene, camera;
var cameraControls;
var angulo = -0.01;

// 1-inicializa
init();
// 2-Crea una escena
loadScene();
// 3-renderiza
render();

function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 10000 );
  camera.position.set( 1000, 150, 200 );

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );
}


function loadScene()
{
	// SUELO
    let suelo = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0xFFE59E, side: THREE.DoubleSide }));
    suelo.rotation.x = Math.PI / 2;
    //scene.add(suelo);

    // ROBOT
    let robot = new THREE.Object3D();

    // BASE
    let base = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 15, 32),
                              new THREE.MeshBasicMaterial({ color: 0xFF5733 , transparent: true, opacity: 0.5 })); // Naranja
    base.position.y = 7.5; // para que esté a ras del suelo
    robot.add(base);


    // BRAZO
    let brazo = new THREE.Object3D();

    // EJE
    let eje = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 18, 32),
                              new THREE.MeshBasicMaterial({ color: 0x3333FF, transparent: true, opacity: 0.5 })); // Verde
    eje.position.y = 7.5
    eje.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
    brazo.add(eje);

    // ESPARRAGO
    let esparrago = new THREE.Mesh(new THREE.BoxGeometry(18, 120, 12),
                            new THREE.MeshBasicMaterial({ color: 0x33FF57, transparent: true, opacity: 0.5 })); // Verde
    esparrago.position.y = 60; //la mitad de 120
    brazo.add(esparrago);

    // ROTULA
    let rotula = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 32),
                            new THREE.MeshBasicMaterial({ color: 0x33FFFF, transparent: true, opacity: 0.5 }));
    rotula.position.y = 120; // arriba del esparrago
    brazo.add(rotula);


    robot.add(brazo);


    // ANTEBRAZO
    let antebrazo = new THREE.Object3D();
    antebrazo.position.y = 120; // en la rotula

    // DISCO
    let disco = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 32),
                              new THREE.MeshBasicMaterial({ color: 0xeb5be8, transparent: true, opacity: 0.5 })); // Verde
    antebrazo.add(disco);

    // NERVIOS
    for (let i=0; i<4; i++) {
        let nervio = new THREE.Mesh(new THREE.BoxGeometry(4, 80, 4),
                            new THREE.MeshBasicMaterial({ color: 0xed750c, transparent: true, opacity: 0.5 }));
        nervio.position.y = 40; // la mitad de 80
        nervio.position.x = 10 * Math.cos(i*Math.PI/2);
        nervio.position.z = 10 * Math.sin(i*Math.PI/2);
        antebrazo.add(nervio);
    }

    // MANO
    let mano = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 40, 32),
                            new THREE.MeshBasicMaterial({ color: 0xe8e85b, transparent: true, opacity: 0.5 }));
    mano.position.y = 80; // arriba de los nervios
    mano.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
    antebrazo.add(mano);


    // PINZA
    let pinza= new THREE.Object3D();
    pinza.position.y = 80; // arriba de los nervios
    pinza.position.x = 20; // al final de la mano
    pinza.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2);

    for (let i=-1; i<=1; i+=2) {
        let dedo = new THREE.Object3D();
        dedo.position.x = i*10;
        falange1 = new THREE.Mesh(new THREE.BoxGeometry(4, 20, 19),
                            new THREE.MeshBasicMaterial({ color: 0x8c8c8c, transparent: false, opacity: 0.5 }));
        dedo.add(falange1);
        geom_falange2 = new THREE.BufferGeometry();
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

// --- TRIÁNGULO 8 CORREGIDO ---
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
            0, -8, 19,//6
            -2, 8, 19,//5

            2, -10, 0,//3
            0,8,19,//8
            0,-8,19,//7

// --- TRIÁNGULO 7 CORREGIDO ---
            2, -10, 0,//3
            -2, -8, 19,//6
            -2, -10, 0,//2
            
            // --- TRIÁNGULO 8 CORREGIDO ---
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
        falange2 = new THREE.Mesh(geom_falange2,
                            new THREE.MeshBasicMaterial({ color: 0xFF00FF, transparent: false, opacity: 0.5 }));
        falange2.position.z = 19/2;

        dedo.add(falange2);

        pinza.add(dedo);
    }

    antebrazo.add(pinza);
    robot.add(antebrazo);
    scene.add(robot);
  }


function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}


//Practica 4 - Movimiento del robot