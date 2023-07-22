// import { CreateBox } from "@babylonjs/core"
import cubeMeshUrl from "assets/cube.glb"
import { SceneManager } from "../sceneManager"
import {
  createCamera,
  createLight,
  createRoad,
  createShadows,
} from "./builders"
import { importFontData, importMesh } from "./lib"
import { Player } from "./player"

const fontUrl = "https://assets.babylonjs.com/fonts/Droid Sans_Bold.json"

export default class extends SceneManager {
  player: Player

  async initScene() {
    const cubeMesh = await importCubeMesh()
    // const cubeMesh = CreateBox("cube")
    const fontData = await importFontData(fontUrl)
    this.player = new Player(cubeMesh, fontData)
    this.inspector.show()
    const light = createLight(this.scene)
    createCamera(this.player.focusPoint)
    createRoad()
    createShadows(light, this.player.meshes)
    this.onClick(() => this.player.switchSplitState())
    light.parent = this.player.mesh
    this.addPauseHandler()
  }

  updateScene() {
    this.player.run(this.dt)
  }
}

const importCubeMesh = () => importMesh(cubeMeshUrl, "cube", 0.5)
