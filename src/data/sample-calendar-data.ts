import { ICalendarEvent } from "@/types/event-types";

const defaultData2: ICalendarEvent[] = [
    {
      id: "1",
      start: {dateTime: new Date("07-17-2023").toISOString()},
      end: {dateTime: new Date("07-18-2023").toISOString()},
      summary: "Event 1",
      description: "Description 1",
    },
    {
      id: "2",
      start: { dateTime: ("2022-01-03") },
      end: { dateTime: "2022-01-04" },
      summary: "Event 2",
      description: "Description 2",
    },
  ];
  

  export const defaultData: ICalendarEvent[] = [
    {
      id: "1",
      description: "Sunny day at the beach",
      summary: "A relaxing day at the beach under the sun.",
      start: { dateTime: new Date("2023-07-01T00:00:00.000Z").toISOString() },
      end: { dateTime: new Date("2023-07-02T00:00:00.000Z").toISOString() },
    },
    {
      id: "2",
      description: "Weekend hiking trip",
      summary: "An adventurous weekend in the mountains.",
      start: { dateTime: new Date("2023-07-03T00:00:00.000Z").toISOString() },
      end: { dateTime: new Date("2023-07-04T00:00:00.000Z").toISOString() },
    },
    {
      id: "3",
      description: "City exploration",
      summary: "Discovering the hidden gems of the city.",
      start: { date: new Date("2023-07-05").toISOString() },
      end: { date: new Date("2023-07-06").toISOString() },
    },
    {
      id: "4",
      description: "Cooking class",
      summary: "Learning new recipes and cooking techniques.",
      start: { date: new Date("2023-07-07").toISOString() },
      end: { date: new Date("2023-07-08").toISOString() },
    },
    {
      id: "5",
      description: "Art exhibition visit",
      summary: "Visiting a local art exhibition.",
      start: { date: new Date("2023-07-09").toISOString() },
      end: { date: new Date("2023-07-10").toISOString() },
    },
    {
      id: "6",
      description: "Family picnic",
      summary: "A fun picnic at the park with family.",
      start: { date: new Date("2023-07-11").toISOString() },
      end: { date: new Date("2023-07-12").toISOString() },
    },
    {
      id: "7",
      description: "Book club meeting",
      summary: "Discussing this month's book with the club.",
      start: { date: new Date("2023-07-13").toISOString() },
      end: { date: new Date("2023-07-14").toISOString() },
    },
    {
      id: "8",
      description: "Yoga retreat",
      summary: "A weekend of relaxation and yoga.",
      start: { date: new Date("2023-07-15").toISOString() },
      end: { date: new Date("2023-07-16").toISOString() },
    },
    {
      id: "9",
      description: "Music concert",
      summary: "Attending a live music concert in the city.",
      start: { date: new Date("2023-07-17").toISOString() },
      end: { date: new Date("2023-07-18").toISOString() },
    },
    {
      id: "10",
      description: "Home renovation",
      summary: "Weekend dedicated to home improvement.",
      start: { date: new Date("2023-07-19").toISOString() },
      end: { date: new Date("2023-07-20").toISOString() },
    },
  ];