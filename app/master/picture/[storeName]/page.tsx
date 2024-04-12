import DataTable from "@/app/_component/master/picture/dataTable";
import { PictureResponse } from "@/app/_definitions/store";

export default async function Page({ params }: { params: { storeName: string } }) {
	
	const pictures:PictureResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/master/picture/${params.storeName}`, {
		method: "GET",
		cache: "no-store"
	}).then(response => {
		return response.json();
	})

	return (
		<div className="text-center">
			<p>{ decodeURI(params.storeName) }</p>
			<DataTable fetchPictures={pictures.data}></DataTable>
		</div>
	)
}