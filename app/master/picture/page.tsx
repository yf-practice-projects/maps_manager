import DataTable from "@/app/_component/master/picture/dataTable";
import { PictureResponse, PictureTypeResponse, StoreResponse } from "@/app/_definitions/store";

export default async function Home() {

  // 画像リスト取得
  const pictures:PictureResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/master/picture`, {
		method: "GET",
		cache: "no-store"
	}).then(response => {
		return response.json();
	})

  // 店舗リスト取得
  const stores:StoreResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/master/store`, {
		method: "GET",
		cache: "no-store"
	}).then(response => {
		return response.json();
	})

  // 画像種別リスト取得
  const picturesTypes:PictureTypeResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/master/picture-type?fgDelete=false`, {
		method: "GET",
		cache: "no-store"
	}).then(response => {
		return response.json();
	})
  
  return (
    <div className="flex w-full justify-center">
      <DataTable fetchPictures={ pictures.data } fetchStores={stores.data} fetchPictureTypes={picturesTypes.data}></DataTable>
    </div>
  );
}
