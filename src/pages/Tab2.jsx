import {
  IonContent,
  IonPage,
  IonDatetime,
  IonHeader,
  IonText,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonInput,
  IonButton,
  IonList,
  IonCol,
  IonItem,
  IonCard,
} from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import "./Tab2.css";
import { get_reminder_data, send_reminder_data } from "./data";
import { format, parseISO } from "date-fns";

const Tab2 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);
  const [selectedDate, setSelectedDate] = useState();
  const [cols, setCols] = useState([]);

  var old_obj = new Array();

  const update_reminder = () => {
    get_reminder_data().then((response) => {
      var len = response.data.length;
      if (response.data == old_obj) len = 0;
      else if (mounted_prop.current) setCols([]);
      for (var i = 0; i < len; ++i) {
        //console.log(response.data[i].reminder);
        setCols((cols) => [...cols, response.data[i].reminder]);
      }
      old_obj = response.data;
    });
  };

  const add_reminder = () => {
    const reminder_msg = reminder_data.current.value;
    console.log(selectedDate);
    if (!reminder_msg || !selectedDate) return;

    send_reminder_data({ date: selectedDate, reminder: reminder_msg }).then(
      () => {
        update_reminder();
      }
    );
  };

  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      update_reminder();
    }, 2000);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="title-th">
          <IonTitle>Reminders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {cols.map((col, i) => (
            <IonItem lines="inset" key={i + 1}>
              <IonTitle key={i + 1}>{col}</IonTitle>
            </IonItem>
          ))}

          <IonDatetime
            value={selectedDate}
            showClearButton
            onIonChange={(e) => setSelectedDate(e.detail.value)}
          >
            <div slot="title">Reminder Date and Time</div>
          </IonDatetime>

          <IonItem>
            <IonInput ref={reminder_data} placeholder="Reminder message" />
            <IonButton onClick={add_reminder}>Add Reminder</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
