import Lottie from "lottie-react";
import loadingLottie from "assets/lottie/ThreadsLoading.json";
import "./Loading.modules.scss";

const Loading = () => {
  return (
    <div
      className='loading'
      style={{height: "100vh"}}>
      <Lottie animationData={loadingLottie} />
    </div>
  );
};

export default Loading;
