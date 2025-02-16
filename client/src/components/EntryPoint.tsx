import { CreateAnimal2 } from "../pages/CreateAnimal2";
import SplashPage from "../pages/SplashPage";

export default function EntryPoint({ userIsLoggedIn }: {userIsLoggedIn: boolean}) {
  return (
    <>
      {userIsLoggedIn ? <CreateAnimal2 /> : <SplashPage />}
    </>
  );
}
