import {
  AbstractMesh,
  Color3,
  IFontData,
  StandardMaterial,
} from "@babylonjs/core"
import { Entity } from "./entity"
import { Text3D } from "./text3d"

export class Cube extends Entity {
  mat = new StandardMaterial("cube")

  constructor(mesh: AbstractMesh, fontData: IFontData) {
    super(mesh.name, mesh) // TODO
    mesh.material = this.mat
    this.position.y = 0.5
    this.mat.diffuseColor = Color3.Red()

    // this.mat.alpha = 0.5
    // this.mat.diffuseColor = new Color3(1, 0, 1);
    // this.mat.specularColor = new Color3(0.5, 0.6, 0.87);
    this.mat.emissiveColor = new Color3(.3, 0, 0)
    // this.mat.specularPower = 1
    // this.mat.ambientColor = new Color3(0.23, 0.98, 0.53);

    const scoreText = createScoreText(fontData)
    this.mesh.addChild(scoreText.mesh)
  }
}

function createScoreText(fontData: IFontData) {
  const text = new Text3D(fontData, 0.4)
  text.value = "2048"
  text.mesh.rotation.y = -Math.PI / 2
  text.mesh.rotation.x = Math.PI / 2
  text.mesh.position.x = 0.25
  text.mesh.position.y = 1
  text.mesh.position.z = -0.025
  return text
}

export class PlayerCube extends Cube {}
