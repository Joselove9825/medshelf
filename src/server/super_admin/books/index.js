"use server";
import { client } from "@/sanity/lib/client";

export const Fetch_Books = async () => {
    
};

export const Fetch_Books_by_id = async (id) => {
    
};

export const Add_Books = async (book) => {
  try {
    let imageAsset = null;

    // 1️⃣ Upload image if it exists
    if (book.coverImage) {
      imageAsset = await client.assets.upload(
        "image",
        book.coverImage,
        {
          filename: book.coverImage.name,
        }
      );
    }

    // 2️⃣ Create book document
    const result = await client.create({
      _type: "book",
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      description: book.description,

      category: {
        _type: "reference",
        _ref: book.category, // already an ID string
      },

      year: Number(book.year),
      pages: Number(book.pages),
      stock: Number(book.stock),
      borrowed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      coverImage: imageAsset
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id, 
            },
          }
        : undefined,
    });

    return {
      type: "success",
      success: true,
      message: "Book added successfully",
      data: result,
    };
  } catch (error) {
    return {
      type: "fail",
      success: false,
      message: error.message,
      data: null,
    };
  }
};


export const Update_Books = async (book) => {
    
};

export const Delete_Books = async (id) => {
    
};
