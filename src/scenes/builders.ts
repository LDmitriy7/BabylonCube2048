import {
  AbstractMesh,
  ArcRotateCamera,
  Color3,
  CreateBox,
  CreateGround,
  DirectionalLight,
  HemisphericLight,
  IShadowLight,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core"

export function createShadows(light: IShadowLight, targets: AbstractMesh[]) {
  const gen = new ShadowGenerator(512, light)
  gen.useBlurExponentialShadowMap = true
  gen.blurScale = 2
  gen.setDarkness(0.5)
  gen.getShadowMap()?.renderList?.push(...targets)
}

export class Cube {
  mesh = CreateBox("cube", { size: 1 })
  mat = new StandardMaterial("cube")

  constructor() {
    this.mesh.position.y = 0.5
    this.mesh.material = this.mat
    this.mat.diffuseColor = Color3.Red()
  }

  run(dt: number) {
    this.mesh.position.x -= dt
  }
}

export function createRoad() {
  const mesh = CreateGround("road", { width: 60, height: 5 })
  mesh.position.x = -27
  const mat = new StandardMaterial("road")
  mesh.material = mat
  mesh.receiveShadows = true
  return mesh
}

export function createHemiLight(scene: Scene) {
  const light = new HemisphericLight("light", Vector3.Up(), scene)
  light.intensity = 0.7
  return light
}

export function createLight(scene: Scene) {
  const light = new DirectionalLight("light", new Vector3(0, -1, 1), scene)
  light.intensity = 0.7
  light.position.y = 10
  light.direction.x = 1
  light.direction.y = -5
  return light
}

export function createCamera() {
  const alpha = 0
  const beta = Math.PI / 5
  const radius = 10
  const camera = new ArcRotateCamera(
    "camera",
    alpha,
    beta,
    radius,
    Vector3.Zero()
  )
  camera.setTarget(Vector3.Zero())
  camera.attachControl(null, true)
  camera.angularSensibilityX *= 5
  camera.angularSensibilityY *= 5
}
