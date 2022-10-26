import { useCallback } from "react";

import { ShapeProp } from "../props/shapeProp";
import { PEN_TYPE, SHAPE_TYPES } from "../configs/constants";
import { useStates } from "../utils/stateUtils";
import { StateProp } from "../props/stateProp";
import { Circle } from "../shapes/Circle";
import { Rectangle } from "../shapes/Rectangle";
import { PenLine } from "../shapes/PenLine";

export function Shape({ shape }: { shape: ShapeProp }) {
  const isSelectedSelector = useCallback(
    (state: StateProp) => state.selected === shape.id,
    [shape]
  );
  const isSelected = useStates(isSelectedSelector);

  if (shape.type === SHAPE_TYPES.RECT) {
    return <Rectangle {...shape} isSelected={isSelected} />;
  } else if (shape.type === SHAPE_TYPES.CIRCLE) {
    return <Circle {...shape} isSelected={isSelected} />;
  } else if (shape.type === PEN_TYPE) {
    return <PenLine {...shape} isSelected={isSelected} />;
  }

  return null;
}
