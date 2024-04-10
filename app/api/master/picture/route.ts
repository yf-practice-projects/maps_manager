import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Picture } from "@/app/_definitions/store";
import { stat, mkdir, writeFile } from "fs/promises";

export async function GET(request: NextRequest) {

	const datas = await prisma.picture.findMany({
		include: {
			Store: {
				select: {
					id: true,
					name: true
				}
			},
			Type: {
				select: {
					id: true,
					type:true
				}
			}
		}
	});

	const pictures: Picture[] = datas.map((data) => (
		{id:data.id, name:data.name, storeId:data.storeId, storeName:data.Store.name, typeId:data.typeId, typeName:data.Type.type}
	))

	return NextResponse.json({data:pictures},{status:200});
}

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(request: NextRequest) {
	
	const formData = await request.formData()
	console.log(formData)
	console.log(formData.get("images"))
	const store = await prisma.store.findFirst({
		select: {
			name:true
		},
		where: {
			id:Number(formData.get("storeId"))
		}
	})
	const file = formData.get("images") as Blob | null

	if (file) {
		try {
			const buffer = Buffer.from(await file.arrayBuffer());
			await writeFile(`${process.env.PIC_BASE_DIR}/${store?.name}/${formData.get("name")}`, buffer);	
		} catch (e) {
			NextResponse.json(e,{status:400})
		}
	}
	const id = Number(formData.get("id"))
	const name = String(formData.get("name"))
	const storeId = Number(formData.get("storeId"))
	const typeId = Number(formData.get("typeId"))

	if (id === 0){
		const newPicture = await prisma.picture.create({
			data: {
				name: name,
				storeId: storeId,
				typeId: typeId
			}
		})
		console.log('Inserted picture:', newPicture);
	} else {
		const updatePicture = await prisma.picture.update({
			data: {
				name: name,
				storeId: storeId,
				typeId: typeId
			},
			where: {
				id:id
			}
		})
		console.log('Updated picture:', updatePicture);
	}

	// const json = await request.json();
	// if (json.id === 0) {
	// 	const newPicture = await prisma.picture.create({
	// 		data: {
	// 			name: json.name,
	// 			storeId: json.storeId,
	// 			typeId: json.typeId
	// 		}
	// 	})
	// 	console.log('Inserted picture:', newPicture);
	// } else {
	// 	const updatePicture = await prisma.picture.update({
	// 		data: {
	// 			name: json.name,
	// 			storeId: json.storeId,
	// 			typeId: json.typeId
	// 		},
	// 		where: {
	// 			id:json.id
	// 		}
	// 	})
	// 	console.log('Updated picture:', updatePicture);
	
	return NextResponse.json("post",{status:200})
}