import React from "react";
import { FaUndo, FaCheckCircle, FaInfoCircle, FaClipboardCheck } from "react-icons/fa";

export default function Return() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      
      {/* Header */}
      <div className="text-center mb-10">
        <FaUndo className="text-5xl text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Return & Refund Policy</h1>
        <p className="text-gray-600">
          We ensure a smooth and customer-friendly return & refund process.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaCheckCircle className="text-blue-600" /> Easy Refund Policy
        </h2>
        <p className="text-gray-700 leading-7">
          If there is any issue with your product, you can apply for a return or refund.
          We process refunds <span className="font-semibold">within 2 days</span> 
          after verifying the product and the issue.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaInfoCircle className="text-blue-600" /> Conditions for Refund
        </h2>
        <p className="text-gray-700 leading-7">To qualify for a refund:</p>

        <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
          <li>Reason must be genuine (e.g., damaged item, wrong product, defective product).</li>
          <li>Product must be in unused & safe condition.</li>
          <li>Original receipt/bill must be provided.</li>
          <li>Return request must be placed within <strong>48 hours (2 days)</strong> of delivery.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaClipboardCheck className="text-blue-600" /> Return/Refund Process
        </h2>

        <ul className="list-decimal ml-6 mt-3 space-y-2 text-gray-700">
          <li>Contact our support team using WhatsApp or Email.</li>
          <li>Share product images/video and your order receipt.</li>
          <li>We will verify the issue and approve the return.</li>
          <li>Pickup will be arranged (if applicable).</li>
          <li>Your refund will be processed within <strong>2 days</strong>.</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 p-6 rounded-xl border mt-8">
        <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-700">
          For return or refund issues, contact us anytime:
        </p>

        <div className="mt-3 text-gray-800">
          📧 Email:{" "}
          <a
            href="mailto:amritmr760@gmail.com"
            className="text-blue-600 underline"
          >
            amritmr760@gmail.com
          </a>
          <br />
          📞 Phone: <span className="font-medium">+91 9315868930</span>
        </div>
      </section>

      {/* Footer Note */}
      <p className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Saheli Products — All Rights Reserved.
      </p>
    </div>
  );
}
