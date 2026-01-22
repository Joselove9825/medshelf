import { client } from "@/sanity/lib/client";
import toast from "react-hot-toast";

export default async function ManageBorrowing() {
  let borrowing = [];

  try {
    borrowing = await client.fetch(`
      *[_type == "borrowing"]{
        _id,
        borrowedAt,
        returnDate,
        returnStatus,
        fine,
        notes,

        book->{
          _id,
          title,
          author
        },

        borrower->{
          _id,
          firstName,
          lastName,
          studentId,
          email
        }
      }
    `);

    console.log("All borrowing data:", borrowing);
    console.log("Length:", borrowing.length);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch borrowing data");
  }

 return (
  <div className="p-8 max-w-7xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Manage Borrowing</h1>

    {borrowing.length === 0 ? (
      <p>No borrowing records found.</p>
    ) : (
      <div className="overflow-hidden rounded-2xl border border-gray-300 shadow-md">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4 text-left">Book</th>
              <th className="p-4 text-left">Student ID</th>
              <th className="p-4 text-left">Borrower</th>
              <th className="p-4 text-left">Borrowed Date</th>
              <th className="p-4 text-left">Return Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Fine</th>
            </tr>
          </thead>

          <tbody>
            {borrowing.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="p-4 border-t">{b.book?.title}</td>
                <td className="p-4 border-t">{b.borrower?.studentId}</td>
                <td className="p-4 border-t">
                  {b.borrower?.firstName} {b.borrower?.lastName}
                </td>
                <td className="p-4 border-t">
                  {new Date(b.borrowedAt).toLocaleDateString()}
                </td>
                <td className="p-4 border-t">
                  {new Date(b.returnDate).toLocaleDateString()}
                </td>
                <td className="p-4 border-t capitalize">
                  {b.returnStatus}
                </td>
                <td className="p-4 border-t font-semibold">
                  GH₵ {b.fine}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

}
