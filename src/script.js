import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import GUI from 'lil-gui'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// AXES HERLPER
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')

// const mapcapTexture =  new THREE.SRGBColorSpace()
// mapcapTexture.colorSapce = mapcapTexture

// TEXTO 3D
let text
let textTwo
const fontLoader = new FontLoader()
fontLoader.load(
    './fonts/helvetiker_regular.typeface.json', 
    (font)=> 
    {
        const textGeometry = new TextGeometry(
            'VITALY.DEV', 
            {   font: font,
                size: 0.5,
                height: 0.2, // Profundidad
                curveSegments: 3,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textGeometryTwo = new TextGeometry(
            'Three.js', 
            {   font: font,
                size: 0.5,
                height: 0.2, // Profundidad
                curveSegments: 3,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // CENTAR DE FORMA DIFICIL
        // En una caja o esfera que tienen nuestros objetos INVISIBLE
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox);
        // ahora usamos la TRANSLATE para centar los de forma correcta
        // textGeometry.translate(
            //recuerda colocar los tres valores antes de actulizar
            // - textGeometry.boundingBox.max.x / 2,
            // - textGeometry.boundingBox.max.y / 2,
            // - textGeometry.boundingBox.max.z / 2
            // agregamos los valores de el bevel
            // - (textGeometry.boundingBox.max.x -0.2) * 0.5,
            // - (textGeometry.boundingBox.max.y -0.2) * 0.5,
            // - (textGeometry.boundingBox.max.z -0.3) * 0.5
        // )
        // CENTAR FORMA FACIL Y MISMO RESULTADO
        textGeometry.center()
        textGeometryTwo.center()
        const textMaterial = new THREE.MeshStandardMaterial()
        const glassMaterial =  new THREE.MeshPhysicalMaterial()
        text = new THREE.Mesh(textGeometry,glassMaterial)
        textTwo = new THREE.Mesh(textGeometryTwo,glassMaterial)
        scene.add(text)
        scene.add(textTwo)
        textTwo.position.y = 0.7

        glassMaterial.roughness = 0
        glassMaterial.transmission = 1
        glassMaterial.ior = 1.5
        glassMaterial.thickness = 0.5

        gui
        .add(glassMaterial, 'roughness')
        .min(0)
        .max(1)
        .step(0.001)
        gui
        .add(glassMaterial, 'transmission')
        .min(0)
        .max(1)
        .step(0.001)
        gui
        .add(glassMaterial,'ior')
        .min(1)
        .max(10)
        .step(0.001)
        gui
        .add(glassMaterial, 'thickness')
        .min(0)
        .max(1)
        .step(0.001)
        
        
        tick()
    }
)


// para una mejor optimizacion vamos a crear la geometria afuera y el material y a crear la Mesh a dentro de el bucle
const donutGeometry = new THREE.TorusGeometry(0.3,0.2,22,45)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture})
const cubeGeometri =  new THREE.BoxGeometry(1,1,1)
const tetrahedronGeometry = new THREE.TetrahedronGeometry()

let donut
let tetrahedron
let donutsArray = []
let cube
const minDonutSize = 0.3

for (let i = 0; i < 20; i++) 
{
    donut = new THREE.Mesh(donutGeometry,donutMaterial)
    cube =  new THREE.Mesh(cubeGeometri,donutMaterial)
    tetrahedron =  new THREE.Mesh(tetrahedronGeometry,donutMaterial)
    
    // damaos numero randoms para X,Y,Z
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z =  (Math.random() - 0.5) * 10
    cube.position.x = (Math.random() - 0.5) * 10 
    cube.position.y = (Math.random() - 0.5) * 10 
    cube.position.z = (Math.random() - 0.5) * 10 
    tetrahedron.position.x = (Math.random() - 0.5) * 10 
    tetrahedron.position.y = (Math.random() - 0.5) * 10 
    tetrahedron.position.z = (Math.random() - 0.5) * 10
    // para la rotacion tambien 
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    cube.rotation.x = Math.random() * Math.PI
    cube.rotation.y = Math.random() * Math.PI
    tetrahedron.rotation.x = Math.random() * Math.PI
    tetrahedron.rotation.y = Math.random() * Math.PI
    // para el tamaño es un poco diferente
    // const scale = Math.random()
    // donut.scale.set(scale,scale,scale)
    //ERROR
    // donut.scale.x = Math.random()
    // donut.scale.y = Math.random()
    // donut.scale.z = Math.random()
    // para evitar que el error de tener un parametro difente para X,Y,Z vamos a guardar un unico valor para los tres.

    const scale = Math.max(Math.random(), minDonutSize)
    donut.scale.set(scale,scale,scale)
    cube.scale.set(scale,scale,scale)
    scene.add(donut)
    scene.add(cube)
    scene.add(tetrahedron)
    donutsArray.push(cube,tetrahedron,donut)
   
}
console.log(donutsArray);


const rgbeLoader = new RGBELoader()
rgbeLoader.load('./environmentMap/2k.hdr', (environmentMap) => 
    {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = environmentMap
        scene.background = environmentMap
    }
)


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.minDistance = 2; 
controls.maxDistance = 6;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))





/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    if (text || textTwo) {
        // text.rotation.y = 0.1 * elapsedTime
        // text.position.y = Math.cos(elapsedTime) / 2
        text.rotation.y = Math.cos(elapsedTime) / 2
        textTwo.rotation.y = Math.cos(elapsedTime) / 2

    }

        donutsArray.forEach((donut,index)=> {
        // donut.position.y = Math.cos(elapsedTime) / 2
        // donut.rotation.x = 1 * elapsedTime
        // donut.rotation.y = 1 * elapsedTime
        donut.position.y =   Math.cos( 0.1 * elapsedTime + index) * 5
        donut.rotation.x =  0.5 * elapsedTime 
        donut.rotation.z =  0.5 * elapsedTime  
    })
    
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()