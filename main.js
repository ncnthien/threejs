import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
  console.log('loading started')
}
loadingManager.onLoad = () => {
  console.log('loading finished')
}
loadingManager.onProgress = () => {
  console.log('loading progress')
}
loadingManager.onError = () => {
  console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load('./static/image.jpeg')
texture.colorSpace = THREE.SRGBColorSpace
texture.repeat.x = 2
texture.repeat.y = 3
texture.wrapS = THREE.MirroredRepeatWrapping
texture.wrapT = THREE.MirroredRepeatWrapping
texture.offset.x = 0.5
texture.offset.y = 0.5

const gui = new GUI({ width: 300, title: 'Nice debug UI', closeFolders: true })
const debug = { color: 0xff0000, subdivision: 2 }
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const material = new THREE.MeshNormalMaterial()
material.side = THREE.DoubleSide
material.flatShading = true
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
sphere.position.x = -1.5
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

const cubeTweaks = gui.addFolder('Cube')
cubeTweaks.add(material, 'wireframe')
cubeTweaks.addColor(debug, 'color').onChange(() => {
  material.color.set(debug.color)
})
cubeTweaks.add(debug, 'spin')

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
camera.position.z = 3
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const cursor = {
  x: 0,
  y: 0
}

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = - (event.clientY / sizes.height - 0.5)
})

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    gui.show(gui._hidden)
  }
})

const clock = new THREE.Clock()

function tick() {
  const elapsedTime = clock.getElapsedTime()
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = - 0.15 * elapsedTime
  plane.rotation.x = - 0.15 * elapsedTime
  torus.rotation.x = - 0.15 * elapsedTime

  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}

tick()
