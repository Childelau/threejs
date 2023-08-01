import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import GUI from "lil-gui";
import resizeRendererToDisplaySize from "./resizeRendererToDisplaySize";
import {element} from "three/nodes";


const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({antialias: true, canvas})

// camera
const fov = 45
const aspect = 2
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 10, 20)

const camera2 = new THREE.PerspectiveCamera(60, 2, 0.1, 500)
camera2.position.set(40, 10, 30)
camera.lookAt(0, 5, 0)



class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj
        this.minProp = minProp
        this.maxProp = maxProp
        this.minDif = minDif
    }
    get min() {
        return this.obj[this.minProp]
    }
    set min(v) {
        this.obj[this.minProp] = v
        this.obj[this.maxProp] = Math.max(this.obj[this.minProp], v + this.minDif)
    }
    get max() {
        return this.obj[this.maxProp]
    }
    set max(v) {
        this.obj[this.maxProp] = v
        this.min = this.min
    }
}

// function updateCamera() {
//     camera.updateProjectionMatrix()
// }

const gui = new GUI()
// gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
gui.add(camera, 'fov', 1, 180)

const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')


// cameraHelper
const cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)

const view1Elem = document.querySelector('#view1')
const view2Elem = document.querySelector('#view2')



// const controls = new OrbitControls(camera, canvas)
// controls1
const controls = new OrbitControls(camera, view1Elem)
controls.target.set(0, 5, 0)
controls.update()
// controls2
const controls2 = new OrbitControls(camera2, view2Elem)
controls2.target.set(0, 5, 0)
controls2.update()


function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    //
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    return width / height
}








const scene = new THREE.Scene()
scene.background = new THREE.Color('black')







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

{
    const color = 0XFFFFFF
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
}


function render() {
    // if (resizeRendererToDisplaySize(renderer)) {
    //     const canvas = renderer.domElement
    //     camera.aspect = canvas.clientWidth / canvas.clientHeight
    //     camera.updateProjectionMatrix()
    // }
    resizeRendererToDisplaySize(renderer)

    // turn on the scissor
    renderer.getScissorTest(true)

    // render the original view
    {
        const aspect = setScissorForElement(view1Elem)

        //adjust the camera for this aspect
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        cameraHelper.update()

        cameraHelper.visible = false

        scene.background.set(0x000000)

        //render
        renderer.render(scene, camera)
    }

    //render from the 2nd camera
    {
        const aspect = setScissorForElement(view2Elem)

        camera2.aspect = aspect
        camera2.updateProjectionMatrix()

        cameraHelper.visible = true

        scene.background.set(0x000040)

        renderer.render(scene, camera2)
    }



    requestAnimationFrame(render)
}

requestAnimationFrame(render)














