import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'



// 创建一个场景
var scene = new THREE.Scene();

// 创建一个相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()


// 创建一个材质
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});

// 创建一个立方体几何形状
var size = 1;
var thickness = 0.25;

// 

// 创建一个立方体剖面
function createCubeFace(x, y, width, height) {
    var shape = new THREE.Shape();
    shape.moveTo(x, y);
    shape.lineTo(x + width, y);
    shape.lineTo(x + width, y + height);
    shape.lineTo(x, y + height);
    shape.lineTo(x, y);
    return shape;
}

// 创建一个挖空的立方体剖面
function createEmptyFace(x, y, width, height) {
    var shape = createCubeFace(x, y, width, height);
    var hole = createCubeFace(x + thickness, y + thickness, width - 2 * thickness, height - 2 * thickness);
    shape.holes.push(hole);
    return shape;
}

// 创建挖空立方体的六个面
var frontFace = createEmptyFace(0, 0, size, size);
var backFace = createEmptyFace(0, 0, size, size);
var topFace = createEmptyFace(0, 0, size, size);
var bottomFace = createEmptyFace(0, 0, size, size);
var leftFace = createEmptyFace(0, 0, size, size);
var rightFace = createEmptyFace(0, 0, size, size);

// 创建挖空立方体的六个平面几何
var frontGeometry = new THREE.ShapeGeometry(frontFace);
var backGeometry = new THREE.ShapeGeometry(backFace);
var topGeometry = new THREE.ShapeGeometry(topFace);
var bottomGeometry = new THREE.ShapeGeometry(bottomFace);
var leftGeometry = new THREE.ShapeGeometry(leftFace);
var rightGeometry = new THREE.ShapeGeometry(rightFace);

// 创建挖空立方体的六个平面网格
var front = new THREE.Mesh(frontGeometry, material);
var back = new THREE.Mesh(backGeometry, material);
var top = new THREE.Mesh(topGeometry, material);
var bottom = new THREE.Mesh(bottomGeometry, material);
var left = new THREE.Mesh(leftGeometry, material);
var right = new THREE.Mesh(rightGeometry, material);

// 旋转和平移六个面，使它们组合成一个挖空的立方体
front.position.z = size / 2;

back.rotation.y = Math.PI;
back.position.z = -size / 2;

top.rotation.x = Math.PI / 2;
top.position.y = size / 2;

bottom.rotation.x = -Math.PI / 2;
bottom.position.y = -size / 2;

left.rotation.y = -Math.PI / 2;
left.position.x = -size / 2;

right.rotation.y = Math.PI / 2;
right.position.x = size / 2;

// 将六个面添加到场景中
scene.add(front);
// scene.add(back);
// scene.add(top);
// scene.add(bottom);
// scene.add(left);
// scene.add(right);

console.log(front);

const extrudeSettings = {
	steps: 2,
	depth: 6,
	bevelEnabled: true,
	bevelThickness: 1,
	bevelSize: 0,
	bevelOffset: 0,
	bevelSegments: 1
};
const geometry = new THREE.ExtrudeGeometry( frontFace, extrudeSettings );
const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true} );
const mesh = new THREE.Mesh( geometry, material1 ) ;
scene.add( mesh );




const array = [new THREE.Vector3(1789.0002441406252, 0, -1371.9996943086546)]
const p = new THREE.Vector3(1789.0002441406252, 0, -1371.9996943086546)



let index = -1;
for (let i = 0; i < array.length; i++) {
    if (array[i].equals(p)) {
        index = i;
        break;
    }
}


function pointIdex(array, p) {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i].equals(p)) {
            index = i;
            break;
        }
    }
    return index
}
console.log('pppppp',pointIdex(array, p));




const cube = new THREE.Mesh(
    new THREE.BoxGeometry(10,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
scene.add(cube)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
cube1.name = 'cube'
const cube2 = cube1.clone()
const cube3 = cube1.clone()

cube1.add(cube2, cube3)

const a = cube1.getObjectsByProperty('name', 'cube')
console.log(a,1111);






// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
