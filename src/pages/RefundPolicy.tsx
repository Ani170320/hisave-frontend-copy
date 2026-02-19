import React from "react";
import "../css/refund-policy.css";

const RefundPolicy: React.FC = () => {
  return (
    <div className="policy-layout">

      <main className="policy-main">
        <div className="policy-card">

          <h1>Refund & Cancellation Policy</h1>

          <p><strong>Effective Date:</strong> 1st January 2026</p>
          <p><strong>Website:</strong> www.gohisave.com</p>

          <section id="overview" className="fade-section">
            <h2>Overview</h2>
            <p>
              HiSAVE operates a digital platform that aggregates and curates 
              card-linked offers, benefits, and promotional coupons from partner 
              card networks including Visa, Mastercard, and RuPay, along with 
              associated brands and merchants.
            </p>
            <p>
              This Refund & Cancellation Policy governs subscription payments 
              and digital offer access purchased through www.gohisave.com.
            </p>
            <p>
              By subscribing to HiSAVE services, you acknowledge and agree 
              to the terms outlined below.
            </p>
          </section>

          <section id="nature" className="fade-section">
            <h2>Nature of Service</h2>
            <p>HiSAVE provides:</p>
            <ul>
              <li>Access to curated card network offers</li>
              <li>Discovery of digital coupons and promotions</li>
              <li>Subscription-based platform services</li>
            </ul>
            <p>
              HiSAVE does not directly sell physical goods or independently fulfil 
              merchant offers. Redemption of offers is subject to respective merchant 
              and card network terms.
            </p>
          </section>

          <section id="fees" className="fade-section">
            <h2>Subscription Fees – Refund Eligibility</h2>

            <h3>General Rule</h3>
            <p>
              Subscription fees paid for access to the HiSAVE platform are 
              non-refundable once access has been granted.
            </p>

            <h3>Exceptions</h3>
            <p>Refunds may be considered only under the following circumstances:</p>
            <ul>
              <li>Verified technical failure preventing access to the platform</li>
              <li>Duplicate payment due to system error</li>
              <li>Payment charged but subscription not activated</li>
            </ul>

            <p><strong>Refund requests must be submitted within 7 days of payment.</strong></p>

            <p>Refunds will not be granted for:</p>
            <ul>
              <li>Change of mind</li>
              <li>Non-usage of the platform</li>
              <li>Lack of offer suitability</li>
              <li>Misunderstanding of merchant-specific terms</li>
              <li>Card ineligibility for specific offers</li>
            </ul>
          </section>

          <section id="offers" className="fade-section">
            <h2>Digital Offers & Coupons</h2>

            <h3>Redemption Responsibility</h3>
            <p>Offer redemption is governed by:</p>
            <ul>
              <li>Issuing card network terms</li>
              <li>Participating merchant policies</li>
              <li>Offer validity conditions</li>
            </ul>

            <p>HiSAVE is not responsible for:</p>
            <ul>
              <li>Merchant refusal due to non-eligibility</li>
              <li>Expired offers</li>
              <li>User failure to comply with redemption conditions</li>
            </ul>

            <h3>Non-Reissuance</h3>
            <p>
              Once a coupon or access code is revealed, accessed, or used:
            </p>
            <ul>
              <li>It cannot be reissued</li>
              <li>It cannot be reused</li>
              <li>It cannot be transferred</li>
              <li>It is not refundable</li>
            </ul>
          </section>

          <section id="refund-process" className="fade-section">
            <h2>Refund Request Process</h2>

            <p>To initiate a refund request:</p>

            <p>📧 Email: support@gohisave.com</p>
            <p>📱 WhatsApp (Support Only): +91 95999 99898</p>

            <p>Please include:</p>
            <ul>
              <li>Registered email ID</li>
              <li>Order number</li>
              <li>Payment confirmation</li>
              <li>Description of the issue</li>
              <li>Relevant screenshots (if applicable)</li>
            </ul>

            <h3>Processing Timeline</h3>
            <ul>
              <li>Review time: Up to 5 business days</li>
              <li>Approved refunds: Processed within 14 business days</li>
              <li>Refund mode: Original payment method only</li>
              <li>Bank/gateway timelines may vary</li>
            </ul>

            <p>
              HiSAVE reserves the right to deduct applicable payment gateway 
              or transaction charges where required by policy.
            </p>
          </section>

          <section id="cancellation" className="fade-section">
            <h2> Cancellation Policy</h2>
            <p>
              Users may cancel subscription renewal at any time before the 
              next billing cycle.
            </p>
            <p>
              Cancellation will stop future billing but does not entitle 
              refund for the current subscription period.
            </p>
            <p>
              No partial refunds for mid-cycle cancellations.
            </p>
          </section>

          <section id="fraud" className="fade-section">
            <h2>Fraud & Abuse Protection</h2>
            <ul>
              <li>Deny refunds in cases of suspected abuse or policy misuse</li>
              <li>Suspend accounts engaged in fraudulent activity</li>
              <li>Take appropriate legal action if required</li>
            </ul>
          </section>

          <section id="modifications" className="fade-section">
            <h2>Policy Modifications</h2>
            <p>
              HiSAVE may update this policy periodically. The updated version 
              will be posted on www.gohisave.com with a revised effective date.
            </p>
            <p>
              Continued use of the platform constitutes acceptance of the updated policy.
            </p>
          </section>

          <section id="contact" className="fade-section">
            <h2>9. Contact</h2>
            <p>Email: support@gohisave.com</p>
            <p>WhatsApp Support: +91 95999 99898</p>
            <p>Response SLA: Within 5 business days</p>
          </section>

        </div>
      </main>

    </div>
  );
};

export default RefundPolicy;