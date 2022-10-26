import { useRef, useEffect, useCallback } from "react";
import { Line, Transformer } from "react-konva";

import { selectShape, moveShape, useStates } from "../utils/stateUtils";

export function PenLine({ id, isSelected, type, ...shapeProps }: { id: string, isSelected: boolean, type: string }) {
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

    return (
        <>
            <Line
                onClick={handleSelect}
                onTap={handleSelect}
                onDragStart={handleSelect}
                ref={shapeRef}
                draggable={!isDrawing}
                onDragEnd={handleDrag}
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={'source-over'}
                {...shapeProps}
            />
            {isSelected && (
                <Transformer
                    anchorSize={5}
                    borderDash={[6, 2]}
                    ref={transformerRef}
                />
            )}
        </>
    );
}
