import React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export const Helmet = () => {
  const { getToken } = useAuth();
  const [input, setInput] = useState({
    helmetId: "",
    helmetModel: "",
    firmwareVersion: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/registerHelmet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ helmetData: input }),
      },
    );

    const result = await response.json();
    console.log(result);
  };
  return (
    <div>
      <h1>Register your Helmet</h1>
      <form onSubmit={handleSubmit} method="POST">
        <label htmlFor="">Device ID</label>
        <br />
        <input
          type="text"
          id="helmetId"
          name="helmetId"
          placeholder="HelmetId"
          value={input.helmetId}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="helmetModel">Helmet Model Name</label>
        <br />
        <input
          type="text"
          id="helmetModel"
          name="helmetModel"
          placeholder="helmetModel"
          value={input.helmetModel}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="firmwareVersion"></label>
        <br />
        <input
          type="text"
          id="firmwareVersion"
          name="firmwareVersion"
          placeholder="Firmware version"
          value={input.firmwareVersion}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Helmet;
