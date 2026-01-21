import AddForm from '@/components/books/AddForms';
import { Mooli } from 'next/font/google';
import { client } from '@/sanity/lib/client';

const mooli = Mooli({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

// App Router: async default export for server component
export default async function Page() {
  const categories = await client.fetch(
    `*[_type == "category" && defined(_id)][0...100]{
      _id,
      name
    }`
  );

  return (
    <div className="w-full h-full">
      <AddForm categories={categories} />
    </div>
  );
}
