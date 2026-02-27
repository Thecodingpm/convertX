import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

export const Root: React.FC = () => {
    return (
        <>
            <Composition
                id="PromoVideo"
                component={PromoVideo}
                durationInFrames={900} // 30 seconds at 30fps
                fps={30}
                width={1080}
                height={1920}
            />
        </>
    );
};
