import {
  IonItem,
  IonList,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonModal,
} from "@ionic/react";

export const Pill_dispenser = () => {
  return (
    <IonModal
      backdropDismiss={true}
      animated={true}
      swipeToClose={true}
      trigger="pill-trigger"
    >
      <IonHeader>
        <IonToolbar color="primary" className="title-th">
          <center>
            <IonTitle>Pill Dispenser</IonTitle>
          </center>
        </IonToolbar>
      </IonHeader>

      <IonList>
          
      </IonList>
    </IonModal>
  );
};
