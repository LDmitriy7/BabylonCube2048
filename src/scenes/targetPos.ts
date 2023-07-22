import { AbstractMesh } from "@babylonjs/core"
import { shift } from "./lib"

export class TargetPos {
  z = 0
  speed = 5

  constructor(private mesh: AbstractMesh) {}

  get reached() {
    return this.meshZ == this.z
  }

  /** Move mesh towards target position */
  moveMesh(dt: number) {
    this.meshZ = shift(this.meshZ, this.z, dt * this.speed)
  }

  private get meshZ() {
    return this.mesh.position.z
  }
  private set meshZ(value: number) {
    this.mesh.position.z = value
  }
}
