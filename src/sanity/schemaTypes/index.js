import { books } from "../schema/books";
import { libarian } from "../schema/libarian";
import { category } from "../schema/category";
import { borrower } from "../schema/borrower";

export const schema = {
  types: [libarian, books, category, borrower],
}
