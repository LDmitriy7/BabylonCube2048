import * as B from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

const LIGHT_DIRECTION = new B.Vector3(0.1, -1, 0.2)
const LIGHT_INTENSITY = 0.7
const CAMERA_POSITION = new B.Vector3(0, 8, 11)
const CAMERA_TARGET = new B.Vector3(0, 2, 0)
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
  const camera = new B.FreeCamera("camera", position)
  camera.target = CAMERA_TARGET
  camera.parent = target
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
  }

  setColor(color = B.Color3.Red(), emission = 0.5) {
    setColor(this.material, color, emission)
  }

  set enabled(value: boolean) {
    this.mesh.setEnabled(value) // TODO: children?
  }

  get enabled() {
    return this.mesh.isEnabled()
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

export type ClassType<T> = { new (): T }

export function getBehavior<T extends Behavior>(
  node: B.Node,
  cls: ClassType<T>
) {
  let bhv = node.getBehaviorByName(cls.name) as T
  if (!bhv) {
    bhv = new cls()
    node.addBehavior(bhv)
  }
  return bhv
}

export function shift(from: number, to: number, maxDelta: number) {
  maxDelta = Math.abs(maxDelta)
  if (from < to) return Math.min(from + maxDelta, to)
  else return Math.max(from - maxDelta, to)
}

export class Behavior<T extends B.Node = B.TransformNode>
  implements B.Behavior<T>
{
  name: string
  scene: B.Scene
  target: T
  observer: B.Observer<B.Scene>

  init() {
    this.name = this.constructor.name
  }

  attach(target: T) {
    this.scene = target.getScene()
    this.target = target
    this.initObserver()
  }

  initObserver() {
    const observable = this.scene.onBeforeRenderObservable
    const observer = observable.add(() =>
      this.update(this.scene.deltaTime / 1000)
    )
    if (!observer) throw new Error("Observer creation failed")
    this.observer = observer
  }

  detach(): void {
    if (!this.observer) return
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  update(dt: number) {}
}

export type AXIS = "x" | "y" | "z"
export const AXES: AXIS[] = ["x", "y", "z"]

class FollowPositionBehavior extends Behavior {
  position: B.Vector3
  speed = 1

  attach(target: B.TransformNode) {
    super.attach(target)
    this.position = target.position.clone()
  }

  update(dt: number) {
    const delta = dt * this.speed
    AXES.forEach((i) => this.updateAxis(i, delta))
  }

  updateAxis(axis: AXIS, delta: number) {
    const pos = this.target.position
    pos[axis] = shift(pos[axis], this.position[axis], delta)
  }
}

export function setTargetPosition(
  mesh: B.AbstractMesh,
  position: B.Vector3,
  speed = 1
) {
  const bhv = getBehavior(mesh, FollowPositionBehavior)
  bhv.position = position
  bhv.speed = speed
}

export function setTargetPositionX(mesh: B.AbstractMesh, x: number, speed = 5) {
  setTargetPosition(mesh, new B.Vector3(x), speed)
}
