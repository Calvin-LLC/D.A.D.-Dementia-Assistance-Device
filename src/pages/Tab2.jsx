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
  IonLabel,
  IonListHeader,
} from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import "./Tab2.css";
import { get_reminder_data, send_reminder_data, remove_reminder_data } from "./data";
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
  var parsed_obj = new Array();

  const update_reminder = () => {
    get_reminder_data().then((response) => {
      var len = response.data.length;
      if (response.data == old_obj) len = 0;
      else if (mounted_prop.current) setCols([]);
      for (var i = 0; i < len; ++i) {
        parsed_obj[i] = {date : format(parseISO(response.data[i].date), 'PPPPpppp'), reminder : response.data[i].reminder};
        setCols((cols) => [...cols, parsed_obj[i]]);
      }
      old_obj = response.data;
    }).catch((err) => {
      console.log("Error caught: " + err);
    });
  };

  const add_reminder = () => {
    const reminder_msg = reminder_data.current.value;

    if (!reminder_msg || !selectedDate) return;

    send_reminder_data({ date: selectedDate, reminder: reminder_msg }).then(
      () => {
        update_reminder();
      }
    );
  };

  const delete_reminder = (i) => {
    console.log(i);
    remove_reminder_data(i);
  }

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
            <div key={i + 1}>
              <IonListHeader lines="none">
                <IonLabel>{col.date}</IonLabel>
              </IonListHeader>
              <IonItem lines="full">
                <IonLabel>{"- " + col.reminder}</IonLabel>
              </IonItem>
              <IonButton slot="end" onClick={() => {
                delete_reminder(i);
              }}>X</IonButton>
            </div>
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
