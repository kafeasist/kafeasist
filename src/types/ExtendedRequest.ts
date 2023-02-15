import { Request } from 'express';

export type ExtendedRequest<ReqBody = {}, ReqQuery = {}> = Request<
	{},
	{},
	ReqBody,
	ReqQuery
>;

export type IDRequest = ExtendedRequest<{}, { id: any }>;
