import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls";
import GUI from "lil-gui";
import resizeRendererToDisplaySize from "./resizeRendererToDisplaySize";
import {color, lights} from "three/nodes";

const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({antialias: true, canvas})
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

const fov = 45
const aspect = 2
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 10, 15)


const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 5, 0)
controls.update()

{
    const planeSize = 40

    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    texture.colorSpace = THREE.SRGBColorSpace
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -.5
    scene.add(mesh)
}


{
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'})
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
}
{
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'})
    const mesh = new THREE.Mesh(sphereGeo, sphereMat)
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
}


class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object
        this.prop = prop
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`
    }
    set value(hexString) {
        this.object[this.prop].set(hexString)
    }
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name)
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
    folder.open()
}


{
    const color = 0xFFFFFF
    // const skyColor = 0xB1E1FF
    // const groundColor = 0xB97A20

    const intensity = 1
    // const light = new THREE.AmbientLight(color, intensity)
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    // const light = new THREE.DirectionalLight(color, intensity)
    const light = new THREE.PointLight(color, 150)
    light.position.set(0, 10, 0)
    // light.target.position.set(-5, 0, 0)
    scene.add(light)
    // scene.add(light.target)

    // const helper = new THREE.DirectionalLightHelper(light)
    const helper = new THREE.PointLightHelper(light)
    scene.add(helper)

    function updateLight() {
        // light.target.updateMatrixWorld()
        helper.update()
    }

    // updateLight()

    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor')
    // gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor')
    gui.add(light, 'intensity', 0, 250, 1)
    gui.add(light, 'distance', 0, 40).onChange(updateLight)
    // gui.add(light.target.position, 'x', -10, 10)
    // gui.add(light.target.position, 'y', -10, 10)
    // gui.add(light.target.position, 'z', 0, 10)

    makeXYZGUI(gui, light.position, 'position')
    // makeXYZGUI(gui, light.target.position, 'target', updateLight)
}

function render() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera)

    requestAnimationFrame(render)
}

requestAnimationFrame(render)

















