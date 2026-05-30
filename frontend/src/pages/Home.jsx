import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTab === "dashboard") {
      navigate("/dashboard");
    }
  }, [selectedTab, navigate]);

  return <></>;
};

export default Home;