import React, {useState, useEffect} from "react";
import Router from "components/Router";
import Layout from "components/Layout";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {app} from "firebaseApp";
import {ToastContainer, Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "components/loading/Loading";

const App = () => {
  const auth = getAuth(app);
  const [isInit, setIsInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsInit(true);
    });
  }, [auth]);

  return (
    <Layout isAuthenticated={isAuthenticated}>
      <ToastContainer
        position='bottom-center'
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        transition={Bounce}
      />
      {isInit ? <Router isAuthenticated={isAuthenticated} /> : <Loading />}
    </Layout>
  );
};

export default App;
