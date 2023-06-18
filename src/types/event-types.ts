import { isoStringRegex, yyyymmddRegex } from "@/regexes/regexes";

import { O } from "ts-toolbelt";
import { calendar_v3 } from "googleapis";
import { z } from "zod";

export const dateString = z.string().regex(yyyymmddRegex);
export const dateTimeString = z.string()

export const dateField = z.object({ date: z.string().regex(yyyymmddRegex) })
export const dateTimeField = z.object({ dateTime: z.string() })

const stringSchemaCoercedFromUndefinedOrNull = z
	.union([z.undefined(), z.null(), z.string()])
	.transform((val) => {
		return val === undefined || val === null ? "" : val;
	})
	.pipe(z.string());



export const baseEventSchema = z.object({
	id: z.string(),
	summary: z.string().default(""),
	description: stringSchemaCoercedFromUndefinedOrNull, // kept as example. this is not necessary. z.string().default("") is enough. there is no null in google event data.
});

// dates event schema
export const preDateEventSchema = baseEventSchema.extend({
	start: dateField,
	end: dateField
});

export const dateEventSchema = preDateEventSchema.extend({ // adds the discriminant field to later make discriminated union
	dateType: z.literal("date").default("date"),
	start: dateString,
	end: dateString,
});

// datetime event schema
export const preDateTimeEventSchema = baseEventSchema.extend({ //TODO: add timeZone field to datetime
	start: dateTimeField,
	end: dateTimeField
});

export const dateTimeEventSchema = preDateTimeEventSchema.extend({
	dateType: z.literal("dateTime").default("dateTime"),
	start: dateTimeString,
	end: dateTimeString,
});

export const preCalendarEventSchema = z.union([
	preDateEventSchema,
	preDateTimeEventSchema,
]);

export const calendarEventSchema = z.discriminatedUnion("dateType", [
	dateEventSchema,
	dateTimeEventSchema,
]);

export type IOutboundEventSchema = z.infer<typeof preCalendarEventSchema>;



// export type INextResponse<T> = {
// 	result: T;
// 	status: number;
// };

// export type ICalendarData = {
//     title: string;
//     date:string;
//     description?:string
// }

// export type IHasToken = {
//     accessToken:string
//     }

type IDate = { date: string };
type IDateTime = { dateTime: string };

type ICoreEventData = {
	summary: string;
	description: string;
};

export type IDateEventData = {
	start: IDate;
	end: IDate;
};
export type IDateTimeEventData = {
	start: IDateTime;
	end: IDateTime;
};

export type IEventData =
	| (ICoreEventData & IDateEventData)
	| (ICoreEventData & IDateTimeEventData);

export type ICalendarEvent<T extends IDateEventData | IDateTimeEventData> = {
	id: string;
	summary: string;
	description: string;
	start: T["start"];
	end: T["end"];
};

export type IDateCalendarEvent = ICalendarEvent<IDateEventData>;
export type IDateTimeCalendarEvent = ICalendarEvent<IDateTimeEventData>;


export function isDateTimeCalendarEvent(
	event: ICalendarEvent<any>
): event is IDateTimeCalendarEvent {
	return (
		(event.start as IDateTime).dateTime !== undefined &&
		(event.end as IDateTime).dateTime !== undefined
	);
}

export function isValidDateTimeISOString(date: string): boolean {
	return date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) !== null;
}

export function isValidDate(date: string): boolean {
	return date.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
}



export type IOutboundEventContainer = {
	dateEvents: IOutboundEventSchema[],
	dateTimeEvents: IOutboundEventSchema[]
}


























