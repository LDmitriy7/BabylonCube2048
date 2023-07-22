import * as B from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

const LIGHT_DIRECTION = new B.Vector3(0.1, -1, 0.2)
const LIGHT_INTENSITY = 0.7
const CAMERA_POSITION = new B.Vector3(-10, 5)
const ROAD_LENGTH = 100
const SHADOWS_MAP_SIZE = 2 ** 10
const SHADOWS_DARKNESS = 0.5
const SHADOWS_BLUR_KERNEL = 2 ** 4

export class Environment {
  camera: B.Camera
  light: B.DirectionalLight
  shadows: B.ShadowGenerator

  constructor(
    scene: B.Scene,
    cameraTarget: B.AbstractMesh,
    shadowCasters: B.AbstractMesh[]
  ) {
    const camera = createCamera(cameraTarget)
    const light = createLight(scene, this.camera)
    light.parent = camera
    this.camera = camera
    this.light = light
    this.shadows = createShadows(light, shadowCasters)
  }
}

export function createLight(
  scene: B.Scene,
  camera: B.Camera,
  direction = LIGHT_DIRECTION
) {
  const light = new B.DirectionalLight("light", direction, scene)
  light.position.y = 5
  light.intensity = LIGHT_INTENSITY
  light.parent = camera
  return light
}

function importMeshAsync(url: string) {
  return B.SceneLoader.ImportMeshAsync(
    "",
    "",
    url,
    undefined,
    undefined,
    ".glb"
  )
}

export async function importMesh(url: string, name: string, scale = 1) {
  const result = await importMeshAsync(url)
  const mesh = flatMeshes(result.meshes)
  mesh.name = name
  mesh.scaling.scaleInPlace(scale)
  return mesh
}

export function setEmission(mat: B.StandardMaterial, power = 0.5) {
  mat.emissiveColor = mat.diffuseColor.scale(power)
}

export function setColor(
  mat: B.StandardMaterial,
  color: B.Color3,
  emission = 0
) {
  mat.diffuseColor = color
  setEmission(mat, emission)
}

export function createCamera(
  target: B.AbstractMesh,
  position = CAMERA_POSITION
) {
  const camera = new B.FollowCamera("camera", position)
  camera.radius = 10
  camera.lockedTarget = target
  camera.maxCameraSpeed = 10
  camera.rotationOffset = 0
  camera.heightOffset = 5
  return camera
}

export function createMaterial(mesh: B.AbstractMesh) {
  const mat = new B.StandardMaterial(mesh.name)
  mesh.material = mat
  return mat
}

export function createRoad(length = ROAD_LENGTH) {
  const mesh = B.CreateGround("road", { width: 6, height: length })
  mesh.position.z = -length / 2
  mesh.receiveShadows = true
  return mesh
}

export function createShadows(
  light: B.IShadowLight,
  casters: B.AbstractMesh[]
) {
  const gen = new B.ShadowGenerator(SHADOWS_MAP_SIZE, light)
  gen.darkness = SHADOWS_DARKNESS
  setShadowsBlur(gen)
  casters.forEach((t) => gen.addShadowCaster(t))
  return gen
}

function setShadowsBlur(gen: B.ShadowGenerator) {
  gen.useBlurExponentialShadowMap = true
  gen.useKernelBlur = true
  gen.blurKernel = SHADOWS_BLUR_KERNEL
}

export function cloneMesh(mesh: B.AbstractMesh, name?: string) {
  const result = mesh.clone(name ?? mesh.name, null)
  if (!result) throw new Error("Mesh clone failed")
  return result
}

export function run(mesh: B.AbstractMesh, dt: number, speed = 1) {
  mesh.position.z -= dt * speed
}

export function addChildren(
  parentMesh: B.AbstractMesh,
  childMeshes: B.AbstractMesh[]
) {
  childMeshes.forEach((m) => (m.parent = parentMesh))
}

export class Entity {
  mesh: B.AbstractMesh

  constructor(name: string) {
    this.mesh = new B.AbstractMesh(name)
  }

  get position() {
    return this.mesh.position
  }

  get children() {
    return this.mesh.getChildMeshes(true)
  }

  addChildren(...meshes: B.AbstractMesh[]) {
    addChildren(this.mesh, meshes)
  }
}

export class Cubes extends Entity {
  cube2: B.AbstractMesh
  material: B.StandardMaterial

  constructor(public cube1: B.AbstractMesh) {
    super("cubes")
    this.material = createMaterial(cube1)
    this.cube2 = cloneMesh(cube1)
    this.addChildren(this.cube1, this.cube2)
    this.cube2.position.x += -2
  }

  setColor(color = B.Color3.Red(), emission = 0.5) {
    setColor(this.material, color, emission)
  }
}

export const importCubeMesh = (url: string) => importMesh(url, "cube", 0.5)

export class RunningCubes extends Cubes {
  speed = 5

  run(dt: number) {
    run(this.mesh, dt, this.speed)
  }
}

/** Get first non-root mesh, dispose others */
function flatMeshes(meshes: B.AbstractMesh[]) {
  const mesh = meshes[1]
  mesh.parent = null
  meshes[0].dispose()
  return mesh
}
