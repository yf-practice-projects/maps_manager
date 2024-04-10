"use client"

import { PictureType, PictureTypeResponse } from "@/app/_definitions/store";
import { useState } from "react";

interface props {
	fetchPictureTypes:PictureType[]
}

const DataTable = ({ fetchPictureTypes }: props) => {
	const [type, setType] = useState<PictureType>({id:0, type:"", fgDelete:false})
	const [editFlag, setEditFlag] = useState<boolean>(false)
	const [pictureTypes, setPictureTypes] = useState<PictureType[]>(fetchPictureTypes)

	const getPictureTypeData = async () => {
		const picturesTypes:PictureTypeResponse = await fetch(`/api/master/picture-type`, {
			method: "GET",
			cache: "no-store"
		}).then(response => {
			return response.json();
		})
		setPictureTypes(picturesTypes.data)
	}

	const createNewType = () => {
		setEditFlag(() => true)
		const newType =  {id:0, type:"", fgDelete:false}
		setType(() => newType);
	}

	const edit = (selectType: PictureType) => {
		setEditFlag(()=> true)
		setType(()=>selectType)
	}

	const cancel = () => {
		setEditFlag(() => false)
		const newType = { id: 0, type: "", fgDelete:false }
		setType(() => newType);
	}

	const save = async() => {
		await fetch("/api/master/picture-type", {
			method: "POST",
			body: JSON.stringify({
				id: type.id,
				type:type.type
			})
		}).catch((e) => alert(e))
	}

	const remove = async (selectType: PictureType) => {
		await fetch("/api/master/picture-type", {
			method: "DELETE",
			body: JSON.stringify({
				id: selectType.id,
				type:selectType.type
			})
		}).then((response) => {
			if (response.ok) { 
				getPictureTypeData()
				alert("削除しました");
			} else {
				alert(response.statusText);
			}
		}
		).catch((e) => alert(e))
	}


	return (
		<div className="w-1/3">
			<button type="button" className={`${editFlag ? "hidden" : "block"}`} onClick={createNewType}>新規</button>
			<form className={`${editFlag ? "block" : "hidden"}`}>
				<label>画像種別名</label>
				<input className="border-2 rounded border-slate-300" value={type.type} onChange={(e) => setType({ ...type, type: e.target.value })}></input>
				<button className="m-4" type="button" onClick={cancel}>cancel</button>
				<button className="m-4" onClick={save}>save</button>
			</form>
			<div>
				<ul className="list-none p-0">
					{pictureTypes && pictureTypes.map((item, index) => (
						<li className="bg-gray-100 p-4 my-2 rounded-md flex justify-between items-center" key={index}>
							<span>{item.id}</span>
							<span>{item.type}</span>
							<div>
								{item.fgDelete ? <span className="text-red-700">削除済み</span> : <button type="button" className="mx-2 border border-red-700 text-red-700" onClick={() => remove(item)}>delete</button>}
								<button type="button" className="mx-2" onClick={() => edit(item)}>edit</button>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default DataTable