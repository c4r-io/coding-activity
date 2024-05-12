export const metadata = {
  title: 'Coding Activity',
  description: 'Coding Activity app description',
};
export default function RootLayout({ children }) {
  return (
    <div className=" bg-gray-100 dark:bg-gray-900 ">
      <>
        <div className="flex justify-center items-center h-screen w-screen">
          <div>{children}</div>
        </div>
      </>
    </div>
  );
}
