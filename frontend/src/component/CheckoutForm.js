// import React from 'react';
// import axios from 'axios';

// export default function CheckoutButton() {
//   const handleClick = async () => {
//     try {
//       const res = await axios.post('http://localhost:7000/api/create-payment-intent', {
//         name: 'Test Product',
//         image: 'https://via.placeholder.com/150',
//         amount: 2000,
//         quantity: 1,
//         currency: 'usd' 
//       });

//       window.location.href = res.data.url;
//     } catch (err) {
//       console.error('Error redirecting to Stripe Checkout:', err.message);
//     }
//   };
  
//   return (
//     <button onClick={handleClick}>
//      pay
//     </button>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch plans from backend
  useEffect(() => {
    axios.get("http://localhost:7000/plan/get")
      .then(res => {
        setPlans(res.data.data);
      })
      .catch(err => {
        console.error("Failed to fetch plans", err.message);
      });
  }, []);

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // const userId = JSON.parse(localStorage.getItem("userId"))?._id;
  const userId = "6872b77f744d5bb5ed19c0a9";
  console.log("userid",userId)
  const handleContinue = async () => {
    if (!selectedPlan) return alert("Please select a plan");

    const amountInCents = parseFloat(selectedPlan.price.replace('$', '')) * 100;

    try {
      const res = await axios.post('http://localhost:7000/api/create-payment-intent', {
        userId,
        planId: selectedPlan._id,
        name: selectedPlan.name,
        image: 'https://via.placeholder.com/150',
        amount: amountInCents,
        quantity: 1,
        currency: 'usd'
      });
console.log("payyyyyyyyyyyyyyyyyyy", res)
      // window.location.href = res.data.url;
          if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      console.error("No URL returned from backend", res.data);
    }
    
    } catch (err) {
      console.error("Error redirecting to Stripe:", err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Choose a Plan</h2>
      {plans.map(plan => (
        <div
          key={plan._id}
          onClick={() => handleSelect(plan)}
          style={{
            padding: '12px',
            margin: '8px',
            border: selectedPlan?._id === plan._id ? '2px solid blue' : '1px solid gray',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <strong>{plan.name}</strong> - {plan.price}
          <p>{plan.description}</p>
        </div>
      ))}
      <button
        onClick={handleContinue}
        style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          marginTop: '10px',
        }}
      >
        Continue
      </button>
    </div>
  );
}
