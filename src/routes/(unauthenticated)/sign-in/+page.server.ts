import { supabase } from '$db';

export const actions = {
	async default({}) {
		console.log(supabase);
		return {};
	}
};
