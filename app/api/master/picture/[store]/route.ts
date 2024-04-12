import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from 'fs';
import { Picture } from "@/app/_definitions/store";

export async function GET(request: NextRequest, { params }: { params: { store: number | string } }) {
	let datas;
	if (typeof params.store === "string") {
		datas = await prisma.picture.findMany({
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
			},
			where: {
				Store: {
					name:params.store
				}
			}
		});
	} else {
		datas = await prisma.picture.findMany({
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
			},
			where: {
				storeId:params.store
			}
		});
	}
	

	const pictures: Picture[] = datas.map((data) => (
		{id:data.id, name:data.name, storeId:data.storeId, storeName:data.Store.name, typeId:data.typeId, typeName:data.Type.type}
	))

	return NextResponse.json({data:pictures},{status:200});
}

export async function DELETE(request: NextRequest, { params }: {params:{ id: number }}) {
	console.log(params.id)
	const deletePicture = await prisma.picture.delete({
		where: {
			id:Number(params.id)
		}
	})

	if (deletePicture) {
		const store = await prisma.store.findFirst({
			select: {
				name:true
			},
			where: {
				id:Number(deletePicture.storeId)
			}
		})
		const filePath = `${process.env.PIC_BASE_DIR}/${store?.name}/${deletePicture.name}`;
		try {
			await fs.unlink(filePath);	
		} catch(e) {
			console.error("Failed to delete picture",e)
		}
		
	}

	console.log("Deleted picture", deletePicture)
	return NextResponse.json("delete success",{status:200})
}