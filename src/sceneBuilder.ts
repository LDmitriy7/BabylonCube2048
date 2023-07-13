import { Engine, Scene } from "@babylonjs/core"

export class SceneBuilder {
  inspector = new Inspector()
  constructor(public engine: Engine, public canvas: HTMLCanvasElement) {}
  async createScene(): Promise<Scene> {
    return new Scene(this.engine)
  }
  preTasks?: Promise<unknown>[]
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
