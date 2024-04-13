"use client";
import { useUserAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";

const ProductForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { user }: any = useUserAuth();
  const [messages, setMessages] = useState<any>([]);
  const { supabase }: any = useUserAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handleFileChange = (event: any) => {
    const fileList: File[] = Array.from(event.target.files);
    console.log(fileList);
    setImageFiles(fileList);
  };

  const handleUpload = async (id: string, imageFiles: File[]) => {
    console.log(imageFiles);
    Promise.all(
      imageFiles.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("Profile")
          .upload(`${id}`, file);
        if (error) {
          console.log(error.message);
          // Handle error
        } else {
          // Handle success
          const imageKey = data.key;
        }
      }),
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({
          title: title,
          category: category,
          ownerId: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();

      // Assuming the response from the server is an object with 'text' property
      setMessages([message.text, ...messages]);

      handleUpload(message.product.id, imageFiles);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h1 className="mt-5">Add Product</h1>
      <form
        className="border-2 border-red-500 max-w-96 mt-2 pt-5 pb-5 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title">Title:</label>
        <input
          className=" text-black"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
        <br />
        <label htmlFor="category">Category:</label>
        <input
          className=" text-black"
          type="text"
          value={category}
          onChange={handleCategoryChange}
        />
        <label htmlFor="images">Upload Images:</label>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
