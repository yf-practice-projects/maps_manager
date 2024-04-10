"use client"

import { PictureFormSchema } from "@/app/_definitions/schema";
import { Picture, PictureForm, PictureResponse, PictureType, Store } from "@/app/_definitions/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Folder from "./folder";

interface props {
	fetchPictures: Picture[]
	fetchStores: Store[]
	fetchPictureTypes:PictureType[]
	
	
}

const DataTable = ({ fetchPictures, fetchStores, fetchPictureTypes }: props) => {
	const { register, handleSubmit, reset, formState: { errors } } = useForm<PictureForm>({resolver: zodResolver(PictureFormSchema) });

	const [pictures, setPictures] = useState<Picture[]>(fetchPictures)
	const [editFlag, setEditFlag] = useState<boolean>(false)
	const [newFlag, setNewFlag] = useState<boolean>(false)
	const fileInputRef = useRef<HTMLInputElement>(null);
	
	const createNewPicture = () => {
		reset({ id: 0, name: "",images:undefined, storeId: 0, typeId: 0 })
		setNewFlag(()=> true)
		setEditFlag(()=> true)
	}
	
	const edit = (selectPicture: Picture) => {
		setEditFlag(()=> true)
		reset({id:selectPicture.id,name:selectPicture.name, storeId:selectPicture.storeId, typeId:selectPicture.typeId})
	}

	const remove = async (selectPicture:Picture) => {
		await fetch(`/api/master/picture/${selectPicture.id}`, {
			method:"DELETE"
		}).then(() => {
			setPictures((prevData) => prevData.filter(item => item.id !== selectPicture.id));
		}).catch((e) => {
			alert(e)
		})
	}

	const getPictureData = async() =>{ 
		const pictures:PictureResponse = await fetch(`/api/master/picture`, {
			method: "GET",
			cache: "no-store"
		}).then(response => {
			return response.json();
		})
		setPictures(pictures.data)
	}

	const submit = async(data:PictureForm) => {
		console.log(data)
		
		const formData = new FormData();
		formData.append("id", String(data.id));
		formData.append("name", String(data.name));
		if (data.images) {
			const file = (data.images as FileList)[0]
			formData.append("images", file);
		}
		formData.append("storeId", String(data.storeId));
		formData.append("typeId", String(data.typeId));
		await fetch("/api/master/picture", {
			method:"POST",
			body:formData
		}).catch((e) => {
			alert(e)
		}).finally(() => {
			reset({ name: "" ,storeId: 0, typeId: 0 });
			getPictureData()
			setEditFlag(() => false);
		})
		
	}

	const cancel = () => {
		setEditFlag(() => false)
		setNewFlag(()=> false)
	}

	const changeFileName = (e:React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const name = (files as FileList)[0].name
			console.log(name)
			reset({id:0, name: name, images: files })
		}
	}
 
	return (
		<div className="w-2/3">
			<button type="button" className={`${editFlag ? "hidden" : "block"} mt-4`} onClick={createNewPicture}>新規</button>
			<form className={`${editFlag ? "block" : "hidden"} `} onSubmit={handleSubmit(submit)}>
				<span>画像名：</span>
				<input disabled className="border-2 rounded border-slate-300" {...register("name")}></input>
				<label>{ errors.name?.message }</label>
				{newFlag
					? <>
							<input
							type="file"
							accept=".png, .jpg"
							multiple
							{...register("images")}
							className="hidden"
							onChange={(e) => changeFileName(e)}
							ref={ fileInputRef }
						/>
						<label>{ errors.images?.message }</label>
						<button className="border mx-4" type="button" onClick={() => fileInputRef.current!.click()}>ファイル選択</button>
						</>

					:<></>
				}
				<span>店舗：</span>
				<select disabled={!newFlag} className="border-2 rounded border-slate-300" {...register("storeId")}>
						<option value=""></option>
						{fetchStores.map((store) => (
							<option key={store.id} value={store.id}>{store.name}</option>
						))}
				</select>
				<label>{ errors.storeId?.message }</label>
				<span>画像種別：</span>
				<select className="border-2 rounded border-slate-300" {...register("typeId")}>
						<option value=""></option>
						{fetchPictureTypes.map((type) => (
							<option key={type.id} value={type.id}>{type.type}</option>
						))}
				</select>
				<label>{ errors.typeId?.message }</label>
				<button className="m-4" type="button" onClick={cancel}>cancel</button>
				<button className="m-4" type="submit">save</button>
			</form>
			<div>
				{fetchStores.map((store, index) => (
					<Folder key={ index } name={ store.name} />
				))}
      
    	</div>
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