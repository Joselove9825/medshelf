import React from 'react'
import { client } from '@/sanity/lib/client'

export async function getServerSideProps() {
    const returned_books = await client.fetch(`*[_type == "book"]`);
    return {
        props: {
            books: returned_books,
        },
    };
}

export default function BooksCard({ books }) {
    return (
        <div>
            {books.map((book) => (
                <div key={book._id}>
                    <h1>{book.title}</h1>
                </div>
            ))}
        </div>
    )
}