// https://developers.google.com/calendar/api/v3/reference/events/list
export type GetListArgs = {
	

	eventTypes?: ("default" | "focusTime" | "outOfOffice")[]; // Event types to return. This parameter can be repeated multiple times to return events of different types. Currently, these are the only allowed values for this field: ["default", "focusTime", "outOfOffice"]【7†source】.
	iCalUID?: string; // Specifies an event ID in the iCalendar format to be provided in the response. Use this if you want to search for an event by its iCalendar ID【11†source】.
	maxAttendees?: number; // The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned【12†source】.
	maxResults?: number; // Maximum number of events returned on one result page. The page size can never be larger than 2500 events【13†source】.
	orderBy?: "startTime" | "updated"; // The order of the events returned in the result. Acceptable values are: "startTime" and "updated"【28†source】.
	pageToken?: string; // Token specifying which result page to return【14†source】.
	privateExtendedProperty?: string; // Extended properties constraint specified as propertyName=value. Matches only private properties【16†source】.
	q?: string; // Free text search terms to find events that match these terms in the following fields: summary, description, location, attendee's displayName, attendee's email【17†source】.
	sharedExtendedProperty?: string; // Extended properties constraint specified as propertyName=value. Matches only shared properties【18†source】.
	showDeleted?: boolean; // Whether to include deleted events (with status equals "cancelled") in the result【19†source】.
	showHiddenInvitations?: boolean; // Whether to include hidden invitations in the result【20†source】.
	singleEvents?: boolean; // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves【21†source】.
	syncToken?: string; // Token obtained from the nextSyncToken field returned on the last page of results from the previous list request【22†source】.
	timeMax?: string; // Upper bound (exclusive) for an event's start time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. If timeMin is set, timeMax must be greater than timeMin【23†source】.
	timeMin?: string; // Lower bound (exclusive) for an event's end time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. If timeMax```typescript
};

export type IGetResponse = {
    kind:             string;
    etag:             string;
    summary:          string;
    updated:          string;
    timeZone:         string;
    accessRole:       string;
    defaultReminders: { method: string; minutes: number }[];
    nextSyncToken:    string;
    items:            calendar_v3.Schema$Event[];
}

// type _unknown_item = {
//     kind:                   Kind;
//     etag:                   string;
//     id:                     string;
//     status:                 Status;
//     htmlLink:               string;
//     created:                Date;
//     updated:                Date;
//     summary:                string;
//     description?:           string;
//     creator:                Creator;
//     organizer:              Organizer;
//     start:                  End;
//     end:                    End;
//     recurringEventId?:      string;
//     originalStartTime?:     OriginalStartTime;
//     iCalUID:                string;
//     sequence:               number;
//     extendedProperties?:    ExtendedProperties;
//     reminders:              Reminders;
//     eventType:              EventType;
//     location?:              string;
//     attendees?:             Attendee[];
//     guestsCanInviteOthers?: boolean;
//     privateCopy?:           boolean;
// }

interface _EventResource {
	kind: string;
	etag: string;
	id: string;
	status: string;
	htmlLink: string;
	created: Date;
	updated: Date;
	summary: string;
	description: string;
	location: string;
	colorId: string;
	creator: {
		id: string;
		email: string;
		displayName: string;
		self: boolean;
	};
	organizer: {
		id: string;
		email: string;
		displayName: string;
		self: boolean;
	};
	start: {
		date: Date;
		dateTime: Date;
		timeZone: string;
	};
	end: {
		date: Date;
		dateTime: Date;
		timeZone: string;
	};
	endTimeUnspecified: boolean;
	recurrence: string[];
	recurringEventId: string;
	originalStartTime: {
		date: Date;
		dateTime: Date;
		timeZone: string;
	};
	transparency: string;
	visibility: string;
	iCalUID: string;
	sequence: number;
	attendees: {
		id: string;
		email: string;
		displayName: string;
		organizer: boolean;
		self: boolean;
		resource: boolean;
		optional: boolean;
		responseStatus: string;
		comment: string;
		additionalGuests: number;
	}[];
	attendeesOmitted: boolean;
	extendedProperties: {
		private: {
			[key: string]: string;
		};
		shared: {
			[key: string]: string;
		};
	};
	hangoutLink: string;
	conferenceData: {
		createRequest: {
			requestId: string;
			conferenceSolutionKey: {
				type: string;
			};
			status: {
				statusCode: string;
			};
		};
		entryPoints: {
			entryPointType: string;
			uri: string;
			label: string;
			pin: string;
			accessCode: string;
			meetingCode: string;
			passcode: string;
			password: string;
		}[];
		conferenceSolution: {
			key: {
				type: string;
			};
			name: string;
			iconUri: string;
		};
		conferenceId: string;
		signature: string;
		notes: string;
	};
	gadget: {
		type: string;
		title: string;
		link: string;
		iconLink: string;
		width: number;
		height: number;
		display: string;
		preferences: {
			[key: string]: string;
		};
	};
	anyoneCanAddSelf: boolean;
	guestsCanInviteOthers: boolean;
	guestsCanModify: boolean;
	guestsCanSeeOtherGuests: boolean;
	privateCopy: boolean;
	locked: boolean;
	reminders: {
		useDefault: boolean;
		overrides: {
			method: string;
			minutes: number;
		}[];
	};
	source: {
		url: string;
		title: string;
	};
	workingLocationProperties: {
		homeOffice: any;
		customLocation: {
			label: string;
		};
		officeLocation: {
			buildingId: string;
			floorId: string;
			floorSectionId: string;
			deskId: string;
			label: string;
		};
	};
	attachments: {
		fileUrl: string;
		title: string;
		mimeType: string;
		iconLink: string;
		fileId: string;
	}[];
	eventType: string;
}

