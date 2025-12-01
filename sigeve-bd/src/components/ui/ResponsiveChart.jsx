import React, { useEffect, useRef, useState } from 'react';

export default function ResponsiveChart({ height = 360, children }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      const w = Math.max(300, Math.floor(el.clientWidth - 20));
      setWidth(w);
    });
    ro.observe(el);
    // initial
    setWidth(Math.max(300, Math.floor(el.clientWidth - 20)));
    return () => ro.disconnect();
  }, [ref.current]);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {typeof children === 'function' ? children({ width, height }) : children}
    </div>
  );
}
