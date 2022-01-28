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
} from "@ionic/react";
import "./Tab3.css";
import { useEffect, useRef, useState } from "react";
import { send_reminder_contact } from "./data";

const Tab3 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);

  const [toast_data, set_toast_data] = useState();
  const [toast_data2, set_toast_data2] = useState();

  const add_reminder_person = () => {
    var reminder_info = reminder_data.current.value;

    if (!reminder_info) {
      set_toast_data2(true);
      return;
    }

    send_reminder_contact(reminder_info).then((response) => {
      set_toast_data(true);
    });
  };

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
        <IonList>
          <IonItem>
            <IonInput
              ref={reminder_data}
              placeholder="Reminder Email / Password"
            />
            <IonButton onClick={add_reminder_person}>
              Add Contact
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;