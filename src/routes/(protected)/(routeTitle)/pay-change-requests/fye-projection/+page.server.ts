import * as db from '$db';
import { currency } from '$lib/format';

export const load = async ({ locals }: { locals: { user: { _id: string } } }) => {
  // get all pcrs and users
  const [pcrs, users] = await Promise.all(
    ['pay-change-requests', 'users'].map(
      async (collection) => await db.find({ collection, query: {} })
    )
  );

  // get all employess that report to user
  const employees = users
    .filter(({ _supervisorId }: { _supervisorId: string }) => _supervisorId === locals.user._id)
    .map((user: { [key: string]: any }) => {
      // find most recent PCR
      const [pcr] = pcrs
        .sort((a: { date: string }, b: { date: string }) =>
          a.date < b.date ? 1 : a.date > b.date ? -1 : 0
        )
        .filter(({ _userId }: { _userId: string }) => _userId === user._id);

      return { absences: 0, efficiency: '100%', rate: currency(pcr?.after || 0), ...user };
    })
    .sort(
      (a: { firstName: string; lastName: string }, b: { firstName: string; lastName: string }) =>
        a.firstName < b.firstName
          ? -1
          : a.firstName > b.firstName
          ? 1
          : a.lastName < b.lastName
          ? -1
          : a.lastName > b.lastName
          ? 1
          : 0
    );

  return {
    employees
  };
};
