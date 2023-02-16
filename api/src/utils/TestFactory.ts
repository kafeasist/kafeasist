import 'reflect-metadata';
import 'source-map-support/register';
import 'module-alias/register';

import express from 'express';
import { DataSource } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import supertest from 'supertest';
import app from '../app';
import { orm } from '../config/typeorm.config';

export class TestFactory {
	private _app!: express.Application;
	private _connection!: DataSource;
	private _server!: HttpServer;

	public get app(): supertest.SuperTest<supertest.Test> {
		return supertest(this._app);
	}

	public get connection(): DataSource {
		return this._connection;
	}

	public get server(): HttpServer {
		return this._server;
	}

	public async init(): Promise<void> {
		this._connection = await orm.initialize();
		this._app = app;
		this._server = createServer(this._app).listen(4444);
	}

	public async close(): Promise<void> {
		this._server.close();
		this._connection.destroy();
	}
}
