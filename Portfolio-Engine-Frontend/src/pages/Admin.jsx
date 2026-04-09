import { useState } from "react";
import API from "../services/api";

const Admin = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    thumbnail: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/projects", form);
      alert("Project added!");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input name="title" placeholder="Title" onChange={handleChange} className="p-2 text-black"/>
        <input name="description" placeholder="Description" onChange={handleChange} className="p-2 text-black"/>
        <input name="shortDescription" placeholder="Short Desc" onChange={handleChange} className="p-2 text-black"/>
        <input name="thumbnail" placeholder="Image URL" onChange={handleChange} className="p-2 text-black"/>

        <button className="bg-cyan-500 p-2 rounded">Add Project</button>
      </form>
    </div>
  );
};

export default Admin;