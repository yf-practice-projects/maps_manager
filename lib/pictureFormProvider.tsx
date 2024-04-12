"use client"

import { PictureFormSchema } from "@/app/_definitions/schema";
import { PictureForm } from "@/app/_definitions/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

export default function PictureFormProvider({ children }: { children: React.ReactNode }) {
	const methods = useForm<PictureForm>({ resolver: zodResolver(PictureFormSchema) });
	return (
		<FormProvider {...methods}>
			{ children }
		</FormProvider>
	)
	
}