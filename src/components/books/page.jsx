import React from 'react'
import { Mooli } from 'next/font/google'
import {client} from "@/sanity/lib/client"

const mooli = Mooli({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

export async function getServerSideProps(){
    const books = await client.fetch(`*[_type == "book"]`)
    return {
        props: {
            books,
        },
    }
}

const BooksCard = ({books}) => {

  return (
    <div>
        {books.map((book) => (
            <div key={book._id}>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <p>{book.category.name}</p>
                <p>{book.publisher}</p>
                <p>{book.isbn}</p>
                <p>{book.year}</p>
                <p>{book.pages}</p>
                <p>{book.description}</p>
                <p>{book.stock}</p>
                <p>{book.borrowed}</p>
                <p>{book.createdAt}</p>
                <p>{book.updatedAt}</p>
            </div>
        ))}
    </div>
  )
}

export default BooksCard