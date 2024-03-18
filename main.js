import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

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
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ map: texture })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)


debug.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
}

const cubeTweaks = gui.addFolder('Cube')
cubeTweaks.add(mesh.position, 'y').step(0.01).name('elevation')
cubeTweaks.add(mesh, 'visible')
cubeTweaks.add(material, 'wireframe')
cubeTweaks.addColor(debug, 'color').onChange(() => {
  material.color.set(debug.color)
})
cubeTweaks.add(debug, 'spin')
cubeTweaks.add(debug, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
  mesh.geometry.dispose()
  mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debug.subdivision, debug.subdivision, debug.subdivision)
})

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

function tick() {
  camera.lookAt(mesh.position)
  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}

tick()
