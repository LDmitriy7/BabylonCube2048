import { AbstractMesh, Vector3 } from "@babylonjs/core"
import { TargetPos } from "./targetPos"

export class Entity {
  mesh: AbstractMesh
  targetPos: TargetPos

  constructor(name: string, mesh?: AbstractMesh) {
    this.mesh = mesh ?? new AbstractMesh(name)
    this.targetPos = new TargetPos(this.mesh)
  }

  get position() {
    return this.mesh.position
  }

  update(dt: number) {
    this.targetPos.moveMesh(dt)
  }

  addChildren(meshes: AbstractMesh[]) {
    meshes.forEach((m) => (m.parent = this.mesh))
  }

  addEmptyChild(name: string, position: Vector3) {
    const mesh = new AbstractMesh(name)
    this.mesh.addChild(mesh)
    mesh.position = position
    return mesh
  }

  addFocusPoint(y = 5) {
    return this.addEmptyChild("focusPoint", new Vector3(0, y, 0))
  }

  set enabled(value: boolean) {
    this.mesh.setEnabled(value)
  }
}
