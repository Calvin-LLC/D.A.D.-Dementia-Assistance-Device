import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonCard,
  IonCardContent,
  IonItemSliding,
} from "@ionic/react";
import axios from "axios";

import { useState, useEffect } from "react";
import { data_recieve, get_current_screen, save_screen } from "./data";
import "./Tab1.css";

const Tab1 = () => {
  // states
  const [cols, setCols] = useState([]);

  var old_obj = new Array();
  var parsed_data = new Array();
  var parsed_obj = new Array();
  var toggles = new Array(20); // ! make sure it only has 20 total arrays, memory management people!!!!

  const store_data = () => {
    data_recieve()
      .then((response) => {
        //console.log(response);
        if (response.success != "1") return;

        var len = response.data.length;
        if (response.data == old_obj) len = 0;
        else setCols([]);
        console.log("length: " + len);
        for (var i = 0; i < len; ++i) {
          parsed_data[i] =
            "Type: " +
            response.data[i].type +
            "\nValue: " +
            response.data[i].value;
          setCols((cols) => [...cols, parsed_data[i]]);
        }
        old_obj = response.data;
      })
      .catch((err) => {
        console.log("caught error: " + err);
      });
  };

  useEffect(() => {
    setInterval(() => {
      if (get_current_screen() == 1) store_data(); //i get ran every 10 seconds
    }, 2000);
  }, []);

  function LoaderFunc(params){
    useEffect(()=>{
      save_screen(1);
    }, [])
    return <div></div>
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <LoaderFunc/>
        <IonGrid>
          <IonRow>
            {cols.map((col, i) => (
              <IonCol size="6" key={i + 1}>
                <IonCard key={i + 1}>
                  <IonCardContent key={i + 1}>{i + ": " + col}</IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
