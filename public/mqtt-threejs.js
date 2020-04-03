let three_view = document.getElementById('three_view');

let renderer = new THREE.WebGLRenderer();
let scene = new THREE.Scene();

let width = window.innerWidth;
let height = window.innerHeight;
let view_angle = 45;
let near = 0.1;
let far = 1000;

let camera = new THREE.PerspectiveCamera(view_angle, width/height, near, far);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(scene.position);

renderer.setSize(width, height);
three_view.appendChild(renderer.domElement);

//plane
{
    let geometry = new THREE.PlaneBufferGeometry(40,40);
    let material = new THREE.MeshPhongMaterial({
        color: 0xAAAAAA,
        specular: 0x101010
    })
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1;
    scene.add(mesh);
}



//test cube
{
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    let mesh = new THREE.Mesh(geometry, material);
    //nayta laatikko
    //scene.add(mesh);
}


//valoa
let light = new THREE.DirectionalLight(0xAAAAAA, 1.5);
light.position.x = 10;
light.position.y = 10;
light.position.z = 10;
//light.lookAt = new THREE.Vector3(0,0,0);
light.lookAt(new THREE.Vector3(0,0,0));
scene.add(light);

scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

scene.background = new THREE.Color(0xFFFFFF);
scene.fog = new THREE.Fog(0xFFFFFF, 3, 30);

//robot geometr
const stl_loader = new THREE.STLLoader();
const load_stl = (url)=>{
    return new Promise((resolve) => {
        stl_loader.load(url, resolve)
    });
};
//stl_loader.load('dfd', (geometry)=>{}
let dark = new THREE.MeshLambertMaterial({
    color: 0x111111
})

let yellow = new THREE.MeshLambertMaterial({
    color: 0xFFFF00
})
let blue = new THREE.MeshLambertMaterial({
    color: 0x0000FF
})

let joints = [];
const load_geometries = async ()=>{
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/BASE.stl');
        //les mesh = new THREE.Mesh(geometry, dark);
        joints.push(new THREE.Mesh(geometry, blue));
        //mesh.geometry.scale(0.001,0.001,0.001);
        joints[0].geometry.scale(0.001,0.001,0.001);
        //scene.add(joints[0]);
    }

    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J1-1.stl');
        let geometry2 = await load_stl('./FANUC_R2000iA165F-STL/J1-2.stl');
        geometry.merge(geometry2);
        //les mesh = new THREE.Mesh(geometry, dark);
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[1].geometry.scale(0.001,0.001,0.001);
        //scene.add(joints[1]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J2.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[2].geometry.scale(0.001,0.001,0.001);
        //scene.add(joints[2]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J3.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[3].geometry.scale(0.001,0.001,0.001);
        //scene.add(joints[3]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J4.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[4].geometry.scale(0.001,0.001,0.001);
        //scene.add(joints[4]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J5.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[5].geometry.scale(0.001,0.001,0.001);
        //scene.add(joints[5]);
    }

};

let offsets = [];
//jos osa liikkuu, muut nivelet mukana
load_geometries().then(() =>{

    //solid edge 2020:lla voi kattoa robotin osia *.asm...
    //[0,282,0]
    //[312,670,-117]
    //[268.69,1744.13,-196.85]
    //[1315.19,1969.13,0.15]
    //[1548.69,1969.13,87.15]
    //[1763.69,1969.13,20.47]
    //move parts to origin
    
    //mitatun arvon verran siirto
    joints[1].geometry.translate(0, -0.282, 0);
    joints[2].geometry.translate(-0.312, -0.670, 0.117);
    joints[3].geometry.translate(-0.26869, -1.74413, 0.19865);
    joints[4].geometry.translate(-1.31519, -1.96913, -0.00015);
    joints[5].geometry.translate(-1.54869, -1.96913, -0.08715);
    //joints[6].geometry.translate(-0.26869, -1.74413, -0.08715);

    scene.add(joints[0]);
    joints[0].rotation.set(THREE.Math.degToRad(90), 0, 0);

    offsets.push(new THREE.Group());
    offsets[0].position.set(0, 0.282, 0);
    joints[0].add(offsets[0]);
    offsets[0].add(joints[1]);
    
    offsets.push(new THREE.Group());
    offsets[1].position.set(0.312, 0.388, -0.117);
    joints[1].add(offsets[1]);
    offsets[1].add(joints[2]);
    //kokeile asentoa
    //joints[2].rotation.set(0, 0, THREE.Math.degToRad(45));

    offsets.push(new THREE.Group());
    offsets[2].position.set(-0.04331, 1.07413, -0.07985);
    joints[2].add(offsets[2]);
    offsets[2].add(joints[3]);
    
    //rakenna robotti kotona loppuun...
    offsets.push(new THREE.Group());
    offsets[3].position.set(1.0465, 0.225, 0.197);
    joints[3].add(offsets[3]);
    offsets[3].add(joints[4]);

    offsets.push(new THREE.Group());
    offsets[4].position.set(0.2335, 0, 0.087);
    joints[4].add(offsets[4]);
    offsets[4].add(joints[5]);
    //kokeile asentoja
    //joints[1].rotation.set(0, THREE.Math.degToRad(45), 0);
});

const orbit_controls = new THREE.OrbitControls(camera, renderer.domElement);
orbit_controls.target = new THREE.Vector3(0,0,0);

const animate = ()=>{
    requestAnimationFrame(animate);
    orbit_controls.update();
    renderer.render(scene, camera);
};
animate();

const resize = () =>{
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.onresize = resize;

//osat stl konvertoitu(stl-loader), fpx:nä
//interpoloi data/liikkeet, saadaan jouheva liike
//robot-factory oltava käynnis, npm start
const mqtt_client = mqtt.connect('wss://mqtt-broker-tt.herokuapp.com');

mqtt_client.on('connect', () => {
    console.log('connected');
    mqtt_client.subscribe('joints');
});

mqtt_client.on('message', (topic, message) => {
    if(joints.length == 6){
        const joint_data = JSON.parse(message);

        joints[1].rotation.set(0, THREE.Math.degToRad(joint_data.joints[0]), 0);
        joints[2].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[1]));
        //joints[3].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[2]));
        joints[3].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[2]) - THREE.Math.degToRad(joint_data.joints[1])); 
        joints[4].rotation.set(THREE.Math.degToRad(joint_data.joints[3]), 0, 0);
        joints[5].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[4]));
        //tulosta arvot console ikkunaan selaimen debug-moodissa(f12)
        console.log(message);
    }

})

//camera setup

