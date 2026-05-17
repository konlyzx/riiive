export function SiteFrame() {
  return (
    <>
    </>
  )
}

export function DottedPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
      style={{
        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
      aria-hidden="true"
    />
  )
}
