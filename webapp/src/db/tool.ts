'use strict';

import * as db from './index';
import { ObjectId } from 'mongodb';
import toObjectId from '../lib/misc/toobjectid';
import { ToolType } from '../lib/struct/tools';

export type FunctionProperty = {
	type: string; // should probably be string | number | whatever
	description: string;
};

export type Tool = {
	_id?: ObjectId;
	orgId?: ObjectId;
	teamId?: ObjectId;
    name: string;
    functionName: string; //snake_case_name
 	type: ToolType;
	data?: {
		description?: string;
		parameters?: {
			//type: string;
			properties: Record<string,FunctionProperty>;
			required?: string[];
		};
		code?: string;
	},
	credentialId?: ObjectId; //links to a credential 
};

export function ToolCollection() {
	return db.db().collection('tools');
}

export function getToolById(teamId: db.IdOrStr, toolId: db.IdOrStr): Promise<Tool> {
	return ToolCollection().findOne({
		_id: toObjectId(toolId),
		teamId: toObjectId(teamId),
	});
}

export function getToolsById(teamId: db.IdOrStr, toolIds: db.IdOrStr[]): Promise<Tool[]> {
	return ToolCollection().find({
		_id: {
			$in: toolIds.map(toObjectId),
		},
		teamId: toObjectId(teamId),
	}).toArray();
}

export function getToolsByTeam(teamId: db.IdOrStr): Promise<Tool[]> {
	return ToolCollection().find({
		teamId: toObjectId(teamId),
	}).toArray();
}

export async function addTool(tool: Tool): Promise<db.InsertResult> {
	return ToolCollection().insertOne(tool);
}

export function deleteToolById(teamId: db.IdOrStr, toolId: db.IdOrStr): Promise<any> {
	return ToolCollection().deleteOne({
		_id: toObjectId(toolId),
		teamId: toObjectId(teamId),
	});
}