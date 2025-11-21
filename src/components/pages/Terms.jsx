import React from "react";
import {
  FaFileContract,
  FaShieldAlt,
  FaMoneyBillWave,
  FaInfoCircle,
} from "react-icons/fa";

export default function Terms() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">

      {/* Header */}
      <div className="text-center mb-10">
        <FaFileContract className="text-5xl text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-gray-600">
          Please read these terms carefully before using our services.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaShieldAlt className="text-blue-600" /> Use of Services
        </h2>
        <p className="text-gray-700 leading-7">
          By accessing or purchasing from Saheli Products, you agree to comply
          with all the terms mentioned below. These terms apply to all users,
          shoppers, and visitors of our platform.
        </p>
      </section>

      {/* Section 2 - Payment Policy */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaMoneyBillWave className="text-blue-600" /> Payment Terms
        </h2>
        <p className="text-gray-700 leading-7 mb-3">
          To ensure safe and secure transactions, we follow a strict payment
          verification process.
        </p>

        <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
          <li>
            <strong>Payment must be completed before the product is delivered.</strong>
          </li>
          <li>
            This rule is followed <strong>for security reasons</strong> and to avoid
            fraud or misuse.
          </li>
          <li>
            Orders will be processed only after successful payment confirmation.
          </li>
          <li>
            Once payment is confirmed, the product will be dispatched immediately
            based on the shipping timeline.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaInfoCircle className="text-blue-600" /> Order Confirmation
        </h2>
        <p className="text-gray-700 leading-7">
          After placing an order, you will receive an order confirmation via
          email or SMS. In case of any incorrect information, you must contact
          us immediately to avoid delays.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-blue-600">
          Shipping, Returns & Refunds
        </h2>
        <p className="text-gray-700 leading-7">
          All shipping, return, and refund-related information is available on
          their respective dedicated pages. Please review them before placing
          an order to avoid confusion.
        </p>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 p-6 rounded-xl border mt-8">
        <h3 className="text-xl font-semibold mb-2">Need Support?</h3>
        <p className="text-gray-700">
          If you have questions regarding these terms, feel free to contact us:
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

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Saheli Products — All Rights Reserved.
      </p>
    </div>
  );
}
