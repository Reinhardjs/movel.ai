import React from "react";
import { Image, Transformer } from "react-konva";
import { useStates } from "../utils/stateUtils";

const UrlImage = (props: any) => {

    const imageRef = React.useRef<any>();
    const transformerRef = React.useRef<any>();
    const previousImageUrl = React.useRef(props.imageUrl);
    const [image, setImage] = React.useState<any>();

    const loadImage = () => {
        const img = new window.Image();
        img.src = props.imageUrl;
        img.onload = () => {
            if (!image) {
                previousImageUrl.current = props.imageUrl;
                setImage(img)
                transformerRef.current!.nodes([imageRef.current]);
                transformerRef.current!.getLayer().batchDraw();
            } else {
                if (previousImageUrl.current !== props.imageUrl) {
                    previousImageUrl.current = props.imageUrl;
                    setImage(img)
                }
            }
        }
    }

    if (previousImageUrl.current !== props.imageUrl) {
        loadImage();
    }

    React.useEffect(() => {
        if (image && props.isImageSelected) {
            transformerRef.current!.nodes([imageRef.current]);
            transformerRef.current!.getLayer().batchDraw();
            console.log("hello")
        }
    }, [props.isImageSelected, image])

    const isDrawing = useStates((state) => state.isDrawing);
    return image && (
        <>
            <Image draggable={!isDrawing} image={image} ref={imageRef} x={50} y={125} />
            {
                props.isImageSelected === true ?
                    <Transformer
                        anchorSize={5}
                        borderDash={[6, 2]}
                        ref={transformerRef}
                    /> : undefined
            }
        </>
    )
}

export default UrlImage;
