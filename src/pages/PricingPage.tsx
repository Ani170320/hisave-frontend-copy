import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeService from "../services/HomeService";
import "../css/PricingPage.css";

interface SubscriptionPlan {
    id: number;
    name: string;
    totalPrice: string;
    pricePerMonth: string;
    durationMonths: number;
    duration: string;
    currency: string;
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

            const apiData = await HomeService.getSubscriptionPlans();

            if (apiData?.subscription_plans && Array.isArray(apiData.subscription_plans)) {
                const plansArray: SubscriptionPlan[] = apiData.subscription_plans.map((item: any) => ({
                    id: item.id,
                    name: item.plan_name,
                    totalPrice: item.total_price_inr,
                    pricePerMonth: item.price_per_month_inr,
                    durationMonths: item.duration_months,
                    duration:
                        item.duration_months === 12
                            ? "1 Year"
                            : item.duration_months === 1
                                ? "1 Month"
                                : `${item.duration_months} Months`,
                    currency: item.currency,
                    isBestValue: item.duration_months === 12,
                }));

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
                                className={`pricing-card ${plan.isBestValue ? "highlight-card" : ""}`}
                            >
                                {plan.isBestValue && (
                                    <div className="best-badge">Best Value</div>
                                )}

                                <h2>{plan.name}</h2>
                                <div className="price">₹{plan.totalPrice}</div>
                                <span className="plan-duration">{plan.duration}</span>
                                {plan.durationMonths > 1 && (
                                    <div className="price-per-month">₹{plan.pricePerMonth}/month</div>
                                )}

                                <ul>
                                    <li>Ad-Free Experience</li>
                                    <li>AI Smart Searches</li>
                                    <li>Offer Unlocks</li>
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