import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const CompleteProfile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [phone, setPhone] = useState();
  const [helmetId, setHelmetId] = useState();

  return (
    <div>
      <form action="">
        <h2>Complete Your Profile</h2>
        <label>Phone:</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label>Helmet ID:</label>
        <input
          value={helmetId}
          onChange={(e) => setHelmetId(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
