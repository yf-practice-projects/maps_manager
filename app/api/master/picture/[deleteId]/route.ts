import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from 'fs';

export async function DELETE(request: NextRequest, { params }: {params:{ deleteId: number }}) {
	console.log(params.deleteId)
	const deletePicture = await prisma.picture.delete({
		where: {
			id:Number(params.deleteId)
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