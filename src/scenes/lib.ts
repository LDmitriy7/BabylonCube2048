import { AbstractMesh, SceneLoader } from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

export async function importFontData(url: string) {
  const resp = await fetch(url)
  return await resp.json()
}

export function shift(from: number, to: number, maxDelta: number) {
  maxDelta = Math.abs(maxDelta)
  if (from < to) return Math.min(from + maxDelta, to)
  else return Math.max(from - maxDelta, to)
}

// TODO: merge meshes
export async function importMesh(url: string, name: string, scale = 1) {
  const result = await SceneLoader.ImportMeshAsync(
    "",
    "",
    url,
    undefined,
    undefined,
    ".glb"
  )
  const mesh = flatMeshes(result.meshes)
  mesh.name = name
  mesh.scaling.scaleInPlace(scale)
  return mesh
}

/** Get first non-root mesh, dispose others */
function flatMeshes(meshes: AbstractMesh[]) {
  const mesh = meshes[1]
  mesh.parent = null
  meshes[0].dispose()
  return mesh
}

export function cloneMesh(mesh: AbstractMesh, name?: string) {
  const result = mesh.clone(name ?? mesh.name, null)
  if (!result) throw new Error("Mesh clone failed")
  return result
}
