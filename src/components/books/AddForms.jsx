"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Add_Books } from "@/server/super_admin/books";

export default function BookForm({ categories }) {
  const [form, setForm] = useState({
    coverImage: null,
    title: "",
    author: "",
    category: "",
    publisher: "",
    isbn: "",
    year: "",
    pages: "",
    description: "",
    stock: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.author || !form.category || !form.publisher || !form.isbn || !form.year || !form.pages || !form.description || !form.stock) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseInt(form.stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }
    
    console.log(form)

    try {
      const response = await Add_Books(form);
      if (response.success) {
        toast.success(response.message);
        setForm({
          coverImage: "",
          title: "",
          author: "",
          category: "",
          publisher: "",
          isbn: "",
          year: "",
          pages: "",
          description: "",
          stock: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
        <p className="text-sm text-gray-500">Fill in the details below to add a book to the library.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                       focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                       focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                       focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id} className="text-black">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Publisher, ISBN, Year, Pages */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pages</label>
            <input
              type="number"
              name="pages"
              value={form.pages}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                       focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
          />
        </div>

        {/* Stock & Borrowed */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 border border-transparent 
                       text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500"
          >
            Save Book
          </button>
        </div>
      </form>
    </div>
  );
}
