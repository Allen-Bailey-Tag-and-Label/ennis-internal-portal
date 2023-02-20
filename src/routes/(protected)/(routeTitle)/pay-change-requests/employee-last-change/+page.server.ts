import { ObjectId } from 'mongodb';
import * as db from '$db';
import { date as dateFormat } from '$lib/format';

type Pcr = {
  userId: {
    $oid: string;
  };
  change: {
    date: number | Date;
  };
};

export const load = async () => {
  // get all pcrs and users
  const [pcrs, users] = await Promise.all(
    ['pay-change-requests', 'users'].map(
      async (collection) => await db.find({ collection, query: {} })
    )
  );

  // find the most recent pcrs
  const mostRecentPcrs = pcrs.reduce((array, pcr: Pcr) => {
    // find user
    const user = users.find((user) => user._id === pcr._userId);

    if (user === undefined) return array;

    // find existing employee in array
    let existingItemIndex = array.findIndex(
      (item) => item.firstName === user.firstName && item.lastName === user.lastName
    );

    // check if existing employee is not in array
    if (existingItemIndex === -1) {
      const item = {
        _userId: new ObjectId(0),
        after: 0,
        code: '',
        costCenter: '',
        date: dateFormat(new Date(0)),
        description: '',
        eeoClassification: '',
        ennisId: user.ennisId,
        exempt: '',
        explanation: '',
        firstName: user.firstName,
        hireDate: user.hireDate,
        lastName: user.lastName,
        jobCode: '',
        jobTitle: '',
        previous: 0,
        percent: 0,
        workCompClass: ''
      };

      array = [...array, item];

      existingItemIndex = array.length - 1;
    }

    // get existing employee item
    const existingItem = array[existingItemIndex];

    // check if the after date is newer
    if (pcr.date > existingItem.date) {
      array[existingItemIndex] = { ...existingItem, ...pcr };
    }

    return array;
  }, []);

  return {
    mostRecentPcrs
  };
};
