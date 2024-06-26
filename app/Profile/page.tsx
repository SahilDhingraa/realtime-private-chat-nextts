// Profile directory with page.tsx file
"use client";
import React, { useEffect } from "react";
import { useUserAuth } from "../context/AuthContext";
import MyProducts from "../components/MyProducts";

const Profile = () => {
  const { user }: any = useUserAuth();

  useEffect(() => {
    const fetchAds = async () => {
      if (user) {
        try {
          const response = await fetch(
            `/api/product/${user.identities[0].user_id}`,
          );
          const data = await response.json();
          if (response.ok) {
          } else {
            throw new Error(data.error || "Failed to fetch ads");
          }
        } catch (error) {
          console.error("Error fetching ads:", error);
        }
      }
    };

    fetchAds();
  }, [user]);

  return (
    <div className="profile-container bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Profile Information</h1>
      <div className="user-info mb-4">
        <p className="text-lg">
          <strong>Name:</strong> {user?.user_metadata?.full_name || ""}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
      </div>

      <div>
        <p>My Products</p>
        <MyProducts />
      </div>
    </div>
  );
};

export default Profile;
