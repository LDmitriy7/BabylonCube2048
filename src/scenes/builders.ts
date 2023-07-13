import {
  AbstractMesh,
  ArcRotateCamera,
  CreateGround,
  CreateSphere,
  DirectionalLight,
  HemisphericLight,
  IShadowLight,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core"
import grassTextureUrl from "../../assets/grass.jpg"

export function createShadows(light: IShadowLight, targets: AbstractMesh[]) {
  const gen = new ShadowGenerator(512, light)
  gen.useBlurExponentialShadowMap = true
  gen.blurScale = 2
  gen.setDarkness(0.2)
  gen.getShadowMap()?.renderList?.push(...targets)
}

export function createMySphere() {
  const sphere = CreateSphere("sphere", { diameter: 2, segments: 32 })
  sphere.position.y = 1
  return sphere
}

export function createGround() {
  const ground = CreateGround("ground", { width: 6, height: 6 })
  const groundMaterial = new StandardMaterial("ground material")
  groundMaterial.diffuseTexture = new Texture(grassTextureUrl)
  ground.material = groundMaterial
  ground.receiveShadows = true
  return ground
}

export function createHemiLight(scene: Scene) {
  const light = new HemisphericLight("light", Vector3.Up(), scene)
  light.intensity = 0.7
  return light
}

export function createLight(scene: Scene) {
  const light = new DirectionalLight("light", new Vector3(0, -1, 1), scene)
  light.intensity = 0.5
  light.position.y = 10
  return light
}

export function createCamera(canvas: HTMLCanvasElement) {
  const alpha = 0
  const beta = Math.PI / 3
  const radius = 10
  const camera = new ArcRotateCamera(
    "camera",
    alpha,
    beta,
    radius,
    Vector3.Zero()
  )
  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)
}
