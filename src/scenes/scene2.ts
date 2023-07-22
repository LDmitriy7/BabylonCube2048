import cubeMeshUrl from "assets/cube.glb"
import {
  RunningCubes,
  createRoad,
  importCubeMesh,
  setTargetPositionX,
} from "lib"
import { SceneManager } from "../sceneManager"

export default class extends SceneManager {
  cubes: MyCubes

  async initScene() {
    // this.inspector.show()
    createRoad(200)
    const cube = await importCubeMesh(cubeMeshUrl)
    const cubes = new MyCubes(cube)
    cubes.position.y = 0.5
    cubes.setColor()
    this.cubes = cubes
    this.createEnvironment(cubes.mesh, cubes.children)
  }

  handleClick() {
    this.cubes.changeState()
  }

  updateScene() {
    this.cubes.run(this.dt)
  }
}

class MyCubes extends RunningCubes {
  speed = 5
  state?: "split"
  changeState() {
    if (this.state == "split") {
      this.merge()
      this.state = undefined
    } else {
      this.split()
      this.state = "split"
    }
  }
  merge() {
    setTargetPositionX(this.cube1, 0)
    setTargetPositionX(this.cube2, 0)
  }
  split() {
    setTargetPositionX(this.cube1, -2)
    setTargetPositionX(this.cube2, 2)
  }
}
