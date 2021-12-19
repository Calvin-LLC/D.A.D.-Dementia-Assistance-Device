import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { useState } from "react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";

const Tab2: React.FC = () => {
  // states
  const [weather_data, set_weather_data] = useState<string>();

  const http_get = (URL: string) => {
    return axios({
      url: URL,
    }).then((response) => {
      return response.data;
    });
  };

  var weather_url = "http://api.weatherapi.com/v1/current.json?key=7640a167775a47be9a842820212111&q=35.8461766,-86.3773987&aqi=no";
  const update_weather = () => {
    http_get(weather_url).then((response: any) => {
      console.log(response);
      var weather_obj = JSON.parse(response);
      set_weather_data(response);
    });
    
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
          <IonButton onClick={update_weather}>Update Weather Widget!</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {weather_data && (
          <IonCard>
            <IonCardContent>{weather_data}</IonCardContent>
          </IonCard>
        )}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
