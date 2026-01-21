import { defineType, defineField } from 'sanity';

export const borrowing = defineType({
  name: 'borrowing',
  title: 'Borrowing Record',
  type: 'document',
  fields: [
    defineField({
      name: 'book',
      title: 'Book',
      type: 'reference',
      to: [{ type: 'book' }],
    }),
    defineField({
      name: 'borrower',
      title: 'Borrower',
      type: 'reference',
      to: [{ type: 'borrower' }],
    }),
    defineField({
      name: 'borrowedAt',
      title: 'Borrowed At',
      type: 'datetime',
    }),
    defineField({
      name: 'returnDate',
      title: 'Return Date',
      type: 'datetime',
    }),
    defineField({
      name: 'returnStatus',
      title: 'Return Status',
      type: 'string',
      options: {
        list: [
          { title: 'Returned', value: 'returned' },
          { title: 'Not Returned', value: 'notReturned' },
        ],
      },
    }),
    defineField({
      name: 'fine',
      title: 'Fine',
      type: 'number',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'book.title',
      subtitle: 'borrower.studentId',
    },
  },
});
