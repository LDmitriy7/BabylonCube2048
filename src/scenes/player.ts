import { AbstractMesh, IFontData } from "@babylonjs/core"
import { PlayerCube } from "./cube"
import { Entity } from "./entity"
import { cloneMesh } from "./lib"

export class Player extends Entity {
  mainCube: PlayerCube
  secondCube: PlayerCube
  focusPoint: AbstractMesh
  zRange = 2
  speed = 3

  constructor(cubeMesh: AbstractMesh, fontData: IFontData) {
    super("player")
    this.focusPoint = this.addFocusPoint()
    this.mainCube = new PlayerCube(cubeMesh, fontData)
    this.secondCube = new PlayerCube(
      cloneMesh(cubeMesh, "secondCube"),
      fontData
    )
    this.addChildren(this.meshes)
  }

  run(dt: number) {
    this.position.x -= dt * this.speed
    this.cubes.forEach((c) => c.update(dt))
    if (this.secondCube.position.z == 0) this.secondCube.enabled = false
    else this.secondCube.enabled = true
  }

  switchSplitState() {
    if (this.mainCube.targetPos.z == 0) this.split()
    else this.merge()
  }

  merge() {
    this.cubes.forEach((c) => (c.targetPos.z = 0))
  }

  split() {
    this.mainCube.targetPos.z = -this.zRange
    this.secondCube.targetPos.z = this.zRange
  }

  get meshes() {
    return this.cubes.map((c) => c.mesh)
  }

  get cubes() {
    return [this.mainCube, this.secondCube]
  }
}
