import { useCallback } from "react";

import { useStates, updateAttribute, deleteShape } from "../utils/stateUtils";

const shapeSelector = (state: any) => state.shapes[state.selected];

export function PropertiesPanel() {
  const selectedShape = useStates(shapeSelector);
  const selectedShapeId = useStates((state) => state.selected);

  const updateAttr = useCallback((event: any) => {
    const attr = event.target.name;

    updateAttribute(attr, event.target.value);
  }, []);

  return (
    <aside className="panel">
      <h2>Properties</h2>
      <div className="properties">
        {selectedShape ? (
          <>
            <div className="key">
              Type <span className="value">{selectedShape.type}</span>
            </div>

            <div className="key">
              Stroke{" "}
              <input
                className="value"
                name="stroke"
                type="color"
                value={selectedShape.stroke}
                onChange={updateAttr}
              />
            </div>

            <div className="key">
              Fill{" "}
              <input
                className="value"
                name="fill"
                type="color"
                value={selectedShape.fill}
                onChange={updateAttr}
              />
            </div>
            <button onClick={() => { deleteShape((selectedShapeId as string)) }} style={{ marginTop: 30, padding: 20, borderRadius: 20, width: "100%", backgroundColor: "#E74C3C" }}>DELETE</button>
          </>
        ) : (
          <div className="no-data">Nothing is selected</div>
        )}
      </div>
    </aside>
  );
}
