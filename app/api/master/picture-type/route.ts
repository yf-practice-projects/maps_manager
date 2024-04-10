import { NextRequest, NextResponse } from "next/server";
import prisma, { PictureType } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const {searchParams} = new URL(request.url);
	console.log(searchParams)
	console.log(searchParams.get("fgDelete"))
	let pictureTypes: PictureType[]
	if (searchParams.get("fgDelete")) {
		pictureTypes = await prisma.pictureType.findMany({
			where: {
				fgDelete:false
			}
		});
	} else {
		pictureTypes = await prisma.pictureType.findMany();
	}
	
	
	return NextResponse.json({data:pictureTypes},{status:200});
}

export async function POST(request: NextRequest) {
	const json:PictureType = await request.json();
	console.log(JSON.stringify(json))
	try {
		if (json.id === 0) {
			const newPictureType = await prisma.pictureType.create({
				data: {
					type:json.type
				}
			});
			console.log('Inserted pictureType:', newPictureType);
		} else {
			const updatePictureType = await prisma.pictureType.update({
				data: {
					type:json.type
				},
				where: {
					id:json.id
				}
			})
			console.log('Updated pictureType:', updatePictureType);
		}
	} catch(error) {
		console.log(error)
		return NextResponse.json({error:error},{status: 400})
	}

	return NextResponse.json({status: 200})
}

export async function DELETE(request: NextRequest) {
	const json: PictureType = await request.json();
	console.log(JSON.stringify(json))
	try {
		const deletePictureType = await prisma.pictureType.update({
			where: {
				id: json.id
			},
			data: {
				fgDelete:true
			}
		})
		console.log('Deleted pictureType:', deletePictureType);
		return NextResponse.json("delete success", {status:200})
	} catch(error) {
		console.log(error)
		return NextResponse.json({error:error},{status: 400})
	}
}