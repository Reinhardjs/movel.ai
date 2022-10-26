import React from "react";
import { Image } from "react-konva";
import { useStates } from "../utils/stateUtils";

const UrlImage = (props: any) => {

    const [image, setImage] = React.useState<any>();
    const previousImageUrl = React.useRef(props.imageUrl);

    const loadImage = () => {
        const img = new window.Image();
        img.src = props.imageUrl;
        img.onload = () => {
            if (!image)
                setImage(img)
        }
    }

    if (previousImageUrl.current !== props.imageUrl) {
        loadImage();
    }

    const isDrawing = useStates((state) => state.isDrawing);
    return image && (<Image draggable={!isDrawing} image={image} />)
}

export default UrlImage;
