import classNames from "classnames";
const BackgroundVideo = ({ className }) => {
  var classes = classNames([className, "hero-video"]);
  return (
    <div className={classes}>
      <video
        loop
        autoPlay
        preload="auto"
        muted
        src="https://player.vimeo.com/progressive_redirect/playback/736063540/rendition/1080p/file.mp4?loc=external&signature=1a1ded52dc33bd7bf95957474504e1e8985bc756a76f9eb165d4ac2a46126e04"
      ></video>
    </div>
  );
};
export default BackgroundVideo;
