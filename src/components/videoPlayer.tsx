import {type MutableRefObject, useRef} from "react";

export const VideoPlayer = (props: {
    className?: string,
    ref: MutableRefObject<HTMLVideoElement | null>,
    url: string,
    muted: boolean,
    isPlaying: boolean,
    showControls: boolean,
    loop: boolean
}) => {
    const videoRef = useRef<HTMLVideoElement>(props.ref?.current);

    if (props.isPlaying)
    {
        void videoRef.current?.play();
    }
    else
    {
        videoRef.current?.pause();
    }

    return (
        <video className={props.className} ref={videoRef} controls={props.showControls} loop={props.loop} muted={props.muted}>
            <source src={props.url} type="video/mp4"/>
        </video>
    )
}