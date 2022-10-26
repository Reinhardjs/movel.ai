import React, { useRef, useCallback } from "react";
import { Layer, Line, Stage, Text } from "react-konva";

import {
    useStates,
    clearSelection,
    createCircle,
    createRectangle,
    saveDiagram,
    reset,
    createPen,
} from "../utils/stateUtils";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "../configs/constants";
import { Shape } from "./Shape";
import { ShapeProp } from "../props/shapeProp";
import { PenProp } from "../props/penProp";

const handleDragOver = (event: any) => event.preventDefault();

export function Canvas() {
    const [tool, setTool] = React.useState<any>('select');
    const [drawingPens, setDrawingPens] = React.useState<any>([]);
    const isDrawing = React.useRef(false);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setDrawingPens([{ points: [pos.x, pos.y], stroke: "#000" }]);
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = drawingPens[drawingPens.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        drawingPens.splice(drawingPens.length - 1, 1, lastLine);
        setDrawingPens(drawingPens.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        let lastPen = drawingPens[drawingPens.length - 1];
        const { stroke, points } = lastPen;
        createPen({
            stroke, points
        })
        setDrawingPens([]);
    };

    const shapes = useStates((state) => Object.entries(state.shapes));
    const pens = useStates((state) => Object.entries(state.pens));

    console.log(JSON.stringify(pens))

    const stageRef = useRef<any>();

    const handleDrop = useCallback((event: any) => {
        const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);

        if (draggedData) {
            const { offsetX, offsetY, type, clientHeight, clientWidth } = JSON.parse(
                draggedData
            );

            stageRef.current.setPointersPositions(event);

            const coords = stageRef.current.getPointerPosition();

            if (type === SHAPE_TYPES.RECT) {
                // rectangle x, y is at the top,left corner
                createRectangle({
                    x: coords.x - offsetX,
                    y: coords.y - offsetY,
                });
            } else if (type === SHAPE_TYPES.CIRCLE) {
                // circle x, y is at the center of the circle
                createCircle({
                    x: coords.x - (offsetX - clientWidth / 2),
                    y: coords.y - (offsetY - clientHeight / 2),
                });
            }
        }
    }, []);

    return (
        <main className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
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
                    {shapes.map(([key, shape]) => (
                        <Shape key={key} shape={{ ...(shape as ShapeProp), id: key }} />
                    ))}
                </Layer>
                <Layer>
                    <Text text="Just start drawing" x={5} y={30} />
                    {drawingPens.map((line: any, i: any) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.stroke}
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={'source-over'}
                        />
                    ))}
                    {pens.map(([key, pen]) => (
                        <Line
                            key={key}
                            points={(pen as PenProp).points}
                            stroke={(pen as PenProp).stroke}
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>
        </main>
    );
}
