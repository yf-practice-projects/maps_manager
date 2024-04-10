import { Store } from "@/app/_definitions/store";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const stores:Store[] = await prisma.store.findMany();
	return NextResponse.json({data:stores},{status:200});
}