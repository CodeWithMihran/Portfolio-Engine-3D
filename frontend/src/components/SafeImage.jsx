import { useState } from 'react';

export default function SafeImage({ src, fallbackSrc, alt, ...imageProps }) {
  const [failedSource, setFailedSource] = useState(null);
  const failed = failedSource === src;

  return (
    <img
      {...imageProps}
      src={failed ? fallbackSrc : src || fallbackSrc}
      alt={alt}
      onError={() => {
        if (!failed && fallbackSrc) setFailedSource(src);
      }}
    />
  );
}
