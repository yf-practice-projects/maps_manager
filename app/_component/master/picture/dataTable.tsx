"use client"

import { Picture, PictureForm } from "@/app/_definitions/store";
import { useEffect } from "react";
import { editFlagState, picturesState } from "@/app/_atoms/pictureState";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useFormContext } from "react-hook-form";

interface props {
	fetchPictures : Picture[]
}

const DataTable = ({ fetchPictures }: props) => {

	const [pictures, setPictures] = useRecoilState(picturesState)
	
	const setEditFlag = useSetRecoilState(editFlagState)

	const { reset } = useFormContext<PictureForm>()
	
	useEffect(() => {
		setPictures(fetchPictures)
	},[])


	const edit = (selectPicture: Picture) => {
		setEditFlag(()=> true)
		reset({id:selectPicture.id,name:selectPicture.name, storeId:selectPicture.storeId, typeId:selectPicture.typeId})
	}

	const remove = async (selectPicture:Picture) => {
		await fetch(`/api/master/picture/${selectPicture.id}`, {
			method:"DELETE"
		}).then(() => {
			setPictures((prevData) => prevData.filter(item => item.id !== selectPicture.id));
			alert("削除しました")
		}).catch((e) => {
			alert(e)
		})
	}
 
	return (
		<div className="">
			<ul className="list-none p-0">
				{pictures.map((item, index) => (
					<li className="bg-gray-100 p-4 my-2 rounded-md flex justify-between items-center" key={index}>
						<span>{item.id}</span>
						<span>{item.name}</span>
						<span>{item.storeId}:{ item.storeName }</span>
						<span>{item.typeId}:{ item.typeName }</span>
						<div>
							<button type="button" className="mx-2 border border-red-700 text-red-700" onClick={() => remove(item)}>delete</button>
							<button type="button" className="mx-2" onClick={() => edit(item)}>edit</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default DataTable