import Lottie from "lottie-react";
import loadingLottie from "assets/lottie/ThreadsLoading.json";

const Loading = () => {
  return (
    <div className='loading'>
      <Lottie animationData={loadingLottie} />
    </div>
  );
};

export default Loading;