type FieldConstraints = Pick<
	calendar_v3.Schema$Event,
	| "kind"
	| "description"
	| "created"
	| "end"
	| "summary"
	| "updated"
	| "location"
	| "start"
	| "status"
	| "colorId"
>;

interface _WritableEventProps {
	anyoneCanAddSelf: boolean;
	attachments: {
		fileUrl: string;
	}[];
	attendeesOmitted: boolean;
	attendees: {
		additionalGuests: number;
		comment: string;
		displayName: string;
		email: string;
		optional: boolean;
		resource: boolean;
		responseStatus: string;
	}[];
	colorId: string;
	conferenceData: any; // You might want to create a specific type for this
	description: string;
	end: {
		date: string;
		dateTime: string;
		timeZone: string;
	};
	extendedProperties: {
		private: { [key: string]: string };
		shared: { [key: string]: string };
	};
	gadget: {
		display: string;
		height: number;
		iconLink: string;
		link: string;
		preferences: { [key: string]: string };
		title: string;
		type: string;
		width: number;
	};
	guestsCanInviteOthers: boolean;
	guestsCanModify: boolean;
	guestsCanSeeOtherGuests: boolean;
	id: string;
	location: string;
	organizer: {
		displayName: string;
		email: string;
	};
	originalStartTime: {
		date: string;
		dateTime: string;
		timeZone: string;
	};
	recurrence: string[];
	reminders: {
		overrides: {
			method: string;
			minutes: number;
		}[];
		useDefault: boolean;
	};
	sequence: number;
	source: {
		title: string;
		url: string;
	};
	start: {
		date: string;
		dateTime: string;
		timeZone: string;
	};
	status: string;
	summary: string;
	transparency: string;
	visibility: string;
}


// TODO: distribute type over original valid patch props such that any event with date does not have datetime and vice versa

// type DateEventProps = {start: {date: string}, end: {date: string}}
// type DateTimeEventProps = {start: {dateTime: string, timeZone?:string}, end: {dateTime: string, timeZone?:string}}
// type ValidDateEvent<T> = T extends DateEventProps ? T : never
// type ValidDateTimeEvent<T> = T extends DateTimeEventProps ? T : never
// type ValidDateOrDateTimeEvent<T> = T extends DateEventProps ? T : T extends DateTimeEventProps ? T : never


export type IValidPatchProps = Omit<
	O.Partial<_WritableEventProps, "deep">,
	"id"
>;


export type IGetEventsArgs = {
	startDate?: Date;
	endDate?: Date;
	maxResults?: number;
	calendarId?: string;
  };