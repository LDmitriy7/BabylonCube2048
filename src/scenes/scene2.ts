import cubeMeshUrl from "assets/cube.glb"
import { RunningCubes, createRoad, importMesh } from "lib"
import { SceneManager } from "../sceneManager"

export default class extends SceneManager {
  cubes: RunningCubes

  async initScene() {
    this.inspector.show()
    createRoad(100)
    const cube = await importMesh(cubeMeshUrl, "cube", 0.5)
    cube.position.y = 0.5
    const cubes = new RunningCubes(cube)
    cubes.setColor()
    this.cubes = cubes
    this.createEnvironment(cubes.mesh, cubes.children)
    cube.position.x = 2
  }

  updateScene() {
    this.cubes.run(this.dt)
  }
}
