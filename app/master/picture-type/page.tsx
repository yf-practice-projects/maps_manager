import DataTable from "@/app/_component/master/pictureType/dataTable";
import { PictureTypeResponse } from "@/app/_definitions/store";

export default async function Home() {
  const picturesTypes:PictureTypeResponse = await fetch(`${process.env.DEPLOY_PRIME_URL}/api/master/picture-type`, {
		method: "GET",
		cache: "no-store"
	}).then(response => {
		return response.json();
	})
  return (
    <div className="flex w-full justify-center">
      <DataTable fetchPictureTypes={ picturesTypes.data }></DataTable>
    </div>
  );
}
