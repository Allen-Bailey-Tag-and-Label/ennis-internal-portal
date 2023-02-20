import { fail } from '@sveltejs/kit';
import crypto from 'crypto-js';
import * as db from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const { currentPassword, password, confirmPassword, username } = Object.fromEntries(
      await request.formData()
    );

    // check if password and confirmPassword do not match
    if (password !== confirmPassword)
      return fail(401, { error: 'Password and confirm password do not match.' });

    // find user in db
    const user = await db.findOne({ collection: 'users', query: { username } });

    // hash currentPassword
    const currentPasswordHash = JSON.stringify(crypto.SHA256(currentPassword).words);

    // check if currentPassword does not match
    if (currentPasswordHash !== user.password)
      return fail(401, { error: 'Current password does not match.' });

    // hash new password
    const hash = JSON.stringify(crypto.SHA256(password).words);

    // update user in db
    await db.findOneAndUpdate({
      collection: 'users',
      query: { username },
      update: { $set: { password: hash } }
    });

    return { success: true };
  }
};
