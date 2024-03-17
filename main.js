import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

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
controls.enableZoom = false
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
})

function tick() {
  camera.lookAt(mesh.position)
  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}

tick()
