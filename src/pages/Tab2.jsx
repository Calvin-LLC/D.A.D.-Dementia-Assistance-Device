import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Tab2.css";
import { save_screen } from './data';

const Tab2 = () => {
  // states
  const [weather_data, set_weather_data] = useState();

  // data variables
  var grid_order = [];
  var grid_type = [];
  var grid_number = 10;

  function LoaderFunc(params){
    useEffect(()=>{
      save_screen(2);
    }, [])
    return <div></div>
  }

  return (
    <IonPage>
      <LoaderFunc/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
