import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab3.css";
import { useEffect, useRef } from "react";
import { save_screen } from "./data";

const Tab3 = () => {
  const mounted_prop = useRef(true); // Initial value _isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      mounted_prop.current = false;
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <h2>Tab3</h2>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
