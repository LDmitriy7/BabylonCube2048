/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Engine,
  KeyboardEventTypes,
  PointerEventTypes,
  Scene,
} from "@babylonjs/core"

import * as B from "@babylonjs/core"
import { Environment } from "lib"

type Callback = () => void

export class SceneManager {
  scene: Scene
  inspector: Inspector
  paused = false

  constructor(public engine: Engine, public canvas: HTMLCanvasElement) {
    this.scene = new Scene(this.engine)
    this.inspector = new Inspector(this.scene)
    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.paused) this.updateScene()
    })
    this.onClick(() => this.handleClick())
  }

  createEnvironment(
    cameraTarget: B.AbstractMesh,
    shadowCasters: B.AbstractMesh[]
  ) {
    return new Environment(this.scene, cameraTarget, shadowCasters)
  }

  addPauseHandler() {
    this.scene.onKeyboardObservable.add((e) => {
      if (e.type == KeyboardEventTypes.KEYDOWN) this.paused = !this.paused
    })
  }

  /** Add click handler (POINTERDOWN) */
  onClick(cb: Callback) {
    this.scene.onPointerObservable.add((info) => {
      if (info.type == PointerEventTypes.POINTERDOWN) cb()
    })
  }

  async initScene(): Promise<void> {}
  updateScene() {}
  handleClick() {}

  preTasks?: Promise<unknown>[]

  /** Delta time in seconds */
  get dt() {
    return this.scene.deltaTime / 1000
  }
}

class Inspector {
  constructor(private scene: Scene) {}

  async show() {
    await this.load()
    this.showDebugLayer(this.scene)
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
