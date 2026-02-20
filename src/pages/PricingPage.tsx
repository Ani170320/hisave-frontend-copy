import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PricingPage.css";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  aiSearches: number;
  offerUnlocks: number;
  isBestValue?: boolean;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await axios.get("/getSubscriptionPlans");

    const apiData = response.data;

    // 🔥 Convert object plans into array
    if (apiData?.data && typeof apiData.data === "object") {
      const plansArray = Object.entries(apiData.data).map(
        ([key, value]: any) => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          price: value.price,
          duration: value.duration,
          aiSearches: value.aiSearches,
          offerUnlocks: value.offerUnlocks,
          isBestValue: key === "annual"
        })
      );

      setPlans(plansArray);
    } else {
      setPlans([]);
    }

  } catch (err) {
    console.error("Failed to fetch subscription plans:", err);
    setError("Unable to load plans. Please try again.");
  } finally {
    setLoading(false);
  }
};  

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    navigate("/checkout", {
      state: { selectedPlan: plan },
    });
  };

  return (
    <div className="pricing-wrapper">
      <div className="pricing-top">
        <h1>Unlock Smart Savings with HiSAVE AI</h1>
        <p>
          Personalized card-based offers. AI-powered savings insights.
          Premium experience.
        </p>
      </div>

      {loading && (
        <div className="pricing-loading">
          <h3>Loading Plans...</h3>
        </div>
      )}

      {error && (
        <div className="pricing-error">
          <p>{error}</p>
          <button onClick={fetchSubscriptionPlans}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="pricing-grid">
          {plans.length === 0 ? (
            <h3>No Plans Available</h3>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${
                  plan.isBestValue ? "highlight-card" : ""
                }`}
              >
                {plan.isBestValue && (
                  <div className="best-badge">Best Value</div>
                )}

                <h2>{plan.name}</h2>
                <div className="price">₹{plan.price}</div>
                <span className="plan-duration">{plan.duration}</span>

                <ul>
                  <li>{plan.offerUnlocks} Offer Unlocks</li>
                  <li>{plan.aiSearches} AI Smart Searches</li>
                  <li>Ad-Free Experience</li>
                  <li>Priority Support</li>
                </ul>

                <button
                  className="select-btn"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Choose Plan
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="pricing-bottom">
        Secure payments • Cancel anytime • Instant activation
      </div>
    </div>
  );
};

export default PricingPage;