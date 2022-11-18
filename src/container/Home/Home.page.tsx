import React, { FC, useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/AppProvider';
import Image from '../../components/Image/Image.comp';
import Modal from '../../components/Modal/Modal.comp';
import GO_HIKE_LOGO from '../../assets/images/logo-go-hike.jpg';
import useStorage from '../../hooks/useStorage';

export interface IPropsHome {}

export interface IStateHome {
  modalShow: boolean;
}

const Home: FC<IPropsHome> = () => {
  const [state, mState] = useState<IStateHome>({ modalShow: false });

  const [token, _, clearToken] = useStorage('access_token_gohike');

  const setState = (newState: any) =>
    mState((prev: IStateHome) => ({
      ...prev,
      ...newState,
    }));

  const context = useContext(AppContext);

  useEffect(() => {
    // ?appid=gohike&redirect=100
    // if (!token) {
    //   window.location.reload();
    // }
    console.log(context.userData);
  }, []);

  const handleModalOnConfirm = () => {
    clearToken();
    window.location.replace(`http://${process.env.MFES_BOOTSTRAP}`);
  };

  return (
    <>
      <Modal
        visibility={state.modalShow}
        onCancel={() => setState({ modalShow: false })}
        onConfirm={handleModalOnConfirm}
      />
      <section className="bg-white dark:bg-gray-900 p-4 box-border h-screen">
        <div className="flex flex-col content-center items-center justify-center max-w-lg mx-auto h-full min-h-full">
          <div className="flex-1">
            <Image className="mt-4" src={GO_HIKE_LOGO} alt="Logo GoHike" />
            <h2 className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-white">
              Welcome, GoHike App!
            </h2>

            <p className="mt-5 text-gray-500 dark:text-gray-300">
              GoHike is indonesian best electric scooter rental service app with
              a clear mission:
            </p>
            <p className="mt-3 text-gray-500 dark:text-gray-300">
              to revolutionise a mobility sector plagued with pollution,
              congestion, and rising fuel prices, with electric rental bikes.
            </p>
            <p className="mt-3 text-gray-500 dark:text-gray-300">
              Goto provides sanitised scooters and ebike for rent in Bangalore,
              Hyderabad and Mumbai.
            </p>
            <p className="mt-3 text-gray-500 dark:text-gray-300">
              <b>UserData:</b> {token && JSON.parse(token)}
            </p>
          </div>
          <div className="control-bottom w-full px-1">
            <button
              type="button"
              onClick={() => setState({ modalShow: true })}
              className="block w-full px-5 py-2 text-white bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
