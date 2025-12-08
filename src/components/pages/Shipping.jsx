import React from "react";
import { FaTruck, FaClock, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import Navbar from "../Navbar";

export default function Shipping() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      <Navbar />
      {/* Header */}
      <div className="text-center mt-10 mb-10">
        <FaTruck className="text-5xl text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Shipping Policy</h1>
        <p className="text-gray-600">
          Transparent and fast delivery service for every customer.
        </p>
      </div>

      {/* Delivery Time */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaClock className="text-blue-600" /> Delivery Time
        </h2>
        <p className="text-gray-700 leading-7">
          We aim to deliver all orders as quickly as possible.  
          Delivery time depends on your location and product availability.
        </p>

        <ul className="list-disc ml-6 mt-3 text-gray-700 space-y-2">
          <li>
            <strong>Minimum Delivery Time:</strong> 2 Days
          </li>
          <li>
            <strong>Maximum Delivery Time:</strong> 1 Week
          </li>
        </ul>
      </section>

      {/* Coverage */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaMapMarkerAlt className="text-blue-600" /> Delivery Coverage
        </h2>
        <p className="text-gray-700 leading-7">
          We deliver across India using trusted and verified courier partners.
          Delivery speed varies depending on:
        </p>

        <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
          <li>Your city or state</li>
          <li>Product stock availability</li>
          <li>Weather or festival delays</li>
        </ul>
      </section>

      {/* Additional Info */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <FaInfoCircle className="text-blue-600" /> Additional Information
        </h2>

        <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
          <li>Orders placed on Sunday or Holidays will be processed next business day.</li>
          <li>You will receive SMS/Email updates when your order is shipped.</li>
          <li>Tracking ID will be shared as soon as your order is dispatched.</li>
          <li>Remote or village areas may take extra 1–2 days for delivery.</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="bg-gray-100 p-6 rounded-xl border mt-8">
        <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-700">For any shipping-related queries, contact us:</p>

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
