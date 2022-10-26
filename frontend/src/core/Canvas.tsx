import React, { useRef } from "react";
import { Layer, Line, Stage } from "react-konva";

import {
    useStates,
    clearSelection,
    createRectangle,
    saveDiagram,
    reset,
    createPen,
    setIsDrawing,
    createCircle,
} from "../utils/stateUtils";
import { PEN_TYPE, SHAPE_TYPES } from "../configs/constants";
import { Shape } from "../components/Shape";
import { ShapeProp } from "../props/shapeProp";
import { PenProp } from "../props/penProp";

const handleDragOver = (event: any) => {
    console.log("onHandleDragOver")
};

export function Canvas() {
    const selectedTool = useStates((state) => state.selectedTool);
    const isDrawing = useStates((state) => state.isDrawing);
    const [drawingShapes, setDrawingShapes] = React.useState<any>([]);
    const [drawingPens, setDrawingPens] = React.useState<any>([]);

    const handleMouseDown = (e: any) => {
        if (selectedTool !== "select")
            setIsDrawing(true);

        const poss = e.target.getStage().getPointerPosition();
        const { x, y } = poss;
        if (selectedTool === "rect") {
            setDrawingShapes([{ type: SHAPE_TYPES.RECT, width: 1, height: 1, fill: "#CCC", stroke: "#000", rotation: 0, x, y }])
        }
        else if (selectedTool === "circle") {
            setDrawingShapes([{ type: SHAPE_TYPES.CIRCLE, radius: 2, fill: "#CCC", stroke: "#000", x, y }])
        }
        else if (selectedTool === "pen") {
            const pos = e.target.getStage().getPointerPosition();
            setDrawingPens([{ points: [pos.x, pos.y], stroke: "#000" }]);
        }
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing) {
            return;
        }
        const pos = e.target.getStage().getPointerPosition();

        if (selectedTool === "rect") {
            let lastRect = drawingShapes[drawingShapes.length - 1];
            lastRect.width = pos.x - lastRect.x;
            lastRect.height = pos.y - lastRect.y;
            drawingShapes.splice(drawingShapes.length - 1, 1, lastRect);
            setDrawingShapes(drawingShapes.concat());
        }
        else if (selectedTool === "circle") {
            let lastCircle = drawingShapes[drawingShapes.length - 1];
            lastCircle.radius = Math.hypot(pos.x - lastCircle.x, pos.y - lastCircle.y);
            drawingShapes.splice(drawingShapes.length - 1, 1, lastCircle)
            setDrawingShapes(drawingShapes.concat());
        }
        else if (selectedTool === "pen") {
            const stage = e.target.getStage();
            const point = stage.getPointerPosition();
            let lastLine = drawingPens[drawingPens.length - 1];
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y]);

            // replace last
            drawingPens.splice(drawingPens.length - 1, 1, lastLine);
            setDrawingPens(drawingPens.concat());
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        if (selectedTool === "rect") {
            let lastShape = drawingShapes[drawingShapes.length - 1];
            createRectangle({
                ...lastShape
            })
            setDrawingShapes([]);
        }
        else if (selectedTool === "circle") {
            let lastShape = drawingShapes[drawingShapes.length - 1];
            createCircle({
                ...lastShape
            })
            setDrawingShapes([]);
        }
        else if (selectedTool === "pen") {
            let lastPen = drawingPens[drawingPens.length - 1];
            createPen({
                ...lastPen
            })
            setDrawingPens([]);
        }
        return;
    };

    const shapes = useStates((state) => Object.entries(state.shapes));

    const stageRef = useRef<any>();

    return (
        <main className="canvas" onDragOver={handleDragOver}>
            <div className="buttons">
                <button onClick={saveDiagram}>Save</button>
                <button onClick={reset}>Reset</button>
            </div>
            <Stage
                ref={stageRef}
                width={window.innerWidth - 400}
                height={window.innerHeight}
                onClick={clearSelection}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
            >
                <Layer>
                    {shapes.map(([key, shape]) => {
                        if ((shape as any).type === PEN_TYPE) return (
                            <Line
                                draggable={!isDrawing}
                                key={key}
                                points={(shape as PenProp).points}
                                stroke={(shape as PenProp).stroke}
                                strokeWidth={5}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={'source-over'}
                            />
                        )
                        else return (
                            <Shape key={key} shape={{ ...(shape as ShapeProp), id: key }} />
                        )
                    })}
                </Layer>
                <Layer>
                    {drawingShapes.map((shape: any, i: any) => (
                        <Shape key={i} shape={{ ...shape, id: i }} />
                    ))}
                    {drawingPens.map((line: any, i: any) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.stroke}
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            draggable={true}
                            globalCompositeOperation={'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>
        </main>
    );
}
