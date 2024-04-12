"use client"

import { PictureFormSchema } from "@/app/_definitions/schema";
import { Picture, PictureForm, PictureResponse, PictureType, Store } from "@/app/_definitions/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { editFlagState, picturesState } from "@/app/_atoms/pictureState";

interface props {
	fetchStores: Store[]
	fetchPictureTypes:PictureType[]
}

const EditForm = ({ fetchStores, fetchPictureTypes }: props) => {
	// const { register, handleSubmit, reset, formState: { errors } } = useForm<PictureForm>({ resolver: zodResolver(PictureFormSchema) });
	const { register, handleSubmit, reset, formState: { errors } } = useFormContext<PictureForm>()

	const [editFlag, setEditFlag] = useRecoilState(editFlagState)
	const [newFlag, setNewFlag] = useState<boolean>(false)
	const fileInputRef = useRef<HTMLInputElement>(null);
	
	const setPicture = useSetRecoilState(picturesState)

	const createNewPicture = () => {
		reset({ id: 0, name: "",images:undefined, storeId: 0, typeId: 0 })
		setNewFlag(()=> true)
		setEditFlag(()=> true)
	}

	const getPictureData = async(storeId:number) =>{ 
		const pictures:PictureResponse = await fetch(`/api/master/picture/${storeId}`, {
			method: "GET",
			cache: "no-store"
		}).then(response => {
			return response.json();
		})
		setPicture(pictures.data)
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
			getPictureData(data.storeId)
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
		<div className="w-3/4">
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
		</div>
	)
}

export default EditForm