import { SceneBuilder } from "../sceneBuilder"
import {
  Cube,
  createCamera,
  createLight,
  createRoad,
  createShadows,
} from "./builders"

class Scene1Builder extends SceneBuilder {
  cube: Cube

  async createScene() {
    const scene = this.scene
    this.inspector.show(scene)
    this.cube = new Cube()
    const light = createLight(scene)
    createCamera()
    createRoad()
    createShadows(light, [this.cube.mesh])
    return scene
  }

  updateScene() {
    this.cube.run(this.dt)
  }
}

export default Scene1Builder
