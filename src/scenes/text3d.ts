import {
  AbstractMesh,
  Color3,
  IFontData,
  StandardMaterial,
} from "@babylonjs/core"
import { createText } from "./builders"

export class Text3D {
  mesh: AbstractMesh
  mat = new StandardMaterial("text")

  constructor(private fontData: IFontData, private size: number) {
    this.mat.emissiveColor = Color3.Black()
  }

  set value(text: string) {
    if (this.mesh) this.mesh.dispose()
    this.mesh = createText(text, this.fontData, this.size)
    this.mesh.material = this.mat
  }
}
