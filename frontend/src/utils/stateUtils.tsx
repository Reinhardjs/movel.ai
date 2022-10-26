import { createStore } from "@halka/state";
import { nanoid } from "nanoid";
import produce from "immer";
import clamp from "clamp";

import { SHAPE_TYPES, PEN_TYPE } from "../configs/constants";
import { StateProp } from "../props/stateProp";

const APP_NAMESPACE = "__integrtr_diagrams__";
const SHAPES_DATA = APP_NAMESPACE + "SHAPE_DATA";

const baseState: StateProp = {
  isDrawing: false,
  selectedTool: "select",
  selected: null,
  shapes: {},
};

export const useStates = createStore(() => {
  const initialShapesState = JSON.parse(localStorage.getItem(SHAPES_DATA)!);

  return { ...baseState, shapes: initialShapesState ?? {} };
});

const setState = (fn: any) => useStates.set(produce(fn));

export const saveDiagram = () => {
  const state = useStates.get();

  localStorage.setItem(SHAPES_DATA, JSON.stringify(state.shapes));
};

export const reset = () => {
  localStorage.removeItem(SHAPES_DATA);

  useStates.set(baseState);
};

export const deleteShape = (id: string) => {
  setState((state: any) => {
    delete state.shapes[id];
  });
}

export const createPen = ({ stroke, points }: { stroke: string, points: Array<any> }) => {
  setState((state: any) => {
    state.shapes[nanoid()] = {
      type: PEN_TYPE,
      stroke,
      points
    }
  })
}

export const createRectangle = ({ width, height, fill, stroke, rotation, x, y }: {
  width: number,
  height: number,
  fill: string,
  stroke: string,
  rotation: number,
  x: number,
  y: number,
}) => {
  setState((state: any) => {
    state.shapes[nanoid()] = {
      type: SHAPE_TYPES.RECT,
      width,
      height,
      fill,
      stroke,
      rotation,
      x,
      y,
    };
  });
};

export const createCircle = ({ radius, fill, stroke, x, y }: {
  radius: number, fill: string, stroke: string, x: any, y: any
}) => {
  setState((state: any) => {
    state.shapes[nanoid()] = {
      type: SHAPE_TYPES.CIRCLE,
      radius,
      fill,
      stroke,
      x,
      y,
    };
  });
};

export const setIsDrawing = (isDrawing: boolean) => {
  setState((state: any) => {
    state.isDrawing = isDrawing;
  })
}

export const selectTool = (tool: string) => {
  setState((state: any) => {
    state.selectedTool = tool;
  })
  clearSelection();
}

export const selectShape = (id: any) => {
  setState((state: any) => {
    state.selected = id;
  });
};

export const clearSelection = () => {
  setState((state: any) => {
    state.selected = null;
  });
};

export const moveShape = (id: any, event: any) => {
  setState((state: any) => {
    const shape = state.shapes[id];

    if (shape) {
      shape.x = event.target.x();
      shape.y = event.target.y();
    }
  });
};

export const updateAttribute = (attr: any, value: any) => {
  setState((state: any) => {
    const shape = state.shapes[state.selected];

    if (shape) {
      shape[attr] = value;
    }
  });
};

