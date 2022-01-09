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
import { Geolocation } from "@ionic-native/geolocation";
import "./Tab2.css";
import { save_screen } from './data';

const Tab2 = () => {
  // states
  const [weather_data, set_weather_data] = useState();

  // data variables
  var grid_order = [];
  var grid_type = [];
  var grid_number = 10;

  const http_get = (URL) => {
    return axios({
      url: URL,
    }).then((response) => {
      return response.data;
    });
  };

  var weather_url =
    "http://api.weatherapi.com/v1/current.json?key=7640a167775a47be9a842820212111&q=";

  const get_location = () => {
    return Geolocation.getCurrentPosition().then((response) => {
      return (
        weather_url +
        response.coords.longitude +
        "," +
        response.coords.latitude +
        "&aqi=no"
      );
    });
  };

  const update_weather = () => {
    get_location().then((url) => {
      console.log(url);
      http_get(url).then((response) => {
        var weather_obj = JSON.parse(JSON.stringify(response));
        console.log(weather_obj);
        set_weather_data(weather_obj.current.condition.text);
      });
    });
  };

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
        <IonButton onClick={update_weather}>Update Weather Widget!</IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
