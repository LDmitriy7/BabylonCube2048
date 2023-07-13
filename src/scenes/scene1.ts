import { Scene } from "@babylonjs/core"
import { SceneBuilder } from "../sceneBuilder"
import {
  createCamera,
  createGround,
  createLight,
  createMySphere,
  createShadows,
} from "./builders"

class Scene1Builder extends SceneBuilder {
  async createScene() {
    const scene = new Scene(this.engine)
    this.inspector.show(scene)
    const sphere = createMySphere()
    const light = createLight(scene)
    createCamera(this.canvas)
    createGround()
    createShadows(light, [sphere])
    return scene
  }
}

export default Scene1Builder
