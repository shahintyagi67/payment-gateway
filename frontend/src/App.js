import { useEffect } from "react";
import "./App.css";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import PlanPage from "./component/CheckoutForm";

function App() {
  async function requestPermission(){
    const permission = await Notification.requestPermission();
    if(permission === 'default'){
      requestPermission();
    }else if(permission === 'granted'){
      console.log('Notification permission already granted');
       const token = await getToken(messaging, { vapidKey: "BEv-vgL4UHNxR_HIsEz-I5gFLkoL9lDt788uYvY5Er3nskm74-I7i2q0xTy_Yo5a3mmeiKIIhGcCem588ZWqJG4" })
       console.log('Token', token);
      await axios.post("http://localhost:7000/notification/save-token", { token })
  .catch((err) => {
    console.error("❌ Token save failed:", err.response?.data || err.message);
  });
     
    }else if(permission === 'denied'){
      console.log('Notification permission denied');
    }
  }
  
  useEffect(() => {
    requestPermission();

    const unsubscribe = onMessage(
      messaging,
      (payload) => {
        console.log('Message received. ', payload);
        alert(`${payload.notification.title}: ${payload.notification.body}`);
      }
    );
        // ✅ Check for session_id and notify backend
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      axios.get(`http://localhost:7000/api/payment-success?session_id=${sessionId}`)
        .then(() => {
          console.log("✅ Payment verification triggered");
        })
        .catch(err => {
          console.error("❌ Error triggering payment success:", err.message);
        });
    }
    return () =>unsubscribe();
  }, []);

  // New code to detect payment success query param and show alert
  // const urlParams = new URLSearchParams(window.location.search);
  // if (urlParams.get('success') === 'true') {
  //   alert('Payment was successful!');
  // }

  return (
    <div className="App">
      <h1>Payment</h1>
      <PlanPage />
    </div>
  );
}

export default App;




