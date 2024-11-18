export interface IMutationOptionsRequest {
	onSuccess: (data: any) => void;
	onError: (error: any) => void;
	onSettled: () => void;
}
