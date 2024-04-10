import ImageMap from "@/app/_component/maps/imageMap";
import { StoreResponse } from "@/app/_definitions/store";


export default async function Page({ params }: { params: { area: string } }) {
	  // 店舗リスト取得
		const stores:StoreResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/map/${params.area}`, {
			method: "GET",
			cache: "no-store"
		}).then(response => {
			return response.json();
		})
	

	return (
		<div>
			<ImageMap area={params.area} fetchStores={stores.data}/>
		</div>
	)
}