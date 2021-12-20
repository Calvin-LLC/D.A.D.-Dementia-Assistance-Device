// importing all of our react libs
import React, { useRef, useState, useEffect } from "react"; // standard react to edit elements etc
import axios from "axios"; // ezpz web comm

import {
  IonApp,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonAlert,
  IonText,
  IonPage,
} from "@ionic/react";

import { arrowForwardOutline, eyeOutline, eyeOffOutline, banOutline } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./../theme/variables.css";
import { useHistory } from "react-router-dom";

/* Notes 
  // ! means that the code will never be ran unless the object is valid
  // ? means that itll check whether or not the object exists
  // + before var, changes it to number
*/

const Login: React.FC = (props) => {
  let history = useHistory();

  // states
  const [connected_status, set_connected_status] = useState<string>();
  const [logged_in, set_logged_in] = useState<string>();
  const [show_pass, set_show_pass] = useState<boolean>();
  const [pass_shown, set_pass_shown] = useState<string>();
  const [error, set_error] = useState<string>();

  // refs
  const username_ref = useRef<HTMLIonInputElement>(null);
  const password_ref = useRef<HTMLIonInputElement>(null);

  // website
  var login_url = "https://ziadabdelati.com/check.php?email=";
  

  const http_get = (URL: string) => {
    return axios({
      url: URL,
    }).then((response) => {
      console.log(response);
      return response.data;
    });
  };

  const promise_error = (error: string) => {
    set_error(error);
    console.log("set error");
  };

  const send = () => {
    const username = username_ref.current!.value; // the ? after current checks if the connections (refs) exists or not, an ! means we garauntee the fact that the value exists
    const password = password_ref.current!.value;

    if (!username || !password) return;

    login_url += username + "&pword=" + password;
    var res = http_get(login_url).then((response: any) => {
      if (response == 240) {
        console.log("correct data sent, redirecting");
        set_logged_in("");
        //history.push('./TabManager');
        history.replace("./TabManager");
      } else {
        console.log("incorrect pass");
        set_logged_in("Failed to log in!");
      }
    });

    console.log("return: " + res);
    console.log("username: " + username);
    console.log("password: " + password);
  };

  const reset = () => {
    username_ref.current!.value = "";
    password_ref.current!.value = "";
    set_connected_status("");
  };

  const clear_error = () => {
    set_error("");
  };

  const toggle_pass = () => {
    set_show_pass(!show_pass);
    set_pass_shown(show_pass ? "text" : "password");
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="title-th">
          <IonTitle>Smart Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput clearInput={true} type="email" ref={username_ref}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput clearOnEdit={false} type="text" ref={password_ref}></IonInput>
                {show_pass && (
                <IonIcon onClick={toggle_pass} slot="end" icon={eyeOutline}/>
                )}
                {!show_pass && (
                <IonIcon onClick={toggle_pass} slot="end" icon={eyeOffOutline}/>
                )}
              </IonItem>
              {logged_in && (
                <IonText>
                  <p className="error">Incorrect Password!</p>
                </IonText>
              )}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol className="ion-text-left">
              <IonButton onClick={send}>
                <IonIcon slot="end" icon={arrowForwardOutline} />
                Send
              </IonButton>
            </IonCol>

            <IonCol className="ion-text-right">
              <IonButton onClick={reset}>
                <IonIcon slot="end" icon={banOutline} />
                Reset
              </IonButton>
            </IonCol>
          </IonRow>
          {connected_status && (
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardContent>
                    <h2>{connected_status}</h2>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
