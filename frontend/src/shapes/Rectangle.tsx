import { useRef, useEffect, useCallback } from "react";
import { Rect as KonvaRectangle, Transformer } from "react-konva";

import { LIMITS } from "../configs/constants";
import { selectShape, transformRectangleShape, moveShape, useStates } from "../utils/stateUtils";

const boundBoxCallbackForRectangle = (oldBox: any, newBox: any) => {
  // limit resize
  if (
    newBox.width < LIMITS.RECT.MIN ||
    newBox.height < LIMITS.RECT.MIN ||
    newBox.width > LIMITS.RECT.MAX ||
    newBox.height > LIMITS.RECT.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Rectangle({ id, isSelected, type, ...shapeProps }: { id: string, isSelected: boolean, type: string }) {
  const isDrawing = useStates((state) => state.isDrawing);
  const shapeRef = useRef<any>();
  const transformerRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      transformerRef.current!.nodes([shapeRef.current]);
      transformerRef.current!.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = useCallback(
    (event: any) => {
      event.cancelBubble = true;

      selectShape(id);
    },
    [id]
  );

  const handleDrag = useCallback(
    (event: any) => {
      moveShape(id, event);
    },
    [id]
  );

  const handleTransform = useCallback(
    (event: any) => {
      transformRectangleShape(shapeRef.current, id, event);
    },
    [id]
  );

  return (
    <>
      <KonvaRectangle
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={!isDrawing}
        onDragEnd={handleDrag}
        onTransformEnd={handleTransform}
      />
      {isSelected && (
        <Transformer
          anchorSize={5}
          borderDash={[6, 2]}
          ref={transformerRef}
          boundBoxFunc={boundBoxCallbackForRectangle}
        />
      )}
    </>
  );
}
