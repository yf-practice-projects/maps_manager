import Link from "next/link";
export default async function Home() {
  return (
    <div className="flex w-full justify-center">
      <Link href={"/master/picture"}><button className="h-20 w-64 m-4 border">picture</button></Link>
      <Link href={"/master/picture-type"}><button className="h-20 w-64 m-4 border">picture-type</button></Link>
    </div>
  );
}
