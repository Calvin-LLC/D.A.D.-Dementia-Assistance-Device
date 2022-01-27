import {
  IonContent,
  IonPage,
  IonDatetime,
  IonHeader,
  IonText,
  IonToolbar,
  IonTitle
} from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import "./Tab2.css";

import { format, parseISO } from "date-fns";

const Tab2 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const customDatetime = useRef();
  const confirm = () => {
    if (customDatetime === undefined) return;

    customDatetime.confirm();
  };

  const reset = () => {
    if (customDatetime === undefined) return;

    customDatetime.reset();
  };

  const formatDate = (value) => {
    return format(parseISO(value), "MMM dd yyyy");
  };

  /*
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

  const add_reminder = () => {
    const reminder_msg = reminder_message.current.value;
    const reminder_time = time_of_reminder.current.value;

    if (!reminder_msg || !reminder_time) return;

    send_reminder_data({"date":reminder_time, "reminder":reminder_msg}).then(() => {
      update_reminder();
    });
  };*/

  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="title-th">
          <IonTitle>Reminders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonDatetime value={selectedDate} showClearButton={true}/>
    </IonPage>
  );
};

export default Tab2;