import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import WebcamContainer from "./components/WebcamContainer";
import FormComp from "./components/FormComp";

function App() {
  const [nameShop, setNameShop] = useState("");
  const [location, setLocation] = useState();
  const dateToDay = Date.now();
  const [isShopValid, setIsShopValid] = useState(false);

  useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude)
          setLocation({ latitude, longitude });
        },
        (error) => {
          setLocation({ latitude:"NaN", longitude:"NaN" });
          console.error("Erreur de géolocalisation:", error);
        }
      );
    } else {
      console.error("Géolocalisation non supportée par ce navigateur.");
      setLocation({ latitude:"NaN", longitude:"NaN" });
    }
  }, []);
  return (
    <div className="App">
      <Navbar />
      {!isShopValid ? (
        <FormComp nameShop={nameShop} setNameShop={setNameShop} setIsShopValid={setIsShopValid} />
      ) : (
        <WebcamContainer
         nameShop={nameShop} location={location} dateToDay={dateToDay}  />
      )}
    </div>
  );
}

export default App;
