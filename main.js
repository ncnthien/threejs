import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

const canvas = document.querySelector('.webgl')
const fontLoader = new FontLoader()
const scene = new THREE.Scene()
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas })
const cursor = {
  x: 0,
  y: 0
}
const controls = new OrbitControls(camera, canvas)
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./static/textures/matcaps/8.png')
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donuts = []

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, material)
  donuts.push(donut)
  const scale = Math.random()
  donut.position.x = (Math.random() - 0.5) * 10
  donut.position.y = (Math.random() - 0.5) * 10
  donut.position.z = (Math.random() - 0.5) * 10
  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI
  donut.scale.set(scale, scale, scale)
  scene.add(donut)
}

matcapTexture.colorSpace = THREE.SRGBColorSpace
fontLoader.load('./static/typeface/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello ncnthien', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  })
  textGeometry.center()
  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
})

camera.position.z = 3
scene.add(camera)
renderer.setSize(sizes.width, sizes.height)
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

const clock = new THREE.Clock()

function tick(time = 1) {
  const elapsedTime = clock.getElapsedTime()

  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}

tick()
