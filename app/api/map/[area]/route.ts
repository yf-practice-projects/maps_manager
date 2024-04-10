import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir } from "fs/promises";

export async function GET(request: NextRequest, { params }: { params: { area: string } }) {
	let stores = []
	if (params.area) {
		stores = await prisma.store.findMany({
			where: {
				area:params.area
			}
		})
	} else {
		stores = await prisma.store.findMany()
	}
	return NextResponse.json({ data: stores }, {status:200})
}

export async function POST(request: NextRequest, { params }: { params: { area:string }}) { 
	const json = await request.json()
	console.log(json)
	const existCnt = await prisma.store.count({
		where: {
			name: json.name,
			area: params.area
		}
	})
	if (existCnt > 0) {
		await prisma.store.update({
			data: {
				type: json.type,
				x: json.x,
				y: json.y,
				address: json.address,
				googleMap: json.googleMap,
				holiday: json.holiday,
				opening: json.opening
			},
			where: {
				name:json.name
			}
		})
	} else {
		await prisma.store.create({
			data: {
				name: json.name,
				area: params.area,
				type: json.type,
				x: json.x,
				y: json.y,
				address: json.address,
				googleMap: json.googleMap,
				holiday: json.holiday,
				opening: json.opening
	
			}
		})
		const dirPath = path.join(process.env.PIC_BASE_DIR!, json.name);
		try {
			await mkdir(dirPath, { recursive: true });
		} catch (error) {
			console.error(error);
			NextResponse.json("Failed to create file",{status:500})
		}
	}


	return NextResponse.json({})
}
