import { z } from "zod";

export const StoreFormSchema = z.object({
	name: z.string().min(1, "no name"),
  type: z.string().min(1, "no type"),
	x: z.preprocess((value) => {
			if (!value) {
				return undefined;
			}
			return Number(value);
		}, z.number().int().optional()),
	y: z.preprocess((value) => {
			if (!value) {
				return undefined;
			}
			return Number(value);
		}, z.number().int().optional()),
	address: z.string().nullish(),
	googleMap: z.string().nullish(),
	opening: z.string().nullish(),
	holiday: z.string().nullish(),
});

export const PictureFormSchema = z.object({
	id: z.number(),
	images: z.custom<FileList>(),
	name: z.string().min(1, "no name"),
  storeId: z.coerce.number().min(1, "no type"),
	typeId: z.coerce.number().min(1, "no type")
});
