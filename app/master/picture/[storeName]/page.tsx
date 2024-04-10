
export default function Page({ params }: { params: { storeName: string } }) {
	return (
		<div className="text-center">
			{ params.storeName }
		</div>
	)
}