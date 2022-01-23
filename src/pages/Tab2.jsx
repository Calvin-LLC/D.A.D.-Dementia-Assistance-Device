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
  IonCardContent,
  IonToolbar,
} from "@ionic/react";
import { useState, useEffect } from "react";
import "./Tab2.css";
import { save_screen, get_reminder_data, send_reminder_data } from "./data";

import Calendar from "react-calendar";

const Tab2 = () => {
  function LoaderFunc(params) {
    useEffect(() => {
      save_screen(2);
    }, []);
    return <div></div>;
  }

  const [reminders, setReminders] = useState([]);

  const [value, setValue] = useState(new Date());

  const onChange = (newValue) => {
    setValue(newValue);
  };

  var old_length = null;
  const update_reminder = () => {
    get_reminder_data().then((response) => {
      var len = response.data.length;
      if (len = old_length) len = 0;
      for (var i = 0; i < len; ++i) {
        setReminders((reminders) => [...reminders, response.data[i].reminder]);
      }
      old_length = len;
    });
  };

  return (
    <IonPage>
      <LoaderFunc />

      <IonGrid>
        <IonRow>
          {reminders.map((reminder, i) => (
            <IonCol size="6" key={i + 1}>
              <IonCard key={i + 1}>
                <IonCardContent key={i + 1}>{reminder}</IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <IonButton onClick={update_reminder}>Update Reminders</IonButton>

      <Calendar onChange={onChange} value={value} />
    </IonPage>
  );
};

export default Tab2;
