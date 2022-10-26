import { useRef, useEffect, useCallback } from "react";
import { RegularPolygon, Transformer } from "react-konva";

import { selectShape, moveShape, useStates } from "../utils/stateUtils";

export function Triangle({ id, isSelected, type, ...shapeProps }: { id: string, isSelected: boolean, type: string }) {
    const isDrawing = useStates((state) => state.isDrawing);
    const shapeRef = useRef<any>();
    const transformerRef = useRef<any>();

    useEffect(() => {
        if (isSelected) {
            transformerRef.current.nodes([shapeRef.current]);
            transformerRef.current.getLayer().batchDraw();
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
            <RegularPolygon
                ref={shapeRef}
                onClick={handleSelect}
                onTap={handleSelect}
                onDragStart={handleSelect}
                draggable={!isDrawing}
                onDragEnd={handleDrag}
                radius={200}
                sides={3}
                width={100}
                height={100}
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
