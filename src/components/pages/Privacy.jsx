import React from "react";
import { FaShieldAlt, FaLock, FaUserSecret, FaDatabase } from "react-icons/fa";
import Navbar from "../Navbar";

export default function Privacy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
<Navbar />

      {/* Header */}
      <div className="text-center mt-10 mb-10">
        <FaShieldAlt className="text-5xl text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600">
          Your privacy is important to us. Please read this policy carefully.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaLock className="text-blue-600" /> Information We Collect
        </h2>
        <p className="text-gray-700 leading-7">
          We collect personal information that you voluntarily provide while
          placing an order or creating an account. This may include:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
          <li>Amrit Kumar</li>
          <li>ag1740530@gmail.com</li>
          <li>9315868930</li>
          <li>Order dispatch in only 5hrs </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaUserSecret className="text-blue-600" /> How We Use Your Data
        </h2>
        <p className="text-gray-700 leading-7">
          We use your information to process orders, improve customer service,
          and enhance your shopping experience. Your data helps us:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
          <li>Process and deliver your orders</li>
          <li>Send important notifications about your purchase</li>
          <li>Improve our product quality and services</li>
          <li>Respond to customer queries and support</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaDatabase className="text-blue-600" /> Data Protection
        </h2>
        <p className="text-gray-700 leading-7">
          We implement strong security measures to protect your personal data.
          Your information is stored securely and never shared with third
          parties unless required for order fulfillment or by law.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">
          Cookies & Tracking
        </h2>
        <p className="text-gray-700 leading-7">
          We may use cookies to improve your shopping experience. Cookies help
          us remember your preferences and optimize our website’s performance.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
        <p className="text-gray-700 leading-7">
          You have the right to request access to your personal data, ask for
          corrections, or request deletion of your information. To do so, you
          can contact us anytime.
        </p>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 p-6 rounded-xl border mt-8">
        <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, feel free to
          contact:
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
