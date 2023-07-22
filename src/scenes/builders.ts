import {
  AbstractMesh,
  CreateGround,
  CreateText,
  DirectionalLight,
  FollowCamera,
  HemisphericLight,
  IFontData,
  IShadowLight,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core"
import earcut from "earcut"

export function createShadows(light: IShadowLight, targets: AbstractMesh[]) {
  const gen = new ShadowGenerator(2 ** 10, light)
  gen.darkness = 0.5
  gen.useBlurExponentialShadowMap = true
  gen.useKernelBlur = true
  gen.blurKernel = 2 ** 4
  targets.forEach((t) => gen.addShadowCaster(t))
}

export function createRoad() {
  const mesh = CreateGround("road", { width: 500, height: 6 })
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
  const dir = new Vector3(0.1, -1, 0.2)
  const light = new DirectionalLight("light", dir, scene)
  light.position.y = 5
  light.specular.scaleInPlace(0.5)
  light.intensity = 0.7
  // light.autoUpdateExtends = false
  return light
}

export function createCamera(target: AbstractMesh) {
  const camera = new FollowCamera("camera", new Vector3(-10, 5))
  camera.radius = 10
  camera.lockedTarget = target
  camera.maxCameraSpeed = 10
  camera.rotationOffset = 90
  camera.heightOffset = 5
  return camera
}

export function createText(value: string, fontData: IFontData, size: number) {
  const opts = {
    size,
    resolution: 64,
    depth: 0.1 ** 2,
  }
  const text = CreateText("text", value, fontData, opts, undefined, earcut)
  if (!text) throw new Error("Text creation failed")
  text.scaling.scaleInPlace(0.5)
  return text
}
