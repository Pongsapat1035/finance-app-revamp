interface GridOverlayProps {
  color?: string
  opacity?: number
  gridSize?: string
}

const GridOverlay = ({ color = '#fff', opacity = 0.09, gridSize = '48px' }: GridOverlayProps) => {
  const background = `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage: background,
        backgroundSize: `${gridSize} ${gridSize}`,
      }}
    />
  )
}

export default GridOverlay
