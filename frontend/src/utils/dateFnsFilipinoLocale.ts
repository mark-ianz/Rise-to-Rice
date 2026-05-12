// src/utils/dateFnsFilipinoLocale.ts
import { enUS } from 'date-fns/locale';

export const filipinoLocale = {
  ...enUS,
  formatDistance: (token: string, count: number, _options?: { addSuffix?: boolean, comparison?: number }) => {
    const formatDistanceLocale: Record<string, string> = {
      lessThanXSeconds: "ilang segundo na ang lumipas",
      xSeconds: "{{count}} segundo na ang lumipas",
      halfAMinute: "kalahating minuto na ang lumipas",
      lessThanXMinutes: "wala pa isang minuto ang lumipas",
      xMinutes: "{{count}} minuto na ang lumipas",
      aboutXHours: "mga {{count}} oras na ang lumipas",
      xHours: "{{count}} oras na ang lumipas",
      xDays: "{{count}} araw na ang lumipas",
      aboutXWeeks: "mga {{count}} linggo na ang lumipas",
      xWeeks: "{{count}} linggo na ang lumipas",
      aboutXMonths: "mga {{count}} buwan na ang lumipas",
      xMonths: "{{count}} buwan na ang lumipas",
      aboutXYears: "mga {{count}} taon na ang lumipas",
      xYears: "{{count}} taon na ang lumipas",
      overXYears: "mahigit {{count}} taon na ang lumipas",
      almostXYears: "halos {{count}} taon na ang lumipas",
    };

    let result = formatDistanceLocale[token] || "";
    result = result.replace("{{count}}", String(count));

    return result;
  }
};
