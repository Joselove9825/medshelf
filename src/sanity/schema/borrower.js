import { defineType, defineField } from 'sanity';

export const borrower = defineType({
  name: 'borrower',
  title: 'Borrower',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'studentId',
      title: 'Student ID',
      type: 'string',
    }),
    defineField({
      name: 'program',
      title: 'Program',
      type: 'string',
      options: {
        list: [
          { title: 'Nursing', value: 'nursing' },
          { title: 'Midwifery', value: 'midwifery' },
          { title: 'Pharmacology', value: 'pharmacology' },
          { title: 'Pathology', value: 'pathology' },
          { title: 'Microbiology', value: 'microbiology' },
        ],
      },
    }),
    defineField({
      name: 'yearGroup',
      title: 'Year Group',
      type: 'number',
    }),
    defineField({
      name: 'contactNumber',
      title: 'Contact Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'studentId',
      media: 'profilePicture',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: `${title}`,
        subtitle: `ID: ${subtitle}`,
        media,
      };
    },
  },
});
