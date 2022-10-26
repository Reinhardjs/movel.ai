import { useCallback } from "react";

import { SHAPE_TYPES } from "../configs/constants";
import { useShapes } from "../data/state";
import { Circle } from "../shapes/Circle";
import { Rectangle } from "../shapes/Rectangle";

export function Shape({ shape }: { shape: any }) {
  const isSelectedSelector = useCallback(
    (state: any) => state.selected === shape.id,
    [shape]
  );
  const isSelected = useShapes(isSelectedSelector);

  if (shape.type === SHAPE_TYPES.RECT) {
    return <Rectangle {...shape} isSelected={isSelected} />;
  } else if (shape.type === SHAPE_TYPES.CIRCLE) {
    return <Circle {...shape} isSelected={isSelected} />;
  }

  return null;
}
