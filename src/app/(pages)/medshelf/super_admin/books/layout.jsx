import BooksNavbar from "@/components/books/BooksNavbar";

export default function BooksLayout({ children }) {
    return <div><BooksNavbar/>{children}</div>;
}