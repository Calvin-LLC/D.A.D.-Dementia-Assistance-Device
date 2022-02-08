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
  IonItemDivider,
  useIonPicker,
  IonSelect,
  IonSelectOption,
  IonModal,
  
} from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import "./Tab2.css";
import { get_reminder_data, send_reminder_data, remove_reminder_data } from "../componets/data";
import { format, parseISO } from "date-fns";
import { db_set, db_get } from "../componets/storage";

const Tab2 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);
  const [selectedDate, setSelectedDate] = useState();
  const selectedTime = useRef(null);
  const [cols, setCols] = useState([]);
  const [present] = useIonPicker();
  const [value, setValue] = useState(0);


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
      db_set("reminder_obj", parsed_obj);
      old_obj = response.data;
    }).catch((err) => {
      console.log("Error caught: " + err);
    });
  };

  const add_reminder = () => {
    const reminder_msg = reminder_data.current.value;

    if (!reminder_msg || !selectedDate) return;

    send_reminder_data({ date: selectedDate, reminder: reminder_msg, minutes_before : value }).then(
      () => {
        update_reminder();
        reminder_data.current.value = "";
      }
    );
  };

  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      update_reminder();
    }, 2000);
  }, []);

  useEffect(() => {
    db_get("reminder_obj").then((response) => {
      if (response) setCols(response);
    });
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
                <IonButton slot="end" onClick={() => {
                remove_reminder_data(i);
              }}>X</IonButton>
              </IonItem>
            </div>
          ))}

          <IonItemDivider/>
          <IonDatetime
            value={selectedDate}
            showClearButton
            onIonChange={(e) => setSelectedDate(e.detail.value)}
          >
            <div slot="title">Reminder Date and Time</div>
          </IonDatetime>
          <IonItem>
            <IonLabel>Minutes Before</IonLabel>
            <IonSelect value={value} placeholder="Select One" onIonChange={e => setValue(e.detail.value)}>
              <IonSelectOption value={0}>0</IonSelectOption>
              <IonSelectOption value={1}>1</IonSelectOption>
              <IonSelectOption value={5}>5</IonSelectOption>
              <IonSelectOption value={10}>10</IonSelectOption>
              <IonSelectOption value={15}>15</IonSelectOption>
              <IonSelectOption value={20}>20</IonSelectOption>
              <IonSelectOption value={25}>25</IonSelectOption>
              <IonSelectOption value={30}>30</IonSelectOption>
              <IonSelectOption value={35}>35</IonSelectOption>
              <IonSelectOption value={40}>40</IonSelectOption>
              <IonSelectOption value={45}>45</IonSelectOption>
              <IonSelectOption value={50}>50</IonSelectOption>
              <IonSelectOption value={55}>55</IonSelectOption>
              <IonSelectOption value={60}>60</IonSelectOption>
            </IonSelect>
          </IonItem>

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
