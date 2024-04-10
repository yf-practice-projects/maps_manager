import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full justify-center">
      <Link href="/map/tokyo"><button className="h-20 w-64 m-4 border">map</button></Link>

      <Link href="/master"><button className="h-20 w-64 m-4 border">master</button></Link>
    </div>
  );
}
