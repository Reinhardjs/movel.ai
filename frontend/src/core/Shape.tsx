import { useCallback } from "react";

import { ShapeProp } from "../props/shapeProp";
import { SHAPE_TYPES } from "../configs/constants";
import { useShapes } from "../data/stateUtils";
import { StateProp } from "../props/stateProp";
import { Circle } from "../shapes/Circle";
import { Rectangle } from "../shapes/Rectangle";

export function Shape({ shape }: { shape: ShapeProp }) {
  const isSelectedSelector = useCallback(
    (state: StateProp) => state.selected === shape.id,
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
