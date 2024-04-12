import Folder from "@/app/_component/master/picture/folder";
import { PictureResponse, PictureTypeResponse, StoreResponse } from "@/app/_definitions/store";

export default async function Home() {

  // 店舗リスト取得
  const stores:StoreResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/master/store`, {
		method: "GET",
		cache: "no-store"
	}).then(response => {
		return response.json();
	})

  return (
    <div className="flex flex-col w-3/4">
      <Folder fetchStores={stores.data}></Folder>
    </div>
  );
}
