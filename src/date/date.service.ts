import { Injectable } from '@nestjs/common';
import { isAfter, add, isBefore } from 'date-fns';

interface Duration {
  days?: number;
  hours?: number;
  minutes?: number;
  months?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}

interface Actions {
  date: Date;
  add: (duration: Duration) => Actions;
  isAfter(date: Date): boolean;
  isBefore(date: Date): boolean;
}

@Injectable()
export class DateService {
  date(date: Date): Actions {
    return this.generateDate(date);
  }
  today(): Actions {
    const date = new Date();
    return this.generateDate(date);
  }

  yesterday(): Actions {
    const date = add(new Date(), { days: -1 });
    return this.generateDate(date);
  }

  tomorrow(): Actions {
    const date = add(new Date(), { days: 1 });
    return this.generateDate(date);
  }

  private generateDate(date: Date): Actions {
    return {
      date,
      add: (duration: Duration) => {
        const newDate = add(date, duration);
        return this.generateDate(newDate);
      },
      isAfter(dateToCompare: Date): boolean {
        return isAfter(date, dateToCompare);
      },
      isBefore(dateToCompare: Date): boolean {
        return isBefore(date, dateToCompare);
      },
    };
  }
}
