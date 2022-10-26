import React, { useRef, useCallback } from "react";
import { Layer, Line, Stage, Text } from "react-konva";

import {
    useShapes,
    clearSelection,
    createCircle,
    createRectangle,
    saveDiagram,
    reset,
} from "../data/state";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "../configs/constants";
import { Shape } from "./Shape";
import { ShapeProp } from "./shapeProp";

const handleDragOver = (event: any) => event.preventDefault();

export function Canvas() {
    const [tool, setTool] = React.useState<any>('pen');
    const [lines, setLines] = React.useState<any>([]);
    const isDrawing = React.useRef(false);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const shapes = useShapes((state) => Object.entries(state.shapes));

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
                    {lines.map((line: any, i: any) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#df4b26"
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
