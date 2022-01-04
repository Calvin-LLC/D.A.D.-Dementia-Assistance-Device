import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import axios from "axios";

import { useState, useEffect } from "react";
import { data_recieve } from "./data";
import "./Tab1.css";

const Tab1 = () => {
  // states
  const [col1, setCol1] = useState();
  const [col2, setCol2] = useState();
  const [col3, setCol3] = useState();
  const [col4, setCol4] = useState();
  const [col5, setCol5] = useState();
  const [col6, setCol6] = useState();
  const [col7, setCol7] = useState();
  const [col8, setCol8] = useState();
  const [col9, setCol9] = useState();
  const [col10, setCol10] = useState();
  const [col11, setCol11] = useState();
  const [col12, setCol12] = useState();
  const [col13, setCol13] = useState();
  const [col14, setCol14] = useState();
  const [col15, setCol15] = useState();
  const [col16, setCol16] = useState();
  const [col17, setCol17] = useState();
  const [col18, setCol18] = useState();
  const [col19, setCol19] = useState();
  const [col20, setCol20] = useState();

  var data_obj = new Array(20);
  var toggles = new Array(20); // ! make sure it only has 20 total arrays, memory management people!!!!

  const test_obj = {
    "success": 1,
    "data": [
      {
        "connected": 1,
        "data": {
          "type": "door",
          "value": 10,
        },
      },

      {
        "connected": 1,
        "data": {
          "type": "door",
          "value": 5,
        },
      }
    ],
  };

  const store_data = () => {
    data_recieve().then((response) => {
      const temp_data = response;
      if (temp_data.success == 1) {
        console.log("items in list: " + temp_data.data.length);
        for (var i = 0; i < temp_data.data.length; ++i) {
          toggles[i] = temp_data.data[i].connected;
          data_obj[i] = temp_data.data[i].data.value;
          console.log("data: " + data_obj[i]);
          console.log("toggles: " + toggles[i]);
          if (data_obj[0].connected == 1) setCol1(data_obj[0].data);
          else if (data_obj[1].connected == 1) setCol2(data_obj[1].data);
        }
      }
    });
  };

  useEffect(() => {
    setInterval(() => {
      store_data(); //i get ran every 5 seconds
    }, 5000);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardContent>{col1}</IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardContent>{col2}</IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          
          {(toggles[0] || toggles[1]) && (
            <IonRow>
              {toggles[0] && (<IonCol>{col1}</IonCol>)}
              {toggles[1] && (<IonCol>{col2}</IonCol>)}
            </IonRow>
          )}
           {(toggles[2] || toggles[3]) && (
            <IonRow>
              {toggles[2] && (<IonCol>{col2}</IonCol>)}
              {toggles[3] && (<IonCol>{col3}</IonCol>)}
            </IonRow>
          )}
          <IonRow></IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
