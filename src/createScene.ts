import { SceneManager } from "./sceneManager"

export interface CreateSceneModule {
  default: typeof SceneManager
}

export const getSceneModuleWithName = async (name = "scene2") => {
  const module = await import("./scenes/" + name)
  return (module as CreateSceneModule).default
}
