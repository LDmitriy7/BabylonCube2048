import { SceneBuilder } from "./sceneBuilder"

export interface CreateSceneModule {
  default: typeof SceneBuilder
}

export const getSceneModuleWithName = async (name = "scene1") => {
  const module = await import("./scenes/" + name)
  return (module as CreateSceneModule).default
}
