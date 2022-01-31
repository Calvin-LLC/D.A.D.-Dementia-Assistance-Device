import {
  IonContent,
  IonItemDivider,
  IonPage,
  IonToast,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonGrid,
  IonCard,
  IonCardContent,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonLabel,
} from "@ionic/react";
import "./Tab3.css";
import { useEffect, useRef, useState } from "react";
import { get_reminder_contact, send_reminder_contact } from "./data";

const Tab3 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);

  // states
  const [cols, setCols] = useState([]);
  const [toast_data, set_toast_data] = useState();
  const [toast_data2, set_toast_data2] = useState();

  var old_obj = new Array();
  var parsed_data = new Array();

  const add_reminder_person = () => {
    var reminder_info = reminder_data.current.value;

    if (!reminder_info) {
      set_toast_data2(true);
      return;
    }

    send_reminder_contact(reminder_info).then((response) => {
      console.log(response);
      set_toast_data(true);
    });
  };

  const store_data = () => {
    get_reminder_contact()
      .then((res) => {
        var response = res.data;
        console.log(res);
        var len = response.length;
        if (response == old_obj) len = 0;
        else if (mounted_prop.current) setCols([]);
        for (var i = 0; i < len; ++i) {
          parsed_data[i] = "~ " + response[i].contact;
          if (mounted_prop.current)
            setCols((cols) => [...cols, parsed_data[i]]);
        }
        old_obj = response;
      })
      .catch((err) => {
        console.log("caught error: " + err);
      });
  };

  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      store_data();
    }, 2000);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToast
          isOpen={toast_data}
          onDidDismiss={() => set_toast_data(false)}
          message="Successfully added a contact to the notification list"
          duration={1500}
        />
        <IonToast
          isOpen={toast_data2}
          onDidDismiss={() => set_toast_data2(false)}
          message="Please fill in the input field"
          duration={1500}
        />

        <IonHeader>
          <IonToolbar color="primary" className="title-th">
            <IonTitle>Contacts</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {cols.map((col, i) => (
            <IonItem lines="inset" key={i + 1}>
              <IonTitle key={i + 1}>{col}</IonTitle>
            </IonItem>
          ))}
          <IonItem>
            <IonInput
              ref={reminder_data}
              placeholder="Reminder Email / Password"
            />
            <IonButton onClick={add_reminder_person}>Add Contact</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
