import "@babylonjs/core/Engines/WebGPU/Extensions/engine.uniformBuffer"
import { Engine } from "@babylonjs/core/Engines/engine"
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine"
import { getSceneModuleWithName } from "./createScene"

const getModuleToLoad = (): string | undefined =>
  location.search.split("scene=")[1]?.split("&")[0]

export const babylonInit = async (): Promise<void> => {
  // get the module to load
  const moduleName = getModuleToLoad()
  const createSceneModule = await getSceneModuleWithName(moduleName)
  const engineType =
    location.search.split("engine=")[1]?.split("&")[0] || "webgl"
  // Execute the pretasks, if defined
  // await Promise.all(createSceneModule.preTasks || [])
  // Get the canvas element
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
  // Generate the BABYLON 3D engine
  let engine: Engine
  if (engineType === "webgpu") {
    const webGPUSupported = await WebGPUEngine.IsSupportedAsync
    if (webGPUSupported) {
      const webgpu = (engine = new WebGPUEngine(canvas, {
        adaptToDeviceRatio: true,
        antialias: true,
      }))
      await webgpu.initAsync()
      engine = webgpu
    } else {
      engine = new Engine(canvas, true)
    }
  } else {
    engine = new Engine(canvas, true)
  }

  // Create the scene
  const sceneBuilder = new createSceneModule(engine, canvas)
  const scene = await sceneBuilder.createScene()

  // JUST FOR TESTING. Not needed for anything else
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).scene = scene

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render()
  })

  // Watch for browser/canvas resize events
  window.addEventListener("resize", () => engine.resize())
}

babylonInit().then(() => {
  // scene started rendering, everything is initialized
})
