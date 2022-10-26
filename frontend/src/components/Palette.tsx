import CSS from "csstype";
import { Layer, RegularPolygon, Stage } from "react-konva";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "../configs/constants";
import { selectTool, useStates } from "../utils/stateUtils";

const handleDragStart = (event: any) => {
  const type = event.target.dataset.shape;

  console.log("Handle Drag Start")

  if (type) {
    // x,y coordinates of the mouse pointer relative to the position of the padding edge of the target node
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    // dimensions of the node on the browser
    const clientWidth = event.target.clientWidth;
    const clientHeight = event.target.clientHeight;

    const dragPayload = JSON.stringify({
      type,
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
    });

    event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
  }
};

export function Palette() {
  const commonStyle: CSS.Properties = {
    paddingTop: "20px", paddingBottom: "20px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"
  }
  const selectedTool = useStates((state) => state.selectedTool);

  return (
    <aside className="palette">
      <h2 style={{ marginTop: 50, marginBottom: 50 }}>Tools</h2>
      <div
        onClick={() => {
          selectTool("select")
        }}
        style={{ backgroundColor: selectedTool === "select" ? "#bdc3c7" : "transparent", ...commonStyle }}
      >
        <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.9984 2H2V4.9984H4.9984V2Z" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.99854 3.50098H18.9987" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 4.99854V19.0005" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20.4978 5V19.002" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.99854 20.501H18.9987" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.9984 19H2V21.9984H4.9984V19Z" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.9974 2.00195H18.999V5.00035H21.9974V2.00195Z" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.9974 19.002H18.999V22.0004H21.9974V19.002Z" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path fillRule="evenodd" clipRule="evenodd" d="M10.9966 15.002L7.99658 8.00195L14.9966 11.002L11.9986 12.0009L10.9966 15.002Z" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path fillRule="evenodd" clipRule="evenodd" d="M11.999 12.002L14.997 15.002L11.999 12.002Z" stroke="currentColor" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        onClick={() => {
          selectTool("pen")
        }}
        style={{ backgroundColor: selectedTool === "pen" ? "#bdc3c7" : "transparent", ...commonStyle }}>
        <img src="/pencil.png" width="50" alt="pen tool" />
      </div>
      <div
        onClick={() => {
          selectTool("rect")
        }}
        style={{ backgroundColor: selectedTool === "rect" ? "#bdc3c7" : "transparent", ...commonStyle }}
      >
        <div
          className="shape rectangle"
          data-shape={SHAPE_TYPES.RECT}
          draggable
          onDragStart={handleDragStart}
        />
      </div>
      <div
        onClick={() => {
          selectTool("circle")
        }}
        style={{ backgroundColor: selectedTool === "circle" ? "#bdc3c7" : "transparent", ...commonStyle }}>
        <div
          className="shape circle"
          data-shape={SHAPE_TYPES.CIRCLE}
          draggable
          onDragStart={handleDragStart}
        />
      </div>
      <div
        onClick={() => {
          selectTool("triangle")
        }}
        style={{ backgroundColor: selectedTool === "triangle" ? "#bdc3c7" : "transparent", ...commonStyle }}>
        <Stage
          width={100}
          height={100}
        >
          <Layer>
            <RegularPolygon
              radius={50}
              sides={3}
              x={50}
              y={50}
              width={100}
              height={100}
              stroke="black"
            />
          </Layer>
        </Stage>
      </div>
    </aside>
  );
}
