import { GridGeometry } from "../context-providers/ComponentConfigContext";

export function getComponentGridGeometry(
  gridElement: HTMLElement,
  geometry: GridGeometry,
  clientX: number,
  clientY: number,
  cellSize: number,
  cellGap: number
) {
  const { defaultSize, minSize } = geometry;

  const minWidth = Math.ceil(minSize.width / cellSize);
  const minHeight = Math.ceil(minSize.height / cellSize);

  const width = Math.max(minWidth, Math.round(defaultSize.width / cellSize));
  const height = Math.max(minHeight, Math.round(defaultSize.height / cellSize));

  const rect = gridElement.getBoundingClientRect();
  const x = Math.round((clientX - rect.left) / (cellSize + cellGap));
  const y = Math.round((clientY - rect.top) / (cellSize + cellGap));

  return {
    minSize: { width: minWidth, height: minHeight },
    size: { width, height },
    position: { x, y },
  };
}
