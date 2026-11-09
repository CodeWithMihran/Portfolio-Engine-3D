import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function useDragRotation({ sensitivity = 0.008, verticalLimit = 0.7, onDragStateChange } = {}) {
  const rotationRef = useRef(null);
  const pointerRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  const onPointerDown = (event) => {
    event.stopPropagation();
    event.target.setPointerCapture?.(event.pointerId);
    pointerRef.current = { x: event.clientX, y: event.clientY };
    onDragStateChange?.(true);
  };

  const onPointerMove = (event) => {
    const previous = pointerRef.current;
    if (!previous || !rotationRef.current) return;

    const deltaX = event.clientX - previous.x;
    const deltaY = event.clientY - previous.y;
    previous.x = event.clientX;
    previous.y = event.clientY;
    rotationRef.current.rotation.y += deltaX * sensitivity;
    rotationRef.current.rotation.x = THREE.MathUtils.clamp(
      rotationRef.current.rotation.x + deltaY * sensitivity,
      -verticalLimit,
      verticalLimit
    );
    invalidate();
  };

  const onPointerUp = (event) => {
    pointerRef.current = null;
    if (event.target.hasPointerCapture?.(event.pointerId)) {
      event.target.releasePointerCapture?.(event.pointerId);
    }
    onDragStateChange?.(false);
  };

  const onPointerCancel = () => {
    pointerRef.current = null;
    onDragStateChange?.(false);
  };

  return {
    rotationRef,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
