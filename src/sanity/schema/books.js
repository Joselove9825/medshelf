import { defineType, defineField } from 'sanity';

export const books = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'pages',
      title: 'Pages',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
    }),
    defineField({
        name: "borrowers",
        title: "Borrowers",
        type: "array",
        of: [{ type: "reference", to: [{ type: "borrower" }] }],
    }),
    defineField({
      name: 'borrowed',
      title: 'Borrowed',
      type: 'number',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
      media: 'coverImage',
    },
  },
});
