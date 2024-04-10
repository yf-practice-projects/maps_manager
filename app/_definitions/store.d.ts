
import { z } from 'zod';
import { StoreFormSchema, PictureFormSchema } from "@/app/_definitions/schema";

type Store = {
	id: number
	name: string
	type: string
	x: number
	y: number
	address?:     string|null
  googleMap?:   string|null
  opening?:     string|null
  holiday?:     string|null
}

type StoreResponse = {
  data: Store[];
}

type Picture = {
	id: number
	name: string
	storeId: number
	storeName: string
	typeId: number
	typeName:string
}

type PictureResponse = {
  data: Picture[];
}

type PictureType = {
	id: number
	type: string
	fgDelete: boolean
}
type PictureTypeResponse = {
  data: PictureType[];
}


type StoreForm = z.infer<typeof StoreFormSchema>;

type PictureForm = z.infer<typeof PictureFormSchema>;
