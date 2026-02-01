import { useRef } from "react"

export default function Thread() {
  return (
    <ThreadWrapper>
      {/* Empty sidebar - no threads */}
    </ThreadWrapper>
  )
}

const ThreadWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const calculateHeight = containerRef.current?.clientHeight || 500;
  return (
    <div
      style={{
        overflowAnchor: 'none',
        flex: '0 0 auto',
        position: 'relative',
        visibility: 'hidden',
        width: '100%',
        height: `${calculateHeight}px`
      }}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          visibility: 'visible',
        }}>
        {children}
      </div>
    </div>
  )
}
