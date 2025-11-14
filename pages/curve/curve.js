import * as THREE from 'three';



import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 在场景中使用
const scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 10);

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()



function sampleArcsXZ(arcs, interval) {
const points = [];
let accumulated = 0;
let nextTarget = interval;


for (const arc of arcs) {
const { cx, cy, cz, r, theta0, theta1 } = arc;
const arcLen = Math.abs(theta1 - theta0) * r;


while (nextTarget <= accumulated + arcLen) {
const localDist = nextTarget - accumulated;
const t = localDist / arcLen; // 0~1
const theta = theta0 + (theta1 - theta0) * t;


// XZ 平面的圆弧
const x = cx + r * Math.cos(theta);
const z = cz + r * Math.sin(theta);
const y = cy; // 平面固定高度


points.push(new THREE.Vector3(x, y, z));
nextTarget += interval;
}


accumulated += arcLen;
}


return points;
}


// =================== 示例使用 ===================
// 定义弧线段
const arcs = [
{
cx: 0,
cy: 0,
cz: 0,
r: 2,
theta0: 0,
theta1: Math.PI / 2
},
{
cx: 4,
cy: 0,
cz: 0,
r: 2,
theta0: Math.PI,
theta1: Math.PI * 1.5
}
];


// 采样点
const interval = 0.2;
const sampledPoints = sampleArcsXZ(arcs, interval);

sampledPoints.forEach(p => {
    scene.add(createDot(p))
});


// 转换成 Three.js Line
const geometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(geometry, material);
scene.add(line);;


export function createDot(v, color= 0xff0000, name = 'dot', size = 10) {
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute([v.x, v.y, v.z], 3));

    const pointsMaterial = new THREE.PointsMaterial({
        color: color,  // 红色
        size: size, // 点的大小
        sizeAttenuation: false
    });

    const point = new THREE.Points(pointsGeometry, pointsMaterial);
    point.name = name;
    point.layers.enable(1)
    // 添加到场景
    return point
}


// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();