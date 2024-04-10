"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store, StoreForm, StoreResponse } from "@/app/_definitions/store"
import { StoreFormSchema } from "@/app/_definitions/schema"

interface props {
	area: string
	fetchStores:Store[]
}


const types = [
	{ id: "cafe", label: "カフェ" },
	{ id: "sand", label: "サンド系" },
	{ id: "parfait", label: "パフェ" },
	{ id: "curry", label: "カレー" },
	{ id: "hamburger", label: "ハンバーガー" },
]

const ImageMap = ({ area, fetchStores }: props) => {
	const { register, handleSubmit, reset, formState: { errors } } = useForm<StoreForm>({ resolver: zodResolver(StoreFormSchema) });
	const [ stores, setStores] = useState<Store[]>(fetchStores)
	const [selectX, setSelectX] = useState<number>(0);
	const [selectY, setSelectY] = useState<number>(0);
	const imageRef = useRef<HTMLImageElement>(null);
	const [imgW, setImgW] = useState<number>(0)
	const [imgH, setImgH] = useState<number>(0)

	const [isNew,setIsNew] = useState<boolean>(true)
	useEffect(() => { 
		const imgElement = imageRef.current;
		if (imgElement) {
			const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setImgW(()=> width)
					setImgH(() => height)
        }
      });

      // 監視を開始
      resizeObserver.observe(imgElement);

      // コンポーネントのクリーンアップ時に監視を停止
      return () => {
        resizeObserver.unobserve(imgElement);
      };
		}
	}, [])
	
	// const handleClick = (e: any) => {
	// 	const imageRect = imageRef.current!.getBoundingClientRect();
	// 	// console.log(imageRect)
	// 	const x = e.clientX - imageRect.left; // カーソルの画像に対する相対X座標
	// 	console.log({"e.clientX":e.clientX,"imageRect.left":imageRect.left, "x":x, "renderWidth":imgW })
	// 	const y = e.clientY - imageRect.top;  // カーソルの画像に対する相対Y座標
	// 	console.log({"e.clientY":e.clientY,"imageRect.top":imageRect.top, "y":y, "renderHeight":imgW })

	// 	setSelectX(() => x)
	// 	setSelectY(() => y) 
	// 	console.log((selectX / 1030) * imgW)
	// 	console.log((selectY/1452) * imgH)
	// };

	const changeForm = (exist:boolean) => {
		if (exist) {
			setIsNew(false)
		} else {
			setIsNew(true)
		}
		setSelectX(() => 0)
		setSelectY(() => 0) 
		reset({name:"", type:"", x:0, y:0, address:"",googleMap:"", opening:"", holiday:""})
	}

	const selectStore = (event: React.ChangeEvent<HTMLSelectElement>) => {
		console.log((Number(event.target.value)))
		if (Number(event.target.value) >= 0) {
			const i = Number(event.target.value)
			reset({ name: stores[i].name, type: stores[i].type, x: stores[i].x, y: stores[i].y, address: stores[i].address, googleMap: stores[i].googleMap, opening: stores[i].opening, holiday: stores[i].holiday })
			setSelectX(() => stores[i].x)
			setSelectY(() => stores[i].y) 
		} else {
			reset({ name: "", type: "", x: 0, y: 0, address: "", googleMap: "", opening: "", holiday: "" })
			setSelectX(() => 0)
			setSelectY(() => 0) 
		}
		
	}
	
	const submit = async(storeForm:StoreForm) => {
		await fetch(`/api/map/${area}`, {
			method: "POST",
			body: JSON.stringify(storeForm)
		}).then(() => {
			alert("登録しました")
		})
		const stores:StoreResponse = await fetch(`/api/map/${area}`, {
			method: "GET",
			cache: "no-store"
		}).then(response => {
			return response.json();
		})
		setStores(stores.data)
		if (isNew) {
			reset({ name: "", type: "", x: 0, y: 0, address: "", googleMap: "", opening: "", holiday: "" })
			setSelectX(() => 0)
			setSelectY(() => 0) 
		}
	}


	return (
		<>
			<div className="flex flex-row object-center items-center container w-full h-full relative mx-auto justify-center">
				<div className="w-[610px] h-[90vh] relative">
					<Image ref={imageRef} fill quality={100} src={ "/tokyo/map.png" } alt="" priority />
					<Image src="/pin.png" alt="" className="absolute -translate-x-1/2 -translate-y-1/2"
						style={{  left: `${ (selectX / 1030) * imgW }px`, top: `${ (selectY/1452) * imgH }px` }}
						height={50} width={50} priority />
				</div>
				<div>
					<button className="w-1/2 border" onClick={()=>changeForm(false)}>新規</button>
					<button className="w-1/2 border" onClick={()=>changeForm(true)}>既存</button>
					<form onSubmit={ handleSubmit(submit)} className="flex flex-col w-[300px]">
						<label>店名 : </label>
						{isNew
							? <input {...register("name")} type="string"></input>
							: <>
								<input {...register("name")} hidden type="string"></input>
								<select defaultValue={-1} onChange={(e) => selectStore(e)}>
									<option value={-1}></option>
									{stores.map((item, index) => (
										<option key={item.id} value={index}>{item.name}</option>
									))}
								</select>
								</>
						}


						<label>type : </label>
						<select {...register("type")}>
							<option value=""></option>
							{types.map((item) => (
								<option key={item.id} value={item.id}>{item.label}</option>
							))}
						</select>
						<label>X : </label><input className="border" {...register("x")} type="number" value={selectX} onChange={(e)=> setSelectX(Number(e.target.value))}></input>
						<label>Y : </label><input className="border" {...register("y")} type="number" value={selectY} onChange={(e) => setSelectY(Number(e.target.value))}></input>
						<label>address : </label><input className="border" {...register("address")} type="string"></input>
						<label>googleMap : </label><input className="border" {...register("googleMap")} type="string"></input>
						<label>open : </label><input className="border" {...register("opening")} type="string"></input>
						<label>holiday : </label><input className="border" {...register("holiday")} type="string"></input>
						<button className="mt-8 border" type="submit">save</button>
					</form>
				</div>
			</div>
		</>
	)
}

export default ImageMap