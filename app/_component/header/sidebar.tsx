import Link from "next/link";

const Sidebar = () => {
	return (
    <div className="h-full w-60 top-0 left-0 bg-stone-400 pt-5">
      <Link className="pt-3 pb-4 text-lg block" href="/">TOP</Link>
      <Link className="pt-3 pb-4 text-lg block" href="/map/tokyo">Map</Link>
      <Link className="pt-3 pb-4 text-lg block" href="/master">Master</Link>
    </div>
  );
}

export default Sidebar