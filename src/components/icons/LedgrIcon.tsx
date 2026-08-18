import * as React from 'react'

export interface LedgrIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const LedgrIcon = ({
  size = 32,
  color = 'currentColor',
  className,
  onClick,
  ...props
}: LedgrIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      onClick={onClick}
      {...props}
    >
      <rect x="0" y="0" width="128" height="128" rx="16" fill="#161616" />
      <rect x="32" y="40" width="64" height="8" rx="4" fill="#D7F500" />
      <rect x="32" y="60" width="64" height="8" rx="4" fill="#F6F6F4" />
      <rect x="32" y="80" width="40" height="8" rx="4" fill="#F6F6F4" />
    </svg>
  )
}

export default LedgrIcon
