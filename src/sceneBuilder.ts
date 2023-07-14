import { Engine, Scene } from "@babylonjs/core"

export class SceneBuilder {
  scene: Scene
  inspector = new Inspector()
  constructor(public engine: Engine, public canvas: HTMLCanvasElement) {
    this.scene = new Scene(this.engine)
    this.scene.onBeforeRenderObservable.add(this.updateScene.bind(this))
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateScene() {}

  async createScene(): Promise<Scene> {
    return this.scene
  }
  preTasks?: Promise<unknown>[]

  /** delta time in seconds */
  get dt() {
    return this.scene.deltaTime / 1000
  }
}

class Inspector {
  async show(scene: Scene) {
    await this.load()
    this.showDebugLayer(scene)
  }

  private async load() {
    await Promise.all([
      import("@babylonjs/core/Debug/debugLayer"),
      import("@babylonjs/inspector"),
    ])
  }

  private showDebugLayer(scene: Scene) {
    scene.debugLayer.show({
      handleResize: true,
      overlay: true,
      globalRoot: document.getElementById("#root") || undefined,
    })
  }
}
